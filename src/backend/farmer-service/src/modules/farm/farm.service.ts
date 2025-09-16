import { Injectable } from '@nestjs/common';

@Injectable()
export class FarmService {
  // TODO: Implement farm management logic
  async getFarms() {
    return { message: 'Farm service is working' };
  }
}
