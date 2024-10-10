import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import "./Login.scss"
import loginLogo from '../Images/login logo.png'
import { BaseUrl } from '../BaseUrl';
const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${BaseUrl}/users/datasingle/${email}`)
      console.log(response.data.message[0]);
      const users = response.data.message[0];
      if (users) {
        console.log("user name:",users.name);
        console.log("user pass:",users.password);
        const verified = users.is_verified;
        const isPasswordMatch = await bcrypt.compare(password, users.password);
        if (isPasswordMatch && verified) {
          // setName(users.name);
          console.log("User Name set to:", users.name);
          const userName=users.name;
          console.log(userName);
          localStorage.setItem('userName', JSON.stringify(userName));
          alert("Login Successfully");
          navigate("/item");
        } else {
          setErrorMessage("Invalid email or password");
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };
  const emailSubmit=(event)=>{
    if(event.key==='Enter' ||event.type==='click'){
      email.endsWith("@gmail.com")
      ? setEmail(email)
      : email.endsWith("@gmail.co")
      ? setEmail(email + "m")
      : email.endsWith("@gmail.c")
      ? setEmail(email + "om")
      : email.endsWith("@gmail.")
      ? setEmail(email + "com")
      : email.endsWith("@gmail")
      ? setEmail(email + ".com")
      : email.endsWith("@gmai")
      ? setEmail(email + "l.com")
      : email.endsWith("@gma")
      ? setEmail(email + "il.com")
      : email.endsWith("@gm")
      ? setEmail(email + "ail.com")
      : email.endsWith("@g")
      ? setEmail(email + "mail.com")
      : email.endsWith("@")
      ? setEmail(email + "gmail.com")
      : email.includes('@')&& !email.endsWith("gmail.com")?setEmail(''):setEmail(email+"@gmail.com");
    }
  }

  return (
    <div className='loginpage'>
      <section className='login'>
        <img src={loginLogo} alt="img"/>
        <form onSubmit={submitHandler}>
          <input 
            type='email' 
            placeholder='Enter Email' 
            required 
            onKeyDown={emailSubmit}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type='password' 
            placeholder='Enter Password' 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className='error'>{errorMessage}</p>}
          <div className='buttons'>
            <button type='submit'>Ok</button>
            <button type='button' onClick={() => { navigate("/") }}>Cancel</button>
          </div>
        </form>
        <div className='signupbutton' onClick={() => { navigate('/signup') }}>
        No Account ,need to <span>signup?</span>
        </div>
      </section>
    </div>
  );
};

export default Login;
