"use client"
import { Skeleton } from "antd";
import { useEffect, useState } from "react";
import { getByPerilakuAndPeriode } from '@/controller/FeedbackPerilakuController';

const PerilakuRow = ({ item, IdPeriode, fetchData, formFields, setModal, IdSKP }) => {
    const [data, setData] = useState(undefined);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await getByPerilakuAndPeriode(item._id, IdPeriode);
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
            <div className="flex flex-col items-center justify-center gap-y-2">
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

export default PerilakuRow;
