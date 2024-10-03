import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';
import dayjs from 'dayjs';

const CrudModal = ({ isModalOpen, data, onClose, title, formFields, onSubmit }) => {
    const [form] = Form.useForm();
    const { Option } = Select;

    console.log(dayjs('2015-01-01'));
    const renderFormInput = (field) => {
        switch (field.type) {
            case 'text':
                return <Input size="large" />;
            case 'number':
                return <InputNumber min={field.min} max={field.max} className="w-full" size="large" />;
            case 'longtext':
                return <TextArea rows={4} />;
            case 'date':
                return <DatePicker className='w-full' size='large' />;
            case 'select':
                return (
                    <>
                        <Select size='large' placeholder="Select a option and change input text above" allowClear>
                            {field.options.map((option, index) => (
                                <Option key={index} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Modal title={title} open={isModalOpen} onClose={onClose} onCancel={onClose}  footer={null}>
            {data ? ( // Check if data is not null
                <>
                    <Form form={form} layout="vertical" name="jhgjhg" className="flex flex-col gap-y-2 mt-6" onFinish={onSubmit} initialValues={data}>
                        {formFields.map((field, index) => (
                            <Form.Item key={index} label={field.label} name={field.name} className="m-0" rules={formFields.rules}>
                                {renderFormInput(field)}
                            </Form.Item>
                        ))}
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Kirim
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            ) : (
                <>
                    <Form form={form} layout="vertical" name="jhgjhg" className="flex flex-col gap-y-2 mt-6" onFinish={onSubmit}>
                        {formFields.map((field, index) => (
                            <Form.Item key={index} label={field.label} name={field.name} className="m-0" rules={formFields.rules}>
                                {renderFormInput(field)}
                            </Form.Item>
                        ))}
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Kirim
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}
        </Modal>
    );
};

export default CrudModal;
