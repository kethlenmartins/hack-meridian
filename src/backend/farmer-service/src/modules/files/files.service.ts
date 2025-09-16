import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../infrastructure/supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadFile(file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `uploads/${fileName}`;
    const bucketName = this.supabaseService.getBucketName();

    const uploadResult = await this.supabaseService.uploadFile(
      bucketName,
      filePath,
      file.buffer,
      file.mimetype,
    );

    const publicUrl = await this.supabaseService.getPublicUrl(
      bucketName,
      filePath,
    );

    return {
      fileName,
      filePath,
      publicUrl,
      size: file.size,
      mimeType: file.mimetype,
      etag: uploadResult.etag,
      versionId: uploadResult.versionId,
    };
  }

  async getFileUrl(path: string) {
    const bucketName = this.supabaseService.getBucketName();
    return this.supabaseService.getPublicUrl(bucketName, path);
  }

  async deleteFile(path: string) {
    const bucketName = this.supabaseService.getBucketName();
    return this.supabaseService.deleteFile(bucketName, path);
  }

  // Method to upload farmer documents (certificates, photos, etc.)
  async uploadFarmerDocument(farmerId: string, file: Express.Multer.File, documentType: string) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${farmerId}_${documentType}_${Date.now()}.${fileExtension}`;
    const filePath = `farmers/${farmerId}/documents/${fileName}`;
    const bucketName = this.supabaseService.getBucketName();

    const uploadResult = await this.supabaseService.uploadFile(
      bucketName,
      filePath,
      file.buffer,
      file.mimetype,
    );

    const publicUrl = await this.supabaseService.getPublicUrl(
      bucketName,
      filePath,
    );

    return {
      fileName,
      filePath,
      publicUrl,
      size: file.size,
      mimeType: file.mimetype,
      documentType,
      farmerId,
      etag: uploadResult.etag,
      versionId: uploadResult.versionId,
    };
  }

  // Method to upload farm photos
  async uploadFarmPhoto(farmId: string, file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `farm_${farmId}_${Date.now()}.${fileExtension}`;
    const filePath = `farms/${farmId}/photos/${fileName}`;
    const bucketName = this.supabaseService.getBucketName();

    const uploadResult = await this.supabaseService.uploadFile(
      bucketName,
      filePath,
      file.buffer,
      file.mimetype,
    );

    const publicUrl = await this.supabaseService.getPublicUrl(
      bucketName,
      filePath,
    );

    return {
      fileName,
      filePath,
      publicUrl,
      size: file.size,
      mimeType: file.mimetype,
      farmId,
      etag: uploadResult.etag,
      versionId: uploadResult.versionId,
    };
  }
}
