// import React, { useState, useEffect } from 'react';
// import './Navbar.css';
// import cart_icon from '../../Assets/cart_icon.png';
// import { Link, useLocation } from 'react-router-dom';

// const Navbar = () => {
//   const [role, setRole] = useState('');
//   const [activeLink, setActiveLink] = useState('');
  
//   const location = useLocation();

//   useEffect(() => {
//     const storedRole = localStorage.getItem('role');
//     setRole(storedRole);
//     setActiveLink(location.pathname);
//   }, [location]);

//   const handleClick = (link) => {
//     setActiveLink(link);
//   };
//   console.log(role)

//   return (
//     <div className='navbar'>
//       <div className="nav-logo">
//         <Link to="/product">
//           <p>SMARTHOMES</p>
//         </Link>
//       </div>
//       <div className="nav-login-cart">
//         {role === "Salesman" ? (
//           <button
//             onClick={() => handleClick('/Customer-list')}
//             style={{
//               color: activeLink === '/Customer-list' ? 'blue' : '#515151',
//             }}
//           >
//             <Link
//               to='/Customer-list'
//               style={{
//                 color: activeLink === '/Customer-list' ? 'blue' : '#515151',
//                 textDecoration: 'none',
//               }}
//             >
//               Customer
//             </Link>
//           </button>
//         ) : role === "Store Manager" ? (
//           <button><Link to='/product-list'>Product-list</Link></button>
//         ) : null}
        
//         <button>Logout</button>
//         <Link to='/cart'>
//           <img src={cart_icon} alt="cart_icon" />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Navbar;




import React, { useState, useEffect } from 'react';
import './Navbar.css';
import cart_icon from '../../Assets/cart_icon.png';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [role, setRole] = useState('');
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();

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
              Custmor
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
        ) : null}
        
        <button>Logout</button>
        <Link to='/cart'>
          <img src={cart_icon} alt="cart_icon" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

