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
  const [showCreateAccountPop, setShowCreateAccountPop] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Customer",
    password: "",
  });

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
        .get(
          `http://localhost:8080/backend_war_exploded/getOrders?email=${email}`
        )
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
    const order = products.find((product) => product.orderID === orderID);
    if (order && order.statusUpdatedBySalesman) {
      alert("You cannot cancel this order because it has been updated by a Salesman.");
      return;
    }
    setOrderToRemove(orderID);
    setShowConfirmPop(true);
  };

  const confirmRemove = () => {
    const removeUrl = `http://localhost:8080/backend_war_exploded/deleteOrder?orderID=${orderToRemove}`;
    axios
      .delete(removeUrl)
      .then((response) => {
        setProducts(
          products.filter((product) => product.orderID !== orderToRemove)
        );
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
      .put(updateUrl, { orderID, status: newStatus, statusUpdatedBySalesman: true })
      .then((response) => {
        setProducts(
          products.map((product) =>
            product.orderID === orderID
              ? { ...product, status: newStatus, statusUpdatedBySalesman: true }
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

  const handleCreateAccount = () => {
    setShowCreateAccountPop(true);
  };

  const handleAccountSubmit = () => {
    const signupUrl = `http://localhost:8080/backend_war_exploded/signup`;

    axios
      .post(signupUrl, formData)
      .then((response) => {
        alert("Account created successfully");
        setShowCreateAccountPop(false);
        setFormData({ name: "", email: "", role: "", password: "" });
      })
      .catch((error) => {
        console.error("There was an error creating the account:", error.message);
        setError("Failed to create account. Please try again.");
      });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const cancelCreateAccount = () => {
    setShowCreateAccountPop(false);
    setFormData({ name: "", email: "", role: "", password: "" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      {role === "Salesman" && (
        <div className="Acc">
          <button onClick={handleCreateAccount}>Create Account</button>
        </div>
      )}
      <div className="list-product1">
        <div className="listproduct-format-main1">
          <p>Name</p>
          <p>Product Name</p>
          {role === "Salesman" ? (
            <>
              <p>Product ID</p>
              <p>Update Order</p>
              <p>Remove</p>
            </>
          ) : (
            <>
              <p>Order ID</p>
              <p>Order Status</p>
              <p>Cancel Order</p>
            </>
          )}
        </div>
        {products.map((product) => (
          <div key={product.orderID} className="listproduct-item">
            <p>{product.name}</p>
            {/* <p>{product.orderID}</p>             */}
            {product.cartData.map((item)=> (
              <>
                <p>{item.name}</p>
                {role !== "Customer" && (
                  <>
                    <p>{item.productId}</p>
                    <button
                      className="update-order"
                      onClick={() =>
                        handleOpenUpdatePop(
                          product.orderID,
                          product.status || "Pending"
                        )
                      }
                    >
                      Update Order
                    </button>
                  </>
                )}
              </>
            ))}
            {role === "Customer" ? (
              <>
                <p>{product.status || "Pending"}</p>
                {["Placed", "Shipped", "Delivered"].includes(product.status) ? (
                  <p>No actions available</p>
                ) : (
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(product.orderID)}
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(product.orderID)}
                >
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

      {showCreateAccountPop && (
        <div className="create-account-pop1">
          <div className="create-account-pop-content1">
            <p>Create New Account:</p>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleFormChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="Customer"
              placeholder="Type of role"
              value={formData.role}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleFormChange}
            />
            <button className="cancel-button" onClick={cancelCreateAccount}>
              Cancel
            </button>
            <button className="confirm-button" onClick={handleAccountSubmit}>
              Create
            </button>
          </div>
        </div>
      )}
    </>
  );
}


