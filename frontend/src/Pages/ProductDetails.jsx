import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/ProductDetails.css";
import Navbar from "../Components/Navbar/Navbar";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(0);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [accessoryQuantities, setAccessoryQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    if (product) {
      const calculateTotalPrice = () => {
        const accessoriesTotal = selectedAccessories.reduce(
          (sum, accessory) => {
            const accessoryQuantity = accessoryQuantities[accessory.name] || 0;
            return sum + parseFloat(accessory.price) * accessoryQuantity;
          },
          0
        );

        let total = (product.discountedPrice ? product.discountedPrice : product.price) * quantity + accessoriesTotal;

        if (isChecked && product.warranty) {
          total += parseFloat(product.warranty.price);
        }

        return parseFloat(total.toFixed(2));
      };

      setTotalPrice(calculateTotalPrice());
    }
  }, [product, quantity, selectedAccessories, accessoryQuantities, isChecked]);

  if (!product) {
    return <div>Product details not found.</div>;
  }

  const handleAccessoryClick = (accessory) => {
    setSelectedAccessories((prevAccessories) => {
      const existingAccessory = prevAccessories.find(
        (a) => a.name === accessory.name
      );
      if (!existingAccessory) {
        setAccessoryQuantities((prevQuantities) => ({
          ...prevQuantities,
          [accessory.name]: 1,
        }));
        return [...prevAccessories, accessory];
      }
      return prevAccessories;
    });
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + delta;
      if (newQuantity >= 0) {
        return newQuantity;
      }
      return prevQuantity;
    });
  };

  const handleAccessoryQuantityChange = (accessory, delta) => {
    setAccessoryQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[accessory.name] || 1;
      const newQuantity = currentQuantity + delta;

      if (newQuantity === 0) {
        setSelectedAccessories((prevAccessories) =>
          prevAccessories.filter((a) => a.name !== accessory.name)
        );
      }

      return {
        ...prevQuantities,
        [accessory.name]: newQuantity >= 0 ? newQuantity : 1,
      };
    });
  };

  const handleAddToCart = async () => {
    const email = localStorage.getItem("email"); 
    if (!email) {
      console.error("User email not found in local storage.");
      return;
    }

    const cartData = {
      email,
      action: "add",
      productId: product.id,
      name: product.name,
      price: product.price,
      warranty: isChecked ? product.warranty: null,
      category: product.category,
      quantity: quantity,
      accessories: selectedAccessories.map((a) => ({
        ...a,
        quantity: accessoryQuantities[a.name] || 1,
      })),
    };

    try {
      await axios.post(
        "http://localhost:8080/backend_war_exploded/cart",
        cartData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="product-detail">
        <h2>
          <strong>Name: </strong>
          {product.name}
        </h2>
        <p>
          <strong>Description: </strong>
          {product.description}
        </p>
        <p>
          <strong>Price: </strong> ${product.price} per unit
        </p>
        {
          product.discountedPrice && ( <p>
            <strong>Discounted Price: </strong> ${product.discountedPrice} per unit
          </p>)
        }
        {product.warranty && (
          <p>
            <strong>Warranty:</strong>{" "}
            {`Available for $${product.warranty.price}`}{" "}
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </p>
        )}
        <div className="quantity-container">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 0}
          >
            -
          </button>
          <span>Quantity: {quantity}</span>
          <button onClick={() => handleQuantityChange(1)}>+</button>
        </div>
        <div className="accessories-container">
          <strong className="accessories">Accessories:</strong>
          <br />
          {product.accessories.length > 0 ? (
            <ul>
              {product.accessories.map((accessory, index) => (
                <li key={index} onClick={() => handleAccessoryClick(accessory)}>
                  <div className="accessory-info">
                    <p>
                      <strong>Name: </strong>
                      {accessory.name || "Unnamed accessory"}
                    </p>
                    <p>
                      <strong>Description: </strong>{" "}
                      {accessory.description || "No description"}
                    </p>
                    <p>
                      <strong>Price: </strong> ${accessory.price}
                    </p>
                    {selectedAccessories.find(
                      (a) => a.name === accessory.name
                    ) && (
                      <div className="accessory-quantity-container">
                        <button
                          onClick={() =>
                            handleAccessoryQuantityChange(accessory, -1)
                          }
                        >
                          -
                        </button>
                        <span>
                          Quantity: {accessoryQuantities[accessory.name] || 0}
                        </span>
                        <button
                          onClick={() =>
                            handleAccessoryQuantityChange(accessory, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            "No accessories"
          )}
        </div>
        <div className="add-to-cart-container">
          <button className="add-to-cart-button1" onClick={handleAddToCart}>
            Add to Cart
          </button>
          &nbsp;
          <p className="total-price">Total: ${totalPrice}</p>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
