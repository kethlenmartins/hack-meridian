import { Crop } from '../entities/crop.entity';

export interface CropRepository {
  create(crop: Crop): Promise<Crop>;
  findById(id: string): Promise<Crop | null>;
  findByFarmId(farmId: string): Promise<Crop[]>;
  update(crop: Crop): Promise<Crop>;
  delete(id: string): Promise<void>;
  findByStatus(status: string): Promise<Crop[]>;
  findByPlantingDateRange(startDate: Date, endDate: Date): Promise<Crop[]>;
  findByHarvestDateRange(startDate: Date, endDate: Date): Promise<Crop[]>;
}
