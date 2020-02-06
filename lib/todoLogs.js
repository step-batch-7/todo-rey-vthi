const Todo = require('./todo.js');

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

  static load(todoList) {
    const todoLog = new TodoLog();
    todoList.forEach(todo => {
      todoLog.addNewTodo(new Todo(todo.title, todo.todoList, todo.id));
    });
    return todoLog;
  }
}

module.exports = TodoLog;
