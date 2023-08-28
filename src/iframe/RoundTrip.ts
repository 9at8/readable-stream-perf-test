import { Duplex } from 'readable-stream';
import { TimeTracker } from './TimeTracker';
import { PromiseWithResolvers } from '../common/PromiseWithResolvers';

export function createRoundTripWithTimeTracker(
	tracker: TimeTracker,
	stream: Duplex,
) {
	return async function roundTrip() {
		const roundTrip = PromiseWithResolvers<void>();

		const toSend = crypto.getRandomValues(new Uint8Array(1000));

		function onRead(received: Uint8Array) {
			if (isEqual(received, toSend)) {
				stream.off('data', onRead);
				roundTrip.resolve();
			}
		}

		stream.on('data', onRead);

		await tracker.track(async () => {
			stream.write(toSend);
			await roundTrip.promise;
		});
	};
}

function isEqual(one: Uint8Array, two: Uint8Array): boolean {
	if (one.length !== two.length) {
		return false;
	}

	return one.every((value, index) => value === two[index]);
}
