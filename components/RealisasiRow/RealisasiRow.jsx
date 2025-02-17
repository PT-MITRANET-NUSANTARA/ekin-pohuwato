'use client';
import { useEffect, useState } from 'react';
import { getRealisasi } from '@/controller/RHKController';
import { Button, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { update } from '@/controller/AspekController';
import useNotification from '@/app/hook/useNotification';

const RealisasiRow = ({ item, aspek, IdPeriode, setModal, FormFields, isTambahan = false }) => {
    const [data, setData] = useState(undefined);
    const {error, success} = useNotification()
    const [submitLoading, setSubmitLoading] = useState()

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            console.log('REALISASI', aspek);

            const res = await getRealisasi(item._id, isTambahan ? 'tambahan' : 'utama', aspek._id, IdPeriode);
            if (res.ok) {
                setData(res.data);
            } else {
                setData(null);
            }
        } catch (err) {
            setData(null);
        }
    };

    return (
        <td>
            <div className="flex  flex-col gap-y-2 items-center justify-center">
                {data === undefined ? <Skeleton.Input active size="small" /> : data ? data : ''}
                {setModal && aspek.jenis === 'deskripsi' && (
                    <>
                    { aspek.realisasi?  aspek.realisasi[IdPeriode] : ''}
                        <Button
                            className="w-fit mb-4"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setModal({
                                    title: 'Tambah Feedback',
                                    trigger: true,
                                    formFields: FormFields,
                                    onSubmit: async (values) => {
                                        setSubmitLoading(true);
                                        console.log(values);
                                        const realisasi = aspek.realisasi ? aspek.realisasi : {};
                                        const dt = {
                                            ...aspek,
                                            realisasi: {
                                                ...realisasi,
                                                [IdPeriode]: values.deskriptif
                                            }
                                        };
                                        console.log(dt);

                                        const res = await update(aspek._id, dt);
                                        console.log(res);

                                        if (res.ok) {
                                            success('Berhasil', 'Berhasil Menambahkan Realisasi')
                                        }
                                        setSubmitLoading(false)
                                    }
                                });
                            }}
                        >
                            Kirim
                        </Button>
                    </>
                )}
            </div>
        </td>
    );
};

export default RealisasiRow;
