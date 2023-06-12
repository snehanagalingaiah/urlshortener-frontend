import React, {useState,useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {LoginContext} from './ContextProvider/Context';
import {BACKEND_URL} from "../staticData.js"

const UrlShortener = () => {
    
    const [fullUrl, setFullUrl] = useState("");
    const [urlResponse, setUrlResponse] = useState(false);
    const [shortUrl, setShortUrl] = useState("");

    const setVal = (e) => {

    	setFullUrl(e.target.value);
    }

    const{loginData, setLoginData} = useContext(LoginContext);

	const navigate = useNavigate();

   const userValid = async () =>{

   	//validating the user

    try{
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

      catch(err){
         navigate("*")
         alert("Invalid token");
      }
}

   useEffect(()=>{

     	userValid();

      }, [])


   const handleSubmit = async (e) => 
   {

   	e.preventDefault();

   	  if(fullUrl=="")
   	  	alert("Please enter full url");

   	  else
     {
      try{
      	const res = await axios.post(`${BACKEND_URL}/shorturl/create`,{fullUrl: fullUrl, createdBy:loginData._id});
         
         if(res)
         {
         	setUrlResponse(true);
         	setShortUrl(`${BACKEND_URL}/shorturl/${res.data.shortUrl}`)

          }const shortenAnother = () =>
    {
    	 navigate("/urlshortener")
    }
             	
        }

        catch(err)
        {
        	console.log(err);
        }
       }
    }

    const shortenAnother = (e) =>
    {
    	e.preventDefault();

    	 setUrlResponse(false);
         setShortUrl("");
         setFullUrl("");
    }
   
   

     return (
                
           <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Enter Your URL</h1>
                        
                    </div>

                 
                    <form>
                        <div className="form_input">
                            <label htmlFor="fullUrl">Full URL</label><br/>
                            <input type="url" name="fullUrl" id="fullUrl" value ={fullUrl} onChange = {setVal} placeholder='Enter Your Full Url' />
                        </div>

                       {urlResponse  ? 
                          <div>
                           <div className="form_input">
                            <label htmlFor="shortUrl">Short URL</label><br/>
                            <input type="url" name="shortUrl" id="shortUrl" value ={shortUrl}  />
                            </div> 
                            <div>
                            <button className='btn' onClick = {shortenAnother}>Shorten Another</button>
                            </div>
                            </div>
                            :  <button className='btn' onClick = {handleSubmit}>Submit</button>}  
                     </form>
                 </div>
          </section>

     	)
}

export default UrlShortener;