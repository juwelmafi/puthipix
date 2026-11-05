"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ChatUser {
  _id: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface ChatContextType {
  isOpen: boolean;
  activeConversationId: string | null;
  targetUser: ChatUser | null;
  unreadCount: number;
  openChat: (conversationId?: string) => void;
  openChatWithUser: (user: ChatUser) => void;
  closeChat: () => void;
  refreshUnread: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType>({
  isOpen: false,
  activeConversationId: null,
  targetUser: null,
  unreadCount: 0,
  openChat: () => {},
  openChatWithUser: () => {},
  closeChat: () => {},
  refreshUnread: async () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<ChatUser | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    try {
      const res = await fetch("/api/messages/unread-count");
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.unreadCount === "number") {
          setUnreadCount(data.unreadCount);
        }
      }
    } catch {
      // Quiet fail
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 25000);
    return () => clearInterval(interval);
  }, []);

  const openChat = (conversationId?: string) => {
    if (conversationId) {
      setActiveConversationId(conversationId);
      setTargetUser(null);
    }
    setIsOpen(true);
  };

  const openChatWithUser = (user: ChatUser) => {
    setTargetUser(user);
    setActiveConversationId(null);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    fetchUnread();
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        activeConversationId,
        targetUser,
        unreadCount,
        openChat,
        openChatWithUser,
        closeChat,
        refreshUnread: fetchUnread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}

