import React from 'react';
import { Tag, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ItemRow = ({ item, index, onEdit, onDelete, isJT = false }) => {
    console.log('ItemRow item:', item);

    // Get aspects directly from the UserRHK
    const aspects = item.aspects || [];

    console.log('Aspects found:', aspects);

    return (
        <>
            <tr>
                <td rowSpan={aspects.length > 0 ? aspects.length + 1 : 1}>{index + 1}</td>
                {!isJT && (
                    <td rowSpan={aspects.length > 0 ? aspects.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                        <div className="flex flex-col gap-y-2 text-left">
                            {item.rkts && item.rkts.length > 0 ? (
                                <div>
                                    {item.rkts.map((rkt, idx) => (
                                        <div key={idx} className="mb-1">
                                            <p>{typeof rkt === 'object' ? rkt.name || 'RKT' : 'RKT'}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>{item.parentUserRHK ? item.parentUserRHK.description : ''}</p>
                            )}
                        </div>
                    </td>
                )}
                <td rowSpan={aspects.length > 0 ? aspects.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                    <div className="flex flex-col gap-y-2 text-left">
                        <div className="flex justify-between">
                            <p>{item.description}</p>
                            {isJT && (
                                <div className="flex gap-1">
                                    <Button type="text" size="small" icon={<EditOutlined />} onClick={onEdit} />
                                    <Popconfirm title="Hapus RHK" description="Apakah Anda yakin ingin menghapus RHK ini?" onConfirm={onDelete} okText="Ya" cancelText="Tidak">
                                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </div>
                            )}
                        </div>
                        {/* Display penugasan if available */}
                        {item.penugasan && item.penugasan.trim() !== '' && (
                            <div className="mt-1">
                                <Tag color="green" className="w-fit">
                                    Penugasan: {item.penugasan}
                                </Tag>
                            </div>
                        )}
                        <Tag color="blue" className="w-fit">
                            {item.klasifikasi ? item.klasifikasi : ''}
                        </Tag>
                    </div>
                </td>
            </tr>
            {aspects.map((aspek, idx) => (
                <tr key={idx}>
                    <td>{aspek.jenis}</td>
                    <td style={{ maxWidth: '12rem', padding: '8px' }}>
                        <div className="flex flex-col gap-y-2 text-left">
                            <p>{aspek.indikator}</p>
                        </div>
                    </td>
                    <td>{aspek.target_tahunan && aspek.target_tahunan.target + (aspek.target_tahunan.satuan || '')}</td>
                </tr>
            ))}
        </>
    );
};

export default ItemRow;
