"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import {
  MessageSquare,
  Send,
  User as UserIcon,
  ArrowLeft,
  Loader2,
  Clock,
  Check,
  CheckCheck,
  ExternalLink,
  Shield,
  Sparkles,
  Inbox,
  AlertCircle,
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
  lastSender?: string;
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

function MessagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUserId = searchParams.get("user");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // 1. Fetch current user
  useEffect(() => {
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
  }, []);

  // 2. Fetch conversations list
  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {
      console.error("Fetch conversations error", e);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 12000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // 3. Handle `?user=[id]` parameter: auto create or open conversation
  useEffect(() => {
    if (!currentUser || !targetUserId) return;

    const initConversationWithUser = async () => {
      try {
        const res = await fetch("/api/messages/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientId: targetUserId }),
        });
        const data = await res.json();
        if (res.ok && data.conversation) {
          setActiveConversationId(data.conversation._id);
          setActiveUser(data.conversation.otherUser);
          fetchConversations();
        }
      } catch (err) {
        console.error("Init conversation error", err);
      }
    };

    initConversationWithUser();
  }, [currentUser, targetUserId]);

  // 4. Fetch messages for active conversation
  const fetchMessages = async (convId: string, isSilent = false) => {
    if (!isSilent) setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages/conversations/${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        if (data.otherUser) {
          setActiveUser(data.otherUser);
        }
      }
    } catch (e) {
      console.error("Fetch messages error", e);
    } finally {
      if (!isSilent) setLoadingMessages(false);
    }
  };

  // Switch conversation
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId, false);
      scrollToBottom("auto");
    }
  }, [activeConversationId]);

  // Periodic poll for active conversation messages (every 3.5s)
  useEffect(() => {
    if (!activeConversationId) return;
    const interval = setInterval(() => {
      fetchMessages(activeConversationId, true);
    }, 3500);
    return () => clearInterval(interval);
  }, [activeConversationId]);

  // Auto-scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send Message Handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversationId || isSending) return;

    const messageText = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      const res = await fetch(`/api/messages/conversations/${activeConversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: messageText }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        scrollToBottom();
        fetchConversations();
      }
    } catch (err) {
      console.error("Send message error", err);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (!mounted) return "";
      return date.toLocaleTimeString("bn-BD", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const formatConvTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (!mounted) return "";
      const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        return date.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
      }
      return `${diffDays} দিন আগে`;
    } catch {
      return "";
    }
  };

  // If not authenticated
  if (!loadingConversations && !currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-[#eeeddb]">
        <Masthead />
        <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-16 flex items-center justify-center">
          <div className="bg-[#f4f2e4] border-2 border-[#171717] p-8 sm:p-12 text-center space-y-4 max-w-md w-full shadow-md font-serif-bengali">
            <MessageSquare className="w-12 h-12 mx-auto text-[#8a493b]" />
            <h2 className="text-xl font-bold text-[#171717]">
              বার্তা পাঠাতে অ্যাকাউন্টে প্রবেশ করুন
            </h2>
            <p className="text-xs text-[#53514a] leading-relaxed">
              সহপাঠকদের সাথে ব্যক্তিগত যোগাযোগ ও সাহিত্যের ভাববিনিময়ের জন্য অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-[#171717] text-[#eeeddb] font-bold text-xs hover:bg-[#8a493b] transition-colors border border-black"
              >
                লগইন করুন →
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#eeeddb]">
      <Masthead />

      <main className="flex-grow max-w-6xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-4">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/amar-puthi"
              className="text-xs font-mono-meta text-[#53514a] hover:text-[#171717] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সাহিত্য চত্বর</span>
            </Link>
            <span className="text-[#53514a] opacity-40">/</span>
            <span className="text-xs font-mono-meta font-bold text-[#171717]">
              ব্যক্তিগত বার্তা ও পত্রালাপ
            </span>
          </div>

          <span className="text-[11px] font-mono-meta text-[#8a493b] hidden sm:inline">
            [ মহাফেজখানা ডাকঘর ও ব্যক্তিগত পত্র ]
          </span>
        </div>

        {/* Messaging Box Grid */}
        <div className="bg-[#f4f2e4] border-2 border-[#171717] shadow-md grid grid-cols-1 md:grid-cols-12 min-h-[600px] h-[72vh] overflow-hidden">
          {/* Left Column: Conversations List (md:col-span-4 lg:col-span-4) */}
          <div
            className={`md:col-span-4 lg:col-span-4 border-r-2 border-[#171717] flex flex-col bg-[#eeeddb] ${
              activeConversationId ? "hidden md:flex" : "flex"
            }`}
          >
            {/* List Header */}
            <div className="p-3.5 bg-[#e8e6d3] border-b-2 border-[#171717] flex items-center justify-between font-serif-bengali">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#8a493b]" />
                <h2 className="font-bold text-sm text-[#171717]">পত্রালাপ তালিকা</h2>
              </div>
              <span className="text-[10px] font-mono-meta px-2 py-0.5 bg-[#ede9d6] border border-black/15 text-[#53514a] font-bold">
                {conversations.length} টি
              </span>
            </div>

            {/* Conversations List Scrollable */}
            <div className="flex-1 overflow-y-auto divide-y divide-black/10">
              {loadingConversations ? (
                <div className="p-6 text-center space-y-2 text-[#7a776e]">
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                  <p className="text-xs font-serif-bengali">তালিকা লোড হচ্ছে...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center space-y-2 text-[#7a776e] font-serif-bengali">
                  <Inbox className="w-8 h-8 mx-auto opacity-30 text-[#8a493b]" />
                  <p className="text-xs font-bold text-[#171717]">কোনো আলাপচারিতা নেই</p>
                  <p className="text-[11px] text-[#53514a]">
                    যেকোনো পাঠকের প্রোফাইলে গিয়ে “বার্তা পাঠান” বাটনে ক্লিক করে আলাপ শুরু করুন।
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = conv._id === activeConversationId;
                  return (
                    <div
                      key={conv._id}
                      onClick={() => {
                        setActiveConversationId(conv._id);
                        setActiveUser(conv.otherUser);
                      }}
                      className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-center ${
                        isActive
                          ? "bg-[#ede9d6] border-l-4 border-l-[#8a493b]"
                          : "hover:bg-[#f4f2e4]"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#171717] text-[#eeeddb] flex items-center justify-center font-bold text-sm shrink-0 border border-black/20">
                        {conv.otherUser.name ? conv.otherUser.name.charAt(0) : "পা"}
                      </div>

                      {/* Info & Snippet */}
                      <div className="flex-1 min-w-0 font-serif-bengali space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-[#171717] truncate">
                            {conv.otherUser.name}
                          </span>
                          <span className="text-[10px] font-mono-meta text-[#7a776e] shrink-0">
                            {conv.lastMessageAt ? formatConvTime(conv.lastMessageAt) : ""}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#53514a] truncate leading-tight">
                          {conv.lastMessage || "কথোপকথন শুরু করুন..."}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#8a493b] text-white text-[10px] font-mono-meta font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Chat Pane (md:col-span-8 lg:col-span-8) */}
          <div
            className={`md:col-span-8 lg:col-span-8 flex flex-col bg-[#f4f2e4] ${
              !activeConversationId ? "hidden md:flex" : "flex"
            }`}
          >
            {activeConversationId && activeUser ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3 sm:p-4 bg-[#e8e6d3] border-b-2 border-[#171717] flex items-center justify-between font-serif-bengali">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => setActiveConversationId(null)}
                      className="md:hidden p-1 text-[#171717] hover:bg-black/10 rounded-xs"
                      title="তালিকায় ফিরুন"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="w-9 h-9 rounded-full bg-[#171717] text-[#eeeddb] flex items-center justify-center font-bold text-sm shrink-0 border border-black/20">
                      {activeUser.name ? activeUser.name.charAt(0) : "পা"}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#171717]">
                          {activeUser.name}
                        </span>
                        {activeUser.role === "super_admin" && (
                          <span className="text-[9px] font-mono-meta bg-[#8a493b] text-white px-1.5 py-0.2 rounded-full font-bold">
                            সুপার অ্যাডমিন
                          </span>
                        )}
                        {activeUser.role === "admin" && (
                          <span className="text-[9px] font-mono-meta bg-[#171717] text-[#eeeddb] px-1.5 py-0.2 rounded-full font-bold">
                            অ্যাডমিন
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono-meta text-[#7a776e]">
                        সক্রিয় কথোপকথন
                      </span>
                    </div>
                  </div>

                  {/* Public Profile Link */}
                  {activeUser._id && (
                    <Link
                      href={`/profile/${activeUser._id}`}
                      className="text-xs font-serif-bengali text-[#8a493b] hover:text-[#171717] hover:underline flex items-center gap-1 font-bold"
                      title="প্রোফাইল পরিদর্শন করুন"
                    >
                      <span>প্রোফাইল</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                {/* Messages History Pane */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 font-serif-bengali">
                  {loadingMessages ? (
                    <div className="p-12 text-center text-[#7a776e] space-y-2">
                      <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                      <p className="text-xs">বার্তাগুলো সংগৃহীত হচ্ছে...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="p-12 text-center space-y-2 text-[#7a776e]">
                      <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-[#8a493b]" />
                      <p className="text-xs font-bold text-[#171717]">এখনও কোনো বার্তা আদান-প্রদান হয়নি</p>
                      <p className="text-[11px] text-[#53514a]">
                        নিচের ঘরে বার্তা লিখে পাঠাতে পারেন।
                      </p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMine = m.sender === currentUser?.userId || m.sender === currentUser?.id;
                      return (
                        <div
                          key={m._id}
                          className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`max-w-[82%] sm:max-w-[70%] p-3 text-xs leading-relaxed whitespace-pre-wrap ${
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

                {/* Message Input Form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-[#e8e6d3] border-t-2 border-[#171717] flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="আপনার বার্তা বা প্রতিক্রিয়া লিখুন..."
                    className="flex-grow bg-[#eeeddb] border-2 border-[#171717] px-3 py-2 text-xs text-[#171717] font-serif-bengali focus:outline-none focus:border-[#8a493b]"
                    disabled={isSending}
                  />

                  <button
                    type="submit"
                    disabled={isSending || !inputText.trim()}
                    className="px-4 py-2 bg-[#8a493b] hover:bg-[#723a2e] text-[#eeeddb] text-xs font-bold font-serif-bengali flex items-center gap-1.5 border-2 border-[#171717] transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>পাঠান</span>
                  </button>
                </form>
              </>
            ) : (
              /* No Active Conversation Selected */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 font-serif-bengali text-[#7a776e]">
                <div className="w-16 h-16 rounded-full bg-[#ede9d6] border-2 border-black/15 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-[#8a493b]" />
                </div>
                <h3 className="text-base font-bold text-[#171717]">
                  কোনো আলাপচারিতা নির্বাচিত নেই
                </h3>
                <p className="text-xs text-[#53514a] max-w-sm">
                  বামপাশের তালিকা থেকে যেকোনো একটি কথোপকথন বেছে নিন অথবা কোনো পাঠকের প্রোফাইল থেকে নতুন বার্তা প্রেরণ করুন।
                </p>
                <Link
                  href="/amar-puthi"
                  className="mt-2 inline-block px-4 py-2 bg-[#171717] text-[#eeeddb] text-xs font-bold hover:bg-[#8a493b] transition-colors border border-black"
                >
                  সাহিত্য চত্বর থেকে পাঠক খুঁজুন →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#eeeddb]">
          <Loader2 className="w-6 h-6 animate-spin text-[#8a493b]" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}

