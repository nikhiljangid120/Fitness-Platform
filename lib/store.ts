import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define types
export interface User {
  id: string
  name: string
  username: string
  verified: boolean
  avatar: string
  bio?: string
  location?: string
  website?: string
  joinedDate?: string
  followers: number
  following: number
  posts: number
  online?: boolean
  lastSeen?: string
  email?: string
  coverPhoto?: string
  interests?: string[]
  phoneNumber?: string
}

export interface Post {
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
  reactions?: {
    type: "like" | "love" | "haha" | "wow" | "sad" | "angry"
    count: number
  }[]
}

export interface Story {
  id: string
  user: {
    id: string
    name: string
    username: string
    avatar: string
  }
  seen: boolean
  media: {
    type: "image" | "video"
    url: string
    filter?: string
    filterIntensity?: number
    music?: string
  }[]
  timestamp: string
  likes: number
  viewCount: number
  caption?: string
}

export interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: string
  status?: "sent" | "delivered" | "read"
  media?: {
    type: "image" | "video"
    url: string
  }[]
}

export interface Chat {
  id: string
  contact: {
    id: string
    name: string
    username: string
    avatar: string
    online: boolean
    lastSeen?: string
    typing?: boolean
  }
  messages: Message[]
  unread: number
}

export interface Comment {
  id: string
  postId: string
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

interface AppState {
  // Theme
  themePreference: string | null
  setThemePreference: (theme: string) => void

  // Current user
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // Users
  users: User[]
  addUser: (user: User) => void
  updateUser: (userId: string, userData: Partial<User>) => void
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void

  // Posts
  posts: Post[]
  addPost: (post: Post) => void
  updatePost: (postId: string, postData: Partial<Post>) => void
  deletePost: (postId: string) => void
  likePost: (postId: string) => void
  savePost: (postId: string) => void
  reactToPost: (postId: string, reactionType: "like" | "love" | "haha" | "wow" | "sad" | "angry") => void

  // Comments
  comments: Comment[]
  addComment: (comment: Comment) => void
  updateComment: (commentId: string, content: string) => void
  deleteComment: (commentId: string) => void
  likeComment: (commentId: string) => void
  replyToComment: (commentId: string, reply: Comment) => void

  // Stories
  stories: Story[]
  addStory: (story: Story) => void
  viewStory: (storyId: string) => void

