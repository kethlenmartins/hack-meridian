import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';

@ApiTags('Portfolios')
@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get portfolios' })
  @ApiResponse({ status: 200, description: 'Portfolios retrieved successfully' })
  async getPortfolios() {
    return this.portfolioService.getPortfolios();
  }
}
