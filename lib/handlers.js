const fs = require('fs');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mime');
const STATUS_CODE = require('./statusCode');
const App = require('./app');

const STATIC_FOLDER = `${__dirname}/../public`;

const TODO_STORE = `${__dirname}/../data/todoLogs.json`;

const isFileNotExist = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const loadTodoLists = function() {
  if (isFileNotExist(TODO_STORE)) {
    return [];
  }
  const comments = JSON.parse(fs.readFileSync(TODO_STORE));
  return comments;
};

const todoLogs = loadTodoLists();

const getContentType = function(path) {
  const [, extension] = path.match(/.*\.(.*)$/);
  return CONTENT_TYPES[extension];
};

const getPath = function(path) {
  if (path === '/') {
    return `${STATIC_FOLDER}/home.html`;
  }
  return `${STATIC_FOLDER}${path}`;
};

const notFound = function(request, response) {
  const body = '404 File not found';
  response.setHeader('Content-Type', 'text/html');
  response.writeHead(STATUS_CODE.NOT_FOUND);
  response.end(body);
};

const serveStaticFile = function(request, response, next) {
  const path = getPath(request.url);
  if (isFileNotExist(path)) {
    return next();
  }
  const contentType = getContentType(path);
  const body = fs.readFileSync(path);
  response.setHeader('Content-Type', contentType);
  response.end(body);
};

const methodNotAllowed = function(request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(STATUS_CODE.METHOD_NOT_ALLOWED);
  response.end('Method Not Allowed');
};

const readBody = function(request, response, next) {
  let data = '';
  request.on('data', chunk => {
    data += chunk;
  });
  request.on('end', () => {
    request.body = querystring.parse(data);
    next();
  });
};

const getRandomId = function() {
  return Math.floor(Math.random() * 1000 + 1);
};

const getFormattedTodo = function(text) {
  const title = text.title;
  let todoList = text.todoList;
  todoList = JSON.parse(todoList);
  const list = todoList.map(task => {
    return {todo: task, id: getRandomId(), isDone: 0};
  });
  return {title, todoList: JSON.stringify(list), id: getRandomId()};
};

const saveAndServeTodoLogs = function(request, response) {
  const newTodo = getFormattedTodo(request.body);
  todoLogs.push(newTodo);
  fs.writeFileSync(TODO_STORE, JSON.stringify(todoLogs));
  response.setHeader('Content-Type', 'text/html');
  response.writeHead(STATUS_CODE.OK);
  response.end(JSON.stringify(todoLogs));
};

const serveTodo = function(request, response) {
  response.setHeader('Content-Type', 'text/html');
  response.writeHead(STATUS_CODE.OK);
  response.end(JSON.stringify(todoLogs));
};

const app = new App();

app.use(readBody);
app.get('/serveAllTodo', serveTodo);
app.get('', serveStaticFile);
app.post('/saveTodo', saveAndServeTodoLogs);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = {app};
