"use client";

import axios from 'axios'
import AnalyticsChartComponent from '../components/AnalyticsChart'

import { useEffect, useState } from 'react';

export function AnalyticsChart() {
  const [data, setData] = useState<{ users: number; posts: number; comments: number } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [users, posts, comments] = await Promise.all([
        axios.get<{ id: number; name: string; }[]>('https://jsonplaceholder.typicode.com/users'),
        axios.get<{ id: number; title: string; body: string; }[]>('https://jsonplaceholder.typicode.com/posts'),
        axios.get<{ id: number; postId: number; body: string; }[]>('https://jsonplaceholder.typicode.com/comments')
      ]);
      setData({
        users: users.data.length,
        posts: posts.data.length,
        comments: comments.data.length,
      });
    }
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Data Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800">Users</h2>
          <p className="text-3xl font-bold text-blue-600">{data.users}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">Posts</h2>
          <p className="text-3xl font-bold text-green-600">{data.posts}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h2 className="text-xl font-semibold text-yellow-800">Comments</h2>
          <p className="text-3xl font-bold text-yellow-600">{data.comments}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Data Overview</h2>
        <AnalyticsChartComponent 
          usersCount={data.users}
          postsCount={data.posts}
          commentsCount={data.comments}
        />
      </div>
    </div>
  )
}