const todoList = [];
let searchOption = 'task';

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

const getMainTodoContainer = function(content, id) {
  const todoContainer = createElement('div');
  todoContainer.className = 'list';
  todoContainer.innerHTML = `<div class="heading">
  <div onclick="showTodo()"><span class="todo-title" id="${id}">
  ${content}</span></div>
  <div><img src="../images/edit.png" id="${id}"
  class="edit" onclick="editTodo()"/>
  <img src="../images/trash.png" id="${id}"
  class="delete-all-icon" onclick="deleteWholeTodo()"/>
  </div>
  </div>`;
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
  const html = `<div>
    <img src="../images/delete.png" class="deleteIcon" onclick="deleteTodo()" />
    ${checkboxHtml}<span class="task-name" id="${task.id}">${task.task}</span></div>
    <div><img src="../images/pencil.png" class="pencil" onclick="editTask()"/></div>
    </div>`;
  return html;
};

const getIds = function(event) {
  const todoId = [...event.path].find(parent =>
    parent.classList.contains('list')
  ).id;
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
    const todoContainer = getMainTodoContainer(todo.title, todo.id);
    todoContainer.id = todo.id;
    document.getElementById('todoListContainer').appendChild(todoContainer);
  });
};

const checkValue = function() {
  if (event.key === 'Enter') updateTask();
};

const showSelectedTodo = function(text) {
  const todo = text;
  const br = createElement('br');
  document.getElementById('todo-viewer').appendChild(br);
  document.getElementById('todo-viewer').appendChild(br);
  const todoContainer = getTodoForView(todo.title, todo.id);
  todoContainer.id = todo.id;
  todo.todoList.forEach(task => {
    const taskHtml = createTaskHtml(task);
    todoContainer.appendChild(taskHtml);
  });
  document.getElementById('todo-viewer').appendChild(todoContainer);
};

const newTodo = function() {
  removeChild('#todo-viewer');
  showSelectedTodo(JSON.parse(this.responseText));
};

const viewTodo = function() {
  removeChild('#todo-viewer');
  showSelectedTodo(JSON.parse(this.responseText));
};

const closeTodo = function() {
  removeChild('#todo-viewer');
};

const formatTodoList = function() {
  removeChild('#todoListContainer');
  showAllTodo(this.responseText);
};

const editTask = function() {
  const {taskId} = getIds(event);
  const taskElement = document
    .getElementById(taskId)
    .getElementsByClassName('task-name');
  const innerText = taskElement[0].innerText;
  taskElement[0].innerHTML = `
  <input type="text" class="editing-task" value="${innerText}"
  onkeypress="checkValue()" >`;
};

const editTodo = function() {
  const todoId = event.target.id;
  const todoElement = document
    .getElementById(todoId)
    .getElementsByClassName('todo-title');
  const innerText = todoElement[0].innerHTML.trim();
  todoElement[0].innerHTML = `<input type="text" value="${innerText}"
   autofocus="autofocus" onkeypress="checkTitleValue()">`;
};

const checkTitleValue = function() {
  if (event.key === 'Enter') {
    const todoId = event.path[1].id;
    const editedTodo = event.srcElement.value;
    const requestText = `todoId=${todoId}&title=${editedTodo}`;
    sendXHR('POST', '/updateTodo', reloadTodo, requestText);
  }
};

const updateTask = function() {
  const {todoId, taskId} = getIds(event);
  const editedTask = event.srcElement.value;
  const requestText = `todoId=${todoId}&taskId=${taskId}&task=${editedTask}`;
  sendXHR('POST', '/editTask', newTodo, requestText);
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

const reloadTask = function() {
  removeChild('#todo-viewer');
  showSelectedTodo(JSON.parse(this.responseText));
};

const addTodo = function() {
  const input = document.createElement('input');
  input.type = 'text';
  input.onkeypress = checkInput;
  input.placeholder = 'add new task';
  input.className = 'new-task';
  document.querySelector('.view').appendChild(input);
};

const addNewTask = function(todoId, newTask) {
  const requestText = `todoId=${todoId}&task=${newTask}`;
  sendXHR('POST', '/addTask', reloadTask, requestText);
};

const checkInput = function() {
  if (event.key === 'Enter' && event.target.value !== '') {
    const todoId = event.path[1].id;
    addNewTask(todoId, event.target.value);
    const div = document.querySelector('.view');
    const inputBox = div.querySelectorAll('input');
    div.removeChild(inputBox[inputBox.length - 1]);
  }
};

const showAllMatchingTodo = function() {
  removeChild('#todo-viewer');
  viewMatchingTodo(this.responseText);
};

const viewMatchingTodo = function(todo) {
  const allTodo = JSON.parse(todo);
  allTodo.forEach(todo => showSelectedTodo(todo));
};

const getTodoForView = function(content, id) {
  const todoContainer = createElement('div');
  todoContainer.className = 'list view';
  todoContainer.id = id;
  todoContainer.innerHTML = `<div class="heading">
  <div><span>${content}</span></div>
  <div class="close"><img src="../images/add.png" class="add" onclick="addTodo()">
  <span onclick="closeTodo()">Close&nbsp;&nbsp;</span>
  </div>
  </div>`;
  return todoContainer;
};

const search = function() {
  if (searchOption === 'todo') {
    const requestText = `title=${event.srcElement.value}`;
    sendXHR('POST', '/searchTodo', showAllMatchingTodo, requestText);
    return;
  }
  const requestText = `task=${event.srcElement.value}`;
  sendXHR('POST', '/searchTask', showAllMatchingTodo, requestText);
};

const toggleOption = function() {
  const todoOption = document.getElementById('right').classList.toggle('hide');
  document.getElementById('left').classList.toggle('hide');
  todoOption ? (searchOption = 'todo') : (searchOption = 'task');
};
