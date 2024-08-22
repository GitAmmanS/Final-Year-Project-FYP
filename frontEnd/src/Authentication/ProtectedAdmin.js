import React from 'react'
import { useUser } from './UserContext';
import { useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedAdmin = (props) => {
    const {Component} =props;
    const { name } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
      if(name !=="Dr Aqib"){
        navigate("/login");
      }

    }, [])
    
    
    
  return (
    <div>
        <Component/>
    </div>
  )
}

export default ProtectedAdmin