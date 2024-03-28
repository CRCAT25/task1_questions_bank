'use client'
// Trong thành phần cha chứa cả Header và ListPersonnel
import React, { useState } from 'react';
import SideBarMenu from './SideBarMenu';
import "../css/Personnel.scss";
import "../responsive/Personnel.css";
import Header from './Header';
import ListPersonnel from './ListPersonnel';

const Personnel: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<number>(7);
    const [selectedSideBar, setSelectedSideBar] = useState<string>('Ngân hàng câu hỏi');

    const handleTabChange = (tabValue: number) => {
        setSelectedTab(tabValue);
    };

    const handleTabSideBarChange = (tabValue: string) => {
        setSelectedSideBar(tabValue);
    };

    return (
        <div className='flex h-[100vh] gap-[3px] bg-[#EDEFF3] text-[14px]'>
            <div className="w-[15vw] bg-[#5A6276] text-white">
                <SideBarMenu onTabChange={handleTabSideBarChange} selectedTabHeader={selectedTab} />
            </div>
            <div className="w-[85vw] flex flex-col">
                <Header onTabChange={handleTabChange} />
                <ListPersonnel selectedSideBar={selectedSideBar}/>
            </div>
        </div>
    );
};

export default Personnel;
