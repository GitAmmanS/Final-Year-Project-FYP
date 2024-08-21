import React from 'react'
import LogoImg from '../Images/LogoImage.png'
import "./Header.scss"
import { FaUser } from "react-icons/fa";
const Header = () => {
  return (
    <header>
      <div className="logo">
        <img src={LogoImg} alt={'pic'} />
        <h4>UIIT Smart Labs </h4>
      </div>
      <div className="nav">
        <FaUser />
        <select name="logout" id="profile">
          <FaUser />
          <option value="">Admin </option>
          <option value="">Logout </option>
        </select>
      </div>
    </header>
  )
}

export default Header