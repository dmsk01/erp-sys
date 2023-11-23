export interface Organization {
  id: string;
  title: string;
  contactInfo: string;
}

export interface Rooms {
  id: string;
  code: string;
  organization_id: string;
}

export interface RoomEquipment {
  roomId: string;
  equipmentId: string;
}
