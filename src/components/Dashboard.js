import React, {useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {LoginContext} from './ContextProvider/Context';
import {BACKEND_URL} from "../staticData.js"

const Dashboard = () =>{

	const{loginData, setLoginData} = useContext(LoginContext);

	const navigate = useNavigate();

   const DashboardValid = async () =>{

   	//validating the user

   	let token = localStorage.getItem("access-token");
   	if(!token)
   		navigate("*")
   
    const res = await axios.get(`${BACKEND_URL}/user/validateUser`,
    	{
                headers: 
                {
                    "access-token": token
                }
        }
    	);
     

    if(res.status == 400 || !res.data)
    {
    	navigate("*")
    }
    else
    {
    	console.log("user verified");
    	setLoginData(res.data);
    }


   }

   useEffect(()=>{

   	DashboardValid();

   }, [])


	return(
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
		<img src="./man.png" alt ="man icon" style={{ width: "200px", marginTop: 20 }}/>
         <h1>User Email:{loginData? loginData.email: ""}</h1>
		</div>
	);
}

export default Dashboard;