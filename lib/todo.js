const Task = require('./task');

const formatTodoItems = function(tasks) {
  return tasks.map((item, index) => {
    return {id: index, task: item, isDone: false};
  });
};

class Todo {
  constructor(title, todoList, id) {
    this.title = title;
    this.todoList = todoList;
    this.id = id;
  }

  changeStatusOfTask(taskId) {
    const task = this.todoList.find(task => task.id === +taskId);
    const index = this.todoList.indexOf(task);
    const currentStatus = this.todoList[index].isDone;
    this.todoList[index].isDone = !currentStatus;
  }

  editTask(taskId, editedTask) {
    const task = this.todoList.find(task => task.id === +taskId);
    const index = this.todoList.indexOf(task);
    this.todoList[index].task = editedTask;
  }

  addNewTask(task) {
    const lastId = this.todoList.length - 1;
    const newTask = {isDone: false, id: lastId + 1, task};
    this.todoList.push(newTask);
  }

  deleteTask(taskId) {
    const task = this.todoList.find(task => task.id === +taskId);
    const index = this.todoList.indexOf(task);
    this.todoList.splice(index, 1);
  }

  static load(title, todoList, id) {
    const todo = todoList.map(task => {
      return new Task.load(task);
    });
    return new Todo(title, todo, id);
  }

  static createNewTodo(todo) {
    const tasks = formatTodoItems(JSON.parse(todo.todoList));
    return new Todo(todo.title, tasks, todo.id);
  }
}

module.exports = Todo;
