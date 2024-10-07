import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import './CSS/ProductBarChart.css';
import Navbar from '../Components/Navbar/Navbar';


const ProductInventoryBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/myservlet/ProductInventoryServlet');
        const products = response.data;
        
        // Prepare data for Google Charts
        const data = [
          ['Product', 'Available Items', { role: 'style' }],
          ...products.map((product, index) => [
            product.name, 
            product.availableItems, 
            `color: ${getRandomColor(index)}`
          ])
        ];
        
        setChartData(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching inventory data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRandomColor = (index) => {
    const colors = ['#3366cc'];
    return colors[index % colors.length];
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const options = {
    title: 'Product Inventory',
    chartArea: { width: '50%', height: '80%' }, // Increased height of chart area
    hAxis: {
      title: 'Available Items',
      minValue: 0,
    },
    vAxis: {
      title: 'Product',
    },
    legend: { position: 'none' },
    height: 800, // Increased overall height of the chart
  };

  return (
    <>
    <Navbar/>
    <div className="product-inventory-chart">
      <h2>Product Inventory Bar Chart</h2>
      <Chart
        chartType="BarChart"
        width="100%"
        height="800px"
        data={chartData}
        options={options}
      />
    </div>
    </>
  );
};

export default ProductInventoryBarChart;