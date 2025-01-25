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
            link:"/"
        },
        {
            title:"product",
            icon:<GrProductHunt />,
            link:"/product"
        },
        {
            title:"store",
            icon:<MdOutlineInventory2 />,
            link:"/store"
        },
        {
            title:"resource",
            icon:<LuDoorOpen />,
            subItems:[
                {
                title:"computer_lab",
                icon:<GoDotFill />,
                link:"/labs"
                },
                {
                    title:"class_room",
                    icon:<GoDotFill />,
                    link:"/Cl"
                 },
                 {
                    title:"lecture_theatre",
                    icon:<GoDotFill />,
                    link:"/Lt"
                 },
                 {
                    title:"faculty_room",
                    icon:<GoDotFill />,
                    link:"/Fr"
                 },
                 {
                    title:"saminar_room",
                    icon:<GoDotFill />,
                    link:"/Sr"
                 },
                 {
                    title:"inventory_room",
                    icon:<GoDotFill />,
                    link:"/Ir"
                 }
            ]
            
        },
        {
            title:"user",
            icon:<FaUser />,
            link:"/user"
        },
        {
            title:"demand",
            icon:<FaAngleDown />,
            subItems:[
                {
                title:"view_Demands",
                icon:<GoDotFill />,
                link:"/viewDemands"
                },
                {
                    title:"issue_items",
                    icon:<GoDotFill />,
                    link:"/issueitem"
                 }
            ]
            
        }
        ,
        {
            title:"settings",
            icon:<CiSettings />,
            link:"/inventory"
        },
        
        
    ]

