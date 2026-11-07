
import busboy from "busboy";
import type { Request, Response, NextFunction } from "express";
import type { Readable } from "node:stream";

import { uploadStreamToCloudinary } from "../utils/cloudinary.util.js";
import { logError } from "../utils/logs.util.js";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const streamUpload = (
  fileField: string,
  folderName: string,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let uploadPromise: Promise<void> | null = null;
    let uploadError: Error | null = null;
    let fileFound = false;
    let finished = false;

    req.body = {};

    const bb = busboy({
      headers: req.headers,
      limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024,
        fields: 20,
        fieldSize: 20 * 1024,
        parts: 21,
      },
    });

    bb.on("field", (name, value, info) => {
      if (info.nameTruncated || info.valueTruncated) {
        uploadError = new Error(`Field "${name}" exceeds its limit`);
        return;
      }

      if (Object.prototype.hasOwnProperty.call(req.body, name)) {
        uploadError = new Error(`Duplicate field "${name}"`);
        return;
      }

      req.body[name] = value;
    });

    bb.on("fieldsLimit", () => {
      uploadError = new Error("Too many text fields");
    });

    bb.on("filesLimit", () => {
      uploadError = new Error("Too many files");
    });

    bb.on("partsLimit", () => {
      uploadError = new Error("Too many multipart parts");
    });

    bb.on("file", (name, fileStream: Readable, info) => {
      if (name !== fileField) {
        uploadError = new Error(`Unexpected file field "${name}"`);
        fileStream.resume();
        return;
      }

      if (fileFound) {
        uploadError = new Error("Only one image is allowed");
        fileStream.resume();
        return;
      }

      fileFound = true;

      if (!allowedMimeTypes.has(info.mimeType)) {
        uploadError = new Error("Only JPEG, PNG, and WebP images are allowed");
        fileStream.resume();
        return;
      }

      fileStream.on("limit", () => {
        uploadError = new Error("Image must not exceed 5 MB");
      });

      uploadPromise = uploadStreamToCloudinary(
        fileStream,
        folderName,
      )
        .then((result) => {
          req.cloudinaryData = {
            url: result.secure_url,
            publicId: result.public_id,
          };
        })
        .catch((error: unknown) => {
          uploadError =
            error instanceof Error
              ? error
              : new Error("Cloudinary upload failed");
        });
    });

    bb.on("error", (error : Error) => {
      uploadError = error;
    });

    bb.on("finish", async () => {
      if (uploadPromise) {
        await uploadPromise;
      }

      if (finished) return;

      if (uploadError) {
        finished = true;
        logError("Busboy upload middleware", uploadError);

        return res.status(400).json({
          success: false,
          message: uploadError.message,
        });
      }

      if (!fileFound || !req.cloudinaryData) {
        finished = true;

        return res.status(400).json({
          success: false,
          message: `${fileField} is required`,
        });
      }

      finished = true;
      next();
    });

    req.pipe(bb);
  };
};
