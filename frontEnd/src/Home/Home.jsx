import React from 'react'
import { CgProfile } from "react-icons/cg";
import { useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MdOutlineInventory } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import {CircularProgressbar,buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

let locales;
const language = localStorage.getItem("language");
if (language === "english") {
  import("../locales/en.json").then((module) => {
    locales = module.default;
  });
} else {
  import("../locales/ur.json").then((module) => {
    locales = module.default;
  });
}

const data = [
  {
    itemId: '12345',
    date: '2024-12-20',
    status: 'Available',
  },
  {
    itemId: '67890',
    date: '2024-12-19',
    status: 'Unavailable',
  },
  {
    itemId: '11223',
    date: '2024-12-18',
    status: 'Pending',
  },
  {
    itemId: '44556',
    date: '2024-12-17',
    status: 'Available',
  },
  {
    itemId: '77889',
    date: '2024-12-16',
    status: 'Unavailable',
  },
];

const Home = () => {
  const [columns] = useState([
    {
      accessorKey: 'itemId',
      header: locales.dashboard.item_id,
      size: 150,
    },
    {
      accessorKey: 'date',
      header:locales.dashboard.date,
      size: 150,
    },
    {
      accessorKey: 'status',
      header: locales.dashboard.status,
      size: 150,
    },
  ]);

  const table = useMaterialReactTable({
    columns,
    data,
  });

  function ProgressBar(props) {
  return (
    <CircularProgressbar value={props.percentage} text={`${props.percentage}%`} strokeWidth={12} styles={buildStyles({
      pathColor: "#FFFFFF", // Change the default bar color
      textColor: "#FFFFFF",   // Change text color (optional)
      trailColor: "#BCCCBF", // Background (trail) color
    })}/>
  );
}

  return (
    <>
      
      <div className='flex flex-wrap justify-between gap-2 mt-9 px-5   text-white'>
      <div className='bg-slate-900 w-60 h-40 rounded-md'>
          <p className='text-base p-1'>{ locales.dashboard.active_labs}</p>
          <div className='flex flex-row mt-3'>
          <div className='m-2'>
            <ProgressBar percentage={90}/>
            </div>

            <div className='flex flex-col ml-5'>
              <p className='pl-20 mt-9 text-2xl'>07</p>
              <p className='pl-[20px] mt-2  text-xs'>{locales.dashboard.last_1_week}</p>
            </div>
          </div>
        </div>
        
        <div className='bg-pink-900 w-60 h-40 rounded-md'>
          <p className='text-base p-1'>{locales.dashboard.active_rooms}</p>
          <div className='flex flex-row mt-3'>
          <div className='m-2'>
            <ProgressBar percentage={88}/>
            </div>

            <div className='flex flex-col ml-5'>
              <p className='pl-20 mt-9 text-2xl'>22</p>
              <p className='pl-[20px] mt-2  text-xs'>{locales.dashboard.last_1_week}</p>
            </div>
          </div>
        </div>
        
       
        <div className='bg-green-500 w-60 h-40 rounded-md'>
          <p className='text-base p-1'>{locales.dashboard.resolved}</p>
          <div className='flex flex-row mt-3'>
            <div className='m-2'>
            <ProgressBar percentage={60}/>
            </div>

            <div className='flex flex-col ml-5'>
              <p className='pl-20 mt-9 text-2xl'>60</p>
              <p className='pl-[20px] mt-2  text-xs'>{locales.dashboard.last_1_week}</p>
            </div>
          </div>
        </div>
        <div className='bg-red-600 w-60 h-40 rounded-md'>
          <p className='text-base p-1'>{locales.dashboard.pending}</p>
          <div className='flex flex-row mt-3'>
          <div className='m-2'>
            <ProgressBar percentage={40}/>
            </div>

            <div className='flex flex-col ml-5'>
              <p className='pl-20 mt-9 text-2xl'>40</p>
              <p className='pl-[20px] mt-2  text-xs'>{locales.dashboard.last_1_week}</p>
            </div>
          </div>
        </div>
       
      </div>
      <div className='flex justify-between'>
        <div className='flex flex-col'>
          <p className='px-3 mt-4 font-semibold text-xl text-black'>{locales.dashboard.recent_com}</p>
          <div> <MaterialReactTable table={table} /></div>
        </div>
        <div className='flex flex-col mt-4'>
          <p className='pr-64  font-semibold text-xl  ' >{locales.dashboard.summary}</p>
          <div className='flex mt-7'>
            <p className=' text-4xl text-gray-500 '> <MdOutlineInventory /> </p>
            <div >
              <p className='text-sm'>150 {locales.dashboard.total_items}</p>
              <p className='text-xs text-gray-500'>{locales.dashboard.total_items}</p>
            </div>
          </div>
          <div className='flex mt-7'>
            <p className='text-4xl text-gray-500'><BiCategoryAlt /></p>
            <div>
              <p className='text-sm'>20 </p>
              <p className='text-xs text-gray-500'>{locales.dashboard.total_categories}</p>
            </div>
          </div>
          <div className='flex mt-7'>
            <p className='text-4xl text-gray-500'><CgProfile /></p>
            <div>
              <p className='text-sm'>90</p>
              <p className='text-xs text-gray-500'>{locales.dashboard.total_users}</p>
            </div>
            
          </div>
        </div>
      </div>
      <div className='w-20 h-20'></div>
    </>
  )
}

export default Home