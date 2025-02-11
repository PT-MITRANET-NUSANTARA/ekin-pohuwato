"use client"
import { useEffect, useState } from "react";
import { getRealisasi } from '@/controller/RHKController';
import { Button, Skeleton } from "antd";
import { PlusOutlined } from '@ant-design/icons';


const RealisasiRow = ({ item, aspek, IdPeriode, setModal, FormFields, isTambahan = true }) => {
    const [data, setData] = useState(undefined);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await getRealisasi(item._id, isTambahan ? 'tambahan' : 'utama', aspek._id, IdPeriode);
            if (res.ok) {
                setData(res.data);
            } else {
                setData(null);
            }
        } catch (error) {
            setData(null);
        }
    };

    return (
        <td>
            <div className="flex  flex-col gap-y-2 items-center justify-center">
                {data === undefined ? (
                    <Skeleton.Input active size="small" />
                ) : data ? (
                    data
                ) : (
                    ""
                )}
                {setModal && aspek.jenis === 'deskripsi' && (
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
                                    // Logika submit form di sini
                                }
                            })
                        }}>
                        Kirim
                    </Button>
                )}
            </div>
        </td>
    );
};

export default RealisasiRow;