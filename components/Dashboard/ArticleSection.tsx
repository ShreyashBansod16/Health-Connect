"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const articles = [
  {
    id: 1,
    title: "The Benefits of a Mediterranean Diet",
    excerpt: "Discover how the Mediterranean diet can improve your heart health and overall well-being.",
    content:
      "The Mediterranean diet emphasizes plant-based foods, healthy fats, and moderate consumption of lean proteins. Studies have shown that following this diet can reduce the risk of heart disease, stroke, and certain cancers. It's also associated with improved cognitive function and longevity.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    author: "Dr. Maria Gonzalez",
    date: "2023-05-15",
  },
  {
    id: 2,
    title: "Understanding the Keto Diet",
    excerpt: "Learn about the science behind the ketogenic diet and its potential benefits for weight loss.",
    content:
      "The ketogenic diet is a high-fat, low-carbohydrate diet that forces the body to burn fats rather than carbohydrates. This metabolic state, known as ketosis, can lead to rapid weight loss and improved insulin sensitivity. However, it's important to consult with a healthcare professional before starting any new diet.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    author: "Dr. James Smith",
    date: "2023-06-02",
  },
  {
    id: 3,
    title: "The Importance of Mental Health",
    excerpt: "Explore the connection between mental and physical health, and tips for maintaining a healthy mind.",
    content:
      "Mental health is just as important as physical health. Chronic stress, anxiety, and depression can have significant impacts on our overall well-being. Practicing mindfulness, regular exercise, and maintaining social connections are all effective ways to support mental health.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    author: "Dr. Emily Chen",
    date: "2023-06-20",
  },
  {
    id: 4,
    title: "Exercise and Longevity",
    excerpt: "Discover how regular exercise can increase your lifespan and improve your quality of life.",
    content:
      "Regular physical activity has been shown to increase life expectancy and reduce the risk of chronic diseases. Even moderate exercise, such as brisk walking for 30 minutes a day, can have significant health benefits. Exercise improves cardiovascular health, strengthens bones and muscles, and boosts mental well-being.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    author: "Dr. Michael Johnson",
    date: "2023-07-05",
  },
]

export default function ArticleSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextArticle = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length)
  }, [])

  const prevArticle = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextArticle, 5000) // Auto-advance every 5 seconds
    return () => clearInterval(timer)
  }, [nextArticle])

 
  return (
    <Card className="h-[calc(100vh-24rem)] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">Latest Health Articles</CardTitle>
        <Link href="/articles/new">
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Article
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="relative h-[calc(100%-5rem)] p-6">
        <div className="relative h-full">
          <AnimatePresence initial={false} custom={currentIndex}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <div className="flex gap-6 h-full">
                {/* Left side - Image */}
                <div className="w-1/2">
                  <div className="relative h-full rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={articles[currentIndex].imageUrl}
                      alt={articles[currentIndex].title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="w-1/2 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">
                      {articles[currentIndex].title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      By {articles[currentIndex].author} | {articles[currentIndex].date}
                    </p>
                    <p className="text-muted-foreground">
                      {articles[currentIndex].excerpt}
                    </p>
                    <p className="text-muted-foreground line-clamp-3">
                      {articles[currentIndex].content}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <Link href={`/articles/${articles[currentIndex].id}`}>
                      <Button variant="default">
                        Read More
                      </Button>
                    </Link>

                    {/* Navigation dots */}
                    <div className="flex gap-1">
                      {articles.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentIndex ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Side navigation buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={prevArticle}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={nextArticle}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}