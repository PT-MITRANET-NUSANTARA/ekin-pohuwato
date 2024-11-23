import { Card, Skeleton } from 'antd';
import React from 'react';

const DataLoading = ({ loadingData }) => {
    return (
        <Card className="">
            <div className="flex flex-col">
                <div className="flex items-center justify-between mb-12">
                    <Skeleton.Button size="small" active />
                    <div>{loadingData && <Skeleton.Button active />}</div>
                </div>
                <div className="overflow-x-auto">{loadingData && <Skeleton active />}</div>
            </div>
        </Card>
    );
};

export default DataLoading;
