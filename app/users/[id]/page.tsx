import type { Metadata } from "next"
import UserProfile from "@/components/user-profile"

export const metadata: Metadata = {
  title: "User Profile | JSON Placeholder",
  description: "User profile from JSON Placeholder API",
}

export default function UserPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <UserProfile userId={params.id} />
    </div>
  )
}
