import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto", // Cloudflare pakai region "auto"
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT, // contoh: https://<accountid>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET!,
  },
});
