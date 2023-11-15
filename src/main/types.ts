interface Organization {
  organizationId: string;
  organizationName: string;
  room: string;
  contacts: string;
}

interface Equipment {
  equipmentId: string;
  model: string;
  producer: string;
  equipmentType: string;
  serialNumber: string;
  warranty: string;
  isForNetwork: boolean;
}

interface ExploitationDocs {
  expoitaitionOrder: string;
  certificate: string;
  hasFormular: boolean;
}

interface Service {
  individualServiceNumber: string;
}