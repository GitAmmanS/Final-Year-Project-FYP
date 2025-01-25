import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react'
import { BaseUrl } from '../utils/BaseUrl';
import { useNavigate } from 'react-router-dom'

const ViewDemand = () => {
    const [demands, setDemands] = useState([]);
    let name = JSON.parse(localStorage.getItem('userName'));
    const navigate = useNavigate();
    useEffect(()=>{
        axios.get((`${BaseUrl}/demand/getByName/${name}`)).then((response)=>{
            setDemands(response.data.data);
        }).catch((error)=>{
            console.log(error.message);
        })
    })
  return (
    <div className=''>
      <div className='title text-xl text-gray-900 font-bold mt-5 ml-3 block'>
        <div className='flex justify-center text-center'>
       <p className=''>My Demands</p>
       </div>
          <div className="mt-2 w-full bg-green-50 rounded-2xl text-gray-800">
         { demands?.map((demands, index) => (
                <ul
                  key={index}
                  className="mb-4 p-4 bg-white rounded-lg shadow-lg border  border-gray-200"
                >
                  <li className="font-bold text-lg">{`Demand Number: ${demands.number}`}</li>
                  <li className="text-xs text-gray-600">{`From: ${demands.requester.name}`}</li>
                  <li className="text-xs text-gray-600">{`Requested Date: ${new Date(
                    demands.dateRequested
                  ).toLocaleDateString()}`}</li>
                  <li className="text-xs text-gray-600">{`Demand Description: ${demands.description}`}</li>
                  <li
                    className={`text-xs font-bold ${demands.demandStatus === "pending"
                      ? "text-red-600"
                      : demands.demandStatus === "resolved"
                        ? "text-green-600"
                        : "text-blue-600"
                      }`}
                  >
                    {`Status: ${demands.demandStatus}`}
                  </li>
                  <div className='flex '>
                    <li className=' hover:text-green-900 text-sm font-bold'><button onClick={() => navigate('/userDemandDetail', { state: { demandNumber: demands.number } })}>Demand Details</button></li>
                  </div>
                </ul>
              )
            )}
          </div>

        </div>
      </div>
  )
}

export default ViewDemand