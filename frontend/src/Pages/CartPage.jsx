import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/CartPage.css';

const Cart = () => {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const email = localStorage.getItem('email');
  
      if (email) {
        axios.get(`http://localhost:8080/backend_war_exploded/cart?email=${email}`)
          .then((response) => {
            setCartData(response?.data?.products || []);
            setLoading(false);
          })
          .catch((error) => {
            setError('Error fetching cart data');
            setLoading(false);
          });
      } else {
        setError('No email found in local storage');
        setLoading(false);
      }
    }, []);
  
    const handleRemoveProduct = (productId) => {
      const email = localStorage.getItem('email');
      
      if (email) {
        axios.post(`http://localhost:8080/backend_war_exploded/cart`, { email: email, action: "remove" ,productId: productId})
          .then((response) => {
            setCartData((prevCartData) =>
              prevCartData.filter((product) => product.productId !== productId)
            );
          })
          .catch((error) => {
            setError('Error removing product');
          });
      } else {
        setError('No email found in local storage');
      }
    };
  
    if (loading) {
      return <div className="loading">Loading cart data...</div>;
    }
  
    if (error) {
      return <div className="error">{error}</div>;
    }
  
    return (
      <div className="container">
        <div className="cart-container">
          {cartData.length > 0 ? (
            <ul>
              {cartData.map((product) => (
                <li key={product.productId} className="cart-item">
                  <h3>Product ID: {product.productId}</h3>
                  <p><strong>Name:</strong> {product.name}</p>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Quantity:</strong> {product.quantity}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  {product.accessories && product.accessories.length > 0 && (
                    <div className="accessories">
                      <h3>Accessories:</h3>
                      <ul>
                        {product.accessories.map((accessory, idx) => (
                          <li key={idx}>
                            <p><strong>Name:</strong> {accessory.name}, </p>
                            <p><strong>Price:</strong> ${accessory.price}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button 
                    className="remove"
                    onClick={() => handleRemoveProduct(product.productId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Your cart is empty.</p>
          )}
          <button className="checkout">PROCEED TO CHECKOUT</button>
        </div>
      </div>
    );
  };
  
  export default Cart;
  