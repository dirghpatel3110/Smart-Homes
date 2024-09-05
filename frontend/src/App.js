import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
// import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Product from './Pages/Product';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        
        {/* <Route path='/cart' element={<Cart/>}/> */}
        <Route path='/' element={<LoginSignup/>}/>
        <Route path="/product" element={<Product />} /> 
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;