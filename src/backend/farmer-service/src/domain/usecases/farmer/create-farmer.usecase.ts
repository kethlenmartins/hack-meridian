import { Injectable, Inject } from '@nestjs/common';
import { Farmer, FarmerAddress } from '../../entities/farmer.entity';
import { FarmerRepository } from '../../repositories/farmer.repository';
import { CreateFarmerDto } from '../../../application/dto/create-farmer.dto';

@Injectable()
export class CreateFarmerUseCase {
  constructor(
    @Inject('FarmerRepository')
    private readonly farmerRepository: FarmerRepository,
  ) {}

  async execute(createFarmerDto: CreateFarmerDto): Promise<Farmer> {
    // Check if farmer already exists
    const existingFarmer = await this.farmerRepository.findByEmail(createFarmerDto.email);
    if (existingFarmer) {
      throw new Error('Farmer with this email already exists');
    }

    const existingCpf = await this.farmerRepository.findByCpf(createFarmerDto.cpf);
    if (existingCpf) {
      throw new Error('Farmer with this CPF already exists');
    }

    // Create farmer address
    const address = new FarmerAddress(
      createFarmerDto.address.street,
      createFarmerDto.address.number,
      createFarmerDto.address.complement,
      createFarmerDto.address.neighborhood,
      createFarmerDto.address.city,
      createFarmerDto.address.state,
      createFarmerDto.address.zipCode,
      createFarmerDto.address.country,
    );

    // Create farmer entity
    const farmer = Farmer.create({
      id: createFarmerDto.id,
      email: createFarmerDto.email,
      fullName: createFarmerDto.fullName,
      cpf: createFarmerDto.cpf,
      phone: createFarmerDto.phone,
      address,
      farmExperience: createFarmerDto.farmExperience,
      certifications: createFarmerDto.certifications,
    });

    // Save to repository
    return this.farmerRepository.create(farmer);
  }
}
