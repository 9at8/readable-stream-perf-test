export interface TimeTracker {
	addRecord(time: number): void;
	average: number;
}

export function createTimeTracker(): TimeTracker {
	const times: number[] = [];

	return {
		addRecord(time) {
			times.push(time);
		},

		get average() {
			return times.reduce((sum, time) => sum + time, 0) / times.length;
		},
	};
}
