import { Farmer } from '../entities/farmer.entity';

export interface FarmerRepository {
  create(farmer: Farmer): Promise<Farmer>;
  findById(id: string): Promise<Farmer | null>;
  findByEmail(email: string): Promise<Farmer | null>;
  findByCpf(cpf: string): Promise<Farmer | null>;
  update(farmer: Farmer): Promise<Farmer>;
  delete(id: string): Promise<void>;
  findAll(limit?: number, offset?: number): Promise<Farmer[]>;
  findByState(state: string): Promise<Farmer[]>;
  findByCertification(certification: string): Promise<Farmer[]>;
}
