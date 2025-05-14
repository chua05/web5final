"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Mail, MapPin, Phone, Globe, Building } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import StaticMap from "./static-map"

interface User {
  id: number
  name: string
  username: string
  email: string
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
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

interface Post {
  id: number
  userId: number
  title: string
  body: string
}

async function fetchUser(userId: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json() as Promise<User>
}

async function fetchUserPosts(userId: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
  if (!res.ok) throw new Error("Failed to fetch user posts")
  return res.json() as Promise<Post[]>
}

export default function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  })

  const {
    data: posts,
    error: postsError,
    isLoading: postsLoading,
  } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId,
  })

  const isLoading = userLoading || postsLoading
  const hasError = userError || postsError

  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to fetch user data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold">{user?.name}</h1>
          <p className="text-muted-foreground">@{user?.username}</p>
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>User contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`https://${user?.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user?.website}
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Company</CardTitle>
                <CardDescription>User company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{user?.company.name}</span>
                    </div>
                    <div className="pl-6">
                      <p className="text-sm italic">"{user?.company.catchPhrase}"</p>
                      <p className="text-sm text-muted-foreground">{user?.company.bs}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>User location and address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p>
                        {user?.address.street}, {user?.address.suite}
                      </p>
                      <p>
                        {user?.address.city}, {user?.address.zipcode}
                      </p>
                    </div>
                  </div>
                  <div className="h-[300px] rounded-md overflow-hidden">
                    {user && (
                      <StaticMap
                        latitude={Number.parseFloat(user.address.geo.lat || "0")}
                        longitude={Number.parseFloat(user.address.geo.lng || "0")}
                        zoom={10}
                        width={600}
                        height={300}
                        title={`${user.name}'s location`}
                      />
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Posts</CardTitle>
              <CardDescription>Posts created by this user</CardDescription>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              ) : posts?.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <p className="text-lg font-medium">No posts found</p>
                  <p className="text-sm text-muted-foreground">This user hasn't created any posts yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts?.map((post) => (
                    <div key={post.id} className="space-y-2">
                      <Link href={`/posts/${post.id}`} className="block">
                        <h3 className="text-lg font-medium hover:text-primary hover:underline">{post.title}</h3>
                        <p className="text-muted-foreground line-clamp-2">{post.body}</p>
                      </Link>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
