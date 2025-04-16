const express = require("@feathersjs/express");
const objectUpload2S3 = require("./objectUpload2S3");
const object2DeleteS3 = require("./object2DeleteS3");
const objectListsS3 = require("./objectListsS3");

module.exports = function (app) {
  // manage s3 files
  app.post(
    "/s3uploader",
    express.raw({ type: "application/json" }),
    objectUpload2S3,
  );
  app.post(
    "/s3delete",
    express.raw({ type: "application/json" }),
    object2DeleteS3,
  );
  app.post("/s3list", express.raw({ type: "application/json" }), objectListsS3);
};
