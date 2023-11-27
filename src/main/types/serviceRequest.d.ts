export interface SeviceRequest {
  id: string;
  room: string;
  person: string;
  individualSerialNumber: string;
  problemDescription: string;
  requestNumber: string;
  requestPublicDate: Date;
  advanceDate: Date;
  fulfilmentDate: Date;
}
