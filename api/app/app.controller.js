'use strict';

const generateId = require('../../utils/generateId.util');

exports.signup = async ctx => {
    const msg = {
        to:  ctx.request.body.email,
        from: 'contact@chartzou.com',
        template_id: 'd-86efa68894834262970c37ab990abbda'
    }
    await ctx.mail.send(msg)
    .then(() => {
        ctx.status = 200
    })
    .catch((error) => {
        ctx.status = 500
        console.log(error.response.body)
        ctx.body = JSON.stringify({'status': 'error', 'message': error})
    })
}


exports.contact = async ctx => {
    const msg = {
        to:  'contact@gaultierweb.com',
        reply_to: ctx.request.body.email,
        from: 'contact@chartzou.com',
        template_id: 'd-711d523ce1ce4cc99af1d7fe3385661',
        dynamic_template_data: {
            email: ctx.request.body.email,
            message: ctx.request.body.message
        }
    }
    await ctx.mail.send(msg)
    .then(() => {
        ctx.status = 200
    })
    .catch((error) => {
        ctx.status = 500
        ctx.body = JSON.stringify({'status': 'error', 'message': error})
    })
}
