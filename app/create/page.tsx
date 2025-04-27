import { CreatePostModal } from "@/components/create-post-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Image, Film, FileText, Mic, PenSquare } from "lucide-react"

export default function CreatePage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create</h1>
          <p className="text-muted-foreground">Share your content with the world</p>
        </div>
        <CreatePostModal />
      </div>

      <Tabs defaultValue="post" className="w-full">
        <TabsList className="grid grid-cols-5 w-full mb-8">
          <TabsTrigger value="post" className="flex flex-col items-center gap-2 py-3">
            <PenSquare className="h-5 w-5" />
            <span>Post</span>
          </TabsTrigger>
          <TabsTrigger value="photo" className="flex flex-col items-center gap-2 py-3">
            <Image className="h-5 w-5" />
            <span>Photo</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex flex-col items-center gap-2 py-3">
            <Film className="h-5 w-5" />
            <span>Video</span>
          </TabsTrigger>
          <TabsTrigger value="article" className="flex flex-col items-center gap-2 py-3">
            <FileText className="h-5 w-5" />
            <span>Article</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex flex-col items-center gap-2 py-3">
            <Mic className="h-5 w-5" />
            <span>Audio</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="post" className="space-y-6">
          <Card className="border-none neomorphic card-hover">
            <CardHeader>
              <CardTitle>Create a Post</CardTitle>
              <CardDescription>Share your thoughts, photos, and more with your followers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <PenSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Create a New Post</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mb-4">
                      Share updates, photos, videos, and more with your followers.
                    </p>
                    <CreatePostModal />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photo" className="space-y-6">
          <Card className="border-none neomorphic card-hover">
            <CardHeader>
              <CardTitle>Upload Photos</CardTitle>
              <CardDescription>Share your best moments with high-quality photos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <Image className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Photos</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mb-4">
                      Drag and drop photos or click to browse your files.
                    </p>
                    <CreatePostModal />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <Card className="border-none neomorphic card-hover">
            <CardHeader>
              <CardTitle>Upload Videos</CardTitle>
              <CardDescription>Share engaging video content with your audience.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <Film className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Videos</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mb-4">
                      Drag and drop videos or click to browse your files.
                    </p>
                    <CreatePostModal />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="article" className="space-y-6">
          <Card className="border-none neomorphic card-hover">
            <CardHeader>
              <CardTitle>Write an Article</CardTitle>
              <CardDescription>Share in-depth thoughts and ideas with your followers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Write an Article</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mb-4">
                      Create long-form content with rich formatting and media.
                    </p>
                    <CreatePostModal />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-6">
          <Card className="border-none neomorphic card-hover">
            <CardHeader>
              <CardTitle>Record Audio</CardTitle>
              <CardDescription>Share podcasts, music, or voice messages with your audience.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <Mic className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Record Audio</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mb-4">
                      Record audio directly or upload existing audio files.
                    </p>
                    <CreatePostModal />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

