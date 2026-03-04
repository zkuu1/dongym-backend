import cloudinary from "../libs/cloudinary.js";
import { HTTPException } from "hono/http-exception";

export async function uploadImageHandler(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise<{
    url: string;
    public_id: string;
  }>((resolve, reject) => {

    cloudinary.uploader
      .upload_stream(
        { folder: "photos" },
        (error, result) => {

          // error handling
          if (error || !result) {

            if (error?.message?.includes("File size too large")) {
              return reject(
                new HTTPException(413, {
                  message: "File size too large, maximum allowed is 5MB",
                })
              );
            }

            return reject(
              new HTTPException((error?.http_code || 500) as any, {
                message: error?.message || "Upload failed",
              })
            );
          }

          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      )
      .end(bytes);
  });
}