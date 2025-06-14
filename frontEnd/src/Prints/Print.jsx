import React, { forwardRef ,useEffect } from 'react';
import Unilogo from '../Images/UIIT_SS_LOGO.png'
import {format} from 'date-fns'
const Print = forwardRef(({ data, name, subject ,dateAndTime}, ref) => {
  const timestamp =()=> dateAndTime==="createdAt"? data.createdAt :data.updatedAt ;
  const formattedDate =format( new Date(timestamp()),'PPpp');

  
  return(
  <div ref={ref} className="p-5 font-sans mt-[15px] ml-[10px] flex-col justify-center min-w-[190px] min-h-[260px]">

    <div className="text-center ml-[-10px] mt-[-20px] ">
      <img src={Unilogo} width={20} height={20}/>
    </div>
    <div className="text-center mt-[-23px] ml-[13px] ">
      <h1 className="text-[6px] font-bold uppercase  whitespace-nowrap">PMAS Arid Agriculture University Rawalpindi</h1>
      <h2 className="text-[5px] whitespace-nowrap">University Institute of Information Technology</h2>
    </div>
    <div className="text-right float-right mt-[5px] mr-[-20px]">
      <h1 className="text-[4px] whitespace-nowrap">PMAS-AAUR/UIIT/{data.number}</h1>
      <h2 className="text-[4px] whitespace-nowrap">Dated: {formattedDate}</h2>
    </div>
    <div className="text-center mt-[15px] ml-[35px]">
      <h1 className="text-[6px] whitespace-nowrap underline-offset-1 font-bold">{name} Notification</h1>
    </div>
    <div className="mt-[10px] ">
      <h1 className="text-[5px] whitespace-nowrap ">Subject: <span className='underline'>{subject}</span></h1>
      <h1 className="text-[5px] text-justify min-w-[170px]" >Description : {data.description}</h1>
      {
        data?.location !==undefined && <h1 className="text-[5px] text-justify min-w-[170px]" >Location : {data.location}</h1>
      }

      <h1 className="text-[5px] text-justify min-w-[170px]" >By: {data.requester.name.toUpperCase()} ({(data.requester.role).replace('_', ' ').toUpperCase()})</h1>
      
    </div>
    <div className="mt-2 mr-3 ">
      <table className='text-[4px] border-[0px] border-t border-l border-solid border-black ' style={{ width: '150px', borderCollapse: 'collapse' }}>
        <thead className=''>
          <tr className='text-[5px]'>
            <th className='border-b border-solid  border-r border-black px-[2px] py-1 text-center'>Sn</th>
            <th className='border-b border-solid  border-r border-black px-[2px] py-1 text-center'>Name</th>
            <th className='border-b border-solid  border-r border-black px-[2px] py-1 text-center'>Category</th>
            <th className='border-b border-solid  border-r border-black px-[2px] py-1 text-center'>Model</th>
            <th className='border-b border-solid  border-r border-black px-[2px] py-1 text-center'>Quantity Demanded</th>
            <th className='border-b border-solid  border-r border-black px-[2px] py-1 text-center'>Quantity Recieved</th>
            <th className='border-b border-solid  border-r border-black px-[2px] py-1 text-center'>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            data.requester.role==='store_Incharge'?
            (Array.isArray(data.items) && data.items.length > 0 ? (
              data.items.map((item, index) => (
                <tr key={index} className="text-[4px]">
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{index + 1}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.product_Id?.name || 'N/A'}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.product_Id?.category_ID?.name || 'N/A'}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.product_Id?.model || 'N/A'}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.quantityDemanded || 0}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.quantityReceived || 0}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center font-bold">{(item.status.toUpperCase()).replace('_',' ') || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-2 py-1 text-center">
                  No items available
                </td>
              </tr>
            )):
            (Array.isArray(data.items) && data.items.length > 0 ? (
              data.items.map((item, index) => (
                <tr key={index} className="text-[4px]">
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{index + 1}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.product_Id?.product_ID?.name || 'N/A'}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.product_Id?.product_ID?.category_ID?.name || 'N/A'}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.product_Id?.product_ID?.model || 'N/A'}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.quantityDemanded || 0}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center">{item.quantityReceived || 0}</td>
                  <td className="px-[2px] py-1 border-b border-r border-solid border-black text-center font-bold">{(item.status.toUpperCase()).replace('_',' ') || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-2 py-1 text-center">
                  No items available
                </td>
              </tr>
            ))
          }
        </tbody>

      </table>

    </div>
    <div className="text-left float-left mb-[5px] mr-[-15px]">
      <h1 className="text-[4px] whitespace-nowrap mt-[15px]">{name} Status: <span className='font-bold'>{(data.demandStatus.toUpperCase()).replace('_',' ')}</span></h1>
    </div>
    <div className="text-left float-right mt-[15px] mr-[-25px]">
      <h1 className="text-[4px] whitespace-nowrap mt-[15px]">Assistant Registrar</h1>
      <h1 className="text-[4px] whitespace-nowrap mt-[15px]">Director UIIT</h1>
      <h1 className="text-[4px] whitespace-nowrap mt-[15px]">Deputy Registrar</h1>
    </div>
  </div>


)});

export default Print;
