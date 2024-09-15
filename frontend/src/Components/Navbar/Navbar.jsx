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
    const storedRole = localStorage.getItem('role');

    if (storedRole) {
      setRole(storedRole);
    }

    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (link) => {
    setActiveLink(link);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
        <button onClick={handleLogout}>Logout</button>
        <Link to='/cart'>
          <img src={cart_icon} alt="cart_icon" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

