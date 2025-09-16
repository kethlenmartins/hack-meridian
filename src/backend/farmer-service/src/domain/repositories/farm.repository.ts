import { Farm } from '../entities/farm.entity';

export interface FarmRepository {
  create(farm: Farm): Promise<Farm>;
  findById(id: string): Promise<Farm | null>;
  findByFarmerId(farmerId: string): Promise<Farm[]>;
  update(farm: Farm): Promise<Farm>;
  delete(id: string): Promise<void>;
  findByLocation(state: string, city?: string): Promise<Farm[]>;
  findBySoilType(soilType: string): Promise<Farm[]>;
  findByArea(minArea: number, maxArea?: number): Promise<Farm[]>;
}
