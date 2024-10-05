import { Form, Modal, Select } from 'antd'
import  SearchPegawai from "../Select/SearchPegawai"
import React from 'react'
const { Option } = Select;

const TambahPegawai = ({ isModalOpen, onClose, onCancel }) => {
  return (
    <Modal title="Cari Pegawai" open={isModalOpen} onClose={onClose} onCancel={onCancel} >
        <Form layout='vertical' className='flex flex-col gap-y-2 mt-6'>
            <Form.Item label="Cari NIP Pegawai" name="nip" className='m-0'> 
                <SearchPegawai placeholder="Cari Pegawai" size="large" />
            </Form.Item>
            <Form.Item label="Cari NIP Pegawai" name="nip" className='m-0'> 
                <Select showSearch placeholder="SKP" size='large'>
                    <Option value="skp1">SKP 1</Option>
                    <Option value="skp2">SKP 2</Option>
                </Select>
            </Form.Item>
        </Form>
    </Modal>
  )
}

export default TambahPegawai