import React, {useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import "./Header.css"
import Avatar from '@mui/material/Avatar';
import {LoginContext} from "./ContextProvider/Context"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import SideNav from "./SideNav"
import {BACKEND_URL} from "../staticData.js"


const Header = () =>{
    //variables and functions for menu
    const{loginData, setLoginData} = useContext(LoginContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event) => {
     setAnchorEl(event.currentTarget); 
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
   
   //for logging out
    const logoutUser = async ()=>{
   	let token = localStorage.getItem("access-token");
   	if(!token)
   		navigate("*")
     const res = await axios.get(`${BACKEND_URL}/user/logout`,
    	{              
	     headers: 
                {
                    "access-token": token
                },
                withCredentials: true 
        }
    	);
     
     if(res.status == 400)
       {
    	  navigate("*")
        }
     else
      {
    	console.log("user logout");
    	localStorage.removeItem("access-token");
    	setLoginData(false);
    	navigate("/")
      }
   }

//for taking to error page
    const goError = () => {
        navigate("*")
    }
 
return(
         <header>
           <nav>  
             {loginData ? <SideNav /> :""}
             <h1> SimpleLink </h1>
             <div className="avtar">
               {loginData ?  <Avatar onClick={handleClick}>{ loginData.fname.charAt(0).toUpperCase() }</Avatar> : <Avatar onClick={handleClick}/>} 
             </div>
             <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            >
            {loginData ? 
             (<>
                <MenuItem onClick={() => {
             	 logoutUser()
             	 handleClose()}}>Logout</MenuItem>
              </>)
             :
             (<>
             <MenuItem onClick={() => {
                                        goError()
                                        handleClose()
                                 }}>Profile
              </MenuItem>
             </>)
          }
         </Menu>
        </nav>  
      </header>
 )
}

export default Header;
