import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/AxiosInstance";
import Loading from 'react-loading'
import { BaseUrl } from "../utils/BaseUrl";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";

const User = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [SubmitCondition, setSubmitCOndition] = useState(false);

  useEffect(() => {
    setLoader(true);
    axiosInstance.get(`${BaseUrl}/users`)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setLoader(false);
      })
  }, [SubmitCondition]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };
  const handleSubmit = async () => {
    try {
      const id = selectedUser._id;
      await axiosInstance.put(`${BaseUrl}/users/${id}`, {
        role: selectedUser.role,
      });
      setSubmitCOndition(!SubmitCondition);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Updated Sucessfully",
        showConfirmButton: false,
        timer: 2000,
        width: "380px",
        height: "20px"
      });
      setOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update user");
    }
  };


  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">User List</h2>
      {
        !loader ?
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-500 text-white">
                <tr className="border-2 border-gray-600">
                  <th className="py-2 px-4 border-2 text-left">S/n</th>
                  <th className="py-2 px-4 border-2 text-left">Name</th>
                  <th className="py-2 px-4 border-2 text-left">Email</th>
                  <th className="py-2 px-4 border-2 text-left">Role</th>
                  <th className="py-2 px-4 border-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.filter((user) => user.role !== "admin")
                    .map((user, index) => (
                      <tr key={user._id} className='border-b text-sm even:bg-slate-300'>
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{user.name}</td>
                        <td className="py-2 px-4">{user.email}</td>
                        <td className="py-2 px-4">{user.role}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Edit Role
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> :
          <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
            <Loading type="spin" color="#2C6B38" />
          </div>
      }


      {/* Edit User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={selectedUser?.name || ""}
            margin="dense"
            readOnly
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={selectedUser?.email || ""}
            margin="dense"
            readOnly
          />
          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={selectedUser?.role || ""}
            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
            margin="dense"
          >
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="lab_Incharge">Lab Incharge</MenuItem>
            <MenuItem value="technician">Technician</MenuItem>
            <MenuItem value="store_Incharge">Store Incharge</MenuItem>
          </TextField>


        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default User;
