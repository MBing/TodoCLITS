import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { TodoCollection } from "./TodoCollection.js";
import { TodoItem } from "./TodoItem.js";

type schemaType = {
	tasks: {
		id: string;
		task: string;
		isCompleted: boolean;
	}[];
};

export class JsonTodoCollection extends TodoCollection {
	private database: LowSync<schemaType>;

	constructor(
		public userName: string,
		todoItems: TodoItem[] = [],
	) {
		super(userName, []);
		this.database = new LowSync(new JSONFileSync("Todos.json"), { tasks: [] });
		this.database.read();

		if (this.database.data == null) {
			this.database.data = { tasks: todoItems };
			this.database.write();
			for (const item of this.database.data.tasks) {
				this.itemMap.set(
					item.id,
					new TodoItem(item.id, item.task, item.isCompleted),
				);
			}
		} else {
			for (const item of this.database.data.tasks) {
				this.itemMap.set(
					item.id,
					new TodoItem(item.id, item.task, item.isCompleted),
				);
			}
		}
	}

	addTodo(task: string): string {
		const result = super.addTodo(task);
		this.storeTasks();

		return result;
	}

	markAsCompleted(id: string, isCompleted: boolean): void {
		super.markAsCompleted(id, isCompleted);
		this.storeTasks();
	}

	removeCompleted(): void {
		super.removeCompleted();
		this.storeTasks();
	}

	private storeTasks() {
		this.database.data = { tasks: [...this.itemMap.values()] };
		this.database.write();
	}
}
