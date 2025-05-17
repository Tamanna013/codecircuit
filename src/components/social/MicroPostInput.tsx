"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const MAX_CHARS = 280;

export default function MicroPostInput() {
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [charCount, setCharCount] = useState(MAX_CHARS);

  useEffect(() => {
    setCharCount(MAX_CHARS - content.length);
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && content.length <= MAX_CHARS) {
      alert("Post submitted: " + content);
      setContent("");
      setIsPreviewMode(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Create Micro Post</h2>
      
      <div className="bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] p-4">
        <div className="flex items-start gap-3 mb-4">
          <Image
            src="/self.pngg?height=48&width=48"
            alt="Your avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="flex-grow">
            <div className="font-medium">Tamanna</div>
            <div className="text-sm text-gray-500">@sasstash</div>
          </div>
        </div>

        {!isPreviewMode ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-3 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 mb-2"
              rows={4}
              maxLength={MAX_CHARS}
            />
            
            <div className="flex items-center justify-between">
              <div className={`text-sm ${charCount < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount} characters remaining
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(true)}
                  className="rounded-full border border-black/[.08] dark:border-white/[.145] px-4 py-2 text-sm font-medium hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || content.length > MAX_CHARS}
                  className={`rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium transition-colors ${
                    !content.trim() || content.length > MAX_CHARS
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#383838] dark:hover:bg-[#ccc]"
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-4">
            <div className="bg-[#f9f9f9] dark:bg-[#111] p-4 rounded-lg mb-4">
              <p className="whitespace-pre-wrap">{content}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="rounded-full border border-black/[.08] dark:border-white/[.145] px-4 py-2 text-sm font-medium hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-muted/30 dark:bg-muted/10 p-4 rounded-xl border border-black/[.05] dark:border-white/[.1]">
        <h3 className="font-semibold text-lg mb-3">Formatting Tips</h3>
        <ul className="text-sm text-foreground/80 space-y-2 pl-4 list-disc">
          <li><strong>#</strong> — Use for headings (e.g. <code># Title</code>)</li>
          <li><strong>*italic*</strong> — Wrap with asterisks for italic text</li>
          <li><strong>**bold**</strong> — Use double asterisks for bold text</li>
          <li><strong>[text](url)</strong> — Add clickable links</li>
        </ul>
      </div>
    </div>
  );
}
