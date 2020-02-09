const formatTodoItems = function(tasks) {
  return tasks.map((item, index) => {
    return {id: index, task: item, isDone: false};
  });
};

const findMatchingTodo = function(task, allTask) {
  return allTask.some(todo => todo.task.includes(task) && task !== '');
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

  editTitle(editedTodo) {
    this.title = editedTodo;
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

  hasMatchingTask(task) {
    return findMatchingTodo(task, this.todoList);
  }

  deleteTask(taskId) {
    const index = indexOfTask(taskId, this.todoList);
    this.todoList.splice(index, 1);
  }

  static load(title, todoList, id) {
    const todo = todoList.map(task => {
      return {task: task.todo, id, isDone: false};
    });
    return new Todo(title, todo, id);
  }

  static createNewTodo(todo) {
    const tasks = formatTodoItems(JSON.parse(todo.todoList));
    return new Todo(todo.title, tasks, todo.id);
  }
}

module.exports = Todo;
