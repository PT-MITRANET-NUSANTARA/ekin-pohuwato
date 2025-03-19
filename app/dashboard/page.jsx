'use client';
import { OverviewCard } from '@/components';
import { dashBoardCard, dummyOverview } from '@/data/dummyData';
import React, { useState } from 'react';

const page = () => {
    const userRole = "admin";
    const filteredCards = dashBoardCard.filter(card => card.permission.includes(userRole));

    return (
        <div>
            <div className="grid w-full grid-cols-12 gap-6">
                {filteredCards.map(({title, key, icon: Icon}) => (
                    <div className="col-span-3">
                          <OverviewCard
                        key={key}
                        overview={title}
                        desc={dummyOverview[key]} // Mengambil nilai dari dummyOverview
                        icon={<Icon />}
                        isLoading={false}
                    />
                    </div>
                  
                ))}
            </div>
        </div>
    );
};

export default page;
