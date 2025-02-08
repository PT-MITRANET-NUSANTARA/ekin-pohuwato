"use client"
import { useEffect, useState } from "react";
import { getByAspekAndPeriode } from '@/controller/FeedbackRHKController';
import { Skeleton } from "antd";


const RhkRow = ({ item, IdSkp, IdPeriode, setModal, feedbackFields }) => {
    const [data, setData] = useState(undefined); // Ubah initial state jadi undefined agar bisa bedakan antara loading & data null

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await getByAspekAndPeriode(item._id, IdPeriode);
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
            <div className="p-3 flex flex-col items-center justify-center gap-y-2">
                {data === undefined ? (
                    <Skeleton.Input active size="small" />
                ) : data ? (
                    data.isi
                ) : (
                    ""
                )}
            </div>
        </td>
    );
};

export default RhkRow;