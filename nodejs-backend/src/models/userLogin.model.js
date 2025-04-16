module.exports = function (app) {
  const modelName = "user_logins";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      loginEmail: { type: String },
      code: { type: Number, required: false, min: 0, max: 1000000 },
      access: { type: String },
      sendMailCounter: { type: Number, default: 0 },
    },
    {
      timestamps: true,
    },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
