module.exports = function (app) {
  const modelName = "comments";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      recordId: {
        type: Schema.Types.ObjectId,
        // ref: "companies",
        required: true,
      },
      resolved: {
        type: Boolean,
        required: false,
        default: false,
      },
      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
      updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
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
