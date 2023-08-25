import { Duplex, Transform } from 'readable-stream';
// import { Duplex } from 'readable-stream';

import { Wait } from './Wait';

export interface Pair {
	one: Duplex;
	two: Duplex;
}

export function createPair(wait: Wait): Pair {
	const one = new Transform({
		transform(chunk, encoding, callback) {
			void wait().then(() => {
				two.push(chunk, encoding);
				callback();
			});
		},
	});

	const two = new Transform({
		transform(chunk, encoding, callback) {
			void wait().then(() => {
				one.push(chunk, encoding);
				callback();
			});
		},
	});

	return { one, two };
}
