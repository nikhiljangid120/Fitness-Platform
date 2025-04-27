"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  MapPin,
  HeartIcon as HeartFilled,
  BookmarkIcon as BookmarkFilled,
  Copy,
  Facebook,
  Twitter,
  Mail,
  PhoneIcon as WhatsApp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useStore } from "@/lib/store"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/use-toast"

interface Comment {
  id: string
  user: {
    id: string
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  content: string
  timestamp: string
  likes: number
  liked: boolean
  replies?: Comment[]
}

interface PostCardProps {
  post: {
    id: string
    user: {
      id: string
      name: string
      username: string
      verified: boolean
      avatar: string
    }
    content: string
    images: string[]
    likes: number
    comments: number
    shares: number
    timestamp: string
    location?: string
    liked?: boolean
    saved?: boolean
  }
}

export function PostCard({ post }: PostCardProps) {
  const { currentUser, likePost, savePost } = useStore()
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [commentsData, setCommentsData] = useState<Comment[]>([
    {
      id: "c1",
      user: {
        id: "user3",
        name: "Priya Sharma",
        username: "priyastyles",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        verified: true,
      },
      content: "This is amazing! Love the colors in this 😍",
      timestamp: "2h ago",
      likes: 24,
      liked: false,
      replies: [
        {
          id: "r1",
          user: {
            id: post.user.id,
            name: post.user.name,
            username: post.user.username,
            avatar: post.user.avatar,
            verified: post.user.verified,
          },
          content: "Thank you so much! I'm glad you like it 🙏",
          timestamp: "1h ago",
          likes: 5,
          liked: false,
        },
      ],
    },
    {
      id: "c2",
      user: {
        id: "user4",
        name: "Aryan Gupta",
        username: "aryanfit",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        verified: false,
      },
      content: "Where was this taken? Looks incredible!",
      timestamp: "3h ago",
      likes: 8,
      liked: false,
    },
  ])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const commentInputRef = useRef<HTMLInputElement>(null)

  const handleLike = () => {
    if (!currentUser) return
    likePost(post.id)
  }

  const handleSave = () => {
    if (!currentUser) return
    savePost(post.id)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !currentUser) return

    // Add new comment
    const newComment: Comment = {
      id: uuidv4(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        verified: currentUser.verified,
      },
      content: comment,
      timestamp: "Just now",
      likes: 0,
      liked: false,
    }

    setCommentsData([...commentsData, newComment])
    setComment("")
    setShowComments(true)
  }

