import React, { useState } from 'react'
import update from '../assets/update.jpg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function Update() {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.put('http://localhost:3000/api/v1/user/update', {
            password: password,
            firstName: firstName,
            lastName: lastName,
          });
          alert(response.data.message);
          navigate('/dashboard');
        } catch (error) {
          alert("Failed to update details, please try again.");
        }
      };
  return (
    <>
     <center className='mt-40'>
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 ">
    <img
      className="w-full h-48 object-fill"
      src={update}
      alt="Card Image"
    />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">Update details here</div>
      <form onSubmit={handleSubmit} method="POST" className="space-y-4">
  <div className="flex items-center">
    <label htmlFor="firstName" className="text-sm font-medium leading-6 text-gray-900 w-1/3">
      First name
    </label>
    <input
      id="firstName"
      name="firstName" 
      type="text"
      required
      className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      onChange={e => setFirstName(e.target.value)}
    />
  </div>

  <div className="flex items-center">
    <label htmlFor="lastName" className="text-sm font-medium leading-6 text-gray-900 w-1/3">
      Last name
    </label>
    <input
      id="lastName"
      name="lastName" 
      type="text"
      required
      className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      onChange={e => setLastName(e.target.value)}
    />
  </div>

  <div className="flex items-center">
    <label htmlFor="password" className="text-sm font-medium leading-6 text-gray-900 w-1/3">
      Password
    </label>
    <input
      id="password"
      name="password"
      type="password"
      required
      autoComplete="current-password"
      className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      onChange={e => setPassword(e.target.value)}
    />
  </div>

  <div>
    <button
      type="submit"
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
    >
      Update
    </button>
  </div>
</form>

    </div>
    
  </div>
    </center>
    </>
  )
}

export default Update