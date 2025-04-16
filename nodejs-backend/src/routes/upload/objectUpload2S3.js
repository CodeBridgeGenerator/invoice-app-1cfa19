const s3Client = require("./s3Client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const URL = process.env.S3_URL;
const FOLDER = process.env.PROJECT_NAME;
const BUCKET = process.env.S3_BUCKET;

async function objectUpload2S3(request, response) {
  let message;
  const {
    content,
    lastModified,
    lastModifiedDate,
    name,
    size,
    type,
    tableId,
    tableName,
    user,
  } = request.body;

  if (content) {
    try {
      const params = {
        Bucket: BUCKET,
        Key: `${FOLDER}/${name}`,
        Body: content,
        ContentType: type,
      };

      const response = await s3Client.send(new PutObjectCommand(params));

      if (typeof response.VersionId === "string") {
        const url = `${URL}/${name}`;
        const data = {
          lastModified,
          lastModifiedDate,
          name,
          size,
          path: `${FOLDER}/${name}`,
          type,
          eTag: response.ETag,
          versionId: response.VersionId,
          url,
          tableId,
          tableName,
          createdBy: user._id,
          updatedBy: user._id,
        };
        request.app.services.documentStorages.create(data);
        // console.log("File uploaded successfully:");
        // console.log("_data:", _data);
        message = "Success, object deleted";
        return response.status(200).json({ status: true, url, message });
      } else {
        message = "Error uploading file:";
        console.error(message);
        return response.status(200).json({ status: false, message });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return response.status(501).json({ status: false, ...error });
    }
  }
}

module.exports = objectUpload2S3;
