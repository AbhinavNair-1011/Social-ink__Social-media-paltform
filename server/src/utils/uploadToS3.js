const { PutObjectCommand } = require("@aws-sdk/client-s3");

const crypto = require("crypto");

const s3 = require("../config/awsS3");

async function uploadToS3(file) {
  const key = `${crypto.randomUUID()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,

      Key: key,

      Body: file.buffer,

      ContentType: file.mimetype,
    }),
  );

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = uploadToS3;
