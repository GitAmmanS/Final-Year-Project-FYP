import React from 'react'
import { useUser } from './UserContext';
import { useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedUser = (props) => {
    const {Component} =props;
    const { name } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
      if(name ==="" || name === null || name === undefined){
        navigate("/login");
      }

    }, [])
    
    
    
  return (
    <div>
        <Component/>
    </div>
  )
}

export default ProtectedUser