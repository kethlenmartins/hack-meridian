import { Injectable } from '@nestjs/common';

@Injectable()
export class CropService {
  // TODO: Implement crop management logic
  async getCrops() {
    return { message: 'Crop service is working' };
  }
}
