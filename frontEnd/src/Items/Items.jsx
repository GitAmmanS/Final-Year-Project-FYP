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
import locales from '../locales/en.json'
const Items = () => {
  const pattern = /\b(pc|personal computer)\b/i;
  const navigate = useNavigate();
  const [categoryOrCompanyName, setCategoryOrCompanyName] = useState('');
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isCategory, setIsCategory] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    category_ID: '',
    company_ID: '',
    status_ID: '',
    specs:{
      cpu:'',
      otherspecs:'',
      os:'',
      ram:[{ capacity: '67078e186409c96dd98efef2', type: '67078df86409c96dd98efeee', status: '66febbc22f68e6fc56b8c7e5' }],
      hdd:[{ capacity: '67078e226409c96dd98efef4', type: '67078e036409c96dd98efef0', status: '66febbc22f68e6fc56b8c7e5' }]
    },
    installDate: moment().format('LLLL'),
    picture: null,
    roomId:'',
    labId:''
  });
  const [itemsData, setItemsData] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [companyName, setCompanyName] = useState([]);
  const [statusName, setStatusName] = useState([]);
  const [roomName, setRoomName] = useState([]);
  const [labName, setLabName] = useState([]);
  const [osName, setOsName] = useState([]);
  const [otherSpecs, setOtherSpecs] = useState([]);
  const [cpuName, setCpuName] = useState([]);
  const [ramData, setramData] = useState([]);
  const [hddData, setHddData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, companiesResponse, itemsResponse, statusResponse, roomResponse, labResponse , osResponse , otherSpecsResponse , cpuResponse, ramResponse, hddResponse] = await Promise.all([
          axios.get(`${BaseUrl}/category`),
          axios.get(`${BaseUrl}/company`),
          axios.get(`${BaseUrl}/items`),
          axios.get(`${BaseUrl}/status`),
          axios.get(`${BaseUrl}/room`),
          axios.get(`${BaseUrl}/lab`),
          axios.get(`${BaseUrl}/os`),
          axios.get(`${BaseUrl}/otherspecs`),
          axios.get(`${BaseUrl}/cpu`),
          axios.get(`${BaseUrl}/ram`),
          axios.get(`${BaseUrl}/hdd`),
        ]);
        setCategoryName(categoriesResponse.data.data);
        setCompanyName(companiesResponse.data.data);
        setItemsData(itemsResponse.data.data);
        setStatusName(statusResponse.data.data);
        setRoomName(roomResponse.data.data);
        setLabName(labResponse.data.data);
        setOsName(osResponse.data.data);
        setOtherSpecs(otherSpecsResponse.data.data);
        setCpuName(cpuResponse.data.data);
        setramData(ramResponse.data.data);
        setHddData(hddResponse.data.data)
        console.log(ramResponse.data.data);
        console.log(hddResponse.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  },[]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const resetFormData=()=>{
    setFormData({
      name: '',
      quantity: 1,
      category_ID: '',
      company_ID: '',
      specs:{
        cpu:'',
        otherspecs:'',
        os:'',
        ram:[{ capacity: '67078e186409c96dd98efef2', type: '67078df86409c96dd98efeee', status: '66febbc22f68e6fc56b8c7e5' }],
        hdd:[{ capacity: '67078e226409c96dd98efef4', type: '67078e036409c96dd98efef0', status: '66febbc22f68e6fc56b8c7e5' }]
      },
      installDate: moment().format('LLLL'),
      picture: null,
      roomId:'',
      labId:'',
      status_ID:''
    });
  }
  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
    setOpenDialog(false);
    resetFormData();
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
    data.append('installDate', formData.installDate);
    data.append('roomId', formData.roomId);
    data.append('labId', formData.labId);
    data.append('cpu', formData.specs.cpu);
    data.append('os', formData.specs.os);
    data.append('otherspecs', formData.specs.otherspecs);
    
    formData.specs.ram.forEach((ram, index) => {
        data.append(`ram[${index}][capacity]`, ram.capacity);
        data.append(`ram[${index}][type]`, ram.type);
        data.append(`ram[${index}][status]`, ram.status);
    });

    formData.specs.hdd.forEach((hdd, index) => {
        data.append(`hdd[${index}][capacity]`, hdd.capacity);
        data.append(`hdd[${index}][type]`, hdd.type);
        data.append(`hdd[${index}][status]`, hdd.status);
    });

    if (formData.picture) {
        data.append('picture', formData.picture);
    }
    try {
      const route = formData.quantity > 1 ? `${BaseUrl}/items/postBulk` : `${BaseUrl}/items/post`;
      if (editId) {
        await axios.put(`${BaseUrl}/items/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },}).then((res) => {
          console.log(res.data);
        });

        alert('Item Updated Successfully');
      }
       else {
        const response = await axios.post(route, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Item Added Successfully');
      }
      console.log("working correctly")
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
      
  const handleSpecChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
          ...prevData,
          specs: {
            ...prevData.specs,
            [name]: value 
          }
        }));
      };
      

  const handleFileChange = (event) => {
    setFormData({ ...formData, picture: event.target.files[0] });
  };

  const handleCategoryChange = (event) => {
    setFormData({ ...formData, category_ID: event.target.value });
  };
  const handleRoomChange = (event) => {
    setFormData({ ...formData, roomId: event.target.value });
  };
  const handleLabChange = (event) => {
    setFormData({ ...formData, labId: event.target.value });
  };
  
  const handleCompanyChange = (event) => {
    setFormData({ ...formData, company_ID: event.target.value });
  };

  const handleStatusChange = (event) => {
    setFormData({ ...formData, status_ID: event.target.value });
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      quantity: item.quantity,
      category_ID: item.category_ID._id,
      company_ID: item.company_ID._id,
      status_ID: item.status_ID._id,
      specs: item.specs,
      installDate: moment(item.installDate).format('YYYY-MM-DD'),
      roomId: item.roomId._id,
      labId: item.labId._id,
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
      // const itemsRes = await axios.get(`${BaseUrl}/items`);
      // setItemsData(itemsRes.data.message);
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
  const isPC = pattern.test(formData.name);
  return (
    <div className="bg-slate-50 h-sceen mt-2 ">
      <div className='flex p-2 text-xl text-slate-600 justify-between'>
        <p className='text-center font-bold cursor-pointer hover:text-slate-500'>Items</p>
        <div className='bg-none text-base '>
          <button className='px-2 text-center hover:border hover:bg-slate-200 hover:border-black rounded-md'onClick={handleClickOpen}>Add Items</button>
          <button className='px-2 text-center hover:border hover:bg-slate-200 hover:border-black rounded-md'onClick={handleCategory}>Add Category</button>
          <button className='px-2 text-center hover:border hover:bg-slate-200 hover:border-black rounded-md'onClick={handleCompany}>Add Company</button>
        </div>
      </div>

      <div className='mt-3 p-2 '>
        <table className=' w-full'>
          <thead className='border border-black w-full'>
            <tr>
            <th className='border-2 border-slate-700'>Picture</th>
            <th className='border-2 border-slate-700'>Name</th>
              <th className='border-2 border-slate-700'>Category</th>
              <th className='border-2 border-slate-700'>Company</th>
              <th className='border-2 border-slate-700'>Quantity</th>
              <th className='border-2 border-slate-700'>Serial Number</th>
              <th className='border-2 border-slate-700'>Status</th>
              <th className='border-2 border-slate-700'>Actions</th>
            </tr>
          </thead>
          <tbody className='text-center mt-2 '>
          {itemsData.length > 0 ? (
  itemsData.map((item, index) => (
    <tr key={index}>
      <td className='pl-4 pt-3'>
        {item.picture ? <img src={`${BaseUrl}/${item.picture}`} alt="item" width="50" /> : 'No image'}
      </td>
      <td className='pt-3'>{item?.name || 'none'}</td>
      <td className='pt-3'>{item.category_ID?.name || 'none'}</td>
      <td className='pt-3'>{item.company_ID?.name || 'none'}</td>
      <td className='pt-3'>{item?.quantity || 'none'}</td>
      <td className='pt-3'>{item?.serialNumber || 'none'}</td>
      <td className='pt-3'>{item.status_ID?.name || 'none'}</td>
      <td>
        <div className='pt-3 text-center px-2'>
          <button className='bg-green-400 border-2 border-black w-6 h-7 text-center hover:bg-green-600 rounded-md' onClick={() => handleMoreInfo(item)}><FaSearchPlus /></button>
          <button className='bg-blue-600 border-2 border-black w-6 h-7 text-center hover:bg-blue-900 rounded-md' onClick={() => handleEdit(item)}><MdEdit /></button>
          <button className='bg-red-600 border-2 border-black w-6 h-7 text-center hover:bg-red-900 rounded-md' onClick={() => handleDelete(item._id)}><AiOutlineDelete /></button>
        </div>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="9">No items found</td>
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
            <InputLabel>Room</InputLabel>
            <Select name='room' value={formData.roomId} onChange={handleRoomChange}>
              {roomName.map((room) => (
                <MenuItem key={room._id} value={room._id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Lab</InputLabel>
            <Select name='lab' value={formData.labId} onChange={handleLabChange}>
              {labName.map((lab) => (
                <MenuItem key={lab._id} value={lab._id}>
                  {lab.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select name='category' value={formData.category_ID} onChange={handleCategoryChange}>
              {categoryName.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Company</InputLabel>
            <Select name='company' value={formData.company_ID} onChange={handleCompanyChange}>
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
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: '10px' }}
          />
          {/* <TextField
            margin="dense"
            name="specs"
            label={formData.name.toUpperCase() + ' '+ 'SPECS' }
            type="text"
            value={formData.specs.otherspecs}
            onChange={handleSpecChange}
            fullWidth
          /> */}
          {
            isPC && (
              <>
               <FormControl fullWidth margin="dense">
            <InputLabel>CPU</InputLabel>
            <Select name='cpu' value={formData.specs.cpu} onChange={handleSpecChange}>
              {cpuName.map((cpu) => (
                <MenuItem key={cpu._id} value={cpu._id}>
                  {cpu.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Operating System</InputLabel>
            <Select name='os' value={formData.specs.os} onChange={handleSpecChange}>
              {osName.map((os) => (
                <MenuItem key={os._id} value={os._id}>
                  {os.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>OtherSpecs</InputLabel>
            <Select name='otherspecs' value={formData.specs.otherspecs} onChange={handleSpecChange}>
              {otherSpecs.map((otherSpec) => (
                <MenuItem key={otherSpec._id} value={otherSpec._id}>
                  {otherSpec.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
              </>
              
            )
          }
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
