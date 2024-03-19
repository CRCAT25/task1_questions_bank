import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faChevronDown,
    faChevronUp,
    faListCheck,
    faQuestion
} from "@fortawesome/free-solid-svg-icons";

interface IconProps {
    classIcon: IconDefinition;
    color: string;
    size: string;
}

const SideBarMenu = () => {
    const Icon: React.FC<IconProps> = ({ classIcon, color, size }) => {
        const iconSize = {
            width: size,
            height: size,
            color: color,
            cursor: "pointer"
        };

        return (
            <div>
                <FontAwesomeIcon icon={classIcon} style={iconSize} />
            </div>
        );
    };

    const [selectedTab, setSelectedTab] = useState<number>(-1);
    const [selectedTabLowerLV, setSelectedTabLowerLV] = useState<boolean>(false);

    const handleTabClick = (index: number) => {
        setSelectedTab(index);
    };

    const handleTabClickTabLowerLV = (index: number) => {
        setSelectedTabLowerLV(!selectedTabLowerLV);
    };

    const tabMenu = [
        'ĐÁNH GIÁ NHÂN SỰ',
    ];

    const tabMenuDanhGiaNhanSu = [
        { icon: faQuestion, content: 'Ngân hàng câu hỏi' },
        // { icon: 'icon2', content: 'Nội dung 2' },
        // { icon: 'icon3', content: 'Nội dung 3' },
        // Thêm các phần tử khác tại đây nếu cần
    ];



    return (
        <div className='sidebar-menu'>
            <div className='w-full h-[60px] flex justify-between px-[20px] bg-[#fff]'>
                {/* Logo HachiHachi */}
                <div className='flex flex-col justify-center'>
                    <img className='h-[50px]' src='./imageLogo.svg' />
                </div>
                <div className='flex flex-col justify-center'>
                    <Icon classIcon={faChevronDown} color='black' size='16px' />
                </div>
            </div>

            {/* Danh mục MODEL con của NHÂN SỰ*/}
            <div className='items-menu'>
                {tabMenu.map((tab, index) => (
                    <div key={index}>
                        <div
                            className={`h-[50px] cursor-pointer px-5 flex justify-between ${index === selectedTab ? 'bg-[#474F63] text-[#5CB800] border-l-[5px] border-[#5CB800]' : ''}`}
                            onClick={() => handleTabClick(index)}
                        >
                            <div className='flex flex-col justify-center'>
                                <Icon classIcon={faListCheck} color={`${index === selectedTab ? '#5CB800' : 'white'}`} size='16px' />
                            </div>

                            <div className='flex flex-col justify-center pt-[1px]'>
                                <span>{tab}</span>
                            </div>

                            <div className='flex flex-col justify-center'>
                                {index !== selectedTab ? (
                                    <Icon classIcon={faChevronDown} color='white' size='16px' />
                                ) : (
                                    <Icon classIcon={faChevronUp} color={`${index === selectedTab ? '#5CB800' : 'white'}`} size='16px' />
                                )}
                            </div>
                        </div>

                        {/* Hiển thị danh sách các model con của ĐÁNH GIÁ NHÂN SỰ */}
                        {selectedTab == 0 ?
                            (<>
                                {tabMenuDanhGiaNhanSu.map((tabMenu, i) => (
                                    <div key={i}>
                                        <div
                                            className={`h-[50px] cursor-pointer px-5 flex ${selectedTabLowerLV ? 'border-l-[5px] border-[#fff]' : ''}`}
                                            onClick={() => handleTabClickTabLowerLV(i)}
                                        >
                                            <div className='flex flex-col justify-center'>
                                                <Icon classIcon={tabMenuDanhGiaNhanSu[i].icon} color={'white'} size='16px' />
                                            </div>

                                            <div className='flex flex-col justify-center pt-[1px] mx-auto'>
                                                <span>{tabMenu.content}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>) : (<></>)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideBarMenu;
