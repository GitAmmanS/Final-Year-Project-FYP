import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../utils/BaseUrl'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../utils/AxiosInstance';
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

const ViewComplains = () => {
  const [complains, setcomplains] = useState([]);
  const [filteredcomplains, setFilteredcomplains] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const Role = user?.role;
  const UserID = user?._id;
  const [buttonClick, setButtonClick] = useState("All complain");
  const [ComplainByUser, setComplainByUser] = useState([]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoader(true);
      try {
        let response ,complaints;
        if (Role === "admin" ) {
          response = await axiosInstance.get(`${BaseUrl}/complain`);
          complaints = response.data.message;
        } 
        else if ( Role ==="lab_Incharge" || Role ==="technician") {
          response = await axiosInstance.get(`${BaseUrl}/complain`);
          
          complaints = response.data.message?.filter?.((complain)=>complain.assigned_to._id === user._id);
          console.log(response.data.message);
        } else {
          response = await axiosInstance.get(`${BaseUrl}/complain/post/${UserID}`);
          console.log(response.data.data);
          complaints = response.data.data;
        }

        console.log(complaints);
        if (complaints.length >= 2) {
          const statusOrder = {
            pending: 3,
            "partially resolved": 2,
            resolved: 1,
          };
          complaints.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        }
        else{
        console.log(response.data.message);
        }
        setcomplains(complaints);

      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoader(false);
      }
    };

    fetchComplaints();
  }, []);


  const representByStatus = (statusName) => {
    const filteredcomplains = complains.filter((complain) => complain.status === statusName);
    setFilteredcomplains(filteredcomplains);
    if (filteredcomplains === 0) {
      return "no complains"
    }
  }
  return (

    <div className=''>
      <div className='title text-xl text-gray-900 font-bold mt-5 ml-3 flex '>
       {Role === "teacher"? 'My Complaints' : 'Complains List'}
        <div className=' justify-center items-center space-x-4 ml-[440px] flex'>
          <button
            className={`text-sm  border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md  transition-all ${buttonClick === "All complain" ? "bg-gray-400 border-black" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => {
              representByStatus("")
              setButtonClick("All complain")
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
              representByStatus("in-progress")
              setButtonClick("partially resolved")
            }}>
            In Progress
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
          <div className="card flex  flex-col">
            <div className='mt-4 w-[90%] h-[50%] '>
              <div className="w-full  bg-green-50 p-4 rounded-2xl text-gray-800">
                {filteredcomplains.length > 0 ? (
                  [...filteredcomplains]?.reverse().map((filteredcomplains, index) => (
                    <ul
                      key={index}
                      className="mb-4  bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <li className="font-bold ml-4 mt-4 text-lg">{`Number: ${filteredcomplains.number}`}</li>
                      <li className="text-xs ml-4 text-gray-600">{`From: ${filteredcomplains.generated_by.name}`}</li>
                      <li className="text-xs ml-4 text-gray-600">{`Location: ${filteredcomplains.location}`}</li>
                      <li className="text-xs ml-4 text-gray-600">{`Date: ${new Date(
                        filteredcomplains.created_At
                      ).toLocaleDateString()}`}</li>
                      <li className="text-xs ml-4 text-gray-600">{`Description: ${filteredcomplains.description}`}</li>
                      <li
                        className={`text-xs ml-4 font-bold ${filteredcomplains.status === "pending"
                          ? "text-red-600"
                          : filteredcomplains.status === "resolved"
                            ? "text-green-600"
                            : "text-blue-600"
                          }`}
                      >
                        {`Status: ${filteredcomplains.status.toUpperCase()}`}
                      </li>
                      <div className='flex '>
                        <li className=' hover:text-green-900 ml-4 mb-4 font-bold'><button onClick={() => navigate('/actioncomplain', { state: { complainNumber: filteredcomplains.number } })}>{Role==="teacher"|| Role ==="admin"?'View':'Action'}</button></li>
                      </div>
                    </ul>
                  ))
                ) : (buttonClick === "All complain" ? (
                  [...complains]?.reverse().map((complains, index) => (
                    <ul
                      key={index}
                      className="mb-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <li className="font-bold text-lg">{`Number: ${complains.number}`}</li>
                      <li className="text-xs text-gray-600">{`From: ${complains.generated_by.name}`}</li>
                      <li className="text-xs text-gray-600">{`Location: ${complains.location}`}</li>
                      <li className="text-xs text-gray-600">{`Date: ${new Date(
                        complains.created_At
                      ).toLocaleDateString()}`}</li>
                      <li className="text-xs text-gray-600">{`Description: ${complains.description}`}</li>
                      <li
                        className={`text-xs font-bold ${complains.status === "pending"
                          ? "text-red-600"
                          : complains.status === "resolved"
                            ? "text-green-600"
                            : "text-blue-600"
                          }`}
                      >
                        {`Status: ${complains.status.toUpperCase()}`}
                      </li>
                      <div className='flex '>
                        <li className=' hover:text-green-900 font-bold'><button onClick={() => navigate('/actioncomplain', { state: { complainNumber: complains.number } })}>{Role==="teacher" || Role ==="admin"?'View':'Action'}</button></li>
                      </div>
                    </ul>
                  ))
                ):
                  <div className='text-center mt-4 text-gray-500 font-semibold'>No Complaints found</div>
                )}
              </div>

            </div>
          </div> :
          <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
            <Loading type="spin" color="#2C6B38" />
          </div> 
      }
      {
        
        complains.length<=0 && filteredcomplains.length<=0 && buttonClick==='All complain' && loader &&(
          <div className='text-center mt-4 text-gray-500 font-semibold'>No Complaints found</div>
        )
      }

    </div>
  )
}

export default ViewComplains