const {
  readBody,
  serveTodo,
  serveStaticFile,
  editTask,
  changeStatusOfTask,
  deleteTask,
  addNewTask,
  deleteTodo,
  serveSelectedTodo,
  editTodo,
  searchTodo,
  searchTask,
  saveAndServeTodoLogs,
  notFound,
  methodNotAllowed
} = require('./handlers');
const App = require('./app');

const app = new App();

app.use(readBody);
app.get('/serveAllTodo', serveTodo);
app.get('', serveStaticFile);
app.post('/editTask', editTask);
app.post('/changeStatusOfTask', changeStatusOfTask);
app.post('/deleteTask', deleteTask);
app.post('/addTask', addNewTask);
app.post('/deleteTodo', deleteTodo);
app.post('/viewTodo', serveSelectedTodo);
app.post('/updateTodo', editTodo);
app.post('/searchTodo', searchTodo);
app.post('searchTask', searchTask);
app.post('/saveTodo', saveAndServeTodoLogs);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = {app};
