import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { findIconDefinition, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faChevronDown,
    faChevronUp,
    faListCheck,
    faQuestion
} from "@fortawesome/free-solid-svg-icons";
import datajson from '../newdata.json'

interface IconProps {
    classIcon: IconDefinition;
    color: string;
    size: string;
}

interface ListItemMenu {
    selectedTabHeader: number;
}

interface ListTabMenu {
    icon: string;
    content: string;
}

const SideBarMenu: React.FC<ListItemMenu> = ({ selectedTabHeader }) => {
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
    const [selectedSubTab, setSelectedSubTab] = useState<number>(-1); // New state to track selected sub-tab

    const handleTabClick = (index: number) => {
        if (index === selectedTab) {
            setSelectedTab(-1);
        } else {
            setSelectedTab(index);
        }
    };

    const handleTabClickTabLowerLV = (index: number) => {
        setSelectedSubTab(index); // Update selected sub-tab index
        setSelectedTabLowerLV(!selectedTabLowerLV);
    };


    const tabMenu: string[] = [];

    // Lặp qua mỗi module
    datajson.Modules.forEach(module => {
        // Kiểm tra module NHÂN SỰ
        if (module["NHÂN SỰ"]) {
            // Lấy các khóa "ĐÁNH GIÁ NHÂN SỰ", "ĐÁNH GIÁ SẢN PHẨM", "ĐÁNH GIÁ THÀNH TÍCH"
            Object.keys(module["NHÂN SỰ"]).forEach(key => {
                tabMenu.push(key);
            });
        }
    });


    // Khởi tạo danh sách với phần tử ban đầu
    const tabMenuDanhGiaNhanSu: ListTabMenu[] = [];

    // Lấy dữ liệu từ JSON và tạo các phần tử trong mảng tabMenuDanhGiaNhanSu
    datajson.Modules.forEach(module => {
        if (module["NHÂN SỰ"] && module["NHÂN SỰ"]["ĐÁNH GIÁ NHÂN SỰ"] && module["NHÂN SỰ"]["ĐÁNH GIÁ NHÂN SỰ"]["TabMenu"]) {
            const tabMenu = module["NHÂN SỰ"]["ĐÁNH GIÁ NHÂN SỰ"]["TabMenu"];
            tabMenu.forEach(tab => {
                const icon = tab["Icon"];
                Object.keys(tab).forEach(key => {
                    if (key !== "Icon") {
                        tabMenuDanhGiaNhanSu.push({
                            icon: icon === "faQuestion" ? "faQuestion" : icon, // Thay đổi icon nếu cần
                            content: key
                        });
                    }
                });
            });
        }
    });


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

            {selectedTabHeader === 7 ? (
                <div className='items-menu'>
                    {tabMenu.map((tab, index) => (
                        <div key={index}>
                            <div
                                className={`h-[50px] cursor-pointer px-5 flex justify-between ${index === selectedTab ? 'bg-[#474F63] text-[#5CB800] border-l-[5px] border-[#5CB800]' : 'border-l-[5px] border-[#5A6276]'}`}
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
                                                className={`h-[50px] cursor-pointer px-5 flex ${selectedSubTab === i ? 'border-l-[5px] border-[#fff] bg-[#474F63]' : 'border-l-[5px] border-[#5A6276]'}`}
                                                onClick={() => handleTabClickTabLowerLV(i)}
                                            >
                                                <div className='flex flex-col justify-center'>
                                                    <img className='w-[16px] h-[16px]' src={tabMenu.icon}/>
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
            ) : (<></>)}

        </div>
    );
};

export default SideBarMenu;
