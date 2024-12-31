import { Button, Form, Select } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import React from 'react';

const FilterField = ({ fields }) => {
    const { Option } = Select;
    const [form] = Form.useForm(); // Create form instance

    console.log(fields)

    return (
        <>
            <hr className="mb-4" />
            <Form form={form} className="w-full mb-2 inline-flex gap-2">
                <div className="grid grid-cols-12 w-full gap-4">
                    {fields.map((fieldItem) => {
                        return (
                            <Form.Item
                                key={fieldItem.id}
                                name={fieldItem.id} // Bind field to form with name
                                className='col-span-4 m-0'
                            >
                                <Select size="large" placeholder={`Pilih ${fieldItem.name}`} allowClear>
                                    {fieldItem.options.map((optionItem) => (
                                        <Option key={optionItem.value} value={optionItem.value}>
                                            {optionItem.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        );
                    })}
                </div>
                <Form.Item>
                    <Button
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => form.resetFields()} // Reset all fields
                    >
                        Reset
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default FilterField;