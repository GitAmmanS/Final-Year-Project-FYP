import React, { useState, useEffect,useMemo } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { PieChart } from '@mui/x-charts/PieChart';
import { QRCodeSVG } from 'qrcode.react';
import moment, { locale } from 'moment';
import { BaseUrl } from '../BaseUrl';
import axios from 'axios';
import { AiOutlineDelete } from "react-icons/ai";
import { FaSearchPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import locales from '../locales/en.json'
import Loading from '../Loading/loading';

const Items = () => {
  const pattern = /\b(pc|personal computer)\b/i;
  const navigate = useNavigate();
  const [categoryOrCompanyName, setCategoryOrCompanyName] = useState('');
  const [open, setOpen] = useState(false);
  const [Loader, setLoader] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isCategory, setIsCategory] = useState(true);
  const [file, setFile] = useState(null);
  const [TotalItems, setTotalItems] = useState(0);
  const [statusItems, setStatusItem] = useState({
    New: 0,
    Old: 0,
    Damaged: 0,
    Pending: 0,
    Repaired: 0,
    Faulty: 0,
    Used: 0,
  })
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    category_ID: '',
    company_ID: '',
    status_ID: '',
    cpu: '',
    otherspecs: '',
    os: '',
    ram: [{ capacity: '', type: '', status: '' }],
    hdd: [{ capacity: '', type: '', status: '' }],
    installDate: moment().format('LLLL'),
    roomId: '',
    labId: ''
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
  const [capacitySize, setCapacitySize] = useState([]);
  const [typeName, setTypeName] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, companiesResponse, itemsResponse, statusResponse, roomResponse, labResponse, osResponse, otherSpecsResponse, cpuResponse, capacityResponse, typeResponse] = await Promise.all([
          axios.get(`${BaseUrl}/category`),
          axios.get(`${BaseUrl}/company`),
          axios.get(`${BaseUrl}/items`),
          axios.get(`${BaseUrl}/status`),
          axios.get(`${BaseUrl}/room`),
          axios.get(`${BaseUrl}/lab`),
          axios.get(`${BaseUrl}/os`),
          axios.get(`${BaseUrl}/otherspecs`),
          axios.get(`${BaseUrl}/cpu`),
          axios.get(`${BaseUrl}/ramAndHddOptions/capacity`),
          axios.get(`${BaseUrl}/ramAndHddOptions/type`),
        ]);
        setCategoryName(categoriesResponse.data.data);
        setCompanyName(companiesResponse.data.data);
        setItemsData(itemsResponse.data.data);

        console.log(itemsResponse.data.data);
        setTotalItems(itemsData.length);
        itemsData.length>0 &&(setLoader(false));

        setStatusName(statusResponse.data.data);
        setRoomName(roomResponse.data.data);
        setLabName(labResponse.data.data);
        setOsName(osResponse.data.data);
        setOtherSpecs(otherSpecsResponse.data.data);
        setCpuName(cpuResponse.data.data);
        setCapacitySize(capacityResponse.data.data);
        setTypeName(typeResponse.data.data);
      } catch (err) {
        console.error(locales.messages.errorMessage, err);
      }
    };

    fetchData();
  }, [itemsData]);
  useEffect(() => {

    const initialStatusItems = {
      New: 0,
      Old: 0,
      Damaged: 0,
      Pending: 0,
      Repaired: 0,
      Faulty: 0,
      Used: 0,
    };

    itemsData.forEach((item) => {
      if (item.status_ID && item.status_ID.name && initialStatusItems[item.status_ID.name] !== undefined) {
        initialStatusItems[item.status_ID.name] += 1;
      }
    });

    setStatusItem(initialStatusItems);
  }, [itemsData]);



  const handleClickOpen = () => {
    setOpen(true);
  };
  const resetFormData = () => {
    setFormData({
      name: '',
      quantity: 1,
      category_ID: '',
      company_ID: '',
      cpu: '',
      otherspecs: '',
      os: '',

      ram: [{ capacity: '', type: '', status: '' }, { capacity: '', type: '', status: '' }],
      hdd: [{ capacity: '', type: '', status: '' }, { capacity: '', type: '', status: '' }],
      installDate: moment().format('LLLL'),
      roomId: '',
      labId: '',
      status_ID: ''
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

    for (const [key, value] of Object.entries(formData)) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          for (const [itemKey, itemValue] of Object.entries(item)) {
            data.append(`${key}[${index}][${itemKey}]`, itemValue);
          }
        });
      } else {
        data.append(key, value);
      }
    }

    if (file) {
      data.append('picture', file);
    }
    try {
      const route = formData.quantity > 1 ? `${BaseUrl}/items/postBulk` : `${BaseUrl}/items/post`;
      if (editId) {
        await axios.put(`${BaseUrl}/items/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then((res) => {
          console.log(res.data);
        });

        alert(locales.messages.itemUpdated);
      }
      else {
        const response = await axios.post(route, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert(locales.messages.itemAdded);
      }
      handleClose();
    } catch (err) {
      alert(locales.messages.errorMessage2);
      console.log(err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleRamChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRam = [...formData.ram];
    updatedRam[index][name] = value;
    setFormData({ ...formData, ram: updatedRam });
    console.log("Updated RAM:", updatedRam);
  };
  const handleHddChange = (index, e) => {
    const { name, value } = e.target;
    const updatedHdd = [...formData.hdd];
    updatedHdd[index][name] = value;
    setFormData({ ...formData, hdd: updatedHdd });
    console.log("Updated hdd:", updatedHdd);
  };


  const addRamField = () => {
    if (formData.ram.length < 2) {
      setFormData({ ...formData, ram: [...formData.ram, { capacity: '', type: '', status: '' }] });
    }
  };

  const addHddField = () => {
    if (formData.hdd.length < 2) {
      setFormData({ ...formData, hdd: [...formData.hdd, { capacity: '', type: '', status: '' }] });
    }
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
    console.log(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      category_ID: item.category_ID._id,
      company_ID: item.company_ID._id,
      status_ID: item.status_ID._id,
      cpu: item.cpu?._id,
      os: item.os?._id,
      otherspecs: item?.otherspecs?._id,
      ram: [{ capacity: item.ram?.capacity?._id, type: item.ram?.type?._id, status: item.ram?.type?._id }],
      hdd: [{ capacity: item.hdd?.capacity?._id, type: item.hdd?.type?._id, status: item.hdd?.type?._id }],
      installDate: moment(item.installDate).format('YYYY-MM-DD'),
      roomId: item.roomId._id,
      labId: item.labId._id,
      picture: item.picture
    });
    console.log("from edit section" + formData.ram);
    setEditId(item._id);
    setOpenEdit(true);
  };

  const handleMoreInfo = (item) => {
    navigate(`/more/${item._id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BaseUrl}/items/${id}`);
      alert(locales.messages.itemDeleted);
      const itemsData1= await axios.get(`${BaseUrl}/items`);
      setItemsData(itemsData1.data.data);
    } catch (err) {
      alert(locales.messages.errorMessage3);
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
  const transformedData = useMemo(() => 
    itemsData.map(item => ({
      Picture: <img src={`${BaseUrl}/${item.picture}`} alt="item" style={{ width: 50, height: 50 }} />,
      Name: item.name || "N/A",
      Category: item.category_ID?.name || "N/A",
      Company: item.company_ID?.name || "N/A",
      Quantity: item.quantity || 0,
      Serial_Number: item.serialNumber || "N/A",
      Status: item.status_ID?.name || "N/A",
      QR_Code: <QRCodeSVG value={item.qrCode || "N/A"} size={50} />,
      Actions: (
        <div className='space-x-[5px] '>
          <button className='text-xl hover:text-slate-600' onClick={() => handleEdit(item)}><MdEdit /></button>
          <button className='text-xl hover:text-red-600' onClick={() => handleDelete(item._id)}><AiOutlineDelete /></button>
          <button className='text-xl hover:text-green-700' onClick={() => handleMoreInfo(item)}><FaSearchPlus /></button>
        </div>
      ),
    })), 
    [itemsData]
  );
  
  

  const [columns] = useState([
    {
      accessorKey: 'Picture',
      header: 'Picture',
      size: 100,
    },
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
      accessorKey: 'Quantity',
      header: 'Quantity',
      size: 100,
    },
    {
      accessorKey: 'Serial_Number',
      header: 'Serial Number',
      size: 100,
    },
    {
      accessorKey: 'Status',
      header: 'Status',
      size: 100,
    },
    {
      accessorKey: 'QR_Code',
      header: 'QR Code',
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
    data:transformedData,
  });
  const isPC = pattern.test(formData.name);
  return (
    <div className="bg-slate-50 h-sceen mt-2 ">
      <div className='flex flex-row'>
        <div className='relative w-[350px] h-[300px]  z-[1] ml-[20%]  flex justify-center items-center'>
          <PieChart
            series={[
              {
                data: [
                  { title: "new", value: (statusItems.New/TotalItems)*100, color: '#5DB963' },
                  { title: 'old', value: (statusItems.Old/TotalItems)*100, color: '#6E5DB9' },
                  { title: 'damaged', value: (statusItems.Damaged/TotalItems)*100, color: '#E80F12' },
                  { title: 'pending', value: (statusItems.Pending/TotalItems)*100, color: '#B95D8B' },
                  { title: 'repaired', value: (statusItems.Repaired/TotalItems)*100, color: '#D3AB34' },
                  { title: 'faulty', value: (statusItems.Faulty/TotalItems)*100, color: '#E8DA0F' },
                  { title: 'used', value: (statusItems.Used/TotalItems)*100, color: '#17C2AB' },
                ],
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 40, additionalRadius: -20, color: 'gray' },
                innerRadius: 55,
              },
            ]}
            height={200}
          />
          <div className='absolute top-[42%] left-[24%] w-[90px] h-[50px] text-[22px] flex flex-col justify-center items-center'>
            {TotalItems}
            <span className='text-[#000000] opacity-[60%] text-[16px]'>Total Items</span>
          </div>
        </div>
        <div className='ml-[10px] my-[30px] grid grid-rows-3 grid-cols-3 w-[400px]  '>
          <div className="flex flex-row justify-center items-center space-x-3">
            <div className='w-6 h-6 rounded-[50%] bg-[#5DB963]'></div>
            <div className='w-[90px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
              {statusItems.New}
              <span className='text-[#000000] opacity-[60%] text-[14px]'>New</span>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center space-x-3">
            <div className='w-6 h-6 rounded-[50%] bg-[#6E5DB9]'></div>
            <div className='w-[90px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
              {statusItems.Old}
              <span className='text-[#000000] opacity-[60%] text-[14px]'>Old</span>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center space-x-3">
            <div className='w-6 h-6 rounded-[50%] bg-[#E80F12]'></div>
            <div className='w-[90px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
              {statusItems.Damaged}
              <span className='text-[#000000] opacity-[60%] text-[14px]'>Damaged</span>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center space-x-3">
            <div className='w-6 h-6 rounded-[50%] bg-[#B95D8B]'></div>
            <div className='w-[90px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
              {statusItems.Pending}
              <span className='text-[#000000] opacity-[60%] text-[14px]'>Pending</span>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center space-x-3">
            <div className='w-6 h-6 rounded-[50%] bg-[#D3AB34]'></div>
            <div className='w-[90px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
              {statusItems.Repaired}
              <span className='text-[#000000] opacity-[60%] text-[14px]'>Repaired</span>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center space-x-3">
            <div className='w-6 h-6 rounded-[50%] bg-[#E8DA0F]'></div>
            <div className='w-[90px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
              {statusItems.Faulty}
              <span className='text-[#000000] opacity-[60%] text-[14px]'>Faulty</span>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center space-x-3">
            <div className='w-6 h-6 rounded-[50%] bg-[#17C2AB]'></div>
            <div className='w-[90px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
              {statusItems.Used}
              <span className='text-[#000000] opacity-[60%] text-[14px]'>Used</span>
            </div>
          </div>
        </div>
      </div>



      <div className='flex p-2 text-xl text-black justify-between'>
        <p className='text-center font-bold cursor-pointer'>{locales.labels.AllocateItems}</p>
        <div className='bg-none text-base space-x-[10px] '>
          <button className='px-2 text-center border bg-[#AFD0AE]  border-black hover:bg-[#5eb05b] hover:text-white hover:transition-all rounded-md' onClick={handleClickOpen}>{locales.buttons.addItem}</button>
          <button className='px-2 text-center border bg-[#AFD0AE]  border-black hover:bg-[#5eb05b] hover:text-white hover:transition-all rounded-md' onClick={handleCategory}>{locales.buttons.addCategory}</button>
          <button className='px-2 text-center border bg-[#AFD0AE]  border-black hover:bg-[#5eb05b] hover:text-white hover:transition-all rounded-md' onClick={handleCompany}>{locales.buttons.addCompany}</button>
        </div>
      </div>
      {
        Loader ?
        <div className='flex flex-col w-full'>
        <div> <MaterialReactTable table={table} /></div>
      </div> :
          <div className="loading-container flex justify-center items-center min-h-60 min-w-60">
            <Loading type="spin" color="#3498db" />
          </div>
      }


      <Dialog open={open || openEdit} onClose={handleClose}>
        <DialogTitle>{editId ? `${locales.dialog.title.updateItem}` : `${locales.dialog.title.addItem}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{locales.dialog.contentText.addItemText}</DialogContentText>
          <TextField
            margin="dense"
            name="name"
            label={locales.labels.name}
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="quantity"
            label={locales.labels.quantity}
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>{locales.placeholders.room}</InputLabel>
            <Select name='room' value={formData.roomId} onChange={handleRoomChange}>
              {roomName.map((room) => (
                <MenuItem key={room._id} value={room._id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>{locales.placeholders.lab}</InputLabel>
            <Select name='lab' value={formData.labId} onChange={handleLabChange}>
              {labName.map((lab) => (
                <MenuItem key={lab._id} value={lab._id}>
                  {lab.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>{locales.placeholders.category}</InputLabel>
            <Select name='category' value={formData.category_ID} onChange={handleCategoryChange}>
              {categoryName.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>{locales.placeholders.company}</InputLabel>
            <Select name='company' value={formData.company_ID} onChange={handleCompanyChange}>
              {companyName.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>{locales.placeholders.status}</InputLabel>
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
            name="picture"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: '10px' }}
          />
          {
            isPC && (
              <>
                <FormControl fullWidth margin="dense">
                  <InputLabel>{locales.placeholders.cpu}</InputLabel>
                  <Select name='cpu' value={formData.cpu} onChange={handleInputChange}>
                    {cpuName.map((cpu) => (
                      <MenuItem key={cpu._id} value={cpu._id}>
                        {cpu.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel>{locales.placeholders.os}</InputLabel>
                  <Select name='os' value={formData.os} onChange={handleInputChange}>
                    {osName.map((os) => (
                      <MenuItem key={os._id} value={os._id}>
                        {os.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel>{locales.placeholders.otherspecs}</InputLabel>
                  <Select name='otherspecs' value={formData.otherspecs} onChange={handleInputChange}>
                    {otherSpecs.map((otherSpec) => (
                      <MenuItem key={otherSpec._id} value={otherSpec._id}>
                        {otherSpec.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formData.ram.map((ram, index) => (
                  <div key={index}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>{locales.placeholders.ramCapacity}</InputLabel>
                      <Select
                        name="capacity"
                        value={ram.capacity || ''}
                        onChange={(e) => handleRamChange(index, e)}
                      >
                        {capacitySize.map((capacity) => (
                          <MenuItem key={capacity._id} value={capacity._id}>
                            {capacity.size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                      <InputLabel>{locales.placeholders.ramType}</InputLabel>
                      <Select
                        name="type"
                        value={ram.type || ''}
                        onChange={(e) => handleRamChange(index, e)}
                      >
                        {typeName.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                      <InputLabel>{locales.placeholders.ramStatus}</InputLabel>
                      <Select
                        name="status"
                        value={ram.status || ''}
                        onChange={(e) => handleRamChange(index, e)}
                      >
                        {statusName.map((status) => (
                          <MenuItem key={status._id} value={status._id}>
                            {status.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ))}
                <Button onClick={addRamField}>Add More RAM</Button>
                {/* {console.log(formData.ram.length())} */}

                {formData.hdd.map((hdd, index) => (
                  <div key={index}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel>{locales.placeholders.hddCapacity}</InputLabel>
                      <Select
                        name="capacity"
                        value={hdd.capacity || ''}
                        onChange={(e) => handleHddChange(index, e)}
                      >
                        {capacitySize.map((capacity) => (
                          <MenuItem key={capacity._id} value={capacity._id}>
                            {capacity.size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                      <InputLabel>{locales.placeholders.hddType}</InputLabel>
                      <Select
                        name="type"
                        value={hdd.type || ''}
                        onChange={(e) => handleHddChange(index, e)}
                      >
                        {typeName.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                      <InputLabel>{locales.placeholders.hddStatus}</InputLabel>
                      <Select
                        name="status"
                        value={hdd.status || ''}
                        onChange={(e) => handleHddChange(index, e)}
                      >
                        {statusName.map((status) => (
                          <MenuItem key={status._id} value={status._id}>
                            {status.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ))}
                <Button onClick={addHddField}>Add More HarDisk</Button>

              </>

            )
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{locales.buttons.cancel}</Button>
          <Button onClick={handleAddItem}>{editId ? `${locales.buttons.update}` : `${locales.buttons.add}`}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add {isCategory ? `${locales.labels.category}` : `${locales.labels.company}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {locales.messages.companyAndCategory} {isCategory ? `${locales.labels.category}` : `${locales.labels.company}`} {locales.messages.companyAndCategory2}
          </DialogContentText>
          <TextField
            margin="dense"
            name="categoryOrCompanyName"
            label={isCategory ? `${locales.labels.category}` : `${locales.labels.company}`}
            value={categoryOrCompanyName}
            onChange={(e) => setCategoryOrCompanyName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}></Button>
          <Button onClick={handleAddCategoryOrCompany}>{locales.buttons.add}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Items;
