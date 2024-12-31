import React, { useEffect, useState, useMemo } from 'react';
import { RiAddCircleLine } from 'react-icons/ri';
import { BaseUrl } from '../BaseUrl';
import Loading from '../Loading/loading';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const ResourceModule = ({ apiEndpoint, title, dialogTitle }) => {
  const [data, setData] = useState([]); // all labs in it
  const [items, setItems] = useState([]); //all items present in labs
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(true);
  const [selectedName, setSelectedName] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [incharge, setIncharge] = useState('');

  useEffect(() => {
    axios.get(`${BaseUrl}/${apiEndpoint}`).then((response) => {
      setData(response.data.data);
    }).catch((error) => {
      console.error(error);
    });
  }, [apiEndpoint]);

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setLocation('');
    setIncharge('');
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(`${BaseUrl}/${apiEndpoint}/post`, {
        name,
        location,
        incharge,
      });
      setData((prevData) => [...prevData, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleItemClick = async (item) => {
    setSelectedName(item.name);
    try {
      setLoader(false);
      const response = await axios.get(`${BaseUrl}/items/${apiEndpoint}/${item._id}`);
      setLoader(true);
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const transformedData = useMemo(
    () =>
      items.map((item) => ({
        Picture: <img src={`${BaseUrl}/${item.picture}`} alt="item" style={{ width: 50, height: 50 }} />,
        Name: item.name || 'N/A',
        Category: item.category_ID?.name || 'N/A',
        Company: item.company_ID?.name || 'N/A',
        Quantity: item.quantity || 0,
        Serial_Number: item.serialNumber || 'N/A',
        Status: item.status_ID?.name || 'N/A',
        QR_Code: <QRCodeSVG value={item.qrCode || 'N/A'} size={50} />,
      })),
    [items]
  );

  const [columns] = useState([
    { accessorKey: 'Picture', header: 'Picture', size: 100 },
    { accessorKey: 'Name', header: 'Name', size: 100 },
    { accessorKey: 'Category', header: 'Category', size: 100 },
    { accessorKey: 'Company', header: 'Company', size: 100 },
    { accessorKey: 'Quantity', header: 'Quantity', size: 100 },
    { accessorKey: 'Serial_Number', header: 'Serial Number', size: 100 },
    { accessorKey: 'Status', header: 'Status', size: 100 },
    { accessorKey: 'QR_Code', header: 'QR Code', size: 100 },
  ]);

  const table = useMaterialReactTable({
    columns,
    data: transformedData,
  });

  return (
    <div>
      <div className="flex ml-3 m-1 justify-normal">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="pl-2 text-3xl font-bold gap-2 cursor-pointer" onClick={openDialog}>
          <RiAddCircleLine />
        </p>
      </div>
      <div className="flex flex-wrap justify-between m-6 space-y-1">
        {data.map((item, index) => (
          <button
            key={index}
            className="border-2 border-black w-[200px] h-[80px] hover:bg-[#5DB963] hover:text-white hover:font-bold hover:transition-all rounded-md text-[25px] bg-[#AFD0AE]"
            onClick={() => handleItemClick(item)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <h2 className="text-2xl font-semibold ml-3 mt-8">{selectedName} Allocated Items List</h2>
      {loader ? (
        <div>
          <div className="flex flex-col w-full">
            <div>
              <MaterialReactTable table={table} />
            </div>
          </div>
        </div>
      ) : (
        <div className="loading-container flex justify-center items-center min-h-60 min-w-60">
          <Loading type="spin" color="#3498db" />
        </div>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            name="location"
            label="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            name="incharge"
            label="Enter Incharge"
            value={incharge}
            onChange={(e) => setIncharge(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResourceModule;
