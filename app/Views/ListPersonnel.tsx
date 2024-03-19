import React, { useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAdd,
    faDownload,
    faUpload,
} from "@fortawesome/free-solid-svg-icons";

interface CheckboxProps {
    label: string;
}

interface IconProps {
    classIcon: IconProp;
    color: string;
    size: string | number;
}

const ListPersonnel = () => {
    const [checked, setChecked] = useState<string[]>([]); // Change state type to string[] for multiple checkbox selection
    const [selectedTab, setSelectedTab] = useState<number>(-1);

    const Checkbox: React.FC<CheckboxProps> = ({ label }) => {

        const handleChange = (label: string) => {
            const currentIndex = checked.indexOf(label);
            const newChecked = [...checked];
            if (currentIndex === -1) {
                newChecked.push(label);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setChecked(newChecked);
        };

        return (
            <div className='flex gap-8 text-[#959DB3]' onClick={() => handleChange(label)}>
                <div>{label}</div>
                <label className='flex flex-col justify-center'>
                    <input className='cursor-pointer' type="checkbox" checked={checked.includes(label)} onChange={() => handleChange(label)} disabled hidden />
                    <span className={`checkmark cursor-pointer ${checked.includes(label) ? 'checked' : ''}`}></span>
                </label>
            </div>

        );
    };

    const Icon: React.FC<IconProps> = ({ classIcon, color, size }) => {
        const iconSize = {
            width: size,
            height: size,
            color: color,
            cursor: "pointer"
        };

        return (
            <span>
                <FontAwesomeIcon icon={classIcon} style={iconSize} />
            </span>
        );
    };


    const handleTabClick = (index: number) => {
        setSelectedTab(index);
        console.log(selectedTab);
    };

    const tabHeaderStatus = [
        'Đang soạn thảo',
        'Gửi duyệt',
        'Đã duyệt',
        'Ngưng áp dụng'
    ];

    return (
        <div className='h-full py-[15px] mr-[24px]'>
            <div className='flex justify-between'>
                {/* Phần header bao gồm các checkbox trạng thái */}
                <div className='flex gap-5'>
                    {tabHeaderStatus.map((tab, index) => (
                        <div
                            key={index}
                            className={`h-[46px] bg-white flex flex-col justify-center rounded-[24px] ${checked.includes(tab) ? 'border-[2px] border-[#008000]' : ''} cursor-pointer px-6 flex ${index === selectedTab ? '' : ''}`}
                            onClick={() => handleTabClick(index)}
                        >
                            <Checkbox label={tab} />
                        </div>
                    ))}
                </div>

                {/* Phần header có import export add */}
                <div className='flex gap-5'>
                    {/* Button export file */}
                    <div className='flex flex-col justify-center bg-[#fff] rounded-[4px] cursor-pointer'>
                        <div className='flex gap-2 px-[16px]'>
                            <Icon classIcon={faUpload} color='#959DB3' size={'20px'} />
                        </div>
                    </div>

                    {/* Button import file */}
                    <div className='flex flex-col justify-center bg-[#fff] rounded-[4px] cursor-pointer'>
                        <div className='flex gap-2 px-[16px]'>
                            <Icon classIcon={faDownload} color='#959DB3' size={'20px'} />
                            <div className='font-600 text-[#959DB3]'>Template</div>
                        </div>
                    </div>

                    {/* Button Add */}
                    <div className='flex flex-col justify-center bg-[#1A6634] rounded-[4px] cursor-pointer'>
                        <div className='flex gap-2 px-[16px]'>
                            <Icon classIcon={faAdd} color='white' size={'20px'} />
                            <div className='text-white font-[600]'>THÊM MỚI</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần search */}
            <div className='flex gap-4 border-t-[1px] py-[15px] border-[#BDC2D2] mt-[15px]'>
                <div className='flex flex-col justify-between'>
                    <div>
                        <img src="./iconfilter.svg" alt="" />
                    </div>
                </div>

                <div className='flex flex-col justify-between'>
                    <div className='text-[#5A6276] font-[600]'>
                        LỌC DỮ LIỆU
                    </div>

                    <div className='underline text-[#008000] h-[36px] flex flex-col justify-center cursor-pointer'>
                        Reset bộ lọc
                    </div>
                </div>

                <div className='flex flex-col justify-between gap-3'>
                    <div className='text-[#959DB3] font-[600]'>
                        Tìm kiếm
                    </div>

                    <div className='relative flex gap-3'>
                        <img className='absolute top-1/2 -translate-y-1/2 left-2' src="./iconsearch.svg" alt="" />
                        <input className='h-[36px] w-[480px] pl-8 rounded-[5px]' placeholder='Tìm theo mã và câu hỏi' />
                        <div className='flex flex-col justify-center bg-[#1A6634] rounded-[4px] cursor-pointer'>
                            <div className='flex gap-2 px-[16px]'>
                                <img src="./iconsearchwhite.svg" alt="" />
                                <div className='text-white font-[600]'>Tìm</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần danh sách các câu hỏi */}
            <div className='mt-[30px]'>
                <div className='flex gap-8 text-[#959DB3]'>
                    <label className='flex flex-col justify-center'>
                        <input className='cursor-pointer' type="checkbox" disabled hidden />
                        <span className={`checkmark cursor-pointer`}></span>
                    </label>
                    <div>Câu hỏi</div>
                </div>
            </div>
        </div>
    );
};

export default ListPersonnel;
