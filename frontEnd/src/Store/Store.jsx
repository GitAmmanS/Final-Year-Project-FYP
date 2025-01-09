import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Button, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { PieChart } from '@mui/x-charts/PieChart';
import { QRCodeSVG } from 'qrcode.react';
import moment, { locale } from 'moment';
import { BaseUrl } from '../BaseUrl';
import axios from 'axios';
import { AiOutlineDelete } from "react-icons/ai";
import { FaSearchPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import locales from '../locales/en.json'
import Loading from '../Loading/loading';

const Store = () => {
    const [Loader, setLoader] = useState(false);
    const [storeData, setStoreData] = useState([]);
    const [StoreQuantity, setStoreQuantity] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storeResponse = await axios.get(`${BaseUrl}/store`);
                setStoreData(storeResponse.data.data);
                console.log(storeResponse.data.data);

            } catch (err) {
                console.error(locales.messages.errorMessage, err);
            }
        };

        fetchData();
    }, [storeData]);
    useEffect(() => {
        if (storeData.length > 0) {
            setLoader(true);
        }
    }, [storeData]);
    const handleEdit = (item) => {
        setEditId(item._id);
        setStoreQuantity(item.quantity);
        setOpenEdit(true);
    };

    const handleClose = () => {
        setOpenEdit(false);
        setEditId(null);
        setStoreQuantity('');
      };

      const handleEditQuantity = () => {
        const url = `${BaseUrl}/store/update/${editId}`;
        axios
          .put(url, { quantity: StoreQuantity })
          .then((res) => {
            console.log(res.data);
            alert('Quantity Updated Successfully'); 
            handleClose();
          })
          .catch((err) => {
            console.error(err);
            alert('Failed to update quantity. Please try again.'); 
          });
      };
      
    const transformedData = useMemo(() =>
        storeData.map(item => ({
            Name: item.product_ID?.name || "N/A",
            Category: item.product_ID.category_ID?.name || "N/A",
            Company: item.product_ID.company_ID?.name || "N/A",
            Model: item.product_ID.model || "N/A",
            Quantity: item.quantity || 0,
            Status: item.status_ID?.name || "N/A",
            Picture: <img src={`${BaseUrl}/${item.product_ID.picture}`} alt="item" style={{ width: 50, height: 50 }} />,
            Actions: (
                <div className='space-x-[5px] '>
                    <button className='text-xl hover:text-slate-600 text-red-600' onClick={() => { handleEdit(item) }}><MdEdit /></button>
                </div>
            ),
        })),
        [storeData]
    );



    const [columns] = useState([
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
            accessorKey: 'Model',
            header: 'Model',
            size: 100,
        },
        {
            accessorKey: 'Quantity',
            header: 'Quantity',
            size: 100,
        },
        {
            accessorKey: 'Status',
            header: 'Status',
            size: 100,
        },
        {
            accessorKey: 'Picture',
            header: 'Picture',
            size: 100,
        },
        {
            accessorKey: 'Actions',
            header: 'Actions',
            size: 100,
        }
    ]);
    const table = useMaterialReactTable({
        columns,
        data: transformedData,
    });
    

    return (<div className="bg-slate-50 h-sceen mt-2 ">
        <div className='flex p-2 text-2xl mt-4 text-black justify-between'>
            <p className='text-center font-bold cursor-pointer'>{locales.labels.StoreItems}</p>
        </div>
        {
            Loader ?
                <div className='flex flex-col w-full'>
                    <div> <MaterialReactTable table={table} /></div>
                </div> :
                <div className="loading-container flex justify-center items-center min-h-60 min-w-60">
                    <Loading type="spin" color="#3498db" />
                </div>
        }
        <Dialog open={openEdit} onClose={handleClose}>
            <DialogTitle>Edit Quantity</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please Enter Quantity to change
                </DialogContentText>
                <TextField
                    margin="dense"
                    name="Quantity"
                    label="Quantity"
                    value={StoreQuantity}
                    onChange={(e) => setStoreQuantity(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{locales.buttons.cancel}</Button>
                <Button onClick={handleEditQuantity}>{locales.buttons.update}</Button>
            </DialogActions>
        </Dialog>
    </div>

    );
}

export default Store
