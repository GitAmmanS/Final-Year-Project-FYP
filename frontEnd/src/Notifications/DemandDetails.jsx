import React, { useState ,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { BaseUrl } from '../BaseUrl';
import axios from 'axios'
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField
} from '@mui/material';

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

 const DemandDetails = () => {
  const location = useLocation();
  const {demandNumber} = location.state;
  const [demand,setDemand] = useState();
  const [storeItems,setStoreItems] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [StoreQuantity, setStoreQuantity] = useState(1);
  const [editId, setEditId] = useState(null);
  const [demandId, setDemandId] = useState(null);
  const handleClose = () => {
    setOpenEdit(false);
    setEditId(null);
    setStoreQuantity(1)
  };
  const handleEditQuantity = () => {
    if(editId){
      axios.put((`${BaseUrl}/demand/put`),{StoreQuantity,editId,demandId}).then((response)=>{
        console.log(response.data.success)
        if(response.data.success){
          alert("Product Allocated")
          handleClose();
        }
      }).catch((error)=>{
        console.log(error.message)
        alert("Error in Allocating")
        
      })
    }
  }
  useEffect(()=>{
    axios.get((`${BaseUrl}/demand/getById/${demandNumber}`)).then((res)=>{
      setDemand(res.data.data)
      setDemandId(res.data.data._id);
    }).catch((error)=>{
      console.log(error.message);
    })
  },[demandNumber])
  useEffect(()=>{
    axios.get((`${BaseUrl}/store`)).then((res)=>{
      setStoreItems(res.data.data)
    }).catch((error)=>{
      console.log(error.message);
    })
  },[])
  const getAvailableQuantity = (productId) => {
    const productInStore = storeItems?.find((storeItem) => {
      return storeItem.product_ID._id === productId;
    });
    return productInStore ? productInStore.quantity : 'Not Available';
  };
  
  return (
    <div className="p-4 bg-blue-50 rounded-lg shadow-lg mt-4">
      <h3 className="font-bold text-lg text-gray-800">{`Demand Number: ${demandNumber}`}</h3>
      <div className="flex flex-row ">
      <div className="text-gray-600 mt-2">
  <table className="w-full border-collapse border border-gray-300 mb-4">
    <thead>
      <tr className="bg-gray-100">
        <th className="border border-gray-300 px-4 py-2">Product Name</th>
        <th className="border border-gray-300 px-4 py-2">Category</th>
        <th className="border border-gray-300 px-4 py-2">Company</th>
        <th className="border border-gray-300 px-4 py-2">Model</th>
        <th className="border border-gray-300 px-4 py-2">Specs</th>
        <th className="border border-gray-300 px-4 py-2">Demaded Quantity</th>
        <th className="border border-gray-300 px-4 py-2">Available Quantity</th>
        <th className="border border-gray-300 px-4 py-2">Status</th>
        <th className="border border-gray-300 px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {demand?.items?.map((product, index) => (
        <tr key={index} className="hover:bg-gray-50 text-sm">
          <td className="border border-gray-300 px-4 py-2">{product.product_Id.name}</td>
          <td className="border border-gray-300 px-4 py-2">{product.product_Id.category_ID.name}</td>
          <td className="border border-gray-300 px-4 py-2">{product.product_Id.company_ID.name}</td>
          <td className="border border-gray-300 px-4 py-2">{product.product_Id.model}</td>
          <td className="border border-gray-300 px-4 py-2 ">
          {Object.entries(product.product_Id.specs)
  .filter(([_, value]) => value !== null) 
  .map(([key, value]) => `${key}: ${value}`)
  .join(", ")}

          </td>
          <td className="border border-gray-300 px-4 py-2">{product.quantityDemanded}</td>
          <td className="border border-gray-300 px-4 py-2">
                    {getAvailableQuantity(product.product_Id._id)}
                  </td>
          <td className="border border-gray-300 px-4 py-2">{product.status}</td>
          {product.status==="pending" &&(
          <td className="border border-gray-300 px-4 py-2"><button className='text-green-950 hover:text-green-700 cursor-pointer' onClick={()=>{
            setOpenEdit(!openEdit);
            setEditId(product.product_Id);
            }} >Allocate</button></td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>
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
