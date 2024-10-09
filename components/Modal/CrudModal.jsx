'use client';

import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Upload, message, TimePicker } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

const CrudModal = ({ isModalOpen, data, onClose, title, formFields, onSubmit, type = 'show', children, width }) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (isModalOpen) {
            form.resetFields();
            form.setFieldsValue(data ?? {});
        }
    }, [isModalOpen, data, form]);

    const beforeUpload = (file) => {
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isImage) {
            message.error('You can only upload JPG/PNG file!');
            return Upload.LIST_IGNORE;
        }
        setFileList((prevList) => [...prevList, file]);
        return false;
    };

    const renderFormInput = (field) => {
        const isDisabled = type === 'show' || type === 'delete';
        switch (field.type) {
            case 'text':
                return <Input placeholder={`Masukan ${field.label}`} size="large" disabled={isDisabled} />;
            case 'number':
                return <InputNumber placeholder={`Masukan ${field.label}`} min={field.min} max={field.max} className="w-full" size="large" disabled={isDisabled} />;
            case 'longtext':
                return <TextArea placeholder={field.label} rows={4} disabled={isDisabled} />;
            case 'date':
                return <DatePicker className="w-full" size="large" disabled={isDisabled} />;
            case 'time':
                return <TimePicker placeholder={`Pilih ${field.label}`} className="w-full" size="large" disabled={isDisabled} />;
            case 'upload':
                return (
                    <Upload
                        multiple
                        accept=".jpg,.jpeg,.png"
                        beforeUpload={beforeUpload}
                        fileList={fileList}
                        onRemove={(file) => {
                            setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                );
            case 'select':
                return (
                    <Select size="large" optionLabelProp='label' placeholder="Select a option and change input text above"  allowClear disabled={isDisabled}>
                        {field.options?.map((option, index) => (
                            <Option key={index} value={option.value} label={option.label} >
                                <div className="flex flex-col">
                                    {option.label}
                                    <small style={{ color: '#888' }}>{option.value}</small>
                                </div>
                            </Option>
                        ))}
                    </Select>
                );
            default:
                return null;
        }
    };

    const handleSubmit = (values) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });

        onSubmit(values, type, data?._id, formData);
    };

    const extraContent = React.Children.map(children, (child) => {
        if (child?.type === CrudModal.Extra) {
            return child;
        }
        return null;
    });

    return (
        <Modal width={width} title={title} open={isModalOpen} onClose={onClose} onCancel={onClose} footer={null}>
            {extraContent}
            <Form form={form} layout="vertical" name="crudForm" className="flex flex-col gap-y-2 mt-6" onFinish={handleSubmit}>
                {formFields.map((field, index) => (
                    <Form.Item key={index} label={field.label} name={field.name} className="m-0" rules={field.rules}>
                        {field.type === 'upload' && type === 'show' ? (
                            <div>
                                <img src="/profil.jpg" alt="" className="w-full" />
                            </div>
                        ) : (
                            renderFormInput(field)
                        )}
                    </Form.Item>
                ))}
                {type !== 'show' && type !== 'delete' && (
                    <Form.Item className="mt-2">
                        <Button type="primary" htmlType="submit">
                            Kirim
                        </Button>
                    </Form.Item>
                )}
                {type === 'delete' && (
                    <Form.Item className="mt-2">
                        <Button type="primary" danger htmlType="submit">
                            Delete
                        </Button>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

CrudModal.Extra = ({ children }) => {
    return <div>{children}</div>;
};

export default CrudModal;
