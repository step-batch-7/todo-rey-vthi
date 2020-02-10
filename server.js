const http = require('http');
const {stdout, stderr} = process;
const {app} = require('./lib/router.js');
const DEFAULT_PORT = 8000;

const main = function(port = DEFAULT_PORT) {
  const server = http.Server((req, res) => app.processRequest(req, res));
  server.listen(port);
  server.on('listening', () => stdout.write('Server listening'));
  server.on('error', () => stderr.write('Server error'));
};

main();
