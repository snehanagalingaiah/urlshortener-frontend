import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {useState,useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {LoginContext} from './ContextProvider/Context';
import {BACKEND_URL} from "../staticData.js"



export default function TableViewer() {

     const columns = [
  { field: 'id', headerName: 'ID', minWidth: 150, flex:1 },
  { field: 'fullUrl', headerName: 'FULL URL', minWidth: 150, flex:1 },
  { field: 'shortUrl', headerName: 'SHORT URL', minWidth: 150 , flex:1 },
  { field: 'clicks', headerName: 'CLICKS', minWidth: 150, flex:1 },
  
];

const [rows, setRows] = useState([]);

     const{loginData, setLoginData} = useContext(LoginContext);

     const navigate = useNavigate();

     const userValid = async () =>{

    //validating the user
      console.log("userValidate func hit")

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

      catch(err)
      {

         alert("Invalid token");
         navigate("*") 
      }
}


    const fetchUrl = async(req,res,next) =>
    {
      console.log("fetch Url func loginData", loginData);
      try{
        const response = await axios.get(`${BACKEND_URL}/shorturl/getall/${loginData._id}`)
        const rowData=  JSON.parse(JSON.stringify(response.data));
   
         console.log("response data",response.data)
         console.log("rowData",rowData);

         if(rowData){
          console.log("inside if")
          rowData.forEach((obj, index) =>{
          obj.id = index+1;
          obj.shortUrl = `${BACKEND_URL}/shorturl/${obj.shortUrl}`
          delete obj["createdBy"];
           delete obj["createdAt"];
         })
      }

         setRows(rowData);
         

      }
      catch(err)
      {
        console.log(err)
        alert("NO url created by the user, go back and create some");
      }
    }

   useEffect(()=>{

      userValid();

      
      }, [])

   useEffect(() =>{

    console.log("login data set",loginData)

    if(loginData)
         fetchUrl();


   },[loginData])


  return (
     <div style={{ height: 400, width: '70%', margin: 'auto', marginTop:'5%' }}>
      
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
     
    </div>
  );
}