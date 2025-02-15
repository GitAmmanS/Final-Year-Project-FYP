import React, {useEffect, useState, useRef ,useMemo} from 'react';
import { BaseUrl } from '../utils/BaseUrl';
import Print from '../Prints/Print';
import jsPDF from 'jspdf';
import axios from 'axios';
import Loader from '../../src/Loading/loading'
import Swal from 'sweetalert2'
import Tooltip from '@mui/material/Tooltip';
import { MdEdit } from 'react-icons/md';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Dialog,DialogActions,DialogContent,DialogContentText,TextField,Button,DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const CreateDemand = () => {
  const printableRef = useRef();
  const navigate= useNavigate();
  const [loader, setLoader] = useState(false);
  const [step, setStep] = useState(1);
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user? user.name:'';
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
},[productData])


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
    if (step === 2 && (!formData.quantities)) {

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
    if ( formData.quantities === null) {
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
                        ):(
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
          Quantity: formData.quantities[item._id]||"N/A",
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
            <Loader type="balls" color="#2C6B38" />
          </div>) :
            (
              <>
                {step === 1 && (
                  <div className="bg-white p-8 rounded-lg shadow-md w-3/4 mx-auto mt-5">
                    <div className="flex justify-between mb-6">
                      <h1 className="text-xl font-semibold text-gray-900">Demand From Main Store </h1>
                    </div>
                    <h2 className="text-base text-gray-700 mb-4">Step 1: Demand Details</h2>
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
                    <h2 className="text-base text-gray-700 mb-4">Step 2: Select Products</h2>
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
                          onChange={(e) => setQuantity(e.target.value)}
                          inputProps={{ min: 1 }}
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
      <h2 className="text-base text-gray-700 mb-4">Step 3: Review and Submit</h2>
      <div className="mb-4">
        <p><strong>Generated By:</strong> {formData.userName}</p>
        <p><strong>Description:</strong> {formData.description}</p>
      </div>
      <div className="w-full">
        <MaterialReactTable
          columns={columns2}
          data={selectedProducts}
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
