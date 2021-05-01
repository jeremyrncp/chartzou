'use strict';

const generateId = require('../../utils/generateId.util');

exports.signup = async ctx => {
    const msg = {
        to:  ctx.request.body.email,
        from: 'noreply@chartzou.com',
        template_id: 'd-d965d88db48048b4ab46b938623e1e61'
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
        to:  'contact@chartzou.com',
        reply_to: ctx.request.body.email,
        from: 'noreply@chartzou.com',
        template_id: 'd-32e37013ccfe4034b37b1e0b7ff56efd',
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
