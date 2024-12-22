import React from 'react'
import { CiSearch } from "react-icons/ci";
import { PiHandWaving } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { FaArrowDown } from "react-icons/fa6";
import { useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MdOutlineInventory } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import whatsapplogo from '../Images/Whatsapp.jpg'
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
      header: 'Item ID',
      size: 150,
    },
    {
      accessorKey: 'date', 
      header: 'Date',
      size: 150,
    },
    {
      accessorKey: 'status', 
      header: 'Status',
      size: 150,
    },
  ]);

  const table = useMaterialReactTable({
    columns,
    data, 
  });
  return (
    <>
   <div className='flex justify-between mt-3 px-3' >
    <div className=''>
      <div className='flex gap-3' >
      <p className='text-xl' >Hello Amman</p>
      <p className=' text-2xl text-yellow-700'><PiHandWaving /> </p>
      </div>
      <div>
      <p className='text-xs text-gray-400'>Good Morning</p>
      </div>
    </div>
    <div className='' >
      <div className='flex gap-2  border  w-96 border-gray-950 rounded-md p-1'>
      <p className='text-2xl'><CiSearch /></p>
      <input className='w-full outline-none' type="text" placeholder='Search' />
    </div>
    </div>
    <div className='flex mr-3 justify-normal'>
   <p className='text-5xl '> <CgProfile /></p>
   <div className='flex flex-col mt-2'>
    <p className='text-sm'>Amman Sajjad</p>
    <p className='text-xs text-gray-400 '>Admin</p>
    </div>
    <p className='mt-4 ml-3'><FaArrowDown /> </p>
    </div>
   </div>
   <div className='flex flex-wrap justify-between mt-9 px-5 text-white'>
    <div className='bg-custom-purple w-60  h-40 rounded-md ' >
    <p className='text-base p-1'>Total Complaints</p>
    <div className='flex flex-row mt-5'>
    <img src={whatsapplogo} className="ml-2 bg-no-repeat bg-cover h-20 w-20 rounded-full " alt="" />
    
    <div className='flex flex-col ml-5'>
    <p className='pl-20 mt-9 text-2xl'>100</p>
    <p className='pl-10 mt-2  text-xs'>Last One Week</p>
    </div>
    </div>
    </div>
    <div className='bg-green-500 w-60 h-40 rounded-md'>
    <p className='text-base p-1'>Resolved</p>
    <div className='flex flex-row mt-5'>
    <img src={whatsapplogo} className="ml-2 bg-no-repeat bg-cover h-20 w-20 rounded-full " alt="" />
    
    <div className='flex flex-col ml-5'>
    <p className='pl-20 mt-9 text-2xl'>40</p>
    <p className='pl-10 mt-2  text-xs'>Last One Week</p>
    </div>
    </div>
    </div>
    <div className='bg-red-600 w-60 h-40 rounded-md'>
    <p className='text-base p-1'>Pending</p>
    <div className='flex flex-row mt-5'>
    <img src={whatsapplogo} className="ml-2 bg-no-repeat bg-cover h-20 w-20 rounded-full" alt="" />
    
    <div className='flex flex-col ml-5'>
    <p className='pl-20 mt-9 text-2xl'>60</p>
    <p className='pl-10 mt-2  text-xs'>Last One Week</p>
    </div>
    </div>
    </div>
   </div>
   <div className='flex justify-between'>
    <div className='flex flex-col'>
    <p className='px-3 mt-4 font-semibold text-xl text-black'>Recent Complains</p>
     <div> <MaterialReactTable table={table} />;</div>
    </div>
    <div className='flex flex-col mt-4'>
    <p className='pr-64  font-semibold text-xl  ' >Summary</p>
    <div className='flex mt-7'>
   <p className=' text-4xl text-gray-500 '> <MdOutlineInventory /> </p>
    <div >
    <p className='text-sm'>150 Total Items</p>
    <p className='text-xs text-gray-500'>Total Items</p>
    </div>
    </div>
    <div className='flex mt-7'>
    <p className='text-4xl text-gray-500'><BiCategoryAlt /></p>
    <div>
      <p className='text-sm'>20 </p>
      <p className='text-xs text-gray-500'>Total Categories</p>
    </div>
    </div>
    <div className='flex mt-7'>
    <p className='text-4xl text-gray-500'><CgProfile /></p>
    <div>
      <p className='text-sm'>90</p>
      <p className='text-xs text-gray-500'>Total Users</p>
    </div>
    </div>
    </div>
   </div>
   </>
  )
}

export default Home