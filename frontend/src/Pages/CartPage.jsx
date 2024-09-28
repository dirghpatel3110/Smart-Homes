import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/CartPage.css";
import Navbar from "../Components/Navbar/Navbar";
import CheckoutPage from "./CheckoutPage";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("id");

    if (userId) {
      axios
        .get(`http://localhost:8080/myservlet/cart?userId=${userId}`)
        .then((response) => {
          setCartData(response.data || []);
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching cart data");
          setLoading(false);
        });
    } else {
      setError("No userId found in local storage");
      setLoading(false);
    }
  }, []);

  const handleRemoveProduct = (cartItemId) => {
    axios
      .delete(`http://localhost:8080/myservlet/cart?cartItemId=${cartItemId}`)
      .then((response) => {
        setCartData((prevCartData) =>
          prevCartData.filter((item) => item.id !== cartItemId)
        );
      })
      .catch((error) => {
        setError("Error removing product");
      });
  };

  const handleCheckoutComplete = (confirmationData) => {
    alert(
      `Order placed! Confirmation number: ${confirmationData.confirmationNumber}`
    );
  };

  let totalAmount = cartData.reduce((total, item) => {
    const itemTotal = item.price;
    return parseFloat((total + itemTotal).toFixed(2));
  }, 0);

  if (loading) {
    return <div className="loading">Loading cart data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (isCheckingOut) {
    return <CheckoutPage cartItems={cartData} onCheckoutComplete={handleCheckoutComplete} totalAmount={totalAmount} />;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="cart-container">
          <h2>Total Items in Cart: {cartData.length}</h2>
          {cartData.length > 0 ? (
            <ul>
              {cartData.map((item) => (
                <li key={item.id} className="cart-item">
                  <h3>Product ID: {item.productId}</h3>
                  <p>
                    <strong>Name:</strong> {item.productName}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                  {item.accessories && item.accessories.length > 0 && (
                    <div className="accessories1">
                      <h3>Accessories:</h3>
                      <ul>
                        {item.accessories.map((accessory, idx) => (
                          <li key={idx}>
                            <p>
                              <strong>Name:</strong> {accessory.name}
                            </p>
                            <p>
                              <strong>Quantity:</strong> {accessory.quantity}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    className="remove"
                    onClick={() => handleRemoveProduct(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Your cart is empty.</p>
          )}
          <div>
            <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
          </div>
          <button className="checkout" onClick={() => setIsCheckingOut(true)}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;