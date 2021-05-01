'use strict';

const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const firebaseAdmin = require('firebase-admin');
const loginController = require('./login.controller')
const dashboardController = require('./dashboard.controller')


const { apiVersion } = require('../config').server;
const baseName = path.basename(__filename);

const authUser = async (ctx, next) => {
    if (ctx.session.firebaseToken) {
      await firebaseAdmin
        .auth()
        .verifyIdToken(ctx.session.firebaseToken)
        .then((decodedToken) => {
          return firebaseAdmin.auth().getUser(decodedToken.uid).then((userRecord) => {
                ctx.session.user = userRecord;
                return next()
            }).catch(error => {
              throw 'Error while getting Firebase User record:' + error;
          });
        })
        .catch((error) => {
          ctx.redirect('/login')
        });
    } else {
      ctx.redirect('/login')
    };
}

function applyAppMiddleware(app) {
  const router = new Router();

  router.use(['/dashboard', '/dashboard/new', '/dashboard/view/:dashboardId', '/dashboard/edit/:dashboardId'], authUser);

  router
    .get('/', async function (ctx){
        return await ctx.render('app/index.twig')
    })
    .get('/contact', async function (ctx){
        return await ctx.render('app/contact.twig')
    })
    .get('/about', async function (ctx){
        return await ctx.render('app/about.twig')
    })
    .get('/term-of-user', async function (ctx){
        return await ctx.render('app/term-of-use.twig')
    })
    .get('/privacy-policy', async function (ctx){
        return await ctx.render('app/privacy-policy.twig')
     })
    .get('/login', loginController.login)
    .get('/dashboard', dashboardController.list)
    .get('/dashboard/view/:dashboardId', dashboardController.viewOne)
    .get('/dashboard/edit/:dashboardId', dashboardController.getOne)
    .get('/external/dashboard/share/:dashboardId', dashboardController.shareOne)
    .get('/dashboard/new', async function (ctx) {
      return await ctx.render('app/dashboard/new.twig', {'user': ctx.session.user})
    });

  router  
    .post('/auth', (ctx) => {
        if (ctx.header.auth) {
          ctx.session.firebaseToken = ctx.header.auth
          ctx.body = JSON.stringify({'status': true})
        }
        ctx.body = JSON.stringify({'status': false})
    });

  
  app.use(router.routes()).use(router.allowedMethods());
}

module.exports = applyAppMiddleware;
