import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideMenuData } from './SideMenuData';
import logo from '../Images/Unilogo.png';
import { CiMenuBurger } from "react-icons/ci";
const SideMenu = () => {
    const userName = JSON.parse(localStorage.getItem('userName'));
    const navigate = useNavigate();
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSubMenuToggle = (index, res) => {
        if (res.subItems && res.subItems.length > 0) {
            setOpenSubMenu(openSubMenu === index ? null : index);
        } else {
            navigate(res.link);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <aside
            className={`h-screen bg-green-500 flex flex-col items-center overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-48' : 'w-10 bg-white' 
                }`}
        >
            <CiMenuBurger
                className={`absolute top-6 left-2 text-2xl hover:opacity-50 hover:cursor-pointer duration-400 scroll-smooth  transition-transform   ${isSidebarOpen ? 'rotate-0' : 'rotate-180' 
                    }`}
                onClick={toggleSidebar}
            />
            {isSidebarOpen ? 
                <>
                    <div className='mt-3 mr-1 cursor-pointer'>
                        <img
                            src={logo}
                            className='bg-no-repeat bg-cover h-16 w-16'
                            alt="no logo"
                            onClick={() => navigate('/')}
                        />
                    </div>
                    <div className='font-headings mt-1 px-2 text-lg font-semibold'>
                        <h1>UIIT LAB XPERTS</h1>
                    </div>

                    <ul className='mt-6 w-full'>
                        {SideMenuData.map((res, index) => (
                            <li key={index} className='mt-2 px-4'>
                                <div
                                    className='cursor-pointer w-full flex items-center p-2 hover:bg-green-800 hover:text-green-50 rounded-md'
                                    onClick={() => handleSubMenuToggle(index, res)}
                                >
                                    <span className='mr-2'>{res.icon}</span>
                                    {isSidebarOpen && <span>{res.title}</span>}
                                </div>
                                {res.subItems && res.subItems.length > 0 && isSidebarOpen && (
                                    <ul
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${openSubMenu === index ? 'h-auto' : 'max-h-0'
                                            }`}
                                    >
                                        {res.subItems.map((result, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className='cursor-pointer p-2 ml-3 hover:bg-green-800 hover:text-green-50 text-sm rounded-md'
                                                onClick={() => navigate(result.link)}
                                            >
                                                <div className='flex'>
                                                    <span className='pt-1 text-xs'>{result.icon}</span>
                                                    <span>{result.title}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </> :
                <div></div>
            }
        </aside>
    );
};

export default SideMenu;
