import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Product.css';

function Product() {
  return (
    <div className="cards">
      <Link to="/smart-doorbells" className="card"><span>Smart Doorbells</span></Link>
      <Link to="/smart-doorlocks" className="card"><span>Smart Doorlocks</span></Link>
      <Link to="/smart-speakers" className="card"><span>Smart Speakers</span></Link>
      <Link to="/smart-lightings" className="card"><span>Smart Lightings</span></Link>
      <Link to="/smart-thermostats" className="card"><span>Smart Thermostats</span></Link>
    </div>
  );
}

export default Product;