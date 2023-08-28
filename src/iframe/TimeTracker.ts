export interface TimeTracker {
	track(task: () => Promise<void>): Promise<void>;
	average: number;
}

export function createTimeTracker(): TimeTracker {
	const times: number[] = [];

	return {
		async track(task) {
			const before = performance.now();

			await task();

			const after = performance.now();
			times.push(after - before);
		},

		get average() {
			return times.reduce((sum, time) => sum + time, 0) / times.length;
		},
	};
}
