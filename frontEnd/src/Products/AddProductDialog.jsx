import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, MenuItem, Select, InputLabel, FormControl, TextField
} from '@mui/material';
import axios from 'axios';
import { BaseUrl } from '../BaseUrl';
const AddProductDialog = ({ open, onClose, product }) => {
    console.log('items', product)
    const [categoryName, setCategoryName] = useState([]);
    const [companyName, setCompanyName] = useState([]);
    const [osName, setOsName] = useState([]);
    const [capacity, setCapacity] = useState([]);
    const [type, setType] = useState([]);
    const [cpuName, setCpuName] = useState([]);
    const [editId, setEditId] = useState([]);
    const pattern = /\b(pc|personal computer)\b/i;
    const [formData, setFormData] = useState({
        name: '', category_ID: '', company_ID: '', cpu: '', otherspecs: '', os: '', model: '', ram_capacity: '', ram_type: '', hdd_capacity: '', hdd_type: '', picture: null,
    });
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                model: product.model,
                category_ID: product.category_ID._id,
                company_ID: product.company_ID._id,
                cpu: product.specs?.cpu?._id,
                os: product.specs?.os?._id,
                otherspecs: product.specs?.otherspecs,
                ram_capacity: product.specs?.ram?.[0]?.capacity?._id || '',
                ram_type: product.specs?.ram?.[0]?.type?._id || '',
                hdd_capacity: product.specs?.hdd?.[0]?.capacity?._id || '',
                hdd_type: product.specs?.hdd?.[0]?.type?._id || '',
                picture: product.picture,
            });
            setEditId(product._id);
        } else {
            setFormData({
                name: '', category_ID: '', company_ID: '', cpu: '', otherspecs: '', os: '', model: '', ram_capacity: '', ram_type: '', hdd_capacity: '', hdd_type: '', picture: null,
            })
        }
    }, [product]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    categoryResponse,
                    companyResponse,
                    osResponse,
                    cpuResponse,
                    capacityResponse,
                    typeResponse,
                ] = await Promise.all([
                    axios.get(`${BaseUrl}/category`),
                    axios.get(`${BaseUrl}/company`),
                    axios.get(`${BaseUrl}/os`),
                    axios.get(`${BaseUrl}/cpu`),
                    axios.get(`${BaseUrl}/ramAndHddOptions/capacity`),
                    axios.get(`${BaseUrl}/ramAndHddOptions/type`),
                ]);

                setCategoryName(categoryResponse.data.data);
                setCompanyName(companyResponse.data.data);
                setOsName(osResponse.data.data);
                setCpuName(cpuResponse.data.data);
                setCapacity(capacityResponse.data.data);
                setType(typeResponse.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            picture: event.target.files[0],
        }));
    };

    const handleAdd = async () => {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
            console.log(key, formData[key]);
        });

        try {
            if (editId) {
                const response = await axios.put(`${BaseUrl}/product/update/${editId}`, data);
                console.log('Product Updated successfully:', response);
                alert('Data Updated Successfully');
                setFormData({
                    name: '', category_ID: '', company_ID: '', cpu: '', otherspecs: '', os: '', model: '', ram_capacity: '', ram_type: '', hdd_capacity: '', hdd_type: '', picture: null,
                })
                setEditId(null);
                onClose();
            }
            else {
                const response = await axios.post(`${BaseUrl}/product/post`, data);
                console.log('Product added successfully:', response);
                alert('Data Saved Successfully');
                setFormData({
                    name: '', category_ID: '', company_ID: '', cpu: '', otherspecs: '', os: '', model: '', ram_capacity: '', ram_type: '', hdd_capacity: '', hdd_type: '', picture: null,
                })
                onClose();
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error in adding Product')
        }
    };
    const closeDialog = () => {
        setEditId(null);
        onClose();
    }
    const isPC = pattern.test(formData.name);
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="dense"
                />
                <TextField fullWidth label="Model" name="model" value={formData.model} onChange={handleChange} margin="dense"
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Category</InputLabel>
                    <Select name="category_ID" value={formData.category_ID} onChange={handleChange}
                    >
                        {categoryName.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="dense">
                    <InputLabel>Company</InputLabel>
                    <Select name="company_ID" value={formData.company_ID} onChange={handleChange}
                    >
                        {companyName.map((company) => (
                            <MenuItem key={company._id} value={company._id}>
                                {company.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField fullWidth label={`${formData.name.toUpperCase()} ` + "Specs"} name="otherspecs" value={formData.otherspecs} onChange={handleChange} margin="dense"
                />
                {isPC && (<>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>OS</InputLabel>
                        <Select name="os" value={formData.os} onChange={handleChange}
                        >
                            {osName.map((os) => (
                                <MenuItem key={os._id} value={os._id}>
                                    {os.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>CPU</InputLabel>
                        <Select name="cpu" value={formData.cpu} onChange={handleChange}
                        >
                            {cpuName.map((cpu) => (
                                <MenuItem key={cpu._id} value={cpu._id}>
                                    {cpu.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>RAM Capacity</InputLabel>
                        <Select name="ram_capacity" value={formData.ram_capacity} onChange={handleChange}
                        >
                            {capacity.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>RAM Type</InputLabel>
                        <Select name="ram_type" value={formData.ram_type} onChange={handleChange}
                        >
                            {type.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>HDD Capacity</InputLabel>
                        <Select name="hdd_capacity" value={formData.hdd_capacity} onChange={handleChange}
                        >
                            {capacity.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>HDD Type</InputLabel>
                        <Select name="hdd_type" value={formData.hdd_type} onChange={handleChange}
                        >
                            {type.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={closeDialog} color="error">     Cancel  </Button>
                <Button onClick={handleAdd} color="primary"> {product ? "Edit " : "Add "} </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductDialog;
