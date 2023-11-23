import { Form, Input } from 'antd';
import React from 'react';

function AddOrganizationForm() {
  return (
    <Form>
      <Form.Item name="title" label="Наименование организации">
        <Input />
      </Form.Item>
      <Form.Item name="contacts" label="Контактная информация">
        <Input />
      </Form.Item>
    </Form>
  );
}

export { AddOrganizationForm };
