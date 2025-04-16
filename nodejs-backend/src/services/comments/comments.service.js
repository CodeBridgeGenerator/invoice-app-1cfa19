const { Audits } = require("./comments.class");
const createModel = require("../../models/comments.model");
const hooks = require("./comments.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate"],
    multi: ["create"],
  };

  // Initialize our service with any options it requires
  app.use("/comments", new Audits(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("comments");

  service.hooks(hooks);
};
