"use client";
import { useState, useEffect } from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import styles from "./ChatWidget.module.css";

interface ConversationLogDetail {
  id: string;
  conversationId: string;
  model: string;
  userQuestion: string;
  aiResponse: string;
  type: "good" | "bad";
}

interface ConversationLogDetailProps {
  conversationId: string;
}

export function ConversationLogDetail({ conversationId }: ConversationLogDetailProps) {
  const [conversation, setConversation] = useState<ConversationLogDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate loading conversation details
    const loadConversationDetails = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data for conversation detail
    const mockMessages: ConversationLogDetail[] = [
        {
          id: conversationId,
          conversationId: "987XYZOOJJ",
          model: "gpt-4o is using",
          userQuestion:
            "Every time I run my test suite in Katalon Studio, it crashes at the same step with an 'Element not found' error, even though the element is clearly visible in the DOM. I've tried using wait commands but it still fails.",
          aiResponse:
            "I'm sorry, I couldn't resolve this issue at the moment. I've drafted a support ticket based on your query. Please review the details below, and if everything looks good, click 'Confirm & Send Ticket' to submit it to our support team.",
          type: "good",
        },
        {
          id:  conversationId,
          conversationId: "987XYZOOJJ",
          model: "Claude 3 is using",
          userQuestion:
            "Every time I run my test suite in Katalon Studio, it crashes at the same step with an 'Element not found' error, even though the element is clearly visible in the DOM. I've tried using wait commands but it still fails.",
          aiResponse:
            "I'm sorry, I couldn't resolve this issue at the moment. I've drafted a support ticket based on your query. Please review the details below, and if everything looks good, click 'Confirm & Send Ticket' to submit it to our support team.",
          type: "bad",
        },
      ];

      setConversation(mockMessages);
      setIsLoading(false);
    };

    loadConversationDetails();
  }, [conversationId]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation || conversation.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Conversation not found</p>
        </div>
      </div>
    );
  }

  // Filter messages by search term
  const filteredMessages = conversation.filter(
    (msg) =>
      msg.userQuestion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.aiResponse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 space-y-8 md:mx-32">
      <div className="flex-1 relative mb-8">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#F9F9FA]"
        />
      </div>

      {filteredMessages.map((msg, idx) => (
        <div key={idx} className="space-y-4">
          {/* Model label */}
            <div className="flex justify-end">
            <span className="text-md text-gray-600">{msg.model}</span>
            </div>

          {/* User message */}
            <div className="flex justify-end">
            <div className={styles.message}>
                {msg.userQuestion}
            </div>
            </div>

          {/* AI response */}
            <div className="flex items-start gap-4 mt-4">
                <Image src="/katalon-logo.jpg" alt="User" width={32} height={32} className={styles.logo}/>
                <p className="text-black">{msg.aiResponse}</p>
            </div>
            <div className="flex items-start gap-2 mt-4">
                <div className="mt-2">
                {msg.type === "good" ? (
                    <div className="flex items-center gap-2 text-green-600 font-normal">
                        <div className="border border-green-600 rounded-full p-1.5 bg-green-600 text-white">
                            <AiOutlineLike />
                        </div>
                        Good response
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-2 text-red-600 font-normal">
                            <div className="border border-red-600 rounded-full p-1.5 bg-red-600 text-white">
                                <AiOutlineDislike />
                            </div>
                            Bad response
                        </div>
                        <div className="mt-4 border border-red-600 rounded-md p-2 bg-gray-100">Inappropriate response/Offensive</div>
                    </div>
                   
                )}
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}