  // Chats
  chats: Chat[]
  addChat: (chat: Chat) => void
  addMessage: (chatId: string, message: Message) => void
  updateMessageStatus: (chatId: string, messageId: string, status: "sent" | "delivered" | "read") => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
}

// Initial data
const initialUsers: User[] = [
  {
    id: "user1",
    name: "Rohan Mehta",
    username: "rohanmehta",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "🚀 Exploring the future of AI & Web3 | Founder @NextGenTech",
    location: "Mumbai, India",
    website: "rohanmehta.com",
    joinedDate: "January 2020",
    followers: 12500,
    following: 350,
    posts: 248,
    online: true,
    email: "rohan@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Technology", "AI", "Web3", "Startups"],
    phoneNumber: "+91 9876543210",
  },
  {
    id: "user2",
    name: "Priya Sharma",
    username: "priyastyles",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Fashion Designer | Entrepreneur | Living life in color ✨",
    location: "Delhi, India",
    website: "priyastyles.in",
    joinedDate: "March 2019",
    followers: 45600,
    following: 512,
    posts: 187,
    online: true,
    email: "priya@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Fashion", "Design", "Travel", "Photography"],
    phoneNumber: "+91 9876543211",
  },
  {
    id: "user3",
    name: "Aryan Gupta",
    username: "aryanfit",
    verified: false,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Fitness Coach 💪 | Helping you achieve your fitness goals",
    location: "Bangalore, India",
    website: "aryanfitness.com",
    joinedDate: "June 2021",
    followers: 8900,
    following: 723,
    posts: 156,
    online: false,
    lastSeen: "2h ago",
    email: "aryan@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Fitness", "Gym", "Nutrition", "Health"],
    phoneNumber: "+91 9876543212",
  },
  {
    id: "user4",
    name: "Neha Verma",
    username: "nehaeats",
    verified: false,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
    bio: "Food Blogger | Exploring street food across India 🍽️",
    location: "Kolkata, India",
    website: "nehaeats.in",
    joinedDate: "September 2020",
    followers: 15700,
    following: 432,
    posts: 312,
    online: true,
    email: "neha@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Food", "Travel", "Cooking", "Restaurants"],
    phoneNumber: "+91 9876543213",
  },
  {
    id: "user5",
    name: "Kabir Singh",
    username: "kabirtalks",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Movie Critic | Host @FilmTalks | Bollywood enthusiast",
    location: "Mumbai, India",
    website: "kabirreviews.com",
    joinedDate: "April 2018",
    followers: 32100,
    following: 215,
    posts: 423,
    online: false,
    lastSeen: "5h ago",
    email: "kabir@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Movies", "Bollywood", "Reviews", "Film"],
    phoneNumber: "+91 9876543214",
  },
  {
    id: "user6",
    name: "Simran Kaur",
    username: "simrankaurs",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    bio: "Entrepreneur | Founder @KaursClothing | Fashion enthusiast",
    location: "Chandigarh, India",
    website: "simrankaur.com",
    joinedDate: "February 2019",
    followers: 28900,
    following: 342,
    posts: 198,
    online: true,
    email: "simran@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1519389950473-47a04ca0052b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Fashion", "Entrepreneurship", "Clothing", "Design"],
    phoneNumber: "+91 9876543215",
  },
  {
    id: "user7",
    name: "Raj Malhotra",
    username: "rajcomedy",
    verified: false,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Stand-up Comedian | Book me for events! | Making India laugh",
    location: "Delhi, India",
    website: "rajcomedy.in",
    joinedDate: "July 2020",
    followers: 18700,
    following: 521,
    posts: 143,
    online: false,
    lastSeen: "1d ago",
    email: "raj@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1542996674-0c5bd1503514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Comedy", "Stand-up", "Events", "Humor"],
    phoneNumber: "+91 9876543216",
  },
  {
    id: "user8",
    name: "Ananya Patel",
    username: "ananyatravels",
    verified: false,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    bio: "Travel Blogger | 25 countries and counting ✈️ | Adventure seeker",
    location: "Goa, India",
    website: "ananyatravels.com",
    joinedDate: "October 2019",
    followers: 22400,
    following: 387,
    posts: 276,
    online: true,
    email: "ananya@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1476514524981-bb8f04e62e18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Travel", "Blogging", "Adventure", "Photography"],
    phoneNumber: "+91 9876543217",
  },
  {
    id: "user9",
    name: "Vikram Khanna",
    username: "vikramtech",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Tech Entrepreneur | Angel Investor | Building the future",
    location: "Hyderabad, India",
    website: "vikramkhanna.tech",
    joinedDate: "December 2017",
    followers: 56700,
    following: 231,
    posts: 189,
    online: false,
    lastSeen: "3h ago",
    email: "vikram@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1518770660439-464c4c52ef1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Technology", "Startups", "Investing", "Web Development"],
    phoneNumber: "+91 9876543218",
  },
  {
    id: "user10",
    name: "Meera Kapoor",
    username: "meeraarts",
    verified: false,
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    bio: "Artist | Painter | Finding beauty in everyday life 🎨",
    location: "Jaipur, India",
    website: "meeraarts.in",
    joinedDate: "May 2020",
    followers: 12300,
    following: 456,
    posts: 211,
    online: true,
    email: "meera@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1500462918734-8cb3c5eee163?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Art", "Painting", "Creativity", "Design"],
    phoneNumber: "+91 9876543219",
  },
  // Adding more diverse users
  {
    id: "user11",
    name: "Aditya Sharma",
    username: "adityacode",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    bio: "Software Engineer | Open Source Contributor | Building cool stuff with code",
    location: "Pune, India",
    website: "adityasharma.dev",
    joinedDate: "August 2019",
    followers: 9800,
    following: 345,
    posts: 178,
    online: true,
    email: "aditya@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1517694712202-14f926a33a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Software Engineering", "Open Source", "Web Development", "Coding"],
    phoneNumber: "+91 9876543220",
  },
  {
    id: "user12",
    name: "Zara Khan",
    username: "zarastyle",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Fashion Model | Brand Ambassador | Living my dream ✨",
    location: "Mumbai, India",
    website: "zarakhan.com",
    joinedDate: "January 2018",
    followers: 67500,
    following: 412,
    posts: 342,
    online: true,
    email: "zara@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1503104834682-66a45fbc4057?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Fashion", "Modeling", "Brand Ambassadorship", "Lifestyle"],
    phoneNumber: "+91 9876543221",
  },
  {
    id: "user13",
    name: "Rahul Verma",
    username: "rahulchef",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Celebrity Chef | Restaurant Owner | Food is my language of love 🍲",
    location: "Delhi, India",
    website: "rahulkitchen.com",
    joinedDate: "March 2017",
    followers: 43200,
    following: 256,
    posts: 289,
    online: false,
    lastSeen: "4h ago",
    email: "rahul@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1467003954554-144940421a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Cooking", "Food", "Restaurants", "Celebrity Chef"],
    phoneNumber: "+91 9876543222",
  },
  {
    id: "user14",
    name: "Divya Patel",
    username: "divyayoga",
    verified: false,
    avatar:
      "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=780&q=80",
    bio: "Yoga Instructor | Wellness Coach | Find your inner peace 🧘‍♀️",
    location: "Rishikesh, India",
    website: "divyayoga.in",
    joinedDate: "June 2020",
    followers: 18900,
    following: 312,
    posts: 165,
    online: true,
    email: "divya@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1505576399892-58e1082443ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Yoga", "Wellness", "Coaching", "Fitness"],
    phoneNumber: "+91 9876543223",
  },
  {
    id: "user15",
    name: "Karan Singhania",
    username: "karanmusic",
    verified: true,
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    bio: "Music Producer | DJ | Creating beats that move your soul 🎵",
    location: "Bangalore, India",
    website: "karanbeats.com",
    joinedDate: "April 2019",
    followers: 34500,
    following: 278,
    posts: 198,
    online: false,
    lastSeen: "1h ago",
    email: "karan@example.com",
    coverPhoto:
      "https://images.unsplash.com/photo-1493225452140-c241895352a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    interests: ["Music", "DJ", "Production", "Electronic Music"],
    phoneNumber: "+91 9876543224",
  },
]

