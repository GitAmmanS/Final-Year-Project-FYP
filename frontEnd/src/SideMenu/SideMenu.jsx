import React, { useState } from 'react';
import "./SideMenu.scss";
import { SideMenuData } from './SideMenuData';

const SideMenu = () => {
    const [openSubMenu, setOpenSubMenu] = useState(null);

    const handleSubMenuToggle = (index,res) => {
      if (res.subItems && res.subItems.length > 0) {
        setOpenSubMenu(openSubMenu === index ? null : index);
        return
    } else {
        window.location.pathname=res.link;
    }
    };

    return (

        <div className="sidebar">
            <ul>
                {
                    SideMenuData.map((res, index) => (
                        <li key={index}>
                            <div onClick={() => handleSubMenuToggle(index,res)} >
                                {res.icon}
                                {res.title}
                                </div>
                    
                            {res.subItems && res.subItems.length > 0 && (
                                <ul className={openSubMenu === index ? 'visible' : ''}>
                                    {res.subItems.map((result, subIndex) => (
                                        <li key={subIndex} onClick={()=>{window.location.pathname=result.link}}>{result.title}</li>
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
