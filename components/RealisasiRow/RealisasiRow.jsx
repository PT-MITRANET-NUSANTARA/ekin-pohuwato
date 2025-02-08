"use client"
import { useEffect, useState } from "react";
import { getRealisasi } from '@/controller/RHKController';
import { Skeleton } from "antd";


const RealisasiRow = ({ item, aspek, IdPeriode }) => {
    const [data, setData] = useState(undefined); 

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await getRealisasi(item._id, "utama", aspek._id, IdPeriode);
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
            <div className="flex items-center justify-center">
                {data === undefined ? (
                    <Skeleton.Input active size="small" /> 
                ) : data ? (
                    data
                ) : (
                    "" 
                )}
            </div>
        </td>
    );
};

export default RealisasiRow;