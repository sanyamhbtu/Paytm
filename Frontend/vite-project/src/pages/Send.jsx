import React, { useState } from 'react'
import Transaction from '../assets/Transaction.png'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
function Send() {
  const [searchParam] = useSearchParams();
  const[amount,setAmount] = useState("");
  const id = searchParam.get("id");
  const name = searchParam.get("name");
  const token = Cookies.get('token')
  const navigate = useNavigate()
  const handlesubmit = async() =>{
    await axios.post("http://localhost:3000/api/v1/account/transfer",{
      amount : amount,
      to : id
    },{
      headers : {
        Authorization : `Bearer ${token}`
      }
    })
navigate("/dashboard")
  }
  return (
    <center className='mt-40'>
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 ">
    <img
      className="w-full h-48 object-fill"
      src={Transaction}
      alt="Card Image"
    />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">Send Money</div>
      <p className="text-gray-700 text-base">
        <h1 className='font-bold text-green-400 text-2xl'>{name}</h1>
      
        Enter amount in rupees
      </p>
      <input
  type="number"
  placeholder='Amount'
  className="border-2 border-gray-300 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
  onChange={(e)=>{
    setAmount(e.target.value);
  }}
/>
    </div>
    <div className="px-6 py-4">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
      onClick={handlesubmit}>
        Send Money
      </button>
    </div>
  </div>
    </center>
   
  )
}

export default Send