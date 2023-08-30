import { Duplex } from 'readable-stream';
import { Messenger } from './Messenger';

export type StreamMessenger = Messenger<{
	chunk: Uint8Array;
	encoding: BufferEncoding;
}>;

export function createDuplex(messenger: StreamMessenger) {
	const duplex = new Duplex({
		read() {},

		write(chunk: Uint8Array, encoding: BufferEncoding, callback) {
			messenger.postMessage({ chunk, encoding });
			callback();
		},
	});

	messenger.onMessage(({ chunk, encoding }) => {
		duplex.push(chunk, encoding);
	});

	return duplex;
}
