import React, { useState, useEffect } from 'react';
import './Navbar.css';
import cart_icon from '../../Assets/cart_icon.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [role, setRole] = useState('');
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the role from localStorage
    const storedRole = localStorage.getItem('role');

    // Check if the role is being retrieved correctly
    console.log("Stored Role:", storedRole);

    if (storedRole) {
      setRole(storedRole);
    }

    // Update the active link based on the current route
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <Link to="/product">
          <p>SMARTHOMES</p>
        </Link>
      </div>
      <div className="nav-login-cart">
        {role === "Salesman" ? (
          <button
            onClick={() => handleClick('/custmor-list')}
            style={{
              color: activeLink === '/custmor-list' ? 'blue' : '#515151',
            }}
          >
            <Link
              to='/custmor-list'
              style={{
                color: activeLink === '/custmor-list' ? 'blue' : '#515151',
                textDecoration: 'none',
              }}
            >
              Customer
            </Link>
          </button>
        ) : role === "StoreManager" ? (
          <button
            onClick={() => handleClick('/product-list')}
            style={{
              color: activeLink === '/product-list' ? 'blue' : '#515151',
            }}
          >
            <Link
              to='/product-list'
              style={{
                color: activeLink === '/product-list' ? 'blue' : '#515151',
                textDecoration: 'none',
              }}
            >
              Product list
            </Link>
          </button>
        ) : role === "Customer" ? (<button
          onClick={() => handleClick('/order')}
          style={{
            color: activeLink === '/order' ? 'blue' : '#515151',
          }}
        >
          <Link
            to='/order'
            style={{
              color: activeLink === '/order' ? 'blue' : '#515151',
              textDecoration: 'none',
            }}
          >
            Order
          </Link>
        </button>): null}
        
        <button onClick={()=>{localStorage.clear(); navigate("/")}}>Logout</button>
        <Link to='/cart'>
          <img src={cart_icon} alt="cart_icon" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

