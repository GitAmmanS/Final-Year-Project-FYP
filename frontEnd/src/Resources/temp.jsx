import React, { useEffect, useState, useMemo } from 'react'
import { RiAddCircleLine } from "react-icons/ri";
import { BaseUrl } from '../BaseUrl';
import Loading from '../Loading/loading';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { QRCodeSVG } from 'qrcode.react';
import { FaSearchPlus } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import axios from 'axios'

const temp = () => {
  const [labsData, setLabsData] = useState([]);
  const [labsItems, setLabsItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [Loader, setLoader] = useState(true);
  const [SelectedlabName, setSelectedLabName] = useState('');
  const [labName, setLabName] = useState('');
  const [labIncharge, setLabIncharge] = useState('');
  const [labLocation, setLabLocation] = useState('');
  useEffect(() => {
    axios.get(`${BaseUrl}/lab`).then((response) => {
      setLabsData(response.data.data);
      console.log(response.data.data)
    }).catch((error) => {
      console.error(error)
    })
  }, []);
  const openDialog = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
    setLabName('');
    setLabIncharge('');
    setLabLocation('');
  }
  const handleAddLabs = async () => {
    try {
      const response = await axios.post(`${BaseUrl}/lab/post`, {
        labName,
        labLocation,
        labIncharge
      });
      console.log(response.data);
      setLabsData((prevLabs) => [...prevLabs, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error adding lab:', error);
    }
  }
  const LabTable = async (Lab) => {
    setSelectedLabName(Lab.name);
    try {
      setLoader(false);
      const response = await axios.get(`${BaseUrl}/items/${Lab._id}`);
      response.data.data &&(setLoader(true));
      console.log(response.data);
      setLabsItems(response.data.data);
    } catch (error) {
      console.error('Error adding lab:', error);
    }
  }
  const transformedData = useMemo(() =>
    labsItems.map(item => ({
      Picture: <img src={`${BaseUrl}/${item.picture}`} alt="item" style={{ width: 50, height: 50 }} />,
      Name: item.name || "N/A",
      Category: item.category_ID?.name || "N/A",
      Company: item.company_ID?.name || "N/A",
      Quantity: item.quantity || 0,
      Serial_Number: item.serialNumber || "N/A",
      Status: item.status_ID?.name || "N/A",
      QR_Code: <QRCodeSVG value={item.qrCode || "N/A"} size={50} />,
    })),
    [labsItems]
  );



  const [columns] = useState([
    {
      accessorKey: 'Picture',
      header: 'Picture',
      size: 100,
    },
    {
      accessorKey: 'Name',
      header: 'Name',
      size: 100,
    },
    {
      accessorKey: 'Category',
      header: 'Category',
      size: 100,
    },
    {
      accessorKey: 'Company',
      header: 'Company',
      size: 100,
    },
    {
      accessorKey: 'Quantity',
      header: 'Quantity',
      size: 100,
    },
    {
      accessorKey: 'Serial_Number',
      header: 'Serial Number',
      size: 100,
    },
    {
      accessorKey: 'Status',
      header: 'Status',
      size: 100,
    },
    {
      accessorKey: 'QR_Code',
      header: 'QR Code',
      size: 100,
    }
  ]);
  const table = useMaterialReactTable({
    columns,
    data: transformedData,
  });
  return (
    <div className=''>
      <div className='flex ml-3 m-1 justify-normal'>
        <h2 className='text-2xl font-semibold '>Available Labs</h2>
        <p className='pl-2 text-3xl font-bold gap-2 cursor-pointer' onClick={openDialog}><RiAddCircleLine /></p>
      </div>
      <div className='flex flex-wrap justify-between m-6 space-y-1'>
        {labsData.map((data, index) => (
          <button key={index} className='border-2 border-black w-[200px] h-[80px] hover:bg-[#5DB963] hover:text-white hover:font-bold hover:transition-all rounded-md text-[25px] bg-[#AFD0AE] ' onClick={() => LabTable(data)}>{data.name}</button>
        ))
        }
      </div>
      <h2 className='text-2xl font-semibold ml-3 mt-8 '> {SelectedlabName} Allocated Items List</h2>
      {
        Loader ?
          <div >
            <div className='flex flex-col w-full'>
              <div> <MaterialReactTable table={table} /></div>
            </div>
          </div> :
          <div className="loading-container flex justify-center items-center min-h-60 min-w-60">
            <Loading type="spin" color="#3498db" />
          </div>
      }

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Lab</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Enter Lab Name"
            value={labName}
            onChange={(e) => { setLabName(e.target.value) }}
            fullWidth
          />
          <TextField
            margin="dense"
            name="location"
            label="Enter Lab Location"
            value={labLocation}
            onChange={(e) => { setLabLocation(e.target.value) }}
            fullWidth
          />
          <TextField
            margin="dense"
            name="Incharge"
            label="Enter Lab Incharge"
            value={labIncharge}
            onChange={(e) => { setLabIncharge(e.target.value) }}
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

export default temp