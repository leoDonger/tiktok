import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});


export async function uploadToS3(fileName: string, fileBuffer: Buffer) {
  const putCmd = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "video/mp4",
  });
  await s3Client.send(putCmd);
  return fileName;
}

export async function listS3Objects() {
  const listCmd = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET_NAME,
  });
  const response = await s3Client.send(listCmd);
  return response.Contents || [];
}

export async function getS3PresignedUrl(fileKey: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}
