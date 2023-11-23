import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function AddEquipmentTypeForm() {
  // const [typeValue, setTypeValue] = useState<string>('');
  const onSubmit = (value: string) => {
    window.electron.ipcRenderer
      .invoke('add-equipment-type', JSON.stringify(value))
      .catch(console.log);
  };
  const [form] = Form.useForm();
  Form.useWatch('equipmentType', form);

  const onFinish = (values: any) => {
    try {
      onSubmit(values.equipmentType.trim());
    } catch (err) {
      console.log('Err from catch add form element', err);
    } finally {
      form.resetFields();
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="equipmentType"
        label="Вид актива"
        rules={[
          {
            required: true,
            message: `Поле не может быть пустым`,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        key="add-item"
        icon={<PlusOutlined rev="default" />}
      >
        Добавить вид
      </Button>
    </Form>
  );
}

export { AddEquipmentTypeForm };
