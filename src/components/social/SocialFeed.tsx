"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Reaction = "like" | "love" | "laugh" | "wow" | "sad" | "angry";

type Post = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: string;
  reactions: Record<Reaction, number>;
  userReaction: Reaction | null;
};

const natureSentences = [
  "The sunset at the beach yesterday was breathtaking.",
  "I saw a peacock dancing in the rain this morning!",
  "The monsoon has brought so much greenery to our village.",
  "Birdsong in the early morning always lifts my spirits.",
  "Mountains are calling, and I must go.",
  "Spotted a rainbow after the evening drizzle 🌈",
  "Nature walks are the best therapy.",
  "There's nothing more peaceful than watching clouds roll by.",
  "Freshly bloomed flowers make my day.",
  "The river near my home is flowing full and fast!"
];

const eventMentions = [
  "Can't wait for the EcoFest 2025 next weekend!",
  "Who else is going to the Nature Connect meet-up this Friday?",
  "Looking forward to volunteering at the Tree Plantation Drive 🌱",
  "I'm prepping my speech for the Green Future Summit!",
  "The Wildlife Photography Expo is just 3 days away!"
];

export default function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const generateMockPosts = (pageNum: number, count: number = 5): Post[] => {
    return Array.from({ length: count }, (_, i) => {
      const natureText = getRandomItem(natureSentences);
      const eventText = getRandomItem(eventMentions);
      const imageFilenames = ["/p3.jpg", "/p4.jpg", "/p5.jpg", "/p6.jpg", "/p7.jpg"];
      return {
        id: `${pageNum}-${i}`,
        author: `User ${Math.floor(Math.random() * 100)}`,
        avatar: `/q${Math.floor(Math.random()*8)+1}.png?height=40&width=40`,
        content: `${natureText} ${eventText}`,
        image: imageFilenames[Math.floor(Math.random() * imageFilenames.length)],
        timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
        reactions: {
          like: Math.floor(Math.random() * 50),
          love: Math.floor(Math.random() * 30),
          laugh: Math.floor(Math.random() * 20),
          wow: Math.floor(Math.random() * 10),
          sad: Math.floor(Math.random() * 5),
          angry: Math.floor(Math.random() * 3)
        },
        userReaction: null
      };
    });
  };

  useEffect(() => {
    loadMorePosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  const loadMorePosts = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPosts = generateMockPosts(page);
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setPage(prevPage => prevPage + 1);
    if (page >= 5) {
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleReaction = (postId: string, reaction: Reaction) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedReactions = { ...post.reactions };

        if (post.userReaction === reaction) {
          updatedReactions[reaction] -= 1;
          return { ...post, reactions: updatedReactions, userReaction: null };
        } else if (post.userReaction) {
          updatedReactions[post.userReaction] -= 1;
          updatedReactions[reaction] += 1;
          return { ...post, reactions: updatedReactions, userReaction: reaction };
        } else {
          updatedReactions[reaction] += 1;
          return { ...post, reactions: updatedReactions, userReaction: reaction };
        }
      }
      return post;
    }));
  };

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

  const aggregatedReactions = posts.reduce((acc, post) => {
    Object.entries(post.reactions).forEach(([reaction, count]) => {
      acc[reaction as Reaction] = (acc[reaction as Reaction] || 0) + count;
    });
    return acc;
  }, {} as Record<Reaction, number>);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Social Feed</h2>
        <div className="mt-4 p-3 bg-[#f2f2f2] dark:bg-[#1a1a1a] rounded-lg">
          <h3 className="text-sm font-medium mb-2">Reaction Summary</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(aggregatedReactions).map(([reaction, count]) => (
              <div key={reaction} className="flex items-center gap-1">
                <span className="text-lg">{getReactionEmoji(reaction as Reaction)}</span>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
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

                {post.image && (
                  <div className="mt-3">
                    <Image
                      src={post.image}
                      alt="Post image"
                      width={500}
                      height={300}
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                )}

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

        <div ref={observerTarget} className="py-4 text-center">
          {loading && <div className="loader">Loading more posts...</div>}
          {!hasMore && posts.length > 0 && (
            <div className="text-sm text-gray-500">No more posts to load</div>
          )}
        </div>
      </div>
    </div>
  );
}
