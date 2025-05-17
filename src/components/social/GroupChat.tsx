"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Message = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
};

type User = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isTyping: boolean;
};

export default function GroupChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      author: "Alex Johnson",
      avatar: "/q5.png?height=40&width=40",
      content: "Hey everyone! How's it going?",
      timestamp: "10:32 AM",
      isCurrentUser: false,
    },
    {
      id: "2",
      author: "Jamie Smith",
      avatar: "/q6.png?height=40&width=40",
      content: "Pretty good!",
      timestamp: "10:33 AM",
      isCurrentUser: false,
    },
    {
      id: "3",
      author: "You",
      avatar: "/self.png?height=40&width=40",
      content: "I'm excited to see the new updates!",
      timestamp: "10:34 AM",
      isCurrentUser: true,
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/q5.png?height=40&width=40",
      isOnline: true,
      isTyping: false,
    },
    {
      id: "2",
      name: "Jamie Smith",
      avatar: "/q6.png?height=40&width=40",
      isOnline: true,
      isTyping: true,
    },
    {
      id: "3",
      name: "Taylor Brown",
      avatar: "/q7.png?height=40&width=40",
      isOnline: false,
      isTyping: false,
    },
    {
      id: "4",
      name: "You",
      avatar: "/self.png?height=40&width=40",
      isOnline: true,
      isTyping: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (users.some(user => user.isTyping)) {
        const typingUser = users.find(user => user.isTyping);
        if (typingUser) {
          const newMsg: Message = {
            id: Date.now().toString(),
            author: typingUser.name,
            avatar: typingUser.avatar,
            content: "I just finished my 9 to 5",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCurrentUser: false,
          };
          
          setMessages(prev => [...prev, newMsg]);
          setUsers(prev => prev.map(user => 
            user.id === typingUser.id ? { ...user, isTyping: false } : user
          ));
        }
      }
    }, 3000);

    return () => clearTimeout(typingTimeout);
  }, [users]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    
    if (isTyping) {
      // Update your typing status
      setUsers(prev => prev.map(user => 
        user.name === "You" ? { ...user, isTyping: true } : user
      ));
      
      // Clear typing status after delay
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        setUsers(prev => prev.map(user => 
          user.name === "You" ? { ...user, isTyping: false } : user
        ));
      }, 2000);
    }
    
    return () => clearTimeout(typingTimer);
  }, [isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        author: "You",
        avatar: "/self.png?height=40&width=40",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      setIsTyping(false);
      setUsers(prev => prev.map(user => 
        user.name === "You" ? { ...user, isTyping: false } : user
      ));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Group Chat</h2>
      
      <div className="flex h-[500px] border border-black/[.08] dark:border-white/[.145] rounded-lg overflow-hidden">
        <div className="w-1/4 bg-[#f9f9f9] dark:bg-[#111] border-r border-black/[.08] dark:border-white/[.145] overflow-y-auto">
          <div className="p-3 border-b border-black/[.08] dark:border-white/[.145]">
            <h3 className="font-medium text-sm">Team Chat</h3>
            <p className="text-xs text-gray-500">{users.filter(u => u.isOnline).length} online</p>
          </div>
          
          <div className="p-2">
            {users.map(user => (
              <div key={user.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]">
                <div className="relative">
                  <Image
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#f9f9f9] dark:border-[#111] ${
                    user.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}></span>
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-medium">{user.name}</div>
                  {user.isTyping && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="typing-indicator">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </span>
                      typing...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex-grow flex flex-col">
          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isCurrentUser && (
                  <div className="flex-shrink-0 mr-2">
                    <Image
                      src={message.avatar}
                      alt={`${message.author}'s avatar`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                )}
                
                <div className={`max-w-[70%] ${message.isCurrentUser ? 'order-1' : 'order-2'}`}>
                  {!message.isCurrentUser && (
                    <div className="text-xs text-gray-500 mb-1">{message.author}</div>
                  )}
                  
                  <div className={`p-3 rounded-lg ${
                    message.isCurrentUser 
                      ? 'bg-foreground text-background rounded-tr-none' 
                      : 'bg-[#f2f2f2] dark:bg-[#1a1a1a] rounded-tl-none'
                  }`}>
                    <p>{message.content}</p>
                  </div>
                  
                  <div className={`text-xs text-gray-500 mt-1 ${
                    message.isCurrentUser ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp}
                  </div>
                </div>
                
                {message.isCurrentUser && (
                  <div className="flex-shrink-0 ml-2">
                    <Image
                      src={message.avatar}
                      alt={`${message.author}'s avatar`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="px-4">
            {users.some(user => user.isTyping && user.name !== "You") && (
              <div className="text-xs text-gray-500 mb-2">
                {users.filter(user => user.isTyping && user.name !== "You").map(user => user.name).join(", ")} typing...
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-black/[.08] dark:border-white/[.145]">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-grow p-2 border border-black/[.08] dark:border-white/[.145] rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className={`rounded-full bg-foreground text-background p-2 ${
                  !newMessage.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          margin-right: 4px;
        }
        
        .typing-indicator .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #6b7280;
          margin-right: 2px;
          animation: typing-bounce 1.4s infinite ease-in-out both;
        }
        
        .typing-indicator .dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-indicator .dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes typing-bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          }
          40% { 
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
