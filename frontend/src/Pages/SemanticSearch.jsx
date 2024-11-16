// import React, { useState } from "react";
// import axios from "axios";
// import "./CSS/SemanticSearch.css"; // Optional CSS for styling

// const SemanticSearch = () => {
//   const [query, setQuery] = useState("");
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSearch = async () => {
//     if (!query.trim()) {
//       setError("Please enter a search query.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setRecommendations([]);

//     try {
//       const response = await axios.get(
//         `http://localhost:8080/myservlet/semanticSearch`,
//         {
//           params: { question: query },
//         }
//       );

//       const results = response.data.hits?.hits || [];
//       setRecommendations(results.map(hit => hit._source));
//     } catch (err) {
//       setError("Error fetching recommendations. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="semantic-search-container">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="What are you looking for?"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button onClick={handleSearch}>Recommend Product</button>
//       </div>
//       {loading && <p>Loading recommendations...</p>}
//       {error && <p className="error-message">{error}</p>}
//       <div className="recommendations">
//         {recommendations.length > 0 && (
//           <div>
//             <h2>Recommended Products:</h2>
//             <ul>
//               {recommendations.map((product, index) => (
//                 <li key={index}>
//                   <h3>{product.name}</h3>
//                   <p>{product.description}</p>
//                   <p><strong>Price:</strong> ${product.price}</p>
//                   {product.retailer_special_discounts && (
//                     <p>
//                       <strong>Discount:</strong> ${product.retailer_special_discounts}
//                     </p>
//                   )}
//                   {product.manufacturer_rebates && (
//                     <p>
//                       <strong>Rebate:</strong> ${product.manufacturer_rebates}
//                     </p>
//                   )}
//                   {product.category && (
//                     <p>
//                       <strong>Category:</strong> {product.category}
//                     </p>
//                   )}
//                   {product.warranty_price && (
//                     <p>
//                       <strong>Warranty Price:</strong> ${product.warranty_price}
//                     </p>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SemanticSearch;



import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./CSS/SemanticSearch.css"; // Optional CSS for styling

const SemanticSearch = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:8080/myservlet/semanticSearch`,
        {
          params: { question: query },
        }
      );

      const results = response.data.hits?.hits || [];

      // Redirect to the search results page and pass the results via state
      navigate("/search-results", {
        state: { recommendations: results.map(hit => hit._source) },
      });
    } catch (err) {
      setError("Error fetching recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="semantic-search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="What are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Recommend Product</button>
      </div>
      {loading && <p>Loading recommendations...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SemanticSearch;

