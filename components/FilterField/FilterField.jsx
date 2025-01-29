import { Button, DatePicker, Form, Input, InputNumber, Rate, Select, TimePicker } from 'antd';
import { FilterOutlined, RedoOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import TextArea from 'antd/es/input/TextArea';

const FilterField = ({ fields, onSubmit = () => { } }) => {
    const { Option } = Select;
    const [form] = Form.useForm(); // Create form instance
    const [selectValues, setSelectValues] = useState({});

    const handleSelectChange = (value, fieldName) => {
        setSelectValues((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const renderFormInput = (field) => {
        switch (field.type) {
            case 'text':
                return <Input placeholder={`Enter ${field.label}`} size="large" {...field.extra} />;
            case 'number':
                return <InputNumber placeholder={`Enter ${field.label}`} min={field.min} max={field.max} className="w-full" size="large" {...field.extra} />;
            case 'longtext':
                return <TextArea placeholder={field.label} rows={4} />;
            case 'date':
                return <DatePicker className="w-full" size="large" {...field.extra} />;
            case 'time':
                return <TimePicker placeholder={`Select ${field.label}`} className="w-full" size="large" {...field.extra} />;
            case 'rating':
                return <Rate className="w-full" size="large" {...field.extra} />;
            case 'select':
                const parentValue = field.parentField ? selectValues[field.parentField] : null;
                const options = field.options?.filter((option) => !field.parentField || option.id_option_parent === parentValue);

                return (
                    <Select
                        mode={field.mode}
                        size="large"
                        placeholder={`Select ${field.label}`}
                        allowClear
                        disabled={(field.parentField && !parentValue)}
                        onChange={(value) => handleSelectChange(value, field.name)}
                        optionLabelProp="label"
                        {...field.extra}
                        showSearch
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        filterOption={(input, option) =>
                            option?.label?.toLowerCase().includes(input.toLowerCase()) ||
                            option?.value?.toString().toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {options?.map((option) => (
                            <Option key={option.id} value={option.value} label={option.label}>
                                <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <small>{option.value}</small>
                                </div>
                            </Option>
                        ))}
                    </Select>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <hr className="mb-4" />
            <Form form={form} onFinish={onSubmit} className="w-full mb-2 inline-flex gap-2" layout='vertical'>
                <div className="grid grid-cols-12 w-full gap-4">
                    {fields?.map((field, index) => (
                        <Form.Item key={index} name={field.name} className='col-span-4 m-0' label={`Pilih ${field.name}`} >
                            {renderFormInput(field)}
                        </Form.Item>
                    ))}
                </div>
                <Form.Item>
                    <Button
                        size="large"
                        variant='solid'
                        color='primary'
                        htmlType='submit'
                        icon={<FilterOutlined />}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => {
                            form.resetFields();
                            setSelectValues({});
                            onSubmit({});
                        }} // Reset all fields
                    />
                </Form.Item>
            </Form>
        </>
    );
};

export default FilterField;
