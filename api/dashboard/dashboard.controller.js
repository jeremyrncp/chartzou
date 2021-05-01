'use strict';

const generateId = require('../../utils/generateId.util');

exports.getOne = async ctx => {
    const { dashboardId } = ctx.params;
    await ctx.db.collection("grids").doc(dashboardId)
    .get()
    .then((grid) => {
        if (grid.exists && grid.user == ctx.session.user.uid) {
            ctx.status = 200
            ctx.body = JSON.stringify(grid)
        } else {
            ctx.status = 404
            ctx.body = JSON.stringify({'status': 'error', 'message': 'Not found'})
        }
    })
    .catch((error) => {
        ctx.status = 500
        ctx.body = JSON.stringify({'status': 'error', 'message': error})
    });
};

exports.deleteOne = async ctx => {
    const { dashboardId } = ctx.params;
    await ctx.db.collection("grids").doc(dashboardId)
    .get()
    .then((grid) => {
        if (grid.data().user == ctx.session.user.uid) {
            try {
                if (deleteDashboard(ctx, dashboardId)) {
                    ctx.status = 200
                }      
            } catch (error) {
                ctx.status = 650
                ctx.body = JSON.stringify({'status': 'error', 'message': error})  
            }
        } else {
            ctx.status = 404
            ctx.body = JSON.stringify({'status': 'error', 'message': 'Not found'})
        }
    })
    .catch((error) => {
        ctx.status = 500
        ctx.body = JSON.stringify({'status': 'error', 'message': error})
    });
};

const deleteDashboard = async (ctx, dashboardId) => {
    await ctx.db.collection("grids").doc(dashboardId)
    .delete()
    .then(() => {return true;})
    .catch((error) => {throw error})
}

exports.getAll = async ctx => {
    const grids = []

    await ctx.db.collection("grids").where("user", "==", ctx.session.user.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((grid) => {
            grids.push(grid)
        });

        ctx.status = 200
        ctx.body = JSON.stringify(grids)
    })
    .catch((error) => {
        ctx.status = 500
        ctx.body = JSON.stringify({'status': 'error', 'message': error})
    });
};

exports.save = async ctx => {
    const dashboard = ctx.request.body

    if (dashboard.id == undefined) {
        dashboard.id = generateId()
    }
    dashboard.user = ctx.session.user.uid

    await ctx.db.collection("grids").doc(dashboard.id).set(dashboard)
    .then(() => {
        ctx.status = 200
        ctx.body = JSON.stringify(dashboard)
    })
    .catch((error) => {
        console.log(error)
        ctx.status = 500
        ctx.body = JSON.stringify({'status': 'error', 'message': error})
    })
};

exports.share = async ctx => {
    const msg = {
        to:  ctx.request.body.email,
        from: 'noreply@chartzou.com',
        dynamic_template_data : {
            dashboardId: ctx.request.body.dashboardId,
        },
        template_id: 'd-964063011e6344d98f025d9ed12860b4'
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