import { v4 as uuidv4 } from "uuid";
import inquirer from "inquirer";
import { TodoItem } from "./TodoItem.js";
import type { TodoCollection } from "./TodoCollection.js";
import { JsonTodoCollection } from "./JsonTodoCollection.js";

const todos = [
	new TodoItem(uuidv4(), "Learn TypeScript"),
	new TodoItem(uuidv4(), "Learn Angular"),
	new TodoItem(uuidv4(), "Learn React"),
	new TodoItem(uuidv4(), "Learn Vue", true),
];

const collection: TodoCollection = new JsonTodoCollection("Martin", todos);
let showCompleted = true;

function displayTodoList(): void {
	console.log(
		`${collection.userName}'s Todo List (${collection.getItemCounts().incomplete} items to do)`,
	);
	const items = collection.getTodoItems(showCompleted);
	for (const item of items) {
		item.printDetails();
	}
}

console.clear();

enum Commands {
	Add = "Add New Task",
	Complete = "Complete Task",
	Toggle = "Show/Hide Completed",
	Purge = "Remove Completed Tasks",
	Quit = "Quit",
}

const promptAdd = () => {
	console.clear();
	displayTodoList();
	inquirer
		.prompt({ type: "input", name: "add", message: "Enter task:" })
		.then((answers) => {
			if (answers.add !== "") {
				collection.addTodo(answers.add);
			}
			promptUser();
		});
};

const promptComplete = (): void => {
	console.clear();
	inquirer
		.prompt({
			type: "checkbox",
			name: "complete",
			message: "Mark Task as Complete",
			choices: collection.getTodoItems(showCompleted).map((item) => ({
				name: item.task,
				value: item.id,
				checked: item.isCompleted,
			})),
		})
		.then((answers) => {
			const completedTasks = answers.complete as string[];

			for (const item of collection.getTodoItems(true)) {
				collection.markAsCompleted(
					item.id,
					completedTasks.find((id) => id === item.id) !== undefined,
				);
			}
			promptUser();
		});
};

function promptUser(): void {
	console.clear();
	displayTodoList();
	inquirer
		.prompt({
			type: "list",
			name: "command",
			message: "Choose option",
			choices: Object.values(Commands),
		})
		.then((answers) => {
			switch (answers.command as Commands) {
				case Commands.Toggle:
					showCompleted = !showCompleted;
					promptUser();
					break;
				case Commands.Add:
					promptAdd();
					break;
				case Commands.Complete:
					if (collection.getItemCounts().incomplete > 0) {
						promptComplete();
					} else {
						promptUser();
					}
					break;
				case Commands.Purge:
					collection.removeCompleted();
					promptUser();
					break;
			}
		});
}

promptUser();
