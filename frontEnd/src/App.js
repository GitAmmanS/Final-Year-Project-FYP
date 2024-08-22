import Home from './Home/Home'
import Header from './Header/Header'
import "./App.scss"
import SideMenu from './SideMenu/SideMenu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Items from './Items/Items';
import More from './Items/More';
import Login from './Authentication/Login';
import Logout from './Authentication/Logout';
import Signup from './Authentication/Signup';
import ProtectedAdmin from './Authentication/ProtectedAdmin'
import ProtectedUser from './Authentication/ProtectedUser'
import { UserProvider } from './Authentication/UserContext';
function App() {
  return (
    <UserProvider>
    <Router>
      <Header />
      <div className='mainclass'>
        <SideMenu />

        <Routes>
          <Route path='/' element={<Home/>} /> 
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/item' element={<ProtectedAdmin Component={Items}/>} />
          <Route path='/logout' element={<Logout/>} />
          <Route path='/more' element={<ProtectedUser Component={More}/>} />
        </Routes>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;
