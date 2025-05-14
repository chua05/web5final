import type { Metadata } from "next"
import UserList from "@/components/user-list"

export const metadata: Metadata = {
  title: "Users | JSON Placeholder",
  description: "List of users from JSON Placeholder API",
}

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Users</h1>
      <UserList />
    </div>
  )
}
