import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FarmerService } from './farmer.service';
import { CreateFarmerDto } from '../../application/dto/create-farmer.dto';
import { UpdateFarmerDto } from '../../application/dto/update-farmer.dto';

@ApiTags('Farmers')
@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new farmer' })
  @ApiResponse({ status: 201, description: 'Farmer created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createFarmer(@Body() createFarmerDto: CreateFarmerDto) {
    return this.farmerService.createFarmer(createFarmerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all farmers' })
  @ApiResponse({ status: 200, description: 'Farmers retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of farmers to return' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of farmers to skip' })
  async getAllFarmers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.farmerService.getAllFarmers(limit, offset);
  }

  @Get('state/:state')
  @ApiOperation({ summary: 'Get farmers by state' })
  @ApiResponse({ status: 200, description: 'Farmers retrieved successfully' })
  async getFarmersByState(@Param('state') state: string) {
    return this.farmerService.getFarmersByState(state);
  }

  @Get('certification/:certification')
  @ApiOperation({ summary: 'Get farmers by certification' })
  @ApiResponse({ status: 200, description: 'Farmers retrieved successfully' })
  async getFarmersByCertification(@Param('certification') certification: string) {
    return this.farmerService.getFarmersByCertification(certification);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get farmer by ID' })
  @ApiResponse({ status: 200, description: 'Farmer retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Farmer not found' })
  async getFarmerById(@Param('id') id: string) {
    return this.farmerService.getFarmerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update farmer' })
  @ApiResponse({ status: 200, description: 'Farmer updated successfully' })
  @ApiResponse({ status: 404, description: 'Farmer not found' })
  async updateFarmer(
    @Param('id') id: string,
    @Body() updateFarmerDto: UpdateFarmerDto,
  ) {
    return this.farmerService.updateFarmer(id, updateFarmerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete farmer' })
  @ApiResponse({ status: 204, description: 'Farmer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Farmer not found' })
  async deleteFarmer(@Param('id') id: string) {
    await this.farmerService.deleteFarmer(id);
  }
}
