import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"

export const metadata: Metadata = {
  title: "Dashboard | JSON Placeholder",
  description: "Data visualization dashboard for JSON Placeholder API",
}

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <Dashboard />
    </div>
  )
}
