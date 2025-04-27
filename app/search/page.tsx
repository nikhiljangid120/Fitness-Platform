"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, Hash, Image, MapPin } from "lucide-react"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { PostCard } from "@/components/post-card"

export default function SearchPage() {
  const { currentUser, users, posts, searchQuery, setSearchQuery } = useStore()
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push("/")
    }
  }, [currentUser, router])

  if (!currentUser) return null

  // Filter results based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.location && post.location.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Highlight search terms in text
  const highlightText = (text: string) => {
    if (!searchQuery) return text

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={i} className="search-result-highlight">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for people, posts, hashtags..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="gradient-bg">Search</Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>People</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Photos</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Locations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {searchQuery ? (
              <>
                {filteredUsers.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">People</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredUsers.slice(0, 4).map((user) => (
                        <Card key={user.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                  <p className="font-medium truncate">{highlightText(user.name)}</p>
                                  {user.verified && (
                                    <Badge variant="default" className="ml-1 h-4 px-1 py-0 bg-primary">
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
                                <p className="text-sm text-muted-foreground truncate">
                                  @{highlightText(user.username)}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                Follow
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {filteredUsers.length > 4 && (
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("people")}>
                        View all {filteredUsers.length} people
                      </Button>
                    )}
                  </div>
                )}

                {filteredPosts.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Posts</h2>
                    <div className="space-y-4">
                      {filteredPosts.slice(0, 2).map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                    {filteredPosts.length > 2 && (
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("posts")}>
                        View all {filteredPosts.length} posts
                      </Button>
                    )}
                  </div>
                )}

                {filteredUsers.length === 0 && filteredPosts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p className="text-muted-foreground max-w-md">
                      We couldn't find any matches for "{searchQuery}". Try different keywords or check for typos.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Search for something</h3>
                <p className="text-muted-foreground max-w-md">
                  Try searching for people, posts, or topics to find what you're looking for.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="people" className="space-y-6">
            {searchQuery ? (
              filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <p className="font-medium truncate">{highlightText(user.name)}</p>
                              {user.verified && (
                                <Badge variant="default" className="ml-1 h-4 px-1 py-0 bg-primary">
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
                            <p className="text-sm text-muted-foreground truncate">@{highlightText(user.username)}</p>
                            {user.bio && <p className="text-sm mt-1">{highlightText(user.bio)}</p>}
                          </div>
                          <Button variant="outline" size="sm">
                            Follow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No people found</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't find any people matching "{searchQuery}". Try different keywords.
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Search for people</h3>
                <p className="text-muted-foreground max-w-md">Enter a name or username to find people on FlexForge.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            {searchQuery ? (
              filteredPosts.length > 0 ? (
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Hash className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts found</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't find any posts matching "{searchQuery}". Try different keywords.
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Hash className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Search for posts</h3>
                <p className="text-muted-foreground max-w-md">Enter keywords to find posts on FlexForge.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            {searchQuery ? (
              filteredPosts.filter((post) => post.images.length > 0).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredPosts
                    .filter((post) => post.images.length > 0)
                    .flatMap((post) =>
                      post.images.map((image, index) => ({
                        id: `${post.id}-${index}`,
                        image,
                        post,
                      })),
                    )
                    .map((item) => (
                      <div key={item.id} className="aspect-square rounded-md overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt="Post image"
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => router.push(`/post/${item.post.id}`)}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Image className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No photos found</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't find any photos matching "{searchQuery}". Try different keywords.
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Image className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Search for photos</h3>
                <p className="text-muted-foreground max-w-md">Enter keywords to find photos on FlexForge.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            {searchQuery ? (
              filteredPosts.filter((post) => post.location).length > 0 ? (
                <div className="space-y-6">
                  {/* Group posts by location */}
                  {Array.from(new Set(filteredPosts.filter((post) => post.location).map((post) => post.location))).map(
                    (location) => (
                      <div key={location} className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-primary" />
                          {highlightText(location || "")}
                        </h2>
                        <div className="space-y-4">
                          {filteredPosts
                            .filter((post) => post.location === location)
                            .slice(0, 2)
                            .map((post) => (
                              <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No locations found</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't find any posts with locations matching "{searchQuery}". Try different keywords.
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Search for locations</h3>
                <p className="text-muted-foreground max-w-md">Enter a location name to find posts from that place.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

