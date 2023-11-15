import { Form, Input } from 'antd';
import React from 'react';

function AddEquipmentForm(){
  return (
    <div>
      <Form>
        <Form.Item name='organization' label='Организация'>
          <Input/>
        </Form.Item>
        <Form.Item name='room' label='Кабинет'>
          <Input/>
        </Form.Item>
        <Form.Item name='contacts' label='Контакты'>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </div>
  )
}

export { AddEquipmentForm }