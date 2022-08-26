require('dotenv').config('../../.env')
const {S3} = require('aws-sdk');

exports.S3UploadV2 = async (filename, file) => {
    const s3 = new S3();
    // const base64data = Buffer.from(file, 'binary');
    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `files/${filename}`,
        Body: file
    }
    return await s3.upload(param).promise();
}