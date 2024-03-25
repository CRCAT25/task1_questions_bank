import React, { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAdd,
    faDownload,
    faUpload,
    faEllipsis,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import jsonData from '../Models/newdata.json';

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
    'Đã duyệt',
    'Ngưng áp dụng',
];

const statusChangeActions: StatusChangeActions = {
    "Đang soạn thảo_Gửi duyệt": "Gửi duyệt",
    "Đang soạn thảo_Trả về": "Trả về",
    "Ngưng áp dụng_Duyệt áp dụng": "Duyệt áp dụng",
    "Gửi duyệt_Duyệt áp dụng": "Duyệt áp dụng",
    "Ngưng áp dụng_Trả về": "Trả về",
    "Đang soạn thảo_Xóa câu hỏi": "Xóa câu hỏi",
    "Duyệt áp dụng_Ngưng hiển thị": "Ngưng áp dụng"
};

const ListPersonnel: React.FC<TabSelected> = ({ selectedSideBar }) => {
    const [checked, setChecked] = useState<string[]>([tabHeaderStatus[0]]); // Khởi tạo cho các checkbox tại filter
    const [checkAll, setCheckAll] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>(getQuestionsFromData(jsonData));
    const [selectedItemId, setSelectedItemId] = useState<string | null>('');
    const [selectedItemName, setSelectedItemName] = useState<string | null>('');
    const [searchValue, setSearchValue] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [listQuestionDeleted, setListQuestionDeleted] = useState<string[]>([]); // Khởi tạo danh sách các câu hỏi cần xóa
    const [questionDel, setQuestionDel] = useState<string>('');
    const [statusMessages, setStatusMessages] = useState<TabMenuItem[]>([]);
    const [numQues, setNumQues] = useState<number>(25);
    const [openNumQues, setOpenNumQues] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);


    // Reset toàn bộ nếu chuyển sang Module khác
    useEffect(() => {
        setDeleteConfirm(false);
        setListQuestionDeleted([]);
        setSearchValue('');
        setSelectedItemId('');
        setSelectedItemName('');
        setQuestions(getQuestionsFromData(jsonData));
        setCheckAll(false);
        setQuestionDel('');
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
            <span>
                <FontAwesomeIcon icon={classIcon} style={iconSize} />
            </span>
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

    // Hàm xử lý thay đổi trạng thái của câu hỏi dựa trên hoạt động được chọn
    const handleQuestionStatusChange = (questionId: string, newStatus: string) => {
        let updatedStatus: string;

        if (newStatus === "Xóa câu hỏi") {
            setDeleteConfirm(true);
            setQuestionDel(selectedItemName!);
        }
        else {
            switch (newStatus) {
                case "Phê duyệt":
                    updatedStatus = "Duyệt áp dụng";
                    handleButtonClick('icontick.svg', 'Phê duyệt thành công');
                    break;
                case "Ngưng hiển thị":
                    updatedStatus = "Ngưng áp dụng";
                    handleButtonClick('iconstop.svg', 'Ngưng hiển thị thành công');
                    break;
                case "Trả về":
                    updatedStatus = "Trả về";
                    handleButtonClick('iconreturn.svg', 'Trả về thành công');
                    break;
                case "Gửi duyệt":
                    updatedStatus = "Gửi duyệt";
                    handleButtonClick('iconsend.svg', 'Gửi duyệt thành công');
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
    };

    const handleQuestionStatusChangeDelete = (questionId: string, newStatus: string) => {
        if (newStatus === "Xóa câu hỏi") {
            setDeleteConfirm(true);
            setListQuestionDeleted(prevState => [...prevState, questionId]);
        }
    };

    // Hàm xử lý các action cho nhiều item cùng 1 lúc
    const handleMultipleQuestionStatusChange = (newStatus: string) => {
        const updatedQuestions = questions.map(question => {
            if (question.isChecked) {
                const key = `${question.status}_${newStatus}`;
                const updatedStatus = statusChangeActions[key];
                if (updatedStatus) {
                    return {
                        ...question,
                        status: updatedStatus,
                        isChecked: false
                    };
                } else {
                    // Trạng thái không thay đổi
                    return {
                        ...question, isChecked: false
                    }
                }
            }
            return question;
        });
        switch (newStatus) {
            case "Duyệt áp dụng":
                handleButtonClick('icontick.svg', 'Duyệt áp dụng thành công');
                break;
            case "Ngưng hiển thị":
                handleButtonClick('iconstop.svg', 'Ngưng áp dụng thành công');
                break;
            case "Trả về":
                handleButtonClick('iconreturn.svg', 'Trả về thành công');
                break;
            case "Gửi duyệt":
                handleButtonClick('iconsend.svg', 'Gửi duyệt thành công');
                break;
            case "Xóa câu hỏi":
                setDeleteConfirm(true);
                // Cài đặt câu hỏi cần xóa
                setListQuestionDeleted(questions.filter(question => question.isChecked).map(question => question.id))
                break;
        }
        setCheckAll(false);
        setQuestions(updatedQuestions);
    };

    const handleActivityClick = (activity: string) => {
        // Gọi hàm xử lý thay đổi trạng thái của câu hỏi
        handleQuestionStatusChange(selectedItemId!, activity); // selectedItemId! đảm bảo rằng selectedItemId không null
    };

    const handleActivityClickDelete = (activity: string) => {
        // Gọi hàm xử lý thay đổi trạng thái của câu hỏi
        handleQuestionStatusChangeDelete(selectedItemName!, activity); // selectedItemId! đảm bảo rằng selectedItemId không null
    };

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
                    <div key={index} className='flex px-3 py-2 cursor-pointer' onClick={() => { handleActivityClick(tab.content); handleActivityClickDelete(tab.content) }}>
                        <img src={'./' + tab.icon} />
                        <div className={`ml-4`}>{tab.content}</div>
                    </div>
                ))}
            </div>
        );
    };

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

    // Danh sách các actions
    const tabMenuActiveBlack = [
        { icon: 'iconsendblack.svg', content: 'Gửi duyệt' },
        { icon: 'iconcheckedblack.svg', content: 'Duyệt áp dụng' },
        { icon: 'iconstopblack.svg', content: 'Ngưng hiển thị' },
        { icon: 'iconreturnblack.svg', content: 'Trả về' },
        { icon: 'icontrashred.svg', content: 'Xóa câu hỏi' },
    ];

    // Lấy danh sách các action khi chọn cùng lúc nhiều item
    const CheckListCommonActive: React.FC<CommonStatus> = ({ listCommonStatus }) => {
        let list: TabMenuItem[] = [];
    
        listCommonStatus.forEach(status => {
            let listTemp: TabMenuItem[] = [];
            switch (status) {
                case "Đang soạn thảo":
                    listTemp = tabMenuActiveBlack.filter(tab => tab.content === 'Gửi duyệt' || tab.content === 'Trả về' || tab.content === 'Xóa câu hỏi');
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
            <div className='flex gap-4'>
                {list.map((item, index) => (
                    <div key={index}>
                        <div className='w-[130px] h-[90px] flex flex-col gap-3 justify-center' onClick={() => handleMultipleQuestionStatusChange(item.content)}>
                            <img className='h-[20px] flex justify-center fill-slate-500' src={item.icon} />
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
        };

        return (
            <div className='flex gap-4 text-[#959DB3]' onClick={() => handleChange(label)}>
                <div>{label}</div>
                <label className='flex flex-col justify-center'>
                    <input className='cursor-pointer' type="checkbox" checked={checked.includes(label)} onChange={() => handleChange(label)} disabled hidden />
                    <span className={`checkmark cursor-pointer ${checked.includes(label) ? 'checked' : ''}`}></span>
                </label>
            </div>

        );
    };

    // Tạo class component CheckBox check tất cả câu hỏi
    const CheckboxAllQuestions: React.FC<Checkbox> = ({ label }) => {
        const handleChange = () => {
            const updatedQuestions = questions.map(question => {
                if (questions.filter(isQuestionInCheckedStatus).slice(indexOfFirstItem, indexOfLastItem).includes(question)) {
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
            <div className='flex gap-5 pl-[20px] text-[#959DB3]'>
                <label className={`flex flex-col justify-center ${checkAll ? 'checked' : ''}`}>
                    <input type="checkbox" checked={checkAll} onChange={handleChange} hidden />
                    <span className={`checkmark cursor-pointer ${checkAll ? 'checked' : ''}`}></span>
                </label>
                <div className='pt-[1.5px] font-[600] text-[#5A6276]'>{label}</div>
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
                setSelectedItemId(null); // Unselect the item if it's already selected
                setSelectedItemName('');
            } else {
                setSelectedItemId(id); // Select the clicked item
                setSelectedItemName(question);
                setQuestionDel(question);
            }
        };

        // Trả về nội dung từng hàng chứa nội dung câu hỏi trong bảng
        return (
            <div className={`grid grid-cols-12 mb-[7px] ${className} item${id}`}>
                <div className="col-span-6 flex flex-col justify-center h-[80px]">
                    <div className='flex text-[#959DB3]'>
                        <label className={`flex flex-col mx-[20px] justify-center ${checked ? 'checked' : ''}`}>
                            <input type="checkbox" checked={checked} onChange={handleChange} hidden />
                            <span className={`checkmark cursor-pointer ${checked ? 'checked' : ''}`}></span>
                        </label>
                        <div className='flex flex-col justify-center gap-1'>
                            <div className='text-[#26282E] font-[600] text-question' title={question}>{question}</div>
                            <div className='flex gap-2'>
                                <div className='text-[#26282E]' title={id}>{id}</div>
                                <div className='w-[1px] bg-[#BDC2D2]'></div>
                                <div className='text-[#26282E] text-type' title={typeQuestion}>Loại câu hỏi: {typeQuestion}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`col-span-6 relative ${selectedItemId === id ? 'z-10' : 'z-0'}`}>
                    <div className='grid grid-cols-3 w-full'>
                        <div className="col-span-1 flex flex-col justify-center">
                            <div className='text-group' title={group}>{group}</div>
                        </div>
                        <div className="col-span-1 flex flex-col justify-center text-center">{time}</div>
                        <div className="col-span-1 gap-[20px] text-center flex justify-end h-full">
                            <div className={`flex flex-col justify-center ${ColorStatus(status)}`}>{status}</div>
                            <div title='Settings' className={`px-[20px] three-dots h-[80px] flex flex-col justify-center`} onClick={() => handleItemClick(id, question)}>
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

    // Kiểm tra xem có filter status nào đang được check hay không
    const isQuestionInCheckedStatus = (question: Question): boolean => {
        let tempChecked = checked;
        // Nếu checked chứa "Đang soạn thảo", thêm "Trả về" vào tempChecked
        if (tempChecked.includes("Đang soạn thảo")) {
            tempChecked.push("Trả về");
        } else {
            // Ngược lại, loại bỏ "Trả về" khỏi tempChecked
            tempChecked = tempChecked.filter(status => status !== "Trả về");
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
        setCheckAll(false);
        setSearchValue('');
        setChecked([]);
    }

    // Tạo sự kiện xóa câu hỏi được chọn
    const deleteQuestion = () => {
        const updatedQuestions = questions.filter(question => question.question !== questionDel); // Sử dụng selectedItemId
        setQuestions(updatedQuestions);
    };

    // Tạo sự kiện xóa các câu hỏi trong danh sách được chọn
    const deleteListQuestion = (list: string[]) => {
        // Lọc ra danh sách câu hỏi không thuộc danh sách list
        const updatedQuestions = questions.filter(question => !list.includes(question.id));
        // Cập nhật danh sách chỉ với các câu hỏi không thuộc danh sách list
        setQuestions(updatedQuestions);
    };

    // Hàm tìm kiếm câu hỏi
    const searchQuestions = () => {
        const filteredQuestions = questions.filter((question) =>
            question.id.toLowerCase().includes(searchValue.toLowerCase()) ||
            question.question.toLowerCase().includes(searchValue.toLowerCase())
        );
        // Cập nhật danh sách câu hỏi hiển thị sau khi tìm kiếm
        setQuestions(filteredQuestions);
        if (searchValue === '') setQuestions(getQuestionsFromData(jsonData));
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

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const totalPagesCount = Math.ceil(questions.length / itemsPerPage);
        setTotalPages(totalPagesCount);
    }, [questions, itemsPerPage]);



    // Tính chỉ số của item đầu tiên trên trang hiện tại
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    // Tính chỉ số của item cuối cùng trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;

    // Lấy dữ liệu của trang hiện tại bằng cách slice mảng dữ liệu ban đầu
    const currentItems = questions
        .filter(isQuestionInCheckedStatus)
        .slice(indexOfFirstItem, indexOfLastItem);


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
            <ul className="pagination flex gap-2">
                {/* Nút đầu */}
                <li className=' flex flex-col justify-center bg-[#F4F5F7]'>
                    <div className="px-3 py-2 rounded-[5px] shadow4 text-[#959DB3] cursor-pointer" onClick={() => paginate(1)}>
                        Đầu
                    </div>
                </li>

                {/* Nút quay lại */}
                {currentPage > 1 && (
                    <li className=' flex flex-col justify-center'>
                        <div className="px-2 py-2 rounded-[5px] text-[#959DB3] cursor-pointer" onClick={() => paginate(currentPage - 1)}>
                            <img src='./iconback.svg' />
                        </div>
                    </li>
                )}

                {/* Nút ... quay lại */}
                {currentPage > 3 && (
                    <li className=' flex flex-col justify-center'>
                        <div className="px-2 py-2 rounded-[5px] text-[#959DB3] cursor-pointer" onClick={() => paginate(currentPage - 3)}>
                            ...
                        </div>
                    </li>
                )}

                {/* Hiển thị các trang */}
                {pageNumbers.slice(startPage - 1, startPage + 2).map((number) => (
                    <li key={number}>
                        <div className={`px-2 py-2 rounded-[5px] text-[#959DB3] cursor-pointer ${number === currentPage ? 'bg-[#5c6873] text-white shadow4 active' : ''}`} onClick={() => paginate(number)}>
                            {number}
                        </div>
                    </li>
                ))}

                {/* Nút ... tiếp theo */}
                {(totalPages > 3 && totalPages - currentPage > 1) && (
                    <li className=' flex flex-col justify-center'>
                        <div className="px-2 py-2 rounded-[5px] text-[#959DB3] cursor-pointer" onClick={() => paginate(currentPage + 3)}>
                            ...
                        </div>
                    </li>
                )}
                {/* Nút tiếp theo */}
                {totalPages - currentPage > 1 && (
                    <li className=' flex flex-col justify-center bg-[#F4F5F7]'>
                        <div className="px-2 py-2 rounded-[6px] shadow4 text-[#959DB3] cursor-pointer" onClick={() => paginate(currentPage + 1)}>
                            <img src='./iconnext.svg' />
                        </div>
                    </li>
                )}
                {/* Nút cuối */}
                <li className=' flex flex-col justify-center bg-[#F4F5F7]'>
                    <div className="px-3 py-2 shadow4 rounded-[6px] text-[#959DB3] cursor-pointer" onClick={() => paginate(totalPages)}>
                        Cuối
                    </div>
                </li>
            </ul>
        );
    };




    return (
        <>
            {selectedSideBar === "Ngân hàng câu hỏi" ? (<>
                <div className='h-[100vh] mr-[20px] relative'>
                    <div className={`flex mt-[15px] justify-between ${isAnyQuestionChecked() && 'pointer-events-none'}`}>
                        {/* Phần header bao gồm các checkbox trạng thái */}
                        <div className='flex gap-5 overflow-x-auto'>
                            {tabHeaderStatus.map((tab, index) => (
                                <div
                                    key={index}
                                    className={`h-[46px] bg-white flex flex-col justify-center rounded-[24px] ${checked.includes(tab) ? 'border-[2px] border-[#008000]' : 'border-[2px] border-[#fff]'} cursor-pointer px-6 flex}`}
                                >
                                    <Checkbox label={tab} />
                                </div>
                            ))}
                        </div>

                        {/* Phần header có import export add */}
                        <div className='flex gap-5'>
                            {/* Button export file */}
                            <div className='flex flex-col justify-center bg-[#fff] rounded-[4px] cursor-pointer shadow3' title='Upload file here'>
                                <div className='flex gap-2 px-[16px]'>
                                    <Icon classIcon={faUpload} color='#959DB3' size={'20px'} />
                                </div>
                            </div>

                            {/* Button import file */}
                            <div className='flex flex-col justify-center bg-[#fff] rounded-[4px] cursor-pointer shadow3'>
                                <div className='flex gap-2 px-[16px]'>
                                    <Icon classIcon={faDownload} color='#959DB3' size={'20px'} />
                                    <div className='font-600 text-[#959DB3]'>Template</div>
                                </div>
                            </div>

                            {/* Button Add */}
                            <div className='flex flex-col justify-center bg-[#1A6634] rounded-[4px] cursor-pointer shadow-blue'>
                                <div className='flex gap-2 px-[16px]'>
                                    <Icon classIcon={faAdd} color='white' size={'20px'} />
                                    <div className='text-white font-[600]'>THÊM MỚI</div>
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
                                <div onClick={() => searchQuestions()} className='flex flex-col justify-center bg-[#1A6634] rounded-[4px] cursor-pointer'>
                                    <div className='flex gap-2 px-[16px]'>
                                        <img src="./iconsearchwhite.svg" alt="" />
                                        <div className='text-white font-[600]'>Tìm</div>
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
                                <div className="col-span-2 font-[600] text-[#5A6276]">Phân nhóm</div>
                                <div className="col-span-2 font-[600] text-[#5A6276] text-center">Thời gian làm</div>
                                <div className="col-span-2 font-[600] text-[#5A6276] text-center">Tình trạng</div>
                            </div>
                            {/* Nội dung được đọc từ jsonData */}
                        </div>

                        {/* Danh sách các câu hỏi */}
                        <div className='h-[63vh] overflow-y-auto mt-[7px]'>
                            <div className='h-[80px]'>
                                {currentItems.map((question, index) => (
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
                                ))}
                            </div>
                        </div>

                        {/* FormActions xuất hiện khi chọn 1 hoặc nhiều câu hỏi cùng 1 lúc */}
                        {isAnyQuestionChecked() && (
                            <div>
                                <div className='absolute z-6 rounded-[10px] bg-white top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex gap-4 shadow4'>
                                    <div className='w-[130px] h-[90px] text-center flex flex-col justify-center bg-[#008000] rounded-l-[6px] text-white'>
                                        {getNumberQuestionsChecked()}
                                        <div>Đã chọn</div>
                                    </div>
                                    <div className='flex flex-col justify-center cursor-pointer'>
                                        <CheckListCommonActive listCommonStatus={getStatusOfSelectedQuestions()} />
                                    </div>
                                    <div
                                        className='flex flex-col justify-center w-[130px] h-[90px] text-center border-l-[1px] border-[#BDC2D2]'
                                        onClick={unCheckAllQuestion} // Thêm sự kiện onClick và gọi hàm unCheckAllQuestion khi phần tử được nhấn
                                    >
                                        <Icon classIcon={faXmark} color='#959DB3' size={'45px'} />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                    <div className='mt-5 ml-3 flex justify-between'>
                        <div className='flex absolute bottom-[14px] gap-5 left-0 h-[40px]'>
                            <div className='text-[#959DB3] flex flex-col justify-center'>Hiển thị mỗi trang</div>
                            <div className='flex gap-3 cursor-pointer' onClick={() => setOpenNumQues(!openNumQues)}>
                                <div className='flex flex-col justify-center'>{numQues}</div>
                                <div className='flex flex-col justify-center'>
                                    <img className='h-[10px]' src='./iconhienlen.svg' />
                                </div>
                            </div>

                            {openNumQues && (
                                <div className='absolute flex flex-col gap-2 rounded-[6px] bottom-[45px] left-[158px] bg-white shadow4'>
                                    {listNumItem
                                        .filter(num => num !== numQues)
                                        .sort((a, b) => b - a) // Sắp xếp giảm dần
                                        .map((num, i) => (
                                            <div className='cursor-pointer w-[60px] py-[1px] pl-2 hover:bg-slate-200' key={i} onClick={() => { handleItemsPerPageChange(num); setOpenNumQues(!openNumQues); }}>
                                                {num}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        <div className='flex absolute  bottom-[14px] right-0'>
                            {currentItems.map((item, index) => (
                                <div key={index}>{/* Hiển thị thông tin của mỗi item */}</div>
                            ))}
                            {/* Hiển thị các nút phân trang */}
                            <div className="pagination-container">
                                {renderPagination()}
                            </div>
                        </div>
                    </div>

                </div>

                {
                    deleteConfirm ? (
                        <>
                            <div className={`w-[85.05%] h-[100vh] absolute right-0 z-4 bottom-0`}>
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
                                                        {ques}
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
                                                setQuestionDel('');
                                            }}
                                        >
                                            KHÔNG XÓA
                                        </div>
                                        <div className='w-1/2 py-6 font-[600] cursor-pointer flex flex-col justify-center text-center border-t-[0.5px] border-[#C3C3C3] bg-[#FD7676] text-white'>
                                            <div
                                                className='flex justify-center gap-[10px]'
                                                onClick={() => {
                                                    if (listQuestionDeleted.length > 0 && questionDel === '') {
                                                        deleteListQuestion(listQuestionDeleted);
                                                        setDeleteConfirm(false); // Đóng giao diện xác nhận xóa
                                                        handleButtonClick('icondelete.svg', 'Xóa thành công');
                                                    }
                                                    else {
                                                        deleteQuestion();
                                                        setDeleteConfirm(false); // Đóng giao diện xác nhận xóa
                                                        handleButtonClick('icondelete.svg', 'Xóa thành công');
                                                    }

                                                }}
                                            >
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
                    <div key={index} className={`z-10 absolute bg-[#1A6634] text-white py-[6px] px-4 rounded-[10px] bottom-0 flex gap-3 status-message`}>
                        <img src={message.icon} />
                        {message.content}
                    </div>
                ))}
            </>) : (<></>)}

        </>
    );
};

export default ListPersonnel;
