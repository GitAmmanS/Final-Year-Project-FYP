import Home from './Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Items from './Items/Items';
import More from './Items/More';
import Header from './Header/Header';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import Layout from './Layout';
function App() {
  return (
    <Router>
      
      <Layout>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>} /> 
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/item' element={<Items />} />
          <Route path='/more/:_id' element={<More/>} />
        </Routes>
      </Layout>
    </Router>
   
  );
}

export default App;
