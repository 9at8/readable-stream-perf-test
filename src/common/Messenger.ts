import { Webview } from 'vscode';
import { StreamMessenger } from './Stream';

export interface Messenger<T> {
	postMessage(message: T): void;
	onMessage(callback: (message: T) => void): void;
}

export function createExtensionHostMessenger(
	vscodeApi: ReturnType<typeof acquireVsCodeApi>,
): StreamMessenger {
	return {
		postMessage(message) {
			vscodeApi.postMessage(payloadToString(message));
		},

		onMessage(callback) {
			window.addEventListener('message', e => {
				const payload = stringToPayload(e.data as string);

				if (payload != null) {
					callback(payload);
				}
			});
		},
	};
}

export function createWebviewMessenger(webview: Webview): StreamMessenger {
	return {
		postMessage(message) {
			void webview.postMessage(payloadToString(message));
		},

		onMessage(callback) {
			webview.onDidReceiveMessage(e => {
				const payload = stringToPayload(e);

				if (payload != null) {
					callback(payload);
				}
			});
		},
	};
}

function payloadToString(payload: {
	chunk: Uint8Array;
	encoding: BufferEncoding;
}) {
	return JSON.stringify({ type: 'stream-test-message', payload });
}

function stringToPayload(obj: unknown) {
	if (typeof obj !== 'string') {
		return undefined;
	}

	const parse = JSON.parse(obj) as
		| {
				type: 'stream-test-message';
				payload: {
					chunk: { data: number[] };
					encoding: BufferEncoding;
				};
		  }
		| undefined
		| null;

	if (parse?.type !== 'stream-test-message') {
		return undefined;
	}

	return { ...parse.payload, chunk: new Uint8Array(parse.payload.chunk.data) };
}
