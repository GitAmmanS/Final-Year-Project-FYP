import React, { useEffect, useState, useRef, useMemo } from 'react';
import { BaseUrl } from '../utils/BaseUrl';
import Print from '../Prints/Print';
import jsPDF from 'jspdf';
import axios from 'axios';
import Loading from 'react-loading'
import Swal from 'sweetalert2'
import Tooltip from '@mui/material/Tooltip';
import { MdEdit } from 'react-icons/md';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Dialog, DialogActions, DialogContent, DialogContentText, TextField, Button, DialogTitle, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/AxiosInstance';
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

const IssueComplaint = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [step, setStep] = useState(1);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userName = user ? user.name : '';
  const [productData, setProductData] = useState([]);
  const [LabData, setLabData] = useState([]);
  const [LabName, setLabName] = useState('');
  const [FilteredData, setFilteredData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(null);
  const [formData, setFormData] = useState({
    userName: userName,
    Location: '',
    description: '',
    quantities: {},
  });
  const [demandData, setDemandData] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      setLoader(true);
      try {
        const response = await axios.get(`${BaseUrl}/productstore`);
        setProductData(response.data.data);
        console.log(response.data.data);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoader(false);
      }
    };
    getProduct();
  }, []);

  useEffect(() => {
    const getLabs = async () => {
      setLoader(true)
      const resp = await axios.get(`${BaseUrl}/lab`);
      if (resp) {
        setLabData(resp.data.data);
        setLabName(resp.data.data[0]?.number || '');
        if (resp?.data?.data?.length > 0) {
          setFormData(prev => ({
            ...prev,
            Location: resp.data.data[0]?.number
          }))
        }
        setLoader(false);
      }
    }
    getLabs();
  }, [])


  const handleNext = () => {
    if (step === 1 && (formData.description === '' || (formData.Location === '' && LabData?.length > 1))) {
      Swal.fire({
        icon: "warning",
        title: formData.description === '' ? 'Description is required' : 'Location is required',
        text: formData.description === '' ? 'Description is required' : 'Location is required',
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });
      return;
    }
    if (step === 2 && (Object.keys(formData.quantities).length === 0)) {

      Swal.fire({
        icon: "warning",
        title: "Select Products",
        text: "Atleast one product is required",
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });
      return;
    }

    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleSubmit = async (e) => {
    console.log(formData);
    if (formData.quantities === null) {
      Swal.fire({
        icon: "warning",
        title: "Select Product",
        text: "Please enter Product",
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });
    }
    else {
      e.preventDefault();
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton:
            "bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 ml-4 rounded shadow",
          cancelButton:
            "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Submit Complaint?",
          text: "Press Yes to submit",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            SubmitDemand();
          }
        });

      const SubmitDemand = async () => {
        try {
          console.log("Form Submitted:", formData);
          setLoader(true);
          await axiosInstance.post(`${BaseUrl}/complain/post`, formData);
          setLoader(false);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Complaint Send Sucessfully",
            showConfirmButton: false,
            timer: 2000,
            width: "380px",
            height: "20px"
          })
            .then((result) => {
              clearFields();
            });
        } catch (error) {
          console.error("Error in Submitting:", error);
        }
      };
    }
  };
  useEffect(() => {
    if (productData.length > 0 && formData.Location) {
      const filtered = productData.filter((data) =>
        data.lab_ID?.number === formData.Location
      );
      setFilteredData(filtered);
      console.log(filtered);
    }
  }, [productData, formData.Location]);

  const transformedData = useMemo(() => {
    return FilteredData.flatMap(store =>
      store.items.map(item => {
        const hasQuantity = formData.quantities[item._id] !== undefined;

        return {
          'Serial Number': item?.serialNumber || "N/A",
          Name: item.product_ID?.name || "N/A",
          Category: item.product_ID?.category_ID?.name || "N/A",
          Company: item.product_ID?.company_ID?.name || "N/A",
          Model: item.product_ID?.model || "N/A",
          Picture: (
            <img
              src={`${BaseUrl}/${item.product_ID?.picture}`}
              alt={item.product_ID?.name || "Product"}
              style={{ width: 50, height: 50 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.png'
              }}
            />
          ),
          Actions: (
            <div className='flex gap-1'>
              {!hasQuantity ? (
                <Tooltip title='Add to complaint'>
                  <button
                    className='text-xl hover:text-slate-600'
                    onClick={() => handleSave(item)}
                  >
                    <MdEdit />
                  </button>
                </Tooltip>
              ) : (
                <span className='text-gray-600 font-semibold'>Added</span>
              )}
            </div>
          )
        };
      })
    );
  }, [FilteredData, formData.quantities]);

  const [columns] = useState([
    {
      accessorKey: 'Serial Number',
      header: locales.labels.serialNumber,
      size: 100,
    },
    {
      accessorKey: 'Name',
      header: locales.labels.name,
      size: 100,
    },
    {
      accessorKey: 'Category',
      header: locales.labels.category,
      size: 100,
    },
    {
      accessorKey: 'Company',
      header: locales.labels.company,
      size: 100,
    },
    {
      accessorKey: 'Model',
      header: locales.labels.model,
      size: 100,
    },
    {
      accessorKey: 'Picture',
      header: locales.labels.picture,
      size: 100,
    },
    {
      accessorKey: 'Actions',
      header: locales.labels.actions,
      size: 100,
    }
  ]);
  const table = useMaterialReactTable({
    columns,
    data: transformedData,
    muiTableHeadCellProps: {
      className: "[&.MuiTableCell-head]:bg-[#1B4D3E] [&.MuiTableCell-head]:text-white",
    },
    muiTableBodyCellProps: {
      className: "[&.MuiTableCell-body]:bg-[#FAF0E6]",
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFields = () => {
    setFormData({
      userName: userName,
      Location: '',
      description: '',
      quantities: {},
    });
    setDemandData([]);
    setStep(1);
  };
  const handleChangeEdit = (item) => {
    setProductId(item._id);
    setIsDialogOpen(true);
  }
  const handleClose = () => {
    setIsDialogOpen(false);
  }
  const handleSave = (product) => {
    setFormData((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [product._id]: product._id
      }

    }));
    setIsDialogOpen(false);
    setQuantity(1);
  };
  const handleDelete = (productId) => {


    const newQuantities = { ...formData.quantities };
    delete newQuantities[productId];

    setFormData(prev => ({
      ...prev,
      quantities: newQuantities
    }));
    if (Object.keys(newQuantities).length === 0) {
      setStep(2);
    }
  };

  const [columns2] = useState([
    {
      accessorKey: 'Serial Number',
      header: locales.labels.serialNumber,
      size: 100,
    },
    {
      accessorKey: 'Name',
      header: locales.labels.name,
      size: 100,
    },
    {
      accessorKey: 'Category',
      header: locales.labels.category,
      size: 100,
    },
    {
      accessorKey: 'Company',
      header: locales.labels.company,
      size: 100,
    },
    {
      accessorKey: 'Model',
      header: locales.labels.model,
      size: 100,
    },
    {
      accessorKey: 'Picture',
      header: locales.labels.picture,
      size: 100,
    },
    {
      accessorKey: 'Actions',
      header: locales.labels.actions,
      size: 100,
    }
  ]);
  // Memoized selected products data
  const selectedProducts = useMemo(() => {
    return FilteredData.length>0 && FilteredData
      .flatMap((item) => {
        return item.items.filter((item) => formData.quantities[item._id] !== undefined)
          .map((item1) => {
            return {
              'Serial Number': item1.serialNumber || "N/A",
              Name: item1.product_ID?.name || "N/A",
              Category: item1.product_ID?.category_ID?.name || "N/A",
              Company: item1.product_ID?.company_ID?.name || "N/A",
              Model: item1.product_ID?.model || "N/A",
              Picture: (
                <img
                  src={`${BaseUrl}/${item1.product_ID?.picture}`}
                  alt="item1"
                  style={{ width: 50, height: 50 }}
                />
              ),
              Actions: (
                <div className='flex gap-1'>
                  <button
                    onClick={() => handleDelete(item1._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ),
            };
          });
      })
  }, [FilteredData, formData.quantities]);


  return (
    <>
      <div>
        {
          loader ? (<div className='text-center flex justify-center items-center min-w-[100px] min-h-[500px]'>
            <Loading type="spin" color="#2C6B38" />
          </div>) :
            (
              <>
                <div className="flex flex-col m-6">
                  <h1 className="text-xl font-semibold text-gray-900">Issue Complaint</h1>
                  <div className="flex items-center justify-center mt-2">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${step >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}>
                        1
                      </div>
                      <span className={`mt-1 text-xs ${step >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                        Complaint Details
                      </span>
                    </div>

                    {/* Connector line */}
                    <div className={`h-0.5 w-36 mx-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold  ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}>
                        2
                      </div>
                      <span className={`mt-1 text-xs ${step >= 2 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                        Complaint Products
                      </span>
                    </div>

                    {/* Connector line */}
                    <div className={`h-0.5 w-36 mx-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}></div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${step >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}>
                        3
                      </div>
                      <span className={`mt-1 text-xs ${step >= 3 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                        Review & Submit
                      </span>
                    </div>
                  </div>
                </div>
                {step === 1 && (
                  <div className="bg-white p-8 rounded-lg shadow-md w-3/4 mx-auto mt-5">

                    <form className="space-y-6 text-sm">
                      <div className="flex flex-col">
                        <label className="text-gray-600">Generated By:</label>
                        <input
                          type="text"
                          readOnly
                          placeholder="User"
                          value={formData.userName}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      {
                        Array.isArray(LabData) && LabData.length > 0 && (
                          <div className="flex flex-col">
                            <label className="text-gray-600">Select Location:</label>
                            <TextField
                              fullWidth
                              select
                              name="room"
                              value={formData.Location || ""}
                              onChange={(e) => handleChange('Location', e.target.value)}
                              margin="dense"
                            >
                              {
                                Array.isArray(LabData) && LabData.length > 1 &&
                                LabData.map((lab, index) => (
                                  <MenuItem value={lab.number}>{lab.number}</MenuItem>
                                ))
                              }

                            </TextField>
                          </div>
                        )
                      }
                      <div className="flex flex-col">
                        <label className="text-gray-600">Description:</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          rows="4"
                          cols="60"
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={clearFields}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                        >
                          Add Item
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white p-8 rounded-lg shadow-md  mx-auto mt-5">
                    <div className='flex flex-col w-full'>
                      {
                         <div> <MaterialReactTable table={table} /></div>
                      }
                    </div>
                    <div className="flex justify-between mt-4 text-sm">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="bg-white p-8 rounded-lg shadow-md w-3/4 mx-auto mt-5">
                    <div className="mb-4">
                      <p><strong>Generated By:</strong> {formData.userName}</p>
                      <p><strong>Location:</strong> {
                        formData.Location !== '' ? formData.Location : LabName
                      }</p>
                      <p><strong>Description:</strong> {formData.description}</p>
                    </div>
                    <div className="w-full">
                      <MaterialReactTable
                        columns={columns2}
                        data={selectedProducts}
                        muiTableHeadCellProps={{ className: "[&.MuiTableCell-head]:bg-[#1B4D3E] [&.MuiTableCell-head]:text-white", }}
                        muiTableBodyCellProps={{ className: "[&.MuiTableCell-body]:bg-[#FAF0E6]", }}
                      />
                    </div>
                    <div className="flex justify-between mt-4 text-sm">
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </>
            )
        }
      </div>

    </>
  );
};

export default IssueComplaint;
