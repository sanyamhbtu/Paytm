import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function UserList({user}) {
    const [people,setPeople] = useState([]);
    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/searchBulk?user="+user);
                setPeople(response.data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchPeople(); 
    }, [user]);
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      const navigate = useNavigate();
  return (
          <ul role="list" className="divide-y divide-gray-100">
            {people.map((person) => (
              <li key={person._id} className="flex justify-between gap-x-6 py-5">
               
                <div className="flex min-w-0 gap-x-4">
                   <div
                        style={{ backgroundColor: getRandomColor() }}
                        className="h-12 w-12 flex-none rounded-full flex items-center justify-center text-white font-bold"
                   >
                    {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                </div>
               
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900 mt-3">{person.firstName} {person.lastName}</p>
                    
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                 
                 <button className='shadow-md bg-cyan-500 h-8 w-28 rounded-xl p-1 ' onClick={()=>{
                    
                    navigate("/send?id="+person._id+"&name="+person.firstName)
                 }}>Send money</button>
                  
                </div>
              </li>
            ))}
          </ul>
        )

    }

export default UserList