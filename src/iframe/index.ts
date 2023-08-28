import { createDuplex } from '../common/Stream';
import { createIFrameMessenger } from '../common/messenger';
import { createRoundTripWithTimeTracker } from './RoundTrip';
import { createTimeTracker } from './TimeTracker';

async function main() {
	const tracker = createTimeTracker();
	const stream = createDuplex(
		createIFrameMessenger('my-event-name', window.parent, window),
	);

	const roundTrip = createRoundTripWithTimeTracker(tracker, stream);

	document.body.innerHTML = 'waiting ...';

	for (let i = 0; i < 1000; i++) {
		await roundTrip();
	}

	// await Promise.all(new Array(1000).fill(undefined).map(() => roundTrip()));

	document.body.innerHTML = `average round trip time: ${tracker.average}ms`;
	console.log(document.body.innerHTML);
}

window.addEventListener('load', () => void main());
