import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {

const[state,setState] = useState("Login");
const [role, setRole] = useState("Customer");
const[formData,setFormData] = useState({
  username:'',
  password:'',
  email:''
})

const changeHandler = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
}

const handleRoleChange = (role) => {
  setRole(role);
};

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="role-selection">
          <button onClick={() => handleRoleChange('Customer')}>Customer</button>
          <button onClick={() => handleRoleChange('StoreManager')}>Store Manager</button>
          <button onClick={() => handleRoleChange('Salesman')}>Salesman</button>
        </div>
        <p>Selected Role: {role}</p>
        <div className="loginsignup-fields">
          {state==='Sign Up'?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' autoComplete="off"/>:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' autoComplete="off" />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        {/* <button onClick={()=>{state==='Login'?login():signup()}} >Continue</button> */}
        <button>Continue</button>
        {state==='Sign Up'
        ?<p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}} >Login here</span></p>
        :<p className='loginsignup-login'>Create an account? <span onClick={()=>{setState("Sign Up")}} >Click here</span></p>}
      </div>
    </div>
  )
}

export default LoginSignup