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
        <div className='flex h-[100vh] gap-[7px] bg-[#EDEFF3]'>
            <div className="w-[15%] bg-[#5A6276] text-white">
                <SideBarMenu onTabChange={handleTabSideBarChange} selectedTabHeader={selectedTab} />
            </div>
            <div className="w-[85%] flex flex-col">
                <Header onTabChange={handleTabChange} />
                <ListPersonnel selectedSideBar={selectedSideBar}/>
            </div>
        </div>
    );
};

export default Personnel;
