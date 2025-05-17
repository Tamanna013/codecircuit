"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type Interest = {
  id: string;
  name: string;
};

export default function ProfileEditor() {
  const [name, setName] = useState("Tamanna");
  const [bio, setBio] = useState("I'm a software developer interested in UI/UX design and web technologies.");
  const [avatarSrc, setAvatarSrc] = useState("/self.png?height=120&width=120");
  const [interests, setInterests] = useState<Interest[]>([
    { id: "1", name: "Technology" },
    { id: "2", name: "Design" },
    { id: "3", name: "Photography" }
  ]);
  const [newInterest, setNewInterest] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarSrc(imageUrl);
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      const newInterestItem = {
        id: Date.now().toString(),
        name: newInterest.trim()
      };
      setInterests([...interests, newInterestItem]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (id: string) => {
    setInterests(interests.filter(interest => interest.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Edit Your Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
     
        <div className="flex flex-col items-center">
          <div 
            className="relative cursor-pointer group"
            onClick={handleAvatarClick}
          >
            <Image
              src={avatarSrc}
              alt="Profile avatar"
              width={120}
              height={120}
              className="rounded-full object-cover border-2 border-black/[.08] dark:border-white/[.145]"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">Change Photo</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Click to upload a new photo</p>
        </div>
        
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full p-2 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          />
        </div>
        
        
        <div>
          <label htmlFor="interests" className="block text-sm font-medium mb-1">
            Interests
          </label>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {interests.map(interest => (
              <div 
                key={interest.id}
                className="bg-[#f2f2f2] dark:bg-[#1a1a1a] px-3 py-1 rounded-full flex items-center gap-1 text-sm"
              >
                <span>{interest.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest.id)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              id="interests"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add an interest"
              className="flex-grow p-2 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Press Enter to add quickly</p>
        </div>
        
    
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-2 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
