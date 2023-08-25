import { createMessenger } from '../common/messenger';

const parentMessenger = createMessenger('my-event-name', window.parent, window);

const messageResolveMap = new Map<string, () => void>();
parentMessenger.onMessage(id => {
	const resolve = messageResolveMap.get(id) ?? Throw(new Error('id not found'));

	messageResolveMap.delete(id);
	resolve();
});

export type Wait = () => Promise<void>;

export const wait: Wait = () =>
	new Promise<void>(res => {
		const id = crypto.randomUUID();
		messageResolveMap.set(id, res);
		parentMessenger.postMessage(id);
	});

// eslint-disable-next-line @typescript-eslint/naming-convention
function Throw(error: Error): never {
	throw error;
}
