import './App.css';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Product from './Pages/Product';
import ProductList from './Pages/ProductList';
import ProductDetails from './Pages/ProductDetails';
import CartPage from './Pages/CartPage';
import Order from './Pages/Order';
import TrendingPage from './Pages/TrendingPage';
import ProductInventory from './Pages/ProductInventory';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route exact path="/" element={<Login/>} />
      <Route exact path="/signup" element={<Signup/>} />
      <Route exact path='/product' element={<Product/>}/>
      <Route exact path="/product/:id" element={<ProductDetails />} />
      <Route exact path='/product-list' element={<ProductList/>}/>
      <Route exact path="/cart" element={<CartPage/>} />
      <Route exact path="/order" element={<Order/>}/>
      <Route path="/trending" element={<TrendingPage/>} />
      <Route path="/inventory/available" element={<ProductInventory/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;