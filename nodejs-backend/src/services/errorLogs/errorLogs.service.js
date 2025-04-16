const { ErrorLogs } = require("./errorLogs.class");
const createModel = require("../../models/errorLogs.model");
const hooks = require("./errorLogs.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
    whitelist: ["$populate"],
    multi: ["create"],
  };

  // Initialize our service with any options it requires
  app.use("/errorLogs", new ErrorLogs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("errorLogs");

  // Get the schema of the collections
  app.get("/errorLogsSchema", function (request, response) {
    const schema = createModel(app).schema.tree;
    const result = Object.keys(schema).map((key) => {
      return {
        field: key,
        properties: schema[key],
      };
    });
    return response.status(200).json(result);
  });

  service.hooks(hooks);
};
