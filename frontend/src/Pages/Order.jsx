import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/Order.css';

export default function Order() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [orderToRemove, setOrderToRemove] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/backend_war_exploded/getOrders")
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleRemove = (orderID) => {
    setOrderToRemove(orderID);
    setShowConfirmPopup(true);
  };

  const confirmRemove = () => {
    const removeUrl = `http://localhost:8080/backend_war_exploded/deleteOrder?orderID=${orderToRemove}`;
    axios.delete(removeUrl)
      .then(response => {
        setProducts(products.filter(product => product.orderID !== orderToRemove));
        setShowConfirmPopup(false);
        setOrderToRemove(null);
      })
      .catch(error => {
        console.error('There was an error removing the product:', error.message);
        setError('Failed to remove product. Please try again.');
        setShowConfirmPopup(false);
        setOrderToRemove(null);
      });
  };

  const cancelRemove = () => {
    setShowConfirmPopup(false);
    setOrderToRemove(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className='list-product1'>
        <div className="listproduct-format-main1">
          <p>Name</p>
          <p>Product Name</p>
          <p>Price</p>
          <p>Remove</p>
        </div>
        {products.map((product) => (
          <div key={product.id} className="listproduct-item">
            <p>{product.name}</p>
            <p>{product.cartData.cartData[0].name}</p>
            <p>${product.cartData.cartData[0].price}</p>
            <button onClick={() => handleRemove(product.orderID)}>Remove</button>
          </div>
        ))}
      </div>

      {showConfirmPopup && (
        <div className="confirmation-popup1">
          <div className="confirmation-popup-content1">
            <p>Are you sure you want to cancel this order?</p>
            <button className="cancel-button" onClick={cancelRemove}>Cancel</button>
            <button className="confirm-button" onClick={confirmRemove}>Confirm</button>
          </div>
        </div>
      )}
    </>
  );
}
