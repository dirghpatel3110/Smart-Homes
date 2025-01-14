import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../Components/ProductCard/ProductCard'; 
import SemanticSearch from './SemanticSearch';
import Navbar from '../Components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import SemanticReviews from './SemanticReviews';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    ? filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredProducts.filter(product => 
        product.category === selectedCategory && 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <>
      <Navbar />
      <div className="product-container">
        <div className='set-btn'>
        <SemanticSearch/>
        <SemanticReviews/>
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

      </div>
    </>
  );
};

export default Product;
