export class TodoItem {
	constructor(
		public id: string,
		public task: string,
		public isCompleted = false,
	) {}

	printDetails(): void {
		console.log(
			`${this.id}\t${this.task}\t${this.isCompleted ? "\t(complete)" : ""}`,
		);
	}
}
