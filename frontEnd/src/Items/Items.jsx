import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import './Items.scss';
import moment from 'moment';
import { BaseUrl } from '../BaseUrl';
import axios from 'axios';
import { AiOutlineDelete } from "react-icons/ai";
import { FaSearchPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Items = () => {
  const navigate = useNavigate();
  const [categoryOrCompanyName, setCategoryOrCompanyName] = useState('');
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isCategory, setIsCategory] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    quantity: null,
    category_ID: '',
    company_ID: '',
    status_ID: '',
    location_ID: '',
    users_ID: '66cb2befb9113c1db9306533',
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
        console.log(categoryRes);
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
    setOpenDialog(false);
    setFormData({
      name: '',
      quantity: 0,
      category_ID: '',
      company_ID: '',
      status_ID: '',
      location_ID: '',
      users_ID: '66cb2befb9113c1db9306533',
      spex_ID: '66c0f52bc098a7daf33fc527',
      purchase_date: moment().format('LLLL'),
      picture: null
    });
    setEditId(null);
    setCategoryOrCompanyName('');
  };

  const handleAddItem = async () => {
    console.log("this is real data", formData);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('quantity', formData.quantity);
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
        await axios.put(`${BaseUrl}/items/${editId}`, data).then((res) => {
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
      quantity: item.quantity,
      category_ID: item.category_ID._id,
      company_ID: item.company_ID._id,
      status_ID: item.status_ID._id,
      location_ID: item.location_ID._id,
      users_ID: item.users_ID._id,
      spex_ID: item.spex_ID._id,
      purchase_date: item.purchase_date,
      picture: item.picture
    });
    setEditId(item._id);
    setOpenEdit(true);
  };

  const handleMoreInfo = (item) => {
    navigate('/more', { state: { itemData: item } });
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

  const handleAddCategoryOrCompany = () => {
    const url = isCategory ? `${BaseUrl}/category` : `${BaseUrl}/company`;
    axios.post(url, { name: categoryOrCompanyName })
      .then((res) => {
        console.log(res.data);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
      });
    alert(isCategory ? 'Category Added Successfully' : 'Company Added Successfully');
  };

  const handleCategory = () => {
    setIsCategory(true);
    setOpenDialog(true);
  };

  const handleCompany = () => {
    setIsCategory(false);
    setOpenDialog(true);
  };

  return (
    <div className="maincontainer">
      <div className='heading'>
        <p>Items</p>
        <div className="buttons">
          <button onClick={handleClickOpen}>Add Items</button>
          <button onClick={handleCategory}>Add Category</button>
          <button onClick={handleCompany}>Add Company</button>
        </div>
      </div>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Category</th>
              <th>Company</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Purchase Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemsData.length > 0 ? (
              itemsData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name || 'none'}</td>
                  <td>
                    {item.picture ? <img src={`${BaseUrl}/${item.picture}`} alt="item" width="50" /> : 'No image'}
                  </td>
                  <td>{item.category_ID.name || 'none'}</td>
                  <td>{item.company_ID.name || 'none'}</td>
                  <td>{item.location_ID.name || 'none'}</td>
                  <td>{item.quantity || 'none'}</td>
                  <td>{item.purchase_date || 'none'}</td>
                  <td>{item.status_ID.name || 'none'}</td>
                  <td>
                    <div className='options'>
                      <button id='more' onClick={() => handleMoreInfo(item)}><FaSearchPlus /> </button>
                      <button id='edit' onClick={() => handleEdit(item)}><MdEdit /> </button>
                      <button id='delete' onClick={() => handleDelete(item._id)}><AiOutlineDelete /> </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open || openEdit} onClose={handleClose}>
        <DialogTitle>{editId ? 'Update Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill the form below.</DialogContentText>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select value={formData.category_ID} onChange={handleCategoryChange}>
              {categoryName.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Company</InputLabel>
            <Select value={formData.company_ID} onChange={handleCompanyChange}>
              {companyName.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={formData.status_ID} onChange={handleStatusChange}>
              {statusName.map((status) => (
                <MenuItem key={status._id} value={status._id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Location</InputLabel>
            <Select value={formData.location_ID} onChange={handleLocationChange}>
              {locationName.map((location) => (
                <MenuItem key={location._id} value={location._id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddItem}>{editId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add {isCategory ? 'Category' : 'Company'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the {isCategory ? 'category' : 'company'} you want to add.
          </DialogContentText>
          <TextField
            margin="dense"
            name="categoryOrCompanyName"
            label={isCategory ? 'Category Name' : 'Company Name'}
            value={categoryOrCompanyName}
            onChange={(e) => setCategoryOrCompanyName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddCategoryOrCompany}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Items;
