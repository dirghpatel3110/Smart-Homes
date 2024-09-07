import React, { useState } from 'react';
import './CSS/LoginSignup.css';
import axios from 'axios';

const LoginSignup = () => {

const[state,setState] = useState("Login");
const [role, setRole] = useState("Customer");
const[formData,setFormData] = useState({
  password:'',
  email:''
})

const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
}

const handleRoleChange = (role) => {
  console.log(role);
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


const signup = async () => {
  formData.role = 'Customer';
  console.log("Sign Up Function Executed", formData);
  try {
    const response = await axios.post('http://localhost:8080/Backend_war_exploded/signup', 
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
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        {state !== "Sign Up" ? (
          <div className="role-selection">
            <button
              style={{ backgroundColor: role === "Customer" ? "black" : "#ff4141" }}
              onClick={() => handleRoleChange('Customer')}
            >
              Customer
            </button>
            <button
              style={{ backgroundColor: role === "StoreManager" ? "black" : "#ff4141" }}
              onClick={() => handleRoleChange('StoreManager')}
            >
              Store Manager
            </button>
            <button
              style={{ backgroundColor: role === "Salesman" ? "black" : "#ff4141" }}
              onClick={() => handleRoleChange('Salesman')}
            >
              Salesman
            </button>
          </div>
        ) : null}
        <div className="loginsignup-fields">
          {state==='Sign Up'?<input name='name' value={formData.name} onChange={changeHandler} type="text" placeholder='Your Name' autoComplete="off"/>:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' autoComplete="off" />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        <button onClick={()=>{state==='Login'?login():signup()}} >Continue</button>
        {state==='Sign Up'
        ?<p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}} >Login here</span></p>
        :<p className='loginsignup-login'>Create an account? <span onClick={()=>{setState("Sign Up")}} >Click here</span></p>}
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup