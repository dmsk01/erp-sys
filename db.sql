CREATE TABLE IF NOT EXISTS equipment (
  'id' INTEGER NOT NULL UNIQUE,
  'docsId' INTEGER NOT NULL,
  'model' TEXT NOT NULL,
  'isn' TEXT NOT NULL,
  'sn' TEXT NOT NULL,
  'madeBy' TEXT NOT NULL,
  'type' TEXT NOT NULL,
  'warranty' TEXT NOT NULL,
  'isForNetwork' TEXT NOT NULL,
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

-- Equipment type

CREATE TABLE IF NOT EXISTS equipmentType (
  'id' INTEGER NOT NULL UNIQUE,
  'type' TEXT NOT NULL,
  PRIMARY KEY('id' AUTOINCREMENT)
)

INSERT INTO equipmentType (type) VALUES ('mfu');
