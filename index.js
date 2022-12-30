import { NFC } from 'nfc-pcsc';
import plexamp_nfc from './lib/plexamp_nfc.js';

const nfc = new NFC();

plexamp_nfc(nfc);
