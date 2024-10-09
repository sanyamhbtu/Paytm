import React from 'react'
import paytm from "../assets/paytm.svg"
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
function Logout() {
    const navigate = useNavigate()
    const handleClick = async() =>{
        try{
            Cookies.remove('token')
            navigate("/dashboard")
            alert("You are logout successfully")
        } catch{
            alert("Something went wrong / try again")
            navigate("/dashboard")
        }
        
    }
    
  return (
    <>
     <center className='mx-auto my-24 h-96  w-96 shadow-2xl '>
        <div>
            <img src={paytm} alt="company logo" className=' w-96 h-32 p-6'/>
        </div>
        <div className=' relative py-6 bg-white '>
            <h1 className='text-3xl font-medium'>Are you really want to logout</h1>
        </div>
        <div className=' relative m-5  flex flex-row justify-around'>
            <button className='w-32 h-10 text-lg font-medium rounded-lg bg-red-200' onClick={()=>{
                navigate('/dashboard')
            }}> cancel </button>
            
            <button className='w-32 rounded-lg h-10 text-lg font-medium bg-red-200' onClick={handleClick}> logout </button>
        </div>

     </center>
    </>
  )
}

export default Logout