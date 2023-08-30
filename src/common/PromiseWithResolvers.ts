// eslint-disable-next-line @typescript-eslint/naming-convention
export function PromiseWithResolvers<T = void>() {
	let resolve: (value: T) => void;
	let reject: (reason?: unknown) => void;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return { promise, resolve: resolve!, reject: reject! };
}
