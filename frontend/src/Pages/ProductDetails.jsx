// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import './CSS/ProductDetails.css';

// const ProductDetails = () => {
//   const location = useLocation();
//   const product = location.state?.product;

//   const [quantity, setQuantity] = useState(0);
//   const [selectedAccessories, setSelectedAccessories] = useState([]);
//   const [accessoryQuantities, setAccessoryQuantities] = useState({});
//   const [totalPrice, setTotalPrice] = useState(product.price);

//   // Ensure the total price is updated whenever quantity or selected accessories change
//   useEffect(() => {
//     if (product) {
//       const calculateTotalPrice = () => {
//         const accessoriesTotal = selectedAccessories.reduce((sum, accessory) => {
//           const accessoryQuantity = accessoryQuantities[accessory.name] || 1;
//           return sum + (parseInt(accessory.price) * accessoryQuantity);
//         }, 0);
//         return (product.price * quantity) + accessoriesTotal;
//       };
//       setTotalPrice(calculateTotalPrice());
//     }
//   }, [product, quantity, selectedAccessories, accessoryQuantities]);

//   if (!product) {
//     return <div>Product details not found.</div>;
//   }

//   const handleAccessoryClick = (accessory) => {
//     setSelectedAccessories((prevAccessories) => {
//       const existingAccessory = prevAccessories.find((a) => a.name === accessory.name);
//       if (!existingAccessory) {
//         setAccessoryQuantities((prevQuantities) => ({
//           ...prevQuantities,
//           [accessory.name]: 1, // Set initial quantity to 1 when accessory is added
//         }));
//         return [...prevAccessories, accessory];
//       }
//       return prevAccessories; // If already selected, do nothing
//     });
//   };

//   const handleQuantityChange = (delta) => {
//     setQuantity((prevQuantity) => {
//       const newQuantity = prevQuantity + delta;
//       if (newQuantity >= 0) {
//         return newQuantity;
//       }
//       return prevQuantity;
//     });
//   };

//   const handleAccessoryQuantityChange = (accessory, delta) => {
//     setAccessoryQuantities((prevQuantities) => {
//       const currentQuantity = prevQuantities[accessory.name] || 1;
//       const newQuantity = currentQuantity + delta;
//       return {
//         ...prevQuantities,
//         [accessory.name]: newQuantity >= 0 ? newQuantity : 1, // Ensure accessory quantity is at least 1
//       };
//     });
//   };

//   return (
//     <div className="product-detail">
//       <h2>{product.name}</h2>
//       <p>{product.description}</p>
//       <p><strong>Price:</strong> ${product.price} per unit</p>
//       <div className="quantity-container">
//         <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 0}>-</button>
//         <span>Quantity: {quantity}</span>
//         <button onClick={() => handleQuantityChange(1)}>+</button>
//       </div>
//       <div className="accessories-container">
//         <strong>Accessories:</strong>
//         {product.accessories.length > 0 ? (
//           <ul>
//             {product.accessories.map((accessory, index) => (
//               <li key={index} onClick={() => handleAccessoryClick(accessory)}>
//                 <div className="accessory-info">
//                   <strong>{accessory.name ? accessory.name : 'Unnamed accessory'}</strong>
//                   <p><strong>Description:</strong> {accessory.description || 'No description'}</p>
//                   <p><strong>Price:</strong> ${accessory.price}</p>
//                   {selectedAccessories.find((a) => a.name === accessory.name) && (
//                     <div className="accessory-quantity-container">
//                       <button onClick={() => handleAccessoryQuantityChange(accessory, -1)}>-</button>
//                       <span>Quantity: {accessoryQuantities[accessory.name] || 0}</span>
//                       <button onClick={() => handleAccessoryQuantityChange(accessory, 1)}>+</button>
//                     </div>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           'No accessories'
//         )}
//       </div>
//       <div className="add-to-cart-container">
//         <button className="add-to-cart-button">Add to Cart</button>
//         <p className="total-price">Total: ${totalPrice}</p>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './CSS/ProductDetails.css';

const ProductDetails = () => {
  const location = useLocation();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(0);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [accessoryQuantities, setAccessoryQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(product.price);

  // Ensure the total price is updated whenever quantity or selected accessories change
  useEffect(() => {
    if (product) {
      const calculateTotalPrice = () => {
        const accessoriesTotal = selectedAccessories.reduce((sum, accessory) => {
          const accessoryQuantity = accessoryQuantities[accessory.name] || 0;
          return sum + (parseFloat(accessory.price) * accessoryQuantity);
        }, 0);
        const total = (product.price * quantity) + accessoriesTotal;
        return parseFloat(total.toFixed(2));
      };
      setTotalPrice(calculateTotalPrice());
    }
  }, [product, quantity, selectedAccessories, accessoryQuantities]);

  if (!product) {
    return <div>Product details not found.</div>;
  }

  const handleAccessoryClick = (accessory) => {
    setSelectedAccessories((prevAccessories) => {
      const existingAccessory = prevAccessories.find((a) => a.name === accessory.name);
      if (!existingAccessory) {
        setAccessoryQuantities((prevQuantities) => ({
          ...prevQuantities,
          [accessory.name]: 1, // Set initial quantity to 1 when accessory is added
        }));
        return [...prevAccessories, accessory];
      }
      return prevAccessories; // If already selected, do nothing
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

      // If new quantity is 0, remove accessory from selectedAccessories
      if (newQuantity === 0) {
        setSelectedAccessories((prevAccessories) =>
          prevAccessories.filter((a) => a.name !== accessory.name)
        );
      }

      return {
        ...prevQuantities,
        [accessory.name]: newQuantity >= 0 ? newQuantity : 1, // Ensure accessory quantity is at least 1
      };
    });
  };

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price} per unit</p>
      <div className="quantity-container">
        <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 0}>-</button>
        <span>Quantity: {quantity}</span>
        <button onClick={() => handleQuantityChange(1)}>+</button>
      </div>
      <div className="accessories-container">
        <strong>Accessories:</strong>
        {product.accessories.length > 0 ? (
          <ul>
            {product.accessories.map((accessory, index) => (
              <li key={index} onClick={() => handleAccessoryClick(accessory)}>
                <div className="accessory-info">
                  <strong>{accessory.name ? accessory.name : 'Unnamed accessory'}</strong>
                  <p><strong>Description:</strong> {accessory.description || 'No description'}</p>
                  <p><strong>Price:</strong> ${accessory.price}</p>
                  {selectedAccessories.find((a) => a.name === accessory.name) && (
                    <div className="accessory-quantity-container">
                      <button onClick={() => handleAccessoryQuantityChange(accessory, -1)}>-</button>
                      <span>Quantity: {accessoryQuantities[accessory.name] || 0}</span>
                      <button onClick={() => handleAccessoryQuantityChange(accessory, 1)}>+</button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          'No accessories'
        )}
      </div>
      <div className="add-to-cart-container">
        <button className="add-to-cart-button">Add to Cart</button>
        <p className="total-price">Total: ${totalPrice}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
