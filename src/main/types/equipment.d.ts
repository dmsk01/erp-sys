export interface Equipment {
  id: string;
  model: string;
  docsId: number;
  serialNumber: string;
  producerId: number;
  typeId: number;
  assetVariety: string;
  warranty: string;
  serviceHistory: number;
  isWorking: boolean;
  isForNetwork: boolean;
}
