import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBell, faSearch } from "@fortawesome/free-solid-svg-icons";
import jsonData from '../newdata.json';

interface IconProps {
  classIcon: IconDefinition;
  color: string;
  size: string;
}

interface HeaderProps {
  onTabChange: (tabValue: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

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
          <div className='flex flex-col justify-center cursor-pointer'>
            <Icon classIcon={faSearch} color='#000' size='18px' />
          </div>
          <div className='flex flex-col justify-center relative cursor-pointer'>
            <Icon classIcon={faBell} color='#000' size='18px' />
            <div className='absolute text-[12px] text-white top-[-5px] right-[-16px] w-[22px] h-[22px] flex flex-col justify-center text-center bg-[#F1802E] rounded-[100px]'>15</div>
          </div>
          <div className='w-[35px] h-[35px] rounded-[100px] cursor-pointer relative'>
            <img src="./dark-eyes-face-865636.png" alt="" />
            <div className='absolute bottom-[-3px] right-[1px] w-[12px] h-[12px] bg-[#05D103] rounded-[100px]'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;
