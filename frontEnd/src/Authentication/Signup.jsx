import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.scss"
import signupLogo from '../Images/signup logo.png'
import bcrypt from 'bcryptjs';
import { BaseUrl } from '../BaseUrl';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAdress] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const response = await axios.post(`${BaseUrl}/users`, {
        name,
        email,
        password:hashedPassword,
        role_ID:"user",
        rank_ID: address,
        phone:phone
      });

      if (response) {
        alert('SignUp Successfully');
        navigate('/login');
      } else {
        setErrorMessage('An error occurred during signup. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className='signuppage'>
      <section className='signup'>
        <img src={signupLogo} alt="Signup"/>
        <form onSubmit={submitHandler}>
          <input 
            type='text' 
            placeholder='Enter Name' 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type='email' 
            placeholder='Enter Email' 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type='number' 
            placeholder='Enter Phone' 
            required 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input 
            type='password' 
            placeholder='Enter Password' 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input 
            type='password' 
            placeholder='Confirm Password' 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />


          {errorMessage && <p className='error'>{errorMessage}</p>}
          <div className='buttons'>
            <button type='submit'>Submit</button>
            <button type='button' onClick={() => { navigate("/login") }}>Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Signup;