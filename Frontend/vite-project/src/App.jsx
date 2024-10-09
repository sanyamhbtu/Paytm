import {BrowserRouter, Route, Routes} from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Send from "./pages/Send"
import Logout from "./pages/Logout"
import SendMoney from "./components/SendMoney"
import Update from "./components/Update"
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/signup" element = {<Signup />}/>
      <Route path = "/login" element = {<Login />}/>
      <Route path = "/dashboard" element = {<Dashboard />}/>
      <Route path = "/send" element = {<Send />}/>
      <Route path = "/logout" element = {<Logout/>}/>
      <Route path = "/sendMoney" element = {<SendMoney />} />
      <Route path = "/update" element = {<Update />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
