const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const compress = require('koa-compress')();
const cors = require('@koa/cors')(/* Add your cors option */);
const helmet = require('koa-helmet')(/* Add your security option */);
const logger = require('koa-logger')();
const views = require('koa-views');

const errorHandler = require('./middleware/error.middleware');
const applyApiMiddleware = require('./api');
const { isDevelopment } = require('./config');
const applyAppMiddleware = require('./app');
const render = views(__dirname + '/views', {
  map: {
    html: 'twig'
  },
  options: {
    allowInlineIncludes: true,
    path: './'
  }
})

const server = new Koa();

/**
 * Add here only development middlewares
 */

if (isDevelopment) {
  server.use(logger);
}

/**
 * Pass to our server instance middlewares
 */
server
  .use(errorHandler)
  .use(helmet)
  .use(compress)
  .use(cors)
  .use(bodyParser)
  .use(render);

/**
 * Apply to our server the api router
 */
applyApiMiddleware(server);
applyAppMiddleware(server);

module.exports = server;
