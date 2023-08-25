import { createPair } from './Pair';
import { createRoundTripWithTimeTracker } from './RoundTrip';
import { createTimeTracker } from './TimeTracker';
import { wait } from './Wait';

async function main() {
	const pair = createPair(wait);
	const tracker = createTimeTracker();
	const roundTripOne = createRoundTripWithTimeTracker(tracker, pair);
	const roundTripTwo = createRoundTripWithTimeTracker(tracker, {
		one: pair.two,
		two: pair.one,
	});

	document.body.innerHTML = 'waiting ...';

	await Promise.all(
		new Array(1000)
			.fill(undefined)
			.map(() => (Math.random() > 0.5 ? roundTripOne() : roundTripTwo())),
	);

	document.body.innerHTML = `average round trip time: ${tracker.average}ms`;
	console.log(document.body.innerHTML);
}

window.addEventListener('load', () => void main());
