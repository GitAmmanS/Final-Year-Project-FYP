import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../BaseUrl'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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

const DemandNotification = () => {
    const [demands,setDemands] = useState([]);
    const [demandNumber,setDemandNumber] = useState();
    const navigate = useNavigate();
    useEffect(()=>{
        axios.get((`${BaseUrl}/demand`)).then((res)=>{
            setDemands(res.data.data)
        })
    },[])
  return (
    
    <div className=''>
        <div className='title text-xl text-gray-900 font-bold mt-5 ml-3 '>
            Demand List 
        </div>
        <div className="card flex justify-center items-center flex-col">
            <div className='mt-4 w-[90%] h-[50%] '>
            <div className="w-full  bg-green-50 p-4 rounded-2xl text-gray-800">
                {demands && (
  demands?.map((demand, index) => (
    <ul
      key={index}
      className="mb-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <li className="font-bold text-lg">{`Demand Number: ${demand.number}`}</li>
      <li className="text-sm text-gray-600">{`From: ${demand.requester.name}`}</li>
      <li className="text-sm text-gray-600">{`Requested Date: ${new Date(
        demand.dateRequested
      ).toLocaleDateString()}`}</li>
      <li className="text-sm text-gray-600">{`Demand Description: ${demand.description}`}</li>
      <li
        className={`text-sm ${
          demand.demandStatus === "pending"
            ? "text-red-600"
            : demand.demandStatus === "approved"
            ? "text-green-600"
            : "text-blue-600"
        }`}
      >
        {`Status: ${demand.demandStatus}`}
      </li>
      <div className='flex '>
      <li className=' hover:text-green-900'><button onClick={()=>navigate('/demandDetails',{state:{demandNumber:demand.number}})}>Action</button></li>
      </div>
    </ul>
  ))
)}
</div>

            </div>
        </div>
    </div>
  )
}

export default DemandNotification