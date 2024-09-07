import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Product from './Pages/Product';
// import Navbar from './Components/Navbar/Navbar';


function App() {
  return (
    <div>
      <BrowserRouter>
      {/* <Navbar/> */}
      <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
        <Route path='/product' element={<Product/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;