import React from 'react'
import LogoImg from '../Images/LogoImage.png'
import "./Header.scss"
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header>
      <div className="logo">
        <img src={LogoImg} alt={'pic'} onClick={()=>{navigate('/')} }/>
        <h4>UIIT LabXperts </h4>
      </div>
      <div className="nav">

           <Link className='log' to="/login">LogOut</Link>
                    


      </div>
    </header>
  )
}

export default Header