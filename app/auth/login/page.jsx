'use client';

import { login } from '@/controller/loginController';
import { Button, Form, Input, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken } from '@/controller/AuthorizationController';

const { Title } = Typography;

const Page = () => {
    const [data, setData] = useState({
        username: '',
        password: ''
    });
    const router = useRouter();
    const [submitLoading, setSubmitLoading] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    };

    message.config({
        duration: 5,
        maxCount: 1
    });

    const onSubmit = async (values) => {
        try {
            setSubmitLoading(true)  
            const response = await login(data.username, data.password);
            console.log(response);
            if (response.success) {
                const match = response.mapData.redirect_uri.match(/access_token=([^&]*)/);
                if (match && match[1]) {
                    const cookies = await setToken(match[1]);
                    if (cookies.ok) {
                        message.success('Login Berhasil');
                        router.push('/dashboard');
                    } else {
                        message.error('Failed to fetch cookies. Please try again.');
                        console.error('Error fetching cookies:', cookies.statusText); // Log any error responses
                    }
                } else {
                    message.error('Invalid redirect URI. Access token not found.');
                }
            } else {
                message.error(response.message);
                console.error('Error fetching token:', response); // Log any error responses
            }
        } catch (error) {
            message.error('An error occurred while logging in. Please try again later.');
            console.log(error);
        }
        setSubmitLoading(false);
    };

    return (
        <section className="w-full min-h-screen h-full flex items-center">
            <div className=" w-full h-full min-h-screen px-4 flex items-center justify-center bg-color-primary-500">
                <Card className="max-w-md w-ful p-3">
                    {/* <div className="flex items-start w-24 mb-8">
                        <img src="/brand.png" />
                    </div> */}
                    <div className="mb-4">
                        <Title level={4}>Selamat Datang!!</Title>
                        <p>Aplikasi Pemantauan Kinerja ASN Kab Pohuwato.</p>
                    </div>
                    <Form layout="vertical" onFinish={onSubmit}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Username tidak boleh kosong!'
                                }
                            ]}
                        >
                            <Input size="large" prefix={<UserOutlined />} placeholder="Masukan Username" name="username" value={data.username} onChange={handleInputChange} />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Password tidak boleh kosong !'
                                }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Masukan Password" size="large" name="password" value={data.password} onChange={handleInputChange} />
                        </Form.Item>

                        <Form.Item>
                            <Button loading={submitLoading} type="primary" htmlType="submit" size="large" className="w-full">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
            <div className="hidden w-full h-full min-h-screen lg:flex items-center justify-center bg-white">
                <div className='flex flex-col gap-y-4 items-center justify-center'>
                    <div className="w-80">
                        <img src="/ekinerja_pohuwato.png" className="w-full" />
                    </div>
                    <h1 className='font-bold text-4xl text-center leading-none'><span className='text-color-primary-500'>E</span> Kinerja</h1>
                    <span className='text-color-primary-500 text-center font-semibold text-2xl'>Pohuwato</span>
                </div>
            </div>
        </section>
    );
};

export default Page;
