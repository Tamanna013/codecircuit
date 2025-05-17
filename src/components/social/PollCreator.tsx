"use client";

import { useState } from "react";

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

export default function PollCreator() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<PollOption[]>([
    { id: "1", text: "", votes: 0 },
    { id: "2", text: "", votes: 0 }
  ]);
  const [duration, setDuration] = useState("1d");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [userVoted, setUserVoted] = useState<string | null>(null);
  const [colors] = useState<string[]>([
    "#4285F4", "#EA4335", "#FBBC05", "#34A853", 
    "#FF6D01", "#46BDC6", "#7B61FF", "#1DA462"
  ]);

  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions([...options, { id: `${options.length + 1}`, text: "", votes: 0 }]);
    }
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const handleVote = (id: string) => {
    if (userVoted) return;
    
    setOptions(options.map(option => 
      option.id === id ? { ...option, votes: option.votes + 1 } : option
    ));
    setUserVoted(id);
  };

  const handleCreatePoll = () => {
    if (question.trim() === "" || options.some(option => option.text.trim() === "")) {
      alert("Please fill in the question and all options");
      return;
    }
    
    setIsPreviewMode(true);
    
    if (options.every(option => option.votes === 0)) {
      setOptions(options.map(option => ({
        ...option,
        votes: Math.floor(Math.random() * 10) + 1
      })));
    }
  };

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  const calculatePieSegments = () => {
    if (totalVotes === 0) return [];
    
    let currentAngle = 0;
    return options.map((option, index) => {
      const percentage = option.votes / totalVotes;
      const startAngle = currentAngle;
      const endAngle = currentAngle + percentage * 360;
      currentAngle = endAngle;
      
      return {
        option,
        percentage,
        startAngle,
        endAngle,
        color: colors[index % colors.length]
      };
    });
  };

  const pieSegments = calculatePieSegments();

  const getSegmentPath = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return `M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Poll Creator</h2>
      
      {!isPreviewMode ? (
        <div className="bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] p-6">
          <div className="mb-4">
            <label htmlFor="question" className="block text-sm font-medium mb-1">
              Question
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full p-3 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Options
            </label>
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-grow p-2 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => handleRemoveOption(option.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            {options.length < 8 && (
              <button
                onClick={handleAddOption}
                className="text-sm text-blue-500 hover:text-blue-700 mt-2 flex items-center gap-1"
              >
                <span>+</span> Add Option
              </button>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="duration" className="block text-sm font-medium mb-1">
              Poll Duration
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 border border-black/[.08] dark:border-white/[.145] rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
            >
              <option value="1h">1 hour</option>
              <option value="6h">6 hours</option>
              <option value="12h">12 hours</option>
              <option value="1d">1 day</option>
              <option value="3d">3 days</option>
              <option value="7d">7 days</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleCreatePoll}
              className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            >
              Create Poll
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-background rounded-lg border border-black/[.08] dark:border-white/[.145] p-6">
          <h3 className="text-lg font-bold mb-4">{question}</h3>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2">
              {options.map((option, index) => (
                <div key={option.id} className="mb-3">
                  <button
                    onClick={() => handleVote(option.id)}
                    disabled={userVoted !== null}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      userVoted === option.id
                        ? "bg-[#e6f7ff] dark:bg-[#003a70] border-2 border-[#4285F4]"
                        : "border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.text}</span>
                      {userVoted !== null && (
                        <span className="text-sm">
                          {Math.round((option.votes / totalVotes) * 100)}%
                        </span>
                      )}
                    </div>
                    
                    {userVoted !== null && (
                      <div className="mt-2 h-2 bg-[#f2f2f2] dark:bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(option.votes / totalVotes) * 100}%`,
                            backgroundColor: colors[index % colors.length]
                          }}
                        ></div>
                      </div>
                    )}
                  </button>
                </div>
              ))}
              
              <div className="text-sm text-gray-500 mt-2">
                {totalVotes} votes • {duration === "1h" ? "1 hour" : 
                                     duration === "6h" ? "6 hours" : 
                                     duration === "12h" ? "12 hours" : 
                                     duration === "1d" ? "1 day" : 
                                     duration === "3d" ? "3 days" : "7 days"} remaining
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Edit Poll
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-48 h-48">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  {pieSegments.map((segment, index) => (
                    <path
                      key={index}
                      d={getSegmentPath(segment.startAngle, segment.endAngle, 50)}
                      fill={segment.color}
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  ))}
                </svg>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {pieSegments.map((segment, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      <span className="truncate">{segment.option.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
