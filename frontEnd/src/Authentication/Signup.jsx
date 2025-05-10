import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../utils/BaseUrl';
import uniBg from '../Images/PMAS-Arid-Agriculture-University.jpg.webp';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

let locales;
const language = localStorage.getItem('language');
if (language === 'english') {
  import('../locales/en.json').then((module) => {
    locales = module.default;
  });
} else {
  import('../locales/ur.json').then((module) => {
    locales = module.default;
  });
}

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [initialPassword, setInitialPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [Picture, setPicture] = useState('');
  const [alert, setAlert] = useState(null);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (initialPassword !== confirmPassword) {
      setAlert({ severity: 'error', message: 'Password does not match' });
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Password & Confirm Password Do Not Match',
        width: '380px',
        height: '20px',
        customClass: {
          confirmButton: 'bg-[#22C55E] text-white',
        },
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', initialEmail);
      formData.append('password', initialPassword);
      formData.append('phone', phone);
      formData.append('role_ID', '66c0ea1de8af93572258aeae');
      formData.append('rank_ID', '66c0ea6be8af93572258aeb2');
      formData.append('picture', Picture);

      const response = await axios.post(`${BaseUrl}/users/`, formData);

      if (response.status === 200) {
        setAlert({
          severity: 'success',
          message: 'Account verification has been sent to your email',
        });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'User Registered Successfully',
          showConfirmButton: false,
          timer: 1500,
          width: '380px',
          height: '20px',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setAlert({
        severity: 'error',
        message: 'Invalid credentials, please try again.',
      });
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error While Signing Up',
        width: '380px',
        height: '20px',
        customClass: {
          confirmButton: 'bg-[#22C55E] text-white',
        },
      });
    }
  };

  const handleFileChange = (event) => {
    setPicture(event.target.files[0]);
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="w-[60%]">
        <img
          src={uniBg}
          alt="University"
          className="h-screen bg-no-repeat rounded-r-3xl"
        />
      </div>
      <div className="w-[40%] flex justify-center">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg relative"
        >
          <h2 className="text-2xl font-bold text-gray-600 text-center mb-8">
            Sign Up
          </h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              required
              value={initialEmail}
              onChange={(e) => setInitialEmail(e.target.value)}
              className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <input
              type="number"
              placeholder="Phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword1 ? 'text' : 'password'}
              placeholder="Password"
              required
              value={initialPassword}
              onChange={(e) => setInitialPassword(e.target.value)}
              className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword1(!showPassword1)}
              className="absolute right-4 top-2/4 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword1 ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword2 ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword2(!showPassword2)}
              className="absolute right-4 top-2/4 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword2 ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>

          <Stack sx={{ width: '100%' }} spacing={2}>
            {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
          </Stack>

          <div className="flex justify-between px-5 mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md w-24 h-10"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="bg-gray-800 hover:bg-gray-700 text-white rounded-md w-24 h-10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
