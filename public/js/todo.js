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
  // const title = createElement('h1');
  // title.innerText = content;
  // todoContainer.appendChild(title);
  return todoContainer;
};

const deleteTodo = function() {
  const {todoId, taskId} = getIds(event);
  const textTodSend = `todoId=${todoId}&taskId=${taskId}`;
  removeChild('#todoListContainer');
  sendXHR('POST', '/deleteTask', formatTodoList, textTodSend);
};

const deleteWholeTodo = function() {
  const todoId = event.target.id;
  const textTodSend = `todoId=${todoId}`;
  removeChild('#todoListContainer');
  sendXHR('POST', '/deleteTodo', formatTodoList, textTodSend);
};

const getImageElement = function() {
  const image = createElement('img');
  image.src = '../images/delete.png';
  image.className = 'deleteIcon';
  image.onclick = deleteTodo;
  return image;
};

const createTaskHtml = function(task) {
  const listContainer = createElement('div');
  listContainer.className = 'task';
  listContainer.id = task.id;

  listContainer.appendChild(getImageElement());
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

const setUp = function() {
  todoList = [];
  document.getElementById('todoList').style.display = 'none';
  document.getElementById('create-button').style.display = 'block';
};

const saveTodo = function() {
  const title = document.getElementById('title').value;
  const requestText = getRequestText(title);
  setUp();
  const req = new XMLHttpRequest();
  req.open('POST', '/saveTodo');
  req.send(requestText);
  req.onload = function() {
    removeChild('#todoListContainer');
    showAllTodo(this.responseText);
  };
};
