'use client'
import React from 'react'
import Container from "./Container";
import SideBarMenu from './SideBarMenu';
import "../css/Personnel.scss"

const Personnel = () => {
    return (
        <div className='flex h-[100vh] gap-[5px] bg-[#EDEFF3]'>
            <div className="w-[15%] bg-[#5A6276] text-white"><SideBarMenu/></div>
            <div className="w-[85%]"><Container /></div>
        </div>
    )
}

export default Personnel