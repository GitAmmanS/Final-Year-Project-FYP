import React, { useState, useEffect ,useRef} from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import axios from 'axios';
import { BaseUrl } from '../utils/BaseUrl'
import Swal from 'sweetalert2';
import { MdMoreVert } from "react-icons/md";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineInventory2 } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
const RoomResource = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState([]);
  const [toggleStates, setToggleStates] = useState({});
  const menuRef = useRef(null);
  const [edit,setEdit]=useState(false);
  const navigate = useNavigate();
const handleToggle = (roomId) => {
  setToggleStates((prev) => ({
    ...prev,
    [roomId]: !prev[roomId], 
  }));
};

  useEffect(() => {
    axios.get((`${BaseUrl}/users/`)).then((res) => {
      setUser(res.data.data);
    }).catch((error) => {
      console.log(error.message);
    })
  }, [])
  const [roomData, setRoomData] = useState({
    incharge: '', type: 'lab', status: 'active', number: 0,roomId:''
  });

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setRoomData({ incharge: '', type: 'lab', status: 'active', number: 0,roomId:'' }); // Reset form
    setEdit(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggleStates({});
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/lab`);
        setRooms(response.data.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);

      }
    };
    fetchRooms();
  }, [rooms]);

  const handleSubmit = async () => {
    try {
      if(edit){
        const response = await axios.put(`${BaseUrl}/lab/put`, roomData)
      }
      else{
      const response = await axios.post(`${BaseUrl}/lab/post`, roomData)
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Resource Added Successfully",
        showConfirmButton: true,
        timer: 2000,
        width: "380px",
        height: "20px"
      });

      handleDialogClose();
    } catch (error) {
      console.error('Error adding room:', error);
      handleDialogClose();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error In Adding Room",
        width: "380px",
        height: "20px",
        customClass: {
          confirmButton: "bg-[#22C55E] text-white",
        },
      });
    }
  };
  const handleEdit =(room)=>{
    setRoomData({ incharge: room.incharge?.name, type: room.type, status: room.status, number: room.number ,roomId:room._id});
    setDialogOpen(true);
    setEdit(true);
  }
  const ShowInventory =(room)=>{
    navigate('showInventory',{state:{id:room._id}});
  }
  return (
    <>
    <div className="m-4 p-6 bg-white shadow-lg rounded-lg">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">Rooms</h2>
      <button
        onClick={handleDialogOpen}
        className="text-sm font-medium border border-gray-300 w-32 h-10 text-black text-center p-2 rounded-lg shadow-md transition-all hover:bg-gray-200"
      >
        Add Room
      </button>
    </div>

    {rooms.length > 0 ? (
      <div className="flex gap-4 flex-wrap mt-2">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="p-4 text-sm border border-gray-300 bg-gray-50 rounded-lg shadow-md transition-all hover:shadow-lg hover:scale-105 cursor-pointer relative"
          >
            <p className="flex justify-between items-center">
              <strong>{room.type} Incharge:</strong> {room.incharge.name}
              <span
                className="text-lg pl-3 cursor-pointer"
                onClick={() => handleToggle(room._id)}
              >
                <MdMoreVert />
              </span>
            </p>
            <p>
              <strong>{room.type} No:</strong> {room.number}
            </p>
            <p>
              <strong>{room.type} Status:</strong> {room.status}
            </p>

            {toggleStates[room._id] && (
              <ul
                ref={menuRef}
                className="absolute right-2 top-10 bg-white border shadow-md rounded-md p-2"
              >
                <li
                  onClick={() => handleEdit(room)}
                  className="hover:text-gray-800 p-1 cursor-pointer flex items-center gap-2"
                >
                  Edit <MdOutlineModeEdit />
                </li>
                <li
                  onClick={() => ShowInventory(room)}
                  className="hover:text-gray-800 p-1 cursor-pointer flex items-center gap-2"
                >
                  Show Inventory <MdOutlineInventory2 />
                </li>
              </ul>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center mt-4">No rooms available.</p>
    )}
  </div>
<div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{`${edit?"Edit Room ":"Add Room"}`}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="incharge-label">Incharge</InputLabel>
            <Select
              name="incharge"
              value={roomData.incharge}
              onChange={handleChange}
            >
              {user?.map((userName, index) => (
                <MenuItem key={index} value={userName.name}>
                  {userName.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="type"
            label="Type"
            select
            fullWidth
            variant="outlined"
            value={roomData.type}
            onChange={handleChange}
          >
            <MenuItem value="lab">Lab</MenuItem>
            <MenuItem value="room">Room</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="number"
            label="Number"
            type='number'
            fullWidth
            variant="outlined"
            value={roomData.number}
            onChange={handleChange}
          />

          <TextField
            margin="dense"
            name="status"
            label="Status"
            select
            fullWidth
            variant="outlined"
            value={roomData.status}
            onChange={handleChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {`${edit? "Edit" : "Add"}`}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
  );
};

export default RoomResource;
