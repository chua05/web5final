'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Post = {
  userId: number
  id: number
  title: string
  body: string
}

type Comment = {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export default function PostDetail() {
  const params = useParams()
  const postId = params.id as string

  const { data: post, isLoading: postLoading, error: postError } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: () => axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.data) as Promise<Post>,
  })

  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => (await axios.get<Comment[]>(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)).data,
  })

  if (postLoading) return <div className="text-center py-8">Loading post...</div>
  if (postError) return <div className="text-center py-8 text-red-500">Error loading post</div>

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Link href="/" className="text-primary hover:underline mb-4 inline-block">
        &larr; Back to users
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{post?.title || 'Untitled Post'}</h2>
        <p className="text-gray-700">{post?.body || 'No content available.'}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        
        {commentsLoading && <div className="text-center py-4">Loading comments...</div>}
        {commentsError && <div className="text-center py-4 text-red-500">Error loading comments</div>}
        
        {comments && (
          <div className="space-y-4">
            {comments.map((comment: Comment) => (
              <div key={comment.id} className="border-l-4 border-primary pl-4 py-2">
                <h4 className="font-medium">{comment.name}</h4>
                <p className="text-sm text-gray-500">{comment.email}</p>
                <p className="text-gray-700 mt-1">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}