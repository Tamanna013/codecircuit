"use client";

import { useState } from "react";
import Image from "next/image";

type Vote = "up" | "down" | null;

type Answer = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  userVote: Vote;
  isAccepted: boolean;
};

type Question = {
  id: string;
  title: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote: Vote;
  answers: Answer[];
  views: number;
};

export default function QABoard() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      title: "How do I implement real-time updates with React and WebSockets?",
      author: "Alex Johnson",
      avatar: "/q10.png?height=40&width=40",
      content: "I'm building a chat application and need to implement real-time updates. What's the best approach using React and WebSockets? I've tried using the useEffect hook but I'm running into issues with connection management.",
      timestamp: "2 days ago",
      tags: ["react", "websockets", "real-time"],
      upvotes: 24,
      downvotes: 2,
      userVote: null,
      answers: [
        {
          id: "a1",
          author: "Jamie Smith",
          avatar: "/q11.png?height=40&width=40",
          content: "I recommend using the `useWebSocket` hook from the react-use-websocket library. It handles connection management and reconnection logic for you. Here's a basic example:\n\n```jsx\nimport useWebSocket from 'react-use-websocket';\n\nfunction Chat() {\n  const { lastMessage, sendMessage } = useWebSocket('wss://your-websocket-server');\n  // Rest of your component\n}```",
          timestamp: "1 day ago",
          upvotes: 15,
          downvotes: 0,
          userVote: null,
          isAccepted: true,
        },
        {
          id: "a2",
          author: "Taylor Brown",
          avatar: "/q12.png?height=40&width=40",
          content: "You could also use Socket.IO which provides additional features like automatic reconnection and room support. It works well with React and has good documentation.",
          timestamp: "1 day ago",
          upvotes: 8,
          downvotes: 1,
          userVote: null,
          isAccepted: false,
        }
      ],
      views: 156,
    },
    {
      id: "2",
      title: "Best practices for state management in large React applications?",
      author: "Jordan Lee",
      avatar: "/q13.png?height=40&width=40",
      content: "I'm working on a large-scale React application and I'm trying to decide on the best approach for state management. Should I use Redux, Context API, or one of the newer libraries like Zustand or Jotai? What are the pros and cons of each approach?",
      timestamp: "3 days ago",
      tags: ["react", "state-management", "redux"],
      upvotes: 32,
      downvotes: 1,
      userVote: null,
      answers: [
        {
          id: "a3",
          author: "Casey Wilson",
          avatar: "/q13.png?height=40&width=40",
          content: "It really depends on your specific needs. Redux is great for complex state with many interactions, but has more boilerplate. Context API is built-in but can cause performance issues with frequent updates. Zustand is a good middle ground with a simple API but powerful capabilities.",
          timestamp: "2 days ago",
          upvotes: 18,
          downvotes: 2,
          userVote: null,
          isAccepted: false,
        }
      ],
      views: 203,
    },
    {
      id: "3",
      title: "How to optimize Next.js image loading for better performance?",
      author: "Riley Martinez",
      avatar: "/q1.png?height=40&width=40",
      content: "I'm noticing some performance issues with image loading in my Next.js application. What are some best practices for optimizing image loading and improving Core Web Vitals scores?",
      timestamp: "1 week ago",
      tags: ["next.js", "performance", "images"],
      upvotes: 41,
      downvotes: 0,
      userVote: null,
      answers: [
        {
          id: "a4",
          author: "Alex Johnson",
          avatar: "/q2.png?height=40&width=40",
          content: "Next.js has a built-in Image component that automatically optimizes images. Make sure you're using the `next/image` component instead of the standard HTML `<img>` tag. Also, set appropriate 'sizes' props for responsive images and consider using the 'priority' prop for above-the-fold images.",
          timestamp: "6 days ago",
          upvotes: 27,
          downvotes: 0,
          userVote: null,
          isAccepted: true,
        }
      ],
      views: 312,
    }
  ]);

  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "activity">("newest");
  const [newAnswer, setNewAnswer] = useState("");

  const allTags = Array.from(
    new Set(questions.flatMap(question => question.tags))
  ).sort();

  const filteredQuestions = activeTag
    ? questions.filter(question => question.tags.includes(activeTag))
    : questions;

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === "newest") {
      return parseInt(b.id) - parseInt(a.id);
    } else if (sortBy === "votes") {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    } else {
      const aLatestAnswer = a.answers.length > 0 ? Math.max(...a.answers.map(ans => parseInt(ans.id.substring(1)))) : 0;
      const bLatestAnswer = b.answers.length > 0 ? Math.max(...b.answers.map(ans => parseInt(ans.id.substring(1)))) : 0;
      return bLatestAnswer - aLatestAnswer;
    }
  });

  const handleVote = (questionId: string, answerId: string | null, voteType: Vote) => {
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        if (answerId === null) {
          let updatedUpvotes = question.upvotes;
          let updatedDownvotes = question.downvotes;
          
          if (question.userVote === "up") updatedUpvotes--;
          if (question.userVote === "down") updatedDownvotes--;
          
          if (voteType !== question.userVote) {
            if (voteType === "up") updatedUpvotes++;
            if (voteType === "down") updatedDownvotes++;
          }
          
          return {
            ...question,
            upvotes: updatedUpvotes,
            downvotes: updatedDownvotes,
            userVote: question.userVote === voteType ? null : voteType
          };
        } else {
          return {
            ...question,
            answers: question.answers.map(answer => {
              if (answer.id === answerId) {
                let updatedUpvotes = answer.upvotes;
                let updatedDownvotes = answer.downvotes;
                
                if (answer.userVote === "up") updatedUpvotes--;
                if (answer.userVote === "down") updatedDownvotes--;
                
                if (voteType !== answer.userVote) {
                  if (voteType === "up") updatedUpvotes++;
                  if (voteType === "down") updatedDownvotes++;
                }
                
                return {
                  ...answer,
                  upvotes: updatedUpvotes,
                  downvotes: updatedDownvotes,
                  userVote: answer.userVote === voteType ? null : voteType
                };
              }
              return answer;
            })
          };
        }
      }
      return question;
    }));
  };

  const handleAcceptAnswer = (questionId: string, answerId: string) => {
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        return {
          ...question,
          answers: question.answers.map(answer => ({
            ...answer,
            isAccepted: answer.id === answerId
          }))
        };
      }
      return question;
    }));
  };

  const handleSubmitAnswer = (questionId: string) => {
    if (newAnswer.trim()) {
      const newAnswerId = `a${Math.max(...questions.flatMap(q => q.answers.map(a => parseInt(a.id.substring(1))))) + 1}`;
      
      setQuestions(questions.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: [
              ...question.answers,
              {
                id: newAnswerId,
                author: "You",
                avatar: "/self.png?height=40&width=40",
                content: newAnswer.trim(),
                timestamp: "Just now",
                upvotes: 0,
                downvotes: 0,
                userVote: null,
                isAccepted: false,
              }
            ]
          };
        }
        return question;
      }));
      
      setNewAnswer("");
    }
  };

  const selectedQuestion = activeQuestion 
    ? questions.find(q => q.id === activeQuestion) 
    : null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Q&A Board</h2>
        <button className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium">
          Ask a Question
        </button>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1 text-xs rounded-full ${
            activeTag === null
              ? "bg-foreground text-background"
              : "border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
          }`}
        >
          All Tags
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 text-xs rounded-full ${
              activeTag === tag
                ? "bg-foreground text-background"
                : "border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "votes" | "activity")}
            className="text-sm p-1 border border-black/[.08] dark:border-white/[.145] rounded bg-background"
          >
            <option value="newest">Newest</option>
            <option value="votes">Most Votes</option>
            <option value="activity">Recent Activity</option>
          </select>
        </div>
      </div>
      
      {!activeQuestion ? (
        <div className="space-y-4">
          {sortedQuestions.map(question => (
            <div 
              key={question.id} 
              className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setActiveQuestion(question.id)}
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                  <div className="text-xl font-bold">{question.upvotes - question.downvotes}</div>
                  <div className="text-xs text-gray-500">votes</div>
                  <div className="text-sm mt-2">{question.answers.length}</div>
                  <div className="text-xs text-gray-500">answers</div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-medium mb-2">{question.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                    {question.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {question.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-[#f2f2f2] dark:bg-[#1a1a1a] text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Image
                        src={question.avatar}
                        alt={`${question.author}'s avatar`}
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                      <span>{question.author}</span>
                      <span>asked {question.timestamp}</span>
                    </div>
                    <div>{question.views} views</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        selectedQuestion && (
          <div>
            <button 
              onClick={() => setActiveQuestion(null)}
              className="flex items-center gap-1 text-sm mb-4 hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to questions
            </button>
            
            <div className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-4 mb-6">
              <div className="flex gap-4">
  
                <div className="flex flex-col items-center gap-2">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleVote(selectedQuestion?.id, null, "up");
                  }}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  selectedQuestion?.userVote === "up"
                  ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                  : "hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                  
                  <div className="text-center font-medium">
                    {selectedQuestion.upvotes - selectedQuestion.downvotes}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(selectedQuestion.id, null, "down");
                    }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      selectedQuestion.userVote === "down" 
                        ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" 
                        : "hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2">{selectedQuestion.title}</h3>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
                    {selectedQuestion.content}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedQuestion.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-[#f2f2f2] dark:bg-[#1a1a1a] text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-black/[.08] dark:border-white/[.145] pt-3">
                    <div className="flex items-center gap-2">
                      <span>{selectedQuestion.views} views</span>
                      <span>•</span>
                      <span>asked {selectedQuestion.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src={selectedQuestion.avatar}
                        alt={`${selectedQuestion.author}'s avatar`}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span>{selectedQuestion.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">
                {selectedQuestion.answers.length} {selectedQuestion.answers.length === 1 ? 'Answer' : 'Answers'}
              </h4>
              
              <div className="space-y-6">
                {selectedQuestion.answers.map(answer => (
                  <div 
                    key={answer.id} 
                    className={`border border-black/[.08] dark:border-white/[.145] rounded-lg p-4 ${
                      answer.isAccepted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <button 
                          onClick={() => handleVote(selectedQuestion.id, answer.id, "up")}
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            answer.userVote === "up" 
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" 
                              : "hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                          </svg>
                        </button>
                        
                        <div className="text-center font-medium">
                          {answer.upvotes - answer.downvotes}
                        </div>
                        
                        <button 
                          onClick={() => handleVote(selectedQuestion.id, answer.id, "down")}
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            answer.userVote === "down" 
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" 
                              : "hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                        
                        {answer.isAccepted && (
                          <div className="text-green-600 dark:text-green-400 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Answer content */}
                      <div className="flex-grow">
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
                          {answer.content}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div>
                            answered {answer.timestamp}
                          </div>
                          <div className="flex items-center gap-2">
                            <Image
                              src={answer.avatar}
                              alt={`${answer.author}'s avatar`}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <span>{answer.author}</span>
                            
                            {!answer.isAccepted && selectedQuestion.author === "You" && (
                              <button 
                                onClick={() => handleAcceptAnswer(selectedQuestion.id, answer.id)}
                                className="ml-2 text-green-600 dark:text-green-400 hover:underline"
                              >
                                Accept answer
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Your Answer</h4>
              
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full p-3 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 mb-4"
                rows={6}
              />
              
              <div className="flex justify-end">
                <button
                  onClick={() => handleSubmitAnswer(selectedQuestion.id)}
                  disabled={!newAnswer.trim()}
                  className={`bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium ${
                    !newAnswer.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Post Your Answer
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
