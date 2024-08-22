import React from 'react'
import { useUser } from './UserContext'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const {setName}=useUser();
    setName('');
    const navigate = useNavigate();
    navigate("/");
  return (
    <div></div>
  )
}

export default Logout