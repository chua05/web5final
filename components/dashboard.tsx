'use client';

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

// Fetch data from JSONPlaceholder API
async function fetchUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}

async function fetchPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  if (!res.ok) throw new Error("Failed to fetch posts")
  return res.json()
}

async function fetchComments() {
  const res = await fetch("https://jsonplaceholder.typicode.com/comments")
  if (!res.ok) throw new Error("Failed to fetch comments")
  return res.json()
}

export default function Dashboard() {
  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  const {
    data: posts,
    error: postsError,
    isLoading: postsLoading,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  })

  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  })

  const isLoading = usersLoading || postsLoading || commentsLoading
  const hasError = usersError || postsError || commentsError

  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to fetch data from JSONPlaceholder API. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  // Prepare data for charts
  const chartData = {
    series: [
      {
        name: "Count",
        data: [users?.length || 0, posts?.length || 0, comments?.length || 0],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["Users", "Posts", "Comments"],
      },
      colors: ["#7c3aed"], // Updated to purple
      theme: {
        mode: "light",
      },
    },
  }

  // Prepare data for pie chart
  const pieChartData = {
    series: [users?.length || 0, posts?.length || 0, comments?.length || 0],
    options: {
      chart: {
        type: "pie",
        height: 350,
      },
      labels: ["Users", "Posts", "Comments"],
      colors: ["#7c3aed", "#a78bfa", "#c4b5fd"], // Updated to purple shades
      legend: {
        position: "bottom",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Number of users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-bold">{users?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Posts</CardTitle>
            <CardDescription>Number of posts created</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-bold">{posts?.length || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Comments</CardTitle>
            <CardDescription>Number of comments made</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-3xl font-bold">{comments?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Distribution</CardTitle>
            <CardDescription>Comparison of users, posts, and comments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[350px] flex items-center justify-center">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <div className="h-[350px]">
                {typeof window !== "undefined" && (
                  <ApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Data Distribution (Pie Chart)</CardTitle>
            <CardDescription>Relative proportions of data types</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[350px] flex items-center justify-center">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <div className="h-[350px]">
                {typeof window !== "undefined" && (
                  <ApexChart options={pieChartData.options} series={pieChartData.series} type="pie" height={350} />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
