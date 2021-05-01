'use strict';

exports.login = async ctx => {
    return await ctx.render('app/login.twig', {
        'user': ctx.session.user
    })
};