import React from 'react';

const page = () => {
    return (
        <div className="p-6">
            <div className="header">
                <h1>evaluasi kinerja pegawai</h1>
                <p>pendekatan hasil kinerja kuantitatif</p>
                <p className="periode">periode : januari</p>
            </div>
            <table className="subheader">
                <tbody>
                    <tr>
                        <td>PEMERINTAH KAB. POHUWATO</td>
                        <td className="text-right">PERIODE PENILAIAN: 1 JANUARI SD 31 JANUARI TAHUN 2024</td>
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
                        <td>Mohamad Rafiq Daud</td>
                        <td>1</td>
                        <td>nama</td>
                        <td>Mohamad Rafiq Daud</td>
                    </tr>
                    <tr className="data">
                        <td>2</td>
                        <td>nip</td>
                        <td>197904012005011015</td>
                        <td>2</td>
                        <td>nip</td>
                        <td>197904012005011015</td>
                    </tr>
                    <tr className="data">
                        <td>3</td>
                        <td>PANGKAT/ GOL. RUANG</td>
                        <td>Penata Tingkat I / III/d</td>
                        <td>3</td>
                        <td>PANGKAT/ GOL. RUANG</td>
                        <td>Penata Tingkat I / III/d</td>
                    </tr>
                    <tr className="data">
                        <td>4</td>
                        <td>JABATAN</td>
                        <td>Mohamad Rafiq Daud</td>
                        <td>4</td>
                        <td>JABATAN</td>
                        <td>Mohamad Rafiq Daud</td>
                    </tr>
                    <tr className="data">
                        <td>5</td>
                        <td>UNIT KERJA</td>
                        <td>BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</td>
                        <td>5</td>
                        <td>UNIT KERJA</td>
                        <td>BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</td>
                    </tr>
                </tbody>
            </table>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>CAPAIAN KINERJA ORGANISASI</p>-
            </div>
            <div className="uppercase p-2 bg-sky-300 font-semibold border border-black">
                <p>pola distribusi</p>-
            </div>
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
                        <td className="border border-black p-2 text-center">TARGET/SESUAI EKSPEKTASI</td>
                        <td className="border border-black p-2 text-center">RELASI BERDASARKAN BUKTI DUKUNG</td>
                        <td className="border border-black p-2 text-center">UMPAN BALIK BERKELANJUTAN BERDASARKAN BUKTI DUKUNG</td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="border border-black font-semibold">
                            Utama
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="border border-black font-semibold">
                            Utama
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>CAPAIAN KINERJA ORGANISASI</p>-
            </div>
            <table className="w-full border border-black mt-2">
                <tbody className="w-full border border-black">
                    <tr className="font-bold">
                        <td className="border border-black p-2 text-center">NO</td>
                        <td className="border border-black p-2 text-center">PERILAKU KERJA</td>
                        <td className="border border-black p-2 text-center">EKSPEKTASI KHUSU PIMPINAN</td>
                        <td className="border border-black p-2 text-center">UMPAN BALIK BERKELANJUTAN BERDASARKAN BUKTI DUKUNG</td>
                    </tr>
                    <tr className="">
                        <td className="border border-black p-2 ">1</td>
                        <td className="border border-black p-2 ">
                            <div className="">
                                <b>Berorientasi Pelayanan</b>
                                <ul className="list-disc list-inside">
                                    <li className="">Memahami dan memenuhi kebutuhan masyarakat</li>
                                    <li className="">Memahami dan memenuhi kebutuhan masyarakat</li>
                                    <li className="">Memahami dan memenuhi kebutuhan masyarakat</li>
                                </ul>
                            </div>
                        </td>
                        <td className="border border-black p-2 ">EKSPEKTASI KHUSU PIMPINAN</td>
                        <td className="border border-black p-2 ">UMPAN BALIK BERKELANJUTAN BERDASARKAN BUKTI DUKUNG</td>
                    </tr>
                </tbody>
            </table>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>CAPAIAN KINERJA ORGANISASI</p>-
            </div>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>CAPAIAN KINERJA ORGANISASI</p>-
            </div>
            <table className='w-full mt-6'>
                <tbody className='w-full'>
                    <tr className='text-center'>
                        <td>Pegawai Yang di nilai</td>
                        <td>
                            <div className="">
                                <p>Gorontalo, 10 Oktober 2024</p>
                                <p>Pejabat Penilai Kinerja</p>
                            </div>
                        </td>
                    </tr>
                    <tr className='text-center'>
                        <td className='pt-24'>Mohamad Rafiq Daud</td>
                        <td className='pt-24'>
                           Mohamad Rafiq Daud
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default page;
