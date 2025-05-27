import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/AxiosInstance";
import Loading from 'react-loading'
import { PieChart } from '@mui/x-charts/PieChart';
import { BaseUrl } from "../utils/BaseUrl";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
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
import axios from "axios";

const User = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [labs, setlabs] = useState(null);
  const [labNumber, setlabNumber] = useState(null);
  const [SubmitCondition, setSubmitCOndition] = useState(false);
  const [TableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [statusUser, setStatusUser] = useState({
    lab_Incharge: 0,
    store_Incharge: 0,
    teacher: 0,
    technician: 0,
  })

  useEffect(() => {
    const filteredUsers = users
      .filter(user => {
        return user.role !== 'admin';
      })
      .map((user, index) => ({
        "S/N": index + 1,
        "Name": user.name.toUpperCase(),
        "Email": user.email.toLowerCase(),
        "Role": (user.role.toUpperCase()).replace('_', ' '),
        "Photo": (<img src={`${BaseUrl}/${user.picture}`} className="max-w-[70px] max-h-[70px] min-w-[70px] min-h-[70px]" />),
        "Action": (<button onClick={() => handleEdit(user)}>Action</button>)
      }));

    setTableData(filteredUsers);

    setColumns([
      { accessorKey: 'S/N', header: 'S/N' },
      { accessorKey: 'Name', header: 'Name' },
      { accessorKey: 'Email', header: 'Email' },
      { accessorKey: 'Role', header: 'Role' },
      { accessorKey: 'Photo', header: 'Photo' },
      {
        accessorKey: 'Action',
        header: 'Action',
        Cell: ({ cell }) => {
          const action = cell.getValue();
          return (
            <span className={`bg-blue-500 text-white px-3 py-1 rounded-[10px] hover:bg-blue-700`}>
              {action}
            </span>
          );
        }
      }
    ]);
  }, [users])

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
  useEffect(() => {
    const fetchLabs = async () => {
      setLoader(true);
      try {
        let response;
        if (selectedUser?.role === 'lab_Incharge') {
          response = await axios.get(`${BaseUrl}/lab/lab`);
        } else {
          response = await axios.get(`${BaseUrl}/lab/staff_room`);
        }
  
        setlabs(response.data.data);
        const filterResult = response.data.data.filter((e) => (e.incharge?._id === selectedUser._id));
        setlabNumber(filterResult[0]?.number || null);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoader(false);
      }
    };
    if (selectedUser) {
      fetchLabs();
    }
  }, [selectedUser]);
  


  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };
  const handleSubmit = async () => {
    try {
      const id = selectedUser._id;
      const previousRole = users.find(u => u._id === id)?.role;
      await axiosInstance.put(`${BaseUrl}/users/${id}`, {
        role: selectedUser.role,
      });
      if (selectedUser.role === 'lab_Incharge' || selectedUser.role === "teacher") {
        await axios.put(`${BaseUrl}/lab/UpdateLabIncharge`, {
          ids: id,
          labNum: labNumber
        });
      // }
      // const oldLab = labs.find((lab) => lab.incharge?._id === id && lab.number !== labNumber);
      // if (oldLab) {
      //   await axios.put(`${BaseUrl}/lab/UpdateLabIncharge`, {
      //     ids: null,
      //     labNum: oldLab.number
      //   });
      }
      if ((previousRole === 'lab_Incharge' || previousRole === 'teacher') && (selectedUser.role !== 'lab_Incharge' && selectedUser.role !== 'teacher')) {
        await axios.put(`${BaseUrl}/lab/deleteLabIncharge/`, {
            ids: selectedUser._id,
          })
      }


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
  useEffect(() => {

    const initialStatusUser = {
      lab_Incharge: 0,
      store_Incharge: 0,
      teacher: 0,
      technician: 0,
    };

    users.forEach((item) => {
      if (item.role && initialStatusUser[item.role] !== undefined) {
        initialStatusUser[item.role] += 1;
      }
    });
    setStatusUser(initialStatusUser);
  }, [users]);




  const table = useMaterialReactTable({
    columns,
    data: TableData,
    muiTableHeadCellProps: {
      className: "[&.MuiTableCell-head]:bg-[#1B4D3E] [&.MuiTableCell-head]:text-white",
    },
    muiTableBodyCellProps: {
      className: "[&.MuiTableCell-body]:bg-[#FAF0E6]",
    },
  });

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">User List</h2>
      {
        !loader ?
          <>
            <div className="flex flex-row">

              <div className='relative w-[350px] h-[300px]  z-[1] ml-[20%]  flex justify-center items-center'>
                <PieChart
                  series={[
                    {
                      data: [
                        { title: "lab_Incharge", value: (statusUser.lab_Incharge / (users.filter((user) => user.role !== "admin").length)) * 100, color: '#5DB963' },
                        { title: 'store_Incharge', value: (statusUser.store_Incharge / (users.filter((user) => user.role !== "admin").length)) * 100, color: '#B95D8B' },
                        { title: 'teacher', value: (statusUser.teacher / (users.filter((user) => user.role !== "admin").length)) * 100, color: '#E8DA0F' },
                        { title: 'technician', value: (statusUser.technician / (users.filter((user) => user.role !== "admin").length)) * 100, color: '#17C2AB' },
                      ],
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: { innerRadius: 40, additionalRadius: -20, color: 'gray' },
                      innerRadius: 55,
                    },
                  ]}
                  height={200}
                />
                <div className='absolute top-[42%] left-[24%] w-[90px] h-[50px] text-[22px] flex flex-col justify-center items-center'>
                  {users.filter((user) => user.role !== "admin").length}
                  <span className='text-[#000000] opacity-[60%] text-[16px]'>Total Users</span>
                </div>
              </div>
              <div className='ml-[10px] my-[30px] grid grid-rows-2 grid-cols-2 w-[400px]  '>
                <div className="flex flex-row justify-center items-center space-x-3">
                  <div className='w-6 h-6 rounded-[50%] bg-[#5DB963]'></div>
                  <div className='w-[120px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
                    {statusUser.lab_Incharge}
                    <span className='text-[#000000] opacity-[60%] text-[14px]'>Lab Incharge</span>
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center space-x-3">
                  <div className='w-6 h-6 rounded-[50%] bg-[#E8DA0F]'></div>
                  <div className='w-[120px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
                    {statusUser.teacher}
                    <span className='text-[#000000] opacity-[60%] text-[14px]'>Teacher</span>
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center space-x-3">
                  <div className='w-6 h-6 rounded-[50%] bg-[#B95D8B]'></div>
                  <div className='w-[120px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
                    {statusUser.store_Incharge}
                    <span className='text-[#000000] opacity-[60%] text-[14px]'>Store Incharge</span>
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center space-x-3">
                  <div className='w-6 h-6 rounded-[50%] bg-[#17C2AB]'></div>
                  <div className='w-[120px] h-[50px] text-[20px] flex flex-col justify-center items-start'>
                  {statusUser.technician}
                    <span className='text-[#000000] opacity-[60%] text-[14px]'>Technician</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <MaterialReactTable table={table} />
            </div>
          </> :
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
          {
            selectedUser?.role === "lab_Incharge" && (
              <TextField
                fullWidth
                select
                label="Lab"
                name="lab"
                value={labNumber || ""}
                onChange={(e) => setlabNumber(e.target.value)}
                margin="dense"
              >
                {
                  labs && labs.length > 0 &&
                  labs.map((lab, index) => (
                    <MenuItem value={lab.number}>{lab.number}</MenuItem>
                  ))
                }

              </TextField>
            )
          }
          {
            selectedUser?.role === "teacher" && (
              <TextField
                fullWidth
                select
                label="Staff Room"
                name="staff_room"
                value={labNumber || ""}
                onChange={(e) => setlabNumber(e.target.value)}
                margin="dense"
              >
                {
                  labs && labs.length > 0 &&
                  labs.map((lab, index) => (
                    <MenuItem value={lab.number}>{lab.number}</MenuItem>
                  ))
                }

              </TextField>
            )
          }


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
