import React, { useEffect, useState } from 'react';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { BaseUrl } from '../BaseUrl';

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
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'company', headerName: 'Company', width: 150 },
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
      alert('Please select a product.');
      return;
    }
    if (!quantity || !status) {
      alert('Please fill in all fields.');
      return;
    }
    try{
    const response =await axios.post(`${BaseUrl}/store/post`,{selectedProductId,quantity,status});
    console.log(response);
    setSelectedProductId(null);
    setQuantity('');
    setStatus('');
   if(response.data.success){
    alert(response.data.message);
   }
   else{
    alert(response.data.message)
   }
    }
    catch(error){
        console.log("error",error.message);
        alert('Error in Submitting')
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
       
        <div className="mt-4 w-[40%] h-[50%] border-2 border-black p-4">
          <form onSubmit={handleStoreSubmit}>
            <input
              className="mt-3 w-80 block p-2 bg-gray-100 rounded-xl border-2 border-gray-700"
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
        <div  style={{ height: 400, width: '100%' }}>
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
