export interface Organization {
  id: string;
  title: string;
  contactInfo: string;
}

export interface Room {
  id: string;
  code: string;
  organizationId: string;
}

export interface RoomEquipment {
  id: number;
  equipmentId: number;
  roomId: number;
}
