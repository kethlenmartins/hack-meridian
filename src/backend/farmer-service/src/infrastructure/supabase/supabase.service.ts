import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    // Initialize Supabase client
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize S3 client for Supabase Storage (conforme documentação oficial)
    const endpoint = this.configService.get<string>('SUPABASE_STORAGE_ENDPOINT');
    const region = this.configService.get<string>('SUPABASE_STORAGE_REGION');
    const accessKeyId = this.configService.get<string>('SUPABASE_STORAGE_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('SUPABASE_STORAGE_SECRET_ACCESS_KEY');
    this.bucketName = this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'farmer-files';

    if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
      throw new Error('Supabase Storage S3 configuration is missing. Please check your .env file.');
    }

    this.s3Client = new S3Client({
      forcePathStyle: true, // Required for Supabase Storage
      region,
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async uploadFile(bucket: string, path: string, file: Buffer, contentType: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: path,
        Body: file,
        ContentType: contentType,
      });

      const result = await this.s3Client.send(command);
      return {
        path,
        etag: result.ETag,
        versionId: result.VersionId,
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: path,
      });

      // Generate a signed URL that expires in 1 hour
      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return signedUrl;
    } catch (error) {
      throw new Error(`Failed to get public URL: ${error.message}`);
    }
  }

  async deleteFile(bucket: string, path: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: path,
      });

      await this.s3Client.send(command);
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Helper method to get the bucket name
  getBucketName(): string {
    return this.bucketName;
  }
}
