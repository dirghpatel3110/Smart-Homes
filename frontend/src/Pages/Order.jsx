import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/Order.css";
import Navbar from "../Components/Navbar/Navbar";

export default function Order() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [orderToRemove, setOrderToRemove] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); 
    setRole(storedRole);

    if (storedRole === "Customer") {
      const email = localStorage.getItem("email");
      if (!email) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      axios
        .get(`http://localhost:8080/backend_war_exploded/getOrders?email=${email}`)
        .then((response) => {
          console.log(response.data)
          setProducts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else if (storedRole === "Salesman") {
      axios
        .get("http://localhost:8080/backend_war_exploded/getOrders") 
        .then((response) => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, []);

  const handleRemove = (orderID) => {
    setOrderToRemove(orderID);
    setShowConfirmPopup(true);
  };

  const confirmRemove = () => {
    const removeUrl = `http://localhost:8080/backend_war_exploded/deleteOrder?orderID=${orderToRemove}`;
    axios
      .delete(removeUrl)
      .then((response) => {
        setProducts(products.filter((product) => product.orderID !== orderToRemove));
        setShowConfirmPopup(false);
        setOrderToRemove(null);
      })
      .catch((error) => {
        console.error("There was an error removing the product:", error.message);
        setError("Failed to remove product. Please try again.");
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
      <Navbar />
      <div className="list-product1">
        <div className="listproduct-format-main1">
          {role === "Customer" ? (
            <>
              <p>Name</p>
              <p>Product Name</p>
              <p>Price</p>
              <p>Order Status</p>
            </>
          ) : (
            <>
              <p>Name</p>
              <p>Product Name</p>
              <p>Update Order</p>
              <p>Remove</p>
            </>
          )}
        </div>
        {products.map((product) => (
          <div key={product.orderID} className="listproduct-item">
            {console.log(product)}
            <p>{product.name}</p>
            {product.cartData && product.cartData.length > 0 ? (
              <>
                <p>{product.cartData[0].name}</p>
                {role === "Customer" ? (
                  <p>${product.cartData[0].price}</p> 
                ) : (
                  <button onClick={() => console.log("Update Order Clicked")}>
                    Update Order
                  </button> 
                )}
              </>
            ) : (
              <>
                <p>No Product Data</p>
                {role === "Customer" && <p>$0.00</p>}
              </>
            )}
            {role === "Customer" ? (
              <p>{product.status || "Pending"}</p>
            ) : (
              <>
                <button onClick={() => handleRemove(product.orderID)}>
                  Remove
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {showConfirmPopup && (
        <div className="confirmation-popup1">
          <div className="confirmation-popup-content1">
            <p>Are you sure you want to cancel this order?</p>
            <button className="cancel-button" onClick={cancelRemove}>
              Cancel
            </button>
            <button className="confirm-button" onClick={confirmRemove}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </>
  );
}
