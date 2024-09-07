// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './CSS/Login.css'; // Importing the CSS file

const Login = () => {
  const [role, setRole] = useState("Customer");
  const [formData, setFormData] = useState({
    password: '',
    email: ''
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setRole(role);
  };

  const login = async () => {
    formData.role = role;
    console.log("Login Function Executed", formData);

    try {
      const response = await axios.post('http://localhost:8080/Backend_war_exploded/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('role', formData?.role);
        window.location.replace('/product');
      } else {
        alert(response?.data?.errors);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className='login-container'>
      <h1 className='login-title'>Login</h1>
      <div className="login-role-selection">
        <button
          className={role === "Customer" ? 'role-button active' : 'role-button'}
          onClick={() => handleRoleChange('Customer')}
        >
          Customer
        </button>
        <button
          className={role === "StoreManager" ? 'role-button active' : 'role-button'}
          onClick={() => handleRoleChange('StoreManager')}
        >
          Store Manager
        </button>
        <button
          className={role === "Salesman" ? 'role-button active' : 'role-button'}
          onClick={() => handleRoleChange('Salesman')}
        >
          Salesman
        </button>
      </div>
      <div className="login-fields">
        <input className='login-input' name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' autoComplete="off" />
        <input className='login-input' name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
      </div>
      <button className='login-button' onClick={()=>login()}>Continue</button>
      <p className='login-signup-redirect'>Create an account? <a href="/signup" className='login-link'>Click here</a></p>
    </div>
  );
};

export default Login;
