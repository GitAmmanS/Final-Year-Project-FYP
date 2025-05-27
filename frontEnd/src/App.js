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
import ViewComplains from './Complains/ViewComplains';
import CreateDemand from './Demand/CreateDemand';
import Action from './Demand/Action';
import Card from './Resource/Card';
import LabInventory from './LabInventory/LabInventory';
import UserProfile from './User/UserProfile';
import ActionView from './Complains/ActionView';
import ResolveComplaint from './Complains/IssueComplaint';
import IssueComplaint from './Complains/IssueComplaint';
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

          <Route element={<ProtectedRouting allowedRoles={["admin", "lab_Incharge", "store_Incharge","technician","teacher"]} />} >
            <Route path='/' element={<Home />} />
            <Route path='/setting' element={<Setting />} />
          </Route>

          <Route element={<ProtectedRouting allowedRoles={["admin", "lab_Incharge","store_Incharge","teacher"]} />} >
            <Route path='/viewDemands' element={<ViewDemand />} />
            <Route path='/userDemandDetail' element={<UserDemandDetails />} />
          </Route>

          <Route element={<ProtectedRouting allowedRoles={["admin", "store_Incharge"]} />} >
            <Route path='/product' element={<Product />} />
            <Route path='/product/moreInfo' element={<MoreInformation />} />
            <Route path='/store' element={<Store />} />
            <Route path='/viewMainDemand' element={<View />} />
            <Route path='/store/storeItemsHistory' element={<StoreItemHistory />} />
            <Route path='/demandsList' element={<DemandNotification />} />
            <Route path='/demandDetails' element={<DemandDetails />} />
            <Route path='/createDemand/moreInfo' element={<MoreInformation />} />
            <Route path='/actionDemand' element={<Action />} />
          </Route>

          <Route element={<ProtectedRouting allowedRoles={["admin"]} />} >
            <Route path='/resourceCard' element={<Card />} />
            <Route path='/resource' element={<RoomResource />} />
            <Route path='/resource/showInventory' element={<ShowLabInventory />} />
            <Route path='/user' element={<User />} />
          </Route>

          <Route element={<ProtectedRouting allowedRoles={["lab_Incharge","teacher"]} />} >
            <Route path='/issueItem' element={<IssueItems />} />
            <Route path='/labInventory' element={<LabInventory />} />
          </Route>
          <Route element={<ProtectedRouting allowedRoles={["store_Incharge"]} />} >
            <Route path='/createDemand' element={<CreateDemand />} />
          </Route>
          <Route element={<ProtectedRouting allowedRoles={["store_Incharge", "admin", "lab_Incharge","technician","teacher"]} />} >
            <Route path='/UserProfile' element={<UserProfile />} />
          </Route>
          <Route element={<ProtectedRouting allowedRoles={["admin", "lab_Incharge", "teacher" ,"technician"]} />} >
            <Route path='/complains' element={<ViewComplains />} />
            <Route path='/Issue_Complaint' element={<IssueComplaint />} />
            <Route path='/actionComplain' element={<ActionView />} />
          </Route>
        </Routes>
      </Layout>
    </Router>

  );
}

export default App;
