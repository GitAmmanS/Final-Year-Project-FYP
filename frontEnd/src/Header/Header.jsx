import React, { useEffect, useState,useRef} from 'react'
import { CiSearch } from "react-icons/ci";
import { PiHandWaving } from "react-icons/pi";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../utils/BaseUrl';
import { IoNotificationsOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import Tooltip from '@mui/material/Tooltip';

let locales;
const language = localStorage.getItem("language");
if (language === "english") {
  import("../locales/en.json").then((module) => {
    locales = module.default;
  });
} else {
  import("../locales/ur.json").then((module) => {
    locales = module.default;
  });
}

const Header = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [totalDemands, setTotalDemands] = useState(null);
  
  let user = JSON.parse(localStorage.getItem('user'));
  const name = user?user.name:'';
  const role = user.role;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios.get(`${BaseUrl}/demand/getByStatus`).then((response) => {
      setTotalDemands(response.data.data);
    });
  }, [totalDemands]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfile = () => {
    navigate('/');
  };

  const handleLogout = () => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Log Out",
      showConfirmButton: false,
      timer: 1000,
      width: "380px",
      height: "20px"
  });
    axios.post(`${BaseUrl}/users/logout`, {
      name,
    });
    localStorage.setItem('user', JSON.stringify({}));
    localStorage.removeItem('authToken');
    navigate('/login');
  };

   useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsOpen();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);//clean up function
    }, []);

  return (
    <div className='h-[80px] z-[50] sticky top-0 right-0 pt-[10px] bg-[white] shadow-lg'>
      <div className='flex justify-between mt-3 px-3'>
        <div className=''>
          <div className='flex gap-3'>
            <p className='text-xl'>{`${locales.header.hello} ${name}`}</p>
            <p className=' text-2xl text-yellow-700'><PiHandWaving /> </p>
          </div>
          <div>
            <p className='text-xs text-gray-400'>{locales.header.good_morning}</p>
          </div>
        </div>
        <div className=''>
          <div className='flex gap-2 border w-96 border-gray-950 rounded-md p-1'>
            <p className='text-2xl'><CiSearch /></p>
            <input className='w-full outline-none' type="search" placeholder={locales.header.search} />
          </div>
        </div>

        <div className='flex mr-3 justify-normal'>
          {role !=="lab_Incharge" &&
          <div onClick={() => navigate('/demandsList')}>
            <Tooltip title="Notifications">
            <p className='text-2xl mr-1 p-2 cursor-pointer '><IoNotificationsOutline />
           
            </p>
            </Tooltip>
            {totalDemands ? (
              <span className='text-xs bg-red-600 border-2 border-red-950 w-4 text-center top-[1.2rem] ml-6 absolute text-white font-bold rounded-full'>{totalDemands}</span>
            ) : null}
          </div>
          }
          <p className='text-5xl'> <CgProfile /></p>
          <div className='flex flex-col mt-2'>
            <p className='text-sm'>{name}</p>
            <p className='text-xs text-gray-400 '>Admin</p>
          </div>
          <p className="mt-4 ml-3 cursor-pointer" onClick={toggleDropdown}>
            {isOpen ? (
              <FaArrowUp className="transition-transform duration-300" />
            ) : (
              <FaArrowDown className="transition-transform duration-300" />
            )}
          </p>

         

          {isOpen && (
            <div className="absolute right-0 mt-9 bg-white border border-gray-300 rounded-2xl shadow-2xl w-40">
              <ul className="py-2" ref={menuRef}>
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
  );
}

export default Header;
