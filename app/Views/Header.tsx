import React, { useState } from 'react';
import jsonData from '../newdata.json';

interface HeaderProps {
  onTabChange: (tabValue: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState<number>(-1);

  const handleTabClick = (index: number) => {
    setSelectedTab(index);
    onTabChange(index);
  };

  const tabMenuHeader: string[] = [];

  jsonData.Modules.forEach(module => {
    Object.keys(module).forEach(nameModule => {
      tabMenuHeader.push(nameModule);
    });
  });


  return (
    <div className='h-[60px] bg-white text-[16px] px-[20px] shadow2 flex justify-between'>
      <div className='h-full flex flex-col justify-center'>
        <div className='flex gap-[20px]'>
          {tabMenuHeader.map((tab, index) => (
            <div className='flex flex-col justify-between h-[60px] pt-[18px]' key={index}>
              <div className='flex gap-5'>
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


              {index === selectedTab ? (
                <div className={`h-[3px] bg-[#008000] rounded-[3px] ${index < (tabMenuHeader.length - 1) ? 'mr-5' : ''} animate-width`}></div>
              ) : (<></>)}
            </div>
          ))}
        </div>

      </div>

      <div className='h-full flex flex-col justify-center'>
        <div className='flex gap-[40px]'>
          <div className='flex flex-col justify-center cursor-pointer' title='Tìm kiếm'>
            <img className='w-[20px]' src='./iconsearch.svg' />
          </div>
          <div className='flex flex-col justify-center relative cursor-pointer' title='Thông báo'>
            <img className='w-[18px]' src='./iconbell.svg' />
            <div className='absolute text-[12px] text-white top-[-5px] right-[-16px] w-[22px] h-[22px] flex flex-col justify-center text-center bg-[#F1802E] rounded-[100px]'>15</div>
          </div>
          <div className='w-[40px] h-[40px] rounded-[100px] cursor-pointer relative' title='Thông tin cá nhân'>
            <img className='w-full h-full' src="./dark-eyes-face-865636.png" alt="" />
            <div className='absolute bottom-[-2px] right-[2px] w-[12px] h-[12px] bg-[#05D103] rounded-[100px]'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;
