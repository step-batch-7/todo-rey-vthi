class Task {
  constructor(name, id, initialStatus) {
    this.todo = name;
    this.id = id;
    this.isDone = initialStatus;
  }

  isIdSame(id) {
    return this.id === id;
  }

  toggleState() {
    this.isDone = !this.isDone;
  }

  static load(taskObj) {
    const {todo, id, isDone} = taskObj;
    return new Task(todo, id, isDone);
  }
}

module.exports = Task;
