import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../Components/ProductCard/ProductCard'; // Ensure the path is correct

const Product = () => {
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/backend_war_exploded/products')
      .then((response) => {
        setProducts(response.data);
        setCategories(Object.keys(response.data));
        setFilteredProducts(flattenProducts(response.data));
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const flattenProducts = (products) => {
    return Object.values(products).flat();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === 'All') {
      setFilteredProducts(flattenProducts(products));
    } else {
      setFilteredProducts(products[category]);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
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
          <ProductCard key={product.id} product={product} onClick={handleProductClick} />
        ))}
      </div>
      {selectedProduct && (
        <div className="product-detail">
          <h2>{selectedProduct.name}</h2>
          <p>{selectedProduct.description}</p>
          <p><strong>Price:</strong> ${selectedProduct.price}</p>
          <p><strong>Warranty:</strong> {selectedProduct.warranty ? `Price: $${selectedProduct.warranty.price}, Available: ${selectedProduct.warranty.available}` : 'No warranty'}</p>
          <p><strong>Accessories:</strong> {selectedProduct.accessories ? selectedProduct.accessories.join(', ') : 'No accessories'}</p>
          <button>Add to Cart</button>
          <p>Total: ${selectedProduct.price}</p>
        </div>
      )}
    </div>
  );
};

export default Product;
