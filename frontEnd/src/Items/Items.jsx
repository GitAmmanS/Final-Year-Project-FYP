import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import './Items.scss';
import moment from 'moment'
import { BaseUrl } from '../BaseUrl';
import axios from 'axios';
import { AiOutlineDelete } from "react-icons/ai";
import { FaSearchPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Items = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    category_ID: '',
    company_ID: '',
    status_ID: '',
    location_ID: '',
    users_ID: '66c0fcad9735190ed9c0ff6a',
    spex_ID: '66c0f52bc098a7daf33fc527',
    purchase_date: moment().format('LLLL'),
    picture: null
  });
  const [itemsData, setItemsData] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [companyName, setCompanyName] = useState([]);
  const [statusName, setStatusName] = useState([]);
  const [locationName, setLocationName] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, categoryRes, companyRes, statusRes, locationRes] = await Promise.all([
          axios.get(`${BaseUrl}/items`),
          axios.get(`${BaseUrl}/category`),
          axios.get(`${BaseUrl}/company`),
          axios.get(`${BaseUrl}/status`),
          axios.get(`${BaseUrl}/location`)
        ]);

        setItemsData(itemsRes.data.message);
        setCategoryName(categoryRes.data.message);
        setCompanyName(companyRes.data.message);
        setStatusName(statusRes.data.message);
        setLocationName(locationRes.data.message);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
    setFormData({
      name: '',
      number: '',
      category_ID: '',
      company_ID: '',
      status_ID: '',
      location_ID: '',
      users_ID: '66c0fcad9735190ed9c0ff6a',
      spex_ID: '66c0f52bc098a7daf33fc527',
      purchase_date: moment().format('LLLL'),
      picture: null
    });
    setEditId(null);
  };

  const handleAddItem = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('number', formData.number);
    data.append('category_ID', formData.category_ID);
    data.append('company_ID', formData.company_ID);
    data.append('status_ID', formData.status_ID);
    data.append('location_ID', formData.location_ID);
    data.append('users_ID', formData.users_ID);
    data.append('spex_ID', formData.spex_ID);
    data.append('purchase_date', formData.purchase_date);

    if (formData.picture) {
      data.append('picture', formData.picture);
    }

    try {
      if (editId) {
        await axios.put(`${BaseUrl}/items/${editId}`, data).then((res)=>{
          console.log(res.data);
        });

        alert('Item Updated Successfully');
      } else {
        await axios.post(`${BaseUrl}/items`, data);
        alert('Item Added Successfully');
      }

      
      const itemsRes = await axios.get(`${BaseUrl}/items`);
      setItemsData(itemsRes.data.message);
      handleClose();
    } catch (err) {
      alert('Error in processing request');
      console.log(err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, picture: event.target.files[0] });
  };

  const handleCategoryChange = (event) => {
    setFormData({ ...formData, category_ID: event.target.value });
  };

  const handleCompanyChange = (event) => {
    setFormData({ ...formData, company_ID: event.target.value });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, status_ID: event.target.value });
  };

  const handleLocationChange = (event) => {
    setFormData({ ...formData, location_ID: event.target.value });
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      number: item.number,
      category_ID: item.category_ID._id,
      company_ID: item.company_ID._id,
      status_ID: item.status_ID._id,
      location_ID: item.location_ID._id,
      users_ID: item.users_ID,
      spex_ID: item.spex_ID,
      purchase_date: item.purchase_date,
      picture: item.picture
    });
    setEditId(item._id);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BaseUrl}/items/${id}`);
      alert('Item Deleted Successfully');
      const itemsRes = await axios.get(`${BaseUrl}/items`);
      setItemsData(itemsRes.data.message);
    } catch (err) {
      alert('Error in deleting item');
      console.log(err);
    }
  };

  return (
    <div className="maincontainer">
      <div className='heading'>
        Items
        <button onClick={handleClickOpen}>Add Items +</button>
      </div>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Company</th>
              <th>Location</th>
              <th>Purchase Date</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemsData.length > 0 ? (
              itemsData.map((item, index) =>{ 
                return(
                <tr key={index}>
                  <td>{item.number ||'none'}</td>
                  <td>{item.name || 'none'}</td>
                  <td>{item.category_ID.name || 'none'}</td>
                  <td>{item.company_ID.name || 'none'}</td>
                  <td>{item.location_ID.name || 'none'}</td>
                  <td>{item.purchase_date || 'none'}</td>
                  <td>{item.status_ID.name || 'none'}</td>
                  <td>
                    {item.picture ? <img src={`${BaseUrl}/${item.picture}`} alt="item" width="50" /> : 'No image'}
                  </td>
                  <td>
                    <button id='more'><FaSearchPlus /> More</button>
                    <button id='edit' onClick={() => handleEdit(item)}><MdEdit /> Edit</button>
                    <button id='delete' onClick={() => handleDelete(item._id)}><AiOutlineDelete /> Delete</button>
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan="9">No items available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open || openEdit} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the details for the item.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Number"
            fullWidth
            name="number"
            value={formData.number}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category_ID}
              onChange={handleCategoryChange}
              label="Category"
              name="category_ID"
            >
              {categoryName.map((category, index) => (
                <MenuItem key={index} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Company</InputLabel>
            <Select
              value={formData.company_ID}
              onChange={handleCompanyChange}
              label="Company"
              name="company_ID"
            >
              {companyName.map((company, index) => (
                <MenuItem key={index} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status_ID}
              onChange={handleStatusChange}
              label="Status"
              name="status_ID"
            >
              {statusName.map((status, index) => (
                <MenuItem key={index} value={status._id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Location</InputLabel>
            <Select
              value={formData.location_ID}
              onChange={handleLocationChange}
              label="Location"
              name="location_ID"
            >
              {locationName.map((location, index) => (
                <MenuItem key={index} value={location._id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Purchase Date"
            fullWidth
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleInputChange}
          />
          <input
            type="file"
            name="picture"
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddItem} color="primary">
            {editId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Items;
