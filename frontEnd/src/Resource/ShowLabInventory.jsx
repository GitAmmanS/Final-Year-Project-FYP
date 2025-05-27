import React, { useEffect, useMemo, useState } from "react";
import { BaseUrl } from "../utils/BaseUrl";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { IoIosInformationCircle } from "react-icons/io";
import { Tooltip } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import Loading from 'react-loading'
import { FaCircleArrowLeft } from 'react-icons/fa6';

const ShowLabInventory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state;
    const [Loader, setLoader] = useState(false);
    const [inventory, setInventory] = useState([]);
    useEffect(() => {
        setLoader(true);
        axios.get(`${BaseUrl}/productstore/${id._id}`)
            .then((response) => {
                const allItems = response.data.data.flatMap(store => store.items || []);
                setInventory(allItems);
                console.log(allItems);
            })
            .catch((error) => {
                console.error("Error fetching inventory:", error);
            })
            .finally(() => {
                setLoader(false);
            });

    }, [id]);

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
        !Loader ? (
            <>
                <div className="flex mt-4">
                    <p onClick={() => navigate(-1)} className="cursor-pointer hover:text-green-700 transition text-black px-4 pt-2 text-xl">
                        <FaCircleArrowLeft />
                    </p>
                    <h2 className="text-2xl font-semibold mt-1 ">{id.number}</h2>
                </div>
                <div className="container mx-auto p-6 mt-0">
                    <MaterialReactTable table={table} />
                </div>
            </>

        ) : (
            <div className="loading-container flex justify-center items-center min-h-60 min-w-60">
                <Loading type="spin" color="#2C6B38" />
            </div>
        )
    );
};

export default ShowLabInventory;
