'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getById, getByUnitId } from '@/controller/PeriodeRKTController';

const page = () => {
    const { IdPenilaian } = useParams();
    const fetchById = useCallback(() => getById(IdPenilaian), [IdPenilaian]);

    const { data, setData, loading, msg, status, error } = useFetchData(fetchById);
    const [tujuan, setTujuan] = useState(null);
    const [program, setProgram] = useState(null);
    console.log(IdPenilaian);
    console.log(data);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const uniqueRkts = data.RKTS.filter((item, index, self) => index === self.findIndex((rkt) => rkt._id === item._id));

            let allSubKegiatan = uniqueRkts.map((rkt) => rkt.subKegiatan);

            const uniqueSubKegiatan = allSubKegiatan.filter((item, index, self) => index === self.findIndex((sub) => sub._id === item._id));

            let allKegiatan = uniqueSubKegiatan.map((sub) => sub.kegiatan);

            const uniqueKegiatan = allKegiatan.filter((item, index, self) => index === self.findIndex((kegiatan) => kegiatan._id === item._id));

            let allProgram = uniqueKegiatan.map((kegiatan) => kegiatan.program);

            const uniqueProgram = allProgram.filter((item, index, self) => index === self.findIndex((program) => program._id === item._id));

            let allTujuan = uniqueProgram.map((program) => program.tujuan);

            const uniqueTujuan = allTujuan.filter((item, index, self) => index === self.findIndex((tujuan) => tujuan._id === item._id));
            setTujuan(uniqueTujuan)
            setProgram(uniqueProgram)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-12">
            <div className="mb-4">
                <div className=" text-center mb-2">
                    <img src="/pohuwato.jpg" alt="" className="w-24 mx-auto" />
                </div>
                <p className="w-full text-center font-bold">PERJANJIAN KINERJA</p>
                <p className="w-full text-center font-bold">TAHUN 2023</p>
                <p className="w-full text-center font-bold">BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
            </div>
            <div className="mb-6">
                <p>Dalam rangka mewujudkan manajemen pemerintahan yang efektif, transparan, dan akuntabel serta berorientasi pada hasil, kami yang bertanda tangan dibawah ini :</p>
                <table className="mt-4">
                    <tbody>
                        <tr>
                            <td className="px-4">Nama</td>
                            <td className="font-semibold">Mohamad Rafiq Daud</td>
                        </tr>
                        <tr>
                            <td className="px-4">Jabatan</td>
                            <td className="font-semibold">Kepala Badan Kepegawaian Dan Pengembangan Sumber Daya Manusia Kabupaten Pohuwato</td>
                        </tr>
                    </tbody>
                </table>
                <p className="mt-4">Selanjutnya disebut Pihak Pertama</p>
                <table className="mt-4">
                    <tbody>
                        <tr>
                            <td className="px-4">Nama</td>
                            <td className="font-semibold">Mohamad Rafiq Daud</td>
                        </tr>
                        <tr>
                            <td className="px-4">Jabatan</td>
                            <td className="font-semibold">Kepala Badan Kepegawaian Dan Pengembangan Sumber Daya Manusia Kabupaten Pohuwato</td>
                        </tr>
                    </tbody>
                </table>
                <p className="mt-4">Selaku atasan langsung pihak pertama, selanjutnya disebut Pihak Kedua</p>
                <p className="mt-8">
                    Pihak pertama berjanji akan mewujudkan target kinerja yang seharusnya sesuai lampiran perjanjian ini, dalam rangka mencapai target kinerja jangka menengah seperti yang telah ditetapkan dalam dokumen perencanaan. Keberhasilan dan
                    kegagalan pencapaian target kinerja tersebut menjadi tanggung jawab kami.
                </p>
                <p className="mt-8">
                    Pihak kedua akan melakukan supervisi yang diperlukan serta akan melakukan evaluasi terhadap capaian kinerja dari perjanjian ini dan mengambil tindakan yang diperlukan dalam rangka pemberian penghargaan dan sanksi.
                </p>
                <table className="w-full mt-6">
                    <tbody className="w-full">
                        <tr className="text-center">
                            <td>Pegawai Yang di nilai</td>
                            <td>
                                <div className="">
                                    <p>Gorontalo, 10 Oktober 2024</p>
                                    <p>Pejabat Penilai Kinerja</p>
                                </div>
                            </td>
                        </tr>
                        <tr className="text-center">
                            <td className="pt-24">Mohamad Rafiq Daud</td>
                            <td className="pt-24">Mohamad Rafiq Daud</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mb-4 mt-24">
                <p className="w-full text-center font-bold">PERJANJIAN KINERJA</p>
                <p className="w-full text-center font-bold">TAHUN 2023</p>
                <p className="w-full text-center font-bold">BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                <p className="w-full text-center font-bold">KABUPATEN POHUWATO</p>
            </div>
            <div className="w-full">
                <table className="w-full">
                    <tbody className="border border-black">
                        <tr className="border border-black text-center font-bold">
                            <td className="border border-black p-2 ">No</td>
                            <td className="border border-black p-2 ">Sasaran Strategis</td>
                            <td className="border border-black p-2 ">Indikator Kinerja</td>
                            <td className="border border-black p-2 ">Target(%)</td>
                        </tr>
                        <tr className="text-center">
                            <td className="border border-black p-2 ">1</td>
                            <td className="border border-black p-2 ">Terwujudnya ASN yang profesional, kompeten dan kompetitif</td>
                            <td className="border border-black p-2 ">Indeks Profesionalitas ASN</td>
                            <td className="border border-black p-2 ">86</td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full mt-4">
                    <tbody className="">
                        <tr className="font-bold">
                            <td></td>
                            <td>PROGRAM</td>
                            <td>ANGGARAN</td>
                            <td>KET</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Program Kepegawaian Daerah</td>
                            <td>Rp 1,595,757,500,00 </td>
                            <td>APBD</td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full mt-6">
                    <tbody className="w-full">
                        <tr className="text-center">
                            <td>Pegawai Yang di nilai</td>
                            <td>
                                <div className="">
                                    <p>Gorontalo, 10 Oktober 2024</p>
                                    <p>Pejabat Penilai Kinerja</p>
                                </div>
                            </td>
                        </tr>
                        <tr className="text-center">
                            <td className="pt-24">Mohamad Rafiq Daud</td>
                            <td className="pt-24">Mohamad Rafiq Daud</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default page;
