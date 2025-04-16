const s3Client = require("./s3Client");
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const BUCKET = process.env.S3_BUCKET;

async function objectListsS3(request, response) {
  let message;
  try {
    const listParams = {
      Bucket: BUCKET, // Name of the S3 bucket
    };

    const data = await s3Client.send(new ListObjectsV2Command(listParams));

    // Check if the response has any objects
    if (data.Contents) {
      message = "Objects found in the bucket.";
      console.log(message);
      return response
        .status(200)
        .json({ status: false, data: data.Contents, message: message });
    } else {
      message = "No objects found in the bucket.";
      console.log(message);
      return response
        .status(200)
        .json({ status: false, data: [], message: message });
    }
  } catch (err) {
    console.error("Error:", err);
    return response.status(501).json({ status: false, ...err });
  }
}

module.exports = objectListsS3;
