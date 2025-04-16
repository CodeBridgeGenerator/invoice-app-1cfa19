const s3Client = require('./s3Client');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const BUCKET = process.env.S3_BUCKET;

async function object2DeleteS3(request, response) {
    const { path } = request.body;
    let message;
    try {
        const deleteParams = {
            Bucket: BUCKET,
            Key: path
        };

        // Use DeleteObjectCommand to send a delete request to S3
        const data = await s3Client.send(new DeleteObjectCommand(deleteParams));

        if (data) {
            message = 'Success, object deleted';
            console.log(message, data);
            return response.status(200).json({ status: true, data, message });
        } else {
            message = 'Error deleting file:';
            console.log(message, data);
            return response.status(200).json({ status: false, message });
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        return response.status(501).json({ status: false, ...error });
    }
}

module.exports = object2DeleteS3;
