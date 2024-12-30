import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { PiHandWaving } from "react-icons/pi";
import { FaArrowDown } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
const Header = () => {
  const navigate = useNavigate();
  const name = JSON.parse(localStorage.getItem('userName'));
  const [isOpen,setIsOpen]=useState(false)
  console.log(name)
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
};
const handleProfile = () => {
  navigate('/')
};
  const handleLogout = () => {
    localStorage.removeItem('userName');
    alert('Logged out');
    axios.post(`${BaseUrl}/users/logout`,{
      name,
    });
    navigate('/login'); 
};
  return (
    <div className='h-[80px] z-[50] sticky top-0 right-0  pt-[10px] bg-[white]'>
        <div className='flex justify-between mt-3 px-3' >
        <div className=''>
          <div className='flex gap-3' >
            <p className='text-xl' >{`Hello ${name}`}</p>
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
            <p className='text-sm'>{name}</p>
            <p className='text-xs text-gray-400 '>Admin</p>
          </div>
          <p className='mt-4 ml-3 cursor-pointer ' onClick={toggleDropdown}><FaArrowDown /> </p>
          {isOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-40">
                    <ul className="py-2">
                        <li
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                            onClick={handleProfile}
                        >
                            Open Profile
                        </li>
                        <li
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                            onClick={handleLogout}
                        >
                            Logout
                        </li>
                    </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default Header