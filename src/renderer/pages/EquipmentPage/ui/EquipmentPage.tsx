import { BrowserWindow, ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import {
  AddEquipmentForm,
  AddProducerForm,
  DataTable,
  TableTabs,
} from 'renderer/widgets';

function EquipmentPage() {
  const [equipment, setEquipment] = useState<any>(null);
  useEffect(() => {
    window.electron.ipcRenderer.on('update-data', (newData) => {
      console.log(newData);

      setEquipment(newData);
    });
  }, []);
  // const handleFileOpen = () => {
  //   window.electron.ipcRenderer.sendMessage('dialog:openFile', []);
  // };
  // window.electron.ipcRenderer.once('dialog:fileOpened', (arg) => {
  //   // eslint-disable-next-line no-console
  //   console.log(arg);
  // });

  return (
    <div>
      <h1>Учет техники</h1>
      {equipment && JSON.stringify(equipment)}
      <TableTabs />
      {/* <button onClick={handleFileOpen} id="open-file" type="button">
        open file
      </button> */}
      {/* <AddEquipmentTypeForm /> */}
      <AddEquipmentForm />

      {/* <AddProducerForm /> */}
    </div>
  );
}

export { EquipmentPage };
