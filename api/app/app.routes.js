'use strict';

const controller = require('./app.controller');

module.exports = Router => {
  const router = new Router({
    prefix: `/service`,
  });

  router
    .post('/signup', controller.signup)
    .post('/contact', controller.contact)

    return router;
};
