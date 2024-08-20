import Home from './Home/Home'
import Header from './Header/Header'
import "./App.scss"
import SideMenu from './SideMenu/SideMenu';
import { BrowserRouter as Router ,Routes ,Route } from 'react-router-dom';
import Items from './Items/Items';
import Login from './Authentication/Login';
function App() {
  return (
    <Router>
       <Header/>
       <div className='mainclass'>
        <SideMenu/>
       
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/item' element={<Items/>}/>
      <Route path='/login' element={<Login/>}/>
      </Routes>
      </div>
    </Router>
  );
}

export default App;
