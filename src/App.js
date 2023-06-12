import Header from  "./components/Header"
import Login from  "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import ErrorPage from "./components/ErrorPage"
import PasswordReset from "./components/PasswordReset"
import ForgotPasword from "./components/ForgotPassword"
import ActivateUser from "./components/ActivateUser"
import UrlShortener from "./components/UrlShortener"
import TableViewer from "./components/TableViewer"
import Analytics from "./components/Analytics"
import {Routes,Route} from "react-router-dom"

function App() {
  return (
   <>
   <Header />

   <Routes>
   <Route path = "/register" element = {<Register />} />
   <Route path = "/dashboard" element = {<Dashboard />} />
   <Route path = "/password-reset" element = {<PasswordReset />} />
   <Route path = "/forgotpassword/:id/:token" element = {<ForgotPasword />} />
   <Route path = "/activate/:id/:token" element = {<ActivateUser />} />
   <Route path = "/urlshortener" element = {<UrlShortener />} />
   <Route path = "/tableview" element = {<TableViewer />} />
   <Route path = "/analytics" element = {<Analytics />} />
   <Route path = "*" element = {<ErrorPage />} />
   <Route path = "/" element = {<Login />} />
   </Routes>

   
   </>
  );
}

export default App;
