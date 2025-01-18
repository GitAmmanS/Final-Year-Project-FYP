import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Button, TextField
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { BaseUrl } from '../BaseUrl';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import Loading from '../Loading/loading';
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

const Store = () => {
    const [Loader, setLoader] = useState(false);
    const [storeData, setStoreData] = useState([]);
    const [StoreQuantity, setStoreQuantity] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storeResponse = await axios.get(`${BaseUrl}/store`);
                setStoreData(storeResponse.data.data);
            } catch (err) {
                console.error(locales.messages.errorMessage, err);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        if (storeData.length > 0) {
            setLoader(true);
        }
    }, [storeData]);
    useEffect(() => {
        
    }, [localStorage.getItem("language")]);

    const handleEdit = (item) => {
        setEditId(item._id);
        setOpenEdit(true);
    };

    const handleClose = () => {
        setOpenEdit(false);
        setEditId(null);
      };

      const handleEditQuantity = () => {
        const url = `${BaseUrl}/store/update/${editId}`;
        axios
          .put(url, { quantity: StoreQuantity})
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
            Status: item.status || "N/A",
            Picture: <img src={`${BaseUrl}/${item.product_ID.picture}`} alt="item" style={{ width: 50, height: 50 }} />,
            Actions: (
                <div className='space-x-[5px] '>
                    <button className='text-xl hover:text-slate-600' onClick={() => { handleEdit(item) }}><MdEdit /></button>
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
    const handleAddStore =()=>{
        navigate('/store/storeAdd');
    }

    return (<div className="bg-slate-50 h-sceen mt-2 ">
        <div className='flex  justify-between'>
            <p className='text-xl font-semibold mt-5 ml-2 flex gap-2 items-center'>{locales.labels.StoreItems}</p>
            <button className=' text-sm px-2 text-center border-[2px] bg-white h-10  border-black hover:bg-[#5eb05b] hover:border-[#5eb05b] hover:text-white hover:transition-all rounded-2xl  'onClick={handleAddStore} >Add Item +</button>
        </div>
        {
            Loader ?
                <div className='flex flex-col w-full'>
                    <div> <MaterialReactTable table={table} /></div>
                </div> :
                <div className="loading-container flex justify-center items-center min-h-60 min-w-60">
                    <Loading type="spin" color="#2C6B38" />
                </div>
        }
        <Dialog open={openEdit} onClose={handleClose}>
            <DialogTitle>Add Quantity</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please Enter Quantity 
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
                <Button color='error' onClick={handleClose}>Cancel</Button>
                <Button onClick={handleEditQuantity}>Add </Button>
            </DialogActions>
        </Dialog>
    </div>

    );
}

export default Store
