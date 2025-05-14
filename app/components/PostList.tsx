'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

export default function PostList({ userId }: { userId: string }) {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['posts', userId],
    queryFn: async () => {
      const response = await axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      return response.data
    },
  })

  if (isLoading) return <div className="text-center py-8">Loading posts...</div>
  
  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load posts'
    return <div className="text-center py-8 text-red-500">Error: {errorMessage}</div>
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="text-center py-8 text-gray-500">No posts found</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border-b pb-4 last:border-b-0">
            <Link 
              href={`/posts/${post.id}`}
              className="text-lg font-medium text-primary hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-gray-600 mt-1 line-clamp-2">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}