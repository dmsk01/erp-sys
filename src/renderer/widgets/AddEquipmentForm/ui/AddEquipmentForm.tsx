import React from 'react';
import { AddForm } from 'renderer/shared/AddForm';

const formFields = [
  {
    fieldName: 'model',
    label: 'Модель',
  },
  {
    fieldName: 'docsId',
    label: 'Документы',
  },
  {
    fieldName: 'serialNumber',
    label: 'Серийный номер',
  },
  {
    fieldName: 'producerId',
    label: 'Производитель',
  },
  {
    fieldName: 'typeId',
    label: 'Тип актива',
  },
  {
    fieldName: 'assetVariety',
    label: 'Вид актива',
  },
  {
    fieldName: 'warranty',
    label: 'Гарантия',
  },
  {
    fieldName: 'serviceHistoryId',
    label: 'История обслуживания',
  },
  {
    fieldName: 'isWorking',
    label: 'Исправлен/неисправлен',
  },
  {
    fieldName: 'isForNetwork',
    label: 'Сетевое/несетевое',
  },
];

function AddEquipmentForm() {
  const onSubmit = async (values: any) => {
    const resp = await window.electron.ipcRenderer
      .invoke('add-equipment', values)
      .catch(console.log);

    console.log(resp);
  };
  return (
    <AddForm
      onSubmit={onSubmit}
      formName="equipmentType"
      formFields={formFields}
    />
  );
}

export { AddEquipmentForm };