  const handleCommentLike = (commentId: string) => {
    setCommentsData(
      commentsData.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            liked: !comment.liked,
          }
        } else if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                  liked: !reply.liked,
                }
              }
              return reply
            }),
          }
        }
        return comment
      }),
    )
  }

  const handleReplySubmit = (commentId: string) => {
    if (!replyContent.trim() || !currentUser) return

    // Add reply to comment
    setCommentsData(
      commentsData.map((comment) => {
        if (comment.id === commentId) {
          const newReply: Comment = {
            id: uuidv4(),
            user: {
              id: currentUser.id,
              name: currentUser.name,
              username: currentUser.username,
              avatar: currentUser.avatar,
              verified: currentUser.verified,
            },
            content: replyContent,
            timestamp: "Just now",
            likes: 0,
            liked: false,
          }

          return {
            ...comment,
            replies: comment.replies ? [...comment.replies, newReply] : [newReply],
          }
        }
        return comment
      }),
    )

    setReplyingTo(null)
    setReplyContent("")
  }

  const handleShare = (platform: string) => {
    // In a real app, you would implement sharing to different platforms
    toast({
      title: "Shared successfully",
      description: `Post shared to ${platform}`,
    })
    setShareOpen(false)
  }

  const copyLink = () => {
    // In a real app, you would copy the post URL to clipboard
    toast({
      title: "Link copied",
      description: "Post link copied to clipboard",
    })
    setShareOpen(false)
  }

  return (
    <Card className="border-none neomorphic overflow-hidden card-hover post-animation elegant-card">
      <CardHeader className="p-4 flex flex-row items-center space-y-0 gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold">{post.user.name}</span>
            {post.user.verified && (
              <Badge variant="default" className="h-4 px-1 py-0 bg-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>@{post.user.username}</span>
            <span className="mx-1">•</span>
            <span>{post.timestamp}</span>
            {post.location && (
              <>
                <span className="mx-1">•</span>
                <MapPin className="h-3 w-3 mr-0.5" />
                <span>{post.location}</span>
              </>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report post</DropdownMenuItem>
            <DropdownMenuItem>Unfollow @{post.user.username}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShareOpen(true)}>Share via...</DropdownMenuItem>
            <DropdownMenuItem onClick={copyLink}>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-0">
        {post.content && (
          <div className="px-4 py-2">
            <p>{post.content}</p>
          </div>
        )}

        {post.images.length > 0 && (
          <div className="mt-2">
            {post.images.length === 1 ? (
              <div className="relative aspect-[4/3] w-full">
                <img
                  src={post.images[0] || "/placeholder.svg"}
                  alt="Post content"
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {post.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3] w-full">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Post content ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            )}
          </div>
        )}

        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2 hover:text-foreground transition-colors",
                post.liked ? "text-red-500" : "text-muted-foreground",
              )}
              onClick={handleLike}
            >
              {post.liked ? <HeartFilled className="h-5 w-5 mr-1" /> : <Heart className="h-5 w-5 mr-1" />}
              <span>{post.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5 mr-1" />
              <span>{commentsData.length}</span>
            </Button>
            <Popover open={shareOpen} onOpenChange={setShareOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Share className="h-5 w-5 mr-1" />
                  <span>{post.shares}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-2">Share to</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => handleShare("Facebook")}
                    >
                      <Facebook className="h-5 w-5 text-blue-600" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => handleShare("Twitter")}
                    >
                      <Twitter className="h-5 w-5 text-sky-500" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => handleShare("WhatsApp")}
                    >
                      <WhatsApp className="h-5 w-5 text-green-500" />
                      <span className="sr-only">WhatsApp</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => handleShare("Email")}
                    >
                      <Mail className="h-5 w-5 text-red-500" />
                      <span className="sr-only">Email</span>
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="p-1">
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" onClick={copyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy link
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-9"
                    onClick={() => handleShare("Direct Message")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send in Direct Message
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 transition-colors",
              post.saved ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
            onClick={handleSave}
          >
            {post.saved ? <BookmarkFilled className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            <span className="sr-only">Save post</span>
          </Button>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="p-4 flex flex-col">
        <form onSubmit={handleCommentSubmit} className="relative w-full mb-4">
          <input
            ref={commentInputRef}
            type="text"
            placeholder="Add a comment..."
            className="w-full py-2 px-4 bg-muted/50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 text-primary"
            disabled={!comment.trim()}
          >
            Post
          </Button>
        </form>

        {showComments && commentsData.length > 0 && (
          <div className="space-y-4 w-full">
            {commentsData.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm">{comment.user.name}</span>
                        {comment.user.verified && (
                          <Badge variant="default" className="h-3 px-1 py-0 bg-primary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="8"
                              height="8"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-check"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center mt-1 space-x-4 text-xs text-muted-foreground">
                      <span>{comment.timestamp}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1 text-xs"
                        onClick={() => handleCommentLike(comment.id)}
                      >
                        {comment.liked ? <span className="text-red-500">Liked</span> : <span>Like</span>}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1 text-xs"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        Reply
                      </Button>
                      <span>{comment.likes} likes</span>
                    </div>

                    {replyingTo === comment.id && (
                      <div className="mt-2 flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                            alt="Your avatar"
                          />
                          <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder={`Reply to ${comment.user.name}...`}
                            className="w-full py-1.5 px-3 bg-muted/50 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleReplySubmit(comment.id)
                              }
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 text-primary text-xs"
                            onClick={() => handleReplySubmit(comment.id)}
                            disabled={!replyContent.trim()}
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="comment-thread">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-2 mt-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                              <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-muted/50 rounded-lg p-2">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-sm">{reply.user.name}</span>
                                  {reply.user.verified && (
                                    <Badge variant="default" className="h-3 px-1 py-0 bg-primary">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="8"
                                        height="8"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-check"
                                      >
                                        <path d="M20 6 9 17l-5-5" />
                                      </svg>
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                              <div className="flex items-center mt-1 space-x-4 text-xs text-muted-foreground">
                                <span>{reply.timestamp}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 px-1 text-xs"
                                  onClick={() => handleCommentLike(reply.id)}
                                >
                                  {reply.liked ? <span className="text-red-500">Liked</span> : <span>Like</span>}
                                </Button>
                                <span>{reply.likes} likes</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

