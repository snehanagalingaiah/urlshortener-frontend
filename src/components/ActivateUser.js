import React, {useEffect} from "react";
import { NavLink } from "react-router-dom";
import { useParams,useNavigate} from "react-router-dom";
import axios from 'axios';
import {BACKEND_URL} from "../staticData.js"

  const ActivateUser = () =>{

     const {id, token} = useParams();
     const navigate = useNavigate();

     const linkValidation = async() => 
     {

       try{
          const res = await axios.get(`${BACKEND_URL}/user/activate/${id}/${token}`);
          console.log("res", res);

          if(res.status==400)
               navigate("*");

          else
             console.log("user activated")
        }

       catch(err){
          alert(err.response.data);
          navigate("*");
        }
     }

   useEffect(()=>{
        
       linkValidation();

    }, [])
 
   return(

   <>
     <div className="container">
        <div style={{ minHeight: "85vh", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
          <img src="/activation-4.png" alt="Account activated" style={{ width: "500px", marginBottom: 20 }} />
         
          
          <NavLink to="/" className="btn btn-primary" style={{ fontSize: 18 }}> Back To Home Page </NavLink>
        </div>
      </div>

    </>

   	);

} 


export default ActivateUser;