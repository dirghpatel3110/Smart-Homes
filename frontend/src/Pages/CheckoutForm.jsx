import React, { useState } from "react";
import axios from "axios";
import './CSS/CheckoutForm.css';

const PickupForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [whoIsPickingUp, setWhoIsPickingUp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      whoIsPickingUp,
      phoneNumber,
      creditCard,
    };

    axios
      .post("http://localhost:8080/backend_war_exploded/checkout/pickup", payload)
      .then((response) => {
        onSubmit(response.data);
      })
      .catch((error) => {
        setError("Error during pickup checkout");
      });
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
        <button type="submit">Submit</button>
        {error && <p>{error}</p>}
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

const DeliveryForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      address,
      city,
      state,
      zipCode,
      creditCard,
      phoneNumber,
    };

    axios
      .post("http://localhost:8080/backend_war_exploded/checkout/delivery", payload)
      .then((response) => {
        onSubmit(response.data);
      })
      .catch((error) => {
        setError("Error during delivery checkout");
      });
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

const CheckoutForm = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [showPickupForm, setShowPickupForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(true);
  const [checkoutData, setCheckoutData] = useState(null);

  const handleCheckoutComplete = (data) => {
    setCheckoutData(data);
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
          onSubmit={handleCheckoutComplete}
          onCancel={() => setShowPickupForm(false)}
        />
      )}
      {showDeliveryForm && (
        <DeliveryForm
          onSubmit={handleCheckoutComplete}
          onCancel={() => setShowDeliveryForm(false)}
        />
      )}
      {checkoutData && <p>Checkout successful: {JSON.stringify(checkoutData)}</p>}
    </div>
  );
};

export default CheckoutForm;
