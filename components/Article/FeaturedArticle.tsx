import Image from "next/image"
import type { Article } from "@/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Card className="mt-8">
      <CardHeader className="p-0">
        <div className="relative w-full h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg overflow-hidden">
          {article.image ? (
            <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-semibold">
              {article.title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Badge className="mb-2">{article.category}</Badge>
        <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
        <p className="text-gray-600 mb-4">{article.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/articles/${article.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

