import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MdOutlineInventory, MdOutlineInventory2, MdErrorOutline } from 'react-icons/md';
import { BiCategoryAlt } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { TbChecklist, TbBrandProducthunt } from "react-icons/tb";
import { GoAlert, GoChecklist, GoArchive } from "react-icons/go";
import { RiAlertLine, } from "react-icons/ri";
import { BaseUrl } from "../utils/BaseUrl";
import Loading from 'react-loading'
import { axiosInstance } from "../utils/AxiosInstance";

let locales;
const language = sessionStorage.getItem("language");
if (language === "english" || language == null

) {
  import("../locales/en.json").then((module) => {
    locales = module.default;
  });
} else {
  import("../locales/ur.json").then((module) => {
    locales = module.default;
  });
}

const Home = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const role = user?.role;
  const navigate = useNavigate();
  const [labProducts, setLabProducts] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentDemands, setRecentDemands] = useState([]);
  const [teacherComplaints, setTeacherComplaints] = useState([]);
  const [loader, setLoader] = useState(false);
  const [adminData, setAdminData] = useState({
    users: [],
    demands: [],
    complaints: [],
    mainDemands: [],
    storeProducts: [],
  });
  const [storeData, setStoreData] = useState({
    demands: [],
    mainDemands: [],
    storeProducts: [],
    category: 0,
  });
  const [labData, setLabData] = useState({
    demands: [],
    complaints: [],
    labProducts: 0,
  });
  const [TechnicianData, setTechnicianData] = useState([]);
  const [TeacherData, setTeacherData] = useState([]);

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const filteredComplaints = (adminData.complaints || [])
      .filter?.(complaint => {
        const complaintDate = new Date(complaint.created_At).toISOString().slice(0, 10);
        return (complaintDate >= lastWeek && complaintDate <= today) && (complaint.status === 'pending' || complaint.status === 'in-progress');
      })
      .map(complaint => ({
        Number: complaint.number,
        'Complaint Date': new Date(complaint.created_At).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) || 'N/A',
        'Assigned To': complaint.assigned_to.name.toUpperCase(),
        Status: complaint.status.toUpperCase(),
        'Generated By': complaint.generated_by.name.toUpperCase(),

      }));
    setRecentComplaints(filteredComplaints);
  }, [adminData.complaints]);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const filteredDemands = storeData.demands
      .filter(demand => {
        const demandDate = new Date(demand.dateRequested).toISOString().slice(0, 10);
        return (demandDate >= lastWeek && demandDate <= today) && (demand.demandStatus === 'pending' || demand.demandStatus === 'partially resolved');
      })
      .map(demand => ({
        'Request Number': demand.number,
        'Requested Date': demand ? new Date(demand.dateRequested).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) : 'N/A',
        'Requested By': demand.requester.name.toUpperCase(),
        Role: (demand.requester.role).replace(/_/g, ' ').toUpperCase(),
        Status: demand.demandStatus.toUpperCase(),
      }));
    setRecentDemands(filteredDemands);
  }, [storeData.demands]);
  useEffect(() => {
    console.log(labData);
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const filteredComplaints = labData?.complaints?.filter?.(complaint => {
        const complaintDate = new Date(complaint.created_At).toISOString().slice(0, 10);
        return (complaintDate >= lastWeek && complaintDate <= today) && (complaint.status === 'pending' || complaint.status === 'in-progress') &&(complaint.assigned_to._id === user._id);
      })
      .map(complaint => ({
        Number: complaint.number,
        'Complaint Date': complaint ? new Date(complaint.created_At).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) : 'N/A',
        'Generated By': complaint.generated_by.name.toUpperCase(),
        Status: complaint.status.toUpperCase(),
      }));
    setRecentComplaints(filteredComplaints);
  }, [labData.complaints]);
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const filteredComplaints = TechnicianData?.filter?.(complaint => {
        const complaintDate = new Date(complaint.created_At).toISOString().slice(0, 10);
        console.log(complaint)
        return (complaintDate >= lastWeek && complaintDate <= today) && (complaint.status === 'pending' || complaint.status === 'in-progress') &&(complaint.assigned_to._id === user._id);;
      })
      
      .map(complaint => ({
        Number: complaint.number,
        'Complaint Date': complaint ? new Date(complaint.created_At).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) : 'N/A',
        'Generated By': complaint.generated_by.name.toUpperCase(),
        Status: complaint.status.toUpperCase(),
      }));
    setRecentComplaints(filteredComplaints);
  }, [TechnicianData]);
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' });
    console.log(today);
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const filteredComplaints = TeacherData?.filter?.(complaint => {
      const complaintDate = new Date(complaint.created_At).toISOString().slice(0, 10);
      return (complaintDate >= lastWeek && complaintDate <= today) && (complaint.status === 'pending' || complaint.status === 'in-progress');
    })
      .map(complaint => ({
        Number: complaint.number,
        'Complaint Date': complaint ? new Date(complaint.created_At).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) : 'N/A',
        'Generated By': complaint.generated_by.name.toUpperCase(),
        Status: complaint.status.toUpperCase(),
      }));
    setRecentComplaints(filteredComplaints);
    console.log(filteredComplaints);
  }, [TeacherData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoader(true);
        if (role === 'lab_Incharge') {
          const [demandsRes, complains, inventory] = await axios.all([
            axios.get(`${BaseUrl}/demand/getByUserID/${user._id}`).catch(() => ({ data: { data: [] } })),
            axiosInstance.get(`${BaseUrl}/complain`).catch(() => ({ data: { message: [] } })),
            axios.get(`${BaseUrl}/productstore/getByUserId/${user._id}`).catch(() => ({ data: { data: [] } })),
          ]);
          setLabData({
            demands: demandsRes?.data.data,
            complaints: complains?.data.message,
            labProducts: inventory?.data?.data?.reduce?.((sum, item) => sum + item.quantity, 0),
          });
          setColumns([
            { accessorKey: 'Number', header: 'Number' },
            { accessorKey: 'Complaint Date', header: 'Complaint Date' },
            { accessorKey: 'Generated By', header: 'Generated By' },
            {
              accessorKey: 'Status',
              header: 'Status',
              Cell: ({ cell }) => {
                const status = cell.getValue();
                return (
                  <span className={`px-2 py-1 rounded text-white ${status == 'PENDING' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {status}
                  </span>
                );
              }
            }
          ]);
        }
        else if (role === 'technician') {
          const complaintRes = await axiosInstance.get(`${BaseUrl}/complain`);
          setTechnicianData(complaintRes.data.message);
          setColumns([
            { accessorKey: 'Number', header: 'Number' },
            { accessorKey: 'Complaint Date', header: 'Complaint Date' },
            { accessorKey: 'Generated By', header: 'Generated By' },
            {
              accessorKey: 'Status',
              header: 'Status',
              Cell: ({ cell }) => {
                const status = cell.getValue();
                return (
                  <span className={`px-2 py-1 rounded text-white ${status == 'PENDING' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {status}
                  </span>
                );
              }
            }
          ]);
        }
        else if (role === 'store_Incharge') {
          const [demandsRes, mainDemandsRes, storeProductsRes, Categories] = await axios.all([
            axios.get(`${BaseUrl}/demand`),
            axios.get(`${BaseUrl}/mainDemand`),
            axios.get(`${BaseUrl}/store`),
            axios.get(`${BaseUrl}/category`),
          ]);
          console.log(demandsRes);
          setStoreData({
            demands: demandsRes.data.data,
            mainDemands: mainDemandsRes.data.data,
            storeProducts: storeProductsRes.data.data,
            category: Categories.data.data?.length || 0,
          });
          setColumns([
            { accessorKey: 'Request Number', header: 'Request Number' },
            { accessorKey: 'Requested Date', header: 'Requested Date' },
            { accessorKey: 'Requested By', header: 'Requested By' },
            { accessorKey: 'Role', header: 'Role' },
            {
              accessorKey: 'Status',
              header: 'Status',
              Cell: ({ cell }) => {
                const status = cell.getValue();
                return (
                  <span className={`px-2 py-1 rounded text-white ${status == 'PENDING' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {status}
                  </span>
                );
              }
            }
          ]);

        } else if (role === 'admin') {
          const [usersRes, demandsRes, mainDemandsRes, complains, storeProductsRes] = await axios.all([
            axiosInstance.get(`${BaseUrl}/users`),
            axios.get(`${BaseUrl}/demand`),
            axios.get(`${BaseUrl}/mainDemand`),
            axiosInstance.get(`${BaseUrl}/complain`),
            axios.get(`${BaseUrl}/store`),
          ]);
          console.log(usersRes);
          console.log(demandsRes);
          console.log(mainDemandsRes);
          console.log(storeProductsRes.data.data);
          setAdminData({
            users: usersRes.data.data,
            demands: demandsRes.data.data,
            complaints: complains.data.message,
            mainDemands: mainDemandsRes.data.data,
            storeProducts: storeProductsRes.data.data,
          });
          setColumns([
            { accessorKey: 'Number', header: 'Number' },
            { accessorKey: 'Complaint Date', header: 'Complaint Date' },
            { accessorKey: 'Assigned To', header: 'Assigned To' },
            
            {
              accessorKey: 'Status',
              header: 'Status',
              Cell: ({ cell }) => {
                const status = cell.getValue();
                return (
                  <span className={`px-2 py-1 rounded text-white ${status == 'PENDING' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {status}
                  </span>
                );
              }
            },
            { accessorKey: 'Generated By', header: 'Generated By' },

          ]);

        }
        else if (role === 'teacher') {
          const complaintRes = await axiosInstance.get(`${BaseUrl}/complain/post/${user._id}`);
          setTeacherData(complaintRes.data.data);
          setColumns([
            { accessorKey: 'Number', header: 'Number' },
            { accessorKey: 'Complaint Date', header: 'Complaint Date' },
            {
              accessorKey: 'Status',
              header: 'Status',
              Cell: ({ cell }) => {
                const status = cell.getValue();
                return (
                  <span className={`px-2 py-1 rounded text-white ${status == 'PENDING' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {status}
                  </span>
                );
              }
            }
          ]);
        }

        setLoader(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoader(false);
      }
    };
    console.log(sessionStorage.getItem('authToken'));

    fetchData();

  }, [role, user._id]);

  const table = useMaterialReactTable({
    columns,
    data: (role === 'store_Incharge' ? recentDemands || [] : recentComplaints || []).reverse(),
    muiTableHeadCellProps: {
      className: "[&.MuiTableCell-head]:bg-[#1B4D3E] [&.MuiTableCell-head]:text-white",
    },
    muiTableBodyCellProps: {
      className: "[&.MuiTableCell-body]:bg-[#FAF0E6]",
    },
  });

  // const ProgressBar = ({ percentage }) => (  
  //   <CircularProgressbar
  //     value={percentage}
  //     text={`${percentage}%`}
  //     strokeWidth={12}
  //     styles={buildStyles({
  //       pathColor: '#FFFFFF',
  //       textColor: '#FFFFFF',
  //       trailColor: '#BCCCBF',
  //     })}
  //   />
  // );

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">{locales?.sidemenu?.dashboard}</h1>
      {
        !loader ?
          <div>
            {role === 'lab_Incharge' && (
              <div>
                <br />
                <div className="grid grid-cols-2 gap-12 max-w-full md:grid-cols-4">
                  <div className="bg-red-900 p-4  rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/viewDemands') }}>
                    <p className="text-lg font-bold">Total Requests</p>
                    <div className="flex items-center mt-6 justify-end">
                      <MdOutlineInventory className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(labData?.demands)? labData?.demands?.length : 0}</p>
                        <p className="text-lg text-gray-200">Requests</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-800 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">Total Complaints</p>
                    <div className="flex items-center mt-6 justify-end">
                      <RiAlertLine className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(labData.complaints)? labData?.complaints?.filter?.((complain)=>complain.assigned_to._id === user._id).length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-600 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">Pending</p>
                    <div className="flex items-center mt-6 justify-end">
                      <MdErrorOutline className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(labData?.complaints)? labData?.complaints?.filter?.(complain => complain.status === "pending" && complain.assigned_to._id === user._id)?.length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-600 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/labInventory') }}>
                    <p className="text-lg font-bold">Lab Items</p>
                    <div className="flex items-center mt-6 justify-end">
                      <BiCategoryAlt className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{labData?.labProducts || 0}</p>
                        <p className="text-lg text-gray-200">Items</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-row flex-wrap  min-[993px]:justify-between">

                  <div className='min-w-full'>
                    <h3 className="text-2xl font-semibold mb-2">{locales?.dashboard?.recent_com} <span className='text-lg font-semibold text-gray-500'>{locales?.sidemenu?.past_7days}</span></h3>
                    <MaterialReactTable table={table} />
                  </div>
                </div>
              </div>
            )}
            {role === 'technician' && (
              <div>
                <br />
                <div className="grid grid-cols-2 gap-12 max-w-full md:grid-cols-4">
                  <div className="bg-red-800 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">Total Complaints</p>
                    <div className="flex items-center mt-6 justify-end">
                      <RiAlertLine className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(TechnicianData)? TechnicianData?.filter?.((complain)=>complain.assigned_to._id === user._id).length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-600 p-4  rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">Pending</p>
                    <div className="flex items-center mt-6 justify-end">
                      <MdErrorOutline className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(TechnicianData)? TechnicianData?.filter?.(complain => complain.status === "pending" && complain.assigned_to._id === user._id)?.length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-800 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">In Progress</p>
                    <div className="flex items-center mt-6 justify-end">
                      <BiCategoryAlt className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(TechnicianData)? TechnicianData?.filter?.(complain => complain.status === "in-progress" && complain.assigned_to._id === user._id)?.length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-600 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">Resolved</p>
                    <div className="flex items-center mt-6 justify-end">
                      <TbChecklist className="text-[40px] text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(TechnicianData)? TechnicianData?.filter?.(complain => complain.status === "resolved" && complain.assigned_to._id === user._id)?.length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-row flex-wrap  min-[993px]:justify-between">

                  <div className='min-w-full'>
                    <h3 className="text-2xl font-semibold mb-2">{locales?.dashboard?.recent_com}  <span className='text-lg font-semibold text-gray-500'>{locales?.sidemenu?.past_7days}</span></h3>
                    <MaterialReactTable table={table} />
                  </div>
                </div>
              </div>
            )}

            {role === 'store_Incharge' && (
              <div>
                <br />
                <div className="grid grid-cols-2 gap-12 max-w-full md:grid-cols-4">
                  <div className="bg-pink-900 p-4  rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/demandsList') }}>
                    <p className="text-lg font-bold">Total Requests</p>
                    <div className="flex items-center mt-6 justify-end">
                      <MdOutlineInventory className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(storeData.demands)? storeData?.demands?.length : 0}</p>
                        <p className="text-lg text-gray-200">Requests</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-600 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/viewMainDemand') }}>
                    <p className="text-lg font-bold">Main Demands</p>
                    <div className="flex items-center mt-6 justify-end">
                      <TbChecklist className="text-[40px] text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(storeData.mainDemands)? storeData?.mainDemands?.length : 0}</p>
                        <p className="text-lg text-gray-200">Demands</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-600 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/product') }} >
                    <p className="text-lg font-bold">Store Products</p>
                    <div className="flex items-center mt-6 justify-end">
                      <TbBrandProducthunt className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(storeData.storeProducts)? storeData?.storeProducts?.length : 0}</p>
                        <p className="text-lg text-gray-200">Products</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-600 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/product') }} >
                    <p className="text-lg font-bold">Product Categories</p>
                    <div className="flex items-center mt-6 justify-end">
                      <MdOutlineInventory2 className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{storeData.category || 0}</p>
                        <p className="text-lg text-gray-200">Categories</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-row flex-wrap  min-[993px]:justify-between">

                  <div className='min-w-full'>
                    <h3 className="text-2xl font-semibold mb-2">{locales?.sidemenu?.rec_req}<span className='text-lg font-semibold text-gray-500'>{locales?.sidemenu?.past_7days}</span></h3>
                    <MaterialReactTable table={table} />
                  </div>
                </div>
              </div>
            )}

            {role === 'teacher' && (
              <div>
                <br />
                <div className="grid grid-cols-2 gap-12 max-w-full md:grid-cols-4">
                  <div className="bg-red-800 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">Total Complaints</p>
                    <div className="flex items-center mt-6 justify-end">
                      <RiAlertLine className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(TeacherData)? TeacherData?.filter?.((complain)=>complain.generated_by._id === user._id).length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-600 p-4  rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">Pending</p>
                    <div className="flex items-center mt-6 justify-end">
                      <MdErrorOutline className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(TeacherData)? TeacherData?.filter?.(complain => complain.status === "pending" && complain.generated_by._id === user._id)?.length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-800 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">In Progress</p>
                    <div className="flex items-center mt-6 justify-end">
                      <BiCategoryAlt className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(TeacherData)? TeacherData?.filter?.(complain => complain.status === "in-progress" && complain.generated_by._id === user._id)?.length :0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-600 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }}>
                    <p className="text-lg font-bold">Resolved</p>
                    <div className="flex items-center mt-6 justify-end">
                      <TbChecklist className="text-[40px] text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(TeacherData)? TeacherData?.filter?.(complain => complain.status === "resolved" && complain.generated_by._id === user._id)?.length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-row flex-wrap  min-[993px]:justify-between">

                  <div className='min-w-full'>
                    <h3 className="text-2xl font-semibold mb-2">{locales?.sidemenu?.my_complains} <span className='text-lg font-semibold text-gray-500'>{locales?.sidemenu?.past_7days}</span></h3>
                    <MaterialReactTable table={table} />
                  </div>
                </div>
              </div>
            )}

            {role === 'admin' && (
              <div>
                <br />
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="bg-slate-900 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => navigate('/user')}>
                    <p className="text-xl font-bold ">Total Users</p>
                    <div className="flex items-center mt-6 justify-end">
                      <CgProfile className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(adminData.users) ? adminData?.users?.filter?.((e)=>e.role!=='admin').length : 0}</p>
                        
                        <p className="text-lg text-gray-200">Users</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-900 p-4  rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/demandsList') }}>
                    <p className="text-lg font-bold">Total Demands</p>
                    <div className="flex items-center mt-6 justify-end">
                      <MdOutlineInventory className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(adminData.demands)?  adminData?.demands?.length : 0}</p>
                        <p className="text-lg text-gray-200">Demands</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-600 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/complains') }} >
                    <p className="text-lg font-bold">Total Complaints</p>
                    <div className="flex items-center mt-6 justify-end">
                      <MdErrorOutline className="text-4xl text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(adminData.complaints)? adminData?.complaints?.length : 0}</p>
                        <p className="text-lg text-gray-200">Complaints</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-600 p-4 rounded-md max-w-56 min-h-36 text-white hover:cursor-pointer hover:scale-[1.05] hover:transition-[2.0]" onClick={() => { navigate('/viewMainDemand') }}>
                    <p className="text-lg font-bold">Main Demands</p>
                    <div className="flex items-center mt-6 justify-end">
                      <TbChecklist className="text-[40px] text-gray-300 mr-4" />
                      <div>
                        <p className="text-lg font-bold text-right">{Array.isArray(adminData.mainDemands) ? adminData?.mainDemands?.length :0}</p>
                        <p className="text-lg text-gray-200">Demands</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-row flex-wrap  min-[993px]:justify-between">

                  <div className='max-w-[700px]'>
                    <h3 className="text-2xl font-semibold mb-2">{locales?.dashboard?.recent_com} <span className='text-lg font-semibold text-gray-500'>{locales?.sidemenu?.past_7days}</span></h3>
                    <MaterialReactTable table={table} />
                  </div>
                  <div className='flex flex-col mt-4'>
                    <p className='pr-80  font-semibold text-2xl ' >{locales.dashboard.summary}</p>
                    <div className='flex mt-7 ml-4'>
                      <p className=' text-4xl text-gray-500 '> <MdOutlineInventory /> </p>
                      <div >
                        <p className='text-sm'>{Array.isArray(adminData.demands)? adminData?.demands?.length : 0}</p>
                        <p className='text-xs text-gray-500'>Total {locales.sidemenu.demand}</p>
                      </div>
                    </div>
                    <div className='flex mt-7 ml-4'>
                      <p className='text-4xl text-gray-500'><BiCategoryAlt /></p>
                      <div>
                        <p className='text-sm'>{Array.isArray(adminData.complaints)? adminData?.complaints?.length : 0} </p>
                        <p className='text-xs text-gray-500'>Total  {locales.sidemenu.complains}</p>
                      </div>
                    </div>
                    <div className='flex mt-7 ml-4'>
                      <p className='text-4xl text-gray-500'><CgProfile /></p>
                      <div>
                        <p className='text-sm'>{Array.isArray(adminData.users) ? adminData?.users?.filter?.((e)=>e.role!=='admin').length : 0}</p>
                        <p className='text-xs text-gray-500'>{locales.dashboard.total_users}</p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}
          </div> :
          <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
            <Loading type="spin" color="#2C6B38" />
          </div>
      }


    </div>
  );
};

export default Home;
