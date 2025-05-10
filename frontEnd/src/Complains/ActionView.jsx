import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../utils/BaseUrl';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import Loading from 'react-loading'
import { axiosInstance } from '../utils/AxiosInstance';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, MenuItem, Select, InputLabel, FormControl, TextField
} from '@mui/material';
import Swal from 'sweetalert2';

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

const ActionView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user.role;
  const [loader, setLoader] = useState(false);
  const { complainNumber } = location.state;
  const [complain, setcomplain] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [Status, setStatus] = useState('Pending');
  const statusOptions = [
    { key: 'pending', value: 'Pending' },
    { key: 'in-progress', value: 'In Progress' },
    { key: 'resolved', value: 'Resolved' },
  ];

  useEffect(() => {
    setLoader(true);
    axiosInstance.get(`${BaseUrl}/complain/ByComplainNumber/${complainNumber}`)
      .then((res) => {
        setcomplain(res.data.data);
        console.log(res.data.data[0].severty_level);
      })
      .catch((error) => {
        console.error(error.message);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [complainNumber]);

  const handleClose = () => {
    setOpenEdit(false);
    setEditId(null);
  };
  const handleStatusChange = () => {
    console.log(complainNumber);
    axiosInstance.put((`${BaseUrl}/complain/put/${complainNumber}`), { status: Status }).then((response) => {
      console.log(response);
      if (response.data.success) {
        const event = new CustomEvent('NotificationChanged');
        window.dispatchEvent(event);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Complaint Status Changed",
          showConfirmButton: false,
          timer: 2000,
          width: "380px",
          height: "20px"
        });
        handleClose();
        navigate("/complains");
      }
    }).catch((error) => {
      console.log(error.message)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error",
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });

    })
  }


  return (

    <div className="p-4 bg-blue-50 rounded-lg shadow-lg mt-4">
      <div className='flex '>
        <p
          onClick={() => navigate('/complains')}
          className="cursor-pointer hover:text-green-700 transition text-black p-1 text-xl"
        >
          <FaCircleArrowLeft />
        </p>
        <h3 className="font-bold text-lg text-gray-800">Complain Number: <span className='text-gray-500'>{complainNumber}</span></h3>
      </div>
      {
        !loader ?
          <div className="flex flex-row flex-wrap ">
            <div className="text-gray-900 mt-12 ml-6  md:min-w-[1000px] ">
              <table className="w-full border-collapse border border-gray-300 mb-4 ">
                <thead className=' text-sm font-semibold bg-gray-500 text-center text-[16px]'>
                  <tr className=" border-[2px] text-white ">
                    <th className="p-2 border-2">Product Name</th>
                    <th className="p-2 border-2">Category</th>
                    <th className="p-2 border-2">Company</th>
                    <th className="p-2 border-2">Model</th>
                    <th className="p-2 border-2">Specs</th>
                  </tr>
                </thead>
                <tbody className=''>
                  {complain[0]?.product?.length > 0 ? (
                    complain[0]?.product?.map((product, index) => (
                      <tr key={index} className="text-xs text-center even:bg-slate-300 text-[14px] ">
                        <td className="border border-gray-300 px-4 py-2">{product.ItemStore_ID.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{product.ItemStore_ID.category_ID.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{product.ItemStore_ID.company_ID.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{product.ItemStore_ID.model}</td>
                        <td className="border border-gray-300 px-4 py-2 ">
                          <p>{product.ItemStore_ID?.specs?.otherspecs}</p>
                          <p>{product.ItemStore_ID.specs.cpu ? "Cpu : " + product.ItemStore_ID.specs?.cpu?.name : ''}</p>
                          <p>{product.ItemStore_ID.specs.os ? "Operating System : " + product.ItemStore_ID.specs?.os?.name : ''}</p>
                          <p>{product.ItemStore_ID.specs.ram ? "Ram Capacity :" + product.ItemStore_ID.specs.ram?.[0].capacity?.size || "" : ''}</p>
                          <p>{product.ItemStore_ID.specs.ram ? "Ram Type :" + product.ItemStore_ID.specs.ram?.[0].type?.name : ''}</p>
                          <p>{product.ItemStore_ID.specs.hdd ? "Hdd Capacity :" + product.ItemStore_ID.specs.hdd?.[0].capacity?.size : ''}</p>
                          <p>{product.ItemStore_ID.specs.hdd ? "Hdd Type :" + product.ItemStore_ID.specs.hdd?.[0].type?.name : ''}</p>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center text-gray-500">
                        No items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <br />
              <table className="w-full border-collapse border border-gray-300 my-4">
                <thead className=' text-sm font-semibold bg-gray-500 text-center text-[16px]'>
                  <tr className=" border-[2px] text-white">
                    <th className="p-2 border-2">Complain Description</th>
                    <th className="p-2 border-2">Registered Date</th>
                    <th className="p-2 border-2">Severty Level</th>
                    <th className="p-2 border-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complain[0]?.product?.length > 0 ? (
                    <tr className="text-xs text-center even:bg-slate-300 text-[14px]">
                      <td className="border border-gray-300 px-4 py-2">{complain[0].description}</td>
                      <td className="border border-gray-300 px-4 py-2">{new Date(complain[0].created_At).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      </td>
                      <td className={`border border-gray-300 px-4 py-2 font-bold ${complain[0]?.severty_level === "critical"
                        ? "text-red-600"
                        : complain[0]?.severty_level === "high"
                          ? "text-orange-600"
                          : complain[0]?.severty_level === "medium"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}>
                        {(complain[0]?.severty_level || "N/A").toUpperCase()}
                      </td>

                      <td className={`border border-gray-300 px-4 py-2 font-bold ${complain[0].status === "pending"
                        ? "text-red-600"
                        : complain[0].status === "resolved"
                          ? "text-green-600"
                          : "text-blue-600"
                        }`}>{(complain[0].status || null).toUpperCase()}</td>

                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center text-gray-500">
                        No items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {
                userRole === "technician" || userRole === "lab_Incharge" ?
                  <button
                    className='text-white bg-green-500 w-32 h-8 text-sm rounded-[10px] float-right hover:bg-green-300 cursor-pointer'
                    onClick={() => {
                      setOpenEdit(!openEdit);
                      setEditId(complain._Id);
                    }}
                  >
                    Resolve Complain
                  </button> : ''
              }

            </div>

          </div> :
          <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
            <Loading type="spin" color="#2C6B38" />
          </div>
      }

      <Dialog open={openEdit} onClose={handleClose}>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent>
          <InputLabel>Change Complaint Status</InputLabel>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            defaultValue="PENDING"
            value={Status || "PENDING"} // Default to "PENDING" if `Status` is empty
            onChange={(event) => setStatus(event.target.value)}
            margin="dense"
          >
            {statusOptions.map((status) => (
              <MenuItem key={status.key} value={status.key}>
                {status.value}
              </MenuItem>
            ))}
          </TextField>

        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleClose}>Cancel</Button>
          <Button onClick={handleStatusChange}>Add </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
};

export default ActionView;
