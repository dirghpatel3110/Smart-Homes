import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../Components/ProductCard/ProductCard"; // Assuming you have a ProductCard component for display
import Navbar from "../Components/Navbar/Navbar";

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recommendations = location.state?.recommendations || [];
  const source = location.state?.source || "";
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <Navbar />
      <div className="search-results-container">
        <h2>
          {source === "reviews"
            ? "Recommended Reviews"
            : "Recommended Products"}
        </h2>
        <div className="product-grid">
          {recommendations.length > 0 ? (
            recommendations.map((product) => (
              <div key={product.id} className="product-card">
                <ProductCard
                  key={product.id}
                  product={product}
                  source={source}
                  onClick={() => handleProductClick(product)}
                />
              </div>
            ))
          ) : (
            <p>No recommendations found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResultsPage;
