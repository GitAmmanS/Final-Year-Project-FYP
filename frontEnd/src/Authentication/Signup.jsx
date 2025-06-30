import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../utils/BaseUrl';
import uniBg from '../Images/PMAS-Arid-Agriculture-University.jpg.webp';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Loading from 'react-loading';

let locales;
const language = sessionStorage.getItem('language');
if (language === 'english' || language == null) {
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
  const [Loader, setLoader] = useState(false);
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
      setLoader(true);
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
        setLoader(false);
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
      setLoader(false);
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
    <div className="flex items-center justify-center min-h-screen w-screen p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-6xl h-auto md:h-[85%] shadow-2xl rounded-2xl overflow-hidden">
        <div className="w-full md:w-[60%] h-48 md:h-auto">
          <img
            src={uniBg}
            alt="University"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-full md:w-[40%] md:h-[80vh] flex justify-center flex-col bg-white p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-4">
            Sign Up
          </h2>
          <form
            onSubmit={submitHandler}
            className="w-full max-w-md p-4 md:p-6 bg-white rounded-lg"
          >
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                required
                value={initialEmail}
                onChange={(e) => setInitialEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <input
                type="number"
                placeholder="Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4 relative">
              <input
                type={showPassword1 ? 'text' : 'password'}
                placeholder="Password"
                required
                value={initialPassword}
                onChange={(e) => setInitialPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword1(!showPassword1)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword2 ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="mb-4">
              <label className='block text-gray-500 mb-1'>Choose Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm"
              />
            </div>

            {Loader ? (
              <div className="flex justify-center items-center my-4">
                <Loading type="bubbles" color="#2C6B38" height={50} width={50} />
              </div>
            ) : (
              <Stack sx={{ width: '100%' }} spacing={2}>
                {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
              </Stack>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-900 text-white rounded-md py-2 px-4 flex-1"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="bg-gray-800 hover:bg-gray-700 text-white rounded-md py-2 px-4 flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;