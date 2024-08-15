import { v4 as uuidv4 } from "uuid";
import { TodoItem } from "./TodoItem.js";

type ItemCounts = {
	total: number;
	incomplete: number;
};

export class TodoCollection {
	private nextId: string = uuidv4();
	protected itemMap = new Map<string, TodoItem>();

	constructor(
		public userName: string,
		public todoItems: TodoItem[] = [],
	) {
		for (const item of todoItems) {
			this.itemMap.set(item.id, item);
		}
	}

	addTodo(task: string): string {
		while (this.getTodoById(this.nextId)) {
			this.nextId = uuidv4();
		}
		this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
		return this.nextId;
	}

	getTodoById(id: string): TodoItem {
		return this.itemMap.get(id);
	}

	getTodoItems(includeCompleted: boolean): TodoItem[] {
		return [...this.itemMap.values()].filter(
			(item) => includeCompleted || !item.isCompleted,
		);
	}

	markAsCompleted(id: string, isCompleted: boolean) {
		const todoItem = this.getTodoById(id);
		if (todoItem) {
			todoItem.isCompleted = isCompleted;
		}
	}

	removeCompleted() {
		for (const item of this.itemMap.values()) {
			if (item.isCompleted) {
				this.itemMap.delete(item.id);
			}
		}
	}

	getItemCounts(): ItemCounts {
		return {
			total: this.itemMap.size,
			incomplete: this.getTodoItems(false).length,
		};
	}
}
