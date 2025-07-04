import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../utils/BaseUrl';
import axios from 'axios'
import Print from '../Prints/Print';
import jsPDF from 'jspdf';
import Loading from 'react-loading';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField
} from '@mui/material';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import Swal from 'sweetalert2'

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

const DemandDetails = () => {
  const location = useLocation();
  const printableRef = useRef();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { demandNumber } = location.state;
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userRole = user.role;
  const [demand, setDemand] = useState([]);
  const [storeItems, setStoreItems] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [StoreQuantity, setStoreQuantity] = useState(1);
  const [editId, setEditId] = useState(null);
  const [demandId, setDemandId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const handleClose = () => {
    setOpenEdit(false);
    setEditId(null);
    setStoreQuantity(1)
  };
  const handleEditQuantity = () => {
    setOpenEdit(false);
    if (editId) {
      setLoader(true);
      axios.put((`${BaseUrl}/demand/put`), { StoreQuantity, editId, demandId , Location:demand.location }).then((response) => {
        console.log(response.data);
        if (response.data.success) {
          setLoader(false);
          const event = new CustomEvent('NotificationChanged');
          window.dispatchEvent(event);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Product Allocated",
            showConfirmButton: false,
            timer: 2000,
            width: "380px",
            height: "20px"
          });
          setSubmitted(!submitted);
          handleClose();
        }
      }).catch((error) => {
        setLoader(false);
        console.log(error.message)
        setOpenEdit(false);
        Swal.fire({
          icon: "error",
          title: "Product Exceeded Limit",
          showConfirmButton: true,
          width: "380px",
          customClass: {
            confirmButton: "bg-[#22C55E] text-white",
          },
        })
      
      })
    }
  }
  const PrintNotification = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 ml-4 rounded shadow",
        cancelButton: "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow",
      },

      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Print Notification?",
      text: "Are you sure to print this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const doc = new jsPDF();
        const content = printableRef.current;
        if (content) {
          doc.html(content, {
            callback: function (doc) {
              const pdfOutput = doc.output('blob');
              const pdfUrl = URL.createObjectURL(pdfOutput);
              window.open(pdfUrl, '_blank');
            }
          });
        }
      }
    });
  }


  useEffect(() => {
    setLoader(true);

    axios.get(`${BaseUrl}/demand/getById/${demandNumber}`)
      .then((res) => {
        setLoader(false);
        setDemand(res.data.data);
        console.log(res.data.data);
        setDemandId(res.data.data._id);
      })
      .catch((error) => {
        setLoader(false);
        console.log(error.message);
      })

  }, [demandNumber, submitted]);
  useEffect(() => {
    axios.get((`${BaseUrl}/store`)).then((res) => {
      setStoreItems(res.data.data)
    }).catch((error) => {
      console.log(error.message);
    })
  }, [])
  const getAvailableQuantity = (productId) => {
    const productInStore = storeItems?.find((storeItem) => {
      return storeItem.product_ID._id === productId;
    });
    return productInStore ? productInStore.quantity : 'Not Available';
  };

  return (

    <div className="p-4 bg-blue-50 rounded-lg shadow-lg mt-4">
      <div className='flex '>
        <p
          onClick={() => navigate('/demandsList')}
          className="cursor-pointer hover:text-green-700 transition text-black p-1 text-xl"
        >
          <FaCircleArrowLeft />
        </p>
        <h3 className="font-bold text-lg text-gray-800">{`Demand Number: ${demandNumber}`}</h3>
      </div>
      {
        !loader ?
          <div className="flex flex-row ">
            <div className="text-gray-900 mt-2 md:min-w-[1000px]">
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead className=' text-sm font-semibold bg-gray-500 text-center text-[16px]'>
                  <tr className=" border-[2px] text-white">
                    <th className="p-2 border-2">Product Name</th>
                    <th className="p-2 border-2">Category</th>
                    <th className="p-2 border-2">Company</th>
                    <th className="p-2 border-2">Model</th>
                    <th className="p-2 border-2">Specs</th>
                    <th className="p-2 border-2">Demaded Quantity</th>
                    <th className="p-2 border-2">Quantity Recieved</th>
                    <th className="p-2 border-2">Available Quantity</th>
                    <th className="p-2 border-2">Status</th>
                    {userRole !== "admin" &&
                      <th className="p-2 border-2">Actions</th>
                    }
                  </tr>
                </thead>
                {
                  console.log(demand)
                }
                <tbody>
                  {demand?.items?.length > 0 ? (
                    demand?.items?.map((product, index) => (
                      <tr key={index} className="text-xs text-center even:bg-slate-300 text-[14px]">
                        <td className="border border-gray-300 px-4 py-2">{product?.product_Id?.product_ID?.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{product?.product_Id?.product_ID?.category_ID?.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{product?.product_Id?.product_ID?.company_ID?.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{product?.product_Id?.product_ID?.model}</td>
                        <td className="border border-gray-300 px-4 py-2 ">
                          <p>{product.product_Id?.product_ID?.specs?.otherspecs}</p>
                          <p>{product.product_Id?.product_ID?.specs.cpu ? "Cpu : " + product.product_Id?.product_ID?.specs?.cpu?.name : ''}</p>
                          <p>{product.product_Id?.product_ID?.specs.os ? "Operating System : " + product.product_Id?.product_ID?.specs?.os?.name : ''}</p>
                          <p>{product.product_Id?.product_ID?.specs.ram ? "Ram Capacity :" + product.product_Id?.product_ID?.specs.ram?.[0].capacity?.size || "" : ''}</p>
                          <p>{product.product_Id?.product_ID?.specs.ram ? "Ram Type :" + product.product_Id?.product_ID?.specs.ram?.[0].type?.name : ''}</p>
                          <p>{product.product_Id?.product_ID?.specs.hdd ? "Hdd Capacity :" + product.product_Id?.product_ID?.specs.hdd?.[0].capacity?.size : ''}</p>
                          <p>{product.product_Id?.product_ID?.specs.hdd ? "Hdd Type :" + product.product_Id?.product_ID?.specs.hdd?.[0].type?.name : ''}</p>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{product?.quantityDemanded || 0}</td>
                        <td className="border border-gray-300 px-4 py-2">{product?.quantityReceived || 0}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {getAvailableQuantity(product?.product_Id?.product_ID?._id)}
                        </td>
                        <td className={`border border-gray-300 px-4 py-2 font-bold ${product?.status === "pending"
                          ? "text-red-700"
                          : product?.status === "partially resolved"
                            ? "text-blue-500"
                            : "text-green-500"
                          }`}
                        >{(product?.status.toUpperCase().replace('_', ' '))}</td>
                        {(product?.status === "pending" || product?.status === "partially resolved") && userRole !== "admin" && (
                          <td className="border border-gray-300 px-4 py-2 cursor-pointer font-bold">
                            <button
                              className=''
                              onClick={() => {
                                setOpenEdit(!openEdit);
                                setEditId(product?.product_Id?.product_ID._id);
                                {
                                  console.log(product?.product_Id?.product_ID._id);
                                }
                              }}
                            >
                              Allocate
                            </button>
                          </td>
                        )}

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
              <button
                type="button"
                onClick={PrintNotification}
                className="px-2 py-2 my-3 float-right bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 "
              >
                Print Notification
              </button>
            </div>
            {demand.items && demand.items.length > 0 && (
              <div style={{ display: 'none' }}>
                <Print ref={printableRef} data={demand} name="Response" subject="Response to Request for Products" dateAndTime="updatedAt" />
              </div>
            )}

          </div> :
          <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
            <Loading type="spin" color="#2C6B38" />
          </div>
      }

      <Dialog open={openEdit} onClose={handleClose}>
        <DialogTitle>Allocate Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Quantity you want to Allocate
          </DialogContentText>
          <TextField
            margin="dense"
            name="Quantity"
            label="Quantity"
            value={StoreQuantity}
            defaultValue={1}
            onChange={(e) => setStoreQuantity(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditQuantity}>Add </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DemandDetails;
