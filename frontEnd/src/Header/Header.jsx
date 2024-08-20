import React from 'react'
import "./Header.scss"
import { FaUser } from "react-icons/fa";
const Header = () => {
  return (
    <header>
      <div className="logo"><b>UIIT Lab Management </b></div>
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