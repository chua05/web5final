'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'

type User = {
  id: number
  name: string
  username: string
  email: string
}

export default function UserList() {
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users')
      return response.data
    },
  })

  if (isLoading) return <div className="text-center py-8">Loading users...</div>
  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load users'
    return <div className="text-center py-8 text-red-500">Error: {errorMessage}</div>
  }

  if (!users || users.length === 0) {
    return <div className="text-center py-8">No users found</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Link 
            href={`/users/${user.id}`} 
            key={user.id}
            className="border p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-sm text-gray-500 mt-2">{user.email}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}