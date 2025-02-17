import Home from './Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import Layout from './utils/Layout';
import ShowSomeTimes from './utils/ShowSomeTimes';
import Store from './Store/Store';
import Product from './Products/Product'
import MoreInformation from './Products/MoreInformation';
import IssueItems from './StoreDemands/IssueItems';
import DemandNotification from './Notifications/DemandNotification';
import DemandDetails from './Notifications/DemandDetails';
import ProtectedRouting from './utils/ProtectedRouting';
import ViewDemand from './StoreDemands/ViewDemand';
import UserDemandDetails from './StoreDemands/UserDemandDetails';
import RoomResource from './Resource/RoomResource'
import StoreItemHistory from './Store/StoreItemHistory';
import ShowLabInventory from './Resource/ShowLabInventory';
import User from './User/User'
import Setting from './Setting/Setting';
import View from './Demand/View';
import CreateDemand from './Demand/CreateDemand';
import Action from './Demand/Action';
import Card from './Resource/Card';
import LabInventory from './LabInventory/LabInventory';
function App() {
  return (
    <Router>
      <Layout>
        <ShowSomeTimes>
          <Header />
        </ShowSomeTimes>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route element={<ProtectedRouting allowedRoles={["admin","lab_Incharge"]}/>} >
            <Route path='/' element={<Home />} />
            <Route path='/store' element={<Store />} />
            <Route path='/store/storeItemsHistory' element={<StoreItemHistory />} />
            <Route path='/product' element={<Product />} />
            <Route path='/product/moreInfo' element={<MoreInformation />} />
            <Route path='/issueItem' element={<IssueItems />} />
            <Route path='/demandsList' element={<DemandNotification />} />
            <Route path='/demandDetails' element={<DemandDetails />} />
            <Route path='/viewDemands' element={<ViewDemand />} />
            <Route path='/userDemandDetail' element={<UserDemandDetails />} />
            <Route path='/resourceCard' element={<Card />} />
            <Route path='/resource' element={<RoomResource/>} />
            <Route path='/resource/showInventory' element={<ShowLabInventory/>} />
            <Route path='/user' element={<User/>} />
            <Route path='/setting' element={<Setting/>} />
            <Route path='/viewMainDemand' element={<View/>} />
            <Route path='/createDemand' element={<CreateDemand/>} />
            <Route path='/createDemand/moreInfo' element={<MoreInformation />} />
            <Route path='/actionDemand' element={<Action />} />
            <Route path='/labInventory' element={<LabInventory/>} />
          </Route>
        </Routes>
      </Layout>
    </Router>

  );
}

export default App;
