import React, { useState, useEffect } from 'react'
import './Navbar.css'
import cart_icon from '../../Assets/cart_icon.png';
import { Link} from 'react-router-dom';

const Navbar = () => {
  const [role, setRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
}, []);

  return (
    <div className='navbar'>
        <div className="nav-logo">
            <Link to="/product"><p>SMARTHOMES</p></Link>
        </div>
        <div className="nav-login-cart">
          {role === "Salesman" ? (
            <button>Custmor</button>
          ) : role === "Store Manager" ? (
            <button>Product list</button>
          ) : null}
            <button >Logout</button>     
            <Link to='/cart'><img src={cart_icon} alt="cart_icon" /></Link>
        </div>
    </div>
  )
}

export default Navbar