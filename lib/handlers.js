const fs = require('fs');
const CONTENT_TYPES = require('./mime');
const STATUS_CODE = require('./statusCode');
const App = require('./app');

const STATIC_FOLDER = `${__dirname}/../public`;

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

const isFileNotExist = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
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
    request.body = data;
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('', serveStaticFile);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = {app};
