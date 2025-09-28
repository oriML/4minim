import cloudinary from '@/core/config/cloudinary';
import { googleSheetService } from '@/services/google-sheets';

async function uploadProductImage(file: File, productId: string, userId: string): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(fileBuffer).toString('base64');
  const fileUri = 'data:' + mimeType + ';' + encoding + ',' + base64Data;

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'products',
  });

  await googleSheetService.updateProduct(productId, { imageUrl: result.secure_url }, userId);

  return result.secure_url;
}

export const productImageService = {
  uploadProductImage,
};
