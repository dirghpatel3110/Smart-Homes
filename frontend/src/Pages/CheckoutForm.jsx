import React, { useState } from "react";
import axios from "axios";
import './CSS/CheckoutForm.css';
import Navbar from "../Components/Navbar/Navbar";

const PickupForm = ({ cartData, onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [whoIsPickingUp, setWhoIsPickingUp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email');

    // Calculate the future date for delivery (15 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 15);
    const formattedDate = deliveryDate.toLocaleDateString();

    const payload = {
      cartData,
      email,
      action: "add",
      name,
      whoIsPickingUp,
      phoneNumber,
      creditCard,
      storeLocation,
      zipCode
    };

    try {
      // Submit form data
      await axios.post("http://localhost:8080/backend_war_exploded/storedata", payload);
      
      // Clear cart after successful submission
      await axios.delete(`http://localhost:8080/backend_war_exploded/clearCart?email=${email}`);
      
      alert(`Order successful. Your order will be ready for pickup in 15 days on ${formattedDate}.`);
      onSubmit("Pickup successful");
    } catch (error) {
      setError("Error during pickup checkout");
    }
  };

  return (
    <div className="popup-form">
      <form onSubmit={handleSubmit}>
        <h3>Pickup Form</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Who is picking up"
          value={whoIsPickingUp}
          onChange={(e) => setWhoIsPickingUp(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Credit Card Number"
          value={creditCard}
          onChange={(e) => setCreditCard(e.target.value)}
          required
        />
        <select 
          value={storeLocation} 
          onChange={(e) => setStoreLocation(e.target.value)} 
          required
        >
          <option value="" disabled>Select Store Location</option>
          <option value="Store 1">Store 1</option>
          <option value="Store 2">Store 2</option>
          <option value="Store 3">Store 3</option>
          <option value="Store 4">Store 4</option>
          <option value="Store 5">Store 5</option>
          <option value="Store 6">Store 6</option>
          <option value="Store 7">Store 7</option>
          <option value="Store 8">Store 8</option>
          <option value="Store 9">Store 9</option>
          <option value="Store 10">Store 10</option>
        </select>
        <input
          type="text"
          placeholder="ZIP Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
        {error && <p>{error}</p>}
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

const DeliveryForm = ({ cartData, onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email');

    // Calculate the future date for delivery (15 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 15);
    const formattedDate = deliveryDate.toLocaleDateString();

    const payload = {
      cartData,
      email,
      action: "add",
      name,
      address,
      city,
      state,
      zipCode,
      creditCard,
      phoneNumber,
    };

    try {
      // Submit form data
      await axios.post("http://localhost:8080/backend_war_exploded/storedata", payload);
      
      // Clear cart after successful submission
      await axios.delete(`http://localhost:8080/backend_war_exploded/clearCart?email=${email}`);
      
      alert(`Order successful. Your order will be delivered in 15 days on ${formattedDate}.`);
      onSubmit("Delivery successful");
    } catch (error) {
      setError("Error during delivery checkout");
    }
  };

  return (
    <div className="popup-form">
      <form onSubmit={handleSubmit}>
        <h3>Delivery Form</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Credit Card Number"
          value={creditCard}
          onChange={(e) => setCreditCard(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
        {error && <p>{error}</p>}
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

const CheckoutForm = ({ cartData }) => {
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [showPickupForm, setShowPickupForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(true);
  const [checkoutData, setCheckoutData] = useState(null);

  const handleCheckoutComplete = (data) => {
    setCheckoutData(data);
    alert('Thanks for your order');
    // Redirect or show success message
  };

  const handleDeliveryChange = (e) => {
    setDeliveryMethod(e.target.value);
    if (e.target.value === "pickup") {
      setShowPickupForm(true);
      setShowDeliveryForm(false);
    } else if (e.target.value === "home") {
      setShowPickupForm(false);
      setShowDeliveryForm(true);
    }
  };

  return (
    <>
    <Navbar/>
    <div>
      <h2 className="checkout1">Checkout</h2>
      <div className="option">
        <label>
          <input
            type="radio"
            value="home"
            checked={deliveryMethod === "home"}
            onChange={handleDeliveryChange}
          />
          Home Delivery
        </label>
        <label>
          <input
            type="radio"
            value="pickup"
            checked={deliveryMethod === "pickup"}
            onChange={handleDeliveryChange}
          />
          In-Store Pickup
        </label>
      </div>
      {showPickupForm && (
        <PickupForm 
          cartData={cartData}
          onSubmit={handleCheckoutComplete}
          onCancel={() => setShowPickupForm(false)}
        />
      )}
      {showDeliveryForm && (
        <DeliveryForm
          cartData={cartData}
          onSubmit={handleCheckoutComplete}
          onCancel={() => setShowDeliveryForm(false)}
        />
      )}
    </div>
    </>
  );
};

export default CheckoutForm;
