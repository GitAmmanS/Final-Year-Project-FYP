import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRouting = ({allowedRoles}) => {
  const token = localStorage.getItem('authToken'); 
  const user = JSON.parse(localStorage.getItem('user'));

  if(!token){
    return <Navigate to="/login"/>
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" />; 
  }
  return <Outlet/>
};

export default ProtectedRouting;
