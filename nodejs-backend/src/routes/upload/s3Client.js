const { S3Client } = require('@aws-sdk/client-s3');

const REGION = process.env.S3_REGION;
const KEY_ID = process.env.S3_ACCESS_KEY;
const ACCESS = process.env.S3_ACCESS_SECRET;

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: KEY_ID,
        secretAccessKey: ACCESS
    }
});

module.exports = s3Client;
