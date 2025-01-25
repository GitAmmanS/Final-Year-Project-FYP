import React, { useEffect, useState } from 'react';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { BaseUrl } from '../utils/BaseUrl';
import Swal from 'sweetalert2'

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

const AddStore = () => {
  const [productData, setProductData] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null); 
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/product`);
        setProductData(response.data.data || []); 
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    getProduct();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'category', headerName: 'Category', width: 100 },
    { field: 'company', headerName: 'Company', width: 100 },
    {
      field: 'picture',
      headerName: 'Picture',
      width: 250,
      renderCell: (params) => (
        <img
          src={`${BaseUrl}/${params.value}`}
          alt="product"
          style={{ height: '50px',width:'60px', objectFit: 'contain' }}
        />
      ),
    },
    { field: 'model', headerName: 'Model', width: 150 },
  ];

  const rows = productData.map((product, index) => ({
    id: product._id || index, 
    name: product.name,
    category: product.category_ID?.name || 'N/A',
    company: product.company_ID?.name || 'N/A',
    picture: product.picture,
    model: product.model,
  }));

  const handleSelectionChange = (selectionModel) => {
    if (selectionModel.length > 0) {
      setSelectedProductId(selectionModel[0]);
    } else {
      setSelectedProductId(null); 
    }
  };

  const handleStoreSubmit = async(e) => {
    e.preventDefault();
    if (!selectedProductId) {
      Swal.fire({
        icon: "info",
        title: "Please Select Products",
        width: "380px",
        height: "20px"
    });
      return;
    }
    if (!quantity || !status) {
      Swal.fire({
        icon: "info",
        title: "Please Fill in All Fields",
        width: "380px",
        height: "20px"
    });
      return;
    }
    try{
    const response =await axios.post(`${BaseUrl}/store/post`,{selectedProductId,quantity,status});
    console.log(response);
    setSelectedProductId(null);
    setQuantity('');
    setStatus('');
   if(response.data.success){
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: response.data.message,
      showConfirmButton: false,
      timer: 2000,
      width: "380px",
      height: "20px"
  });
   }
   else{
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: response.data.message,
      width: "380px",
      height: "20px"
  });
   }
    }
    catch(error){
        console.log("error",error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error In Submitting",
          width: "380px",
          height: "20px",
          customClass: {
              confirmButton: "bg-[#22C55E] text-white",
            },
      });
    }

  };

  return (
    <>
      <div className="text-xl font-semibold mt-5 ml-2 flex gap-2 items-center">
        <p
          onClick={() => navigate('/store')}
          className="cursor-pointer hover:text-green-700 transition text-black"
        >
          <FaCircleArrowLeft />
        </p>
        <h1 className="uppercase text-gray-800">Add Store Item</h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
       
        <div className=" w-[40%] h-[50%] p-4 ">
          <form onSubmit={handleStoreSubmit} className='flex  gap-x-3 text-sm'>
            <input
              className="mt-3 w-80 block px-2 bg-gray-100 rounded-xl border-2 border-gray-700"
              type="number"
              min="1"
              placeholder="Quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <select
              className="mt-3 w-80 block p-2 bg-gray-100 rounded-xl border-2 border-gray-700"
              value={status}
              name="status"
              id="status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="New">New</option>
              <option value="Old">Old</option>
              <option value="Damaged">Damaged</option>
            </select>
            <button
              type="submit"
              className="mt-4 bg-green-700 text-white p-2 rounded-xl hover:bg-green-800"
            >
              Submit
            </button>
          </form>
        </div>
        <div className='mt-5'>
        <p className='text-center text-lg text-gray-800 font-bold'>Select Product</p>
        <div  style={{ height: 400, width: '90%' }}>
            <DataGrid
                     rows={rows}
                     columns={columns}
                     pageSize={5}
                     rowsPerPageOptions={[5, 10]}
                     checkboxSelection={false}
                     radioSelection
                     onRowSelectionModelChange={(id) => handleSelectionChange(id)}
                     sx={{
                         '& .MuiDataGrid-row.Mui-selected': {
                           backgroundColor: '#e3f2fd', 
                           color: '#2e7d32', 
                           font:'bolder',
                           '&:hover': {
                             backgroundColor: '#bbdefb', 
                             cursor:'pointer',
                           },
                         },
                       }}
                   />
        </div>
        </div>
      </div>
    </>
  );
};

export default AddStore;
