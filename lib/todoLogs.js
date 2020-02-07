const Todo = require('./todo.js');

const findMatching = function(id, list) {
  return list.find(item => item.id === +id);
};

class TodoLog {
  constructor() {
    this.todoLogs = [];
  }
  stringify() {
    return JSON.stringify(this.todoLogs);
  }

  generateTodoId() {
    const id = Math.ceil(Math.random() * 1000);
    const matchingTodo = this.todoLogs.find(todo => todo.id === id);
    matchingTodo && this.generateTodoId();
    return id;
  }

  addNewTodo(todo) {
    this.todoLogs.push(todo);
  }

  addNewTask(todoId, task) {
    const todo = findMatching(todoId, this.todoLogs);
    todo.addNewTask(task);
  }

  editTask(todoId, taskId, editedTask) {
    const todo = findMatching(todoId, this.todoLogs);
    todo.editTask(taskId, editedTask);
  }

  deleteTodo(todoId) {
    const todo = findMatching(todoId, this.todoLogs);
    const index = this.todoLogs.indexOf(todo);
    this.todoLogs.splice(index, 1);
  }

  getTodo(todoId) {
    return findMatching(todoId, this.todoLogs);
  }

  changeStatusOfTask(todoId, taskId) {
    const todo = findMatching(todoId, this.todoLogs);
    todo.changeStatusOfTask(taskId);
  }

  deleteTask(todoId, taskId) {
    const todo = findMatching(todoId, this.todoLogs);
    todo.deleteTask(taskId);
  }

  static load(todoList) {
    const todoLog = new TodoLog();
    todoList.forEach(todo => {
      todoLog.addNewTodo(new Todo(todo.title, todo.todoList, todo.id));
    });
    return todoLog;
  }
}

module.exports = TodoLog;
