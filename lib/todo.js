const Task = require('./task');

const formatTodoItems = function(tasks) {
  return tasks.map((item, index) => {
    return {id: index, task: item, isDone: false};
  });
};

const indexOfTask = function(taskId, todoList) {
  const task = todoList.find(task => task.id === +taskId);
  return todoList.indexOf(task);
};

class Todo {
  constructor(title, todoList, id) {
    this.title = title;
    this.todoList = todoList;
    this.id = id;
  }

  changeStatusOfTask(taskId) {
    const index = indexOfTask(taskId, this.todoList);
    const currentStatus = this.todoList[index].isDone;
    this.todoList[index].isDone = !currentStatus;
  }

  editTask(taskId, editedTask) {
    const index = indexOfTask(taskId, this.todoList);
    this.todoList[index].task = editedTask;
  }

  addNewTask(task) {
    const lastId = this.todoList.length - 1;
    const newTask = {isDone: false, id: lastId + 1, task};
    this.todoList.push(newTask);
  }

  deleteTask(taskId) {
    const index = indexOfTask(taskId, this.todoList);
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
