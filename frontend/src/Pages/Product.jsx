import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../Components/ProductCard/ProductCard'; 
import Navbar from '../Components/Navbar/Navbar';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/backend_war_exploded/products')
      .then((response) => {
        setProducts(response.data);
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

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      <Navbar/>
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
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
          ))}
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