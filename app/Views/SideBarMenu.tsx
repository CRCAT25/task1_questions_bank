import React, { useState } from 'react';

const SideBarMenu = () => {
    const [selectedTab, setSelectedTab] = useState<number>(-1);

    const handleTabClick = (index: number) => {
        setSelectedTab(index);
    };

    const tabMenu = [
        'XXXX',
        'ĐÁNH GIÁ NHÂN SỰ',
        'XXXX',
        'XXXX',
        'XXXX',
    ];

    const tabMenuDanhGiaNhanSu = [
        '-----------------',
        'Ngân hàng câu hỏi',
        '-----------------',
        '-----------------',
        '-----------------',
        '-----------------',
    ];

    return (
        <div className='sidebar-menu'>
            <div className='w-full h-[50px] border-b border-gray-300 opacity-50'></div>
            <div className='items-menu'>
                {tabMenu.map((tab, index) => (
                    <div
                        key={index}
                        className={`h-[50px] cursor-pointer px-5 flex ${index === selectedTab ? 'bg-[#474F63]' : ''}`}
                        onClick={() => handleTabClick(index)}
                    >
                        <div className='flex flex-col justify-center pt-[5px]'>
                            <img src="/iconmenu.svg" alt="Icon Menu" />
                        </div>
                        
                        <div className='flex flex-col pl-5 justify-center'>
                            {tab}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideBarMenu;
