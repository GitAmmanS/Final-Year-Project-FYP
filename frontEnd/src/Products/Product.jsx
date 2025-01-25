import React, { useEffect, useState, useMemo } from 'react'
import { BaseUrl } from '../utils/BaseUrl'
import axios from 'axios'
import Loading from 'react-loading'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import {
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Button, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { MdEdit } from 'react-icons/md';
import AddProductDialog from './AddProductDialog';
import { IoIosInformationCircle } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
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

const Product = () => {
    const navigate = useNavigate();
    const [productData, getProductData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const [isCategory, setIsCategory] = useState(false);
    const [categoryOrCompanyName, setCategoryOrCompanyName] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemData,setItem] = useState();
  const handleOpenDialog = () => {
    setDialogOpen(true);
    setItem(null);
  };
  const handleEditDialog = (item) => {
    setItem(item);
    setDialogOpen(true);
    // console.log(item)
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
    useEffect(() => {
        const getProduct = async () => {
            axios.get(`${BaseUrl}/product`).then((response) => {
                getProductData(response.data.data);
            })
        }
        getProduct();
    },[productData])
    useEffect(() => {
        if (productData.length > 0) {
            setLoader(true);
        }
    }, [productData]);
    const handleMoreInfo = (item) => {
        navigate('/product/moreInfo', { state: { item } });
    };
    const transformedData = useMemo(() =>
        productData.map(item => ({
            Name: item?.name || "N/A",
            Category: item.category_ID?.name || "N/A",
            Company: item.company_ID?.name || "N/A",
            Model: item.model || "N/A",
            Picture: <img src={`${BaseUrl}/${item.picture}`} alt="item" style={{ width: 50, height: 50 }} />,
            Actions: (
                <>
                <div className='flex gap-1'>
                <div className='space-x-[5px] '>
                    <button className='text-xl hover:text-slate-600 ' onClick={() => { handleEditDialog(item) }}><MdEdit /></button>
                </div>
                <div className='space-x-[5px] '>
                <button className='text-xl hover:text-slate-600 ' onClick={() => { handleMoreInfo(item) }}><IoIosInformationCircle /></button>
            </div>
            </div>
            </>
            ),
        })),
        [productData]
    );
    const [columns] = useState([
        {
            accessorKey: 'Name',
            header: locales.labels.name,
            size: 100,
        },
        {
            accessorKey: 'Category',
            header: locales.labels.category,
            size: 100,
        },
        {
            accessorKey: 'Company',
            header: locales.labels.company,
            size: 100,
        },
        {
            accessorKey: 'Model',
            header: locales.labels.model,
            size: 100,
        },
        {
            accessorKey: 'Picture',
            header: locales.labels.picture,
            size: 100,
        },
        {
            accessorKey: 'Actions',
            header: locales.labels.actions,
            size: 100,
        }
    ]);
    const table = useMaterialReactTable({
        columns,
        data: transformedData,
    });
    const handleCategory = () => {
        setIsCategory(true);
        setOpen(true);
    }
    const handleCompany = () => {
        setIsCategory(false);
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setCategoryOrCompanyName('');
    }

    const handleAddCategoryOrCompany = async () => {
        if (isCategory) {
            axios.post(`${BaseUrl}/category/post`, { name: categoryOrCompanyName }).then((response) => {
                console.log(response);
            })
        }
        else {
            axios.post(`${BaseUrl}/company/post`, { name: categoryOrCompanyName }).then((response) => {
                console.log(response);
            })
        }
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Added Sucessfully",
            showConfirmButton: false,
            timer: 2000,
            width:"380px",
            height:"20px"
          });

        setOpen(false);
        setCategoryOrCompanyName('');
    }
    return (
        <div className="bg-slate-50 h-sceen mt-2 ">
            <div className='flex p-2 text-2xl mt-4 text-black justify-between'>
                <p className='text-center font-bold cursor-pointer'>{locales.sidemenu.product}</p>
                <div className='bg-none text-base space-x-[10px] '>
                    <button className="text-sm  border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md  transition-all hover:bg-gray-200" onClick={handleOpenDialog}>{locales.buttons.addProduct}</button>
                    <AddProductDialog open={dialogOpen} onClose={handleCloseDialog} product={itemData}/>
                    <button className='text-sm  border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md  transition-all hover:bg-gray-200' onClick={handleCategory}>{locales.buttons.addCategory}</button>
                    <button className='text-sm  border border-gray-300 w-28 h-10 text-center p-2 rounded-lg shadow-md  transition-all hover:bg-gray-200' onClick={handleCompany}>{locales.buttons.addCompany}</button>
                </div>
            </div>
            {
                loader ?
                    <div className='flex flex-col w-full'>
                        <div> <MaterialReactTable table={table} /></div>
                    </div> :
                    <div className="loading-container flex justify-center items-center min-h-60 min-w-60">
                        <Loading type="spin" color="#2C6B38" />
                    </div>
            }
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>{locales.labels.add}{isCategory ? locales.labels.category : locales.labels.company}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{locales.labels.Enter} {isCategory ?locales.labels.category : locales.labels.company} {locales.labels.name}</DialogContentText>
                    <TextField
                        margin="dense"
                        name="categoryOrCompanyName"
                        label='Name'
                        value={categoryOrCompanyName}
                        onChange={(e) => setCategoryOrCompanyName(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={handleClose}>{locales.buttons.cancel}</Button>
                    <Button onClick={handleAddCategoryOrCompany}>{locales.buttons.add}</Button>
                </DialogActions>
            </Dialog>
           
        </div>

    )
}

export default Product