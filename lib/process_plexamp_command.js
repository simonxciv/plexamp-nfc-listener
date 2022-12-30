import fetch from 'node-fetch';
import fs from 'fs';

const { playerIP, playerPort } = JSON.parse(fs.readFileSync('settings.json', 'utf-8'));
const playerUri = `http://${playerIP}:${playerPort}`;

export const start_player = async (uri) => {
	if (!uri.pathname.startsWith('/player')) {
		throw new Error(`Unexpected URL: ${uri.href}`);
	}

	const companionUri = new URL(`${playerUri}${uri.pathname}${uri.search}`);

	console.log(`Received URL. Sending companion command to player ${playerIP}`);
	const res = await fetch(companionUri.href);

	if (!res.ok) {
		throw new Error(`Unexpected error while starting playback: ${res.status}`);
	}

	console.log('Started playback');
};

export const pause_player = async () => {
	console.log(`Card removed. Sending pause command to player ${playerIP}`);
	const res = await fetch(`${playerUri}/player/playback/pause`);

	if (!res.ok) {
		throw new Error(`Unexpected error while pausing playback: ${res.status}`);
	}

	console.log('Paused playback');
};
