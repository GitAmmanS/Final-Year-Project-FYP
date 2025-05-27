import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideMenuData } from './SideMenuData';
import logo from '../Images/UIIT_SS_LOGO.png';
import axios from 'axios';
import { CiMenuBurger } from "react-icons/ci";
import { FaAngleUp } from "react-icons/fa";
import { BaseUrl } from '../utils/BaseUrl';

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

const SideMenu = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userRole = user?.role;
  const userId = user?._id;
  const navigate = useNavigate();

  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);
  const [open, setOpen] = useState(false);
  const [labsMatched, setLabsMatched] = useState(false);

  // fetch labs on mount
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/lab/`);
        const labs = response.data.data;
        const match = labs.find(lab => lab.incharge._id === userId);
        if (match) {
          setLabsMatched(true);
        }
      } catch (error) {
        console.error("Error fetching labs:", error);
      }
    };

    if (userRole === "teacher" || userRole === "lab_Incharge") {
      fetchLabs();
    }
  }, [userId, userRole]);

  // filter menu items based on role and lab match
  const filteredSideMenuData = SideMenuData.filter(item => {
    if (item.title === "requestStore") {
      if (userRole === "admin") return true;
      return labsMatched; // show only if matched
    }
    else if (item.title === "labInventory") {
      return labsMatched;
    }
    return item.roles.includes(userRole);
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSubMenuToggle = (index, res) => {
    if (res.subItems?.length > 0) {
      setOpenSubMenu(openSubMenu === index ? null : index);
    } else {
      navigate(res.link);
    }
  };

  return (
    <aside className={`h-screen bg-[#1B4D3E] border-r-[1px] border-[#2A2A2A] flex flex-col items-center overflow-y-auto overflow-x-hidden transition-all duration-300 shadow-lg ${isSidebarOpen ? 'w-56' : 'w-16'}`}>
      <div className="w-full flex justify-end p-2 mr-2">
        <CiMenuBurger
          className="text-white text-3xl cursor-pointer hover:opacity-70 transition-all duration-200"
          onClick={toggleSidebar}
        />
      </div>

      {isSidebarOpen && (
        <div className="mt-2 cursor-pointer flex flex-col items-center">
          <img
            src={logo}
            className="h-14 w-14 rounded-full bg-transparent shadow-md hover:scale-110 transition-all duration-300"
            alt="University Logo"
            onClick={() => navigate('/')}
          />
          <h1 className="text-white font-semibold text-lg mt-2">
            {locales?.sidemenu?.project_name}
          </h1>
        </div>
      )}

      <ul className="mt-6 w-full">
        {filteredSideMenuData.map((res, index) => (
          <li key={index} className="mt-2 px-4">
            <div
              className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${isSidebarOpen ? 'justify-start' : 'justify-center'} ${selectedMenu === index ? 'bg-green-700 scale-105 shadow-lg' : ''}  hover:bg-green-700 hover:text-white hover:shadow-lg hover:scale-105`}
              onClick={() => {
                if (res.title === "Demand") setOpen(!open);
                setSelectedMenu(index);
                setSelectedSubMenu(null);
                handleSubMenuToggle(index, res);
              }}
            >
              <span className="text-white text-xl">{open && res.title === "Demand" ? <FaAngleUp /> : res.icon}</span>
              {isSidebarOpen && (
                <span className="text-white">{locales?.sidemenu?.[res.title]}</span>
              )}
            </div>

            {res.subItems && res.subItems.length > 0 && isSidebarOpen && (
              <ul className={`ml-5 transition-all text-[#F9FAF9] duration-300 ease-in-out overflow-hidden ${openSubMenu === index ? 'h-auto' : 'max-h-0'}`}>
                {res.subItems
                  .filter(sub => sub.roles.includes(userRole))
                  .map((sub, subIndex) => (
                    <li
                      key={subIndex}
                      className={`cursor-pointer flex items-center gap-2 p-2 text-sm transition-all duration-300  ${selectedSubMenu === `${index}-${subIndex}` ? 'bg-green-700 scale-105 shadow-md' : ''}  hover:bg-green-700 hover:text-white hover:scale-105 hover:shadow-md`}
                      onClick={() => {
                        navigate(sub.link);
                        setOpen(false);
                        setSelectedSubMenu(`${index}-${subIndex}`);
                        setSelectedMenu(null);
                      }}
                    >
                      <span className="text-white text-xs">{sub.icon}</span>
                      <span>{locales?.sidemenu?.[sub.title]}</span>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideMenu;
