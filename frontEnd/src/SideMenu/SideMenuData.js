import React from 'react'
import { RxDashboard } from "react-icons/rx";
import { MdOutlineInventory2 } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
export const SideMenuData= 
    [
        {
            title:"DashBoard",
            icon:<RxDashboard />,
            link:"/"
        },
        {
            title:"Item",
            icon:<MdOutlineInventory2 />,
            link:"/item"
        },
        {
            title:"Inventory",
            icon:<MdOutlineInventory2 />,
            link:"/inventory"
        },
        {
            title:"User",
            icon:<FaUser />,
            link:"/user"
        },
        {
            title:"Transaction",
            icon:<FaAngleDown />,
            subItems:[
                {
                title:"Reservations",
                link:"/reservation"
                },
                {
                    title:"Issue Items",
                    link:"/issueitem"
                 }
            ]
            
        }
        ,
        {
            title:"Settings",
            icon:<CiSettings />,
            link:"/inventory"
        },
        
        
    ]

