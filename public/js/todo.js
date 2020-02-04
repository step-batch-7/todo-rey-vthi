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

const getTodoContainer = function(content) {
  const todoContainer = createElement('div');
  todoContainer.className = 'list';
  const header = createElement('h1');
  header.innerText = content;
  todoContainer.appendChild(header);
  return todoContainer;
};

const showAllTodo = function(text) {
  const todoDetails = JSON.parse(text);
  todoDetails.forEach(todo => {
    const todoContainer = getTodoContainer(todo.title);
    const list = JSON.parse(todo.todoList);
    list.forEach(task => {
      const todo = createElement('p');
      todo.innerText = task;
      todoContainer.appendChild(todo);
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

const sendXHR = function(method, url, callback) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.send();
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
