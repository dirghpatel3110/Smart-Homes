import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../Components/ProductCard/ProductCard'; 
import Navbar from '../Components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    axios.get('http://localhost:8080/myservlet/products')
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data); 
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleTrendingButtonClick = () => {
    navigate('/trending');
  };
  const displayedProducts = selectedCategory === 'All' 
    ? filteredProducts 
    : filteredProducts.filter(product => product.category === selectedCategory);

  return (
    <>
      <Navbar />

      <div>
        <div className="category-filter">
          <label htmlFor="category">Filter by category:</label>
          <select 
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleTrendingButtonClick} className="trending-button">
          View Trending
        </button>
        <div className="product-grid">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
            ))
          ) : (
            <p>No products to display.</p>
          )}
        </div>

        {selectedProduct && (
          <div className="product-detail">
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <p><strong>Price:</strong> ${selectedProduct.price}</p>
            <p><strong>Retailer Special Discounts:</strong> ${selectedProduct.retailer_special_discounts}</p>
            <p><strong>Manufacturer Rebate:</strong> ${selectedProduct.manufacturer_rebate}</p>
            <p><strong>Warranty Price:</strong> ${selectedProduct.warranty_price}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <h3>Accessories:</h3>
            {selectedProduct.accessories && selectedProduct.accessories.length > 0 ? (
              <ul>
                {selectedProduct.accessories.map((accessory, index) => (
                  <li key={index}>
                    {accessory.name} - ${accessory.price}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No accessories available</p>
            )}
            <button>Add to Cart</button>
            <p>Total: ${selectedProduct.price}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Product;

