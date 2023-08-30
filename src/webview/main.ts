import { createDuplex } from '../common/Stream';
import { createExtensionHostMessenger } from '../common/Messenger';
import { createRoundTripWithTimeTracker } from './RoundTrip';
import { createTimeTracker } from './TimeTracker';
import { PromiseWithResolvers } from '../common/PromiseWithResolvers';

async function main() {
	const mainTracker = createTimeTracker();
	const roundTripTracker = createTimeTracker();
	const stream = createDuplex(createExtensionHostMessenger(acquireVsCodeApi()));

	const roundTrip = createRoundTripWithTimeTracker(roundTripTracker, stream);

	document.body.innerHTML = '<p>waiting ...</p>';

	await mainTracker.track(async () => {
		for (let i = 0; i < 100; i++) {
			const r = PromiseWithResolvers();

			setTimeout(() => void roundTrip().then(() => r.resolve()));

			await r.promise;
		}

		// await Promise.all(new Array(1000).fill(undefined).map(() => roundTrip()));
	});

	document.body.innerHTML = `
<p>average round trip time: ${roundTripTracker.average}ms</p>
<p>total time: ${mainTracker.average}ms</p>
`;
	console.log(document.body.innerHTML);
}

window.addEventListener('load', () => void main());
