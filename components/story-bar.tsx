"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { PlusCircle, X, ChevronLeft, ChevronRight, Heart, Send, Camera, ImageIcon, Music, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export function StoryBar() {
  const { currentUser, stories, viewStory, addStory } = useStore()
  const [storyViewerOpen, setStoryViewerOpen] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [currentStory, setCurrentStory] = useState<(typeof stories)[0] | null>(null)
  const [storyReply, setStoryReply] = useState("")
  const [progress, setProgress] = useState(0)
  const [createStoryOpen, setCreateStoryOpen] = useState(false)
  const [newStoryMedia, setNewStoryMedia] = useState<{ type: string; url: string; file?: File }[]>([])
  const [activeTab, setActiveTab] = useState("upload")
  const [isCapturing, setIsCapturing] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [storyCaption, setStoryCaption] = useState("")
  const [storyMusic, setStoryMusic] = useState("")
  const [storyFilter, setStoryFilter] = useState("")
  const [filterIntensity, setFilterIntensity] = useState(50)

  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Available filters
  const filters = [
    { id: "", name: "Normal", class: "" },
    { id: "sepia", name: "Sepia", class: "sepia" },
    { id: "grayscale", name: "B&W", class: "grayscale" },
    { id: "invert", name: "Invert", class: "invert" },
    { id: "hue-rotate", name: "Hue", class: "hue-rotate-90" },
    { id: "saturate", name: "Vibrant", class: "saturate-200" },
    { id: "contrast", name: "Contrast", class: "contrast-125" },
    { id: "brightness", name: "Bright", class: "brightness-125" },
    { id: "blur", name: "Blur", class: "blur-sm" },
  ]

  // Music options
  const musicOptions = [
    { id: "", name: "None" },
    { id: "pop", name: "Pop Vibes" },
    { id: "chill", name: "Chill Lofi" },
    { id: "upbeat", name: "Upbeat" },
    { id: "acoustic", name: "Acoustic" },
    { id: "electronic", name: "Electronic" },
  ]

  const handleStoryClick = (storyId: string) => {
    const storyIndex = stories.findIndex((story) => story.id === storyId)
    if (storyIndex === -1 || storyId === "story1") return

    setCurrentStoryIndex(storyIndex)
    setCurrentMediaIndex(0)
    setCurrentStory(stories[storyIndex])
    setStoryViewerOpen(true)

    // Mark story as seen
    viewStory(storyId)
  }

  const handleCreateStory = () => {
    setCreateStoryOpen(true)
    setActiveTab("upload")
    setNewStoryMedia([])
    setStoryCaption("")
    setStoryMusic("")
    setStoryFilter("")
    setFilterIntensity(50)
  }

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const isVideo = file.type.startsWith("video/")

      // Create object URL for preview
      const url = URL.createObjectURL(file)

      setNewStoryMedia([
        {
          type: isVideo ? "video" : "image",
          url: url,
          file: file,
        },
      ])
    }
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

        // Apply filter effects if needed
        // This would be done with canvas manipulation

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              setNewStoryMedia([
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

  useEffect(() => {
    // Clean up camera stream when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  const handleStorySubmit = () => {
    if (newStoryMedia.length === 0 || !currentUser) return

    // Create new story
    const newStory = {
      id: uuidv4(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
      seen: false,
      media: newStoryMedia.map((m) => ({
        type: m.type as "image" | "video",
        url: m.url,
        filter: storyFilter,
        filterIntensity: filterIntensity,
        music: storyMusic,
      })),
      timestamp: "Just now",
      likes: 0,
      viewCount: 0,
      caption: storyCaption,
    }

    // Add story to store
    addStory(newStory)

    // Close dialog and reset
    setCreateStoryOpen(false)
    setNewStoryMedia([])
    stopCamera()
    setStoryCaption("")
    setStoryMusic("")
    setStoryFilter("")
    setFilterIntensity(50)

    toast({
      title: "Story created",
      description: "Your story has been published successfully!",
      className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none",
    })
  }

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
      setCurrentMediaIndex(0)
      setCurrentStory(stories[currentStoryIndex + 1])
      setProgress(0)
    } else {
      setStoryViewerOpen(false)
    }
  }

  const handlePrevStory = () => {
    if (currentStoryIndex > 1) {
      // Skip "Your Story"
      setCurrentStoryIndex(currentStoryIndex - 1)
      setCurrentMediaIndex(0)
      setCurrentStory(stories[currentStoryIndex - 1])
      setProgress(0)
    }
  }

  const handleNextMedia = () => {
    if (currentStory && currentMediaIndex < currentStory.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1)
      setProgress(0)
    } else {
      handleNextStory()
    }
  }

  const handlePrevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1)
      setProgress(0)
    } else {
      handlePrevStory()
    }
  }

  const handleSendReply = () => {
    if (!storyReply.trim()) return

    // In a real app, you would send this reply to your backend
    toast({
      title: "Reply sent",
      description: `Your reply to ${currentStory?.user.name}'s story has been sent.`,
      className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none",
    })
    setStoryReply("")
  }

  const handleLikeStory = () => {
    if (!currentStory) return

    toast({
      title: "Story liked",
      description: `You liked ${currentStory.user.name}'s story.`,
      className: "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-none",
    })
  }

  useEffect(() => {
    if (storyViewerOpen && currentStory && currentStory.media.length > 0) {
      // Reset progress
      setProgress(0)

      // Clear any existing interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }

      // Set up progress interval - story duration is 5 seconds
      const duration = 5000
      const interval = 50
      const steps = duration / interval
      let currentProgress = 0

      progressInterval.current = setInterval(() => {
        currentProgress += 100 / steps
        setProgress(currentProgress)

        if (currentProgress >= 100) {
          clearInterval(progressInterval.current!)
          handleNextMedia()
        }
      }, interval)

      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current)
        }
      }
    }
  }, [storyViewerOpen, currentStoryIndex, currentMediaIndex, currentStory])

  return (
    <>
      <div className="rounded-xl p-4 glass-effect">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4">
            {stories.map((story) => (
              <Button
                key={story.id}
                variant="ghost"
                className="p-0 h-auto flex flex-col items-center space-y-2"
                onClick={() => (story.id === "story1" ? handleCreateStory() : handleStoryClick(story.id))}
              >
                <div
                  className={cn(
                    story.id === "story1"
                      ? "bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500"
                      : story.seen
                        ? "story-ring-seen"
                        : "story-ring",
                  )}
                >
                  <div className="p-0.5 bg-background rounded-full">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={story.user.avatar} alt={story.user.name} />
                      <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {story.user.name === "Your Story" && (
                      <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-0.5">
                        <PlusCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs truncate max-w-[64px]">
                  {story.user.name === "Your Story" ? "Your Story" : story.user.name.split(" ")[0]}
                </span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Story Viewer */}
      <Dialog open={storyViewerOpen} onOpenChange={setStoryViewerOpen}>
        <DialogContent className="max-w-screen-md w-full p-0 h-[80vh] max-h-[80vh] overflow-hidden bg-transparent border-none shadow-none">
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white bg-black/20 hover:bg-black/40"
              onClick={() => setStoryViewerOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>

            {/* Story navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black/20 hover:bg-black/40"
              onClick={handlePrevStory}
              disabled={currentStoryIndex <= 1} // Skip "Your Story"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous story</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black/20 hover:bg-black/40"
              onClick={handleNextStory}
              disabled={currentStoryIndex >= stories.length - 1}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next story</span>
            </Button>

            {/* Story content */}
            {currentStory && currentStory.media.length > 0 && (
              <div className="relative w-full h-full">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 z-50 p-4 flex space-x-1">
                  {currentStory.media.map((_, index) => (
                    <div key={index} className="story-progress flex-1">
                      <div
                        className="story-progress-bar"
                        style={{
                          width:
                            index < currentMediaIndex ? "100%" : index === currentMediaIndex ? `${progress}%` : "0%",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* User info */}
                <div className="absolute top-4 left-4 z-50 flex items-center">
                  <Avatar className="h-10 w-10 mr-2 border-2 border-white">
                    <AvatarImage src={currentStory.user.avatar} alt={currentStory.user.name} />
                    <AvatarFallback>{currentStory.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <p className="font-medium text-sm">{currentStory.user.name}</p>
                    <p className="text-xs opacity-80">{currentStory.timestamp}</p>
                  </div>
                </div>

                {/* Media */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={(e) => {
                    // Determine click position to navigate between media
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const width = rect.width

                    if (x < width / 3) {
                      handlePrevMedia()
                    } else if (x > (width * 2) / 3) {
                      handleNextMedia()
                    }
                  }}
                >
                  {currentStory.media[currentMediaIndex].type === "image" && (
                    <img
                      src={currentStory.media[currentMediaIndex].url || "/placeholder.svg"}
                      alt={`Story by ${currentStory.user.name}`}
                      className={cn(
                        "w-full h-full object-contain",
                        currentStory.media[currentMediaIndex].filter &&
                          filters.find((f) => f.id === currentStory.media[currentMediaIndex].filter)?.class,
                      )}
                      style={{
                        filter: currentStory.media[currentMediaIndex].filter
                          ? `${currentStory.media[currentMediaIndex].filter}(${currentStory.media[currentMediaIndex].filterIntensity}%)`
                          : undefined,
                      }}
                    />
                  )}
                  {currentStory.media[currentMediaIndex].type === "video" && (
                    <video
                      src={currentStory.media[currentMediaIndex].url}
                      autoPlay
                      muted
                      playsInline
                      className={cn(
                        "w-full h-full object-contain",
                        currentStory.media[currentMediaIndex].filter &&
                          filters.find((f) => f.id === currentStory.media[currentMediaIndex].filter)?.class,
                      )}
                      style={{
                        filter: currentStory.media[currentMediaIndex].filter
                          ? `${currentStory.media[currentMediaIndex].filter}(${currentStory.media[currentMediaIndex].filterIntensity}%)`
                          : undefined,
                      }}
                    />
                  )}

                  {/* Caption */}
                  {currentStory.caption && (
                    <div className="absolute bottom-24 left-0 right-0 text-center px-4">
                      <div className="bg-black/40 backdrop-blur-sm text-white p-3 rounded-lg inline-block max-w-md">
                        {currentStory.caption}
                      </div>
                    </div>
                  )}

                  {/* Music indicator */}
                  {currentStory.media[currentMediaIndex].music && (
                    <div className="absolute top-20 right-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center">
                      <Music className="h-4 w-4 mr-2 animate-pulse" />
                      <span className="text-xs">
                        {musicOptions.find((m) => m.id === currentStory.media[currentMediaIndex].music)?.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Story interactions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-white">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-white hover:bg-white/20 px-2"
                        onClick={handleLikeStory}
                      >
                        <Heart className="h-5 w-5 mr-1" />
                        <span>{currentStory.likes.toLocaleString()}</span>
                      </Button>
                      <div className="text-sm">
                        <span className="opacity-80">{currentStory.viewCount.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder={`Reply to ${currentStory.user.name}...`}
                      className="bg-white/20 border-none text-white placeholder:text-white/70"
                      value={storyReply}
                      onChange={(e) => setStoryReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendReply()
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={handleSendReply}
                      disabled={!storyReply.trim()}
                    >
                      <Send className="h-5 w-5" />
                      <span className="sr-only">Send reply</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Story Dialog */}
      <Dialog
        open={createStoryOpen}
        onOpenChange={(open) => {
          setCreateStoryOpen(open)
          if (!open) {
            stopCamera()
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-gradient-to-br from-background to-background/95 backdrop-blur-sm">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
            <div className="p-4">
              <h2 className="text-xl font-bold text-center gradient-text">Create Story</h2>
              <p className="text-center text-muted-foreground">Share a moment with your followers</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-4 pb-4">
                <TabsList className="grid grid-cols-2 p-1 bg-muted/50 rounded-full">
                  <TabsTrigger value="upload" className="rounded-full text-xs">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload
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
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <TabsContent value="upload" className="space-y-4 mt-0">
                  {/* Upload content */}
                  {newStoryMedia.length > 0 ? (
                    <div className="relative aspect-square w-full rounded-md overflow-hidden">
                      {newStoryMedia[0].type === "image" ? (
                        <img
                          src={newStoryMedia[0].url || "/placeholder.svg"}
                          alt="Story preview"
                          className={cn(
                            "w-full h-full object-cover",
                            storyFilter && filters.find((f) => f.id === storyFilter)?.class,
                          )}
                          style={{
                            filter: storyFilter ? `${storyFilter}(${filterIntensity}%)` : undefined,
                          }}
                        />
                      ) : (
                        <video
                          src={newStoryMedia[0].url}
                          className={cn(
                            "w-full h-full object-cover",
                            storyFilter && filters.find((f) => f.id === storyFilter)?.class,
                          )}
                          style={{
                            filter: storyFilter ? `${storyFilter}(${filterIntensity}%)` : undefined,
                          }}
                          controls
                        />
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => {
                          if (newStoryMedia[0].url.startsWith("blob:")) {
                            URL.revokeObjectURL(newStoryMedia[0].url)
                          }
                          setNewStoryMedia([])
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={handleFileSelect}
                    >
                      <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Click to upload a photo or video</p>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />

                  {newStoryMedia.length > 0 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Add a caption</label>
                        <Input
                          placeholder="Write a caption..."
                          value={storyCaption}
                          onChange={(e) => setStoryCaption(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Add music</label>
                        <div className="grid grid-cols-3 gap-2">
                          {musicOptions.map((option) => (
                            <Button
                              key={option.id}
                              variant={storyMusic === option.id ? "default" : "outline"}
                              className="h-auto py-2"
                              onClick={() => setStoryMusic(option.id)}
                            >
                              {option.id ? <Music className="h-4 w-4 mr-2" /> : null}
                              {option.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Apply filter</label>
                        <div className="grid grid-cols-3 gap-2">
                          {filters.map((filter) => (
                            <Button
                              key={filter.id}
                              variant={storyFilter === filter.id ? "default" : "outline"}
                              className="h-auto py-2"
                              onClick={() => setStoryFilter(filter.id)}
                            >
                              {filter.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {storyFilter && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Filter intensity</label>
                          <Slider
                            value={[filterIntensity]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => setFilterIntensity(value[0])}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="camera" className="space-y-4 mt-0">
                  <div className="relative aspect-square w-full rounded-md overflow-hidden bg-black">
                    {isCapturing ? (
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : newStoryMedia.length > 0 ? (
                      <img
                        src={newStoryMedia[0].url || "/placeholder.svg"}
                        alt="Captured photo"
                        className={cn(
                          "w-full h-full object-cover",
                          storyFilter && filters.find((f) => f.id === storyFilter)?.class,
                        )}
                        style={{
                          filter: storyFilter ? `${storyFilter}(${filterIntensity}%)` : undefined,
                        }}
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

                    {!isCapturing && newStoryMedia.length > 0 && (
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

                  {!isCapturing && newStoryMedia.length > 0 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Add a caption</label>
                        <Input
                          placeholder="Write a caption..."
                          value={storyCaption}
                          onChange={(e) => setStoryCaption(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Apply filter</label>
                        <div className="grid grid-cols-3 gap-2">
                          {filters.map((filter) => (
                            <Button
                              key={filter.id}
                              variant={storyFilter === filter.id ? "default" : "outline"}
                              className="h-auto py-2"
                              onClick={() => setStoryFilter(filter.id)}
                            >
                              {filter.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {storyFilter && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Filter intensity</label>
                          <Slider
                            value={[filterIntensity]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => setFilterIntensity(value[0])}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="border-t p-4">
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateStoryOpen(false)
                  stopCamera()
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white"
                onClick={handleStorySubmit}
                disabled={newStoryMedia.length === 0}
              >
                Share to Story
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

