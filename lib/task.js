class Task {
  constructor(todo, id, taskStatus) {
    this.todo = todo;
    this.id = id;
    this.isDone = taskStatus;
  }

  isIdSame(id) {
    return this.id === id;
  }

  toggleStatus() {
    this.isDone = !this.isDone;
  }

  static load(taskObj) {
    const {todo, id, isDone} = taskObj;
    return new Task(todo, id, isDone);
  }
}

module.exports = Task;
