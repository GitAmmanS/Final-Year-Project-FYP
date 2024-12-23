import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideMenuData } from './SideMenuData';
import logo from '../Images/Unilogo.png'
const SideMenu = () => {
    const userName = JSON.parse(localStorage.getItem('userName'));
    const navigate = useNavigate();
    const [openSubMenu, setOpenSubMenu] = useState(null);

    const handleSubMenuToggle = (index, res) => {
        if (res.subItems && res.subItems.length > 0) {
            setOpenSubMenu(openSubMenu === index ? null : index);
        } else {
            navigate(res.link);
        }
    };

    return (
        <aside className='h-screen w-48 bg-custom-green flex flex-col  items-center '>
            <div className='mt-3 mr-1'>
            <img src={logo} className='bg-no-repeat bg-cover h-16 w-16 ' alt="no logo" />
            </div>
            <div className='font-headings mt-1 px-2 text-lg font-semibold'>
                <h1>UIIT LAB XPERTS</h1>
            </div>
            <ul className='mt-6 w-full'>
                {SideMenuData.map((res, index) => (
                    <li key={index} className=' mt-2 px-4'>
                        <div
                            className='cursor-pointer w-full flex items-center p-2 hover:bg-green-800 hover:text-green-50 rounded-md'
                            onClick={() => handleSubMenuToggle(index, res)}
                        >
                            <span className='mr-2 '>{res.icon}</span>
                            <span >{res.title}</span>
                        </div>

                        {res.subItems && res.subItems.length > 0 && (
                            <ul
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    openSubMenu === index ? 'max-h-40' : 'max-h-0'
                                }`}
                            >
                                {res.subItems.map((result, subIndex) => (
                                    <li
                                        key={subIndex}
                                        className='cursor-pointer p-2 pl-6 ml-5  hover:bg-green-800 hover:text-green-50 rounded-md'
                                        onClick={() => navigate(result.link)}
                                    >
                                        {result.title}
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
