import React, { useState, useEffect, useRef } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, FormControl, InputLabel, Select, Avatar, Tooltip, Toolbar } from '@mui/material';
import axios from 'axios';
import { BaseUrl } from '../utils/BaseUrl'
import Swal from 'sweetalert2';
import { MdMoreVert } from "react-icons/md";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineInventory2 } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/AxiosInstance'
import { FaCircleArrowLeft } from 'react-icons/fa6';
import Loading from 'react-loading';

const RoomResource = () => {
  const location = useLocation();
  const { name } = location.state || '';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState([]);
  const [Loader, setLoader] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [toggleStates, setToggleStates] = useState({});
  const menuRef = useRef(null);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const handleToggle = (roomId) => {
    setToggleStates((prev) => ({
      ...prev,
      [roomId]: true,
    }));
    console.log(toggleStates[rooms[0]._id]);
  };
  useEffect(() => {
    console.log('Updated toggleStates:', toggleStates);
  }, [toggleStates]);

  useEffect(() => {
    axiosInstance.get((`${BaseUrl}/users/`)).then((res) => {
      setUser(res.data.data.filter((user) => user.role !== "admin"));
    }).catch((error) => {
      console.log(error.message);
    })
  }, [])
  const [roomData, setRoomData] = useState({
    incharge: '', type: name, status: 'active', number: '', roomId: ''
  });

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setRoomData({ incharge: '', type: name, status: 'active', number: '', roomId: '' }); // Reset form
    setEdit(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRoomData((prev) => {
      if (name === "number") {
        const formattedType = (prev.type || "").toUpperCase().replace("_", " ");
        return {
          ...prev,
          [name]: `${formattedType}-${value}`,
        };
      }

      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggleStates({});
        console.log('EVENT CLCIK');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {

    const fetchRooms = async () => {
      setLoader(true);
      console.log(Loader);
      try {
        const response = await axios.get(`${BaseUrl}/lab/${name}`);
        setRooms(response.data.data);
        console.log(Loader);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoader(false);
        console.log(Loader);
      }
    };
    fetchRooms();

  }, [name, submit]);

  const handleSubmit = async () => {
    try {
      let title = '';
      if (edit) {
        const response = await axios.put(`${BaseUrl}/lab/put`, roomData)
        setSubmit(!submit);
        title = 'Resource Updated Successfully';
      }
      else {
        const response = await axios.post(`${BaseUrl}/lab/post`, roomData)
        setSubmit(!submit);
        title = 'Resource Added Successfully';
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: title,
        showConfirmButton: false,
        timer: 2000,
        width: "380px",
        height: "20px"
      });
      title = ''

      handleDialogClose();
    } catch (error) {
      console.error('Error adding room:', error);
      handleDialogClose();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });
    }
  };
  const handleEdit = (room) => {
    const formattedType = (room.type || "").toUpperCase().replace('_', ' ');
    const formattedNumber = `${formattedType}-${room.number.replace(/^.*-/, '')}`;

    setRoomData({
      incharge: room.incharge?.name,
      type: room.type,
      status: room.status,
      number: formattedNumber,
      roomId: room._id,
    });

    setDialogOpen(true);
    setEdit(true);
  };


  const ShowInventory = (room) => {
    console.log(room);
    navigate('showInventory', { state: { id: room } });
  }
  return (
    !Loader ? (
      <>
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/resourceCard')}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                <FaCircleArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {(name.toUpperCase()).replace('_', ' ')}
              </h2>
            </div>
            <button
              onClick={handleDialogOpen}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Add {(name.toUpperCase()).replace('_', ' ')}
            </button>
          </div>

          {rooms.length > 0 ? (
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="relative p-5 min-w-80 bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className='mb-4'>
                      <span className="font-bold">{room.number}</span>
                    </div>
                    <button
                      onClick={() => handleToggle(room._id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
                    >
                      <MdMoreVert size={20} />
                    </button>
                  </div>{
                    console.log(room.incharge)
                  }
                  <div className="flex flex-wrap gap-10 mb-3 ">
                    {room.incharge? 
                      <div key={room?.incharge?._id} className=" flex items-center  space-x-3">
                        {room?.incharge?.picture ? (
                          <Avatar
                            src={`${BaseUrl}/${room?.incharge?.picture}`}
                            className="w-10 h-10"
                          />
                        ) : (
                          <Avatar className="w-10 h-10 bg-blue-500">
                            {room?.incharge?.name?.charAt(0) || '?'}
                          </Avatar>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{room?.incharge?.name || 'Unassigned'}</h3>
                          <span className="text-xs text-gray-500">Incharge</span>
                        </div>
                      </div>:
                      ''
                    }
                  </div>




                  <div className="space-y-2 mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${room.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {room.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {toggleStates[room._id] && (
                    <div
                      ref={menuRef}
                      className="absolute right-2 top-12 bg-white shadow-lg rounded-md py-1 z-10 w-48 border border-gray-100"
                    >
                      <button
                        onClick={() => handleEdit(room)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <MdOutlineModeEdit size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => ShowInventory(room)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <MdOutlineInventory2 size={16} />
                        <span>Inventory</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">No {name.replace('_', ' ')} available</h3>
              <p className="text-gray-500 mt-1">Add a new {name.replace('_', ' ')} to get started</p>
            </div>
          )}
        </div>

        <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
          <div className="bg-white rounded-lg">
            <DialogTitle className="border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {edit ? "Edit Room" : "Add Room"}
              </h3>
            </DialogTitle>
            <DialogContent className="pt-4 space-y-4">
              <FormControl fullWidth>
                <InputLabel>Incharge</InputLabel>
                <Select
                  name="incharge"
                  value={roomData.incharge}
                  onChange={handleChange}
                  className="bg-gray-50"
                >
                  {user?.map((userName) => (
                    <MenuItem key={userName._id} value={userName.name}>
                      <div className="flex items-center space-x-3">
                        {userName.picture ? (
                          <Avatar src={`${BaseUrl}/${userName.picture}`} className="w-8 h-8" />
                        ) : (
                          <Avatar className="w-8 h-8 bg-blue-500">
                            {userName.name?.charAt(0)}
                          </Avatar>
                        )}
                        <span>{userName.name}</span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                name="number"
                label="Room Number"
                type="number"
                fullWidth
                value={roomData.number.replace(/^.*-/, '')}
                onChange={handleChange}
                className="bg-gray-50"
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={roomData.status}
                  onChange={handleChange}
                  className="bg-gray-50"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions className="border-t px-6 py-3">
              <button
                onClick={handleDialogClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg"
              >
                {edit ? "Update" : "Add"}
              </button>
            </DialogActions>
          </div>
        </Dialog>
      </>
    ) : (
      <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
        <Loading type="spin" color="#2C6B38" />
      </div>
    )
  );
};

export default RoomResource;
