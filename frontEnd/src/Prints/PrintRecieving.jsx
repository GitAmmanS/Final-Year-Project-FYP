import React, { forwardRef } from 'react';
import Unilogo from '../Images/UIIT_SS_LOGO.png';

const PrintRecieving = forwardRef(({ data, quantityRecieved, name, subject }, ref) => {
  console.log("data", data);
  console.log("quantity", quantityRecieved);
const time =data.updatedAt ? new Date(data.updatedAt).toLocaleString():'';
  return (
    <div ref={ref} className="p-5 font-sans mt-[15px] ml-[10px] flex-col justify-center min-w-[190px] min-h-[260px]">
      <div className="text-center ml-[-10px] mt-[-20px]">
        <img src={Unilogo} width={20} height={20} />
      </div>
      <div className="text-center mt-[-23px] ml-[13px]">
        <h1 className="text-[6px] font-bold uppercase whitespace-nowrap">PMAS Arid Agriculture University Rawalpindi</h1>
        <h2 className="text-[5px] whitespace-nowrap">University Institute of Information Technology</h2>
      </div>
      <div className="text-right float-right mt-[5px] mr-[-20px]">
        <h1 className="text-[4px] whitespace-nowrap">PMAS-AAUR/UIIT/</h1>
        <h2 className="text-[4px] whitespace-nowrap">Dated:{time}</h2>
      </div>
      <div className="text-center mt-[15px] ml-[35px]">
        <h1 className="text-[6px] whitespace-nowrap underline-offset-1 font-bold">Notification</h1>
      </div>
      <div className="mt-[10px]">
        <h1 className="text-[5px] whitespace-nowrap">Subject: <span className="underline">{subject || "N/A"}</span></h1>
      </div>

      <div className="mt-[5px]">
        <table className="text-[4px]" style={{ width: '150px', borderCollapse: 'collapse' }}>
          <thead className="border-b border-solid border-black">
            <tr className="text-[5px]">
              <th className="border-b border-solid px-1 py-1 text-center">Sn</th>
              <th className="border-b border-solid px-1 py-1 text-center">Category</th>
              <th className="border-b border-solid px-1 py-1 text-center">Model</th>
              <th className="border-b border-solid px-1 py-1 text-center">Item Name</th>
              <th className="border-b border-solid px-1 py-1 text-center">Quantity Received</th>
              <th className="border-b border-solid px-1 py-1 text-center">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length>0?(
              data.map((item, index) => (
                <tr key={index} className="text-[4px]">
                  <td className="px-1 py-1 text-center">{index + 1}</td>
                  <td className="px-1 py-1 text-center">{item.product_ID?.category_ID?.name || 'N/A'}</td>
                  <td className="px-1 py-1 text-center">{item.product_ID?.model || 'N/A'}</td>
                  <td className="px-1 py-1 text-center">{item.product_ID?.name || 'N/A'}</td>
                  <td className="px-1 py-1 text-center">{quantityRecieved || 0}</td>
                  <td className="px-1 py-1 text-center">{item.quantity || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-2 py-1 text-center">
                  No items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-left float-right mt-[15px] mr-[-25px]">
        <h1 className="text-[4px] whitespace-nowrap mt-[15px]">Assistant Registrar</h1>
        <h1 className="text-[4px] whitespace-nowrap mt-[15px]">Director UIIT</h1>
        <h1 className="text-[4px] whitespace-nowrap mt-[15px]">Deputy Registrar</h1>
      </div>
    </div>
  );
});

export default React.memo(PrintRecieving);
