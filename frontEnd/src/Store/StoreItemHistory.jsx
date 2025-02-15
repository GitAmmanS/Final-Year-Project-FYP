import React from 'react';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
const StoreItemHistory = () => {
  const location = useLocation();
  const { item } = location.state;
  const navigate = useNavigate();
  const itemId = item.product_ID._id;
  return (
    <>
      <div className="text-xl font-semibold mt-5 ml-2 flex gap-2 items-center">
        <p
          onClick={() => navigate('/store')}
          className="cursor-pointer hover:text-green-700 transition text-black"
        >
          <FaCircleArrowLeft />
        </p>
        <h1 className="uppercase text-gray-800">{item.product_ID.name} History</h1>
      </div>
      <div className="flex flex-col w-[90%]  mt-10 ml-5">
        <table className='border-2 shadow-md'>
          <thead className='text-base font-semibold bg-gray-400 text-center'>
            <tr className='border-[2px] border-gray-500  '>
              <td className='p-2 border-2'>Record Id</td>
              <td className='p-2 border-2'>Quantity Recieved</td>
              <td className='p-2 border-2'>Available Quantity</td>
              <td className='p-2 border-2'>Date of Purchase</td>
            </tr>
          </thead>
          {
             item.record.length > 0 ? (
              item.record.reverse().map((record, index) => (
                <tr key={index} className='text-sm text-center'>
                  <td className='p-2 border-2'>{record._id || ''}</td>
                  <td className='p-2 border-2'>{record.addedQuantity || 0}</td>
                  <td className='p-2 border-2'>{record?.previousQuanitity || 0}</td>
                  <td className='p-2 border-2'>{record.addedtime.split("T")[0] || ''}</td>
                </tr>
              ))) :
              (
                <tr><td className='p-2 border-2'>No Data Available</td></tr>
              )
          }
        </table>
      </div>
    </>
  )
}

export default StoreItemHistory