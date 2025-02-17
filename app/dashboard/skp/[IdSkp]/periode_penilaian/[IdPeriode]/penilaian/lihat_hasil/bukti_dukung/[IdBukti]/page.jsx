'use client';

import { Button, Card, Descriptions, List, Menu, Modal, Progress, Tag, Typography } from 'antd';
import { LinkOutlined, UserOutlined } from '@ant-design/icons';

import React, { useEffect, useState } from 'react';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAll, getBukti, getByRHK } from '@/controller/RHKController';
import { useParams } from 'next/navigation';
import { dateFormatter } from '@/utils';
import { formatDateToDayMonthYear } from '@/utils/util';

const menuItem = [
    {
        key: 'user1',
        icon: <UserOutlined />,
        label: 'Atasan 1',
        children: [
            {
                key: 'user2',
                label: 'Bawahan 1',
                children: [
                    {
                        key: 'user3',
                        label: 'Sub Bawahan 1'
                    }
                ]
            }
        ]
    },
    {
        key: 'useruser1',
        icon: <UserOutlined />,
        label: 'Atasan 2',
        children: [
            {
                key: 'useruser2',
                label: 'Bawahan 2',
                children: [
                    {
                        key: 'useruser3',
                        label: 'Sub Bawahan 2'
                    }
                ]
            }
        ]
    }
];

