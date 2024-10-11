'use client';

import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Upload, message, TimePicker } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

const CrudModal = ({ isModalOpen, data, onClose, title, formFields, onSubmit, type = 'show', children, width }) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (isModalOpen) {
            form.resetFields(); // Reset form fields when the modal is opened
        }
    }, [isModalOpen, form]);

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
                return <Input placeholder={`Enter ${field.label}`} size="large" disabled={isDisabled} />;
            case 'number':
                return <InputNumber placeholder={`Enter ${field.label}`} min={field.min} max={field.max} className="w-full" size="large" disabled={isDisabled} />;
            case 'longtext':
                return <TextArea placeholder={field.label} rows={4} disabled={isDisabled} />;
            case 'date':
                return <DatePicker className="w-full" size="large" disabled={isDisabled} />;
            case 'time':
                return <TimePicker placeholder={`Select ${field.label}`} className="w-full" size="large" disabled={isDisabled} />;
            case 'upload':
                return (
                    <Upload
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf"
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
                    <Select size="large" mode={field.mode ? field.mode : ''} placeholder="Select an option" allowClear onChange={(value) => form.setFieldsValue({ [field.name]: value })} disabled={isDisabled}>
                        {field.options?.map((option, index) => (
                            <Option key={index} value={option.value} label={option.label}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );
            case 'repeater':
                return (
                    <Form.List name={field.name}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <div key={key} className="flex items-center gap-2 mb-2">
                                        {Object.keys(field.obj).map((subFieldKey) => {
                                            const subField = field.obj[subFieldKey];
                                            return (
                                                <Form.Item key={`${key}-${subFieldKey}`} {...restField} name={[name, subFieldKey]} fieldKey={[fieldKey, subFieldKey]} rules={[{ required: true, message: `Please enter ${subFieldKey}` }]}>
                                                    {(() => {
                                                        switch (subField) {
                                                            case 'number':
                                                                return <InputNumber placeholder={subFieldKey} size="large" className="w-full" disabled={isDisabled} />;
                                                            case 'longtext':
                                                                return <TextArea placeholder={subFieldKey} rows={4} size="large" disabled={isDisabled} />;
                                                            case 'select':
                                                                return (
                                                                    <Select placeholder={subFieldKey} size="large" disabled={isDisabled}>
                                                                        {(field.options || []).map((option, index) => (
                                                                            <Option key={index} value={option.value}>
                                                                                {option.label}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                );
                                                            case 'text':
                                                            default:
                                                                return <Input placeholder={subFieldKey} size="large" disabled={isDisabled} />;
                                                        }
                                                    })()}
                                                </Form.Item>
                                            );
                                        })}
                                        {type !== 'show' && type !== 'delete' && <MinusCircleOutlined onClick={() => remove(name)} />}
                                    </div>
                                ))}
                                {type !== 'show' && type !== 'delete' && (
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Item
                                        </Button>
                                    </Form.Item>
                                )}
                            </>
                        )}
                    </Form.List>
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
                        {renderFormInput(field)}
                    </Form.Item>
                ))}
                {type !== 'show' && type !== 'delete' && (
                    <Form.Item className="mt-2">
                        <Button type="primary" htmlType="submit">
                            Submit
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
