"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useChat } from "@/context/ChatContext";
import {
  MessageSquare,
  Send,
  User as UserIcon,
  X,
  Loader2,
  Check,
  CheckCheck,
  ExternalLink,
  Shield,
  Sparkles,
  ArrowLeft,
  Inbox,
} from "lucide-react";

interface ConversationItem {
  _id: string;
  otherUser: {
    _id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface MessageItem {
  _id: string;
  conversation: string;
  sender: string;
  recipient: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export function ChatModal() {
  const {
    isOpen,
    closeChat,
    targetUser,
    activeConversationId: initialConvId,
    refreshUnread,
  } = useChat();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activePartner, setActivePartner] = useState<any>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeChat]);

  // Fetch current user
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [isOpen]);

  // Fetch conversations list
  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {
      console.error("Load conversations error:", e);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      loadConversations();
    }
  }, [isOpen, currentUser]);

  // Target User or Initial Conv handling
  useEffect(() => {
    if (!isOpen || !currentUser) return;

    if (targetUser && targetUser._id) {
      // Find or start conversation with targetUser
      setActivePartner(targetUser);
      fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: targetUser._id }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.conversation?._id) {
            setActiveConversationId(data.conversation._id);
            if (data.conversation.otherUser) {
              setActivePartner(data.conversation.otherUser);
            }
            loadConversations();
          }
        })
        .catch((err) => console.error("Init target conv error:", err));
    } else if (initialConvId) {
      setActiveConversationId(initialConvId);
    }
  }, [isOpen, currentUser, targetUser, initialConvId]);

  // Load messages for active conversation
  const loadMessages = async (convId: string, isSilent = false) => {
    if (!isSilent) setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        if (data.otherUser) {
          setActivePartner(data.otherUser);
        }
      }
    } catch (e) {
      console.error("Load messages error:", e);
    } finally {
      if (!isSilent) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId, false);
      refreshUnread();
    }
  }, [activeConversationId]);

  // Live polling for active messages (every 3.5s)
  useEffect(() => {
    if (!isOpen || !activeConversationId) return;
    const interval = setInterval(() => {
      loadMessages(activeConversationId, true);
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen, activeConversationId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversationId || isSending) return;

    const textToSend = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      const res = await fetch(`/api/messages/conversations/${activeConversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        loadConversations();
      }
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString("bn-BD", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl h-[90vh] sm:h-[82vh] max-h-[720px] bg-[#f4f2e4] border-3 border-[#171717] shadow-2xl flex flex-col overflow-hidden font-serif-bengali">
        {/* Modal Top Masthead Header */}
        <div className="px-4 py-3 bg-[#e8e6d3] border-b-2 border-[#171717] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8a493b] text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 id="chat-modal-title" className="font-bold text-sm sm:text-base text-[#171717] leading-tight">
                মহাফেজখানা ডাকঘর ও পত্রালাপ
              </h3>
              <p className="text-[10px] sm:text-[11px] font-mono-meta text-[#7a776e]">
                সহপাঠকদের সাথে ব্যক্তিগত যোগাযোগ ও সাহিত্য বার্তা
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={closeChat}
            className="p-1.5 text-[#53514a] hover:text-[#171717] hover:bg-black/10 rounded-xs transition-colors cursor-pointer"
            title="বন্ধ করুন (Esc)"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!currentUser ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <MessageSquare className="w-12 h-12 text-[#8a493b] opacity-50" />
            <h4 className="text-base font-bold text-[#171717]">
              বার্তা পাঠাতে অ্যাকাউন্টে প্রবেশ করুন
            </h4>
            <p className="text-xs text-[#53514a] max-w-sm">
              পাঠকদের সাথে পত্রবিনিময়ের জন্য আপনার অ্যাকাউন্ট প্রয়োজন।
            </p>
            <Link
              href="/login"
              onClick={closeChat}
              className="px-5 py-2 bg-[#171717] text-[#eeeddb] font-bold text-xs hover:bg-[#8a493b] transition-colors border border-black"
            >
              লগইন করুন →
            </Link>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden bg-[#f4f2e4]">
            {/* Left Column: Conversations List */}
            <div
              className={`md:col-span-5 lg:col-span-4 border-r-2 border-[#171717] flex flex-col bg-[#eeeddb] min-h-0 ${
                activeConversationId ? "hidden md:flex" : "flex"
              }`}
            >
              <div className="p-3 bg-[#e8e6d3] border-b border-black/15 flex items-center justify-between text-xs">
                <span className="font-bold text-[#171717]">পূর্ববর্তী আলাপচারিতা</span>
                <span className="text-[10px] font-mono-meta px-1.5 py-0.2 bg-[#ede9d6] border border-black/15 font-bold">
                  {conversations.length} টি
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-black/10">
                {loadingConversations ? (
                  <div className="p-6 text-center text-xs text-[#7a776e] space-y-2">
                    <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                    <span>তালিকা লোড হচ্ছে...</span>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center space-y-2 text-[#7a776e]">
                    <Inbox className="w-7 h-7 mx-auto opacity-30 text-[#8a493b]" />
                    <p className="text-xs font-bold text-[#171717]">কোনো বার্তা নেই</p>
                    <p className="text-[10px] text-[#53514a]">
                      পাঠকের প্রোফাইলে গিয়ে “বার্তা পাঠান” বাটনে ক্লিক করুন।
                    </p>
                  </div>
                ) : (
                  conversations.map((c) => {
                    const isActive = c._id === activeConversationId;
                    return (
                      <div
                        key={c._id}
                        onClick={() => {
                          setActiveConversationId(c._id);
                          setActivePartner(c.otherUser);
                        }}
                        className={`p-3 transition-colors cursor-pointer flex items-center gap-2.5 ${
                          isActive
                            ? "bg-[#ede9d6] border-l-4 border-l-[#8a493b]"
                            : "hover:bg-[#f4f2e4]"
                        }`}
                      >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-[#171717] text-[#eeeddb] flex items-center justify-center font-bold text-xs shrink-0 border border-black/20 overflow-hidden relative">
                          {c.otherUser.avatar ? (
                            <img
                              src={c.otherUser.avatar}
                              alt={c.otherUser.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            c.otherUser.name?.charAt(0) || "পা"
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#171717] truncate">
                              {c.otherUser.name}
                            </span>
                            {c.unreadCount > 0 && (
                              <span className="w-4 h-4 rounded-full bg-[#8a493b] text-white text-[9px] font-mono-meta font-bold flex items-center justify-center shrink-0">
                                {c.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#53514a] truncate leading-tight">
                            {c.lastMessage || "কথোপকথন শুরু করুন..."}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Active Conversation Canvas */}
            <div
              className={`md:col-span-7 lg:col-span-8 flex flex-col bg-[#f4f2e4] min-h-0 ${
                !activeConversationId ? "hidden md:flex" : "flex"
              }`}
            >
              {activeConversationId && activePartner ? (
                <>
                  {/* Chat Partner Header */}
                  <div className="p-3 bg-[#e8e6d3] border-b-2 border-[#171717] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setActiveConversationId(null)}
                        className="md:hidden p-1 text-[#171717] hover:bg-black/10 rounded-xs"
                        title="তালিকায় ফিরুন"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <div className="w-8 h-8 rounded-full bg-[#171717] text-[#eeeddb] flex items-center justify-center font-bold text-xs shrink-0 border border-black/20 overflow-hidden">
                        {activePartner.avatar ? (
                          <img
                            src={activePartner.avatar}
                            alt={activePartner.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          activePartner.name?.charAt(0) || "পা"
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-[#171717]">
                            {activePartner.name}
                          </span>
                          {activePartner.role === "super_admin" && (
                            <span className="text-[9px] font-mono-meta bg-[#8a493b] text-white px-1.5 py-0.2 rounded-full font-bold">
                              সুপার অ্যাডমিন
                            </span>
                          )}
                          {activePartner.role === "admin" && (
                            <span className="text-[9px] font-mono-meta bg-[#171717] text-[#eeeddb] px-1.5 py-0.2 rounded-full font-bold">
                              অ্যাডমিন
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono-meta text-[#7a776e]">
                          সরাসরি বার্তা ও পত্র
                        </span>
                      </div>
                    </div>

                    {activePartner._id && (
                      <Link
                        href={`/profile/${activePartner._id}`}
                        onClick={closeChat}
                        className="text-xs text-[#8a493b] hover:underline flex items-center gap-1 font-bold"
                        title="প্রোফাইল পরিদর্শন করুন"
                      >
                        <span>প্রোফাইল</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {/* Messages Bubble History */}
                  <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2.5 min-h-0">
                    {loadingMessages ? (
                      <div className="p-8 text-center text-xs text-[#7a776e] space-y-2">
                        <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                        <span>বার্তা লোড হচ্ছে...</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="p-8 text-center space-y-2 text-[#7a776e]">
                        <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-[#8a493b]" />
                        <p className="text-xs font-bold text-[#171717]">
                          এখনও কোনো বার্তা বিনিময় হয়নি
                        </p>
                        <p className="text-[11px] text-[#53514a]">
                          নিচে আপনার প্রথম বার্তাটি লিখে পাঠান।
                        </p>
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isMine =
                          m.sender === currentUser?.userId ||
                          m.sender === currentUser?.id;
                        return (
                          <div
                            key={m._id}
                            className={`flex flex-col ${
                              isMine ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[75%] p-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                                isMine
                                  ? "bg-[#171717] text-[#eeeddb] rounded-xs border border-black shadow-xs"
                                  : "bg-[#ede9d6] text-[#171717] rounded-xs border border-black/15 shadow-xs"
                              }`}
                            >
                              <p>{m.text}</p>
                              <div
                                className={`mt-1 flex items-center justify-end gap-1 text-[9px] font-mono-meta ${
                                  isMine ? "text-[#a8a69a]" : "text-[#7a776e]"
                                }`}
                              >
                                <span>{formatMessageTime(m.createdAt)}</span>
                                {isMine && (
                                  <span>
                                    {m.isRead ? (
                                      <CheckCheck className="w-3 h-3 text-emerald-400 inline" />
                                    ) : (
                                      <Check className="w-3 h-3 inline opacity-70" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Composer */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-2.5 sm:p-3 bg-[#e8e6d3] border-t-2 border-[#171717] flex items-center gap-2 shrink-0"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="আপনার বার্তা বা ভাববিনিময় লিখুন..."
                      className="flex-grow bg-[#eeeddb] border-2 border-[#171717] px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#8a493b]"
                      disabled={isSending}
                    />

                    <button
                      type="submit"
                      disabled={isSending || !inputText.trim()}
                      className="px-4 py-2 bg-[#8a493b] hover:bg-[#723a2e] text-[#eeeddb] text-xs font-bold flex items-center gap-1.5 border-2 border-[#171717] transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
                    >
                      {isSending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>পাঠান</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-[#7a776e]">
                  <div className="w-12 h-12 rounded-full bg-[#ede9d6] border border-black/15 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[#8a493b]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#171717]">
                    কোনো আলাপচারিতা নির্বাচিত নেই
                  </h4>
                  <p className="text-xs text-[#53514a] max-w-xs">
                    বামপাশ থেকে যেকোনো একটি কথোপকথন নির্বাচন করুন।
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

