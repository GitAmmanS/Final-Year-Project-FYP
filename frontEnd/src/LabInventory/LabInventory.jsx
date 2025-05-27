import React, { useEffect, useMemo, useState } from "react";
import { BaseUrl } from "../utils/BaseUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosInformationCircle } from "react-icons/io";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Dialog, DialogActions, DialogContent, DialogContentText, TextField, Button, DialogTitle,MenuItem } from '@mui/material';
import Loading from 'react-loading'

const LabInventory = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user ? user._id : "";
    console.log(userId);
    const [inventory, setInventory] = useState([]);
    const [LabData, setLabData] = useState([]);
    const [LabID, setLabID] = useState(null);
    const [LabName, setLabName] = useState('');
    const [Loader, setLoader] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getLabIncharges= async()=>{
            try{
                setLoader(true);
                const resp= await axios.get(`${BaseUrl}/lab/byInchargeID/${user._id}`);
                if(resp){
                    setLabData(resp.data.data);
                    setLabID(resp.data.data[0]._id);
                    setLabName(resp.data.data[0].number);
                    setLoader(false);
                }
            }
            catch(ex){
                setLoader(false);
                console.log(ex.message);
            }
        }
        getLabIncharges();
       
    }, [])
    
    useEffect(() => {
        setLoader(true);
        axios
            .get(`${BaseUrl}/productstore/${LabID}`)
            .then((response) => {
                console.log(response.data)
                const allItems = response.data.data.flatMap((store) => store.items || []);
                setInventory(allItems);
                setLoader(false);
            })
            .catch((error) => {
                setLoader(false);
                console.error("Error fetching inventory:", error);
            });
    }, [userId,LabID]);

    const handleMoreInfo = (item) => {
        navigate("/product/moreInfo", { state: { item } });
    };

    const handleChange = (event) => {
        setLabID(event.target.value);

        const selected = LabData.find(lab => lab._id === event.target.value);
        setLabName(selected?.number);
      };

    const transformedData = useMemo(
        () =>
            inventory.map((item) => ({
                Name: item.product_ID?.name || "N/A",
                Model: item.product_ID?.model || "N/A",
                SerialNumber: item.serialNumber || "N/A",
                InstallDate: item.installDate ? new Date(item.installDate).toLocaleDateString() : "N/A",
                Picture: (
                    <img src={`${BaseUrl}/${item.product_ID?.picture}`} alt="item" style={{ width: 50, height: 50 }} />
                ),
                QRCode: <img src={item.qrCode} alt="QR Code" style={{ width: 50, height: 50 }} />,
                // Actions: (
                //     <Tooltip title="Preview">
                //         <button className="text-xl hover:text-slate-600" onClick={() => handleMoreInfo(item)}>
                //             <IoIosInformationCircle />
                //         </button>
                //     </Tooltip>
                // ),
            })),
        [inventory]
    );
    const columns = useMemo(
        () => [
            { accessorKey: "Name", header: "Name", size: 100 },
            { accessorKey: "Model", header: "Model", size: 100 },
            { accessorKey: "SerialNumber", header: "Serial Number", size: 100 },
            { accessorKey: "InstallDate", header: "Install Date", size: 100 },
            { accessorKey: "Picture", header: "Picture", size: 100 },
            { accessorKey: "QRCode", header: "QR Code", size: 100 },
            // { accessorKey: "Actions", header: "Actions", size: 100 },
        ],
        []
    );
    const table = useMaterialReactTable({
        columns,
        data: transformedData,
        muiTableHeadCellProps: {
            className: "[&.MuiTableCell-head]:bg-[#1B4D3E] [&.MuiTableCell-head]:text-white",
        },
        muiTableBodyCellProps: {
            className: "[&.MuiTableCell-body]:bg-[#FAF0E6]",
        },
    });


    return (
        !Loader ?
        <>
            <h2 className="text-2xl font-semibold mt-4 mb-6 ml-2">{`Inventory (${LabName})`}</h2>
            {
                Array.isArray(LabData) && LabData.length > 1 && (
                    <div className="flex flex-col">
                        <label className="text-gray-600 mx-64">Select Location:</label>
                        <div className="mx-64">
                        <TextField
                        fullWidth
                            select
                            name="room"
                            value={LabID || ""}
                            onChange={handleChange}
                            margin="dense"
                        >
                            {
                                Array.isArray(LabData) && LabData.length > 1 &&
                                LabData.map((lab, index) => (
                                    <MenuItem value={lab._id} >{lab.number}</MenuItem>
                                ))
                            }

                        </TextField>
                        </div>
                        
                    </div>
                )
            }
            {
                 (
                    <div className="container mx-auto p-6">

                        <MaterialReactTable table={table} />
                    </div>
                ) 
            }
        </>
        : (
            <div className="loading-container flex justify-center items-center min-h-60 min-w-60">
                <Loading type="spin" color="#2C6B38" />
            </div>
        )


    );

};

export default LabInventory;
