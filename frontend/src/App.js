import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
// import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<Shop/>}/>
        <Route path='/product' element={<Product/>}>
          <Route path=':productsId' element={<Product/>}/>
        </Route> */}
        {/* <Route path='/cart' element={<Cart/>}/> */}
        <Route path='/login' element={<LoginSignup/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;