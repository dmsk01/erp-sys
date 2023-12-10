import { Producer } from 'main/types';
import { BaseService } from './BaseService';

class ProducersService extends BaseService<Producer> {
  constructor(dbFilePath: string) {
    super(dbFilePath, 'producers');
  }
}

export { ProducersService };
