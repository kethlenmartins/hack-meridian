import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvestmentService } from './investment.service';

@ApiTags('Investments')
@Controller('investments')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get investments' })
  @ApiResponse({ status: 200, description: 'Investments retrieved successfully' })
  async getInvestments() {
    return this.investmentService.getInvestments();
  }
}
