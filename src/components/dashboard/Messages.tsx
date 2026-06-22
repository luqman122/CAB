"use client";

import React, { useState, useRef, useEffect } from "react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  online: boolean;
  lastMsg: string;
  lastMsgTime: string;
  unread: number;
}

interface ChatMessage {
  id: string;
  sender: "user" | "other";
  text: string;
  time: string;
}

const contacts: Contact[] = [
  {
    id: "C1",
    name: "Mohamed Hassan",
    avatar: "MH",
    role: "Driver • Toyota Corolla",
    online: true,
    lastMsg: "I'm at the pickup point now. Blue gate, right?",
    lastMsgTime: "2 min ago",
    unread: 1,
  },
  {
    id: "C2",
    name: "CAB Support",
    avatar: "CS",
    role: "Customer Support Agent",
    online: true,
    lastMsg: "Your refund of $5.20 has been processed successfully.",
    lastMsgTime: "1 hr ago",
    unread: 1,
  },
  {
    id: "C3",
    name: "Abdi Rahman",
    avatar: "AR",
    role: "Driver • Hyundai Elantra",
    online: false,
    lastMsg: "Thank you for the 5-star rating! Safe travels.",
    lastMsgTime: "Yesterday",
    unread: 0,
  },
  {
    id: "C4",
    name: "Guled Ali",
    avatar: "GA",
    role: "Driver • Kia Optima",
    online: false,
    lastMsg: "I'll be there in about 3 minutes.",
    lastMsgTime: "3 days ago",
    unread: 0,
  },
];

const chatHistories: Record<string, ChatMessage[]> = {
  C1: [
    { id: "m1", sender: "other", text: "Hello! I've accepted your ride request. I'm on my way.", time: "5 min ago" },
    { id: "m2", sender: "user", text: "Great, thank you! I'm near the blue gate at KM4.", time: "4 min ago" },
    { id: "m3", sender: "other", text: "I'm at the pickup point now. Blue gate, right?", time: "2 min ago" },
  ],
  C2: [
    { id: "m1", sender: "user", text: "Hi, I was charged for a cancelled ride R105. Can I get a refund?", time: "2 hrs ago" },
    { id: "m2", sender: "other", text: "Hello! Let me check ride R105 details for you.", time: "2 hrs ago" },
    { id: "m3", sender: "other", text: "I can see the ride was cancelled. I'll process the refund now.", time: "1.5 hrs ago" },
    { id: "m4", sender: "other", text: "Your refund of $5.20 has been processed successfully.", time: "1 hr ago" },
  ],
  C3: [
    { id: "m1", sender: "other", text: "Hello! I'll be at the pickup in 5 minutes.", time: "Yesterday" },
    { id: "m2", sender: "user", text: "Perfect, I'm waiting outside.", time: "Yesterday" },
    { id: "m3", sender: "other", text: "Thank you for the 5-star rating! Safe travels.", time: "Yesterday" },
  ],
  C4: [
    { id: "m1", sender: "other", text: "I'll be there in about 3 minutes.", time: "3 days ago" },
    { id: "m2", sender: "user", text: "Ok, I'll come downstairs now.", time: "3 days ago" },
  ],
};

export default function Messages() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const openChat = (contact: Contact) => {
    setActiveContact(contact);
    setMessages(chatHistories[contact.id] || []);
  };

  const sendMessage = () => {
    if (!input.trim() || !activeContact) return;
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: "user",
      text: input.trim(),
      time: "Just now",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        "Got it, thank you!",
        "Sure, no problem.",
        "I understand. On my way!",
        "Okay, I'll update you shortly.",
      ];
      const reply: ChatMessage = {
        id: `m_${Date.now() + 1}`,
        sender: "other",
        text: replies[Math.floor(Math.random() * replies.length)],
        time: "Just now",
      };
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-0 animate-fade-in h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      <div className="flex h-full rounded-3xl overflow-hidden glass-panel border border-white/5">
        {/* Contact List (left) */}
        <div
          className={`w-full md:w-[320px] flex flex-col border-r border-white/5 shrink-0 bg-slate-950/30 ${
            activeContact ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-slate-800/60 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-light/40"
              />
            </div>
          </div>

          {/* Contact Items */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-600">No conversations found</div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => openChat(contact)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all border-b border-white/3 hover:bg-white/3 ${
                    activeContact?.id === contact.id ? "bg-blue-light/5 border-l-2 border-l-blue-light" : ""
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black ${
                      contact.id === "C2"
                        ? "bg-blue-light/15 text-blue-light"
                        : "bg-slate-800 text-slate-300"
                    } border border-white/5`}>
                      {contact.avatar}
                    </div>
                    {contact.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-950"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{contact.name}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-2">{contact.lastMsgTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{contact.lastMsg}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-light text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                      {contact.unread}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Panel (right) */}
        <div
          className={`flex-1 flex flex-col ${
            !activeContact ? "hidden md:flex" : "flex"
          }`}
        >
          {!activeContact ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
              <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-center">
                <i className="fas fa-comments text-3xl text-slate-600"></i>
              </div>
              <h3 className="text-sm font-bold text-slate-400">Select a conversation</h3>
              <p className="text-xs text-slate-600 text-center max-w-xs">
                Choose a contact from the list to start messaging your driver or CAB support.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 bg-slate-950/30 shrink-0">
                <button
                  onClick={() => setActiveContact(null)}
                  className="md:hidden w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center text-sm hover:text-white transition-colors"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <div className="relative">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black ${
                    activeContact.id === "C2" ? "bg-blue-light/15 text-blue-light" : "bg-slate-800 text-slate-300"
                  } border border-white/5`}>
                    {activeContact.avatar}
                  </div>
                  {activeContact.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-slate-950"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{activeContact.name}</h4>
                  <span className={`text-[10px] font-semibold ${activeContact.online ? "text-green-400" : "text-slate-500"}`}>
                    {activeContact.online ? "Online" : "Offline"} • {activeContact.role}
                  </span>
                </div>
                <button className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center text-sm hover:text-white transition-colors">
                  <i className="fas fa-phone"></i>
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-blue-main to-blue-light text-white rounded-br-md"
                          : "bg-slate-800 text-slate-200 border border-white/5 rounded-bl-md"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`block text-right text-[9px] mt-1.5 ${
                          msg.sender === "user" ? "text-white/50" : "text-slate-500"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="shrink-0 p-4 border-t border-white/5 bg-slate-950/30">
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center text-sm hover:text-white transition-colors shrink-0">
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-800/60 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-light/40"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-main to-blue-light text-white flex items-center justify-center text-sm hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all shrink-0 disabled:opacity-40"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
