const fs = require('fs');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mime');
const STATUS_CODE = require('./statusCode');
const App = require('./app');
const Task = require('./task');

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
  const id = Math.floor(Math.random() * 100000 + 1);
  const isAlreadyExist = todoLogs.find(task => task.id === id);
  if (isAlreadyExist) return getRandomId();
  return id;
};

const getFormattedTodo = function(text) {
  // const title = text.title;
  // let todoList = text.todoList;
  // todoList = JSON.parse(todoList);
  // const list = todoList.map((task, index) => {
  //   return {todo: task, id: index, isDone: 0};
  // });
  // const id = getRandomId();
  // return {title, todoList: JSON.stringify(list), id};
  const {title, todoList} = text;
  const tasks = JSON.parse(todoList);
  const allTasks = tasks.map((task, index) =>
    Task.load({todo: task, id: index, isDone: false})
  );
  return {title, todoList: JSON.stringify(allTasks), id: getRandomId()};
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

const changeStatusOfTask = function(request, response) {
  const {todoId, taskId} = request.body;
  todoLogs.forEach(todo => {
    if (todo.id === +todoId) {
      const allTasks = JSON.parse(todo.todoList);
      allTasks.forEach(task => {
        if (task.id === +taskId) task.isDone = !task.isDone;
      });
      todo.todoList = JSON.stringify(allTasks);
    }
  });
  fs.writeFileSync(TODO_STORE, JSON.stringify(todoLogs));
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.writeHead(STATUS_CODE.OK);
  response.end(JSON.stringify(todoLogs));
};

const app = new App();

app.use(readBody);
app.get('/serveAllTodo', serveTodo);
app.get('', serveStaticFile);
app.post('/changeStatusOfTask', changeStatusOfTask);
app.post('/saveTodo', saveAndServeTodoLogs);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = {app};
