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
    street: "",
    city: "",
    state: "",
    zipCode: "",
    userAge: "",
    userGender: "",
  });

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (storedRole === "Customer") {
      const userId = localStorage.getItem("id");
      if (!userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      axios
        .get(`http://localhost:8080/myservlet/getTransactions?userId=${userId}`)
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
        .get("http://localhost:8080/myservlet/getTransactions")
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
    const order = products.find((product) => product.orderId === orderID);
    setOrderToRemove(orderID);
    setShowConfirmPop(true);
  };

  const confirmRemove = () => {
    const removeUrl = `http://localhost:8080/myservlet/deleteOrder?orderID=${orderToRemove}`;
    axios
      .delete(removeUrl)
      .then((response) => {
        setProducts(
          products.filter((product) => product.orderId !== orderToRemove)
        );
        setShowConfirmPop(false);
        setOrderToRemove(null);
      })
      .catch((error) => {
        console.error(
          "There was an error removing the product:",
          error.message
        );
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
    const updateUrl = `http://localhost:8080/myservlet/updateOrder`;

    axios
      .put(updateUrl, {
        orderID,
        status: newStatus,
        statusUpdatedBySalesman: true,
      })
      .then((response) => {
        setProducts(
          products.map((product) =>
            product.orderId === orderID
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

  const handleOpenUpdatePop = (orderId, currentStatus) => {
    setOrderToUpdate(orderId);
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
    const signupUrl = `http://localhost:8080/myservlet/signup`;

    axios
      .post(signupUrl, formData)
      .then((response) => {
        alert("Account created successfully");
        setShowCreateAccountPop(false);
        setFormData({
          name: "",
          email: "",
          role: "",
          password: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          userAge: "",
          userGender: "",
        });
      })
      .catch((error) => {
        console.error(
          "There was an error creating the account:",
          error.message
        );
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
          <p>customer Name</p>
          <p>Order ID</p>
          <p>Delivery Date</p>
          {role === "Salesman" ? (
            <>
              <p>Update Order</p>
              <p>Remove</p>
            </>
          ) : (
            <>
              <p>Order Status</p>
              <p>Cancel Order</p>
            </>
          )}
        </div>
        {products.map((product) => (
          <div key={product.orderId} className="listproduct-item">
            <p>{product.customerName}</p>
            <p>{product.orderId}</p>
            <p>{product.deliveryDate}</p>
            {role === "Salesman" ? (
              <button
                className="update-order"
                onClick={() =>
                  handleOpenUpdatePop(
                    product.orderId,
                    product.orderStatus || "Pending"
                  )
                }
              >
                Update Order
              </button>
            ) : null}
            {role === "Customer" ? (
              <>
                <p>{product.orderStatus || "Pending"}</p>
                {["Placed", "Shipped", "Delivered"].includes(
                  product.orderStatus
                ) ? (
                  <p>No actions available</p>
                ) : (
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(product.orderId)}
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(product.orderId)}
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
            <input
              type="text"
              name="street"
              placeholder="street"
              value={formData.street}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="city"
              placeholder="city"
              value={formData.city}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="state"
              placeholder="state"
              value={formData.state}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="userAge"
              placeholder="User Age"
              value={formData.userAge}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="userGender"
              placeholder="User Gender"
              value={formData.userGender}
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
