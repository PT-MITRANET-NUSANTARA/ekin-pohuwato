'use client';

import { store } from '@/controller/FeedbackPerilakuController';
import { perilaku } from '@/utils/blueprint';
import { EditOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';

const feedbackButton = ({ item, IdPeriode, setModal, formFields, fetchData, IdSKP }) => {
    const handleClick = () => {
        setModal({
            trigger: true,
            modalData: { content: item.feedback.isi, category: item.feedback.like },
            title: 'Edit Feedback',
            formFields: formFields,
            onSubmit: async (values) => {
                console.log('HERE');

                const dt = {
                    isi: values.content,
                    like: values.category,
                    perilaku: item._id,
                    periodePenilaian: IdPeriode,
                    penilai: IdSKP
                };
                console.log('PERILAKU', dt);

                const res = await store( dt);
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
};

export default feedbackButton;
