"use client"

import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

const CrudModal = ({ isModalOpen, data, onClose, title, formFields, onSubmit, type = 'show', children, width }) => {
    const [form] = Form.useForm();
    const { Option } = Select;

    useEffect(() => {
        if (isModalOpen) {
            form.resetFields();
            form.setFieldsValue(data ?? {});  // Reset form with the provided data or empty object
        }
    }, [isModalOpen, data, form]);

    // Render input sesuai dengan type field
    const renderFormInput = (field) => {
        const isDisabled = type === 'show' || type === 'delete'; // Disable input ketika show atau delete
        switch (field.type) {
            case 'text':
                return <Input placeholder={`Masukan ${field.label}`} size="large" disabled={isDisabled} />;
            case 'number':
                return <InputNumber placeholder={`Masukan ${field.label}`} min={field.min} max={field.max} className="w-full" size="large" disabled={isDisabled} />;
            case 'longtext':
                return <TextArea placeholder={field.label} rows={4} disabled={isDisabled} />;
            case 'date':
                return <DatePicker className="w-full" size="large" disabled={isDisabled} />;
            case 'select':
                return (
                    <Select size="large" placeholder={`Pilih ${field.label}`} allowClear disabled={isDisabled}>
                        {field.options.map((option, index) => (
                            <Option key={index} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );
            default:
                return null;
        }
    };

    const handleSubmit = (values) => {
        onSubmit(values, type, data?._id);
    };

    const extraContent = React.Children.map(children, (child) => {
        if(child?.type === CrudModal.Extra) {
            return child;
        }

        return null
    } )

    return (
        <Modal width={width} title={title} open={isModalOpen} onClose={onClose} onCancel={onClose} footer={null}>
            {extraContent}
            <Form form={form} layout="vertical" name="crudForm" className="flex flex-col gap-y-2 mt-6" onFinish={handleSubmit}>
                {formFields.map((field, index) => (
                    <Form.Item key={index} label={field.label} name={field.name} className="m-0" rules={field.rules}>
                        {renderFormInput(field)}
                    </Form.Item>
                ))}
                {/* Tampilkan tombol "Kirim" hanya jika type bukan 'show' atau 'delete' */}
                {type !== 'show' && type !== 'delete' && (
                    <Form.Item className='mt-2'>
                        <Button type="primary" htmlType="submit">
                            Kirim
                        </Button>
                    </Form.Item>
                )}
                {/* Tampilkan tombol "Delete" jika type adalah 'delete' */}
                {type === 'delete' && (
                    <Form.Item className='mt-2'>
                        <Button type="primary" danger htmlType="submit">
                            Delete
                        </Button>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

CrudModal.Extra = ({children}) => {
    return <div>{children}</div>
}

export default CrudModal;
