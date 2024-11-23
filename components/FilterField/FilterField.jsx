import { Form, Select } from 'antd';
import React from 'react';

const FilterField = ({ fields, data }) => {
    const { Option } = Select;
    return (
        <>
            <hr className="mb-4" />
            <Form className="w-full mb-4" layout="inline">
                {fields.map((fieldItem) => (
                    <Form.Item key={fieldItem.id} label={fieldItem.name}>
                        <Select placeholder={`Pilih ${fieldItem.name}`}>
                            {fieldItem.options.map((optionItem) => (
                                <Option value={optionItem.value}>{optionItem.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                ))}
            </Form>
        </>
    );
};

export default FilterField;
