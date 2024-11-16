import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Modal from "react-modal"; // Import Modal component
import "./CSS/ProductDetails.css";
import Navbar from "../Components/Navbar/Navbar";

Modal.setAppElement("#root"); // Required for accessibility

const ProductDetails = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(0);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [accessoryQuantities, setAccessoryQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [isChecked, setIsChecked] = useState(false);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [likeCount, setLikeCount] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  let userId = localStorage.getItem("id");
  let userAge = localStorage.getItem("UserAge");
  let userGender = localStorage.getItem("UserGender");
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for Modal visibility
  const [reviewData, setReviewData] = useState({
    ProductModelName: product.name,
    ProductCategory: product.category,
    ProductPrice: product.price,
    StoreID: "",
    StoreZip: "",
    StoreCity: "",
    StoreState: "",
    ProductOnSale: false,
    ManufacturerName: "Smart Homes",
    ManufacturerRebate: false,
    UserID: userId,
    UserAge: userAge,
    UserGender: userGender,
    UserOccupation: "",
    ReviewRating: "",
    ReviewDate: "",
    ReviewText: "",
  });
  const [stores, setStores] = useState([]);

  // Fetch stores on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/myservlet/stores"
        );
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStores();
  }, []);

  // Handle opening and closing modal
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/myservlet/productReview",
        reviewData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      alert("Review submitted successfully!");
      closeModal();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review.");
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // Fetch initial like count and check if user has already liked the product
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/myservlet/products?action=getLike&productId=${product.id}`
        );
        const likeData = response.data.likeCount;
        if (likeData != null && !isNaN(likeData)) {
          setLikeCount(likeData);
        } else {
          setLikeCount("NaN");
        }

        const userHasLiked = localStorage.getItem(`liked_${product.id}`);
        setHasLiked(!!userHasLiked);
      } catch (error) {
        console.error("Error fetching like count:", error);
        setLikeCount("NaN");
      }
    };

    if (product) {
      fetchLikeCount();
    }
  }, [product]);

  // Calculate total price based on quantity, selected accessories, and discounts
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

        let total =
          (product.price -
            product.retailer_special_discounts -
            product.manufacturer_rebate) *
            quantity +
          accessoriesTotal;

        if (isChecked && product.warranty_price) {
          total += parseFloat(product.warranty_price);
        }

        const discount =
          (product.retailer_special_discounts + product.manufacturer_rebate) *
          quantity;
        setTotalDiscount(parseFloat(discount.toFixed(2)));

        return parseFloat(total.toFixed(2));
      };

      setTotalPrice(calculateTotalPrice());
    }
  }, [product, quantity, selectedAccessories, accessoryQuantities, isChecked]);

  useEffect(() => {
    setReviewData((prevData) => ({
      ...prevData,
      ManufacturerRebate: product.manufacturer_rebate > 0,
    }));
  }, [product]);

  useEffect(() => {
    setReviewData(prevData => ({
      ...prevData,
      ProductOnSale: product.retailer_special_discounts > 0
    }));
  }, [product]);

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
    const userId = localStorage.getItem("id");
    if (!userId) {
      console.error("User ID not found in local storage.");
      return;
    }

    const cartData = {
      userId: parseInt(userId),
      productId: product.id,
      productName: product.name,
      price: totalPrice,
      warranty: isChecked ? product.warranty_price : 0.0,
      category: product.category,
      quantity: quantity,
      discount: totalDiscount,
      accessories: selectedAccessories.map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        price: a.price,
        quantity: accessoryQuantities[a.name] || 1,
      })),
    };

    try {
      await axios.post("http://localhost:8080/myservlet/cart", cartData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleLikeClick = async () => {
    try {
      if (!hasLiked) {
        await axios.post(
          `http://localhost:8080/myservlet/products?action=like&productId=${product.id}`
        );
        setLikeCount((prevCount) =>
          prevCount !== "NaN" && prevCount != null ? prevCount + 1 : 1
        );
        setHasLiked(true);
        localStorage.setItem(`liked_${product.id}`, true);
      } else {
        await axios.post(
          `http://localhost:8080/myservlet/products?action=unlike&productId=${product.id}`
        );
        setLikeCount((prevCount) =>
          prevCount !== "NaN" && prevCount > 0 ? prevCount - 1 : 0
        );
        setHasLiked(false);
        localStorage.removeItem(`liked_${product.id}`);
      }
    } catch (error) {
      console.error("Error liking/unliking the product:", error);
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
        <p>  
          <strong>Retailer Special Discounts: </strong> $
          {product.retailer_special_discounts || 0}
        </p>
        <p>
          <strong>Manufacturer Rebate: </strong> $
          {product.manufacturer_rebate || 0}
        </p>
        {product.warranty_price && (
          <p>
            <strong>Warranty:</strong>{" "}
            {`Available for $${product.warranty_price}`}
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
          { product.accessories && product.accessories.length > 0 ? (
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
        <br />
        <div className="like-container">
          <button onClick={handleLikeClick} className="like-button">
            {hasLiked ? <FaHeart color="red" /> : <FaRegHeart />}
          </button>
          &nbsp;
          <span>
            {likeCount === "NaN" || likeCount === null
              ? "Likes not available"
              : `${likeCount} Likes`}
          </span>
          <br />
          <br />
          <h4>Review : {reviewData.ReviewRating}/5</h4>
          <br />
          <button onClick={openModal} className="review-button">
            Product Review
          </button>
        </div>
        <p>
          <strong>Total Price: </strong> ${totalPrice}
        </p>
        <p>
          <strong>Total Discount: </strong> ${totalDiscount}
        </p>
        <button onClick={handleAddToCart} disabled={quantity === 0}>
          Add to Cart
        </button>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Product Review Form"
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2>Submit a Product Review</h2>
          <form onSubmit={handleSubmitReview}>
            <div>
              <label>ProductModelName: </label>
              <input
                type="text"
                name="ProductModelName"
                value={product.name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>ProductCategory: </label>
              <input
                type="text"
                name="ProductCategory"
                value={product.category}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>ProductPrice: </label>
              <input
                type="text"
                name="ProductPrice"
                value={product.price}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>Store ID: </label>
              <select
                name="StoreID"
                value={reviewData.StoreID}
                onChange={handleFormChange}
                required
              >
                <option value="">Select a Store</option>
                {stores.map((store) => (
                  <option key={store.storeId} value={store.storeId}>
                    {store.storeId} - {store.street}, {store.city},{" "}
                    {store.state}, {store.zipCode}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Store City: </label>
              <select
                name="StoreCity"
                value={reviewData.StoreCity}
                onChange={handleFormChange}
                required
              >
                <option value="">Select a City</option>
                {stores.map((store) => (
                  <option key={store.storeId} value={store.city}>
                    {store.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Store Zip: </label>
              <select
                name="StoreZip"
                value={reviewData.StoreZip}
                onChange={handleFormChange}
                required
              >
                <option value="">Select a Zip Code</option>
                {stores.map((store) => (
                  <option key={store.storeId} value={store.zipCode}>
                    {store.zipCode}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Store State: </label>
              <select
                name="StoreState"
                value={reviewData.StoreState}
                onChange={handleFormChange}
                required
              >
                <option value="">Select a State</option>
                {stores.map((store) => (
                  <option key={store.storeId} value={store.state}>
                    {store.state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Product On Sale: </label>
              <input
                type="text"
                name="ProductOnSale"
                value={product.retailer_special_discounts > 0 ? `Yes ($${product.retailer_special_discounts.toFixed(2)})` : "No"}
                readOnly
              />
            </div>
            <div>
              <label>Manufacturer Name: </label>
              <input
                type="text"
                name="ManufacturerName"
                value={reviewData.ManufacturerName}
              />
            </div>
            <div>
              <label htmlFor="manufacturerRebate">Manufacturer Rebate: </label>
              <input
                type="text"
                id="manufacturerRebate"
                value={
                  product.manufacturer_rebate > 0
                    ? `Yes ($${product.manufacturer_rebate.toFixed(2)})`
                    : "No"
                }
                readOnly
              />
            </div>
            <div>
              <label>UserID: </label>
              <input
                type="text"
                name="UserID"
                value={userId}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>User Age: </label>
              <input
                type="number"
                name="UserAge"
                value={userAge}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>User Gender: </label>
              <input
                type="text"
                name="UserGender"
                value={userGender}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>User Occupation: </label>
              <input
                type="text"
                name="UserOccupation"
                value={reviewData.UserOccupation}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>Review Rating: </label>
              <input
                type="number"
                name="ReviewRating"
                value={reviewData.ReviewRating}
                onChange={handleFormChange}
                min="1"
                max="5"
                required
              />
            </div>
            <div>
              <label>Review Date: </label>
              <input
                type="date"
                name="ReviewDate"
                value={reviewData.ReviewDate}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>Review Text: </label>
              <textarea
                name="ReviewText"
                value={reviewData.ReviewText}
                onChange={handleFormChange}
                required
              />
            </div>
            <button type="submit">Submit Review</button> &nbsp;
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ProductDetails;
