import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import signupLogo from '../Images/signup logo.png'
import { BaseUrl } from '../BaseUrl';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${BaseUrl}/users/`, {
        name:name,
        email:email,
        password:password,
        role_ID:"66c0ea1de8af93572258aeae",
        rank_ID: '66c0ea6be8af93572258aeb2',
        phone:phone
      });
      if (response.status === 200) {  
        setSuccessMessage('Verification email has been sent to your account.Please Check your email.');
        setErrorMessage('');  
    }
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className='flex justify-center items-center w-screen h-screen bg-white '>
      
        <form onSubmit={submitHandler}
        className='flex flex-col '>
          <h2 className='flex justify-center mb-8 text-2xl font-bold text-gray-600 '>Sign Up</h2>
          <div className="mb-4">
          <input 
            type='text' 
            placeholder='Enter Name' 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          </div>
          <div className='mb-4'>
          <input 
            type='email' 
            placeholder='Enter Email' 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          </div>
          <div className="mb-4">
          <input 
            type='number' 
            placeholder='Enter Phone' 
            required 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          </div>
          <div className="mb-4">
          <input 
            type='password' 
            placeholder='Enter Password' 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"

          />
          </div>
          <div className="mb-4">
          <input 
            type='password' 
            placeholder='Confirm Password' 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"

          />
          </div>

          {successMessage && <div className='message'>{successMessage}</div>}
          {errorMessage && <p className='error'>{errorMessage}</p>}
          <div className='flex justify-between px-5 mt-2 text-white'>
            <button className=' hover:bg-blue-600 bg-blue-500 rounded-md w-20 h-10' type='submit' >Submit</button>
            <button className=' hover:bg-slate-700 bg-slate-900 rounded-md w-20 h-10' type='button' onClick={() => { navigate("/login") }}>Cancel</button>
          </div>
        </form>
    </div>
  );
};

export default Signup;
