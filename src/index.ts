import { createMessenger } from './common/messenger';

window.addEventListener('load', () => {
	const iframe =
		document.querySelector('iframe') ?? Throw(new Error('iframe not found'));

	// if (window.location.host === 'localhost:8080') {
	// 	iframe.src = 'http://localhost:8081';
	// } else {
	iframe.srcdoc = `<script src="iframe.js"></script>`;
	// }

	const iframeMessenger = createMessenger(
		'my-event-name',
		iframe.contentWindow ?? Throw(new Error('iframe contentWindow not found')),
		window,
	);

	iframeMessenger.onMessage(message => {
		// setTimeout(() => {
		iframeMessenger.postMessage(message);
		// }, 5);
	});
});

// eslint-disable-next-line @typescript-eslint/naming-convention
function Throw(error: Error): never {
	throw error;
}
