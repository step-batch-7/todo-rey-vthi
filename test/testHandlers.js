const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const {app} = require('../lib/handlers');

describe('GET method', () => {
  it('should give the home.html page when the url is /', done => {
    request(app.processRequest.bind(app))
      .get('/')
      .expect('Content-Type', 'text/html')
      .expect(200, done)
      .expect(/Todo/);
  });

  it('should give the 404 file not found page', done => {
    request(app.processRequest.bind(app))
      .get('/badFile')
      .expect('Content-Type', 'text/html')
      .expect(404, done)
      .expect(/404 File not found/);
  });

  it('should send data through get method', done => {
    request(app.processRequest.bind(app))
      .get('/')
      .send('name=field')
      .expect('Content-Type', 'text/html')
      .expect(200, done)
      .expect(/Todo/);
  });
});

describe('Method Not Allowed', () => {
  it('should give 405 when the given method is not allowed', done => {
    request(app.processRequest.bind(app))
      .put('/')
      .expect('Content-Type', 'text/plain')
      .expect(405, done)
      .expect('Method Not Allowed');
  });
});

describe('POST method', () => {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
  afterEach(() => sinon.restore());
  it('should save new todo', done => {
    request(app.processRequest.bind(app))
      .post('/saveTodo')
      .send('title=today&todoList=["bye"]')
      .expect(200, done);
  });
});
