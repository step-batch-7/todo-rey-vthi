const todoList = [];

const showTodoBox = function() {
  document.getElementById('todoList').style.display = 'block';
  document.getElementById('create-button').style.display = 'none';
};

const addTodoList = function() {
  const newTodo = document.getElementById('item').value;
  if (newTodo === '') return;
  todoList.push(newTodo);
  document.getElementById('item').value = '';
};

const getRequestText = function(title) {
  return `title=${title}&todoList=${JSON.stringify(todoList)}`;
};

const createElement = function(element) {
  return document.createElement(element);
};

const getTodoContainer = function(content) {
  const todoContainer = createElement('div');
  todoContainer.className = 'list';
  const header = createElement('h1');
  header.innerText = content;
  todoContainer.appendChild(header);
  return todoContainer;
};

const createTaskHtml = function(task) {
  console.log(task);
  const listContainer = createElement('div');
  listContainer.className = 'task';
  listContainer.id = task.id;
  const todo = createElement('input');
  todo.type = 'checkbox';
  todo.onclick = changeTaskStatus;
  if (task.isDone === true) todo.checked = 'true';
  listContainer.appendChild(todo);
  const todoValue = createElement('span');
  todoValue.innerText = task.todo;
  listContainer.appendChild(todoValue);
  return listContainer;
};

const getIds = function(event) {
  const todoId = [...event.path].find(parent => parent.className === 'list').id;
  const taskId = [...event.path].find(parent => parent.className === 'task').id;
  return {todoId, taskId};
};

const changeTaskStatus = function() {
  const {todoId, taskId} = getIds(event);
  const textTodSend = `todoId=${todoId}&taskId=${taskId}`;
  removeChild('#todoListContainer');
  sendXHR('POST', '/changeStatusOfTask', formatTodoList, textTodSend);
};

const showAllTodo = function(text) {
  const todoDetails = JSON.parse(text);
  todoDetails.forEach(todo => {
    const todoContainer = getTodoContainer(todo.title);
    todoContainer.id = todo.id;
    const list = JSON.parse(todo.todoList);
    list.forEach(task => {
      const taskHtml = createTaskHtml(task);
      todoContainer.appendChild(taskHtml);
    });
    document.getElementById('todoListContainer').appendChild(todoContainer);
  });
};

const formatTodoList = function() {
  showAllTodo(this.responseText);
};

const removeChild = function(selector) {
  const children = document.querySelectorAll(selector)[0].childNodes;
  if (children) {
    [...children].forEach(child => child.parentNode.removeChild(child));
  }
};

const sendXHR = function(method, url, callback, data) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.send(data);
  req.onload = callback;
};

const saveTodo = function() {
  const title = document.getElementById('title').value;
  const requestText = getRequestText(title);
  const req = new XMLHttpRequest();
  req.open('POST', '/saveTodo');
  req.send(requestText);
  req.onload = function() {
    removeChild('#todoListContainer');
    showAllTodo(this.responseText);
  };
};
