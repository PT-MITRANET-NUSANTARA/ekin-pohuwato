'use client';

import { login } from '@/controller/loginController';
import { Button, Form, Input, Card, message } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken } from '@/controller/AuthorizationController';

const Page = () => {
    const [data, setData] = useState({
        username: '',
        password: ''
    });
    const router = useRouter();

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
            const response = await login(data.username, data.password);
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
    };

    return (
        <section className="w-full">
            <div className="w-full min-h-screen max-w-lg mx-auto px-4 flex items-center justify-center">
                <Card>
                    <Form layout="vertical" onFinish={onSubmit}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!'
                                }
                            ]}
                        >
                            <Input size="large" name="username" value={data.username} onChange={handleInputChange} />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!'
                                }
                            ]}
                        >
                            <Input.Password size="large" name="password" value={data.password} onChange={handleInputChange} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </section>
    );
};

export default Page;
