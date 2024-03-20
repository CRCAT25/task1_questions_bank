import React, { useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAdd,
    faDownload,
    faUpload,
    faEllipsis
} from "@fortawesome/free-solid-svg-icons";
import jsonData from '../newdata.json';

interface CheckboxProps {
    label: string;
}

interface Checkbox {
    label: string;
}

interface CheckboxEachQuestion {
    id: string;
    question: string;
    typeQuestion: string;
    group: string;
    time: string;
    status: string;
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
    group: string;
    time: string;
    status: string;
    isChecked: boolean;
}

interface TabSelected {
    selectedSideBar: string;
}

const ListPersonnel: React.FC<TabSelected> = ({ selectedSideBar }) => {
    const [checked, setChecked] = useState<string[]>([]); // Change state type to string[] for multiple checkbox selection
    const [selectedTab, setSelectedTab] = useState<number>(-1);
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>(getQuestionsFromData(jsonData));
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searched, setSearched] = useState<boolean>(false);

    {/* Tạo danh sách các trạng thái tại filter */ }
    const tabHeaderStatus = [
        'Đang soạn thảo',
        'Gửi duyệt',
        'Đã duyệt',
        'Ngưng áp dụng'
    ];

    // Lấy tất cả thông tin câu hỏi từ file JSON
    function getQuestionsFromData(data: any): Question[] {
        const questions: Question[] = [];

        // Loop through each module in the data
        jsonData.Modules.forEach(module => {
            // Check if the module contains "NHÂN SỰ" key
            if (module["NHÂN SỰ"]) {
                const nhanSu = module["NHÂN SỰ"];

                // Check if "ĐÁNH GIÁ NHÂN SỰ" key exists
                if (nhanSu["ĐÁNH GIÁ NHÂN SỰ"] && nhanSu["ĐÁNH GIÁ NHÂN SỰ"]["TabMenu"]) {
                    // Iterate over the "TabMenu" array
                    nhanSu["ĐÁNH GIÁ NHÂN SỰ"]["TabMenu"].forEach(tab => {
                        const questionBank = tab["Ngân hàng câu hỏi"];

                        // Check if "Ngân hàng câu hỏi" exists and it's an array
                        if (Array.isArray(questionBank)) {
                            // Add each question to the questions array
                            questionBank.forEach((question: Question) => {
                                questions.push(question);
                            });
                        }
                    });
                }
            }
        });

        return questions;
    }

    {/* Tạo class component Icon trả về 1 icon của FontAwesome */ }
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

    // Danh sách các actions
    const tabMenuActive = [
        { icon: 'iconeye.svg', content: 'Xem chi tiết' },
        { icon: 'iconpencil.svg', content: 'Chỉnh sửa' },
        { icon: 'iconsend.svg', content: 'Gửi duyệt' },
        { icon: 'icontick.svg', content: 'Xem chi tiết' },
        { icon: 'iconeye.svg', content: 'Phê duyệt' },
        { icon: 'iconstop.svg', content: 'Ngưng hiển thị' },
        { icon: 'iconreturn.svg', content: 'Trả về' },
        { icon: 'icontrash.svg', content: 'Xóa câu hỏi' },
    ];

    // Phân loại màu của các trạng thái
    const ColorStatus = (status: string) => {
        switch (status) {
            case "Đang soạn thảo":
                return "text-[#26282E]";
            case "Gửi duyệt":
                return "text-[#31ADFF]";
            case "Duyệt áp dụng":
                return "text-[#008000]";
            case "Ngưng áp dụng":
                return "text-[#FB311C]";
            case "Trả về":
                return "text-[#B7B92F]"
        }
    }

    // Tạo class component checkList hiển thị các active khả dụng của 1 item
    const CheckListActive: React.FC<Checkbox> = ({ label }) => {
        let tabMenuTemp = tabMenuActive;
        switch (label) {
            case "Đang soạn thảo":
                tabMenuTemp = tabMenuActive.filter(tab => tab.content === 'Gửi duyệt' || tab.content === 'Trả về' || tab.content === 'Xóa câu hỏi');
                break;
            case "Gửi duyệt":
                tabMenuTemp = tabMenuActive.filter(tab => tab.content === 'Chỉnh sửa' || tab.content === 'Phê duyệt' || tab.content === 'Trả về');
                break;
            case "Duyệt áp dụng":
                tabMenuTemp = tabMenuActive.filter(tab => tab.content === 'Xem chi tiết' || tab.content === 'Ngưng hiển thị');
                break;
            case "Ngưng áp dụng":
                tabMenuTemp = tabMenuActive.filter(tab => tab.content === 'Phê duyệt' || tab.content === 'Trả về');
                break;
            case "Trả về":
                tabMenuTemp = tabMenuActive.filter(tab => tab.content === 'Chỉnh sửa' || tab.content === 'Gửi duyệt');
                break;
        }
        return (
            <div className='absolute z-99 bg-[#BDC2D2] right-[54px] top-[23px] text-white'>
                {tabMenuTemp.map((tab, index) => (
                    <div key={index} className='flex px-3 py-2 cursor-pointer'>
                        <img src={'./' + tab.icon} />
                        <div className={`ml-4`}>{tab.content}</div>
                    </div>
                ))}
            </div>
        );
    };

    // Tạo class component các checkbox của tabHeaderStatus
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

            console.log(questions);
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

    // Tạo class component CheckBox giúp check tất cả câu hỏi
    const CheckboxAllQuestions: React.FC<Checkbox> = ({ label }) => {
        const handleChange = () => {
            const updatedQuestions = questions.map(question => ({
                ...question,
                isChecked: !checkAll // Đảo ngược trạng thái isChecked
            }));
            setQuestions(updatedQuestions);
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
    const CheckboxEachQuestion: React.FC<CheckboxEachQuestion & { className: string }> = ({ id, question, typeQuestion, group, time, status, isChecked, className }) => {
        const [checked, setChecked] = useState<boolean>(isChecked);

        const handleChange = () => {
            const newChecked = !checked;
            setChecked(newChecked);
            // Tìm và cập nhật thuộc tính isChecked trong mảng questions
            const updatedQuestions = questions.map((q) =>
                q.id === id ? { ...q, isChecked: newChecked } : q
            );
            setQuestions(updatedQuestions);
        };

        // Handle click event for each item
        const handleItemClick = (id: string) => {
            if (selectedItemId === id) {
                setSelectedItemId(null); // Unselect the item if it's already selected
            } else {
                setSelectedItemId(id); // Select the clicked item
            }
        };


        // Trả về nội dung từng hàng chứa nội dung câu hỏi trong bảng
        return (
            <div className={`grid grid-cols-12 mt-[7px] ${className} item${id}`}>
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
                <div className={`col-span-6 relative ${selectedItemId === id ? 'z-10' : 'z-0'}`}>
                    <div className='grid grid-cols-3 w-full'>
                        <div className="col-span-1 flex flex-col justify-center">{group}</div>
                        <div className="col-span-1 flex flex-col justify-center text-center">{time}</div>
                        <div className="col-span-1 gap-[20px] text-center flex justify-end h-full">
                            <div className={`flex flex-col justify-center ${ColorStatus(status)}`}>{status}</div>
                            <div className={`px-[20px] three-dots h-[80px] flex flex-col justify-center`} onClick={() => handleItemClick(id)}>
                                <span>
                                    <FontAwesomeIcon icon={faEllipsis} style={{
                                        width: '20px',
                                        height: '20px',
                                        color: selectedItemId === id ? 'white' : '#959DB3',
                                        cursor: "pointer",
                                        padding: '6px',
                                        borderRadius: '0 2px 2px 0',
                                        backgroundColor: selectedItemId === id ? 'rgba(189, 194, 210, 1)' : '',
                                        border: selectedItemId === id ? '0.5px solid rgba(0, 0, 0, 0.03)' : '0.5px solid rgba(0, 0, 0, 0)'
                                    }
                                    } />
                                </span>
                                {selectedItemId === id ? (
                                    <CheckListActive label={status} />
                                ) : ('')}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );
    };

    {/* Sự kiện check khi người dùng click vào mỗi checkbox filter tại header */ }
    const handleTabClick = (index: number) => {
        setSelectedTab(index);
    };

    const isQuestionInCheckedStatus = (question: Question): boolean => {
        return checked.length === 0 || checked.includes(question.status);
    };

    // Xử lý sự kiện thay đổi của ô nhập liệu tìm kiếm
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        if (event.target.value === '') {
            setSearched(false);
        }
    };

    // Lọc ra những câu hỏi có tên hoặc mã giống như tìm kiếm
    const isQuestionMatchSearch = (question: Question): boolean => {
        const searchLowercase = searchValue.toLowerCase();
        return (
            question.id.toLowerCase().includes(searchLowercase) ||
            question.question.toLowerCase().includes(searchLowercase)
        );
    };

    // Tạo sự kiện tìm kiếm khi nhấn nút "Enter"
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setSearched(true); // Đặt trạng thái searched thành true khi nhấn phím Enter
        }
    };

    const handleResetFilter = () => {
        setCheckAll(false);
        setSearched(false);
        setSearchValue('');
        setChecked([]);
    }

    return (
        <>
            {selectedSideBar === "Ngân hàng câu hỏi" ? (<>
                <div className='h-[100vh] py-[15px] mr-[20px]'>
                    <div className='flex justify-between'>
                        {/* Phần header bao gồm các checkbox trạng thái */}
                        <div className='flex gap-5'>
                            {tabHeaderStatus.map((tab, index) => (
                                <div
                                    key={index}
                                    className={`h-[46px] bg-white flex flex-col justify-center rounded-[24px] ${checked.includes(tab) ? 'border-[2px] border-[#008000]' : 'border-[2px] border-[#fff]'} cursor-pointer px-6 flex ${index === selectedTab ? '' : ''}`}
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

                            <div onClick={handleResetFilter} className='underline text-[#008000] h-[36px] flex flex-col justify-center cursor-pointer'>
                                Reset bộ lọc
                            </div>
                        </div>

                        <div className='flex flex-col justify-between ml-8 gap-3'>
                            <div className='text-[#959DB3] font-[600]'>
                                Tìm kiếm
                            </div>

                            <div className='relative flex gap-3'>
                                <img className='absolute top-1/2 -translate-y-1/2 left-2' src="./iconsearch.svg" alt="" />
                                <input className='h-[36px] w-[480px] pl-8 rounded-[5px]' placeholder='Tìm theo mã và câu hỏi' onKeyPress={handleKeyPress} value={searchValue} onChange={handleSearchChange} />
                                <div onClick={() => setSearched(true)} className='flex flex-col justify-center bg-[#1A6634] rounded-[4px] cursor-pointer'>
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
                        {/* Nội dung được đọc từ jsonData */}
                    </div>

                    <div className=' h-[63vh] overflow-y-auto'>
                        <div className='mt-[7px] h-[80px]'>
                            {questions
                                .filter(isQuestionInCheckedStatus)
                                .filter(question => searched ? isQuestionMatchSearch(question) : true)// Lọc danh sách theo từ khóa tìm kiếm
                                .map((question, index) => (
                                    <CheckboxEachQuestion
                                        key={index}
                                        id={question.id}
                                        question={question.question}
                                        typeQuestion={question.typeQuestion}
                                        group={question.group}
                                        time={question.time}
                                        status={question.status}
                                        isChecked={question.isChecked}
                                        className={question.isChecked ? 'bg-item-checked' : 'bg-white'} // Thêm className dựa trên trạng thái isChecked
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </>) : (<></>)}

        </>

    );
};

export default ListPersonnel;
