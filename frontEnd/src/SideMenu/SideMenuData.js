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
            title:"dashboard",
            icon:<RxDashboard />,
            link:"/",
            roles:["admin","teacher","lab_Incharge","technicians"]
        },
        {
            title:"product",
            icon:<GrProductHunt />,
            link:"/product",
            roles:["admin","lab_Incharge"]
        },
        {
            title:"store",
            icon:<MdOutlineInventory2 />,
            link:"/store",
            roles:["admin"]
        },
        {
            title:"resource",
            icon:<LuDoorOpen />,
            link:"/resource",
            roles:["admin","lab_Incharge"]
            
        },
        {
            title:"user",
            icon:<FaUser />,
            link:"/user",
            roles:["admin"]
        },
        {
            title:"requestStore",
            icon:<FaAngleDown />,
            roles: ["admin", "lab_Incharge"],
            subItems:[
                {
                title:"view_Request",
                icon:<GoDotFill />,
                link:"/viewDemands",
                roles: ["admin", "lab_Incharge"],
                },
                {
                    title:"issue_items",
                    icon:<GoDotFill />,
                    link:"/issueitem",
                    roles: ["admin", "lab_Incharge"],
                 }
            ]
            
        }
        ,
        {
            title:"demand",
            icon:<FaAngleDown />,
            roles: ["admin"],
            subItems:[
                {
                title:"view_Demand",
                icon:<GoDotFill />,
                link:"/viewMainDemand",
                roles: ["admin"],
                },
                {
                    title:"issue_Demand",
                    icon:<GoDotFill />,
                    link:"/createDemand",
                    roles: ["admin"],
                 }
            ]
            
        },
        {
            title:"settings",
            icon:<CiSettings />,
            link:"/setting",
            roles:["admin","teacher","lab_Incharge","technicians"]
        },
        
        
    ]

