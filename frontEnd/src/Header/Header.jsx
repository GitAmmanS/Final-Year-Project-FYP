import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { PiHandWaving } from "react-icons/pi";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../utils/BaseUrl';
import { IoNotificationsOutline } from "react-icons/io5";
import Swal from 'sweetalert2';

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
  const [totalDemands, setTotalDemands] = useState(null);
  const [isChecked, setIsChecked] = useState(localStorage.getItem("language") === "english" ? false : true);

  let name = JSON.parse(localStorage.getItem('userName'));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios.get(`${BaseUrl}/demand/getByStatus`).then((response) => {
      setTotalDemands(response.data.data);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("language", isChecked ? "urdu" : "english");
  }, [isChecked]);

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
    navigate('/login');
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
    window.location.reload();
  };

  return (
    <div className='h-[80px] z-[50] sticky top-0 right-0 pt-[10px] bg-[white]'>
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
            <input className='w-full outline-none' type="text" placeholder={locales.header.search} />
          </div>
        </div>

        <div className='flex mr-3 justify-normal'>
          <div onClick={() => navigate('/demandsList')}>
            <p className='text-2xl mr-1 p-2 cursor-pointer '><IoNotificationsOutline />
            </p>
            {totalDemands ? (
              <span className='text-xs bg-red-600 border-2 border-red-950 w-4 text-center top-[1.2rem] ml-6 absolute text-white font-bold rounded-full'>{totalDemands}</span>
            ) : null}
          </div>
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

          <div className='flex justify-center ml-4 pl-4 w-[110px]'>
            <label className="inline-flex items-center me-5 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isChecked}
                onChange={handleToggle}
              />
              <div className={`relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 ${isChecked ? "peer-checked:bg-green-600" : ""} peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-500">
                {isChecked ? locales.header.urdu: locales.header.english}
              </span>
            </label>
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-9 bg-white border border-gray-300 rounded-2xl shadow-2xl w-40">
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
  );
}

export default Header;
