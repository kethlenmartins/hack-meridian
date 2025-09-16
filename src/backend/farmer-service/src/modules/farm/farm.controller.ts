import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FarmService } from './farm.service';

@ApiTags('Farms')
@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Get()
  @ApiOperation({ summary: 'Get farms' })
  @ApiResponse({ status: 200, description: 'Farms retrieved successfully' })
  async getFarms() {
    return this.farmService.getFarms();
  }
}
