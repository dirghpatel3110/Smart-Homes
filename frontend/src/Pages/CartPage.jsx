import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/CartPage.css";
import CheckoutForm from "./CheckoutForm";
import Navbar from "../Components/Navbar/Navbar";

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  useEffect(() => {
    const email = localStorage.getItem("email");

    if (email) {
      axios
        .get(`http://localhost:8080/backend_war_exploded/cart?email=${email}`)
        .then((response) => {
          setCartData(response?.data?.products || []);
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching cart data");
          setLoading(false);
        });
    } else {
      setError("No email found in local storage");
      setLoading(false);
    }
  }, []);

  const handleRemoveProduct = (productId) => {
    const email = localStorage.getItem("email");
    const product = cartData.find((product) => product.productId === productId);

    if (email && product) {
      const payload = {
        email: email,
        action: "remove",
        productId: productId,
        category: product.category,
        quantity: product.quantity,
        name: product.name,
      };

      axios
        .post("http://localhost:8080/backend_war_exploded/cart", payload)
        .then((response) => {
          setCartData((prevCartData) =>
            prevCartData.filter(
              (item) =>
                !(
                  item.productId === productId &&
                  item.name === product.name &&
                  item.category === product.category
                )
            )
          );
        })
        .catch((error) => {
          setError("Error removing product");
        });
    } else {
      setError("No email found in local storage or product not found");
    }
  };

  const handleCheckoutComplete = (confirmationData) => {
    alert(`Order placed! Confirmation number: ${confirmationData.confirmationNumber}`);
  };

  const totalItems = cartData.reduce(
    (total, product) => total + product.quantity + (product.accessories ? product.accessories.length : 0),
    0
  );
  
  const totalAmount = cartData.reduce((total, product) => {
    const productTotal = product.quantity > 0 ? product.price * product.quantity : 0;
  
    const accessoriesTotal = product.accessories
      ? product.accessories.reduce(
          (acc, accessory) => acc + accessory.price * (product.quantity > 0 ? product.quantity : 1), // Handle accessory pricing if product quantity is 0
          0
        )
      : 0;
    const warrantyTotal = product.warranty ? (product.warranty.price) : 0;
    return total + productTotal + accessoriesTotal + warrantyTotal;

  }, 0);
  

  if (loading) {
    return <div className="loading">Loading cart data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (isCheckingOut) {
    return <CheckoutForm cartData={cartData} onCheckoutComplete={handleCheckoutComplete} />;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="cart-container">
          <h2>Total Items in Cart: {totalItems}</h2>
          {cartData.length > 0 ? (
            <ul>
              {cartData.map((product) => (
                <li key={product.productId} className="cart-item">
                  <h3>Product ID: {product.productId}</h3>
                  <p>
                    <strong>Name:</strong> {product.name}
                  </p>
                  <p>
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                  {
                    product.warranty && <p> <strong>Warranty :</strong> {product.warranty.price}</p>
                  }
                  {product.accessories && product.accessories.length > 0 && (
                    <div className="accessories1">
                      <h3>Accessories:</h3>
                      <ul>
                        {product.accessories.map((accessory, idx) => (
                          <li key={idx}>
                            <p>
                              <strong>Name:</strong> {accessory.name},{" "}
                            </p>
                            <p>
                              <strong>Price:</strong> ${accessory.price}
                            </p>
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
          <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
          <button
            className="checkout"
            onClick={() => setIsCheckingOut(true)}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;



