import React, { useEffect, useMemo, useState } from "react";
import { BaseUrl } from "../utils/BaseUrl";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosInformationCircle } from "react-icons/io";
import { Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table"; 

const LabInventory = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user._id : "";
    console.log(userId);
    const [inventory, setInventory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${BaseUrl}/productstore/getByUserId/${userId}`)
            .then((response) => {
                console.log(response.data)
                const allItems = response.data.data.flatMap((store) => store.items || []);
                setInventory(allItems);
            })
            .catch((error) => {
                console.error("Error fetching inventory:", error);
            });
    }, [userId]);

    const handleMoreInfo = (item) => {
        navigate("/product/moreInfo", { state: { item } });
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

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Lab Inventory</h2>
            <MaterialReactTable columns={columns} data={transformedData} />
        </div>
    );
};

export default LabInventory;
