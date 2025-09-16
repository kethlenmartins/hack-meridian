import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvestorService } from './investor.service';

@ApiTags('Investors')
@Controller('investors')
export class InvestorController {
  constructor(private readonly investorService: InvestorService) {}

  @Get()
  @ApiOperation({ summary: 'Get investors' })
  @ApiResponse({ status: 200, description: 'Investors retrieved successfully' })
  async getInvestors() {
    return this.investorService.getInvestors();
  }
}
