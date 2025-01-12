import React from 'react'
import { RxDashboard } from "react-icons/rx";
import { MdOutlineInventory2 } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { LuDoorOpen } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { GrProductHunt } from "react-icons/gr";
export const SideMenuData= 
    [
        {
            title:"DashBoard",
            icon:<RxDashboard />,
            link:"/"
        },
        {
            title:"Product",
            icon:<GrProductHunt />,
            link:"/product"
        },
        {
            title:"Store",
            icon:<MdOutlineInventory2 />,
            link:"/store"
        },
        {
            title:"Resource",
            icon:<LuDoorOpen />,
            subItems:[
                {
                title:"Computer Lab",
                icon:<GoDotFill />,
                link:"/labs"
                },
                {
                    title:"Class Room",
                    icon:<GoDotFill />,
                    link:"/Cl"
                 },
                 {
                    title:"Lecture Theatre",
                    icon:<GoDotFill />,
                    link:"/Lt"
                 },
                 {
                    title:"Faculty Room",
                    icon:<GoDotFill />,
                    link:"/Fr"
                 },
                 {
                    title:"Saminar Room",
                    icon:<GoDotFill />,
                    link:"/Sr"
                 },
                 {
                    title:"Inventory Room",
                    icon:<GoDotFill />,
                    link:"/Ir"
                 }
            ]
            
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
                icon:<GoDotFill />,
                link:"/reservation"
                },
                {
                    title:"Issue Items",
                    icon:<GoDotFill />,
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

