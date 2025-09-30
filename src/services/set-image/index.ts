import cloudinary from '@/core/config/cloudinary';
import { googleSheetService } from '@/services/google-sheets';

async function uploadSetImage(file: File, setId: string, userId: string): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(fileBuffer).toString('base64');
  const fileUri = 'data:' + mimeType + ';' + encoding + ',' + base64Data;

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'sets',
  });

  await googleSheetService.updateSet(setId, { imageUrl: result.secure_url }, userId);

  return result.secure_url;
}

export const setImageService = {
  uploadSetImage,
};
