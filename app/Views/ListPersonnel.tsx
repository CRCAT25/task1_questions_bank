import React, { useEffect, useRef, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAdd,
    faEllipsis,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import jsonData from '../Models/newdata.json';
import LoadingIcon from "./Loading"

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

interface CommonStatus {
    listCommonStatus: string[];
}

interface TabMenuItem {
    icon: string;
    content: string;
}

interface StatusChangeActions {
    [key: string]: string;
}

const listNumItem = [25, 50, 75, 100];

// Tạo danh sách các trạng thái tại filter
const tabHeaderStatus = [
    'Đang soạn thảo',
    'Gửi duyệt',
    'Duyệt áp dụng',
    'Ngưng áp dụng',
];

const statusChangeActions: StatusChangeActions = {
    "Đang soạn thảo_Gửi duyệt": "Gửi duyệt",
    "Ngưng áp dụng_Duyệt áp dụng": "Duyệt áp dụng",
    "Trả về_Gửi duyệt": "Gửi duyệt",
    "Gửi duyệt_Duyệt áp dụng": "Duyệt áp dụng",
    "Ngưng áp dụng_Trả về": "Trả về",
    "Đang soạn thảo_Xóa câu hỏi": "Xóa câu hỏi",
    "Duyệt áp dụng_Ngưng hiển thị": "Ngưng áp dụng",
};

// Danh sách các actions
const tabMenuActiveBlack = [
    { icon: 'iconsendblack.svg', content: 'Gửi duyệt' },
    { icon: 'iconcheckedblack.svg', content: 'Duyệt áp dụng' },
    { icon: 'iconstopblack.svg', content: 'Ngưng hiển thị' },
    { icon: 'iconreturnblack.svg', content: 'Trả về' },
    { icon: 'icontrashred.svg', content: 'Xóa câu hỏi' },
];

// Danh sách các actions
const tabMenuActive = [
    { icon: 'iconeye.svg', content: 'Xem chi tiết' },
    { icon: 'iconpencil.svg', content: 'Chỉnh sửa' },
    { icon: 'iconsend.svg', content: 'Gửi duyệt' },
    { icon: 'icontick.svg', content: 'Phê duyệt' },
    { icon: 'iconstop.svg', content: 'Ngưng hiển thị' },
    { icon: 'iconreturn.svg', content: 'Trả về' },
    { icon: 'icontrash.svg', content: 'Xóa câu hỏi' },
];

const ListPersonnel: React.FC<TabSelected> = ({ selectedSideBar }) => {
    const [checked, setChecked] = useState<string[]>(JSON.parse(localStorage.getItem("checkedItems") ?? "[]"));
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<Question[]>(getQuestionsFromData(jsonData));
    const [selectedItemId, setSelectedItemId] = useState<string | null>('--');
    const [searchValue, setSearchValue] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [listQuestionDeleted, setListQuestionDeleted] = useState<string[]>([]); // Khởi tạo danh sách các câu hỏi cần xóa
    const [statusMessages, setStatusMessages] = useState<TabMenuItem[]>([]);
    const [numQues, setNumQues] = useState<number>(25);
    const [openNumQues, setOpenNumQues] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [isSend, setIsSend] = useState<boolean>(false);
    const boxRefNumPage = useRef<HTMLDivElement>(null);
    const [isCheckListActiveOpen, setIsCheckListActiveOpen] = useState(false);

    // Reset toàn bộ nếu chuyển sang Module khác
    useEffect(() => {
        setDeleteConfirm(false);
        setSearchValue('');
        setSelectedItemId('');
        setQuestions(getQuestionsFromData(jsonData));
        setCheckAll(false);
        setListQuestionDeleted([]);
        setCurrentPage(1);
        setOpenNumQues(false);
        setNumQues(25);
    }, [selectedSideBar]);

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

    // Tạo class component Icon trả về 1 icon của FontAwesome
    const Icon: React.FC<IconProps> = ({ classIcon, color, size }) => {
        const iconSize = {
            width: size,
            height: size,
            color: color,
            cursor: "pointer"
        };

        return (
            <div className='flex flex-col justify-center'>
                <FontAwesomeIcon icon={classIcon} style={iconSize} />
            </div>
        );
    };

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

    const handleButtonClick = (icon: string, content: string) => {
        setStatusMessages(prevMessages => [...prevMessages, { icon, content }]);
        // Automatically remove the message after 3 seconds
        setTimeout(() => {
            removeStatusMessage({ icon, content });
        }, 3000);
    };

    const removeStatusMessage = (messageToRemove: TabMenuItem) => {
        setStatusMessages(prevMessages => prevMessages.filter(message => message !== messageToRemove));
    };

    // Hàm xử lý thay đổi trạng thái của 1 câu hỏi dựa trên hoạt động được chọn
    const handleQuestionStatusChange = (questionId: string, newStatus: string) => {
        let updatedStatus: string;
        if (newStatus === "Xóa câu hỏi") {
            setDeleteConfirm(true);
        }
        else {
            switch (newStatus) {
                case "Phê duyệt":
                    updatedStatus = "Duyệt áp dụng";
                    handleButtonClick('icontick.svg', questionId + ' phê duyệt thành công');
                    break;
                case "Ngưng hiển thị":
                    updatedStatus = "Ngưng áp dụng";
                    handleButtonClick('iconstop.svg', questionId + ' ngưng hiển thị thành công');
                    break;
                case "Trả về":
                    updatedStatus = "Trả về";
                    handleButtonClick('iconreturn.svg', questionId + ' trả về thành công');
                    break;
                case "Gửi duyệt":
                    if (isSend) {
                        updatedStatus = "Gửi duyệt";
                        handleButtonClick('iconsend.svg', questionId + ' gửi duyệt thành công');
                    } else {
                        handleButtonClick('iconsend.svg', questionId + ' gửi duyệt thất bại');
                        return; // Không cập nhật status nếu gửi duyệt thất bại
                    }

                    break;
                case "Chỉnh sửa":
                    questionId = ''
                    break;
                case "Xem chi tiết":
                    questionId = ''
                    break;
                default:
                    updatedStatus = newStatus;
                    break;
            }

            const updatedQuestions = questions.map(question => {
                if (question.id === questionId) {
                    return {
                        ...question,
                        status: updatedStatus
                    };
                }
                return question;
            });
            setQuestions(updatedQuestions);
        }
        setSelectedItemId('');
    };

    // Hàm xử lý các action cho nhiều item cùng 1 lúc
    const handleMultipleQuestionStatusChange = (newStatus: string) => {
        const listfail: string[] = [];
        const updatedQuestions = questions.map(question => {
            if (question.isChecked) {
                if (newStatus !== "Xóa câu hỏi") {
                    const key = `${question.status}_${newStatus}`;
                    const updatedStatus = statusChangeActions[key];
                    if (updatedStatus && question.id !== 'null' && question.question !== '' && question.typeQuestion !== '') {
                        handleButtonClick('iconsend.svg', `${question.id} ${updatedStatus} thành công`);
                        return {
                            ...question,
                            status: updatedStatus,
                            isChecked: false
                        };
                    } else {
                        listfail.push(question.id)
                        // Trạng thái không thay đổi
                        return {
                            ...question, isChecked: false
                        }
                    }
                }
                else if (newStatus === "Xóa câu hỏi" && question.status === "Đang soạn thảo") {
                    setDeleteConfirm(true);
                    setListQuestionDeleted(prevList => [...prevList, question.id]);
                }
            }
            return question;
        });
        if (newStatus !== "Xóa câu hỏi") {
            let listFailDisplay = '';
            if (listfail.length <= 3) {
                listFailDisplay = listfail.join(', ');
            } else {
                listFailDisplay = `${listfail.slice(0, 3).join(', ')} ...`;
            }
            handleButtonClick('iconsend.svg', `${listFailDisplay} gửi duyệt thất bại`);
        }
        setQuestions(updatedQuestions);
        setCheckAll(false);
        setSelectedItemId('');
    };

    const handleActivityClick = (activity: string) => {
        // Gọi hàm xử lý thay đổi trạng thái của câu hỏi
        handleQuestionStatusChange(selectedItemId!, activity); // selectedItemId! đảm bảo rằng selectedItemId không null
    };

    // Tạo class component checkList hiển thị các active khả dụng của 1 item
    const CheckListActive: React.FC<Checkbox> = ({ label }) => {
        let tabMenuTemp = tabMenuActive;
        switch (label) {
            case "Đang soạn thảo":
                tabMenuTemp = tabMenuActive.filter(tab => tab.content === 'Gửi duyệt' || tab.content === 'Xóa câu hỏi');
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
            <div className='absolute z-30 bg-[#BDC2D2] right-[38px] top-[17px] text-white'>
                {tabMenuTemp.map((tab, index) => (
                    <div key={index} className='flex px-3 py-2 cursor-pointer' onClick={() => { handleActivityClick(tab.content); unCheckAllQuestion }}>
                        <img src={'./' + tab.icon} />
                        <div className={`ml-4`}>{tab.content}</div>
                    </div>
                ))}
            </div>
        );
    };

    // Lấy danh sách các action khi chọn cùng lúc nhiều item
    const CheckListCommonActive: React.FC<CommonStatus> = ({ listCommonStatus }) => {
        let list: TabMenuItem[] = [];

        listCommonStatus.forEach(status => {
            let listTemp: TabMenuItem[] = [];
            switch (status) {
                case "Đang soạn thảo":
                    listTemp = tabMenuActiveBlack.filter(tab => tab.content === 'Gửi duyệt' || tab.content === 'Xóa câu hỏi');
                    break;
                case "Gửi duyệt":
                    listTemp = tabMenuActiveBlack.filter(tab => tab.content === 'Duyệt áp dụng' || tab.content === 'Trả về');
                    break;
                case "Duyệt áp dụng":
                    listTemp = tabMenuActiveBlack.filter(tab => tab.content === 'Ngưng hiển thị');
                    break;
                case "Ngưng áp dụng":
                    listTemp = tabMenuActiveBlack.filter(tab => tab.content === 'Duyệt áp dụng' || tab.content === 'Trả về');
                    break;
                case "Trả về":
                    listTemp = tabMenuActiveBlack.filter(tab => tab.content === 'Gửi duyệt');
                    break;
            }

            // Kiểm tra từng phần tử trong listTemp trước khi thêm vào list
            listTemp.forEach(item => {
                if (!list.some(existingItem => existingItem.content === item.content)) {
                    list.push(item); // Thêm phần tử vào list nếu chưa tồn tại trong list
                }
            });
        });

        // Sắp xếp list theo thứ tự: Gửi duyệt, Trả về, Duyệt áp dụng, Ngừng áp dụng, Xóa câu hỏi
        list.sort((a, b) => {
            const order = ['Gửi duyệt', 'Trả về', 'Duyệt áp dụng', 'Ngừng áp dụng', 'Xóa câu hỏi'];
            return order.indexOf(a.content) - order.indexOf(b.content);
        });

        return (
            <div className='flex'>
                {list.map((item, index) => (
                    <div key={index}>
                        <div className='w-[120px] h-[80px] flex flex-col gap-3 justify-center hover:bg-[#dddddd]' onClick={() => handleMultipleQuestionStatusChange(item.content)}>
                            <img className='h-[20px] flex justify-center' src={item.icon} />
                            <div className={`text-center ${item.content === 'Xóa câu hỏi' ? 'text-[#FD7676]' : 'text-black'}`}>{item.content}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Lấy trạng thái của các câu hỏi được chọn
    const getStatusOfSelectedQuestions = () => {
        // Lọc danh sách câu hỏi và chỉ lấy những câu hỏi có isChecked === true
        const selectedQuestions = questions.filter(question => question.isChecked);

        // Trích xuất trạng thái của từng câu hỏi được chọn
        const statuses = selectedQuestions.map(question => question.status);

        return statuses;
    };

    // Lấy số lượng câu hỏi được chọn
    const getNumberQuestionsChecked = () => {
        return (<div className='text-[30px]'>
            {questions.filter(question => question.isChecked).length}
        </div>)
    }

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

            // Lưu vào localStorage
        };

        return (
            <div className={`h-[36px] text-nowrap cursor-pointer text-[14px] text-black bg-white flex flex-col justify-center item-tabHeader rounded-[24px] ${checked.includes(label) ? 'border-[1px] border-[#008000]' : 'border-[1px] border-[#fff]'} cursor-pointer py-1 px-2`} onClick={() => handleChange(label)}>
                <div className='flex gap-2 text-[#23282c]'>
                    <div className='mb-[1px] select-none'>{label === 'Duyệt áp dụng' ? 'Đã duyệt' : label}</div>
                    <label className='flex flex-col justify-center'>
                        <input className='cursor-pointer' type="checkbox" checked={checked.includes(label)} onChange={() => handleChange(label)} disabled hidden />
                        <span className={`checkmark cursor-pointer ${checked.includes(label) ? 'checked' : ''}`}></span>
                    </label>
                </div>
            </div>
        );
    };

    // Tạo class component CheckBox check tất cả câu hỏi
    const CheckboxAllQuestions: React.FC<Checkbox> = ({ label }) => {
        const handleChange = () => {
            const updatedQuestions = questions.map(question => {
                if (currentItems.slice(indexOfFirstItem, indexOfLastItem).includes(question)) {
                    return {
                        ...question,
                        isChecked: !checkAll // Đảo ngược trạng thái isChecked
                    };
                }
                return question;
            });
            setQuestions(updatedQuestions);
            setCheckAll(!checkAll);
        };

        return (
            <div className='flex gap-5 pl-[20px]'>
                <label className={`flex flex-col justify-center ${checkAll ? 'checked' : ''}`}>
                    <input type="checkbox" checked={checkAll} onChange={handleChange} hidden />
                    <span className={`checkmark cursor-pointer hover:bg-[#008000] border-[1px] hover:border-[#008000] ${checkAll ? 'checked' : ''}`}></span>
                </label>
                <div className='pt-[1.5px] font-[600] text-[#000]'>{label}</div>
            </div>
        );
    };

    // Tạo class component từng câu hỏi cụ thể
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
            setCheckAll(false);
        };


        // Handle click event for each item
        const handleItemClick = (id: string, question: string) => {
            if (selectedItemId === id) {
                setSelectedItemId('');
            } else {
                setListQuestionDeleted([]);
                setSelectedItemId(id); // Lưu id của câu hỏi được nhấp vào
                setListQuestionDeleted(prevList => [...prevList, id]);
            }
        };


        // Trả về nội dung từng hàng chứa nội dung câu hỏi trong bảng
        return (
            <div className={`grid grid-cols-12 mb-[4px] ${className} item${id} text-[13px] h-[58px] hover:bg-[#9ABBA8] par-ques`}>
                <div className="col-span-6 flex flex-col justify-center h-[58px] box1">
                    <div className='flex text-[#959DB3]'>
                        <label className={`flex flex-col mx-[20px] justify-center ${checked ? 'checked' : ''}`}>
                            <input type="checkbox" checked={checked} onChange={handleChange} hidden />
                            <span className={`checkmark cursor-pointer hover:bg-[#008000] border-[1px] hover:border-[#008000] ${checked ? 'checked' : ''}`}></span>
                        </label>
                        <div className='flex flex-col justify-center gap-1'>
                            <div className={`text-[#26282E] font-[600] text-question ${question === '' && 'invisible'}`} title={question}>{question === '' ? 'null' : question}</div>
                            <div className='flex gap-2'>
                                <div className={`text-[#26282E] ${id === 'null' && 'hidden'} `} title={id}>{id}</div>
                                <div className={`w-[1px] bg-[#BDC2D2] ${id === 'null' && 'hidden'} ${typeQuestion === '' && 'invisible'}`}></div>
                                <div className={`text-[#26282E] text-type ${typeQuestion === '' && 'invisible'}`} title={typeQuestion}>{typeQuestion === '' ? 'null' : `Loại câu hỏi:  ${typeQuestion}`}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`col-span-6 relative ${selectedItemId === id ? 'z-10' : 'z-0'}`}>
                    <div className='grid grid-cols-3 w-full'>
                        <div className="col-span-1 flex flex-col justify-center">
                            <div className='text-group' title={group}>{group}</div>
                        </div>
                        <div className="col-span-1 flex flex-col justify-center text-center text-[#000] font-[600] time">{time}</div>
                        <div className="col-span-1 gap-[20px] text-center flex justify-end h-full">
                            <div className={`flex flex-col justify-center ${ColorStatus(status)} text-status`}>{status}</div>
                            <div title='Settings' className={`px-[10px] three-dots h-[58px] flex flex-col justify-center setting`}
                                onClick={() => {
                                    setIsCheckListActiveOpen(true);
                                    if (!isAnyQuestionChecked()) {
                                        handleItemClick(id, question);
                                        if (id === 'null' || typeQuestion === '' || question === '') {
                                            setIsSend(false);
                                        }
                                        else {
                                            setIsSend(true);
                                        }
                                    }
                                }
                                }
                            >
                                <span className={`flex flex-col justify-center button-setting rounded-[2px] hover:bg-[#e5e7eb]`}>
                                    <FontAwesomeIcon icon={faEllipsis} style={{
                                        width: '18px',
                                        height: '18px',
                                        color: isCheckListActiveOpen && selectedItemId === id ? 'white' : '#959DB3',
                                        cursor: "pointer",
                                        padding: '5px',
                                        borderRadius: '0 2px 2px 0',
                                        backgroundColor: isCheckListActiveOpen && selectedItemId === id ? 'rgba(189, 194, 210, 1)' : '',
                                    }
                                    } />
                                </span>
                                {isCheckListActiveOpen && selectedItemId === id && (
                                    <CheckListActive label={status} />
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Kiểm tra xem có filter status nào đang được check hay không
    const isQuestionInCheckedStatus = (question: Question): boolean => {
        let tempChecked = [...checked]; // Tạo một bản sao của checked để tránh thay đổi trực tiếp

        if (tempChecked.includes("Đang soạn thảo")) {
            checked.push("Trả về"); // Thêm "Trả về" vào tempChecked
        }

        // Kiểm tra xem có filter status nào đang được check hay không
        return tempChecked.length === 0 || tempChecked.includes(question.status);
    };

    // Xử lý sự kiện thay đổi của ô nhập liệu tìm kiếm
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    // Tạo sự kiện tìm kiếm khi nhấn nút "Enter"
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            searchQuestions(); // Đặt trạng thái searched thành true khi nhấn phím Enter
        }
    };

    // Tạo sự kiện xóa toàn bộ filters
    const handleResetFilter = () => {
        localStorage.removeItem("checkedItems");
        setChecked(["Đang soạn thảo"]);
        setCheckAll(false);
        setSearchValue('');
        setListQuestionDeleted([]);
    }

    // Tạo sự kiện xóa các câu hỏi trong danh sách được chọn
    const deleteListQuestion = (list: string[]) => {
        // Lọc ra danh sách câu hỏi không có id trong listQuestionDeleted
        const updatedQuestions = questions.filter(question => !listQuestionDeleted.includes(question.id));
        // Cập nhật danh sách chỉ với các câu hỏi không có id trong listQuestionDeleted
        setQuestions(updatedQuestions);
        setListQuestionDeleted([]);
        setCheckAll(false);
    };

    // Hàm tìm kiếm câu hỏi
    const searchQuestions = () => {
        const filteredQuestions = questions.filter((question) =>
            question.id.toLowerCase().includes(searchValue.toLowerCase()) ||
            question.question.toLowerCase().includes(searchValue.toLowerCase()) &&
            checked.includes(question.status)
        );
        // Cập nhật danh sách câu hỏi hiển thị sau khi tìm kiếm
        setQuestions(filteredQuestions);
        setTotalPages(filteredQuestions.length / itemsPerPage + 1);
        if (searchValue === '') {
            setQuestions(getQuestionsFromData(jsonData));
        }
        if (filteredQuestions.length === 0) {
            setTotalPages(0);
        }
    };

    // Kiểm tra xem có câu hỏi nào đang được check hay không
    const isAnyQuestionChecked = () => {
        return questions.some(question => question.isChecked);
    };

    // Tạo sự kiện unCheck toàn bộ câu hỏi đang được check
    const unCheckAllQuestion = () => {
        const updatedQuestions = questions.map(question => {
            return {
                ...question,
                isChecked: false
            };
        });
        setQuestions(updatedQuestions);
        setCheckAll(false);
    }

    const handleItemsPerPageChange = (num: number) => {
        const newItemsPerPage = num;
        setItemsPerPage(newItemsPerPage);
        setNumQues(num);
        // Tính lại totalPages dựa trên số lượng mục muốn hiển thị mới
        const newTotalPages = Math.ceil(questions.length / newItemsPerPage);
        setTotalPages(newTotalPages);
        // Nếu trang hiện tại vượt quá số trang mới, chuyển đến trang cuối cùng
        if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages);
        }
    };

    // Tính chỉ số của item đầu tiên trên trang hiện tại
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    // Tính chỉ số của item cuối cùng trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;

    // Lấy dữ liệu của trang hiện tại bằng cách slice mảng dữ liệu ban đầu
    const [currentItems, setCurrentItems] = useState(questions.filter(isQuestionInCheckedStatus));

    useEffect(() => {
        let filteredItems = questions.filter(isQuestionInCheckedStatus).filter(question => checked.includes(question.status));
        let totalPagesCount = Math.ceil(filteredItems.length / itemsPerPage);

        // Nếu chỉ có một trong hai phần tử "Đang soạn thảo" hoặc "Trả về" được chọn, loại bỏ nó khỏi checked
        if ((!checked.includes("Đang soạn thảo") && checked.includes("Trả về")) ||
            (checked.includes("Đang soạn thảo") && !checked.includes("Trả về"))) {
            setChecked(prevChecked => prevChecked.filter(status => status !== "Đang soạn thảo" && status !== "Trả về"));
        }

        // Nếu không có "Đang soạn thảo", "Duyệt áp dụng", "Ngưng áp dụng" và "Gửi duyệt" trong checked, hiển thị tất cả câu hỏi
        if (!checked.includes("Đang soạn thảo") && !checked.includes("Duyệt áp dụng") && !checked.includes("Ngưng áp dụng") && !checked.includes("Gửi duyệt")) {
            filteredItems = questions;
            totalPagesCount = Math.ceil(filteredItems.length / itemsPerPage);
        }

        setCurrentItems(filteredItems);
        setTotalPages(totalPagesCount);
    }, [checked, questions, itemsPerPage]);

    // unCheck toàn bộ câu hỏi sau khi xóa
    useEffect(() => {
        if (listQuestionDeleted.length === 0) {
            unCheckAllQuestion();
        }
    }, [listQuestionDeleted]);

    // Nếu check vào tabHeader sẽ quay về mặc định trang hiện tại là 1
    useEffect(() => {
        setCurrentPage(1);
        localStorage.setItem('checkedItems', JSON.stringify(checked.filter((item, index) => checked.indexOf(item) === index)));
    }, [checked]);

    useEffect(() => {
        // Lấy số lượng các mục được kiểm tra
        const checkedItemCount = currentItems.filter(question => question.isChecked).slice(indexOfFirstItem, indexOfLastItem).length;
        if (checkedItemCount === currentItems.slice(indexOfFirstItem, indexOfLastItem).length) {
            setCheckAll(true);
        }
        else {
            setCheckAll(false);
        }
        const isAllChecked = currentItems.slice(indexOfFirstItem, indexOfLastItem).every(question => question.isChecked);
        setCheckAll(isAllChecked);
    }, [currentItems, currentPage]);

    // Nếu fetch xong data tắt loading
    useEffect(() => {
        if (questions) {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }, [questions]);


    // Kiểm tra nếu list không có item nào bỏ checkAll
    useEffect(() => {
        // Lấy số lượng các mục được kiểm tra
        if (currentItems.length === 0) {
            setCheckAll(false);
        }

    }, [currentItems]);



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (boxRefNumPage.current && !boxRefNumPage.current.contains(event.target as Node)) {
                setOpenNumQues(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('[title="Settings"]')) {
                setIsCheckListActiveOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    // Chuyển trang
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Render các nút phân trang
    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        // Tính chỉ số của trang đầu tiên để hiển thị
        let startPage = 1;
        if (currentPage > 2) {
            startPage = currentPage - 1;
        }

        return (
            <ul className="pagination flex gap-1 text-[13px]">
                {/* Nút đầu */}
                <li className={`flex flex-col justify-center select-none font-[600] hover:bg-[#5c6873] hover:text-white duration-200 rounded-[5px] ${currentPage === 1 && 'pointer-events-none text-[#959DB3]'}`}>
                    <div className="px-2 py-2 rounded-[5px] cursor-pointer" onClick={() => paginate(1)}>
                        Đầu
                    </div>
                </li>

                {/* Nút quay lại */}
                <li className={`flex flex-col justify-center select-none ${currentPage === 1 && 'pointer-events-none'}`}>
                    <div className="px-2 py-2 rounded-[5px] cursor-pointer" onClick={() => paginate(currentPage - 1)}>
                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className={`${currentPage === 1 && 'fill-[#959DB3]'}`} d="M0.278864 7.09743C0.244177 7.14743 0.2134 7.20059 0.186864 7.25633C0.143421 7.31714 0.105568 7.38256 0.0738643 7.45164C0.0532173 7.52347 0.039147 7.5974 0.0318643 7.67233C-0.0106214 7.81384 -0.0106214 7.96669 0.0318643 8.10819C0.039147 8.18312 0.0532173 8.25705 0.0738643 8.32888C0.105625 8.39758 0.143477 8.46263 0.186864 8.52309C0.213201 8.58035 0.243983 8.635 0.278864 8.6864V8.6864L5.91986 14.5159C6.12649 14.7148 6.39501 14.8174 6.66884 14.8021C6.94267 14.7868 7.20042 14.6547 7.38778 14.4338C7.57513 14.2129 7.67745 13.9204 7.67317 13.6179C7.6689 13.3154 7.55836 13.0265 7.36486 12.8122L2.54886 7.82461L7.36486 2.83702C7.55836 2.62268 7.6689 2.33381 7.67317 2.0313C7.67745 1.7288 7.57513 1.43627 7.38778 1.21537C7.20042 0.994478 6.94267 0.862463 6.66884 0.847152C6.39501 0.831841 6.12649 0.934429 5.91986 1.1333L0.278864 7.09743Z" fill="black" />
                        </svg>
                    </div>
                </li>

                {/* Nút ... quay lại */}
                {currentPage > 3 && (
                    <li className=' flex flex-col justify-center select-none'>
                        <div className="px-2 py-2 rounded-[5px] cursor-pointer" onClick={() => paginate(currentPage - 3)}>
                            ...
                        </div>
                    </li>
                )}

                {/* Hiển thị các trang */}
                {pageNumbers.slice(startPage - 1, startPage + 2).map((number) => (
                    <li key={number}>
                        <div className={`px-2 py-2 select-none rounded-[5px] cursor-pointer hover:bg-[#5c6873] hover:text-white duration-200 ${number === currentPage ? 'bg-[#5c6873] text-white shadow4 active' : 'text-[#000]'}`} onClick={() => paginate(number)}>
                            {number}
                        </div>
                    </li>
                ))}

                {/* Nút ... tiếp theo */}
                {(totalPages > 3 && totalPages - currentPage > 1) && (
                    <li className=' flex flex-col justify-center select-none'>
                        <div className="px-2 py-2 rounded-[5px] cursor-pointer" onClick={() => { paginate(currentPage + 3); }}>
                            ...
                        </div>
                    </li>
                )}

                {/* Nút tiếp theo */}
                <li className={`flex flex-col justify-center select-none ${currentItems.length === 0 && 'pointer-events-none'} ${currentPage === totalPages && 'pointer-events-none'}`}>
                    <div className="px-2 py-2 rounded-[6px] cursor-pointer" onClick={() => paginate(currentPage + 1)}>
                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className={`${currentPage === totalPages && 'fill-[#959DB3]'} ${currentItems.length === 0 && 'fill-[#959DB3]'}`} d="M7.41108 8.55183C7.44576 8.50183 7.47654 8.44867 7.50308 8.39293C7.54652 8.33212 7.58437 8.2667 7.61608 8.19762C7.63672 8.12579 7.65079 8.05186 7.65808 7.97693C7.70056 7.83543 7.70056 7.68257 7.65808 7.54107C7.65079 7.46614 7.63672 7.39221 7.61608 7.32038C7.58432 7.25168 7.54646 7.18663 7.50308 7.12617C7.47674 7.06891 7.44596 7.01427 7.41108 6.96286V6.96286L1.77007 1.13334C1.56344 0.934477 1.29492 0.831889 1.02109 0.8472C0.74726 0.862511 0.48951 0.994525 0.302158 1.21542C0.114807 1.43632 0.0124869 1.72884 0.0167611 2.03135C0.0210353 2.33386 0.13157 2.62272 0.325071 2.83707L5.14107 7.82465L0.325071 12.8122C0.13157 13.0266 0.0210353 13.3154 0.0167611 13.618C0.0124869 13.9205 0.114807 14.213 0.302158 14.4339C0.48951 14.6548 0.74726 14.7868 1.02109 14.8021C1.29492 14.8174 1.56344 14.7148 1.77007 14.516L7.41108 8.55183Z" fill="black" />
                        </svg>
                    </div>
                </li>

                {/* Nút cuối */}
                <li className={`flex flex-col justify-center select-none font-[600] hover:bg-[#5c6873] hover:text-white duration-200 rounded-[5px] ${currentPage === totalPages || currentItems.length === 0 ? 'pointer-events-none text-[#959DB3]' : 'text-black'}`}>
                    <div className="px-2 py-2 rounded-[6px] cursor-pointer" onClick={() => {
                        if (totalPages > 1) {
                            paginate(totalPages);
                        }
                    }}>
                        Cuối
                    </div>
                </li>
            </ul>
        );
    };

    return (
        <>
            {selectedSideBar === "Ngân hàng câu hỏi" && (<>
                <div className='h-[100vh] mr-6 pl-5 relative'>
                    <div className={`flex mt-[15px] justify-between ${isAnyQuestionChecked() && 'pointer-events-none'}`}>
                        {/* Phần header bao gồm các checkbox trạng thái */}
                        <div className='flex gap-5'>
                            {tabHeaderStatus.map((tab, index) => (
                                <div key={index}>
                                    <Checkbox label={tab} />
                                </div>
                            ))}
                        </div>

                        {/* Phần header có import export add */}
                        <div className='flex gap-5 text-[14px]'>
                            {/* Button export file */}
                            <div className='flex flex-col justify-center bg-[#fff] rounded-[5px] cursor-pointer shadow3 border-[1px] border-white hover:border-[#008000]' title='Upload file here'>
                                <div className='flex gap-2 h-[36px] flex-col justify-center px-[9px]'>
                                    <img className='h-[18px] w-[18px] mx-auto' src='./iconimport.png' />
                                </div>
                            </div>

                            {/* Button import file */}
                            <div className='flex flex-col justify-center bg-[#fff] rounded-[5px] cursor-pointer shadow3 border-[1px] border-white hover:border-[#008000]'>

                                <div className='flex gap-2 h-[36px] px-[9px]'>
                                    <div className='flex flex-col justify-center'>
                                        <img className='h-[18px] w-[18px]' src='./iconexport.png' />
                                    </div>

                                    <div className='flex flex-col justify-center'>
                                        <div className='font-600 text-[#23282c]'>Template</div>
                                    </div>
                                </div>
                            </div>

                            {/* Button Add */}
                            <div className='flex flex-col justify-center hover:bg-[#2e7447] bg-[#1A6634] rounded-[5px] cursor-pointer shadow-blue'>
                                <div className='flex gap-2 px-[9px]'>
                                    <div className='flex flex-col justify-center'>
                                        <Icon classIcon={faAdd} color='white' size={'18px'} />
                                    </div>
                                    <div className='text-white font-[600] flex flex-col justify-center'>THÊM MỚI</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phần search */}
                    <div className={`flex gap-4 field-search mt-[15px] ${isAnyQuestionChecked() && 'pointer-events-none'}`}>
                        <div className='flex flex-col justify-between'>
                            <div>
                                <img src="./iconfilter.svg" alt="" />
                            </div>
                        </div>

                        <div className='flex flex-col justify-between'>
                            <div className='text-[#5A6276] font-[600]'>
                                LỌC DỮ LIỆU
                            </div>

                            <div onClick={handleResetFilter} className='underline hover:text-[#5CB800] text-[#008000] h-[36px] flex flex-col justify-center cursor-pointer'>
                                Reset bộ lọc
                            </div>
                        </div>

                        <div className='flex flex-col justify-between ml-8 gap-3'>
                            <div className='text-[#000] font-[600] text-shadow'>
                                Tìm kiếm
                            </div>

                            <div className='relative flex gap-3'>
                                <img className='absolute top-1/2 -translate-y-1/2 left-2' src="./iconsearch.svg" alt="" />
                                <input className='h-[36px] w-[480px] pl-8 rounded-[5px]' placeholder='Tìm theo mã và câu hỏi' onKeyPress={handleKeyPress} value={searchValue} onChange={handleSearchChange} />
                                <div onClick={() => searchQuestions()} className='flex flex-col hover:bg-[#2e7447] justify-center bg-[#1A6634] rounded-[4px] cursor-pointer shadow-blue'>
                                    <div className='flex gap-2 px-[9px]'>
                                        <div className='flex flex-col justify-center'>
                                            <img className='h-[18px] w-[18px]' src="./iconsearchwhite.svg" alt="" />
                                        </div>
                                        <div className='text-white text-[14px] font-[600] mb-[1px] flex flex-col justify-center'>Tìm</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phần danh sách các câu hỏi */}
                    <div className='mt-[30px] relative'>
                        {/* Tiêu đề */}
                        <div>
                            <div className='grid grid-cols-12'>
                                <div className="col-span-6">
                                    <CheckboxAllQuestions label='Câu hỏi' />
                                </div>
                                <div className="col-span-2 font-[600] text-[#000]">Phân nhóm</div>
                                <div className="col-span-2 font-[600] text-[#000] text-center">Thời gian làm</div>
                                <div className="col-span-2 font-[600] text-[#000] text-center">Tình trạng</div>
                            </div>
                            {/* Nội dung được đọc từ jsonData */}
                        </div>

                        {/* Danh sách các câu hỏi */}
                        <div className='h-[63vh] overflow-y-auto mt-[7px] listPer'>
                            <div className='h-[58px]'>
                                {
                                    currentItems.length !== 0 ? (
                                        currentItems
                                            .slice(indexOfFirstItem, indexOfLastItem)
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
                                    ) : (
                                        <div className='h-[58px] w-full bg-white text-center flex flex-col justify-center'>
                                            Không tìm thấy dữ liệu nào
                                        </div>
                                    )

                                }

                            </div>
                        </div>

                        {/* FormActions xuất hiện khi chọn 1 hoặc nhiều câu hỏi cùng 1 lúc */}
                        {isAnyQuestionChecked() && (
                            <div>
                                <div className='absolute z-30 rounded-[10px] bg-white top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex shadow5'>
                                    <div className='w-[100px] h-[80px] text-center flex flex-col justify-center bg-[#008000] rounded-l-[6px] text-white'>
                                        {getNumberQuestionsChecked()}
                                        <div>Đã chọn</div>
                                    </div>
                                    <div className='flex flex-col justify-center cursor-pointer'>
                                        <CheckListCommonActive listCommonStatus={getStatusOfSelectedQuestions()} />
                                    </div>
                                    <div className='h-[80px] flex flex-col justify-center'><div className='w-[2px] rounded-[3px] bg-[#BBBBBB] h-[50px]'></div></div>
                                    <div
                                        className='flex flex-col justify-center w-[100px] h-[80px] mx-auto hover:bg-[#dddddd] cursor-pointer ring-inset'
                                        onClick={unCheckAllQuestion} // Thêm sự kiện onClick và gọi hàm unCheckAllQuestion khi phần tử được nhấn
                                    >
                                        <div className='flex justify-center'>
                                            <Icon classIcon={faXmark} color='#959DB3' size={'18px'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className={`mt-5 ml-3 flex justify-between`}>
                        <div className='flex absolute bottom-[14px] gap-5 left-5'>
                            <div className='text-[#000] flex flex-col justify-center select-none'>Hiển thị mỗi trang</div>
                            <div className='flex gap-3 cursor-pointer select-none hover:bg-[#5c6873] p-1 rounded-[5px] box-display-eachpage' onClick={() => setOpenNumQues(!openNumQues)}>
                                <div className='flex flex-col justify-center select-none'>{numQues}</div>
                                <div className='flex flex-col justify-center'>
                                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className={`fill-[#000]`} d="M7.42215 0.296473C7.37684 0.261786 7.32867 0.231008 7.27815 0.204473C7.22304 0.16103 7.16375 0.123177 7.10115 0.091473C7.03606 0.0708259 6.96905 0.0567556 6.90115 0.049473C6.77291 0.0069872 6.63439 0.0069872 6.50615 0.049473C6.43825 0.0567556 6.37125 0.0708259 6.30615 0.091473C6.2439 0.123234 6.18494 0.161086 6.13015 0.204473C6.07826 0.23081 6.02874 0.261591 5.98215 0.296473L0.699151 5.93747C0.518928 6.1441 0.425958 6.41262 0.439833 6.68645C0.453709 6.96028 0.573347 7.21803 0.773534 7.40539C0.973721 7.59274 1.23882 7.69506 1.51297 7.69078C1.78712 7.68651 2.0489 7.57597 2.24315 7.38247L6.76315 2.56647L11.2832 7.38247C11.4774 7.57597 11.7392 7.68651 12.0133 7.69078C12.2875 7.69506 12.5526 7.59274 12.7528 7.40539C12.953 7.21803 13.0726 6.96028 13.0865 6.68645C13.1003 6.41262 13.0074 6.1441 12.8272 5.93747L7.42215 0.296473Z" fill="#959DB3" />
                                    </svg>
                                </div>
                            </div>

                            {openNumQues && (
                                <div ref={boxRefNumPage} className='absolute flex flex-col rounded-[6px] bottom-[45px] left-[134px] bg-white shadow5'>
                                    {listNumItem
                                        .filter(num => num !== numQues)
                                        .sort((a, b) => b - a) // Sắp xếp giảm dần
                                        .map((num, i) => (
                                            <div className='cursor-pointer w-[60px] py-[4px] pl-2 hover:bg-slate-200' key={i} onClick={() => { handleItemsPerPageChange(num); setOpenNumQues(!openNumQues); }}>
                                                {num}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        <div className='flex absolute  bottom-[14px] right-0'>
                            {/* Hiển thị các nút phân trang */}
                            <div className={`pagination-container`}>
                                {renderPagination()}
                            </div>
                        </div>
                    </div>

                </div>

                {
                    deleteConfirm ? (
                        <>
                            <div className={`w-[85.05%] h-[100vh] absolute right-0 z-40 bottom-0`}>
                                {/* Nền đen khi xuất hiện form Xóa */}
                                <div className='absolute bg-black opacity-50 w-full h-full' />

                                {/* form xóa câu hỏi */}
                                <div className='w-[400px] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white opacity-100'>
                                    {/* Tiêu đề xóa */}
                                    <div className='h-[25%] py-6 flex flex-col justify-center text-center border-b-[0.5px] border-[#C3C3C3]'>
                                        <div className='flex gap-[10px] justify-center'>
                                            <img src='./iconwarning.svg' />
                                            <div className='text-[#FD7676] text-[18px] font-[600]'>XÓA CÂU HỎI</div>
                                        </div>
                                    </div>

                                    {/* Nội dung câu hỏi được xóa */}
                                    <div className='h-[50%] py-6 px-6 flex flex-col justify-center text-center gap-5'>
                                        <div>
                                            <div>Bạn chắc chắn muốn xóa phân nhóm</div>
                                            <div className='question text-[#36C8CF] w-full'>
                                                {listQuestionDeleted.map((ques, i) => (
                                                    <div className='font-[600]' key={i}>
                                                        {i < 2 ? questions.find(question => question.id === ques)?.question : i === 2 ? '...' : null}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <span>Đơn vị bị xóa sẽ <span className='text-[#FD7676]'>KHÔNG</span> thể khôi phục lại.</span>
                                    </div>


                                    {/* Nút KHÔNG XÓA và XÓA cụ thể 1 câu hỏi */}
                                    <div className='h-[25%] flex'>
                                        <div
                                            className='w-1/2 py-6 font-[600] cursor-pointer flex flex-col justify-center text-center border-t-[0.5px] border-r-[0.5px] border-[#C3C3C3] text-[#959DB3]'
                                            onClick={() => {
                                                setDeleteConfirm(false);
                                                setListQuestionDeleted([]);
                                            }}
                                        >
                                            KHÔNG XÓA
                                        </div>
                                        <div
                                            className='w-1/2 py-6 font-[600] cursor-pointer flex flex-col justify-center text-center border-t-[0.5px] border-[#C3C3C3] bg-[#FD7676] text-white'
                                            onClick={() => {
                                                deleteListQuestion(listQuestionDeleted);
                                                setDeleteConfirm(false); // Đóng giao diện xác nhận xóa
                                                handleButtonClick('icondelete.svg', `Xóa ${listQuestionDeleted.slice(0, 3)}${listQuestionDeleted.length > 3 ? ' ...' : ''} thành công`);
                                            }}
                                        >
                                            <div className='flex justify-center gap-[10px]'>
                                                <img className='w-[20px]' src='./icondelete.svg' />
                                                <div>XÓA</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </>
                    ) : (<></>)
                }
                {/* Render status messages */}
                {statusMessages.map((message, index) => (
                    <div key={index} className={`z-10 text-white py-[6px] px-4 rounded-[10px] bottom-0 opacity-0 flex gap-3 ${message.content.split(' ')[message.content.split(' ').length - 1] === 'bại' ? 'bg-[#FD7676] status-message-fail' : 'bg-[#1A6634] status-message-pass'}`}>
                        <img src={message.icon} />
                        {message.content}
                    </div>
                ))}

                {isLoading && (<LoadingIcon />)}
            </>)}

        </>
    );
};

export default ListPersonnel;
