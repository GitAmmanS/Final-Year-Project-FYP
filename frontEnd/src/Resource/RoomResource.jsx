import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import {BaseUrl} from '../utils/BaseUrl'
import Swal from 'sweetalert2';
const RoomResource = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rooms, setRooms] = useState([]); 
  const [roomData, setRoomData] = useState({
    incharge: '', type: 'lab', status: 'active',number:0
     });

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setRoomData({ incharge: '', type: 'lab', status: 'active' ,number:0}); // Reset form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

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
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BaseUrl}/lab/post`, roomData)
  
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

  return (
    <div className="  m-4">
   <div className="flex justify-between">
      <div className="title text-lg text-gray-900 font-semibold mb-4">Add Rooms</div>

      <div>
        <button
          onClick={handleDialogOpen}
          className="text-sm border border-gray-300 w-28 h-10 text-black text-center p-2 rounded-lg shadow-md transition-all hover:bg-gray-200"
        >
          Add Room
        </button>
      </div>
      </div>
      <div className="flex gap-4 flex-wrap mt-2  ">
        {rooms.length>0 &&
        (rooms?.map((room) => (
          <div key={room._id} className="p-4 text-sm border border-gray-200 rounded-md shadow-lg 0 mb-2 cursor-pointer hover:bg-gray-200">
            <p>
              <strong>{room.type} Incharge:</strong> {room.incharge.name}
            </p>
            <p>
              <strong>{room.type} No :</strong> {room.number}
            </p>
            <p>
              <strong>{room.type} Status:</strong> {room.status}
            </p>
          </div>
       ) ))}
      </div>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Room</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="incharge"
            label="Incharge"
            type="text"
            fullWidth
            variant="outlined"
            value={roomData.incharge}
            onChange={handleChange}
          />
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
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomResource;
