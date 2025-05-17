"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Post = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  trending?: boolean;
};

type EmojiAnimation = {
  id: string;
  emoji: string;
  x: number;
  y: number;
  postId: string;
};

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Alex Johnson",
      avatar: "/q10.png?height=40&width=40",
      content: "Just made it to my dream internship.",
      image: "/p1.jpg?height=300&width=500",
      timestamp: "2 hours ago",
      likes: 124,
      comments: 18,
      shares: 5,
      trending: true
    },
    {
      id: "2",
      author: "Jamie Smith",
      avatar: "/q11.png?height=40&width=40",
      content: "Beautiful sunset at the beach today. Nature is truly amazing!",
      image: "/p2.webp?height=300&width=500",
      timestamp: "4 hours ago",
      likes: 89,
      comments: 7,
      shares: 2,
      trending: true
    },
    {
      id: "3",
      author: "Taylor Brown",
      avatar: "/q12.png?height=40&width=40",
      content: "Just finished reading this amazing book. Highly recommend it to everyone interested in AI and its future implications.",
      timestamp: "6 hours ago",
      likes: 45,
      comments: 12,
      shares: 3
    }
  ]);

  const [emojiAnimations, setEmojiAnimations] = useState<EmojiAnimation[]>([]);
  const [nextEmojiId, setNextEmojiId] = useState(1);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));

    const emojis = ["❤️", "👍", "🔥", "🎉", "👏"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const newAnimation: EmojiAnimation = {
      id: `emoji-${nextEmojiId}`,
      emoji: randomEmoji,
      x: Math.random() * 80 + 10,
      y: 0,
      postId
    };
    
    setNextEmojiId(nextEmojiId + 1);
    setEmojiAnimations([...emojiAnimations, newAnimation]);
    
    setTimeout(() => {
      setEmojiAnimations(current => 
        current.filter(animation => animation.id !== newAnimation.id)
      );
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Post Feed</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Trending Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.filter(post => post.trending).map(post => (
            <div 
              key={`trending-${post.id}`} 
              className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src={post.avatar}
                  alt={`${post.author}'s avatar`}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium text-sm">{post.author}</div>
                  <div className="text-xs text-gray-500">{post.timestamp}</div>
                </div>
              </div>
              <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-4 relative"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {emojiAnimations
                .filter(animation => animation.postId === post.id)
                .map(animation => (
                  <div
                    key={animation.id}
                    className="absolute text-2xl animate-float-up"
                    style={{
                      left: `${animation.x}%`,
                      bottom: `${animation.y}%`,
                      animation: "float-up 2s ease-out forwards"
                    }}
                  >
                    {animation.emoji}
                  </div>
                ))}
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={post.avatar}
                  alt={`${post.author}'s avatar`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{post.author}</span>
                    <span className="text-xs text-gray-500 ml-2">{post.timestamp}</span>
                  </div>
                  {post.trending && (
                    <div className="bg-[#ffe9e9] dark:bg-[#3a0000] text-[#ff4d4d] dark:text-[#ff8080] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>🔥</span>
                      <span>Trending</span>
                    </div>
                  )}
                </div>
                
                <p className="mt-2">{post.content}</p>
                
                {post.image && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <Image
                      src={post.image}
                      alt="Post image"
                      width={500}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-[#ff4d4d] transition-colors"
                    >
                      <span>❤️</span>
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1">
                      <span>💬</span>
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1">
                      <span>🔄</span>
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  <button className="text-sm text-gray-500">Save</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0.8;
          }
          50% {
            opacity: 1;
            transform: translateY(-100px) scale(1.2);
          }
          100% {
            transform: translateY(-200px) scale(0.8);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
