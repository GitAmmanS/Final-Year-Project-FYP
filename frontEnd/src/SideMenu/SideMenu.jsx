import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideMenuData } from './SideMenuData';

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
        <aside className='h-screen md:w-36 bg-slate-400 flex flex-col justify-start items-center '>
            <div className='mt-4 w-max uppercase mb-10 border-2 text-center text-slate-900 border-zinc-950 rounded-md hover:bg-zinc-500 cursor-pointer hover:scale-x-95'>
                <p>{userName}</p>
            </div>
            <ul className='w-full'>
                {SideMenuData.map((res, index) => (
                    <li key={index} className='w-full'>
                        <div
                            className='cursor-pointer w-full flex items-center p-2 mt-3 hover:bg-slate-700 hover:text-slate-50 rounded-md'
                            onClick={() => handleSubMenuToggle(index, res)}
                        >
                            <span className='mr-2'>{res.icon}</span>
                            <span>{res.title}</span>
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
                                        className='cursor-pointer p-2 pl-6 ml-5 hover:bg-slate-600 hover:text-white rounded-md'
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
