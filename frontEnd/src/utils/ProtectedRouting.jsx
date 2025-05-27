import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRouting = ({allowedRoles}) => {
  const token = sessionStorage.getItem('authToken'); 
  const user = JSON.parse(sessionStorage.getItem('user'));
  console.log(user);
  if(!token){
    return <Navigate to="/login"/>
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" />; 
  }
  return <Outlet/>
};

export default ProtectedRouting;
