"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, MessageSquare, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Post {
  id: number
  userId: number
  title: string
  body: string
}

interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

interface UserType {
  id: number
  name: string
}

async function fetchPost(postId: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
  if (!res.ok) throw new Error("Failed to fetch post")
  return res.json() as Promise<Post>
}

async function fetchComments(postId: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
  if (!res.ok) throw new Error("Failed to fetch comments")
  return res.json() as Promise<Comment[]>
}

async function fetchUser(userId: number) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json() as Promise<UserType>
}

export default function PostDetail({ postId }: { postId: string }) {
  const {
    data: post,
    error: postError,
    isLoading: postLoading,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
  })

  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  })

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user", post?.userId],
    queryFn: () => fetchUser(post?.userId || 0),
    enabled: !!post?.userId,
  })

  const isLoading = postLoading || commentsLoading || userLoading
  const hasError = postError || commentsError || userError

  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to fetch post data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ) : (
            <>
              <CardTitle className="text-2xl">{post?.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Link href={`/users/${post?.userId}`} className="text-sm text-primary hover:underline">
                  {user?.name}
                </Link>
              </div>
            </>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="whitespace-pre-line">{post?.body}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
          <CardDescription>
            {isLoading ? <Skeleton className="h-4 w-32" /> : `${comments?.length || 0} comments on this post`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {commentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          ) : comments?.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-lg font-medium">No comments yet</p>
              <p className="text-sm text-muted-foreground">Be the first to comment on this post</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments?.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{comment.name}</p>
                      <p className="text-sm text-muted-foreground">{comment.email}</p>
                    </div>
                  </div>
                  <p className="pl-10 text-sm">{comment.body}</p>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
