import { Card, Skeleton } from 'antd';
import React from 'react';

const Overviewcard = ({ overview, desc, icon, isLoading }) => {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-1">
                    {isLoading ? (
                        <>
                            <Skeleton.Button active size="small" />
                            <Skeleton.Button active size="small" />
                        </>
                    ) : (
                        <>
                            <p className="font-semibold capitalize">total {overview}</p>
                            <span className="text-xl font-semibold">{desc}</span>
                        </>
                    )}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 p-2 text-2xl text-white">{icon}</div>
            </div>
        </Card>
    );
};

export default Overviewcard;
