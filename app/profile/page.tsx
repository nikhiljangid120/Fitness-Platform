"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PostCard } from "@/components/post-card"
import { MapPin, LinkIcon, Calendar, Grid, Bookmark, Heart, Settings, Share2, Pencil, Loader2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { currentUser, posts, updateUser } = useStore()
  const router = useRouter()
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [editedUser, setEditedUser] = useState<typeof currentUser>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/")
    } else {
      setEditedUser(currentUser)
    }
  }, [currentUser, router])

  if (!currentUser) return null

  // Filter posts by current user
  const userPosts = posts.filter((post) => post.user.id === currentUser.id)
  const likedPosts = posts.filter((post) => post.liked)
  const savedPosts = posts.filter((post) => post.saved)

  const handleEditProfile = () => {
    setEditProfileOpen(true)
  }

  const handleSaveProfile = () => {
    if (!editedUser) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      updateUser(currentUser.id, {
        name: editedUser.name,
        bio: editedUser.bio,
        location: editedUser.location,
        website: editedUser.website,
      })

      setIsSubmitting(false)
      setEditProfileOpen(false)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully!",
      })
    }, 1500)
  }

  return (
    <div className="container py-4 max-w-4xl mx-auto">
      {/* Cover Photo */}
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-16">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-4 md:left-8">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {currentUser.verified && (
              <Badge className="absolute bottom-0 right-0 h-8 w-8 rounded-full flex items-center justify-center bg-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm" onClick={handleEditProfile}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {currentUser.name}
              {currentUser.verified && (
                <Badge variant="default" className="h-5 px-1.5 py-0 bg-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
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
            </h1>
            <p className="text-muted-foreground">@{currentUser.username}</p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="text-center">
              <p className="font-bold">{userPosts.length}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{currentUser.followers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{currentUser.following.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-3">{currentUser.bio}</p>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            {currentUser.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{currentUser.location}</span>
              </div>
            )}
            {currentUser.website && (
              <div className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                <a
                  href={`https://${currentUser.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {currentUser.website}
                </a>
              </div>
            )}
            {currentUser.joinedDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Joined {currentUser.joinedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Likes</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span>Saved</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 space-y-6">
            {userPosts.length > 0 ? (
              userPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Grid className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-muted-foreground max-w-md">When you create posts, they will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
            {likedPosts.length > 0 ? (
              <div className="space-y-6">
                {likedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No liked posts yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Posts you like will appear here. Start exploring and liking posts to see them here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            {savedPosts.length > 0 ? (
              <div className="space-y-6">
                {savedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No saved posts yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Save posts to view them later. Saved posts are private and only visible to you.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editedUser?.name || ""}
                onChange={(e) => setEditedUser((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={editedUser?.bio || ""}
                onChange={(e) => setEditedUser((prev) => (prev ? { ...prev, bio: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={editedUser?.location || ""}
                onChange={(e) => setEditedUser((prev) => (prev ? { ...prev, location: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                value={editedUser?.website || ""}
                onChange={(e) => setEditedUser((prev) => (prev ? { ...prev, website: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfileOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

