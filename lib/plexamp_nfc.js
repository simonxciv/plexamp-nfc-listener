import nfcCard from 'nfccard-tool';
import { start_player, pause_player } from './process_plexamp_command.js';
import fs from 'fs';

let pauseOnCardRemoval = false;

const plexamp_nfc = (nfc) => {
	console.log(
		'Control your Plexamp players with NFC cards. Searching for PCSC-compatible NFC reader...'
	);

	nfc.on('reader', (reader) => {
		console.log(`${reader.reader.name} device attached`);

		reader.on('card', async (card) => {
			console.log(`${reader.reader.name} detected ${card.type} with UID ${card.uid}`);

			try {
				/**
				 * 1 - READ HEADER
				 *  Read from block 0 to block 4 (20 bytes length) in order to parse tag information
				 *  Block 4 is the first data block -- should have the TLV info
				 */
				const cardHeader = await reader.read(0, 20);

				nfcCard.parseInfo(cardHeader);

				/**
				 *  2 - Read the NDEF message and parse it if it's supposed there is one
				 *  The NDEF message must begin in block 4 -- no locked bits, etc.
				 *  Make sure cards are initialized before writing.
				 */
				if (
					nfcCard.isFormatedAsNDEF() &&
					nfcCard.hasReadPermissions() &&
					nfcCard.hasNDEFMessage()
				) {
					// Read the appropriate length to get the NDEF message as buffer
					const NDEFRawMessage = await reader.read(4, nfcCard.getNDEFMessageLengthToRead()); // starts reading in block 0 until end

					// Parse the buffer as a NDEF raw message
					const NDEFMessage = nfcCard.parseNDEF(NDEFRawMessage);

					const uri = new URL(NDEFMessage[0].uri);

					await start_player(uri);
				} else {
					console.log(
						'Could not parse anything from this tag: \n The tag is either empty, locked, has a wrong NDEF format or is unreadable.'
					);
				}
			} catch (err) {
				console.error(err.toString());
			}
		});
		reader.on('card.off', async (card) => {
			console.log(`${reader.reader.name}: ${card.type} with UID ${card.uid} removed`);
			try {
				({ pauseOnCardRemoval } = JSON.parse(fs.readFileSync('settings.json', 'utf-8')));
				if (pauseOnCardRemoval) {
					await pause_player();
				}
			} catch (err) {
				console.error(err.toString());
			}
		});
		reader.on('error', (err) => {
			console.error(`${reader.reader.name} an error occurred`, err);
		});
		reader.on('end', () => {
			console.log(`${reader.reader.name} device removed`);
		});
	});
	nfc.on('error', (err) => {
		console.log('an NFC error occurred', err);
	});
};

export default plexamp_nfc;
