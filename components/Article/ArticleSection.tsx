"use client"

import { useState, useEffect } from "react"
import type { Profile, Article } from "@/types"
import CreateArticleModal from "@/components/Article/CreateArticleModal"
import ArticleGrid from "@/components/Article/ArticleGrid"
import Pagination from "@/components/Article/Pagination"
import ArticleSidebar from "@/components/Article/ArticleSidebar"

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
  const [totalArticles, setTotalArticles] = useState(0)

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory, currentPage, searchTerm]) //This line was already correct.  The problem was described in the updates, but no change was needed.

  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/articles?search=${searchTerm}&page=${currentPage}&limit=${articlesPerPage}${
          selectedCategory !== "All" ? `&category=${selectedCategory}` : ""
        }`,
      )
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles)
        setTotalArticles(data.total)
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
    <div className="container mx-auto px-4 py-2">
      <div className="space-y-8 ">
        <ArticleSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
          onCreateArticle={() => setIsModalOpen(true)}
        />
        <div className="w-full">
          {isLoading ? (
            <div className="text-center">Loading articles...</div>
          ) : (
            <>
              <ArticleGrid articles={articles} user={user} />
              <div className="mt-8">
                <Pagination
                  articlesPerPage={articlesPerPage}
                  totalArticles={totalArticles}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <CreateArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onArticleCreated={handleArticleCreated}
        user={user}
      />
    </div>
  )
}

