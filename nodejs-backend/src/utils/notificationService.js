module.exports = {
  after: {
    create(context) {
      createNotification(context, "created", context.result);
      return context;
    },
    update(context) {
      createNotification(context, "updated", context.result);
      return context;
    },
    patch(context) {
      createNotification(context, "updated", context.result);
      return context;
    },
    remove(context) {
      createNotification(context, "removed", context.result);
      return context;
    },
  },
};

function createNotification(context, action, result = null) {
  const { app, method, params, data } = context;

  if (context.path === "notifications" || context.path === "authentication"|| context.path === "audits"||
    context.path === "loginHistory" ) {
    return context;
  }

  const userId = params.user ? params.user.name : "unknown";

  const notificationData = {
    toUser: userId,
    content: `${context.path} with id ${result._id} was ${action}`,
    read: false,
    sent: new Date(),
    createdBy:
      params && params.user && typeof params.user._id !== "undefined"
        ? params.user._id
        : null,
    updatedBy:
      params && params.user && typeof params.user._id !== "undefined"
        ? params.user._id
        : null,
    path: `${context.path}`,
  };

  app.service("notifications").create(notificationData);
  return context;
}
