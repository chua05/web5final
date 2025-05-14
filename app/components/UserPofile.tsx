'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import MapBox from './Map'
import PostList from './PostList'

type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export default function UserProfile() {
  const params = useParams()
  const userId = params.id as string

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`);
      return response.data;
    },
  })

  if (isLoading) return <div className="text-center py-8">Loading user...</div>
  if (error) return <div className="text-center py-8 text-red-500">Error loading user</div>

  if (!user) return <div className="text-center py-8">User not found</div>

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <Link href="/" className="text-primary hover:underline mb-4 inline-block">
          &larr; Back to users
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Username:</span> @{user.username}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Phone:</span> {user.phone}</p>
              <p><span className="font-semibold">Website:</span> {user.website}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Company</h3>
              <p>{user.company.name}</p>
              <p className="text-gray-600 italic">{user.company.catchPhrase}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p>{user.address.street}, {user.address.suite}</p>
            <p>{user.address.city}, {user.address.zipcode}</p>
            
            <div className="mt-4">
              <MapBox lat={parseFloat(user.address.geo.lat)} lng={parseFloat(user.address.geo.lng)} />
            </div>
          </div>
        </div>
      </div>

      <PostList userId={userId} />
    </div>
  )
}