import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source || "";
  const handleClick = () => {
    onClick(product);
    navigate(`/product/${product.id}`, { state: { product } });
  };
  return (
    <div className="product-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="product-info">
        {console.log(product)}
        <h3>{product.name || product.ProductModelName}</h3>
        <p>{product.description}</p>
        <p>Price: ${product.price || product.ProductPrice}</p>
        <p>Category: {product.category || product.ProductCategory}</p>
        {source === "reviews" ? (
          <>
            <p>Reviews: {product.ReviewText}</p>
            <p>Rating: {product.ReviewRating}</p>
            <p>Review Date: {product.ReviewDate}</p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
