module.exports = app => {
  app.use('/', require('./auth/index'));
  app.use('/', require('./base.routes'));
};
