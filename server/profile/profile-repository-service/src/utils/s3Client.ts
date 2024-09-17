import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", // Set via environment variables
  secretAccessKey:
    process.env.AWS_SECRET_ACCESS_KEY ||
    "", // Set via environment variables
  region: process.env.AWS_REGION || "", // Your S3 bucket region, also set via environment variables
});

export default s3;
