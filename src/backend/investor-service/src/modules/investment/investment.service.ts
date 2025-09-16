import { Injectable } from '@nestjs/common';

@Injectable()
export class InvestmentService {
  // TODO: Implement investment management logic
  async getInvestments() {
    return { message: 'Investment service is working' };
  }
}
