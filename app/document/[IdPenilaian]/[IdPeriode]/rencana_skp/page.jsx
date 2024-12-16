'use client';

import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getData } from '@/controller/AuthorizationController';
import { getById } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import useFetchData from '@/hooks/useFetchData';

const page = () => {
    const router = useRouter();
    dayjs.locale('id');
    const { IdPenilaian, IdPeriode } = useParams();
    
    const params = new URLSearchParams(window.location.search);
    const paramEntries = Object.fromEntries(params.entries());
    const { data, setData, loading } = useFetchData(getData);
    const [atasan, setAtasan] = useState(null);
    const [jabatan, setJabatan] = useState(null);
    const [skp, setSkp] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (data) {
            fetchData();
            
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const skp = await getById(IdPenilaian);
            setSkp(skp.data);
            console.log(skp.data);
            
            setJabatan(skp.data.jabatan[skp.data.jabatan.length - 1]);

            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    };
  

    console.log('atasan', jabatan);

    // useEffect(() => {
    //     // Automatically open print dialog when page is loaded
    //     window.print();
    // }, []);
    return (
        <div className="p-6">
            <div className="header">
                <h1>SASARAN KINERJA PEGAWAI</h1>
                <p>pendekatan hasil kinerja kuantitatif</p>
                <p>BAGI PEJABAT ADMINISTRASI DAN PEJABAT FUNGSIONAL</p>
            </div>
            <table className="subheader">
                <tbody>
                    <tr>
                        <td>PEMERINTAH KAB. POHUWATO</td>
                        <td className="text-right">PERIODE PENILAIAN: {dayjs(periode?.periodeStart).format('DD MMMM YYYY') + '-' + dayjs(periode?.periodeEnd).format('DD MMMM YYYY')}</td>
                    </tr>
                </tbody>
            </table>
            <table className="detailpenilai">
                <tbody>
                    <tr className="tablehead">
                        <td style={{ maxWidth: '10%' }}>no</td>
                        <td colSpan={2}>pegawai yang dinilai</td>
                        <td style={{ maxWidth: '10%' }}>no</td>
                        <td colSpan={2}>pegawai penilai kinerja</td>
                    </tr>
                    <tr className="data">
                        <td>1</td>
                        <td>nama</td>
                        <td> {data?.user.nama}</td>
                        <td>1</td>
                        <td>nama</td>
                        <td> {jabatan?.unor.atasan.asn.nama_atasan}</td>
                    </tr>
                    <tr className="data">
                        <td>2</td>
                        <td>nip</td>
                        <td>{data?.user.nipBaru}</td>
                        <td>2</td>
                        <td>nip</td>
                        <td> {jabatan?.unor.atasan.asn.nip_atasan}</td>
                    </tr>
                    {/* <tr className="data">
                        <td>3</td>
                        <td>PANGKAT/ GOL. RUANG</td>
                        <td>Penata Tingkat I / III/d</td>
                        <td>3</td>
                        <td>PANGKAT/ GOL. RUANG</td>
                        <td>Penata Tingkat I / III/d</td>
                    </tr> */}
                    <tr className="data">
                        <td>4</td>
                        <td>JABATAN</td>
                        <td> {jabatan?.nama_jabatan}</td>
                        <td>4</td>
                        <td>JABATAN</td>
                        <td>{jabatan?.unor.atasan.unor_jabatan}</td>
                    </tr>
                    <tr className="data">
                        <td>5</td>
                        <td>UNIT KERJA</td>
                        <td>{jabatan?.unor.nama}</td>
                        <td>5</td>
                        <td>UNIT KERJA</td>
                        <td>{jabatan?.unor.atasan.unor_nama} </td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full border border-black mt-2">
                <tbody className="w-full border border-black">
                    <tr className="border border-black">
                        <td colSpan={8} className="border border-black font-semibold">
                            Hasil Kerja
                        </td>
                    </tr>
                    <tr className="font-bold">
                        <td className="border border-black p-2 text-center">NO</td>
                        <td className="border border-black p-2 text-center">RENCANA HASIL KERJA PIMPINAN YANG DIINTERVENSI</td>
                        <td className="border border-black p-2 text-center">RENCANA HASIL KERJA </td>
                        <td className="border border-black p-2 text-center">ASPEK</td>
                        <td className="border border-black p-2 text-center">INDKATOR KINERJA INDIVIDU</td>
                        <td className="border border-black p-2 text-center">TARGET</td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="border border-black font-semibold">
                            Utama
                        </td>
                    </tr>

                    {skp?.rhks.map((item, index) => (
                        <>
                            <tr>
                                <td className="border border-black p-2 text-center" rowSpan={item.aspek ? item.aspek.length + 1 : 1}>
                                    {index + 1}
                                </td>
                                <td className="border border-black p-2 text-center" rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                    <div className="flex flex-col gap-y-2 text-left">
                                        <p>{item.desc}</p>
                                    </div>
                                </td>

                                <td className="border border-black p-2 text-center" rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                    <div className="flex flex-col gap-y-2 text-left">
                                        <p>{item.desc}</p>
                                        <span>{item.klasifikasi ? item.klasifikasi : ''}</span>
                                    </div>
                                </td>
                            </tr>
                            {item.aspek?.map((aspek) => (
                                <>
                                    <tr>
                                        <td className="border border-black p-2 text-center">{aspek.jenis}</td>
                                        <td className="border border-black p-2 text-center" style={{ maxWidth: '12rem', padding: '8px' }}>
                                            <div className="flex flex-col gap-y-2 text-left">
                                                <p>{aspek.indikator}</p>
                                            </div>
                                        </td>
                                        <td className="border border-black p-2 text-center">{aspek.target_tahunan.target + aspek.target_tahunan.satuan} </td>
                                    </tr>
                                </>
                            ))}
                        </>
                    ))}
                    <tr>
                        <td colSpan={8} className="border border-black font-semibold">
                            Tambahan
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="w-full border border-black mt-2">
                <tbody className="w-full border border-black">
                    <tr className="font-bold">
                        <td className="border border-black p-2 text-center">NO</td>
                        <td className="border border-black p-2 text-center">PERILAKU KERJA</td>
                        <td className="border border-black p-2 text-center">EKSPEKTASI KHUSUS PIMPINAN</td>
                    </tr>
                    {skp?.perilakus?.map((item, index) => (
                        <tr key={index}>
                            <td className="border border-black p-2 text-center">{index + 1}</td>
                            <td className="border border-black p-2 text-center" style={{ padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <b>{item.name}</b>
                                    <ol className="list-decimal list-inside">
                                        {item.isi.map((isiItem, isiIndex) => (
                                            <li key={isiIndex}>{isiItem}</li>
                                        ))}
                                    </ol>
                                </div>
                            </td>
                            <td className="border border-black p-2 text-center">
                            {item.espektasi || ''}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <table className="w-full mt-6">
                <tbody className="w-full">
                    <tr className="text-center">
                        <td>Pegawai Yang di nilai</td>
                        <td>
                            <div className="">
                                <p>
                                    {paramEntries.lokasi}, {dayjs().format('DD MMMM YYYY')}
                                </p>
                                <p>Pejabat Penilai Kinerja</p>
                            </div>
                        </td>
                    </tr>
                    <tr className="text-center">
                        <td className="pt-24">{data?.user.nama}</td>
                        <td className="pt-24">{atasan?.nama_asn}</td>
                    </tr>
                    <tr className="text-center">
                        <td className="">   {jabatan?.unor.atasan.asn.nama_atasan}</td>
                        <td className="">  {jabatan?.unor.atasan.asn.nip_atasan}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default page;