const initialPosts: Post[] = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Rohan Mehta",
      username: "rohanmehta",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    content: "AI is the future, but are we ready for it? 🤖 #AI #Tech",
    images: [
      "https://images.unsplash.com/photo-1677442135136-760c813dce26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    ],
    likes: 245,
    comments: 32,
    shares: 12,
    timestamp: "2h ago",
    location: "Mumbai, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 180 },
      { type: "love", count: 45 },
      { type: "wow", count: 20 },
    ],
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Priya Sharma",
      username: "priyastyles",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    content: "New ethnic collection launch! ✨ Who's excited? #IndianFashion",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1614886137468-5890a0dd4bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    ],
    likes: 532,
    comments: 78,
    shares: 45,
    timestamp: "4h ago",
    location: "Delhi, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 420 },
      { type: "love", count: 80 },
      { type: "wow", count: 32 },
    ],
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "Aryan Gupta",
      username: "aryanfit",
      verified: false,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    content: "Monday Motivation 💪 Never skip leg day! #Fitness #GymLife",
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    ],
    likes: 189,
    comments: 23,
    shares: 5,
    timestamp: "6h ago",
    location: "Bangalore, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 150 },
      { type: "love", count: 10 },
      { type: "haha", count: 5 },
    ],
  },
  {
    id: "4",
    user: {
      id: "user4",
      name: "Neha Verma",
      username: "nehaeats",
      verified: false,
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
    },
    content: "Best Pani Puri in Kolkata? 🔥 Find out in my new post! #StreetFood",
    images: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    ],
    likes: 312,
    comments: 56,
    shares: 18,
    timestamp: "8h ago",
    location: "Kolkata, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 280 },
      { type: "love", count: 20 },
      { type: "wow", count: 12 },
    ],
  },
  {
    id: "5",
    user: {
      id: "user5",
      name: "Kabir Singh",
      username: "kabirtalks",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    content:
      "Just watched the new Shah Rukh Khan movie. Absolutely brilliant performance! What did you all think? #Bollywood #MovieReview",
    images: [
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80",
    ],
    likes: 421,
    comments: 87,
    shares: 32,
    timestamp: "1d ago",
    location: "Mumbai, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 350 },
      { type: "love", count: 50 },
      { type: "wow", count: 21 },
    ],
  },
  {
    id: "6",
    user: {
      id: "user6",
      name: "Simran Kaur",
      username: "simrankaurs",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    },
    content:
      "Excited to announce that our clothing line is now available nationwide! 🎉 Check out our website for the latest collection. #Fashion #Entrepreneur",
    images: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    ],
    likes: 567,
    comments: 93,
    shares: 124,
    timestamp: "1d ago",
    location: "Chandigarh, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 480 },
      { type: "love", count: 67 },
      { type: "wow", count: 20 },
    ],
  },
  {
    id: "7",
    user: {
      id: "user8",
      name: "Ananya Patel",
      username: "ananyatravels",
      verified: false,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    },
    content: "The breathtaking views of Ladakh! 🏔️ This trip was absolutely life-changing. #Travel #Ladakh #Wanderlust",
    images: [
      "https://images.unsplash.com/photo-1537524482290-5a36d49ab04a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    ],
    likes: 876,
    comments: 124,
    shares: 76,
    timestamp: "2d ago",
    location: "Ladakh, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 700 },
      { type: "love", count: 126 },
      { type: "wow", count: 50 },
    ],
  },
  {
    id: "8",
    user: {
      id: "user10",
      name: "Meera Kapoor",
      username: "meeraarts",
      verified: false,
      avatar:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    },
    content:
      "My latest painting inspired by the streets of Jaipur. What do you think? 🎨 #Art #Painting #CreativeProcess",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1945&q=80",
    ],
    likes: 432,
    comments: 67,
    shares: 23,
    timestamp: "3d ago",
    location: "Jaipur, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 350 },
      { type: "love", count: 52 },
      { type: "wow", count: 30 },
    ],
  },
  // Adding more diverse posts
  {
    id: "9",
    user: {
      id: "user11",
      name: "Aditya Sharma",
      username: "adityacode",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    },
    content:
      "Just launched my new open-source project! Check it out on GitHub and let me know what you think. #OpenSource #Programming #WebDev",
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    ],
    likes: 187,
    comments: 42,
    shares: 28,
    timestamp: "5h ago",
    location: "Pune, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 150 },
      { type: "love", count: 20 },
      { type: "wow", count: 17 },
    ],
  },
  {
    id: "10",
    user: {
      id: "user12",
      name: "Zara Khan",
      username: "zarastyle",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    content:
      "Behind the scenes from today's photoshoot for @VogueIndia! Can't wait for you all to see the final shots. ✨ #Fashion #Model #BTS",
    images: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1020&q=80",
    ],
    likes: 1243,
    comments: 156,
    shares: 87,
    timestamp: "7h ago",
    location: "Mumbai, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 1000 },
      { type: "love", count: 153 },
      { type: "wow", count: 90 },
    ],
  },
  {
    id: "11",
    user: {
      id: "user13",
      name: "Rahul Verma",
      username: "rahulchef",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    content:
      "My signature butter chicken recipe is now on the blog! Made with love and traditional spices. 🍲 #IndianCuisine #Cooking #FoodBlogger",
    images: [
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    ],
    likes: 765,
    comments: 98,
    shares: 124,
    timestamp: "10h ago",
    location: "Delhi, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 600 },
      { type: "love", count: 105 },
      { type: "wow", count: 60 },
    ],
  },
  {
    id: "12",
    user: {
      id: "user14",
      name: "Divya Patel",
      username: "divyayoga",
      verified: false,
      avatar:
        "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=780&q=80",
    },
    content:
      "Start your day with this 15-minute morning yoga routine. Perfect for beginners! 🧘‍♀️ #Yoga #Wellness #MorningRoutine",
    images: [
      "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    ],
    likes: 432,
    comments: 67,
    shares: 98,
    timestamp: "12h ago",
    location: "Rishikesh, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 350 },
      { type: "love", count: 52 },
      { type: "wow", count: 30 },
    ],
  },
  {
    id: "13",
    user: {
      id: "user15",
      name: "Karan Singhania",
      username: "karanmusic",
      verified: true,
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    content: "Just dropped my new track 'Midnight Dreams'! Link in bio. 🎵 #NewMusic #Producer #ElectronicMusic",
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    ],
    likes: 876,
    comments: 132,
    shares: 245,
    timestamp: "1d ago",
    location: "Bangalore, India",
    liked: false,
    saved: false,
    reactions: [
      { type: "like", count: 700 },
      { type: "love", count: 126 },
      { type: "wow", count: 50 },
    ],
  },
]

