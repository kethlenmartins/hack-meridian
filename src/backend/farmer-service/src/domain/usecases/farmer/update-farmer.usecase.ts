import { Injectable, Inject } from '@nestjs/common';
import { Farmer, FarmerAddress } from '../../entities/farmer.entity';
import { FarmerRepository } from '../../repositories/farmer.repository';
import { UpdateFarmerDto } from '../../../application/dto/update-farmer.dto';

@Injectable()
export class UpdateFarmerUseCase {
  constructor(
    @Inject('FarmerRepository')
    private readonly farmerRepository: FarmerRepository,
  ) {}

  async execute(id: string, updateFarmerDto: UpdateFarmerDto): Promise<Farmer> {
    // Find existing farmer
    const existingFarmer = await this.farmerRepository.findById(id);
    if (!existingFarmer) {
      throw new Error('Farmer not found');
    }

    // Check if email is being changed and if it's already taken
    if (updateFarmerDto.email && updateFarmerDto.email !== existingFarmer.email) {
      const farmerWithEmail = await this.farmerRepository.findByEmail(updateFarmerDto.email);
      if (farmerWithEmail) {
        throw new Error('Email already taken by another farmer');
      }
    }

    // Check if CPF is being changed and if it's already taken
    if (updateFarmerDto.cpf && updateFarmerDto.cpf !== existingFarmer.cpf) {
      const farmerWithCpf = await this.farmerRepository.findByCpf(updateFarmerDto.cpf);
      if (farmerWithCpf) {
        throw new Error('CPF already taken by another farmer');
      }
    }

    // Create new address if provided
    let address = existingFarmer.address;
    if (updateFarmerDto.address) {
      address = new FarmerAddress(
        updateFarmerDto.address.street,
        updateFarmerDto.address.number,
        updateFarmerDto.address.complement,
        updateFarmerDto.address.neighborhood,
        updateFarmerDto.address.city,
        updateFarmerDto.address.state,
        updateFarmerDto.address.zipCode,
        updateFarmerDto.address.country,
      );
    }

    // Update farmer
    const updatedFarmer = existingFarmer.updateProfile({
      fullName: updateFarmerDto.fullName,
      phone: updateFarmerDto.phone,
      address,
      farmExperience: updateFarmerDto.farmExperience,
      certifications: updateFarmerDto.certifications,
    });

    // Save to repository
    return this.farmerRepository.update(updatedFarmer);
  }
}
