const fs = require('fs');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mime');
const STATUS_CODE = require('./statusCode');
const TodoLogs = require('./todoLogs.js');
const Todo = require('./todo.js');
// const App = require('./app');

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

const todoLogs = TodoLogs.load(loadTodoLists());

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

const saveAndServeTodoLogs = function(request, response) {
  request.body.id = todoLogs.generateTodoId();
  const todo = Todo.createNewTodo(request.body);
  todoLogs.addNewTodo(todo);
  fs.writeFileSync(TODO_STORE, todoLogs.stringify());
  response.setHeader('Content-Type', 'text/html');
  response.writeHead(STATUS_CODE.OK);
  response.end(todoLogs.stringify());
};

const serveTodo = function(request, response) {
  response.setHeader('Content-Type', 'text/html');
  response.writeHead(STATUS_CODE.OK);
  response.end(todoLogs.stringify());
};

const changeStatusOfTask = function(request, response) {
  const {todoId, taskId} = request.body;
  todoLogs.changeStatusOfTask(todoId, taskId);
  fs.writeFileSync(TODO_STORE, todoLogs.stringify());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.writeHead(STATUS_CODE.OK);
  response.end(todoLogs.stringify());
};

const deleteTask = function(request, response) {
  const {todoId, taskId} = request.body;
  todoLogs.deleteTask(todoId, taskId);
  const todo = todoLogs.getTodo(todoId);
  fs.writeFileSync(TODO_STORE, todoLogs.stringify());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(todo));
};

const deleteTodo = function(request, response) {
  const {todoId} = request.body;
  todoLogs.deleteTodo(todoId);
  fs.writeFileSync(TODO_STORE, todoLogs.stringify());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(todoLogs.stringify());
};

const serveSelectedTodo = function(request, response) {
  const todoId = request.body.todoId;
  const todo = todoLogs.getTodo(todoId);
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(todo));
};

const addNewTask = function(request, response) {
  const {todoId, task} = request.body;
  todoLogs.addNewTask(todoId, task);
  const todo = todoLogs.getTodo(todoId);
  fs.writeFileSync(TODO_STORE, todoLogs.stringify());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(todo));
};

const editTask = function(request, response) {
  const {todoId, taskId, task} = request.body;
  todoLogs.editTask(todoId, taskId, task);
  const todo = todoLogs.getTodo(todoId);
  fs.writeFileSync(TODO_STORE, todoLogs.stringify());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(todo));
};

const editTodo = function(request, response) {
  const {todoId, title} = request.body;
  todoLogs.editTodo(todoId, title);
  fs.writeFileSync(TODO_STORE, todoLogs.stringify());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(todoLogs.stringify());
};

const searchTodo = function(request, response) {
  const {title} = request.body;
  const searchedTodo = todoLogs.searchMatchingTodo(title);
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(searchedTodo));
};

const searchTask = function(request, response) {
  const {task} = request.body;
  const searchedTodo = todoLogs.searchMatchingTask(task);
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(JSON.stringify(searchedTodo));
};

// const app = new App();

// app.use(readBody);
// app.get('/serveAllTodo', serveTodo);
// app.get('', serveStaticFile);
// app.post('/editTask', editTask);
// app.post('/changeStatusOfTask', changeStatusOfTask);
// app.post('/deleteTask', deleteTask);
// app.post('/addTask', addNewTask);
// app.post('/deleteTodo', deleteTodo);
// app.post('/viewTodo', serveSelectedTodo);
// app.post('/updateTodo', editTodo);
// app.post('/searchTodo', searchTodo);
// app.post('searchTask', searchTask);
// app.post('/saveTodo', saveAndServeTodoLogs);
// app.get('', notFound);
// app.use(methodNotAllowed);

// module.exports = {app};

module.exports = {
  readBody,
  serveTodo,
  serveStaticFile,
  editTask,
  changeStatusOfTask,
  deleteTask,
  serveSelectedTodo,
  editTodo,
  searchTodo,
  searchTask,
  saveAndServeTodoLogs,
  notFound,
  methodNotAllowed,
  deleteTodo,
  addNewTask
};
