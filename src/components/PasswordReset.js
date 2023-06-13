import React, {useState} from "react";
import axios from 'axios';
import {BACKEND_URL} from "../staticData.js"

const PasswordReset = () => {
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
	
   const setVal = (e) => { 
     setEmail(e.target.value);
   }

   //hits the backend api to send reset password link
   const sendLink = async (e) => {      
      e.preventDefault();
      if (email ==="")
            alert("Please enter your email")
      else if (!email.includes("@"))
            alert("Enter a valid email")
       else{
            try{
                const res = await axios.post(`${BACKEND_URL}/user/forgot-password`, {email: email})
                if(res.status === 200){
                      setEmail("");
      	              setMessage("true")
                   }
                }
             catch(err){
                    console.log("catch block error",err);
                    alert(err.response.data);
             }
        }
     }
     return (
		<section>
                  <div className="form_data">
                      <div className="form_heading">
                          <h1>Enter Your Email</h1> 
                       </div>
                      {message? <p style ={{color:"green", fontWeight:"bold"}}> Password reset link sent on your mail </p>: ""}
                    <form>
                        <div className="form_input">
                            <label htmlFor="email">Email</label><br/>
                            <input type="email" name="email" id="email" value ={email} onChange = {setVal} placeholder='Enter Your Email Address' />
                        </div>
                        <button className='btn' onClick = {sendLink}>Send</button>
                     </form>
                   </div>
                 </section>
       	)
}

export default PasswordReset
