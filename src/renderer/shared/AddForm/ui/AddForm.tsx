import React, { FC } from 'react';
import { Button, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface FormField {
  fieldName: string;
  label?: string;
}

interface AddFormProps {
  formFields: FormField[];
  formName: string;
  onSubmit: (values) => Promise<void>;
}

const AddForm: FC<AddFormProps> = (props) => {
  const { formFields, formName, onSubmit } = props;
  const [form] = Form.useForm();
  Form.useWatch(formName, form);

  const onFinish = (values) => {
    try {
      onSubmit(values);
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
      {formFields.map((item) => (
        <Form.Item
          key={item.fieldName}
          name={item.fieldName}
          label={item.label}
          initialValue={Math.random().toString()}
          rules={[
            {
              required: true,
              message: `Поле не может быть пустым`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ))}
      <Button
        type="primary"
        htmlType="submit"
        key="add-item"
        icon={<PlusOutlined rev="default" />}
      >
        Добавить
      </Button>
    </Form>
  );
};

export { AddForm };
