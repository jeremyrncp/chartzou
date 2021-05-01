'use strict';

const controller = require('./dashboard.controller');

module.exports = Router => {
  const router = new Router({
    prefix: `/dashboard`,
  });

  router
    .get('/:dashboardId', controller.getOne)
    .get('/', controller.getAll)
    .post('/', controller.save)
    .post('/share', controller.share)
    .delete('/:dashboardId', controller.deleteOne)

    return router;
};
