"use client";

import { useState } from "react";
import Image from "next/image";

type Comment = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
};

type Reply = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
};

export default function CommentFeed() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Alex Johnson",
      avatar: "/q1.png?height=40&width=40",
      content: "This new event is amazing! I've been waiting for something like this.",
      timestamp: "2 hours ago",
      likes: 12,
      liked: false,
      replies: [
        {
          id: "1-1",
          author: "Sam Taylor",
          avatar: "/q2.png?height=32&width=32",
          content: "I agree! It's been a game-changer.",
          timestamp: "1 hour ago",
          likes: 3,
          liked: false,
        },
      ],
    },
    {
      id: "2",
      author: "Jamie Smith",
      avatar: "/q3.png?height=40&width=40",
      content: "Nice event yeah.",
      timestamp: "3 hours ago",
      likes: 5,
      liked: false,
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleLike = (commentId: string, replyId?: string) => {
    setComments(
      comments.map((comment) => {
        if (replyId) {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id === replyId) {
                  return {
                    ...reply,
                    likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                    liked: !reply.liked,
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        } else {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
              liked: !comment.liked,
            };
          }
          return comment;
        }
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: `${comments.length + 1}`,
      author: "You",
      avatar: "/self.png?height=40&width=40",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
      liked: false,
      replies: [],
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const newReply: Reply = {
            id: `${commentId}-${comment.replies.length + 1}`,
            author: "You",
            avatar: "/self.png?height=32&width=32",
            content: replyContent,
            timestamp: "Just now",
            likes: 0,
            liked: false,
          };
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return comment;
      })
    );

    setReplyingTo(null);
    setReplyContent("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Comments</h2>
      
      <form onSubmit={handleAddComment} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Image
              src="/self.png?height=40&width=40"
              alt="Your avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="flex-grow">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-black/[.08] dark:border-white/[.145] pb-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={comment.avatar}
                  alt={`${comment.author}'s avatar`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="mt-1">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-sm"
                  >
                    <span className={comment.liked ? "text-blue-500" : ""}>
                      {comment.liked ? "Liked" : "Like"}
                    </span>
                    <span className="text-gray-500">({comment.likes})</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-sm"
                  >
                    Reply
                  </button>
                </div>

                {replyingTo === comment.id && (
                  <div className="mt-3">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0">
                        <Image
                          src="/self.png?height=32&width=32"
                          alt="Your avatar"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex-grow">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full p-2 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
                          rows={2}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleAddReply(comment.id)}
                            className="rounded-full bg-foreground text-background px-3 py-1 text-xs font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {comment.replies.length > 0 && (
                  <div className="mt-4 pl-6 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <div className="flex-shrink-0">
                          <Image
                            src={reply.avatar}
                            alt={`${reply.author}'s avatar`}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{reply.author}</span>
                            <span className="text-xs text-gray-500">{reply.timestamp}</span>
                          </div>
                          <p className="mt-1 text-sm">{reply.content}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <button
                              onClick={() => handleLike(comment.id, reply.id)}
                              className="flex items-center gap-1 text-xs"
                            >
                              <span className={reply.liked ? "text-blue-500" : ""}>
                                {reply.liked ? "Liked" : "Like"}
                              </span>
                              <span className="text-gray-500">({reply.likes})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
