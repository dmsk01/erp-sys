import { BrowserWindow } from 'electron';
import React from 'react';
import { AddEquipmentForm } from 'renderer/components/AddEquipmentForm';

function EquipmentPage() {
  const handleFileOpen = () => {
    window.electron.ipcRenderer.sendMessage('dialog:openFile', []);
  };
  window.electron.ipcRenderer.once('dialog:fileOpened', (arg) => {
    // eslint-disable-next-line no-console
    console.log(arg);
  });
  return (
    <div>
      <h1>Учет техники</h1>
      <button onClick={handleFileOpen} id="open-file" type="button">
        open file
      </button>
      <AddEquipmentForm />
    </div>
  );
}

export { EquipmentPage };
