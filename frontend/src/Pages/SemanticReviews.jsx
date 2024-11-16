import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./CSS/SemanticSearch.css"; // Optional CSS for styling

const SemanticReviews = () => {
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
        `http://localhost:8080/myservlet/reviewSemanticSearch`,
        {
          params: { question: query },
        }
      );

      const results = response.data.hits?.hits || [];
      // Redirect to the search results page and pass the results via state
      navigate("/search-results", {
        state: { recommendations: results.map(hit => hit._source), source: 'reviews' },
        
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
        <button onClick={handleSearch}>Search Reviews</button>
      </div>
      {loading && <p>Loading reviews...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SemanticReviews;

