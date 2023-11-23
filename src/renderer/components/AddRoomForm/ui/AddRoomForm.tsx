import { Form, Input } from 'antd';
import React from 'react';

function AddRoomForm() {
  return (
    <Form>
      <Form.Item name="code" label="Номер комнаты">
        <Input />
      </Form.Item>
      <Form.Item name="organization" label="Организация">
        <Input />
      </Form.Item>
    </Form>
  );
}

export { AddRoomForm };