const initialStories: Story[] = [
  {
    id: "story1",
    user: {
      id: "user1",
      name: "Your Story",
      username: "you",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    seen: false,
    media: [],
    timestamp: "Just now",
    likes: 0,
    viewCount: 0,
  },
  {
    id: "story2",
    user: {
      id: "user2",
      name: "Priya Sharma",
      username: "priyastyles",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    seen: false,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1614886137468-5890a0dd4bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      },
    ],
    timestamp: "2h ago",
    likes: 245,
    viewCount: 1024,
  },
  {
    id: "story3",
    user: {
      id: "user3",
      name: "Aryan Gupta",
      username: "aryanfit",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    seen: false,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      },
    ],
    timestamp: "4h ago",
    likes: 189,
    viewCount: 876,
  },
  {
    id: "story4",
    user: {
      id: "user4",
      name: "Neha Verma",
      username: "nehaeats",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
    },
    seen: true,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      },
    ],
    timestamp: "8h ago",
    likes: 312,
    viewCount: 1532,
  },
  {
    id: "story5",
    user: {
      id: "user5",
      name: "Kabir Singh",
      username: "kabirtalks",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    seen: false,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80",
      },
    ],
    timestamp: "1d ago",
    likes: 421,
    viewCount: 1876,
  },
  {
    id: "story6",
    user: {
      id: "user6",
      name: "Simran Kaur",
      username: "simrankaurs",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    },
    seen: false,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      },
    ],
    timestamp: "1d ago",
    likes: 567,
    viewCount: 2345,
  },
  {
    id: "story7",
    user: {
      id: "user8",
      name: "Ananya Patel",
      username: "ananyatravels",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    },
    seen: true,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1537524482290-5a36d49ab04a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      },
    ],
    timestamp: "2d ago",
    likes: 876,
    viewCount: 3210,
  },
  // Adding more stories for new users
  {
    id: "story8",
    user: {
      id: "user12",
      name: "Zara Khan",
      username: "zarastyle",
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    seen: false,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      },
    ],
    timestamp: "5h ago",
    likes: 543,
    viewCount: 2187,
  },
  {
    id: "story9",
    user: {
      id: "user13",
      name: "Rahul Verma",
      username: "rahulchef",
      avatar:
        "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    seen: false,
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      },
    ],
    timestamp: "7h ago",
    likes: 321,
    viewCount: 1432,
  },
]

