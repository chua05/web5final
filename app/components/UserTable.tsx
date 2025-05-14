'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function UserTable() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-6 bg-white shadow-xl rounded-2xl overflow-x-auto">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">User Directory</h2>
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-purple-100 text-purple-800 uppercase text-xs font-bold">
          <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Username</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">City</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-100">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-purple-50 transition duration-150">
              <td className="py-3 px-4">{user.name}</td>
              <td className="py-3 px-4">@{user.username}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.address.city}</td>
              <td className="py-3 px-4 text-right space-x-2">
                <button className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">Edit</button>
                <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
