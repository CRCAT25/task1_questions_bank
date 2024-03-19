import React, { useState, useEffect } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAdd,
    faDownload,
    faUpload,
    faEllipsis
} from "@fortawesome/free-solid-svg-icons";
import jsonData from '../data.json';

interface CheckboxProps {
    label: string;
}

interface CheckboxEachQuestion {
    id: string;
    question: string;
    typeQuestion: string;
    isChecked: boolean;
}

interface IconProps {
    classIcon: IconProp;
    color: string;
    size: string | number;
}

interface Question {
    id: string;
    question: string;
    typeQuestion: string;
    isChecked: boolean;
}

const ListPersonnel = () => {
    const [checked, setChecked] = useState<string[]>([]); // Change state type to string[] for multiple checkbox selection
    const [listItemChecked, setListItemChecked] = useState<string[]>([]); // Change state type to string[] for multiple checkbox selection
    const [selectedTab, setSelectedTab] = useState<number>(-1);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        setQuestions(jsonData);
    }, []);


    // Các checkbox của tabHeaderStatus
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

    // CheckBox giúp check tất cả câu hỏi
    const CheckboxAllQuestions: React.FC<CheckboxProps> = ({ label }) => {
        const handleChange = () => {
            setCheckAll(!checkAll);
        };

        return (
            <div className='flex gap-5 pl-[20px] text-[#959DB3]'>
                <label className={`flex flex-col justify-center ${checkAll ? 'checked' : ''}`}>
                    <input type="checkbox" checked={checkAll} onChange={handleChange} hidden />
                    <span className={`checkmark cursor-pointer ${checkAll ? 'checked' : ''}`}></span>
                </label>
                <div className='pt-[1.5px] font-[600] text-[#5A6276]'>{label}</div>
            </div>
        );
    };

    // CheckBox giúp check từng câu hỏi
    const CheckboxEachQuestion: React.FC<CheckboxEachQuestion> = ({ id, question, typeQuestion, isChecked }) => {
        const [checked, setChecked] = useState<boolean>(isChecked);

        const handleChange = () => {
            const newChecked = !checked;
            setChecked(newChecked);

        };

        // Trả về nội dung từng hàng chứa nội dung câu hỏi trong bảng
        return (
            <div className={`grid grid-cols-12 mt-[7px] ${checked ? 'bg-item-checked' : 'bg-white'}`}>
                <div className="col-span-6 flex flex-col justify-center h-[80px]">
                    <div className='flex text-[#959DB3]'>
                        <label className={`flex flex-col mx-[20px] justify-center ${checked ? 'checked' : ''}`}>
                            <input type="checkbox" checked={checked} onChange={handleChange} hidden />
                            <span className={`checkmark cursor-pointer ${checked ? 'checked' : ''}`}></span>
                        </label>
                        <div className='flex flex-col justify-center gap-1'>
                            <div className='text-[#26282E] font-[600]'>{question}</div>
                            <div className='flex gap-2'>
                                <div className='text-[#26282E]'>{id}</div>
                                <div className='w-[1px] bg-[#BDC2D2]'></div>
                                <div className='text-[#26282E]'>Loại câu hỏi: {typeQuestion}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-6">
                    <div className='grid grid-cols-3 w-full'>
                        <div className="col-span-1 flex flex-col justify-center">Thương hiệu, văn hóa cty</div>
                        <div className="col-span-1 flex flex-col justify-center text-center">30</div>
                        <div className="col-span-1 gap-[20px] text-center flex justify-end h-full">
                            <div className='flex flex-col justify-center'>Đang soạn thảo</div>
                            <div className='px-[20px] three-dots h-[80px] flex flex-col justify-center'>
                                <Icon classIcon={faEllipsis} color='#959DB3' size={'20px'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    {/* Function Icon trả về 1 icon của FontAwesome */ }
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

    {/* Sự kiện check khi người dùng click vào mỗi checkbox filter tại header */ }
    const handleTabClick = (index: number) => {
        setSelectedTab(index);
    };

    {/* Tạo danh sách các trạng thái tại filter */ }
    const tabHeaderStatus = [
        'Đang soạn thảo',
        'Gửi duyệt',
        'Đã duyệt',
        'Ngưng áp dụng'
    ];

    return (
        <div className='h-full py-[15px] mr-[20px]'>
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
            <div className='flex gap-4 field-search mt-[15px]'>
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

                <div className='flex flex-col justify-between ml-8 gap-3'>
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
            {/* Tiêu đề */}
            <div className='mt-[30px]'>
                <div className='grid grid-cols-12'>
                    <div className="col-span-6">
                        <CheckboxAllQuestions label='Câu hỏi' />
                    </div>
                    <div className="col-span-2 font-[600] text-[#5A6276]">Phân nhóm</div>
                    <div className="col-span-2 font-[600] text-[#5A6276] text-center">Thời gian làm</div>
                    <div className="col-span-2 font-[600] text-[#5A6276] text-center">Tình trạng</div>
                </div>
            </div>

            {/* Nội dung được đọc từ jsonData */}
            <div className='mt-[7px] h-[80px]'>
                {questions.map((question, index) => (
                    <CheckboxEachQuestion
                        key={index}
                        id={question.id}
                        question={question.question}
                        typeQuestion={question.typeQuestion}
                        isChecked={checkAll ? true : question.isChecked}
                    />
                ))}
            </div>
        </div>
    );
};

export default ListPersonnel;
