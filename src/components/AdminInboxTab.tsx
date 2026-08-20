import React, { useState } from "react";
import {
  Inbox,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Copy,
  Check,
  Send,
  ExternalLink,
  MessageSquare,
  User,
  AtSign,
  Calendar,
  AlertCircle,
  FileText,
  HelpCircle,
  Bug,
  Lightbulb,
  ThumbsUp,
  RefreshCw,
  Download,
  StickyNote,
  Tag
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { ContactMessage, ContactMessageStatus, ContactMessageTopic } from "../types";

export const AdminInboxTab: React.FC = () => {
  const {
    contactMessages,
    unreadMessagesCount,
    loadingMessages,
    refreshContactMessages,
    markMessageStatus,
    deleteContactMessage
  } = useAdmin();

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTopic, setFilterTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState<string>("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedMessage = contactMessages.find((m) => m.id === selectedMessageId) || null;

  // Filter messages
  const filteredMessages = contactMessages.filter((msg) => {
    const status = msg.status || "unread";
    const topic = msg.topic || "general";

    const matchesStatus = filterStatus === "all" || status === filterStatus;
    const matchesTopic = filterTopic === "all" || topic === filterTopic;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q);

    return matchesStatus && matchesTopic && matchesSearch;
  });

  const getTopicIcon = (topic?: ContactMessageTopic) => {
    switch (topic) {
      case "bug":
        return <Bug className="w-3.5 h-3.5 text-rose-400" />;
      case "feature":
        return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
      case "help":
        return <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />;
      case "feedback":
        return <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Mail className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getTopicBadgeClass = (topic?: ContactMessageTopic) => {
    switch (topic) {
      case "bug":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "feature":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "help":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
      case "feedback":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
    }
  };

  const getStatusBadge = (status: ContactMessageStatus = "unread") => {
    switch (status) {
      case "unread":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/40">
            Unread
          </span>
        );
      case "read":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-700/50 text-zinc-300 border border-zinc-600/40">
            Read
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
            In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
            Resolved
          </span>
        );
      case "archived":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/40">
            Archived
          </span>
        );
    }
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const handleStatusChange = async (id: string, status: ContactMessageStatus) => {
    const success = await markMessageStatus(id, status);
    if (success) {
      setActionSuccess(`Status updated to ${status}`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleSaveNotes = async (id: string) => {
    const success = await markMessageStatus(id, selectedMessage?.status || "read", notesText);
    if (success) {
      setEditingNotesId(null);
      setActionSuccess("Admin internal note saved");
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this message?")) {
      await deleteContactMessage(id);
      if (selectedMessageId === id) {
        setSelectedMessageId(null);
      }
    }
  };

  const exportMessagesJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contactMessages, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dpg_contact_messages_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner & Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-blue-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Messages</div>
            <div className="text-lg font-black text-white">{contactMessages.length}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-cyan-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Unread Messages</div>
            <div className="text-lg font-black text-cyan-300">{unreadMessagesCount}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-amber-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">In Progress</div>
            <div className="text-lg font-black text-amber-300">
              {contactMessages.filter((m) => m.status === "in_progress").length}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-emerald-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Resolved</div>
            <div className="text-lg font-black text-emerald-300">
              {contactMessages.filter((m) => m.status === "resolved").length}
            </div>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0a1020] border border-blue-500/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sender, email, subject, or message content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121c32] border border-blue-500/20 focus:border-blue-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#121c32] border border-blue-500/20 text-xs text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="unread">Unread Only</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>

          {/* Topic Filter */}
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="bg-[#121c32] border border-blue-500/20 text-xs text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 cursor-pointer"
          >
            <option value="all">All Topics</option>
            <option value="feedback">Feedback</option>
            <option value="feature">Feature Requests</option>
            <option value="bug">Bug Reports</option>
            <option value="help">Support / Help</option>
            <option value="general">General Inquiries</option>
          </select>

          <button
            type="button"
            onClick={refreshContactMessages}
            disabled={loadingMessages}
            className="p-2 rounded-xl bg-[#121c32] hover:bg-white/10 text-zinc-300 hover:text-white border border-blue-500/20 transition-colors cursor-pointer"
            title="Refresh Inbox"
          >
            <RefreshCw className={`w-4 h-4 ${loadingMessages ? "animate-spin text-blue-400" : ""}`} />
          </button>

          <button
            type="button"
            onClick={exportMessagesJson}
            className="p-2 rounded-xl bg-[#121c32] hover:bg-white/10 text-zinc-300 hover:text-white border border-blue-500/20 transition-colors cursor-pointer"
            title="Export Messages JSON"
          >
            <Download className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Main Inbox 2-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[460px]">
        {/* Left List of Messages */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center bg-[#0a1020] border border-blue-500/20 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">No Messages Found</div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                No contact submissions match your current filters. Users can submit messages from the "Contact Us" portal in the footer.
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessageId === msg.id;
              const isUnread = msg.status === "unread" || !msg.status;

              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessageId(msg.id);
                    if (isUnread) {
                      markMessageStatus(msg.id, "read");
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                    isSelected
                      ? "bg-[#142340] border-blue-400/80 shadow-lg shadow-blue-900/30"
                      : isUnread
                      ? "bg-[#0f1b32] border-blue-500/40 hover:border-blue-400/60"
                      : "bg-[#0a1020] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 animate-pulse" />
                      )}
                      <span className="text-xs font-black text-white truncate">
                        {msg.name || "Anonymous Creator"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {getStatusBadge(msg.status)}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-zinc-200 line-clamp-1">
                    {msg.subject || "No Subject"}
                  </div>

                  <div className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      {getTopicIcon(msg.topic)}
                      <span className="capitalize">{msg.topic || "General"}</span>
                    </span>
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 bg-[#0a1020] border border-blue-500/30 rounded-2xl p-5 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-5">
              {/* Message Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-blue-500/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-white">{selectedMessage.subject}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${getTopicBadgeClass(selectedMessage.topic)}`}>
                      {getTopicIcon(selectedMessage.topic)}
                      <span className="capitalize">{selectedMessage.topic || "General"}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-200 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      {selectedMessage.name}
                    </span>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(selectedMessage.email, selectedMessage.id)}
                      className="font-mono text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <AtSign className="w-3.5 h-3.5 text-cyan-400" />
                      {selectedMessage.email}
                      {copiedEmailId === selectedMessage.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-400 hover:text-white" />
                      )}
                    </button>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Selector Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#111a2e] rounded-xl border border-blue-500/20 text-xs">
                <span className="font-bold text-zinc-300">Set Message Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, "unread")}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                      selectedMessage.status === "unread"
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, "in_progress")}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                      selectedMessage.status === "in_progress"
                        ? "bg-amber-600 text-white"
                        : "bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, "resolved")}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                      selectedMessage.status === "resolved"
                        ? "bg-emerald-600 text-white"
                        : "bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedMessage.id, "archived")}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                      selectedMessage.status === "archived"
                        ? "bg-purple-600 text-white"
                        : "bg-white/5 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Archive
                  </button>
                </div>
              </div>

              {/* Message Content Body */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Message Content:
                </div>
                <div className="p-4 rounded-xl bg-[#111a2e] border border-blue-500/20 text-xs text-zinc-100 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Internal Notes (Private):</span>
                  </span>
                  {editingNotesId !== selectedMessage.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNotesId(selectedMessage.id);
                        setNotesText(selectedMessage.adminNotes || "");
                      }}
                      className="text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                      {selectedMessage.adminNotes ? "Edit Note" : "+ Add Note"}
                    </button>
                  )}
                </div>

                {editingNotesId === selectedMessage.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="Add private admin notes regarding this inquiry..."
                      className="w-full bg-[#111a2e] border border-amber-500/30 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingNotesId(null)}
                        className="px-3 py-1 rounded-lg bg-white/5 text-zinc-400 text-xs hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveNotes(selectedMessage.id)}
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ) : selectedMessage.adminNotes ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 italic">
                    "{selectedMessage.adminNotes}"
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 italic">No admin notes added yet.</div>
                )}
              </div>

              {/* Action Buttons: Reply via Email Client */}
              <div className="pt-3 border-t border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyEmail(selectedMessage.email, selectedMessage.id)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Sender Email</span>
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    "Re: " + (selectedMessage.subject || "Digital Play Grid Inquiry")
                  )}&body=${encodeURIComponent(
                    `Hi ${selectedMessage.name},\n\nThank you for reaching out to Digital Play Grid.\n\n---\nRegarding your message:\n"${selectedMessage.message}"\n`
                  )}`}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Mail className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-white">Select a Message to View</div>
              <p className="text-xs text-zinc-400 max-w-sm">
                Choose any feedback, bug report, or user question from the list on the left to review details, update status, add internal notes, or reply directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
