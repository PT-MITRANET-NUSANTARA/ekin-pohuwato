import React from 'react';
import { Tag } from 'antd';

const ItemRow = ({ item, index }) => {
    return (
        <>
            <tr>
                <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>{index + 1}</td>
                <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                    <div className="flex flex-col gap-y-2 text-left">
                        <p>{item.rkt ? item.rkt.name : item.rhk.desc}</p>
                        {/* <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} /> */}
                    </div>
                </td>
                <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                    <div className="flex flex-col gap-y-2 text-left">
                        <p>{item.rkt ? item.rkt.name : item.desc}</p>
                        <Tag color="blue" className="w-fit">
                            {item.klasifikasi ? item.klasifikasi : ''}
                        </Tag>
                        {/* <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} /> */}
                    </div>
                </td>
            </tr>
            {item.aspek?.map((aspek, idx) => (
                <tr key={idx}>
                    <td>{aspek.jenis}</td>
                    <td style={{ maxWidth: '12rem', padding: '8px' }}>
                        <div className="flex flex-col gap-y-2 text-left">
                            <p>{aspek.indikator}</p>
                        </div>
                    </td>
                    <td>{aspek.target_tahunan.target + aspek.target_tahunan.satuan}</td>
                </tr>
            ))}
        </>
    );
};

export default ItemRow;
