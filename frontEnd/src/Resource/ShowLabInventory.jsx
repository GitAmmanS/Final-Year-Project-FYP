import React, { useEffect, useState } from "react";
import { BaseUrl } from "../utils/BaseUrl";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCircleArrowLeft } from "react-icons/fa6";

const ShowLabInventory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state;
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        axios.get(`${BaseUrl}/productstore/${id}`)
            .then((response) => {
                const allItems = response.data.data.flatMap(store => store.items || []);
                setInventory(allItems);
            })
            .catch((error) => {
                console.error("Error fetching inventory:", error);
            });
    }, [id]);

    return (
        <div className="container mx-auto p-6 ">
            <div className="flex ">
            <p
          onClick={() => navigate('/resource')}
          className="cursor-pointer hover:text-green-700 transition text-black p-2"
        >
          <FaCircleArrowLeft />
        </p>
            <h2 className="text-2xl font-semibold mb-4">Lab Inventory</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-400 text-left ">
                            <th className="border border-gray-300 p-2">Item Name</th>
                            <th className="border border-gray-300 p-2">Image</th>
                            <th className="border border-gray-300 p-2">Install Date</th>
                            <th className="border border-gray-300 p-2">Model</th>
                            <th className="border border-gray-300 p-2">Serial Number</th>
                            <th className="border border-gray-300 p-2">QR Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.length > 0 ? (
                            inventory.map((item, index) => (
                                <tr key={index} className="border border-gray-300">
                                    <td className="border border-gray-300 p-2">{item.product_ID?.name || "N/A"}</td>
                                    <td className="border border-gray-300 p-2 flex justify-center">
                                        <img
                                            src={`${BaseUrl}/${item.product_ID?.picture}`}
                                            alt={item.product_ID?.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {item.product_ID?.createdAt
                                            ? new Date(item.product_ID.createdAt).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td className="border border-gray-300 p-2">{item.product_ID?.model || "N/A"}</td>
                                    <td className="border border-gray-300 p-2">{item.serialNumber || "N/A"}</td>
                                    <td className="border border-gray-300 p-2">
                                        <img src={item.qrCode} alt="QR Code" className="w-16 h-16" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-4">No inventory found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowLabInventory;
