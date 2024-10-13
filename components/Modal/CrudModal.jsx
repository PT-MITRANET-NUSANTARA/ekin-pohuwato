'use client';

import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Upload, message, TimePicker } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const CrudModal = ({ isModalOpen, data, onClose, title, formFields, onSubmit, type = 'show', children, width }) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [fileList, setFileList] = useState([]);
    const [imageList, setImageList] = useState([]);

    useEffect(() => {
        if (isModalOpen) {
            if (data) {
                const formattedData = Object.fromEntries(
                    Object.entries(data).map(([key, value]) => {
                        if (typeof value === 'string' && !isNaN(Date.parse(value))) {
                            return [key, dayjs(value)];
                        }
                        return [key, value];
                    })
                );
                const imgKey = formFields?.find((field) => field.type === 'upload')?.name;
                if (imgKey) {
                    const imgList = data[imgKey]
                    setImageList(imgList);
                    setFileList(imgList);

                }
                form.setFieldsValue(formattedData);
            } else {
                form.resetFields();
            }
        }
    }, [isModalOpen, form, data]);

    console.log('FILE', fileList);
    console.log('IMAGE', imageList);

    // Fungsi untuk menangani perubahan upload
    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    // Fungsi untuk mengunggah file menggunakan fetch API
    const handleUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('document', file);

        try {
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                message.success(`${file.name} file uploaded successfully.`);

                // Update the file list using the previous state
                setFileList((prevList) => {
                    const newList = prevList.map((item) => (item.uid === file.uid ? { ...item, fileId: data.fileId } : item));
                    console.log('Updated fileList', newList);
                    return newList;
                });

                // Add the new fileId to the imageList as an object with uuid
                setImageList((prevImageList) => [...prevImageList, { uid: file.uid, fileId: data.fileId }]);

                onSuccess('OK');
            } else {
                message.error(`${file.name} file upload failed.`);
                onError(new Error('Upload failed'));
            }
        } catch (error) {
            message.error(`${file.name} file upload failed.`);
            onError(error);
        }
    };

    // Fungsi untuk menangani penghapusan file
    const handleRemove = async (file) => {
        console.log('DELETE', file);

        try {
            // Find the fileId from imageList using the file.uid or file.fileId
            console.log('IMAGELIST', imageList);
            console.log('FILE', file);

            const imageId = imageList.find((img) => img.uid === file.uid).fileId;
            console.log('IMAGEID', imageId);

            if (!imageId) {
                message.error(`No file ID found for ${file.name}, cannot delete.`);
                return;
            }

            // Proceed to delete the file using the fileId
            const response = await fetch(`http://localhost:3001/upload/${imageId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                message.success(`${file.name} deleted successfully.`);

                setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));

                // Remove the corresponding fileId from imageList
                setImageList((prevImageList) => prevImageList.filter((img) => img.fileId !== imageId));
            } else {
                const errorData = await response.json();
                message.error(`Failed to delete ${file.name}: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error during file deletion:', error);
            message.error(`Failed to delete ${file.name}. Please try again later.`);
        }
    };

    console.log(data);

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
                                    <div key={key} className="flex items-start gap-2 mb-2">
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
            case 'upload':
                return (
                    <Upload
                        listType="picture"
                        multiple
                        fileList={fileList}
                        onChange={handleUploadChange}
                        customRequest={handleUpload}
                        onRemove={handleRemove} // Handle file deletion
                    >
                        <Button icon={<UploadOutlined />}>Upload Files</Button>
                    </Upload>
                );
            default:
                return null;
        }
    };

    const handleSubmit = (values) => {
        const arrayListImage = (imageList || []).map((img) => img.fileId);
        onSubmit(values, type, data?._id, imageList, fileList);
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
                {formFields?.map((field, index) => (
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
