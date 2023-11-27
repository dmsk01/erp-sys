import { Producer } from 'main/types';
import React from 'react';
import { AddForm } from 'renderer/shared/AddForm';

const formFields = [
  {
    fieldName: 'name',
    label: 'Производитель',
  },
];

function AddProducerForm() {
  const onSubmit = async (values: Producer) => {
    const resp = await window.electron.ipcRenderer
      .invoke('add-producer', values)
      .catch(console.log);

    console.log(resp);
  };
  return (
    <AddForm
      onSubmit={onSubmit}
      formName="producerType"
      formFields={formFields}
    />
  );
}

export { AddProducerForm };
