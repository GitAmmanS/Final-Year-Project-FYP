import React from 'react'
import { CiSearch } from "react-icons/ci";
import { PiHandWaving } from "react-icons/pi";
import { FaArrowDown } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  return (
    <div className='h-[80px] z-[50] sticky top-0 right-0  pt-[10px] bg-[white]'>
        <div className='flex justify-between mt-3 px-3' >
        <div className=''>
          <div className='flex gap-3' >
            <p className='text-xl' >Hello Amman</p>
            <p className=' text-2xl text-yellow-700'><PiHandWaving /> </p>
          </div>
          <div>
            <p className='text-xs text-gray-400'>Good Morning</p>
          </div>
        </div>
        <div className='' >
          <div className='flex gap-2  border  w-96 border-gray-950 rounded-md p-1'>
            <p className='text-2xl'><CiSearch /></p>
            <input className='w-full outline-none' type="text" placeholder='Search' />
          </div>
        </div>
        <div className='flex mr-3 justify-normal'>
          <p className='text-5xl '> <CgProfile /></p>
          <div className='flex flex-col mt-2'>
            <p className='text-sm'>Amman Sajjad</p>
            <p className='text-xs text-gray-400 '>Admin</p>
          </div>
          <p className='mt-4 ml-3'><FaArrowDown /> </p>
        </div>
      </div>
    </div>
  )
}

export default Header