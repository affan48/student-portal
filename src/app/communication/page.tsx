"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { MessageSquare, Send, Mail, User, Clock } from "lucide-react";

export default function CommunicationPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState("waqas.pasha@uit.edu");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await apiService.general.getCommunication();
      setMessages(res.messages || []);
    } catch (err) {
      console.error("Communication load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return;

    try {
      setSending(true);
      await apiService.general.sendMessage({ recipientEmail, subject, body });
      alert("Message sent successfully!");
      setSubject("");
      setBody("");
      loadMessages();
    } catch (err: any) {
      alert("Failed to send message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-royal-600" />
          <span>Academic Communication & Inquiries</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Direct messaging with course instructors, academic advisors, and department chairs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Message Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Send className="w-4 h-4 text-royal-600" />
            <span>Compose Message</span>
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Recipient
              </label>
              <select
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              >
                <option value="waqas.pasha@uit.edu">Muhammad Waqas Pasha (Computing Professional Practices)</option>
                <option value="jawad.bhutta@uit.edu">Jawad Ahmed Bhutta (Information Systems Audit)</option>
                <option value="shaukat.wasi@uit.edu">Shaukat Wasi (Parallel & Distributed Computing)</option>
                <option value="ismail.abbasi@uit.edu">Ismail Abbasi (Accounting & Finance)</option>
                <option value="talha.ahmed@uit.edu">Talha Ahmed (Software Construction & Dev)</option>
                <option value="registrar@uit.edu">Academic Registrar Office</option>
                <option value="finance@uit.edu">Student Accounts / Finance Office</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Inquiry regarding Midterm Assignment Submission"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message Body *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Type your official academic query..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? "Sending..." : "Dispatch Message"}</span>
            </button>
          </form>
        </div>

        {/* Message Inbox Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
              <Mail className="w-4 h-4 text-royal-600" />
              <span>Recent Inquiries & Dispatches</span>
            </h2>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No recent communication logged. Compose a message on the left to reach out.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {m.subject}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(m.sentAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>
                        From: <strong>{m.sender}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        To: <strong>{m.recipient}</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                      {m.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

