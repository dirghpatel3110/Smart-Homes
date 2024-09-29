import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar/Navbar";

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
          "http://localhost:8080/myservlet/topRatedProducts" // Update the URL to your servlet
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
      <div>
        <br />
        <h1>Trending Products</h1>
        


        {/* Display Top Rated Products */}
        <h2>Most liked products:</h2>
        <ul>
          {topRatedProducts.map((product) => (
            <li key={product.ProductModelName}>
              Product Name: {product.ProductModelName} - Average Rating: {product.AverageRating}
            </li>
          ))}
        </ul>
        <br />
        {/* Top Zip Codes */}
        {trendingData && (
          <div>
            <h2>Top Zip Codes:</h2>
            <ul>
              {trendingData.topZipCodes.map((zipCode, index) => (
                <li key={zipCode}>
                  Zip Code: {zipCode} Bought Count: {trendingData.topZipCodeCounts[index]}
                </li>
              ))}
            </ul>
            <br />
            
            {/* Top Sold Products */}
            <h2>Top Sold Products:</h2>
            <ul>
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
                  <li key={product.productId}>
                    Product Name: {product.name} - Bought Count: {product.boughtCount}
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
