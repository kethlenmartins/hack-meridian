import { Injectable } from '@nestjs/common';

@Injectable()
export class InvestorService {
  // TODO: Implement investor management logic
  async getInvestors() {
    return { message: 'Investor service is working' };
  }
}
