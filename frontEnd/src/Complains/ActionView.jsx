import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../utils/BaseUrl';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import Loading from 'react-loading';
import { axiosInstance } from '../utils/AxiosInstance';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, MenuItem, TextField,
} from '@mui/material';
import Swal from 'sweetalert2';
import { MdEdit } from "react-icons/md";

let locales;
const language = sessionStorage.getItem("language");
if (language === "english" || language == null) {
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
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userRole = user.role;
  const [loader, setLoader] = useState(true);
  const { complainNumber } = location.state;
  const [complain, setComplain] = useState(null);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [EditId, setEditId] = useState(null);
  const [status, setStatus] = useState('pending');
  const [submit, setSubmitted] = useState(false);

  const statusOptions = [
    { key: 'pending', value: 'Pending' },
    { key: 'in-progress', value: 'In Progress' },
    { key: 'resolved', value: 'Resolved' },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoader(true);

        const complainRes = await axiosInstance.get(`${BaseUrl}/complain/ByComplainNumber/${complainNumber}`);
        const complainData = complainRes.data.data[0];
        setComplain(complainData);
        console.log(complainData);

        const productStoreRes = await axiosInstance.get(`${BaseUrl}/productStore`);
        const allProducts = productStoreRes.data.data;

        const complainProductIds = complainData.product.map(item => item.ItemStore_ID);

        const matched = [];
        allProducts.forEach(storeEntry => {
          storeEntry.items.forEach(item => {
            if (complainProductIds.includes(item._id)) {
              matched.push({
                ...item,
              });
            }
          });
        });
        console.log(matchedProducts);

        setMatchedProducts(matched);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoader(false);
      }
    }

    fetchData();
  }, [complainNumber, submit]);

  const handleClose = () => {
    setOpenEdit(false);
  };

  const handleStatusChange = () => {
    console.log('clicked');
    axiosInstance.put(`${BaseUrl}/complain/put/${complainNumber}`, { status, EditId })
      .then((response) => {
        if (response.data.success) {
          setSubmitted(!submit);
          const event = new CustomEvent('NotificationChanged');
          window.dispatchEvent(event);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Complaint Status Changed",
            showConfirmButton: false,
            timer: 2000,
            width: "380px"
          });
          setComplain(prev => ({ ...prev, status }));
          handleClose();
        }
      })
      .catch((error) => {
        console.log(error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error",
          width: "380px",
          customClass: {
            confirmButton: "bg-[#22C55E] text-white",
          },
        });
      });
  };

  if (loader) {
    return (
      <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
        <Loading type="spin" color="#2C6B38" />
      </div>
    );
  }

  if (!complain) {
    return <div>No complaint data found</div>;
  }

  return (
    <div className="p-4 bg-blue-50 rounded-lg shadow-lg mt-4">
      <div className='flex'>
        <p
          onClick={() => navigate('/complains')}
          className="cursor-pointer hover:text-green-700 transition text-black p-1 text-xl"
        >
          <FaCircleArrowLeft />
        </p>
        <h3 className="font-bold text-lg text-gray-800">Complain Number: <span className='text-gray-500'>{complainNumber}</span></h3>
      </div>

      <div className="text-gray-900 mt-12">
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead className='text-sm font-semibold bg-gray-500 text-center text-[16px]'>
            <tr className="border-[2px] text-white">
              <th className="p-2 border-2">S/N</th>
              <th className="p-2 border-2">Product Name</th>
              <th className="p-2 border-2">Category</th>
              <th className="p-2 border-2">Company</th>
              <th className="p-2 border-2">Model</th>
              <th className="p-2 border-2">Status</th>
              {userRole !== "admin" && userRole !== "teacher" &&
                <th className="p-2 border-2">Actions</th>
              }
              <th className="p-2 border-2">Complain Location</th>
              {
                userRole !=='admin' && userRole !== 'teacher' &&
                <th className="p-2 border-2">Assigned To</th>
              }
              <th className="p-2 border-2">Description</th>
              <th className="p-2 border-2">Registered Date</th>
              <th className="p-2 border-2">Complain Status</th>
            </tr>
          </thead>
          <tbody>
            {matchedProducts.length > 0 ? (
              matchedProducts.map((product, index) => (
                <tr key={product._id} className="text-xs text-center even:bg-slate-200 text-[14px]">
                  <td className="border border-gray-300 px-4 py-2">{product?.serialNumber || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{product?.product_ID?.name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{product?.product_ID?.category_ID?.name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{product?.product_ID?.company_ID?.name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{product?.product_ID?.model || 'N/A'}</td>
                  <td className={`border border-gray-300 px-4 py-2 font-bold ${complain.product[index].status_Product === 'pending'
                    ? 'text-red-600'
                    : complain.product[index].status_Product === 'resolved'
                      ? 'text-green-600'
                      : 'text-blue-600'
                    } `}>{(complain?.product[index].status_Product.toUpperCase()).replace('_', ' ') || 'N/A'}</td>
                  {userRole !== "admin" && userRole !== "teacher" &&
                    <td className="border border-gray-300  font-bold bg-gray-300 border-b px-4 py-2 font-bolder cursor-pointer">
                      <button
                        className=''
                        onClick={() => {
                          setOpenEdit(!openEdit);
                          setEditId(product._id);
                        }}
                      >
                        <MdEdit />
                      </button>
                    </td>
                  }

                  {index === 0 && (
                    <>
                      <td rowSpan={matchedProducts.length} className="border border-gray-300 px-4 py-2">
                        {complain.location}
                      </td>
                      {
                        userRole !== "admin" && userRole !== "teacher" &&
                        <td rowSpan={matchedProducts.length} className="border border-gray-300 px-4 py-2">
                        {complain.assigned_to.name} ({complain.assigned_to.role.toUpperCase().replace('_', ' ')})
                      </td>
                      }
                      <td rowSpan={matchedProducts.length} className="border border-gray-300 px-4 py-2">
                        {complain.description}
                      </td>
                      <td rowSpan={matchedProducts.length} className="border border-gray-300 px-4 py-2">
                        {new Date(complain.created_At).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td
                        rowSpan={matchedProducts.length}
                        className={`border border-gray-300 font-bold text-white ${complain.status === 'pending'
                          ? 'bg-red-600'
                          : complain.status === 'resolved'
                            ? 'bg-green-600'
                            : 'bg-blue-600'
                          }`}
                      >
                        {(complain.status || '').toUpperCase()}
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-gray-500">
                  No products found for this complaint.
                </td>
              </tr>
            )}
          </tbody>
        </table>


      </div>

      <Dialog open={openEdit} onClose={handleClose}>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            margin="dense"
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.key} value={option.key}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleClose}>Cancel</Button>
          <Button onClick={handleStatusChange}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ActionView;