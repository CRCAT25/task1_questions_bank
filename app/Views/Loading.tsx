import React from 'react'

const Loading = () => {
  return (
    <div className='absolute h-full w-[84%] flex flex-col justify-center z-10 bg-white opacity-80'>
      <img className='w-[100px] mx-auto bg-none' src='./loading.svg'/>
    </div>
  )
}

export default Loading