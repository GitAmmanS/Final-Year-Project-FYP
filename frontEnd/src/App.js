import Home from './Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Items from './Items/Items';
import More from './Items/More';
import Header from './Header/Header';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import Layout from './Layout';
import ShowSomeTimes from './ShowSomeTimes';
import LabResource from './Resources/labResource';
import ClassRoomResource from "./Resources/clRescource"
import Store from './Store/Store';
function App() {
  return (
    <Router>
      <Layout>
        <ShowSomeTimes>
      <Header/>
      </ShowSomeTimes>
        <Routes>
          <Route path='/' element={<Home/>} /> 
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/item' element={<Items />} />
          <Route path='/more/:_id' element={<More/>} />
          <Route path='/labs' element={<LabResource/>} />
          <Route path='/Cl' element={<ClassRoomResource/>} />
          <Route path='/store' element={<Store/>} />
        </Routes>
      </Layout>
    </Router>
   
  );
}

export default App;
