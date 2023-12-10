import { Equipment } from 'main/types';
import { BaseService } from './BaseService';

class EquipmentService extends BaseService<Equipment> {
  constructor(dbFilePath: string) {
    super(dbFilePath);
  }

  protected getTableName(): string {
    return 'equipment';
  }

  protected mapToInterface(record: any): Equipment {
    return {
      id: record.id,
      model: record.model,
      docsId: record.docsId,
      serialNumber: record.serialNumber,
      producerId: record.producerId,
      typeId: record.typeId,
      assetVariety: record.assetVariety,
      warranty: record.warranty,
      serviceHistory: record.serviceHistory,
      isWorking: record.isWorking,
      isForNetwork: record.isForNetwork,
    };
  }
  protected mapToDatabase(record: Equipment): unknown[] {
    console.log('Map method ->', record);
    return [
      record.model,
      record.docsId,
      record.serialNumber,
      record.producerId,
      record.typeId,
      record.assetVariety,
      record.warranty,
      record.serviceHistory,
      record.isWorking,
      record.isForNetwork,
    ];
  }
}

export { EquipmentService };
