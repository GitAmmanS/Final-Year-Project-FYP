import React, { useState, useEffect, useMemo, useRef } from 'react';
import PrintRecieving from '../Prints/PrintRecieving';
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Button, TextField
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { BaseUrl } from '../utils/BaseUrl';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import Loading from '../Loading/loading';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';

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
    const [storeUpdatedData,setStoreUpdatedData] = useState([]);
    const navigate = useNavigate();
    const timestamp = Date.now();
const readableDate = new Date(timestamp).toLocaleDateString(); 
      const printableRef = useRef();

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
      const printNotification =()=>{
        console.log(storeUpdatedData)
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 ml-4 rounded shadow", 
              cancelButton: "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded shadow",
            },
            
            buttonsStyling: false
          });
          swalWithBootstrapButtons.fire({
            title: "Print Recieving?",
            text: "Are you sure to print this",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              const doc = new jsPDF();
              const content = printableRef.current;
              if (content) {
                doc.html(content, {
                  callback: function (doc) {
                    const pdfOutput = doc.output('blob');
                    const pdfUrl = URL.createObjectURL(pdfOutput);
                    window.open(pdfUrl, '_blank');
                  }
                });
              }
            }
          });
      }
      const handleEditQuantity = () => {
        const url = `${BaseUrl}/store/update/${editId}`;
        axios
          .put(url, { quantity: StoreQuantity})
          .then((res) => {
            console.log("Response Data:", res.data)
            if (res.data && res.data.data) {
                setStoreUpdatedData([res.data.data]);  
                printNotification();
            handleClose();
              }
          
           
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to Update the Quantity",
                width: "380px",
                height: "20px",
                customClass: {
                    confirmButton: "bg-[#22C55E] text-white",
                  },
            }); 
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
            <button className='text-sm  border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md  transition-all hover:bg-gray-200 'onClick={handleAddStore} >Add Item +</button>
        </div>
        {
            Loader ?
                <div className='flex flex-col w-full mt-3'>
                    <div> <MaterialReactTable table={table} /></div>
                </div> :
                <div className="mt-12 loading-container flex justify-center items-center ">
                    <Loading type="spin" color="#2C6B38" />
                </div>
        }
        <Dialog open={openEdit} onClose={handleClose}>
            <DialogTitle> Item Entry</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please Enter Recieving 
                </DialogContentText>
                <TextField
                    margin="dense"
                    name="date"
                    label="Date"
                    value={readableDate}
                    readOnly
                    fullWidth
                />
                <TextField
                    margin="dense"
                    name="Quantity"
                    label="Quantity Recieved"
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
        
        { storeUpdatedData && (
        <div style={{ display: 'none' }}>
              <PrintRecieving ref={printableRef} data={storeUpdatedData} quantityRecieved={StoreQuantity} name="Entry" subject="Items for Store" />
            </div>)
}
    </div>

    );
}

export default Store
