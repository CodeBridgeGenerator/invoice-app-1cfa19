module.exports = function (app) {
  const modelName = "error_logs";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      serviceName: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },
      errorMessage: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },
      message: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },
      stack: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },
      details: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        index: false,
        trim: false,
      },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
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
