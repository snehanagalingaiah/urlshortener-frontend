import React, {useEffect, useState} from "react"
import {useParams, useNavigate, NavLink} from "react-router-dom";
import axios from 'axios';
import {BACKEND_URL} from "../staticData.js"

const ForgotPassword = () => {
     const {id, token} = useParams();
     const navigate = useNavigate();
     const [password, setPassword] = useState("");
     const [cpassword, setCpassword] = useState("");
     const [message, setMessage] = useState("")
     
//verifying the password reset link sent to the user
     const userValid = async() =>{
          try{
                 const res = await axios.get(`${BACKEND_URL}/user/reset-password/${id}/${token}`);
                 console.log("res", res);
                 if(res.status==400)
                     navigate("*");
                 else
                    console.log("user valid")
               }
          catch(err){
                 alert(err.response.data);
                 navigate("*");
              }
       }

    useEffect(()=>{ 
       userValid();
    }, [])
 
   const setVal = async (e) => {
     setPassword(e.target.value);
   }
   const setValCPass = async (e) => {
     setCpassword(e.target.value);
   }

   //func to pass the newly set password to backend
   const sendPass = async (e) => {
             e.preventDefault();
            if(password === "")
               alert("Please enter password")
            else if(password.length<6)
               alert ("Password must be atleast 6 characters")
            else if(cpassword === "")
               alert("Please enter confirm password")
            else if(password !== cpassword)
               alert("Password and confirm password do not match")
            else{
               const res = await axios.post(`${BACKEND_URL}/user/${id}/${token}`,
               {
                    password:password,
                    cpassword:cpassword
               });
               if(res.status == 200){
               setPassword("");
               setCpassword("");
               setMessage(true); }
              else{
                alert("token expired, generate new link");
              }
            }
       }
     return (    
           <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Enter Your New Password</h1>
                     </div>
                  {message? 
                  <div>
                    <p style ={{color:"green", fontWeight:"bold"}}> Password changed </p>
                    <NavLink to="/" className="btn btn-primary" style={{ fontSize: 18 }}> Back To Home Page </NavLink>
                  </div>
                  : 
                    <form>
                        <div className="form_input">
                            <label htmlFor="password">New Password</label><br/>
                            <input type="password" name="password" id="password" value ={password} onChange = {setVal} placeholder='Enter Your New Password' />
                        </div>
                        <div className="form_input">
                            <label htmlFor="password">Confirm New Password</label><br/>
                            <input type="password" name="cpassword" id="cpassword" value ={cpassword} onChange = {setValCPass} placeholder='Confirm Password' />
                        </div>
                        <button className='btn' onClick = {sendPass}>Submit</button>
                     </form>}
                 </div>
          </section>
     	)
 }

export default ForgotPassword;
