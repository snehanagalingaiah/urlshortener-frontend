import * as React from 'react';
import {useState,useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import {LoginContext} from './ContextProvider/Context';
import {BACKEND_URL} from "../staticData.js"
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)


export default function Analytics() {
     const [urlData, setUrlData] =useState("")
     const [dataSet, setDataSet] = useState([]);
     const{loginData, setLoginData} = useContext(LoginContext);
     const navigate = useNavigate();

      const userValid = async () =>{

       //validating the user brfore diplaying the page
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
                });
     
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

   //func to get all the urls created by the user 
    const fetchUrl = async(req,res,next) =>
      {
          console.log("fetch Url func loginData", loginData);
          try{
             const response = await axios.get(`${BACKEND_URL}/shorturl/getall/${loginData._id}`)
             const responseData=  JSON.parse(JSON.stringify(response.data));
             console.log("raw data",response.data)
             console.log("responseData",responseData);
             if(responseData)
               {
                  console.log("inside if")
                  responseData.forEach((obj, index) =>
                    {
                      //console.log("date", responseData.createdAt.toISOString().split('T'));
                      //console.log("date",obj.createdAt.split('T')[0]);
                     obj.createdAt = obj.createdAt.split('T')[0]
                   })
                }
              setUrlData(responseData);
          }
         catch(err)
          {
            console.log(err)
            alert("NO url created by the user, go back and create some");
            navigate("*");
           }
      }

   //processing the fetched urlData to make it suitable enough to generate line graph
      const makeChartData = () =>{
           let today = new Date();
           let countDays = 30
           let xAxis = [];
           let yAxis = [];
           const chartData = new Map();
                console.log("url data..", urlData)
                if(urlData)
                   {
                     urlData.forEach((obj, index) =>
                      {
                        let status = chartData.has(obj.createdAt)
                        if(status===false )
                             chartData.set( obj.createdAt, 1);
                        else
                       {
                             let count = chartData.get(obj.createdAt);
                             chartData.set( obj.createdAt , count+1);
                        }
                     })
                  }
            
            while(countDays>=0)
          {
             let priorDate = new Date(new Date().setDate(today.getDate() - countDays));
             priorDate=priorDate.toISOString().split('T')[0]
             countDays--
             if(!chartData.has(priorDate))
                chartData.set(priorDate, 0);
             else
             {
                let tempcount = chartData.get(priorDate);
                chartData.delete(priorDate);
                chartData.set(priorDate,tempcount);
              }
           }
        let chartDataArray = [];  
        for (let [key, value] of chartData) 
        {
             let chartDataObj ={x:key , y:value };
             chartDataArray.push(chartDataObj);
         }
             setDataSet(chartDataArray);
             console.log("chart data",chartData);
             console.log("chart data array",chartDataArray);
    }

      useEffect(()=>{
           userValid();
      }, [])

     useEffect(() =>{
          console.log("login data set",loginData)
          if(loginData)
             fetchUrl();
      },[loginData]);

     useEffect(()=>
      {
          if(urlData)
            makeChartData();
      },[urlData])

  return (
     <div style={{ height: 400, width: '70%', margin: 'auto', marginTop:'5%' }}>
       <Line
        data={{
          datasets: [
            {
              label: "# of Urls generated by the user everyday over the last 31 days",
              // y-axis data plotting values
              data: dataSet,
              fill: false,
              borderWidth:4,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor:'black',
              responsive:true
            },
          ],
        }}
      />    
    </div>
  );
}
