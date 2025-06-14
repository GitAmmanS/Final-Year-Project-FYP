import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BaseUrl } from '../utils/BaseUrl'
import { useNavigate } from 'react-router-dom'
import Loading from 'react-loading'

const ViewDemand = () => {
  const [demands, setDemands] = useState([]);
  const [filteredDemands, setFilteredDemands] = useState([]);
  const [buttonClick, setButtonClick] = useState("All demand");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const name = user?.name;
  const statusButtons = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Part Resolved", value: "partially resolved" },
    { label: "Resolved", value: "resolved" },
  ];


  useEffect(() => {
    const fetchDemands = async () => {
      setLoader(true);
      try {
        const response = await axios.get(`${BaseUrl}/demand/getByName/${name}`);
        let fetchedDemands = response.data.data;

        const statusOrder = {
          pending: 3,
          "partially resolved": 2,
          resolved: 1,
        };

        fetchedDemands.sort((a, b) => statusOrder[a.demandStatus] - statusOrder[b.demandStatus]);

        setDemands(fetchedDemands);
        setFilteredDemands(fetchedDemands); // Default: all
      } catch (error) {
        console.log("Error fetching demands:", error.message);
      } finally {
        setLoader(false);
      }
    };

    fetchDemands();
  }, []);

  const filterByStatus = (status) => {
    setButtonClick(status || "All demand");
    if (!status) {
      setFilteredDemands(demands);
    } else {
      const filtered = demands.filter(d => d.demandStatus === status);
      setFilteredDemands(filtered);
    }
  };

  return (
    <div className=''>
      <div className='title text-xl text-gray-900 font-bold mt-5 ml-3  flex'>
        My Requests
        <div className=' items-center space-x-6 ml-[440px] flex w-[80%]'>
          {statusButtons.map((btn, index) => (
            <button
              key={index}
              className={`text-sm border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md transition-all ${buttonClick === btn.label ? "bg-gray-400 border-black" : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => {
                setButtonClick(btn.label);
                filterByStatus(btn.value);
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {!loader ? (
        <div className="mt-4 w-[90%] ml-4 bg-green-50  rounded-2xl text-gray-800">
          {filteredDemands.length > 0 ? (
            [...filteredDemands].reverse().map((demand, index) => (
              <ul
                key={index}
                className="mb-4 bg-white rounded-lg shadow-lg border border-gray-200"
              >
                <li className="font-bold text-lg">{`Number: ${demand.number}`}</li>
                <li className="text-xs text-gray-600 font-thin">{`From: ${demand.requester.name}`}</li>
                <li className="text-xs text-gray-600 font-thin">{`Requested Date: ${new Date(
                  demand.dateRequested
                ).toLocaleDateString()}`}</li>
                <li className="text-xs text-gray-600 font-thin">{`Request Description: ${demand.description}`}</li>
                <li
                  className={`text-xs font-bold ${demand.demandStatus === "pending"
                      ? "text-red-600"
                      : demand.demandStatus === "resolved"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                >
                  {`Status: ${demand.demandStatus.toUpperCase()}`}
                </li>
                <div className='flex'>
                  <li className='hover:text-green-900 text-sm font-bold'>
                    <button onClick={() => navigate('/userDemandDetail', { state: { demandNumber: demand.number } })}>
                      Request Detail
                    </button>
                  </li>
                </div>
              </ul>
            ))
          ) : (
            <div className='text-center mt-4 text-gray-500 font-semibold'>No Request found</div>
          )}
        </div>
      ) : (
        <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
          <Loading type="spin" color="#2C6B38" />
        </div>
      )}
    </div>
  );
};

export default ViewDemand;
