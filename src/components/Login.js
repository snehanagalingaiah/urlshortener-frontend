import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./mix.css";
import {BACKEND_URL} from "../staticData.js"


const Login = () =>{

     const [passShow, setPassShow] = useState(false);

      const [inpval, setInpval] = useState({
        email: "",
        password: "",
    });

      const navigate = useNavigate();

      console.log(inpval)

       const setVal= (e) => {

        const {name,value} = e.target;

        setInpval({...inpval,[name]:value});

    }

    const loginUser = async (e) =>{

    	e.preventDefault();
    	console.log("login user button")

    	const {email, password} = inpval;

    	 if (email ==="")
            alert("Please enter your email")

         else if (!email.includes("@"))
            alert("Enter a valid email")

         else if(password === "")
            alert("Please enter password")

        else if(password.length<6)
            alert ("Password must be atleast 6 characters")
         else{

             try{
                  var response = await axios.post(`${BACKEND_URL}/user/login`, 
                 {
                    
                    email: email, 
                    password: password, 
                    
                  } 
              
                );

                    console.log(response);

                    if(response.status==200){
                        alert("user login successful");
                        setInpval({...inpval,email:"",password:""});
                         await localStorage.setItem("access-token", response.data.token)
                         navigate("/dashboard");
                    }
                  }
                  catch(err){
                    console.log("catch block error",err);
                    alert(err.response.data);
                  } 


         }
            
    }

	return(

		<section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Please, Log In</h1>
                        <p>Hi, we are you glad you are back. Please login.</p>
                    </div>

                    <form>
                        <div className="form_input">
                            <label htmlFor="email">Email</label><br/>
                            <input type="email" name="email" id="email" value ={inpval.email} onChange = {setVal} placeholder='Enter Your Email Address' />
                        </div>

                         <div className="form_input">
                            <label htmlFor="password">Password</label>
                            <div className="two">
                            <input type = {!passShow ? "password" : "text"} name="password" id="password" value ={inpval.password} onChange = {setVal} placeholder='Enter Your password' />
                            <div className="showpass" onClick={() => setPassShow(!passShow)}>
                                    {!passShow ? "Show" : "Hide"}
                                </div>
                            </div>
                          </div>
                          <button className='btn' onClick = {loginUser}>Login</button>
                        <p>Don't have an Account? <NavLink to="/register">Sign Up </NavLink> </p>        
                        <p style={{color:"black",fontWeight:"bold"}}>Forgot Password  <NavLink to="/password-reset">Click Here</NavLink> </p>                                            
                     </form>
                 </div>
          </section>



 )
}

export default Login;