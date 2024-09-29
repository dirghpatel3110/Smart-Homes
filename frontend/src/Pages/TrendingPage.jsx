import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar/Navbar";
import "./CSS/TrendingPage.css";

const TrendingPage = () => {
  const [trendingData, setTrendingData] = useState(null);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrendingData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:8080/myservlet/trending"
        );
        setTrendingData(response.data);
        console.log(response);
      } catch (err) {
        setError("Error fetching trending data");
      } finally {
        setLoading(false);
      }
    };

    const fetchTopRatedProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/myservlet/topRatedProducts"
        );
        setTopRatedProducts(response.data);
      } catch (err) {
        setError("Error fetching top rated products");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/myservlet/products"
        );
        setProducts(response?.data);
      } catch (err) {
        setError("Error fetching product data");
      }
    };

    fetchTrendingData();
    fetchTopRatedProducts(); // Fetch top-rated products
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="trending">
        <br />
        <h1>Trending Products</h1>

        {/* Display Top Rated Products */}
        <h2>Most Liked Products:</h2>
        <ul className="trending-products-list">
          {topRatedProducts.map((product) => (
            <li key={product.ProductModelName} className="trending-product-item">
              <span className="product-name">Product Name: {product.ProductModelName} </span>
              <span>Average Rating: {product.AverageRating}</span>
            </li>
          ))}
        </ul>
        <br />

        {trendingData && (
          <div>
            <h2>Top Zip Codes:</h2>
            <ul className="trending-products-list">
              {trendingData.topZipCodes.map((zipCode, index) => (
                <li key={zipCode} className="trending-product-item">
                  <span className="product-name">Zip Code: {zipCode} </span>
                 <span> Bought Count: {trendingData.topZipCodeCounts[index]} </span>
                </li>
              ))}
            </ul>
            <br />

            <h2>Top Sold Products:</h2>

            <ul className="trending-products-list">
              {products
                .map((product) => {
                  const index = trendingData.topProducts.indexOf(product.id);
                  if (index !== -1) {
                    return {
                      ...product,
                      boughtCount: trendingData.topProductCounts[index],
                    };
                  }
                  return null;
                })
                .filter((product) => product !== null)
                .sort((a, b) => b.boughtCount - a.boughtCount)
                .map((product) => (
                  <li key={product.productId} className="trending-product-item">
                    <span className="product-name">Product Name: {product.name}</span>
                    <span>Bought Count: {product.boughtCount}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default TrendingPage;
