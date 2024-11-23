import { Button, Form, Select } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import React from 'react';

const FilterField = ({ fields, data }) => {
    const { Option } = Select;
    return (
        <>
            <hr className="mb-4" />
            <Form className="w-full mb-4 inline-flex gap-2">
                <div className="grid grid-cols-12 w-full gap-4">
                    {fields.map((fieldItem) => {
                        return (
                            <Form.Item key={fieldItem.id} className='col-span-4 m-0'>
                                <Select size="large" placeholder={`Pilih ${fieldItem.name}`}>
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
                    <Button size="large" color="primary" variant="outlined" icon={<RedoOutlined />}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default FilterField;
