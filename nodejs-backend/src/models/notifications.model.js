module.exports = function (app) {
  const modelName = "notifications";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      toUser: { type: String, required: true, unique: false },
      content: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },
      path: {
        type: String,
        required: false,
        unique: false,
      },
      read: { type: Boolean, required: false },
      sent: { type: Date, required: false },


      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: false,
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: false,
      },
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