const page = () => {
    const { IdBukti, IdPenilaianRhk, IdPeriode } = useParams();

    const [activeKey, setActiveKey] = useState('');
    const [activeRHK, setActiveRHK] = useState('');
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });
    const { data: user, setData: setUser } = useFetchData(getData);
    const [rhks, setRhks] = useState([]);
    const [parent, setParent] = useState(null);
    const [skp, setSKP] = useState(null);
    const [menu, setMenu] = useState(null);
    const [bukti, setBukti] = useState([]);
    const [menuRHK, setMenuRHK] = useState([]);
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const rhks = await getByRHK(IdBukti);
            console.log(rhks);
            const menu = rhks.data.childUnique.map(setMenuItems);
            console.log(menu);

            setMenu(menu);
            setRhks(rhks.data);
            setSKP(rhks.data.skp);
        } catch (error) {
            console.log(error);
        }
    };

    const setRHKMenu = async (skp_id, rhk_id) => {
        const res = await getAll('undefined', 'undefined', {
            skp: skp_id,
            rhk: rhk_id
        });

        if (res.ok) {
            const menu = res.data.map((item) => {
                return {
                    key: item._id,
                    icon: <UserOutlined />,
                    label: item.desc,
                    onClick: async () => {
                        console.log(item);
                        setActiveRHK(item._id);
                        setBuktiItems(item);
                    }
                };
            });

            setMenuRHK(menu);
            console.log(menu);
        }
    };

    const setBuktiItems = async (item) => {
        const res = await getBukti(item._id, IdPeriode);
        console.log(res);

        if (res.ok) {
            setBukti(res.data);
        }
    };

    const setMenuItems = (item) => {
        // Salin properti item, dan tambahkan onTitleClick
        const newItem = {
            ...item,
            key: item.skp._id,
            icon: <UserOutlined />,
            label: `${item.skp.jabatan[item.skp.jabatan.length - 1].nama_asn} (${item.skp.jabatan[item.skp.jabatan.length - 1].nip_asn} ) `
        };

        console.log('danger', item);

        if (item.child.childUnique && item.child.childUnique.length > 0) {
            newItem.children = enhanceMenuItems(item.child.childUnique);
            newItem.onTitleClick = () => {
                console.log(`Item dengan key '${item.skp._id}' (toplevel) diklik!`);
                setActiveKey(item.skp._id);
                setParent(item.child.rhk._id);
                setRHKMenu(item.skp._id, item.child.rhk._id);
            };
        } else {
            newItem.onClick = () => {
                console.log(`Item dengan key '${item.skp._id}' (tanpa nested) diklik!`);
                setActiveKey(item.skp._id);
                setParent(item.child.rhk._id);
                setRHKMenu(item.skp._id, item.child.rhk._id);
            };
        }

        return newItem;
    };

    // const enhanceMenuItems = (items) => {
    //     return items.map((item) => {
    //         if (item.children) {
    //             return {
    //                 ...item,
    //                 onTitleClick: () => {
    //                     console.log(`Item dengan key '${item.key}' (toplevel) diklik!`);
    //                     setActiveKey(item.key);
    //                 },
    //                 children: enhanceMenuItems(item.children)
    //             };
    //         }
    //         return {
    //             ...item,
    //             onClick: () => {
    //                 console.log(`Item dengan key '${item.key}' (tanpa nested) diklik!`);
    //                 setActiveKey(item.key);
    //             }
    //         };
    //     });
    // };

    // Misalnya fungsi ini memproses array menu secara rekursif
    const enhanceMenuItems = (items) => {
        return items.map((childItem) => setMenuItems(childItem));
    };

    const data = Array.from({ length: 2 }).map((_, i) => ({
        href: 'https://ant.design',
        title: `ant design part ${i}`,
        description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
    }));

    return (
        <div className="w-full flex flex-col gap-y-4">
            <Card>
                <div className="flex flex-col gap-y-4 mb-6">
                    <div className="w-full flex items-center justify-between">
                        <Typography.Title className="mt-2" level={5}>
                            Bukti Dukung
                        </Typography.Title>
                    </div>
                    <div className="grid grid-flow-row divide-y text-xs">
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">periode</span>
                            <Tag color="blue" className="capitalize">
                                {skp?.periode_awal && skp?.periode_akhir ? dateFormatter(skp.periode_awal) + '-' + dateFormatter(skp.periode_akhir) : 'Tanggal tidak tersedia'}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">pendekatan</span>
                            <Tag color="blue" className="capitalize">
                                {skp?.pendekatan}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">status</span>
                            <Tag color="green" className="capitalize">
                                {skp?.status}
                            </Tag>
                        </div>
                        {/* <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">Model SKP</span>
                            <p className="text-right capitalize">JAJF</p>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">jenis pegawai</span>
                            <p className="text-right capitalize">pemimpin</p>
                        </div> */}
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-12 gap-4">
                <div className="p-2 rounded-md col-span-3 bg-white h-fit">
                    <Menu className="col-span-3" mode="inline" items={menu} selectedKeys={[activeKey]} />
                </div>
                <Card className="col-span-3 h-fit">
                    <Menu className="col-span-3" mode="inline" items={menuRHK} selectedKeys={[activeRHK]} />
                </Card>

                <Card className="col-span-6 flex flex-col gap-y-2">
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={bukti}
                        renderItem={(item) => (
                            <List.Item key={item.title}>
                                <div className="w-full grid grid-cols-12 gap-2">
                                    <div className="col-span-6 p-2">
                                        <Typography.Title level={5}>{item.namaKegiatan}</Typography.Title>
                                        <Typography.Paragraph>{item.deskripsiKegiatan}</Typography.Paragraph>
                                        <Button variant="solid" color="primary" onClick={() => setFileModal({ trigger: true,modalData: item.files })}>
                                            Detail
                                        </Button>
                                        <Button variant="solid" onClick={() => window.open(item.tautan, '_blank', 'noopener,noreferrer')} icon={<LinkOutlined />} />
                                    </div>
                                    <div className="col-span-6 p-2">
                                        <Descriptions size="small" layout="vertical" column={1} bordered>
                                            <Descriptions.Item label="Tanggal">{formatDateToDayMonthYear(item.date)}</Descriptions.Item>
                                            <Descriptions.Item label="Waktu">{item.startDateTime + ' - ' + item.endDateTime}</Descriptions.Item>

                                            <Descriptions.Item label="Progress">
                                                <Progress percent={item.progress} />
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>

                {/* <Descriptions title="Detail Bukti Dukung" column={1} bordered layout="vertical">
                        <Descriptions.Item label="Nama">Mohamad Rafiq Daud</Descriptions.Item>
                        <Descriptions.Item label="Progress">
                            <Progress percent={60} />
                        </Descriptions.Item>
                    </Descriptions> */}
            </div>
            <Modal open={fileModal.trigger} onCancel={() => setFileModal({ modalData: null, trigger: false })} footer={null}>
                <List
                    className="my-6"
                    itemLayout="horizontal"
                    dataSource={fileModal.modalData}
                    renderItem={(item) => (
                        <List.Item>
                            <div className="w-full flex justify-between items-center">
                                <div>
                                    <p>{item.name}</p>
                                    <small>{item.fileId}</small>
                                </div>
                                <div>
                                    <Button
                                        size="small"
                                        icon={<DownloadOutlined />}
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = process.env.NEXT_PUBLIC_API_IMAGE_URL + '/' + item.fileId;
                                            a.download = item.name;
                                            a.click();
                                        }}
                                    />
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default page;
