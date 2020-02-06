let todoList = [];

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

const showTodo = function() {
  const todoId = event.path[3].id;
  const textTodSend = `todoId=${todoId}`;
  sendXHR('POST', '/viewTodo', viewTodo, textTodSend);
};

const getTodoContainer = function(content, id) {
  const todoContainer = createElement('div');
  todoContainer.className = 'list';
  todoContainer.innerHTML = `<div class="heading">
  <div onclick="showTodo()"><span>${content}</span></div>
  <div><img src="../images/trash.png" id="${id}"
  class="delete-all-icon" onclick="deleteWholeTodo()"/>
  </div>
  </div>`;
  return todoContainer;
};

const getContainer = function(content) {
  const todoContainer = createElement('div');
  todoContainer.className = 'list';
  todoContainer.innerHTML = `<br /><div class="heading">
  <div><span>${content}</span></div>
  <div class="close"><span onclick="closeTodo()">Close&nbsp;&nbsp;</span>
  </div>
  </div><br />`;
  return todoContainer;
};

const createTaskHtml = function(task) {
  const listContainer = createElement('div');
  listContainer.className = 'task';
  listContainer.id = task.id;
  listContainer.innerHTML = taskHtml(task);
  return listContainer;
};

const deleteTodo = function() {
  const {todoId, taskId} = getIds(event);
  const textTodSend = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR('POST', '/deleteTask', newTodo, textTodSend);
};

const deleteWholeTodo = function() {
  const todoId = event.target.id;
  const textTodSend = `todoId=${todoId}`;
  sendXHR('POST', '/deleteTodo', formatTodoList, textTodSend);
};

const getImageElement = function() {
  const image = createElement('img');
  image.src = '../images/delete.png';
  image.className = 'deleteIcon';
  image.onclick = deleteTodo;
  return image;
};

const getCheckboxHtml = function(isDone) {
  let checkbox = '<input type="checkbox" onclick="changeTaskStatus()">';
  if (isDone) {
    checkbox = '<input type="checkbox" onclick="changeTaskStatus()" checked>';
  }
  return checkbox;
};

const taskHtml = function(task) {
  const checkboxHtml = getCheckboxHtml(task.isDone);
  const html = `
    <img src="../images/delete.png" class="deleteIcon" onclick="deleteTodo()" />
    ${checkboxHtml}<span>${task.todo}</span>`;
  return html;
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
  const header = createElement('p');
  header.className = 'todo-list-left';
  header.innerText = 'TODO LISTS...';
  document.getElementById('todoListContainer').appendChild(header);
  todoDetails.forEach(todo => {
    const todoContainer = getTodoContainer(todo.title, todo.id);
    todoContainer.id = todo.id;
    document.getElementById('todoListContainer').appendChild(todoContainer);
  });
};

const showSelectedTodo = function(text) {
  const todo = JSON.parse(text);
  removeChild('#todo-viewer');
  const br = createElement('br');
  document.getElementById('todo-viewer').appendChild(br);
  document.getElementById('todo-viewer').appendChild(br);
  const todoContainer = getContainer(todo.title, todo.id);
  todoContainer.id = todo.id;
  todo.todoList.forEach(task => {
    const taskHtml = createTaskHtml(task);
    todoContainer.appendChild(taskHtml);
  });
  document.getElementById('todo-viewer').appendChild(todoContainer);
};

const newTodo = function() {
  showSelectedTodo(this.responseText);
};

const viewTodo = function() {
  showSelectedTodo(this.responseText);
};

const closeTodo = function() {
  removeChild('#todo-viewer');
};

const formatTodoList = function() {
  removeChild('#todoListContainer');
  console.log(this.responseText, '>>>>');
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

const reorganizeDisplay = function() {
  document.getElementById('title').value = '';
  document.getElementById('todoList').style.display = 'none';
  document.getElementById('create-button').style.display = 'block';
};

const reloadTodo = function() {
  removeChild('#todoListContainer');
  showAllTodo(this.responseText);
};

const saveTodo = function() {
  addTodoList();
  const title = document.getElementById('title').value;
  const requestText = getRequestText(title);
  reorganizeDisplay();
  sendXHR('POST', '/saveTodo', reloadTodo, requestText);
};
