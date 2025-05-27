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
import { Dialog, DialogActions, DialogContent, DialogContentText, TextField, Button, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const CreateDemand = () => {
  const printableRef = useRef();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [step, setStep] = useState(1);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userName = user ? user.name : '';
  const [productData, getProductData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(null);
  const [formData, setFormData] = useState({
    userName: userName,
    description: '',
    quantities: {},
  });
  const [demandData, setDemandData] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      axios.get(`${BaseUrl}/product`).then((response) => {
        getProductData(response.data.data);
      })
    }
    getProduct();
  }, [productData])


  const handleNext = () => {
    if (step === 1 && !formData.description) {
      Swal.fire({
        icon: "warning",
        title: "Description Required",
        text: "Description is required",
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
          title: "Submit Demand?",
          text: "Press Yes to submit demand",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            SubmitDemand();
          }
        });

      const SubmitDemand = async () => {
        try {
          console.log("Form Submitted:", formData);

          const response = await axios.post(`${BaseUrl}/mainDemand/post`, formData);
          console.log(response.data.data.number);

          setLoader(true);
          const resp = await axios.get(
            `${BaseUrl}/mainDemand/getById/${response.data.data.number}`
          );
          console.log(resp.data.data);
          setDemandData(resp.data.data);
          await sleep(2000);

          swalWithBootstrapButtons
            .fire({
              title: "Print Demand",
              text: "Are you sure you want to print this?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonText: "No",
              reverseButtons: true,
            })
            .then((result) => {
              if (result.isConfirmed) {
                const doc = new jsPDF();
                const content = printableRef.current;

                if (content) {
                  setLoader(false);
                  doc.html(content, {
                    callback: function (doc) {
                      const pdfOutput = doc.output("blob");
                      const pdfUrl = URL.createObjectURL(pdfOutput);
                      window.open(pdfUrl, "_blank");
                    },
                  });
                }
              } else {
                setLoader(false);
              }

              clearFields();
            });
        } catch (error) {
          console.error("Error in Submitting:", error);
        }
      };
    }
  };
  const transformedData = useMemo(() =>
    productData.map(item => {
      const hasQuantity = formData.quantities[item._id] !== undefined;

      return {
        Name: item?.name || "N/A",
        Category: item.category_ID?.name || "N/A",
        Company: item.company_ID?.name || "N/A",
        Model: item.model || "N/A",
        Picture: <img src={`${BaseUrl}/${item.picture}`} alt="item" style={{ width: 50, height: 50 }} />,
        Actions: (
          <>
            <div className='flex gap-1'>
              {!hasQuantity ? (
                <Tooltip title='Edit'>
                  <div className='space-x-[5px] '>
                    <button className='text-xl hover:text-slate-600 ' onClick={() => { handleChangeEdit(item) }}>
                      <MdEdit />
                    </button>
                  </div>
                </Tooltip>
              ) : (
                <span className='text-gray-600 font-semibold'>Added</span>
              )}

            </div>
          </>
        ),
      };
    }),
    [productData, formData.quantities]
  );

  const [columns] = useState([
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
  const handleSave = () => {
    setFormData((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [productId]: quantity
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
      accessorKey: 'Quantity',
      header: locales.labels.quantityDemanded,
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
    return productData
      .filter((item) => formData.quantities[item._id] !== undefined)
      .map((item) => {
        return {
          Name: item?.name || "N/A",
          Category: item.category_ID?.name || "N/A",
          Company: item.company_ID?.name || "N/A",
          Model: item.model || "N/A",
          Picture: <img src={`${BaseUrl}/${item.picture}`} alt="item" style={{ width: 50, height: 50 }} />,
          Quantity: formData.quantities[item._id] || "N/A",
          Actions: (
            <>
              <div className='flex gap-1'>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          ),
        };
      });
  }, [productData, formData.quantities]);


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
                  <h1 className="text-xl font-semibold text-gray-900">Demand For UAAR Store </h1>
                  <div className="flex items-center justify-center mt-2">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${step >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}>
                        1
                      </div>
                      <span className={`mt-1 text-xs ${step >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                        Demand Details
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
                        Select Products
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
                      <div> <MaterialReactTable table={table} /></div>
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
                    <Dialog open={isDialogOpen} close={handleClose}>
                      <DialogTitle  >Enter Quantity</DialogTitle>
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          label="Quantity"
                          type="number"
                          fullWidth
                          value={quantity}
                          onChange={(e) => {
                            const num = parseInt(e.target.value);
                            setQuantity(isNaN(num) ? "" : Math.max(1, num));
                          }}
                          inputProps={{
                            min: 1,
                            onKeyDown: (e) => {
                              // Block -, e, E, +, . and arrow keys beyond min/max
                              if (['e', 'E', '-', '+', '.'].includes(e.key)) {
                                e.preventDefault();
                              }
                            },
                            // Mobile optimization
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                          onBlur={() => !quantity && setQuantity(1)}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color='error'>Cancel</Button>
                        <Button onClick={handleSave} >Save</Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                )}
                {step === 3 && (
                  <div className="bg-white p-8 rounded-lg shadow-md w-3/4 mx-auto mt-5">
                    <div className="mb-4">
                      <p><strong>Generated By:</strong> {formData.userName}</p>
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
      {demandData.items && demandData.items.length > 0 && (
        <div style={{ display: 'none' }}>
          <Print ref={printableRef} data={demandData} name="Demand" subject="Demand for Products" dateAndTime="createdAt" />
        </div>
      )}


    </>
  );
};

export default CreateDemand;
