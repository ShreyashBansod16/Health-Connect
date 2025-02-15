"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, MessageCircle, Eye, Send } from "lucide-react";
import type { Article, Comment, Profile } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ArticleGridProps {
  articles?: Article[];
  user: Profile & { id: string };
}

export default function ArticleGrid({ articles: initialArticles, user }: ArticleGridProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "comments">("content");

  const handleLike = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: user.userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process like");
      }

      const data = await response.json();

      if (data.success) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === articleId
              ? {
                  ...article,
                  likes: data.data,
                }
              : article
          )
        );
      }
    } catch (error) {
      console.error("Failed to like article:", error);
    }
  };

  const fetchComments = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/comment`);
      const data = await response.json();
      if (data.success) {
        setComments((prev) => ({ ...prev, [articleId]: data.data }));
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleCommentSubmit = async (articleId: string) => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/articles/${articleId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: newComment.trim(),
          userId: user.userId,
          type: "comment",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComments((prev) => ({
          ...prev,
          [articleId]: [...(prev[articleId] || []), data.data],
        }));
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    fetchComments(article.id);
    setActiveTab("content");
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {articles.map((article) => (
          <motion.div key={article.id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="h-full flex flex-col overflow-hidden group bg-gray-50 dark:bg-gray-800">
              <CardHeader className="p-0">
                <div className="relative w-full h-48 bg-gradient-to-br from-violet-500 to-purple-500 group-hover:from-violet-600 group-hover:to-purple-600 transition-colors">
                  {article.image ? (
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {article.title.charAt(0)}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <Badge variant="secondary" className="mb-2">
                  {article.category}
                </Badge>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4">{article.excerpt}</p>
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-purple-600 hover:text-purple-700"
                  onClick={() => handleArticleSelect(article)}
                >
                  Read More
                </Button>
              </CardContent>
              <CardFooter className="p-4 bg-gray-50 border-t">
                <div className="flex justify-between w-full text-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(article.id)}
                    className={`hover:text-rose-500 transition-colors ${
                      article.likes?.some((like) => like.userId === user.userId)
                        ? "text-rose-500 bg-rose-50"
                        : ""
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 mr-1 transition-all ${
                        article.likes?.some((like) => like.userId === user.userId)
                          ? "fill-current scale-110"
                          : "scale-100"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {article.likes?.length ?? 0}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleArticleSelect(article);
                      setActiveTab("comments");
                    }}
                    className="hover:text-blue-500"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" /> {article.comments?.length ?? 0}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-green-500">
                    <Eye className="w-4 h-4 mr-1" /> {article.views ?? 0}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedArticle?.title}</DialogTitle>
            <DialogDescription asChild>
              <div>
                <Badge variant="secondary">{selectedArticle?.category}</Badge>
              </div>
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "content" | "comments")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Article</TabsTrigger>
              <TabsTrigger value="comments">Comments ({comments[selectedArticle?.id ?? ""]?.length ?? 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4">
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                {selectedArticle?.image && (
                  <div className="relative w-full h-64 mb-6">
                    <Image
                      src={selectedArticle.image || "/placeholder.svg"}
                      alt={selectedArticle.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="prose prose-purple max-w-none">
                  <p className="text-lg text-gray-600 mb-4">{selectedArticle?.excerpt}</p>
                  <div className="mt-4">{selectedArticle?.content}</div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-4">
                  {comments[selectedArticle?.id ?? ""]?.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatarUrl || undefined} />
                        <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.user.username}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {(!comments[selectedArticle?.id ?? ""] || comments[selectedArticle?.id ?? ""].length === 0) && (
                    <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && selectedArticle) {
                      e.preventDefault();
                      handleCommentSubmit(selectedArticle.id);
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={() => selectedArticle && handleCommentSubmit(selectedArticle.id)}
                  disabled={isSubmitting || !newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}