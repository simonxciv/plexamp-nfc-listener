import fetch from 'node-fetch';
import fs from 'fs';

let playerIP = '127.0.0.1',
	playerPort = 32500;

const getPlayerUri = () => {
	try {
		({ playerIP, playerPort } = JSON.parse(fs.readFileSync('settings.json', 'utf-8')));
	} catch (err) {
		console.log('No settings file provided');
	}
	return `http://${playerIP}:${playerPort}`;
};

export const start_player = async (uri) => {
	if (!uri.pathname.startsWith('/player')) {
		throw new Error(`Unexpected URL: ${uri.href}`);
	}

	const companionUri = new URL(`${getPlayerUri()}${uri.pathname}${uri.search}`);

	console.log(`Received URL. Sending companion command to player ${playerIP}`);
	const res = await fetch(companionUri.href);

	if (!res.ok) {
		throw new Error(`Unexpected error while starting playback: ${res.status}`);
	}

	console.log('Started playback');
};

export const pause_player = async () => {
	console.log(`Card removed. Sending pause command to player ${playerIP}`);
	const res = await fetch(`${getPlayerUri()}/player/playback/pause`);

	if (!res.ok) {
		throw new Error(`Unexpected error while pausing playback: ${res.status}`);
	}

	console.log('Paused playback');
};
