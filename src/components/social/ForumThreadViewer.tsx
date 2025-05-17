"use client";

import { useState } from "react";
import Image from "next/image";

type Reaction = "like" | "love" | "laugh" | "wow" | "sad" | "angry";

type Post = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  reactions: Record<Reaction, number>;
  userReaction: Reaction | null;
  tags: string[];
};

export default function ForumThreadViewer() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Alex Johnson",
      avatar: "/q6.png?height=40&width=40",
      content: "Just discovered a great new featured event in the latest update!",
      timestamp: "2 hours ago",
      reactions: { like: 12, love: 5, laugh: 0, wow: 2, sad: 0, angry: 0 },
      userReaction: null,
      tags: ["feature", "update", "event"]
    },
    {
      id: "2",
      author: "Jamie Smith",
      avatar: "/q10.png?height=40&width=40",
      content: "Yes! The new featured event is amazing. I especially like how they visualize user engagement over time.",
      timestamp: "1 hour ago",
      reactions: { like: 8, love: 3, laugh: 1, wow: 0, sad: 0, angry: 0 },
      userReaction: null,
      tags: ["analytics", "visualization"]
    },
    {
      id: "3",
      author: "Taylor Brown",
      avatar: "/q7.png?height=40&width=40",
      content: "I'm soooo excited",
      timestamp: "45 minutes ago",
      reactions: { like: 2, love: 0, laugh: 0, wow: 0, sad: 3, angry: 1 },
      userReaction: null,
      tags: ["excited"]
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");

  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort();

  const handleReaction = (postId: string, reaction: Reaction) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (post.userReaction === reaction) {
          const updatedReactions = { ...post.reactions };
          updatedReactions[reaction] -= 1;
          return {
            ...post,
            reactions: updatedReactions,
            userReaction: null
          };
        } 
        else if (post.userReaction) {
          const updatedReactions = { ...post.reactions };
          updatedReactions[post.userReaction] -= 1;
          updatedReactions[reaction] += 1;
          return {
            ...post,
            reactions: updatedReactions,
            userReaction: reaction
          };
        } 
        else {
          const updatedReactions = { ...post.reactions };
          updatedReactions[reaction] += 1;
          return {
            ...post,
            reactions: updatedReactions,
            userReaction: reaction
          };
        }
      }
      return post;
    }));
  };

  const filteredPosts = activeFilter
    ? posts.filter(post => post.tags.includes(activeFilter))
    : posts;

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "newest") {
      return -1;
    } else if (sortBy === "oldest") {
      return 1; 
    } else {
      const totalReactionsA = Object.values(a.reactions).reduce((sum, count) => sum + count, 0);
      const totalReactionsB = Object.values(b.reactions).reduce((sum, count) => sum + count, 0);
      return totalReactionsB - totalReactionsA;
    }
  });

  const getReactionEmoji = (reaction: Reaction) => {
    switch (reaction) {
      case "like": return "👍";
      case "love": return "❤️";
      case "laugh": return "😂";
      case "wow": return "😮";
      case "sad": return "😢";
      case "angry": return "😠";
      default: return "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Forum Thread: New Features Discussion</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "popular")}
            className="text-sm p-1 border border-black/[.08] dark:border-white/[.145] rounded bg-background"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-3 py-1 text-xs rounded-full ${
            activeFilter === null
              ? "bg-foreground text-background"
              : "border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
          }`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            className={`px-3 py-1 text-xs rounded-full ${
              activeFilter === tag
                ? "bg-foreground text-background"
                : "border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <div key={post.id} className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-4">
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
                </div>
                <p className="mt-2">{post.content}</p>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-[#f2f2f2] dark:bg-[#1a1a1a] text-xs px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["like", "love", "laugh", "wow", "sad", "angry"] as Reaction[]).map((reaction) => (
                    <button
                      key={reaction}
                      onClick={() => handleReaction(post.id, reaction)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                        post.userReaction === reaction
                          ? "bg-[#e6f7ff] dark:bg-[#003a70]"
                          : "hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                      }`}
                    >
                      <span>{getReactionEmoji(reaction)}</span>
                      {post.reactions[reaction] > 0 && (
                        <span className="text-xs">{post.reactions[reaction]}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
