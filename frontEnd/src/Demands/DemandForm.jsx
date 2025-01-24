import { DataGrid } from '@mui/x-data-grid'
import React, { useState, useEffect } from 'react'
import { BaseUrl } from '../BaseUrl';
import axios from 'axios';

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

export function Second({ onSelectProducts }) {
    const [productData, setProductData] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState(null);
    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/product`);
                setProductData(response.data.data || []);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };
        getProduct();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'company', headerName: 'Company', width: 150 },
        {
            field: 'picture',
            headerName: 'Picture',
            width: 150,
            renderCell: (params) => (
                <img
                    src={`${BaseUrl}/${params.value}`}
                    alt="product"
                    style={{ height: '50px', width: '60px', objectFit: 'contain' }}
                />
            ),
        },
        { field: 'model', headerName: 'Model', width: 150 },
    ];

    const rows = productData.map((product, index) => ({
        id: product._id || index,
        name: product.name,
        category: product.category_ID?.name || 'N/A',
        company: product.company_ID?.name || 'N/A',
        picture: product.picture,
        model: product.model,
    }));

    const handleSelectionChange = (selectionModel) => {
        if (selectionModel.length > 0) {
            const selectedProducts = selectionModel.map((id) => {
                const product = rows.find((row) => row.id === id);
                return { id: product.id, name: product.name };
            });
            setSelectedProductIds(selectedProducts);
            onSelectProducts(selectedProducts);
        } else {
            setSelectedProductIds(null);
            onSelectProducts([]);
        }
    };
    

    return (
        <div className="mt-4">
            <p className="text-center text-xl text-gray-900 font-semibold">
                Select Products
            </p>
            <div className='' style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    checkboxSelection
                    onRowSelectionModelChange={(ids) => handleSelectionChange(ids)}
                    sx={{
                        '& .MuiDataGrid-row.Mui-selected': {
                            backgroundColor: '#e3f2fd',
                            color: '#2e7d32',
                            font: 'bolder',
                            '&:hover': {
                                backgroundColor: '#bbdefb',
                            },
                        },
                    }}

                />

            </div>
        </div>
    );
}
