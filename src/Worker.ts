import { createDuplex } from './common/Stream';
import { createWorkerToMainThreadMessenger } from './common/messenger';

const stream = createDuplex(createWorkerToMainThreadMessenger(self));

stream.on('data', chunk => {
	// setTimeout(() => {
	stream.write(chunk);
	// }, 0);
});
