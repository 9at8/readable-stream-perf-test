import { StreamMessenger } from './Stream';

export interface Messenger<T> {
	postMessage(message: T): void;
	onMessage(callback: (message: T) => void): void;
}

export function createIFrameMessenger(
	eventName: string,
	target: Window,
	source: Window,
): StreamMessenger {
	return {
		postMessage(message) {
			target.dispatchEvent(
				new CustomEvent(eventName, { detail: payloadToString(message) }),
			);
		},

		onMessage(callback) {
			source.addEventListener(eventName, e =>
				callback(stringToPayload((e as CustomEvent<string>).detail)),
			);
		},
	};
}

export function createWebWorkerMessenger(target: Worker): StreamMessenger {
	return {
		postMessage(message) {
			target.postMessage({
				type: 'my-message',
				data: payloadToString(message),
			});
		},

		onMessage(callback) {
			target.addEventListener('message', e => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e?.data?.type !== 'my-message') {
					return;
				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				callback(stringToPayload(e.data.data as string));
			});
		},
	};
}

export function createWorkerToMainThreadMessenger(
	self: typeof globalThis,
): StreamMessenger {
	return {
		postMessage(message) {
			self.postMessage({
				type: 'my-message',
				data: payloadToString(message),
			});
		},

		onMessage(callback) {
			self.addEventListener('message', e => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e?.data?.type !== 'my-message') {
					return;
				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				callback(stringToPayload(e.data.data as string));
			});
		},
	};
}

function payloadToString(payload: {
	chunk: Uint8Array;
	encoding: BufferEncoding;
}) {
	return JSON.stringify(payload);
}

function stringToPayload(str: string) {
	const parse = JSON.parse(str) as {
		chunk: { data: number[] };
		encoding: BufferEncoding;
	};

	return { ...parse, chunk: new Uint8Array(parse.chunk.data) };
}
