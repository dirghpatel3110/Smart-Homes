import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CSS/Order.css";
import Navbar from "../Components/Navbar/Navbar";

export default function Order() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmPop, setShowConfirmPop] = useState(false); 
  const [showUpdatePop, setShowUpdatePop] = useState(false); 
  const [orderToRemove, setOrderToRemove] = useState(null);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
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
    setShowConfirmPop(true); // show confirm pop
  };

  const confirmRemove = () => {
    const removeUrl = `http://localhost:8080/backend_war_exploded/deleteOrder?orderID=${orderToRemove}`;
    axios
      .delete(removeUrl)
      .then((response) => {
        setProducts(products.filter((product) => product.orderID !== orderToRemove));
        setShowConfirmPop(false); 
        setOrderToRemove(null);
      })
      .catch((error) => {
        console.error("There was an error removing the product:", error.message);
        setError("Failed to remove product. Please try again.");
        setShowConfirmPop(false);
        setOrderToRemove(null);
      });
  };

  const cancelRemove = () => {
    setShowConfirmPop(false); 
    setOrderToRemove(null);
  };

  const handleUpdate = (orderID, newStatus) => {
    const updateUrl = `http://localhost:8080/backend_war_exploded/updateOrder`;

    axios
      .put(updateUrl, { orderID, status: newStatus })
      .then((response) => {
        setProducts(
          products.map((product) =>
            product.orderID === orderID
              ? { ...product, status: newStatus }
              : product
          )
        );
        setShowUpdatePop(false); 
        setOrderToUpdate(null);
        setNewStatus("");
      })
      .catch((error) => {
        console.error("There was an error updating the order:", error.message);
        setError("Failed to update order. Please try again.");
      });
  };

  const handleOpenUpdatePop = (orderID, currentStatus) => {
    setOrderToUpdate(orderID);
    setNewStatus(currentStatus);
    setShowUpdatePop(true); 
  };

  const cancelUpdate = () => {
    setShowUpdatePop(false); 
    setOrderToUpdate(null);
    setNewStatus("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="list-product1">
        <div className="listproduct-format-main1">
          <p>Name</p>
          <p>Product Name</p>
          {role === "Salesman" ? (
            <>
              <p>Update Order</p>
              <p>Remove</p>
            </>
          ) : (
            <>
              <p>Price</p>
              <p>Order Status</p>
            </>
          )}
        </div>
        {products.map((product) => (
          <div key={product.orderID} className="listproduct-item">
            <p>{product.name}</p>
            {product.cartData && product.cartData.length > 0 ? (
              <>
                <p>{product.cartData[0].name}</p>
                {role === "Customer" ? (
                  <p>${product.cartData[0].price}</p>
                ) : (
                  <button
                    className="update-order"
                    onClick={() => handleOpenUpdatePop(product.orderID, product.status || "Pending")}
                  >
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
                <button className="remove-button" onClick={() => handleRemove(product.orderID)}>
                  Remove
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {showConfirmPop && ( 
        <div className="confirmation-pop1">
          <div className="confirmation-pop-content1">
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

      {showUpdatePop && ( 
        <div className="update-pop1">
          <div className="update-pop-content1">
            <p>Update status for order {orderToUpdate}:</p>
            <select
              onChange={(e) => setNewStatus(e.target.value)}
              value={newStatus}
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button className="cancel-button" onClick={cancelUpdate}>
              Cancel
            </button>
            <button
              className="confirm-button"
              onClick={() => handleUpdate(orderToUpdate, newStatus)}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
}

