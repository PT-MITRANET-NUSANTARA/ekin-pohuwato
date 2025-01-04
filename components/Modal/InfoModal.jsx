import { Descriptions, List, Modal, Table, Typography } from 'antd';
import React from 'react';

const InfoModal = ({ title, isModalOpen, close, data, type = 'paragraf', isLoading = false, columns = [], width = 520 , ...props}) => {
    const jsxs = {
        // 'paragraf': (
        //     <div className="flex flex-col gap-4">
        //         {data.title && <Typography.Title level={data.title.level || 1}>{data.title.text}</Typography.Title>}
        //         <p>{data.content}</p>
        //     </div>
        // ),
        'list': <List bordered dataSource={data} renderItem={(item) => <List.Item>{item}</List.Item>} />,
        'table': <Table columns={columns} dataSource={data} loading={isLoading} />,
        'desc': <Descriptions bordered column={1} items={data ?? []} layout="horizontal" />
    };

    return (
        <Modal width={width} title={title} open={isModalOpen} onClose={close} onCancel={close} footer={null} {...props}>
            <div className="mt-4">{jsxs[type]}</div>
        </Modal>
    );
};

export default InfoModal;
