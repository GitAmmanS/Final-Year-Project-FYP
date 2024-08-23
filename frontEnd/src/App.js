import Home from './Home/Home'
import Header from './Header/Header'
import "./App.scss"
import SideMenu from './SideMenu/SideMenu';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Items from './Items/Items';
import More from './Items/More';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import ShowSomeTimes from "./ShowSomeTimes"

function App() {
  return (
    <Router>
      <ShowSomeTimes>
      <Header />
      </ShowSomeTimes>
      <div className='mainclass'>
      <ShowSomeTimes>
        <SideMenu />
    </ShowSomeTimes>
        <Routes>
          <Route path='/' element={<Home/>} /> 
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/item' element={<Items />} />
          <Route path='/more' element={<More/>} />
          
        </Routes>
      </div>
    </Router>

  );
}

export default App;
