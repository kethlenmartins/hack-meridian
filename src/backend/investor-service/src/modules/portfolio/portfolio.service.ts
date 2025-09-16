import { Injectable } from '@nestjs/common';

@Injectable()
export class PortfolioService {
  // TODO: Implement portfolio management logic
  async getPortfolios() {
    return { message: 'Portfolio service is working' };
  }
}
