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
import Product from './Products/Product'
import MoreInformation from './Products/MoreInformation';
import AddStore from './Store/AddStore';
import IssueItems from './Demands/IssueItems';
import DemandNotification from './Notifications/DemandNotification';
import DemandDetails from './Notifications/DemandDetails';
import ProtectedRouting from './utils/ProtectedRouting';
function App() {
  return (
    <Router>
      <Layout>
        <ShowSomeTimes>
      <Header/>
      </ShowSomeTimes>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route  element={<ProtectedRouting/>} >
          <Route path='/' element={<Home/>} /> 
          <Route path='/item' element={<Items />} />
          <Route path='/more/:_id' element={<More/>} />
          <Route path='/labs' element={<LabResource/>} />
          <Route path='/Cl' element={<ClassRoomResource/>} />
          <Route path='/store' element={<Store/>} />
          <Route path='/product' element={<Product/>} />
          <Route path='/product/moreInfo' element={<MoreInformation/>} />
          <Route path='/store/storeAdd' element={<AddStore/>} />
          <Route path='/issueItem' element={<IssueItems/>} />
          <Route path='/demandsList' element={<DemandNotification/>} />
          <Route path='/demandDetails' element={<DemandDetails/>} />
          </Route>
        </Routes>
      </Layout>
    </Router>
   
  );
}

export default App;
