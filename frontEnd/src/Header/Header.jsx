import React, { useEffect, useState, useRef } from 'react'
import { CiSearch } from "react-icons/ci";
import { PiHandWaving } from "react-icons/pi";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../utils/BaseUrl';
import { IoNotificationsOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import moment from 'moment'
import Tooltip from '@mui/material/Tooltip';
import { axiosInstance } from '../utils/AxiosInstance';

let locales;
const language = sessionStorage.getItem("language");
if (language === "english" || language == null) {
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
  const [totalComplains, setTotalComplains] = useState(null);

  const currentHour = moment().hour();
  console.log(currentHour);
  let greetingKey = locales.header.good_morning;
  if (currentHour >= 5 && currentHour < 12) {
    greetingKey = locales.header.good_morning;
  } else if (currentHour >= 12 && currentHour < 17) {
    greetingKey = locales.header.good_Afternoon;
  } else if (currentHour >= 17 && currentHour < 21) {
    greetingKey = locales.header.good_Evening;
  } else {
    greetingKey = locales.header.good_Night;
  }

  let user = JSON.parse(sessionStorage.getItem('user'));
  const DemandsL = sessionStorage.getItem('complains');
  const ComplaintL = sessionStorage.getItem('Demands');
  console.log(sessionStorage.getItem('complains'));
  const name = user ? user.name : '';
  const role = user?.role;
  const Photo = user?.picture;
  console.log(Photo);
  const [isOpen, setIsOpen] = useState(false);
  const [formated_Role, setFormatedRole] = useState('');

  useEffect(() => {
    const formatRole = (role) => {
      if (!role) return "";
      return role
        .replace(/_/g, " ")
        .replace(/\b\w/, (char) => char.toUpperCase());
    };

    setFormatedRole(formatRole(role));
  }, [role])

  useEffect(() => {
    const fetchdata = async () => {
      axios.get(`${BaseUrl}/demand/getByStatus`).then((response) => {
        setTotalDemands(response.data.data);
        console.log(response);
      });
      if (role === "admin" || role === "lab_Incharge" || role === "technician") {
        const resp = await axiosInstance.get(`${BaseUrl}/complain/`)
        let Data;
        if (resp) {
          if (role !== 'admin') {
            Data = Array.isArray(resp.data.message)? resp.data.message?.filter?.((complain) => complain.assigned_to._id === user._id && complain.status === 'pending').length : '';
            console.log(Array.isArray(resp.data.message));
          }
          else {
            Data = Array.isArray(resp.data.message) ? resp.data.message.length : '';
            console.log(Data);
          }

        }
        setTotalComplains(Data);
      }
    }
    fetchdata();

    window.addEventListener('NotificationChanged', fetchdata);

    return () => {
      window.removeEventListener('NotificationChanged', fetchdata);
    };
  }, [ComplaintL, DemandsL]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfile = () => {
    navigate('/UserProfile', { state: { userData: user } });
  };

  const handleLogout = () => {
    let text = `You have been logged out     Good Bye`;
    const voice = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(voice);
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
    sessionStorage.setItem('user', JSON.stringify({}));
    sessionStorage.removeItem('authToken');
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
    <div className='h-[80px] sticky top-0 right-0 pt-[10px] bg-[white] z-50 shadow-lg'>
      <div className='flex justify-between mt-3 px-3'>
        <div className=''>
          <div className='flex gap-2 min-[768px]:gap-3'>
            <p className='text-sm min-[768px]:text-xl min-[640px]:text-lg'>{`${locales.header.hello} ${name}`}</p>
            <p className=' text-2xl text-yellow-700'><PiHandWaving /> </p>
          </div>
          <div>
            <p className='text-[10px] text-gray-400 min-[768px]:text-xs'>{greetingKey}</p>
          </div>
        </div>
        <div className='w-80 text-[18px] font-bold font-mono text-gray-500 min-[768px]:text-[24px] '>
          <marquee behavior="scroll" direction="left">{locales.sidemenu.project_name}</marquee>

        </div>

        <div className='flex mr-3 justify-normal'>
          {role !== "lab_Incharge" && role !== "teacher" && role !== "admin" && role !== "technician" &&
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
          {role != "store_Incharge" && role != "teacher" &&
            <div onClick={() => navigate('/complains')}>
              <Tooltip title="Notifications">
                <p className='text-2xl mr-1 p-2 cursor-pointer '><IoNotificationsOutline />
                </p>
              </Tooltip>
              {totalComplains ? (
                <span className='text-xs bg-red-600 border-2 border-red-950 w-4 text-center top-[1.2rem] ml-6 absolute text-white font-bold rounded-full'>{totalComplains}</span>
              ) : null}
            </div>
          }
          <div>

          </div>
          <p className='text-5xl hover:cursor-pointer' onClick={handleProfile} >{
            Photo ? <img src={`${BaseUrl}/${Photo}`} alt="pic" style={{ width: 50, height: 50, borderRadius: 25, marginRight: 6 }} /> : <CgProfile />
          }
          </p>
          <div className='flex flex-col mt-2 hover:cursor-pointer' onClick={handleProfile}>
            <p className='text-sm'>{name}</p>
            <p className='text-xs text-gray-400'>{formated_Role}</p>
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
