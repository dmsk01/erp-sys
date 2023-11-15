CREATE TABLE IF NOT EXISTS equipment (
  'equipmentId' INTEGER NOT NULL UNIQUE,
  'model' TEXT NOT NULL,
  'producer' TEXT NOT NULL,
  'equipmentType' TEXT NOT NULL,
  'serialNumber' TEXT NOT NULL,
  'warranty' TEXT NOT NULL,
  'isForNetwork' BOOLEAN NOT NULL,
  PRIMARY KEY('equipmentId' AUTOINCREMENT)
)

CREATE TABLE IF NOT EXISTS organization (
  'organizationId' INTEGER NOT NULL UNIQUE,
  'organizationName' TEXT NOT NULL UNIQUE,
  'room' TEXT NOT NULL,
  'contacts' TEXT NOT NULL,
  "equipmentId"	TEXT NOT NULL,
  PRIMARY KEY('organizationId' AUTOINCREMENT),
  FOREIGN KEY ('equipmentId') REFERENCES equipment('equipmentId') ON DELETE CASCADE ON UPDATE NO ACTION
)