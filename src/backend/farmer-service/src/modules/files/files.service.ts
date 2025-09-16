import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../infrastructure/supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly bucketName: string;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'farmer-files';
  }

  async uploadFile(file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `uploads/${fileName}`;

    await this.supabaseService.uploadFile(
      this.bucketName,
      filePath,
      file.buffer,
      file.mimetype,
    );

    const publicUrl = await this.supabaseService.getPublicUrl(
      this.bucketName,
      filePath,
    );

    return {
      fileName,
      filePath,
      publicUrl,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async getFileUrl(path: string) {
    return this.supabaseService.getPublicUrl(this.bucketName, path);
  }

  async deleteFile(path: string) {
    await this.supabaseService.deleteFile(this.bucketName, path);
    return { message: 'File deleted successfully' };
  }
}
