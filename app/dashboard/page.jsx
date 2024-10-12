'use client';
import { OverviewCard } from '@/components';
import { AlignLeftOutlined, BlockOutlined, FieldTimeOutlined, UserAddOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const page = () => {

    return (
        <div>
            <div className="grid w-full grid-cols-12 gap-6">
                <div className="col-span-3">
                    <OverviewCard overview="sektor" desc="12" icon={<BlockOutlined />} isLoading={false} />
                </div>
                <div className="col-span-3">
                    <OverviewCard overview="subjek" desc="12" icon={<AlignLeftOutlined />} isLoading={false} />
                </div>
                <div className="col-span-3">
                    <OverviewCard overview="user" desc="12" icon={<UserAddOutlined />} isLoading={false} />
                </div>
                <div className="col-span-3">
                    <OverviewCard overview="antar waktu" desc="12" icon={<FieldTimeOutlined />} isLoading={false} />
                </div>
            </div>
        </div>
    );
};

export default page;