const initialComments: Comment[] = [
  {
    id: "c1",
    postId: "1",
    user: {
      id: "user2",
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
        postId: "1",
        user: {
          id: "user1",
          name: "Rohan Mehta",
          username: "rohanmehta",
          avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
          verified: true,
        },
        content: "Thank you so much! I'm glad you like it 🙏",
        timestamp: "1h ago",
        likes: 5,
        liked: false,
      },
    ],
  },
  // ... other comments
]

// Create the store
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      themePreference: null,
      setThemePreference: (theme) => set({ themePreference: theme }),

      // Current user
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      // Users
      users: initialUsers,
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (userId, userData) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === userId ? { ...user, ...userData } : user)),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, ...userData } : state.currentUser,
        })),
      followUser: (userId) =>
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === userId) {
              return { ...user, followers: user.followers + 1 }
            }
            if (state.currentUser && user.id === state.currentUser.id) {
              return { ...user, following: user.following + 1 }
            }
            return user
          }),
          currentUser: state.currentUser ? { ...state.currentUser, following: state.currentUser.following + 1 } : null,
        })),
      unfollowUser: (userId) =>
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id === userId) {
              return { ...user, followers: Math.max(0, user.followers - 1) }
            }
            if (state.currentUser && user.id === state.currentUser.id) {
              return { ...user, following: Math.max(0, user.following - 1) }
            }
            return user
          }),
          currentUser: state.currentUser
            ? { ...state.currentUser, following: Math.max(0, state.currentUser.following - 1) }
            : null,
        })),

      // Posts
      posts: initialPosts,
      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
          users: state.users.map((user) => (user.id === post.user.id ? { ...user, posts: user.posts + 1 } : user)),
          currentUser:
            state.currentUser?.id === post.user.id
              ? { ...state.currentUser, posts: state.currentUser.posts + 1 }
              : state.currentUser,
        })),
      updatePost: (postId, postData) =>
        set((state) => ({
          posts: state.posts.map((post) => (post.id === postId ? { ...post, ...postData } : post)),
        })),
      deletePost: (postId) =>
        set((state) => {
          const postToDelete = state.posts.find((post) => post.id === postId)
          const userId = postToDelete?.user.id

          return {
            posts: state.posts.filter((post) => post.id !== postId),
            users: state.users.map((user) =>
              user.id === userId ? { ...user, posts: Math.max(0, user.posts - 1) } : user,
            ),
            currentUser:
              state.currentUser?.id === userId
                ? { ...state.currentUser, posts: Math.max(0, state.currentUser.posts - 1) }
                : state.currentUser,
          }
        }),
      likePost: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  liked: !post.liked,
                  likes: post.liked ? post.likes - 1 : post.likes + 1,
                }
              : post,
          ),
        })),
      savePost: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) => (post.id === postId ? { ...post, saved: !post.saved } : post)),
        })),
      reactToPost: (postId, reactionType) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const reactions = post.reactions || []
              const existingReaction = reactions.find((r) => r.type === reactionType)

              if (existingReaction) {
                // Toggle reaction
                return {
                  ...post,
                  reactions: reactions.map((r) =>
                    r.type === reactionType ? { ...r, count: post.liked ? r.count - 1 : r.count + 1 } : r,
                  ),
                  liked: !post.liked,
                  likes: post.liked ? post.likes - 1 : post.likes + 1,
                }
              } else {
                // Add new reaction type
                return {
                  ...post,
                  reactions: [...reactions, { type: reactionType, count: 1 }],
                  liked: true,
                  likes: post.likes + 1,
                }
              }
            }
            return post
          }),
        })),

      // Comments
      comments: initialComments,
      addComment: (comment) =>
        set((state) => ({
          comments: [...state.comments, comment],
          posts: state.posts.map((post) =>
            post.id === comment.postId ? { ...post, comments: post.comments + 1 } : post,
          ),
        })),
      updateComment: (commentId, content) =>
        set((state) => ({
          comments: state.comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, content }
            }

            // Check in replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) => (reply.id === commentId ? { ...reply, content } : reply)),
              }
            }

            return comment
          }),
        })),
      deleteComment: (commentId) =>
        set((state) => {
          // Find the comment to be deleted
          const commentToDelete = state.comments.find((c) => c.id === commentId)
          const isReply = !commentToDelete

          // If it's a top-level comment
          if (!isReply) {
            return {
              comments: state.comments.filter((c) => c.id !== commentId),
              posts: state.posts.map((post) =>
                post.id === commentToDelete?.postId ? { ...post, comments: Math.max(0, post.comments - 1) } : post,
              ),
            }
          }

          // If it's a reply
          return {
            comments: state.comments.map((comment) => {
              if (comment.replies) {
                const replyToDelete = comment.replies.find((r) => r.id === commentId)
                if (replyToDelete) {
                  return {
                    ...comment,
                    replies: comment.replies.filter((r) => r.id !== commentId),
                  }
                }
              }
              return comment
            }),
          }
        }),
      likeComment: (commentId) =>
        set((state) => ({
          comments: state.comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                liked: !comment.liked,
                likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
              }
            }

            // Check in replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) => {
                  if (reply.id === commentId) {
                    return {
                      ...reply,
                      liked: !reply.liked,
                      likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                    }
                  }
                  return reply
                }),
              }
            }

            return comment
          }),
        })),
      replyToComment: (commentId, reply) =>
        set((state) => ({
          comments: state.comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies ? [...comment.replies, reply] : [reply],
              }
            }
            return comment
          }),
          posts: state.posts.map((post) =>
            post.id === reply.postId ? { ...post, comments: post.comments + 1 } : post,
          ),
        })),

      // Stories
      stories: initialStories,
      addStory: (story) => set((state) => ({ stories: [...state.stories, story] })),
      viewStory: (storyId) =>
        set((state) => ({
          stories: state.stories.map((story) => (story.id === storyId ? { ...story, seen: true } : story)),
        })),

      // Chats
      chats: [],
      addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  unread: message.sender === "contact" ? chat.unread + 1 : chat.unread,
                }
              : chat,
          ),
        })),
      updateMessageStatus: (chatId, messageId, status) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) => (msg.id === messageId ? { ...msg, status } : msg)),
                }
              : chat,
          ),
        })),

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "FlexForge-storage",
    },
  ),
)

