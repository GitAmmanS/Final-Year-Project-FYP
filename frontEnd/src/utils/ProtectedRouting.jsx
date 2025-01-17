import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRouting = () => {
  const user = JSON.parse(localStorage.getItem('userName')); 

  return user ? <Outlet /> : <Navigate to="/login"/>;
};

export default ProtectedRouting;
