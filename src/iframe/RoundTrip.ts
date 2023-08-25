import { Pair } from './Pair';
import { TimeTracker } from './TimeTracker';

export function createRoundTripWithTimeTracker(
	tracker: TimeTracker,
	pair: Pair,
) {
	return async function roundTrip() {
		let roundTripSuccessful: () => void = () => {};

		const roundTripPromise = new Promise<void>(resolve => {
			roundTripSuccessful = resolve;
		});

		const data = crypto.getRandomValues(new Uint8Array(10240));

		function onTwoRead(received: Uint8Array) {
			if (isEqual(received, data)) {
				pair.two.off('data', onTwoRead);
				pair.two.write(received);
			}
		}

		function onOneRead(received: Uint8Array) {
			if (isEqual(received, data)) {
				pair.one.off('data', onOneRead);
				roundTripSuccessful();
			}
		}

		pair.one.on('data', onOneRead);
		pair.two.on('data', onTwoRead);

		const before = performance.now();

		pair.one.write(data);

		await roundTripPromise;

		const after = performance.now();

		tracker.addRecord(after - before);
	};
}

function isEqual(one: Uint8Array, two: Uint8Array): boolean {
	if (one.length !== two.length) {
		return false;
	}

	return one.every((value, index) => value === two[index]);
}
