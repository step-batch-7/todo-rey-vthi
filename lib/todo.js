const Task = require('./task');

class Todo {
  constructor(title, todoList, id) {
    this.title = title;
    this.todoList = todoList;
    this.id = id;
  }
  static load(title, todoList, id) {
    const todo = todoList.map(task => {
      return new Task.load(task);
    });
    return new Todo(title, todo, id);
  }
  static createNewTodo(todo) {
    const tasks = formatTodoItems(todo.todoList);
    return new Todo(todo.title, tasks, todo.id);
  }
}

const formatTodoItems = function(tasks) {
  return tasks.map(task =>
    Task.load({task: task.todo, id: task.id, isDone: false})
  );
};

module.exports = Todo;
