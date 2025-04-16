module.exports = {
    before: {
        update(context) {
            createAuditLog(context, 'update');
            return context;
        },
        patch(context) {
            createAuditLog(context, 'patch');
            return context;
        },
        remove(context) {
            createAuditLog(context, 'remove');
            return context;
        }
    },
    after: {
        update(context) {
            createAuditLog(context, 'update', context.result);
            return context;
        },
        patch(context) {
            createAuditLog(context, 'patch', context.result);
            return context;
        },
        remove(context) {
            createAuditLog(context, 'remove', context.result);
            return context;
        }
    },
    error: {}
};

function createAuditLog(context, action, result = null) {
    const { app, method, params, data } = context;
    const userId = params.user ? params.user.name : 'unknown';

    const auditData = {
        action: action,
        createdBy: userId,
        serviceName: context.path,
        method: method,
        details: JSON.stringify(data) || JSON.stringify(result) || ''
    };

    app.service('audits').create(auditData);
}
