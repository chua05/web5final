import type { Metadata } from "next"
import PostDetail from "@/components/post-detail"

export const metadata: Metadata = {
  title: "Post Detail | JSON Placeholder",
  description: "Post detail from JSON Placeholder API",
}

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <PostDetail postId={params.id} />
    </div>
  )
}
