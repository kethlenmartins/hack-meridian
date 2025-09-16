import { Injectable } from '@nestjs/common';
import { Farmer, FarmerAddress } from '../../domain/entities/farmer.entity';
import { FarmerRepository } from '../../domain/repositories/farmer.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PostgresFarmerRepository implements FarmerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(farmer: Farmer): Promise<Farmer> {
    const sql = this.databaseService.getConnection();
    
    await sql`
      INSERT INTO farmers (
        id, email, full_name, cpf, phone, 
        address_street, address_number, address_complement, 
        address_neighborhood, address_city, address_state, 
        address_zip_code, address_country, farm_experience, 
        certifications, is_active, created_at, updated_at
      ) VALUES (
        ${farmer.id}, ${farmer.email}, ${farmer.fullName}, ${farmer.cpf}, ${farmer.phone},
        ${farmer.address.street}, ${farmer.address.number}, ${farmer.address.complement},
        ${farmer.address.neighborhood}, ${farmer.address.city}, ${farmer.address.state},
        ${farmer.address.zipCode}, ${farmer.address.country}, ${farmer.farmExperience},
        ${JSON.stringify(farmer.certifications)}, ${farmer.isActive}, ${farmer.createdAt}, ${farmer.updatedAt}
      )
    `;

    return farmer;
  }

  async findById(id: string): Promise<Farmer | null> {
    const sql = this.databaseService.getConnection();
    
    const result = await sql`
      SELECT * FROM farmers WHERE id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    return this.mapToEntity(result[0]);
  }

  async findByEmail(email: string): Promise<Farmer | null> {
    const sql = this.databaseService.getConnection();
    
    const result = await sql`
      SELECT * FROM farmers WHERE email = ${email}
    `;

    if (result.length === 0) {
      return null;
    }

    return this.mapToEntity(result[0]);
  }

  async findByCpf(cpf: string): Promise<Farmer | null> {
    const sql = this.databaseService.getConnection();
    
    const result = await sql`
      SELECT * FROM farmers WHERE cpf = ${cpf}
    `;

    if (result.length === 0) {
      return null;
    }

    return this.mapToEntity(result[0]);
  }

  async update(farmer: Farmer): Promise<Farmer> {
    const sql = this.databaseService.getConnection();
    
    await sql`
      UPDATE farmers SET
        email = ${farmer.email},
        full_name = ${farmer.fullName},
        cpf = ${farmer.cpf},
        phone = ${farmer.phone},
        address_street = ${farmer.address.street},
        address_number = ${farmer.address.number},
        address_complement = ${farmer.address.complement},
        address_neighborhood = ${farmer.address.neighborhood},
        address_city = ${farmer.address.city},
        address_state = ${farmer.address.state},
        address_zip_code = ${farmer.address.zipCode},
        address_country = ${farmer.address.country},
        farm_experience = ${farmer.farmExperience},
        certifications = ${JSON.stringify(farmer.certifications)},
        is_active = ${farmer.isActive},
        updated_at = ${farmer.updatedAt}
      WHERE id = ${farmer.id}
    `;

    return farmer;
  }

  async delete(id: string): Promise<void> {
    const sql = this.databaseService.getConnection();
    
    await sql`
      DELETE FROM farmers WHERE id = ${id}
    `;
  }

  async findAll(limit = 50, offset = 0): Promise<Farmer[]> {
    const sql = this.databaseService.getConnection();
    
    const result = await sql`
      SELECT * FROM farmers 
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;

    return result.map(row => this.mapToEntity(row));
  }

  async findByState(state: string): Promise<Farmer[]> {
    const sql = this.databaseService.getConnection();
    
    const result = await sql`
      SELECT * FROM farmers 
      WHERE address_state = ${state}
      ORDER BY created_at DESC
    `;

    return result.map(row => this.mapToEntity(row));
  }

  async findByCertification(certification: string): Promise<Farmer[]> {
    const sql = this.databaseService.getConnection();
    
    const result = await sql`
      SELECT * FROM farmers 
      WHERE certifications @> ${JSON.stringify([certification])}
      ORDER BY created_at DESC
    `;

    return result.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): Farmer {
    const address = new FarmerAddress(
      row.address_street,
      row.address_number,
      row.address_complement,
      row.address_neighborhood,
      row.address_city,
      row.address_state,
      row.address_zip_code,
      row.address_country,
    );

    return new Farmer(
      row.id,
      row.email,
      row.full_name,
      row.cpf,
      row.phone,
      address,
      row.farm_experience,
      row.certifications || [],
      row.is_active,
      new Date(row.created_at),
      new Date(row.updated_at),
    );
  }
}
