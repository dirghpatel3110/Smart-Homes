import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Product from './Pages/Product';
import Navbar from './Components/Navbar/Navbar';
import ProductList from './Pages/ProductList';
import ProductDetails from './Pages/ProductDetails';
import CartPage from './Pages/CartPage';
import CheckoutForm from './Pages/CheckoutForm';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path='/product' element={<Product/>}/>
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path='/product-list' element={<ProductList/>}/>
      <Route path="/cart" element={<CartPage/>} />
      <Route path='/Checkout' element={<CheckoutForm/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;