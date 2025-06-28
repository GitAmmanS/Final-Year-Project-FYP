import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack'
import Swal from 'sweetalert2';
import Loading from 'react-loading'
import { CgProfile } from 'react-icons/cg';
import { BaseUrl } from '../utils/BaseUrl';
import { axiosInstance } from '../utils/AxiosInstance';

let locales;
const language = sessionStorage.getItem("language");
if (language === "english" || language==null) {
  import("../locales/en.json").then((module) => {
    locales = module.default;
  });
} else {
  import("../locales/ur.json").then((module) => {
    locales = module.default;
  });
}

const UserProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);
    const [loader, setLoader] = useState(false);
    const { userData } = location.state || {};

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        phone: userData?.phone || '',
        picture: userData?.picture || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        try {
            e.preventDefault();
            setLoader(true);
            const data = new FormData();

            data.append('name', formData.name);
            data.append('phone', formData.phone);


            if (formData.picture instanceof File) {
                data.append('picture', formData.picture);
            }
            const resp = await axiosInstance.put(`${BaseUrl}/users/updateProfile/${userData._id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (resp.status === 200) {
                setLoader(false);
                sessionStorage.setItem("user", JSON.stringify(resp.data.data));
                console.log(resp.data.data);
                navigate("/UserProfile", { state: { userData: resp.data.data } });
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Profile Updated Successfully",
                    showConfirmButton: false,
                    timer: 1000,
                    width: "380px",
                    height: "20px"
                });
                setIsEditing(false);
            }
        } catch (err) {
            setAlert({ severity: 'error', message: 'An error occurs' });
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error While Updating",
                width: "380px",
                height: "20px",
                customClass: {
                    confirmButton: "bg-[#22C55E] text-white",
                },
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                picture: file,
            }));
        }
        console.log(formData.picture);
        console.log(formData);
    };

    return (
        <div className="bg-gray-100 py-14 px-5 my-4 flex justify-center items-start">
            <div className="bg-white shadow-2xl py-6 rounded-xl w-full max-w-4xl p-8 min-h-[450px]">
                <div className="flex  items-center justify-center py-3 bg-gray-500 mb-16">
                    {
                        isEditing ? <h2 className="text-3xl font-semibold  text-white">{locales?.sidemenu?.edit_prof}</h2>
                            : <h2 className="text-3xl font-semibold  text-white">{locales?.sidemenu?.prof_info}</h2>
                    }

                </div>
                {
                    !loader ?
                        <div className="flex flex-col sm:flex-row gap-24">
                            <div className="flex-shrink-0">
                                <img
                                    src={
                                        formData.picture instanceof File
                                            ? URL.createObjectURL(formData.picture)
                                            : formData.picture
                                                ? `${BaseUrl}/${formData.picture}`
                                                : ''
                                    }
                                    alt="Profile"
                                    className="w-48 h-48 rounded-full object-cover"
                                />


                                {isEditing && (
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div>
                                    <p className="text-gray-500">Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
                                            required
                                        />
                                    ) : (
                                        <h3 className="text-lg font-semibold text-gray-800">{formData.name}</h3>
                                    )}
                                </div>
                                <div>
                                    <p className="text-gray-500">Phone</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
                                            required
                                        />
                                    ) : (
                                        <h3 className="text-lg font-semibold text-gray-800">{formData.phone}</h3>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500">Role (read-only)</p>
                                    <h3 className="text-md font-semibold text-gray-800">{userData.role.toUpperCase()}</h3>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500">Email (read-only)</p>
                                    <h3 className="text-md font-semibold text-gray-800">{userData.email}</h3>
                                </div>
                                <div className="flex gap-2 mt-6">
                                    {isEditing && (
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                        >
                                            Back
                                        </button>
                                    )}
                                    {isEditing ?
                                        <button
                                            type='submit'
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                        >
                                            Save Changes
                                        </button> : ''
                                    }
                                    {
                                        !isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-indigo-600 min-w-[80px] ml-16 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                                            >
                                                Edit
                                            </button>)
                                    }

                                </div>
                            </form>
                        </div> :
                        <div className="loading-container flex justify-center items-center pt-20 min-h-50 min-w-60">
                            <Loading type="spin" color="#6B7280" />
                        </div>

                }

                {
                    isEditing ?
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
                        </Stack> : ''
                }
            </div>
        </div>
    );
};

export default UserProfile;
