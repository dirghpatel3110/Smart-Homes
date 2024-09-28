import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar/Navbar";
import './CSS/CheckoutPage.css';

const CheckoutPage = ({ onCheckoutComplete, totalAmount, cartItems }) => {
  const [deliveryOption, setDeliveryOption] = useState(""); // Default to empty string
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    creditCardNumber: "",
    storeId: "",
  });

  const [finalPrice, setFinalPrice] = useState(totalAmount);

  useEffect(() => {
    if (deliveryOption === "in_store_pickup") {
      fetchStores();
    }
  }, [deliveryOption]);

  useEffect(() => {
    setFinalPrice(
      deliveryOption === "home_delivery" ? totalAmount + 5 : totalAmount
    );
  }, [deliveryOption, totalAmount]);

  const fetchStores = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/myservlet/stores"
      );
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("id");

    // Prepare the data depending on the delivery option
    const transactionData = {
      userId: parseInt(userId), // Ensure userId is an integer
      customerName: formData.name,
      creditCardNumber: formData.creditCardNumber,
      totalSales: finalPrice,
      deliveryOption,
      // Handle home delivery details
      ...(deliveryOption === "home_delivery"
        ? {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          }
        : {
            storeId: formData.storeId,
            // Fetch store details based on selected storeId
            storeStreet: stores.find(
              (store) => store.storeId === parseInt(formData.storeId)
            )?.street,
            storeCity: stores.find(
              (store) => store.storeId === parseInt(formData.storeId)
            )?.city,
            storeState: stores.find(
              (store) => store.storeId === parseInt(formData.storeId)
            )?.state,
            storeZip: stores.find(
              (store) => store.storeId === parseInt(formData.storeId)
            )?.zipCode,
          }),
    };

    // Assuming cartItems contains the relevant product information
    // Here, we are sending only the first item for simplicity. You may want to handle multiple items as needed.
    console.log(cartItems);
    const cartItem = cartItems[0];
    if (cartItem) {
      transactionData.productId = cartItem.productId;
      transactionData.category = cartItem.category; // Assuming you have category in cartItems
      transactionData.quantity = cartItem.quantity; // Adjust quantity as needed
      transactionData.price = cartItem.price; // Assuming you have price in cartItems
      transactionData.discount = cartItem.discount; // Assuming you have discount in cartItems
    }

    // Log the transaction data for debugging purposes
    console.log(transactionData);

    try {
      const response = await axios.post(
        "http://localhost:8080/myservlet/transaction",
        transactionData
      );

      // Clear the cart after a successful transaction
      await axios.delete(
        `http://localhost:8080/myservlet/clearCart?userId=${userId}`
      );
      onCheckoutComplete(response.data);
    } catch (error) {
      console.error("Error processing transaction", error);
    }
  };

  return (
    <>
    <Navbar />
    <div className="container">
      <h2>Checkout</h2>
      <p>Total Price: ${finalPrice.toFixed(2)}</p>
     <br />
     <h3>Delivery Option</h3>
     <br />
      <div className="delivery-options">  
        <label>
          <input
            type="radio"
            value="home_delivery"
            checked={deliveryOption === "home_delivery"}
            onChange={() => setDeliveryOption("home_delivery")}
          />
          Home Delivery ($5 shipping fee)
        </label>
        <label>
          <input
            type="radio"
            value="in_store_pickup"
            checked={deliveryOption === "in_store_pickup"}
            onChange={() => setDeliveryOption("in_store_pickup")}
          />
          In-Store Pickup
        </label>
      </div>

      {deliveryOption === "home_delivery" ? (
        <div>
          <h3>Home Delivery Information</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="creditCardNumber"
            placeholder="Credit Card Number"
            value={formData.creditCardNumber}
            onChange={handleInputChange}
          />
        </div>
      ) : (
        <div>
          <h3>In-Store Pickup Information</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="creditCardNumber"
            placeholder="Credit Card Number"
            value={formData.creditCardNumber}
            onChange={handleInputChange}
          />

          <label>Select Store</label>
          <select
            name="storeId"
            value={formData.storeId}
            onChange={handleInputChange}
          >
            <option value="">Select Store</option>
            {stores.map((store) => (
              <option key={store.storeId} value={store.storeId}>
                {`${store.street}, ${store.city}, ${store.state}, ${store.zipCode}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleSubmit}>Submit Order</button>
    </div>
    </>
  );
};

export default CheckoutPage;





