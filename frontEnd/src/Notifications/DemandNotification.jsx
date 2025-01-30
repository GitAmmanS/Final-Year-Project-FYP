import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../utils/BaseUrl'
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
  const [demands, setDemands] = useState([]);
  const [filteredDemands, setFilteredDemands] = useState([]);
  const [demandNumber, setDemandNumber] = useState();
  const [buttonClick, setButtonClick] = useState("All Demand");
  const [displayAllDemands, setDisplayAllDemands] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get((`${BaseUrl}/demand`)).then((res) => {
      setDemands(
        res.data.data.sort((a, b) => {
          const statusOrder = {
            pending: 3,
            "partially resolved": 2,
            resolved: 1,
          };
          return statusOrder[a.demandStatus] - statusOrder[b.demandStatus];
        })
      );

    })
  }, [demands])
  const representByStatus = (statusName) => {
    const filteredDemands = demands.filter((demand) => demand.demandStatus === statusName);
    setFilteredDemands(filteredDemands);
    if (filteredDemands === 0) {
      return "no demands"
    }
  }
  return (

    <div className=''>
      <div className='title text-xl text-gray-900 font-bold mt-5 ml-3 flex '>
        Demand List
        <div className=' justify-center items-center space-x-4 ml-[440px] flex'>
          <button
            className={`text-sm  border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md  transition-all ${buttonClick === "All Demand" ? "bg-gray-400 border-black" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => {
              representByStatus("")
              setButtonClick("All Demand")
            }}>
            All Demands
          </button>
          <button
            className={`text-sm  border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md  transition-all ${buttonClick === "pending" ? "bg-gray-400 border-black" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => {
              representByStatus("pending")
              setButtonClick("pending")
            }}>
            Pending
          </button>
          <button
            className={`text-sm  border border-gray-300 w-max h-10 text-center p-2 rounded-lg shadow-md  transition-all ${buttonClick === "partially resolved"? "bg-gray-400" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => {
              representByStatus("partially resolved")
              setButtonClick("partially resolved")
            }}>
            Partial Resolved
          </button>
          <button
            className={`text-sm  border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md  transition-all ${buttonClick === "resolved" ? "bg-gray-400" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => {
              representByStatus("resolved")
              setButtonClick("resolved")
            }}>
            Resolved
          </button>


        </div>
      </div>


      <div className="card flex justify-center items-center flex-col">
        <div className='mt-4 w-[90%] h-[50%] '>
          <div className="w-full  bg-green-50 p-4 rounded-2xl text-gray-800">
            {filteredDemands.length > 0 ? (
              [...filteredDemands]?.reverse().map((filteredDemands, index) => (
                <ul
                  key={index}
                  className="mb-4  bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  <li className="font-bold text-lg">{`Demand Number: ${filteredDemands.number}`}</li>
                  <li className="text-xs text-gray-600">{`From: ${filteredDemands.requester.name}`}</li>
                  <li className="text-xs text-gray-600">{`Requested Date: ${new Date(
                    filteredDemands.dateRequested
                  ).toLocaleDateString()}`}</li>
                  <li className="text-xs text-gray-600">{`Demand Description: ${filteredDemands.description}`}</li>
                  <li
                    className={`text-xs font-bold ${filteredDemands.demandStatus === "pending"
                      ? "text-red-600"
                      : filteredDemands.demandStatus === "resolved"
                        ? "text-green-600"
                        : "text-blue-600"
                      }`}
                  >
                    {`Status: ${filteredDemands.demandStatus}`}
                  </li>
                  <div className='flex '>
                    <li className=' hover:text-green-900 font-bold'><button onClick={() => navigate('/demandDetails', { state: { demandNumber: filteredDemands.number } })}>Action</button></li>
                  </div>
                </ul>
              ))
            ) : (buttonClick==="All Demand"&&(
              [...demands]?.reverse().map((demands, index) => (
                <ul
                  key={index}
                  className="mb-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
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
                    <li className=' hover:text-green-900 font-bold'><button onClick={() => navigate('/demandDetails', { state: { demandNumber: demands.number } })}>Action</button></li>
                  </div>
                </ul>
              ))
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default DemandNotification