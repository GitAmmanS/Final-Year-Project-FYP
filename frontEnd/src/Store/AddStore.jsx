import React, { useState } from 'react'
import { FaCircleArrowLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { Second } from '../StoreDemands/DemandForm'
import { BaseUrl } from '../utils/BaseUrl'
import axios from 'axios'
import Swal from 'sweetalert2'
const AddStore = () => {
  const navigate = useNavigate();
  const [products,setProducts] = useState([]);
  const [count,setCount] = useState(0);
  const handleAdd =()=>{
    axios.post((`${BaseUrl}/store/post`),products).then((response)=>{
      const newCount =response.data.count
     setCount(newCount);
      handleAlert(newCount);
    }).catch((error)=>{
      console.log(error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Some thing Wrong",
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });
    })
  }
  const handleAlert =(newCount)=>{
  if(newCount>0){
    Swal.fire({
    position: "center",
    icon: "success",
    title: `${newCount} Products Added to Store`,
    showConfirmButton: true,
    timer: 2000,
    width: "380px",
    height: "20px"
  });
  navigate('/store');
  }
 
  else{
     Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Product Already exits in store room",
            width: "380px",
            height: "20px",
            customClass: {
              confirmButton: "bg-[#22C55E] text-white",
            },
          });
  }}
  return (
    <>
    <div className="text-xl font-semibold mt-5 ml-2 flex gap-2 items-center">
        <p
          onClick={() => navigate('/store')}
          className="cursor-pointer hover:text-green-700 transition text-black"
        >
          <FaCircleArrowLeft />
        </p>
        <h1 className="uppercase text-gray-800">Add Product</h1>
      </div>
      <div className='mt-5'>
        <Second
         onSelectProducts={(selectedProducts) => {
          console.log('selectedProducts', selectedProducts);
          setProducts(selectedProducts);
        }}/>
        <div className='mt-4 mr-4 text-base'>
        <button className='bg-green-500 rounded-lg float-right w-20 h-10 hover:bg-green-400 hover:transition-all'
        onClick={handleAdd}>Add +</button>
        </div>
      </div>
      </>
  )
}

export default AddStore