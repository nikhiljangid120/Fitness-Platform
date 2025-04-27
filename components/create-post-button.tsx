"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Image, MapPin, Tag, Smile, X, Film, Loader2, Camera, Music, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"

export function CreatePostButton() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [media, setMedia] = useState<{ type: string; url: string; file?: File }[]>([])
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("post")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [mood, setMood] = useState("")
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { currentUser, addPost } = useStore()

  // Emoji data for the simple emoji picker
  const emojis = [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😎",
    "🤔",
    "😊",
    "👍",
    "🎉",
    "❤️",
    "🔥",
    "✨",
    "🌟",
    "💯",
    "🙌",
    "👏",
    "🤩",
    "😇",
    "🥳",
    "😋",
  ]

  // Mood options
  const moodOptions = [
    { emoji: "😊", text: "Happy" },
    { emoji: "😎", text: "Cool" },
    { emoji: "🥳", text: "Celebrating" },
    { emoji: "😔", text: "Sad" },
    { emoji: "😴", text: "Tired" },
    { emoji: "🤔", text: "Thinking" },
    { emoji: "😡", text: "Angry" },
    { emoji: "🥰", text: "In love" },
  ]

  useEffect(() => {
    // Clean up camera stream when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setContent("")
        setMedia([])
        setLocation("")
        setActiveTab("post")
        setTags([])
        setMood("")
        setPreviewMode(false)
        setUploadProgress(0)
        setIsUploading(false)
      }, 300)
    }
  }, [open])

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAddVideo = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click()
    }
  }

  const simulateUpload = (file: File, callback: (url: string) => void) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Create a timeout to simulate the upload completing
    setTimeout(() => {
      clearInterval(interval)
      setIsUploading(false)
      setUploadProgress(100)

      // Create object URL for preview
      const url = URL.createObjectURL(file)
      callback(url)
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newMedia = [...media]

      for (let i = 0; i < e.target.files.length; i++) {
        if (newMedia.length < 4) {
          // Limit to 4 media items
          const file = e.target.files[i]
          const isVideo = file.type.startsWith("video/")

          // Simulate file upload with progress
          simulateUpload(file, (url) => {
            newMedia.push({
              type: isVideo ? "video" : "image",
              url: url,
              file: file,
            })
            setMedia([...newMedia])
          })
        }
      }
    }

    // Reset the input value so the same file can be selected again
    if (e.target) {
      e.target.value = ""
    }
  }

  const removeMedia = (index: number) => {
    const newMedia = [...media]

    // Revoke the object URL to avoid memory leaks
    if (newMedia[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(newMedia[index].url)
    }

    newMedia.splice(index, 1)
    setMedia(newMedia)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })

      setCameraStream(stream)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setIsCapturing(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setIsCapturing(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame to the canvas
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              setMedia([
                ...media,
                {
                  type: "image",
                  url: url,
                  file: new File([blob], "camera-capture.jpg", { type: "image/jpeg" }),
                },
              ])

              // Stop the camera after capturing
              stopCamera()
            }
          },
          "image/jpeg",
          0.95,
        )
      }
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAddEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleSubmit = () => {
    if (!content.trim() && media.length === 0) return
    if (!currentUser) return

    setIsSubmitting(true)

    // Create new post
    const newPost = {
      id: uuidv4(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        verified: currentUser.verified,
        avatar: currentUser.avatar,
      },
      content: content,
      images: media.map((m) => m.url),
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: "Just now",
      location: location || currentUser.location || "Mumbai, India",
      liked: false,
      saved: false,
    }

    // Add post to store
    addPost(newPost)

    // Show success toast
    toast({
      title: "Post created",
      description: "Your post has been published successfully!",
      className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none",
    })

    // Reset form
    setTimeout(() => {
      setIsSubmitting(false)
      setOpen(false)
      setContent("")
      setMedia([])
      setLocation("")
      setActiveTab("post")
      setTags([])
      setMood("")
      setPreviewMode(false)
    }, 1500)
  }

  const renderPreview = () => {
    return (
      <div className="rounded-lg overflow-hidden border border-border">
        <div className="p-4 flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
            <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <span className="font-medium">{currentUser?.name}</span>
              {currentUser?.verified && (
                <span className="ml-1 inline-flex items-center justify-center bg-primary rounded-full p-0.5">
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
                    className="text-white"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              )}
              {mood && <span className="ml-2">{moodOptions.find((m) => m.text === mood)?.emoji}</span>}
            </div>
            <div className="text-xs text-muted-foreground flex items-center">
              <span>Just now</span>
              {location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-3 w-3 mr-0.5" />
                  <span>{location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pb-2">
          <p className="whitespace-pre-wrap">{content}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span key={tag} className="text-primary text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {media.length > 0 && (
          <div
            className={cn(
              "grid gap-1",
              media.length === 1
                ? "grid-cols-1"
                : media.length === 2
                  ? "grid-cols-2"
                  : media.length === 3
                    ? "grid-cols-2"
                    : "grid-cols-2",
            )}
          >
            {media.map((item, index) => (
              <div
                key={index}
                className={cn("relative aspect-square", media.length === 3 && index === 0 ? "col-span-2" : "")}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover" controls />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="p-4 flex items-center justify-between border-t">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span>0</span>
            </button>
            <button className="flex items-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
              <span>0</span>
            </button>
            <button className="flex items-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
              <span>0</span>
            </button>
          </div>
          <button className="text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-full"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Create Post
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-gradient-to-br from-background to-background/95 backdrop-blur-sm">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
            <DialogHeader className="p-4">
              <DialogTitle className="text-xl font-bold text-center gradient-text">Create Post</DialogTitle>
              <DialogDescription className="text-center">Share your moments with the world</DialogDescription>
            </DialogHeader>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 pb-4">
              <TabsList className="grid grid-cols-4 p-1 bg-muted/50 rounded-full">
                <TabsTrigger value="post" className="rounded-full text-xs">
                  Post
                </TabsTrigger>
                <TabsTrigger value="photo" className="rounded-full text-xs">
                  Photo
                </TabsTrigger>
                <TabsTrigger value="video" className="rounded-full text-xs">
                  Video
                </TabsTrigger>
                <TabsTrigger
                  value="camera"
                  className="rounded-full text-xs"
                  onClick={() => {
                    if (activeTab !== "camera") {
                      startCamera()
                    }
                  }}
                >
                  Camera
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {previewMode ? (
                renderPreview()
              ) : (
                <>
                  <TabsContent value="post" className="space-y-4 mt-0">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                        <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="What's on your mind?"
                          className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 shadow-none text-base"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />

                        {isUploading && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Uploading media...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        )}

                        {media.length > 0 && (
                          <div
                            className={cn(
                              "grid gap-2 mt-3",
                              media.length === 1 ? "grid-cols-1" : media.length === 2 ? "grid-cols-2" : "grid-cols-2",
                            )}
                          >
                            {media.map((item, index) => (
                              <div key={index} className="relative rounded-md overflow-hidden aspect-square">
                                {item.type === "image" ? (
                                  <img
                                    src={item.url || "/placeholder.svg"}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <video src={item.url} className="w-full h-full object-cover" controls />
                                )}
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                  onClick={() => removeMedia(index)}
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

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {tags.map((tag) => (
                              <div
                                key={tag}
                                className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs flex items-center"
                              >
                                #{tag}
                                <button className="ml-1 hover:text-primary/80" onClick={() => removeTag(tag)}>
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {mood && (
                          <div className="flex items-center mt-3 text-sm">
                            <span className="mr-1">Feeling:</span>
                            <span className="font-medium flex items-center">
                              {moodOptions.find((m) => m.text === mood)?.emoji} {mood}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="photo" className="space-y-4 mt-0">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                        <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Add a caption to your photo..."
                          className="min-h-[80px] resize-none border-none focus-visible:ring-0 p-0 shadow-none text-base"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />

                        {isUploading && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Uploading photo...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        )}

                        {media.length > 0 ? (
                          <div
                            className={cn(
                              "grid gap-2 mt-3",
                              media.length === 1 ? "grid-cols-1" : media.length === 2 ? "grid-cols-2" : "grid-cols-2",
                            )}
                          >
                            {media.map((item, index) => (
                              <div key={index} className="relative rounded-md overflow-hidden aspect-square">
                                <img
                                  src={item.url || "/placeholder.svg"}
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                  onClick={() => removeMedia(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div
                            className="mt-3 flex flex-col items-center justify-center h-40 bg-muted/50 rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/70 transition-colors"
                            onClick={handleAddImage}
                          >
                            <Image className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload photos</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="space-y-4 mt-0">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                        <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Add a caption to your video..."
                          className="min-h-[80px] resize-none border-none focus-visible:ring-0 p-0 shadow-none text-base"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />

                        {isUploading && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Uploading video...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                          </div>
                        )}

                        {media.length > 0 && media[0].type === "video" ? (
                          <div className="mt-3 relative rounded-md overflow-hidden aspect-video">
                            <video src={media[0].url} className="w-full h-full object-cover" controls />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full"
                              onClick={() => removeMedia(0)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="mt-3 flex flex-col items-center justify-center h-40 bg-muted/50 rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/70 transition-colors"
                            onClick={handleAddVideo}
                          >
                            <Film className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload a video</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="camera" className="space-y-4 mt-0">
                    <div className="relative aspect-square w-full rounded-md overflow-hidden bg-black">
                      {isCapturing ? (
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      ) : media.length > 0 ? (
                        <img
                          src={media[media.length - 1].url || "/placeholder.svg"}
                          alt="Captured photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">Camera will appear here</p>
                        </div>
                      )}

                      {isCapturing && (
                        <Button
                          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full h-14 w-14 bg-white hover:bg-white/90"
                          onClick={capturePhoto}
                        >
                          <div className="h-10 w-10 rounded-full border-2 border-gray-800"></div>
                        </Button>
                      )}

                      {!isCapturing && media.length > 0 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          <Button
                            variant="outline"
                            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-white/30"
                            onClick={startCamera}
                          >
                            Take Another
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Hidden canvas for capturing photos */}
                    <canvas ref={canvasRef} className="hidden" />

                    {!isCapturing && (
                      <Textarea
                        placeholder="Add a caption to your photo..."
                        className="min-h-[80px] resize-none border rounded-md p-2 shadow-none text-base"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    )}
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>

          <div className="border-t p-4">
            {!previewMode ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-2 rounded-full flex items-center gap-1 hover:bg-muted/80"
                      onClick={handleAddImage}
                      disabled={isUploading}
                    >
                      <Image className="h-4 w-4" />
                      <span className="hidden sm:inline">Photo</span>
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
                      className="h-9 px-2 rounded-full flex items-center gap-1 hover:bg-muted/80"
                      onClick={handleAddVideo}
                      disabled={isUploading}
                    >
                      <Film className="h-4 w-4" />
                      <span className="hidden sm:inline">Video</span>
                    </Button>
                    <input
                      type="file"
                      ref={videoInputRef}
                      className="hidden"
                      accept="video/*"
                      onChange={handleFileChange}
                    />

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-2 rounded-full flex items-center gap-1 hover:bg-muted/80"
                          disabled={isUploading}
                        >
                          <MapPin className="h-4 w-4" />
                          <span className="hidden sm:inline">Location</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-4">
                          <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                            Add Location
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="location"
                              placeholder="Where are you?"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="flex-1"
                            />
                            {location ? (
                              <Button variant="ghost" size="icon" onClick={() => setLocation("")}>
                                <X className="h-4 w-4" />
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-2 rounded-full flex items-center gap-1 hover:bg-muted/80"
                          disabled={isUploading}
                        >
                          <Tag className="h-4 w-4" />
                          <span className="hidden sm:inline">Tags</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-4">
                          <Label htmlFor="tags" className="text-sm font-medium mb-2 block">
                            Add Tags
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="tags"
                              placeholder="Add a tag"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  handleAddTag()
                                }
                              }}
                              className="flex-1"
                            />
                            <Button onClick={handleAddTag}>Add</Button>
                          </div>

                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {tags.map((tag) => (
                                <div
                                  key={tag}
                                  className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs flex items-center"
                                >
                                  #{tag}
                                  <button className="ml-1 hover:text-primary/80" onClick={() => removeTag(tag)}>
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-2 rounded-full flex items-center gap-1 hover:bg-muted/80"
                          disabled={isUploading}
                        >
                          <Music className="h-4 w-4" />
                          <span className="hidden sm:inline">Mood</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-4">
                          <Label className="text-sm font-medium mb-2 block">How are you feeling?</Label>
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {moodOptions.map((option) => (
                              <Button
                                key={option.text}
                                variant={mood === option.text ? "default" : "outline"}
                                className="h-auto py-2 px-3 flex flex-col items-center"
                                onClick={() => setMood(option.text)}
                              >
                                <span className="text-xl">{option.emoji}</span>
                                <span className="text-xs mt-1">{option.text}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 rounded-full hover:bg-muted/80"
                          disabled={isUploading}
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-0" align="end">
                        <div className="p-2">
                          <div className="grid grid-cols-5 gap-2">
                            {emojis.map((emoji) => (
                              <Button
                                key={emoji}
                                variant="ghost"
                                className="h-10 w-10 p-0 text-lg"
                                onClick={() => handleAddEmoji(emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setPreviewMode(true)}
                    disabled={(!content.trim() && media.length === 0) || isSubmitting || isUploading}
                  >
                    Preview
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting || isUploading}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white"
                      onClick={handleSubmit}
                      disabled={(!content.trim() && media.length === 0) || isSubmitting || isUploading}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        "Post"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </>
            ) : (
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  Edit
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white"
                    onClick={handleSubmit}
                    disabled={(!content.trim() && media.length === 0) || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

