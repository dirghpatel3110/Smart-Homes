import React, { useState } from 'react';

const TradingButton = ({ onFetch }) => {
  const [selectedOption, setSelectedOption] = useState('Top Likes');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch data based on selected option
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url;
      switch (selectedOption) {
        case 'Top Likes':
          url = 'http://localhost:8080/myservlet/products?action=mostLiked';
          break;
        case 'Top Zip Codes':
          url = 'http://localhost:8080/myservlet/products?action=topZipCodes'; // Adjust API accordingly
          break;
        case 'Top Sold Products':
          url = 'http://localhost:8080/myservlet/products?action=topSold'; // Adjust API accordingly
          break;
        default:
          return;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch top products');
      }
      const data = await response.json();
      onFetch(data); // Pass the fetched data to the parent component
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trading Button to fetch most liked products */}
      <div className='category-filter1'>
      <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
        <option value="Top Likes">Top Likes</option>
        <option value="Top Zip Codes">Top Zip Codes</option>
        <option value="Top Sold Products">Top Sold Products</option>
      </select>
      <button className='trading' onClick={fetchData}>Trading</button>
      </div>
      {/* Display loading state */}
      {loading && <p>Loading...</p>}

      {/* Display error message */}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default TradingButton;





