import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postgres from 'postgres';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private sql: postgres.Sql;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured');
    }

    this.sql = postgres(databaseUrl, {
      max: 20,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  onModuleDestroy() {
    if (this.sql) {
      this.sql.end();
    }
  }

  getConnection(): postgres.Sql {
    return this.sql;
  }

  async query<T = any>(query: string, ...args: any[]): Promise<T[]> {
    return this.sql.unsafe(query, ...args);
  }

  async queryOne<T = any>(query: string, ...args: any[]): Promise<T | null> {
    const result = await this.sql.unsafe(query, ...args) as T[];
    return result.length > 0 ? result[0] : null;
  }

  async transaction<T>(callback: (sql: postgres.Sql) => Promise<T>): Promise<T> {
    return this.sql.begin(callback) as Promise<T>;
  }
}
