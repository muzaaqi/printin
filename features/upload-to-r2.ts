import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

const bucketName = "ngeprint-file-storage"; // nama bucket di R2

export const uploadToR2 = async (path: string, file: File) => {
  const arrayBuffer = await file.arrayBuffer();

  await r2.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: path,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    }),
  );

  // Public URL pakai domain yang kamu set (bukan endpoint API)
  return `${process.env.CLOUDFLARE_R2_PUBLIC}/${path}`;
}
