import { Module } from '@nestjs/common';
import { FarmerController } from './farmer.controller';
import { FarmerService } from './farmer.service';
import { CreateFarmerUseCase } from '../../domain/usecases/farmer/create-farmer.usecase';
import { UpdateFarmerUseCase } from '../../domain/usecases/farmer/update-farmer.usecase';
import { PostgresFarmerRepository } from '../../infrastructure/repositories/postgres-farmer.repository';
import { FarmerRepository } from '../../domain/repositories/farmer.repository';

@Module({
  controllers: [FarmerController],
  providers: [
    FarmerService,
    CreateFarmerUseCase,
    UpdateFarmerUseCase,
    {
      provide: 'FarmerRepository',
      useClass: PostgresFarmerRepository,
    },
  ],
  exports: [FarmerService],
})
export class FarmerModule {}
