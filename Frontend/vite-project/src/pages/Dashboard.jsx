import React, { useEffect, useState } from 'react'
import Appbar from '../components/Appbar'
import UserList from '../components/UserList'
import axios from 'axios';
import Cookies from 'js-cookie'
function Dashboard() {
  const [user,setUser] = useState("");
  const [balance , setBalance] = useState("");
  const [firstName , setFirstName] = useState("");
  const [lastName , setLastName] = useState("");
  const token = Cookies.get('token')
  useEffect(() => {
    const fetchAccountDetails = async () => {
      if(!token){
      setFirstName("")
      setLastName("")
      setBalance("0")
      return
      }
      try {
          const decode = await axios.get("http://localhost:3000/api/v1/user/decode",{
            headers: {
              Authorization: `Bearer ${token}`, 
            }
          })
          
          const decoded = decode.data.userId
        const balanceResponse = await axios.post("http://localhost:3000/api/v1/account/balance", {
             userId : decoded
        });
        
        const infoResponse = await axios.post("http://localhost:3000/api/v1/user/info", {
          userId : decoded
        });
        if(!infoResponse){
          alert(infoResponse.data.message)
        }
        
        setBalance(balanceResponse.data.balance);
        setFirstName(infoResponse.data.firstName);
        setLastName(infoResponse.data.lastName);
        
      } catch (error) {
        alert("Failed to fetch account details");
      }
    };
    
    fetchAccountDetails();
  }, [token]);
  
  return (
    <>
    <Appbar />
    <h1 className='text-4xl mt-2 bg-slate-200 italic font-bold h-14 px-5'>Account Holder : {firstName} {lastName} </h1>
    <h1 className='text-4xl mt-2 bg-slate-200 italic font-bold h-14 px-5'>Your Balance : {balance} </h1>
    <br></br>
    <div className='bg-slate-200 flex flex-col items-center justify-center h-24'>
    <h1 className='text-4xl italic font-bold h-12 px-5 text-center'>Users</h1>
    <input 
        type="text" 
        placeholder='Enter name' 
        className='text-center my-4' 
        onChange={(e) =>{
          setUser(e.target.value)
        }}
    />
</div>
<div className='w-[90%] mx-auto rounded border-2 p-5 mt-2'>
  <UserList user={user}/>
</div>

    
    </>
  )
}


export default Dashboard