// controllers/retailer.controller.ts
import type { Request, Response } from 'express';
import { logError } from '../../utils/logs.util.js';
import { generateRandomPassword } from '../../utils/password.utils.js';
import { createUser } from '../../services/user/createUser.js';
import { createRetailer } from '../../services/retailer/createRetailer.service.js';
import { deleteFromCloudinary } from '../../utils/cloudinary.util.js';

export async function registerRetailer(req: Request, res: Response) {
  // We know req.body is valid because the Busboy middleware already validated it.
  const { email, fullName, address, area, city, gstNo, latitude, longitude, phone, postalCode, shopName } = req.body;

  // Grab the data attached by our stream-upload middleware!
  const cloudinaryData = req.cloudinaryData!; 

  try {
    // 1. Create User
    const user = await createUser({
      email,
      fullName,
      role: 'RETAILER',
      password: generateRandomPassword(),
    });

    if (!user) throw new Error('Failed to Create a User');

    // 2. Create Retailer
    const retailer = await createRetailer({
      userId: user.id,
      address,
      area,
      city,
      phone,
      postalCode,
      shopName,
      gstNo,
      latitude, 
      longitude, 
      shopPhotoUrl: cloudinaryData.url // Use the URL from Cloudinary directly!
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Retailer registered successfully', 
      data: retailer 
    });

  } catch (error) {
    logError('create retailer controller', error);
    
    // 3. Rollback Cloudinary if DB insertion fails
    if (cloudinaryData?.publicId) {
      await deleteFromCloudinary(cloudinaryData.publicId);
    }

    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
