import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../utils/BaseUrl'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Loading from 'react-loading'

let locales;
const language = sessionStorage.getItem("language");
if (language === "english" || language==null) {
  import("../locales/en.json").then((module) => {
    locales = module.default;
  });
} else {
  import("../locales/ur.json").then((module) => {
    locales = module.default;
  });
}

const View = () => {
  const [demands, setDemands] = useState([]);
  const [filteredDemands, setFilteredDemands] = useState([]);
  const [demandNumber, setDemandNumber] = useState();
  const [buttonClick, setButtonClick] = useState("All Demand");
  const [displayAllDemands, setDisplayAllDemands] = useState(true);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const Role = user?.role;

  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setLoader(true);
    axios.get(`${BaseUrl}/mainDemand`)
      .then((res) => {
        let demand = res.data.data;
  
        if (demand.length >= 2) {
          const statusOrder = {
            pending: 3,
            "partially resolved": 2,
            resolved: 1,
          };
  
          demand.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        }
  
        setDemands(demand);
      })
      .catch((error) => {
        console.log("Error fetching demands:", error.message);
      })
      .finally(() => {
        setLoader(false); 
      });
  }, []);
  
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
      {locales?.sidemenu?.demand_list}
        <div className=' justify-center items-center space-x-4 ml-[440px] flex'>
          <button
            className={`text-sm  border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md  transition-all ${buttonClick === "All Demand" ? "bg-gray-400 border-black" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => {
              representByStatus("")
              setButtonClick("All Demand")
            }}>
            All
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
            className={`text-sm  border border-gray-300 w-max h-10 text-center p-2 rounded-lg shadow-md  transition-all ${buttonClick === "partially resolved" ? "bg-gray-400" : "bg-gray-100 hover:bg-gray-200"}`}
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
      {
        !loader ?
          <div className="card flex flex-col">
            <div className='mt-4 w-[90%] h-[50%] '>
              <div className="w-full  bg-green-50 p-4 rounded-2xl text-gray-800">
                {filteredDemands.length > 0 ? (
                  [...filteredDemands]?.reverse().map((filteredDemands, index) => (
                    <ul
                      key={index}
                      className="mb-4 bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <li className="font-bold ml-4 mt-4 text-lg">{`Demand Number: ${filteredDemands.number}`}</li>
                      <li className="text-xs ml-4 text-gray-600">{`From: ${filteredDemands.requester.name}`}</li>
                      <li className="text-xs ml-4 text-gray-600">{`Demand Date: ${new Date(
                        filteredDemands.dateRequested
                      ).toLocaleDateString()}`}</li>
                      <li className="text-xs ml-4 text-gray-600">{`Demand Description: ${filteredDemands.description}`}</li>
                      <li
                        className={`text-xs ml-4 font-bold ${filteredDemands.demandStatus === "pending"
                          ? "text-red-600"
                          : filteredDemands.demandStatus === "resolved"
                            ? "text-green-600"
                            : "text-blue-600"
                          }`}
                      >
                        {`Status: ${filteredDemands.demandStatus.toUpperCase()}`}
                      </li>
                      <div className='flex '>
                        <li className=' hover:text-green-900 ml-4 mb-4 font-bold'><button onClick={() => navigate('/actionDemand', { state: { demandNumber: filteredDemands.number } })}>{Role ==="admin"?'View':'Action'}</button></li>
                      </div>
                    </ul>
                  ))
                ) : (buttonClick === "All Demand" ?(
                  [...demands]?.reverse().map((demands, index) => (
                    <ul
                      key={index}
                      className="mb-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <li className="font-bold text-lg">{`Demand Number: ${demands.number}`}</li>
                      <li className="text-xs text-gray-600">{`From: ${demands.requester.name}`}</li>
                      <li className="text-xs text-gray-600">{`Demand Date: ${new Date(
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
                        {`Status: ${demands.demandStatus.toUpperCase()}`}
                      </li>
                      <div className='flex '>
                        <li className=' hover:text-green-900 font-bold'><button onClick={() => navigate('/actionDemand', { state: { demandNumber: demands.number } })}>{Role ==="admin"?'View':'Action'}</button></li>
                      </div>
                    </ul>
                  ))
                ):
                <div className='text-center mt-4 text-gray-500 font-semibold'>No Demand found</div>
              )}
              </div>

            </div>
          </div> :
          <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
            <Loading type="spin" color="#2C6B38" />
          </div>
      }

    </div>
  )
}

export default View