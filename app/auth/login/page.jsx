"use client"

import { Button, Form, Input, Card } from 'antd';
import React from "react";

const page = () => {
  return (
    <section className="w-full">
      <div className="w-full min-h-screen max-w-lg mx-auto px-4 flex items-center justify-center">
        <Card>
          <Form layout='vertical'>
            <Form.Item
              
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input size="large"/>
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password  size='large'/>
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

export default page;
