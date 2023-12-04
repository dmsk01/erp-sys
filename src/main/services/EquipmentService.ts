import { BaseService } from './BaseService';

class EquipmentService extends BaseService {
  constructor(dbFilePath: string) {
    super(dbFilePath, 'equipment');
  }
}

export { EquipmentService };
