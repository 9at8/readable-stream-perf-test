export interface Messenger {
	postMessage(message: string): void;
	onMessage(callback: (message: string) => void): void;
}

export function createMessenger(
	eventName: string,
	target: Window,
	source: Window,
): Messenger {
	return {
		postMessage(message) {
			target.dispatchEvent(new CustomEvent(eventName, { detail: message }));
		},

		onMessage(callback) {
			source.addEventListener(eventName, e =>
				callback((e as CustomEvent<string>).detail),
			);
		},
	};
}
