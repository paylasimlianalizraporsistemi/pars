import React from "react";
import "./App";
import './Login.css';


function Login() {
  return(
<div className="auto">
  <div className="col rounded shadow p-3 mb-5 bg-white col-first">
    <h1>Please Log In</h1>
    <form>
      <label>
        <p>Username</p>
        <input type="text" className="input-userName"/>
      </label>
      <label>
        <p>Password</p>
        <input type="password" />
      </label>
      <div>
      <form  action="http://localhost:3000/console/">
      <input type="submit" value="Login" />
      </form>
      </div>
    </form>
  </div>
  </div>

)
}
export default Login;
