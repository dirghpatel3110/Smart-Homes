import './App.css';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Product from './Pages/Product';
import ProductList from './Pages/ProductList';
import ProductDetails from './Pages/ProductDetails';
import CartPage from './Pages/CartPage';
import Order from './Pages/Order';



function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path='/product' element={<Product/>}/>
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path='/product-list' element={<ProductList/>}/>
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/order" element={<Order/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;