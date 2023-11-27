export interface Equipment {
  id: string;
  model: string;
  docsId?: number;
  serialNumber: string;
  producerId: Producer;
  typeId: number;
  assetVariety: string;
  warranty: string;
  serviceHistory?: number;
  isWorking: boolean;
  isForNetwork: boolean;
}

export interface Producer {
  name: string;
}
