// utils/cloudinary.util.ts
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a readable stream (like from Busboy) directly to Cloudinary
 */

import { randomUUID } from "node:crypto";

export const generateShopFolderName = (shopName: string): string => {
  const sanitizedShopName = shopName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${sanitizedShopName}_${randomUUID()}`;
};

export const uploadStreamToCloudinary = (
  fileStream: NodeJS.ReadableStream,
  folderName: string,
  //   shopName : string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    // const fileName = generateShopFolderName(shopName)
    const cloudUploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        // public_id : fileName,
        resource_type: 'image', // STRICTLY enforces image processing
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Optional but recommended for security,
        overwrite: false,
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        if (result) return resolve(result);
      }
    );

    // Pipe the incoming Busboy stream directly to Cloudinary
    fileStream.pipe(cloudUploadStream);
  });
};

/**
 * Deletes an image from Cloudinary (useful for rolling back failed DB inserts)
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete image ${publicId} from Cloudinary`, error);
  }
};

/**
 * Extracts Cloudinary public_id from a secure URL
 */
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split('/upload/');
    const pathAfterUpload = parts[1];
    if (!pathAfterUpload) return null;
    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
    const lastDotIndex = withoutVersion.lastIndexOf('.');
    return lastDotIndex !== -1 ? withoutVersion.substring(0, lastDotIndex) : withoutVersion;
  } catch {
    return null;
  }
};

/**
 * Deletes an image from Cloudinary given its URL
 */
export const deleteFromCloudinaryByUrl = async (url: string): Promise<void> => {
  const publicId = getPublicIdFromUrl(url);
  if (publicId) {
    await deleteFromCloudinary(publicId);
  }
};