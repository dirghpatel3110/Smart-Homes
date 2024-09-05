import React, { useState } from 'react';
import './CSS/LoginSignup.css';
import {useNavigate } from 'react-router-dom';

const LoginSignup = () => {

const[state,setState] = useState("Login");
const [role, setRole] = useState("Customer");
const[formData,setFormData] = useState({
  username:'',
  password:'',
  email:''
})
const navigate = useNavigate();
const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
}

const handleRoleChange = (role) => {
  setRole(role);
};

const handleContinue = () => {
  if (formData.email && formData.password) {
    navigate('/product'); 
  } else {
    alert('Please fill in all fields.');
  }
};

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        {state !== "Sign Up" ? (
          <div className="role-selection">
            <button style={{backgroundColor: role==="Customer" ? "black" : "#ff4141"}} onClick={() => handleRoleChange('Customer')}>Customer</button>
            <button style={{backgroundColor: role==="StoreManager" ? "black" : "#ff4141"}} onClick={() => handleRoleChange('StoreManager')}>Store Manager</button>
            <button style={{backgroundColor: role==="Salesman" ? "black" : "#ff4141"}} onClick={() => handleRoleChange('Salesman')}>Salesman</button>
          </div>
        ) : null}
        <div className="loginsignup-fields">
          {state==='Sign Up'?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' autoComplete="off"/>:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' autoComplete="off" />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        <button onClick={handleContinue}>Continue</button>
        {state==='Sign Up'
        ?<p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}} >Login here</span></p>
        :<p style={{display: role !== "Customer" ? 'none' : 'block'}} className='loginsignup-login'>Create an account? <span  onClick={()=>{setState("Sign Up")}} >Click here</span></p>}
      </div>
    </div>
  )
}

export default LoginSignup
