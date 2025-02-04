"use client"

import { EditOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';

const feedbackButton = ({ item, IdPeriode, setModal, formFields, updatePerilaku, fetchData }) => {
    const handleClick = () => {
        setModal({
            trigger: true,
            modalData: { content: item.feedback.isi, category: item.feedback.like },
            title: 'Edit Feedback',
            formFields: formFields,
            onSubmit: async (values) => {
                console.log('HERE');

                const dt = {
                    ...item,
                    feedback: {
                        ...item.feedback,
                        [IdPeriode]: {
                            isi: values.content,
                            like: values.category
                        }
                    }
                };
                console.log('PERILAKU', dt);

                const res = await updatePerilaku(item._id, dt);
                console.log(res);

                if (res.ok) {
                    fetchData();
                    setModal({ trigger: false, modalData: {} });
                    message.success('Data Berhasil Diubah');
                }
            }
        });
    };

    return (
        <Button icon={<EditOutlined />} size="small" onClick={handleClick}>
            Edit
        </Button>
    );
}

export default feedbackButton