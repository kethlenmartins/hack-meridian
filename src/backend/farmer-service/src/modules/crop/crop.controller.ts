import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CropService } from './crop.service';

@ApiTags('Crops')
@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Get()
  @ApiOperation({ summary: 'Get crops' })
  @ApiResponse({ status: 200, description: 'Crops retrieved successfully' })
  async getCrops() {
    return this.cropService.getCrops();
  }
}
