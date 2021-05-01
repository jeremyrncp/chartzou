const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const compress = require('koa-compress')();
const cors = require('@koa/cors')(/* Add your cors option */);
const helmet = require('koa-helmet')(/* Add your security option */);
const logger = require('koa-logger')();
const views = require('koa-views');
const serve = require('koa-static');
const session = require('koa-session');

const errorHandler = require('./middleware/error.middleware');
const applyApiMiddleware = require('./api');
const { isDevelopment } = require('./config');
const applyAppMiddleware = require('./app');
const render = views(__dirname + '/views/', {
  map: {
    html: 'twig'
  },
  options: {
    path: './',
    namespaces: { 'chartzou': 'views/' }
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
  .use(session( {
    key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: false, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    secure: false, /** (boolean) secure cookie*/
    sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
  }, server))
  .use(errorHandler)
  .use(helmet)
  .use(compress)
  .use(cors)
  .use(bodyParser)
  .use(render)
  .use(serve('./dist'));


  const admin = require('firebase-admin');
  const serviceAccount = require('./resources/firebase/chartzou-e943ff253a4f.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  server.context.db = admin.firestore();

  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  server.context.mail = sgMail


/**
 * Apply to our server the api router
 */
applyApiMiddleware(server);
applyAppMiddleware(server);

module.exports = server;
