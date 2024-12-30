import React, { useEffect, useState } from 'react'
import { RiAddCircleLine } from "react-icons/ri";
import { BaseUrl } from '../BaseUrl';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import axios from 'axios'
import { response } from 'express';
const LabResource = () => {
  const[labsData,setLabsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [labName,setLabName] = useState('');
  const [labIncharge,setLabIncharge]= useState('');
  const [labLocation,setLabLocation] = useState('');
  useEffect(()=>{
    axios.get(`${BaseUrl}/lab`).then((response)=>{
      setLabsData(response.data.data);
      console.log(response.data.data)
    }).catch((error)=>{
      console.error(error)
    })
},[]);
  const openDialog =()=>{
    setOpen(true);
  }
  const handleClose =()=>{
    setOpen(false);
    setLabName('');
    setLabIncharge('');
    setLabLocation('');
  }
 const handleAddLabs = async()=>{
  try{
    const response = await axios.post(`${BaseUrl}/lab/post`,{
      labName,
      labLocation,
      labIncharge
    });
    console.log(response.data);
    setLabsData((prevLabs) => [...prevLabs, response.data]);
    handleClose();
  }catch(error){
    console.error('Error adding lab:', error);
  }
 }
  return (
    <div className=''>
      <div className='flex ml-3 m-1 justify-normal'>
      <h2 className='text-2xl font-semibold '>Available Labs</h2>
      <p className='pl-2 text-3xl font-bold gap-2 cursor-pointer' onClick={openDialog}><RiAddCircleLine /></p>
      </div>
      <div className='flex flex-wrap justify-between m-6'>
        {  labsData.map((data,index)=>(
           <button key={index} className='border-2 border-black w-20 h-10 hover:bg-slate-200 rounded-md '>{data.name}</button>
        ))
        }
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Lab</DialogTitle>
          <DialogContent>
            <TextField
            margin="dense"
            name="name"
            label="Enter Lab Name"
            value={labName}
            onChange={(e)=>{setLabName(e.target.value)}}
            fullWidth
          />
          <TextField
            margin="dense"
            name="location"
            label="Enter Lab Location"
            value={labLocation}
            onChange={(e)=>{setLabLocation(e.target.value)}}
            fullWidth
          />
          <TextField
            margin="dense"
            name="Incharge"
            label="Enter Lab Incharge"
            value={labIncharge}
            onChange={(e)=>{setLabIncharge(e.target.value)}}
            fullWidth
          />
          </DialogContent>
          <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddLabs}>Add</Button>
          </DialogActions>
      </Dialog>
    </div>
  )
}

export default LabResource