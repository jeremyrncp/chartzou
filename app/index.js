'use strict';

const fs = require('fs');
const path = require('path');
const Router = require('koa-router');

const { apiVersion } = require('../config').server;
const baseName = path.basename(__filename);

function applyAppMiddleware(app) {
  const router = new Router();

  router
    .get('/', async function (ctx){
        return await ctx.render('app/index.twig')
    });

  app.use(router.routes()).use(router.allowedMethods());
}

module.exports = applyAppMiddleware;
