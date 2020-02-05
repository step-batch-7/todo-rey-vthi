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

const getTodoContainer = function(content, id) {
  const todoContainer = createElement('div');
  todoContainer.className = 'list';
  todoContainer.innerHTML = `<br /><div class="heading">
  <div><span>${content}</span></div>
  <div><img src="../images/trash.png" id="${id}"
  class="delete-all-icon" onclick="deleteWholeTodo()"/>
  </div>
  </div><br />`;
  return todoContainer;
};

const deleteTodo = function() {
  const {todoId, taskId} = getIds(event);
  const textTodSend = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR('POST', '/deleteTask', formatTodoList, textTodSend);
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

const createTaskHtml = function(task) {
  const listContainer = createElement('div');
  listContainer.className = 'task';
  listContainer.id = task.id;
  listContainer.innerHTML = taskHtml(task);
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
    const todoContainer = getTodoContainer(todo.title, todo.id);
    todoContainer.id = todo.id;
    const list = todo.todoList;
    list.forEach(task => {
      const taskHtml = createTaskHtml(task);
      todoContainer.appendChild(taskHtml);
    });
    document.getElementById('todoListContainer').appendChild(todoContainer);
  });
};

const formatTodoList = function() {
  removeChild('#todoListContainer');
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
