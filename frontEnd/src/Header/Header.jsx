import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import LogoImg from '../Images/LogoImage.png'

const Header = () => {
  const navigate = useNavigate();
  
  return (
  <header className=' bg-slate-600 w-full h-max sticky flex items-center '>
  
    <div className='w-20 h-max bg-cover mx-2 cursor-pointer'>
        <img src={LogoImg} alt={'pic'} onClick={()=>{navigate('/')} }/>
        </div>
        <div className='flex-1 flex items-center'>
        <h4 className='text-3xl text-slate-400 mx-3'>UIIT LabXperts</h4>
      </div>
      <div className='flex items-center'>
        <Link className='border-2 border-black p-2 text-white bg-red-600 hover:bg-red-700 rounded-md mr-2' to="/login">
          Logout
        </Link>
      </div>    
    </header> 
  )
}

export default Header