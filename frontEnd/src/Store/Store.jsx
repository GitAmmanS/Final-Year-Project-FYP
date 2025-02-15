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
import Loading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import { MdOutlineManageHistory } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
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
    }, [storeData]);
    useEffect(() => {
        if (storeData.length > 0) {
            setLoader(true);
        }
    }, [storeData]);
    useEffect(() => {

    }, [localStorage.getItem("language")]);

    const itemsHistory = (item) => {
        navigate('/store/storeItemsHistory', { state: { item } })
    }
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
                    <Tooltip title="History">
                    <button className='text-xl hover:text-slate-600' onClick={() => { itemsHistory(item) }}><MdOutlineManageHistory /></button>
                    </Tooltip>
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
        <div className='flex  justify-between mt-5'>
            <p className='text-2xl font-semibold mt-5 ml-2 flex gap-2 items-center'>{locales.labels.StoreItems}</p>
        </div>
        {
            Loader ?
                <div className='flex flex-col w-full mt-3'>
                    <div> <MaterialReactTable table={table} /></div>
                </div> :
                <div className="loading-container flex justify-center items-center min-h-60 min-w-60">
                    <Loading type="spin" color="#2C6B38" />
                </div>
        }
    </div>

    );
}

export default Store
