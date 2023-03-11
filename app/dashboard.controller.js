'use strict';

exports.list = async ctx => {
    const grids = []

    await ctx.db.collection("grids").where("user", "==", ctx.session.user.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((grid) => {
            grids.push(grid.data())
        })

        return ctx.render('app/dashboard/list.twig', {'user': ctx.session.user, 'dashboards': grids})
    })
    .catch((error) => {
        ctx.status = 500
        ctx.body = JSON.stringify({'status': 'error', 'message': error})
    });
};

exports.getOne = async ctx => {
    await editOrView('edit', ctx)
};

exports.viewOne = async ctx => {
    await editOrView('view', ctx)
};

exports.shareOne = async ctx => {
    await editOrView('share', ctx)
};


const editOrView = async (mode, ctx) => {
    if (mode !== 'edit' && mode !== 'view' && mode !== 'share') {
        throw 'Mode must be edit or view'
    }

    const { dashboardId } = ctx.params;
    await ctx.db.collection("grids").doc(dashboardId)
    .get()
    .then((grid) => {
        if(mode === 'share') {
            return ctx.render('app/dashboard/' + mode + '.twig', {'dashboard': grid.data()})
        }
        else if (grid.exists && grid.data().user == ctx.session.user.uid) {
            return ctx.render('app/dashboard/' + mode + '.twig', {'user': ctx.session.user, 'dashboard': grid.data()})
        } else {
            ctx.status = 404
            ctx.body = JSON.stringify({'status': 'error', 'message': 'Not found'})
        }
    })
    .catch((error) => {
        console.log(error)
        ctx.status = 500
        ctx.body = JSON.stringify({'status': 'error', 'message': error})
    });
}
