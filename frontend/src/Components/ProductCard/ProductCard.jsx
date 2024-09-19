import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    onClick(product);
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="product-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;
