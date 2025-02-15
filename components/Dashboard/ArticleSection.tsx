"use client"

import { useState, useEffect } from "react"
import type { Profile, Article } from "@/types"
import CreateArticleModal from "@/components/Article/CreateArticleModal"
import ArticleGrid from "@/components/Article/ArticleGrid"
import Pagination from "@/components/Article/Pagination"
import ArticleSidebar from "@/components/Article/ArticleSidebar"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface ArticleSectionProps {
  user: Profile & { id: string }
}

const categories = ["All", "Technology", "Mental Health", "Nutrition", "Research", "Fitness"]

export default function ArticleSection({ user }: ArticleSectionProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesPerPage] = useState(6)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory]) // Removed currentPage dependency

  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/articles?page=${currentPage}&limit=${articlesPerPage}&category=${selectedCategory === "All" ? "" : selectedCategory}`,
      )
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles)
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleArticleCreated = (newArticle: Article) => {
    setArticles((prevArticles) => [newArticle, ...prevArticles])
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <PlusCircle size={20} />
          Create Article
        </Button>
      </div>
      <CreateArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onArticleCreated={handleArticleCreated}
        user={user}
      />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-8">
          <ArticleSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
          />
        </div>
        <div className="w-full md:w-3/4">
          {isLoading ? (
            <div className="text-center">Loading articles...</div>
          ) : (
            <>
              <ArticleGrid articles={articles} user={user} />
              <Pagination
                articlesPerPage={articlesPerPage}
                totalArticles={articles.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

