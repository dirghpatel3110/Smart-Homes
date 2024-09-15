import React, { useState } from 'react';
import axios from 'axios';
import './CSS/Signup.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signup = async () => {
    formData.role = 'Customer';
    
    try {
      const response = await axios.post('http://localhost:8080/backend_war_exploded/signup', 
        JSON.stringify(formData), 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        window.location.replace('/');
      } else {
        alert(response?.data?.errors);
      }
    } catch (error) {
      console.error("There was an error during the sign-up process", error);
      alert('Sign-up failed. Please try again.');
    }
  };
   
  return (
    <div className='signup-container'>
      <h1 className='signup-title'>Sign Up</h1>
      <div className="signup-fields">
        <input className='signup-input' name='name' value={formData.name} onChange={changeHandler} type="text" placeholder='Your Name' autoComplete="off" />
        <input className='signup-input' name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' autoComplete="off" />
        <input className='signup-input' name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
      </div>
      <button className='signup-button' onClick={()=>signup()}>Continue</button>
      <p className='signup-login-redirect'>Already have an account? <Link to="/" className='signup-link'>Login here</Link></p>
    </div>
  );
};

export default Signup;
