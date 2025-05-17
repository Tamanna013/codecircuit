"use client";

import { useState } from "react";
import Image from "next/image";

type AttendanceStatus = "going" | "maybe" | "not-going" | null;

type Attendee = {
  id: string;
  name: string;
  avatar: string;
  status: AttendanceStatus;
};

export default function EventRSVP() {
  const [status, setStatus] = useState<AttendanceStatus>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: "1", name: "Alex Johnson", avatar: "/q1.png?height=32&width=32", status: "going" },
    { id: "2", name: "Jamie Smith", avatar: "/q2.png?height=32&width=32", status: "going" },
    { id: "3", name: "Taylor Brown", avatar: "/q3.png?height=32&width=32", status: "maybe" },
    { id: "4", name: "Casey Wilson", avatar: "/q4.png?height=32&width=32", status: "not-going" },
    { id: "5", name: "Jordan Lee", avatar: "/q5.png?height=32&width=32", status: "going" },
  ]);

  const handleRSVP = (newStatus: AttendanceStatus) => {
    setStatus(newStatus);
    
    if (!attendees.some(a => a.name === "You")) {
      setAttendees([
        ...attendees,
        { 
          id: "user", 
          name: "You", 
          avatar: "/self.png?height=32&width=32", 
          status: newStatus 
        }
      ]);
    } else {
      setAttendees(attendees.map(a => 
        a.name === "You" ? { ...a, status: newStatus } : a
      ));
    }
  };

  const getStatusCounts = () => {
    return {
      going: attendees.filter(a => a.status === "going").length,
      maybe: attendees.filter(a => a.status === "maybe").length,
      notGoing: attendees.filter(a => a.status === "not-going").length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] overflow-hidden">
        <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
          <Image
            src="/e1.jpg?height=200&width=600"
            alt="Event cover"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Annual Tech Conference 2025</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Join us for the biggest tech event of the year!
              </p>
            </div>
            <div className="bg-foreground text-background px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Saturday, December 15, 2025 • 10:00 AM - 6:00 PM</span>
          </div>
          
          <div className="mt-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Tech Convention Center, 123 Innovation St.</span>
          </div>
          
          <div className="mt-6">
            <div className="flex gap-3">
              <button
                onClick={() => handleRSVP("going")}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                  status === "going"
                    ? "bg-green-500 text-white"
                    : "border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                }`}
              >
                Going ({counts.going})
              </button>
              <button
                onClick={() => handleRSVP("maybe")}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                  status === "maybe"
                    ? "bg-yellow-500 text-white"
                    : "border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                }`}
              >
                Maybe ({counts.maybe})
              </button>
              <button
                onClick={() => handleRSVP("not-going")}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                  status === "not-going"
                    ? "bg-red-500 text-white"
                    : "border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                }`}
              >
                Not Going ({counts.notGoing})
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-3">Attendees</h3>
            <div className="flex flex-wrap gap-2">
              {attendees
                .filter(a => a.status === "going" || a.status === "maybe")
                .map(attendee => (
                  <div 
                    key={attendee.id} 
                    className="flex items-center gap-2 bg-[#f9f9f9] dark:bg-[#111] px-3 py-1 rounded-full"
                  >
                    <Image
                      src={attendee.avatar}
                      alt={`${attendee.name}'s avatar`}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm">{attendee.name}</span>
                    {attendee.status === "maybe" && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                        Maybe
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
