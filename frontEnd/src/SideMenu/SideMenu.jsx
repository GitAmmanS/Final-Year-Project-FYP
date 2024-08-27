import React, { useState } from 'react';
import "./SideMenu.scss";
import { useNavigate } from 'react-router-dom';
import { SideMenuData } from './SideMenuData';
import { Link } from 'react-router-dom';

const SideMenu = () => {
    const userName=JSON.parse(localStorage.getItem('userName'));
    // const { name } = useUser();
    const navigate = useNavigate();
    


    const [openSubMenu, setOpenSubMenu] = useState(null);

    const handleSubMenuToggle = (index, res) => {
        if (res.subItems && res.subItems.length > 0) {
            setOpenSubMenu(openSubMenu === index ? null : index);
            return
        } else {
            navigate(res.link);
        }
    };

    return (

        <div className="sidebar">
            <ul>
            
                    <div className="username">
        <p>{userName}</p>
        </div>
                {
                         
                    SideMenuData.map((res, index) => (
                        <li key={index}>
                            <div onClick={() => handleSubMenuToggle(index, res)} >
                                {res.icon}
                                {res.title}
                            </div>

                            {res.subItems && res.subItems.length > 0 && (
                                <ul className={openSubMenu === index ? 'visible' : ''}>
                                    {res.subItems.map((result, subIndex) => (
                                        <li key={subIndex} onClick={() => { navigate(res.link); }}>{result.title}</li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default SideMenu;
