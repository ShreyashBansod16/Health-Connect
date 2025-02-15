"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle } from "lucide-react"

export default function ArticleSidebar({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  onCreateArticle,
}: {
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  onCreateArticle: () => void
}) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={onCreateArticle}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <PlusCircle size={20} className="mr-2" />
          Create Article
        </Button>
        <ScrollArea className="w-full">
          <div className="flex flex-nowrap gap-2 pb-2 overflow-x-auto">
            {categories.map((category) => (
              <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

