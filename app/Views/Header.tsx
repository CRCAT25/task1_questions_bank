import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

interface IconProps {
  classIcon: IconDefinition;
  color: string;
  size: string;
}


const Header = () => {
  const [selectedTab, setSelectedTab] = useState<number>(-1);

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
  const handleTabClick = (index: number) => {
    setSelectedTab(index);
    console.log(selectedTab);
  };

  const tabMenuHeader = [
    '-----------',
    '-----------',
    '-----------',
    '-----------',
    '-----------',
    '-----------',
    '-----------',
    'NHÂN SỰ',
  ];
  return (
    // Header
    <div className='h-[60px] bg-white text-[16px] px-[20px] shadow2 flex justify-between'>
      <div className='h-full flex flex-col justify-center'>
        <div className='flex gap-[20px]'>
          {/* Hiển thị danh sách các models(tiêu đề) chính */}
          {tabMenuHeader.map((tab, index) => (
            <div className='flex gap-[20px]' key={index}>
              <div
                className={`cursor-pointer ${index === selectedTab ? 'text-[#008000] font-[600]' : 'text-[#BBBBBB] '}`}
                onClick={() => handleTabClick(index)}
              >
                {tab}
              </div>
              {index < (tabMenuHeader.length - 1) ? (
                <div className='h-full w-[2px] rounded-[3px] bg-[#BBBBBB]'></div>
              ) : (<></>)}
            </div>

          ))}

        </div>
      </div>

      <div className='h-full flex flex-col justify-center'>
        <div className='flex gap-[40px]'>
          {/* Icon tìm kiếm trên header */}
          <div className='flex flex-col justify-center cursor-pointer'>
            <img src='./iconsearch.svg'/>
          </div>

          {/* Icon chuông thông báo */}
          <div className='flex flex-col justify-center relative cursor-pointer'>
            <img src='./iconbell.svg'/>
            <div className='absolute text-[12px] text-white top-[-5px] right-[-16px] w-[22px] h-[22px] flex flex-col justify-center text-center bg-[#F1802E] rounded-[100px]'>15</div>
          </div>
          
          {/* Ảnh đại diện của người dùng */}
          <div className='w-[35px] h-[35px] rounded-[100px] cursor-pointer relative'> 
            <img src="./dark-eyes-face-865636.png" alt="" />
            <div className='absolute bottom-[-3px] right-[1px] w-[12px] h-[12px] bg-[#05D103] rounded-[100px]'></div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Header