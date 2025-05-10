import React from 'react'
import { RxDashboard } from "react-icons/rx";
import { MdOutlineInventory2, MdOutlineVideoLabel } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { LuDoorOpen } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { GrProductHunt } from "react-icons/gr";
import { MdReportProblem } from "react-icons/md";

export const SideMenuData= 
    [
        {
            title:"dashboard",
            icon:<RxDashboard />,
            link:"/",
            roles:["admin","teacher","lab_Incharge","store_Incharge","technician"]
        },
        {
            title:"product",
            icon:<GrProductHunt />,
            link:"/product",
            roles:["admin","store_Incharge"]
        },
        {
            title:"store",
            icon:<MdOutlineInventory2 />,
            link:"/store",
            roles:["admin","store_Incharge"]
        },
        {
            title:"resource",
            icon:<LuDoorOpen />,
            link:"/resourceCard",
            roles:["admin"]
            
        },
        {
            title:"labInventory",
            icon:<MdOutlineVideoLabel/>,
            link:"/labInventory",
            roles:["lab_Incharge"]
            
        },
        {
            title:"user",
            icon:<FaUser />,
            link:"/user",
            roles:["admin"]
        },
        {
            title:"complains",
            icon:<FaAngleDown />,
            roles: ["admin", "lab_Incharge","teacher","technician"],
            subItems:[
                {
                title:"view_AllComplains",
                icon:<GoDotFill />,
                link:"/complains",
                roles: ["lab_Incharge","admin","technician"],
                },
                {
                    title:"view_Complains",
                    icon:<GoDotFill />,
                    link:"/complains",
                    roles: ["teacher"],
                },
            ]
            
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
                roles: ["lab_Incharge"],
                },
                {
                    title:"view_AllRequest",
                    icon:<GoDotFill />,
                    link:"/demandsList",
                    roles: ["admin"],
                    },
                {
                    title:"issue_items",
                    icon:<GoDotFill />,
                    link:"/issueitem",
                    roles: ["lab_Incharge"],
                 }
            ]
            
        }
        ,
        {
            title:"demand",
            icon:<FaAngleDown />,
            roles: ["admin","store_Incharge"],
            subItems:[
                {
                title:"view_Demand",
                icon:<GoDotFill />,
                link:"/viewMainDemand",
                roles: ["admin","store_Incharge"],
                },
                {
                    title:"issue_Demand",
                    icon:<GoDotFill />,
                    link:"/createDemand",
                    roles: ["store_Incharge"],
                 }
            ]
            
        },
        {
            title:"settings",
            icon:<CiSettings />,
            link:"/setting",
            roles:["admin","teacher","lab_Incharge","store_Incharge","technician"]
        },
        
        
    ]

