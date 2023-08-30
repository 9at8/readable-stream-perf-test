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
			const actual = times.reduce((sum, time) => sum + time, 0) / times.length;
			const simplified = Math.round(actual * 1000) / 1000;

			return simplified;
		},
	};
}
