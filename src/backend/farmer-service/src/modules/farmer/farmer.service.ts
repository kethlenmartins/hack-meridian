import { Injectable, Inject } from '@nestjs/common';
import { Farmer } from '../../domain/entities/farmer.entity';
import { FarmerRepository } from '../../domain/repositories/farmer.repository';
import { CreateFarmerUseCase } from '../../domain/usecases/farmer/create-farmer.usecase';
import { UpdateFarmerUseCase } from '../../domain/usecases/farmer/update-farmer.usecase';
import { CreateFarmerDto } from '../../application/dto/create-farmer.dto';
import { UpdateFarmerDto } from '../../application/dto/update-farmer.dto';

@Injectable()
export class FarmerService {
  constructor(
    @Inject('FarmerRepository')
    private readonly farmerRepository: FarmerRepository,
    private readonly createFarmerUseCase: CreateFarmerUseCase,
    private readonly updateFarmerUseCase: UpdateFarmerUseCase,
  ) {}

  async createFarmer(createFarmerDto: CreateFarmerDto): Promise<Farmer> {
    return this.createFarmerUseCase.execute(createFarmerDto);
  }

  async updateFarmer(id: string, updateFarmerDto: UpdateFarmerDto): Promise<Farmer> {
    return this.updateFarmerUseCase.execute(id, updateFarmerDto);
  }

  async getFarmerById(id: string): Promise<Farmer | null> {
    return this.farmerRepository.findById(id);
  }

  async getFarmerByEmail(email: string): Promise<Farmer | null> {
    return this.farmerRepository.findByEmail(email);
  }

  async getAllFarmers(limit = 50, offset = 0): Promise<Farmer[]> {
    return this.farmerRepository.findAll(limit, offset);
  }

  async getFarmersByState(state: string): Promise<Farmer[]> {
    return this.farmerRepository.findByState(state);
  }

  async getFarmersByCertification(certification: string): Promise<Farmer[]> {
    return this.farmerRepository.findByCertification(certification);
  }

  async deleteFarmer(id: string): Promise<void> {
    return this.farmerRepository.delete(id);
  }
}
