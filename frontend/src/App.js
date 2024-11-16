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
import ProductsOnSale from './Pages/ProductsOnSale';
import ProductsWithRebates from './Pages/ProductsWithRebates';
import ProductInventoryBarChart from './Pages/ProductInventoryBarChart';
import ProductSalesReport from './Pages/ProductSalesReport';
import DailySalesTransactions from './Pages/DailySalesTransactions';
import ProductSalesBarChart from './Pages/ProductSalesBarChart';
import OpenTicketPage from './Pages/OpenTicketPage';
import TicketDecisionPage from './Pages/TicketDecisionPage';
import SemanticSearch from './Pages/SemanticSearch';
import SearchResultsPage from './Pages/SearchResultsPage';

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
      <Route path="/inventory/on-sale" element={<ProductsOnSale/>} />
      <Route path="/inventory/rebates" element={<ProductsWithRebates/>}/>
      <Route path='/inventory/bar-chart' element={<ProductInventoryBarChart/>}/>
      <Route path='/sales-report/product-sold' element={<ProductSalesReport/>}/>
      <Route path='/sales-report/daily-transactions' element={<DailySalesTransactions/>}/>
      <Route path='/sales-report/bar-chart' element={<ProductSalesBarChart/>}/>
      <Route path="/customer-service/open-ticket" element={<OpenTicketPage />} />
      <Route path='/customer-service/ticket-status' element={<TicketDecisionPage/>}/>
      <Route path="/product" element={<SemanticSearch />} />
      <Route path="/search-results" element={<SearchResultsPage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;