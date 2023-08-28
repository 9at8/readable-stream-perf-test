import { createDuplex } from './common/Stream';
import {
	createIFrameMessenger,
	createWebWorkerMessenger,
} from './common/messenger';

function main() {
	const iframe = setupIFrame();
	const worker = setupWorker();

	iframe.stream.pipe(worker.stream);
	worker.stream.pipe(iframe.stream);

	iframe.run();
}

function setupWorker() {
	const stream = createDuplex(
		createWebWorkerMessenger(new Worker('worker.js')),
	);

	return { stream };
}

function setupIFrame() {
	const iframe =
		document.querySelector('iframe') ?? Throw(new Error('iframe not found'));

	const stream = createDuplex(
		createIFrameMessenger(
			'my-event-name',
			iframe.contentWindow ??
				Throw(new Error('iframe contentWindow not found')),
			window,
		),
	);

	return {
		stream,
		run: () => void (iframe.srcdoc = `<script src="iframe.js"></script>`),
	};
}

window.addEventListener('load', () => void main());

// eslint-disable-next-line @typescript-eslint/naming-convention
function Throw(error: Error): never {
	throw error;
}
