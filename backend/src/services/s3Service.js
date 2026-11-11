import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, s3Configured } from '../config/aws.js';

const bucket = () => { if (!s3Configured) { const e = new Error('S3 is not configured'); e.statusCode = 503; throw e; } return process.env.AWS_S3_BUCKET; };
export const uploadFile = async (taskId, file) => uploadToS3(`task-attachments/${taskId}`, file);
export const uploadToS3 = async (prefix, file) => { const key = `${prefix}/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`; await s3Client.send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: file.buffer, ContentType: file.mimetype })); return { originalName: file.originalname, key, contentType: file.mimetype, size: file.size }; };
export const deleteFile = async (key) => { if (!key) return; await s3Client.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key })); };
export const generateDownloadUrl = async (key) => getSignedUrl(s3Client, new GetObjectCommand({ Bucket: bucket(), Key: key }), { expiresIn: 900 });
