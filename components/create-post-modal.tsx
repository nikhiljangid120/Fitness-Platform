"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Image, MapPin, Tag, Smile, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function CreatePostModal() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, you would upload the file to a server
    // For this demo, we'll just use placeholder images
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [...images]
      for (let i = 0; i < e.target.files.length; i++) {
        if (newImages.length < 4) {
          // Limit to 4 images
          newImages.push(`/placeholder.svg?height=300&width=300&text=Image ${newImages.length + 1}`)
        }
      }
      setImages(newImages)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setOpen(false)
      setContent("")
      setImages([])
      setLocation("")

      // In a real app, you would add the new post to your state or refetch posts
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-bg hover-scale">Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Share your thoughts, photos, and more with your followers.</DialogDescription>
        </DialogHeader>

        <div className="flex items-start space-x-3 py-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user" />
            <AvatarFallback>RM</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 shadow-none text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {images.length > 0 && (
              <div
                className={cn(
                  "grid gap-2 mt-3",
                  images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2",
                )}
              >
                {images.map((img, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden aspect-square">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {location && (
              <div className="flex items-center mt-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-9 px-2 rounded-full" onClick={handleAddImage}>
              <Image className="h-4 w-4 mr-1" />
              <span>Photo</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-2 rounded-full"
              onClick={() => setLocation(location ? "" : "Mumbai, India")}
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span>Location</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-2 rounded-full">
              <Tag className="h-4 w-4 mr-1" />
              <span>Tag</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-full">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="gradient-bg"
            onClick={handleSubmit}
            disabled={(!content.trim() && images.length === 0) || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

