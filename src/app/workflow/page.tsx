"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { GitPullRequest, Plus, Clock, CheckCircle2, XCircle, UserCheck } from "lucide-react";

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [requestType, setRequestType] = useState("FEE_INSTALLMENT");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const res = await apiService.general.getWorkflows();
      setWorkflows(res.workflows || []);
    } catch (err) {
      console.error("Workflow load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      setSubmitting(true);
      await apiService.general.submitWorkflow({ requestType, title, description });
      setShowModal(false);
      setTitle("");
      setDescription("");
      loadWorkflows();
    } catch (err: any) {
      alert("Submission error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <GitPullRequest className="w-6 h-6 text-royal-600" />
            <span>Academic & Administrative Work Flow</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official formal requests, approval hierarchies, and institutional status audit trails
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow Request</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {workflows.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-xs text-slate-500">
              No academic requests logged. Click &quot;New Workflow Request&quot; to initiate a request.
            </div>
          ) : (
            workflows.map((wf) => (
              <div
                key={wf.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300 font-extrabold text-[10px]">
                        {wf.requestType}
                      </span>
                      <h2 className="font-bold text-sm text-slate-900 dark:text-white">{wf.title}</h2>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Submitted on: {new Date(wf.createdAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      wf.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : wf.status === "REJECTED"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {wf.status === "APPROVED" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </>
                    ) : wf.status === "REJECTED" ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" /> Under Review ({wf.currentApproverRole})
                      </>
                    )}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {wf.description}
                </p>

                {wf.steps && wf.steps.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-royal-600" /> Approver Comments:
                    </div>
                    {wf.steps.map((st: any) => (
                      <div
                        key={st.id}
                        className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 italic"
                      >
                        &quot;{st.comments}&quot; — {st.approverRole} ({new Date(st.approvedAt).toLocaleDateString("en-GB")})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-1">
              Submit Academic Workflow Request
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your request will be routed directly to the designated department officer
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Request Nature
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value="FEE_INSTALLMENT">Fee Installment Plan (Finance Office)</option>
                  <option value="COURSE_WITHDRAWAL">Course Withdrawal / Drop (Registrar)</option>
                  <option value="LEAVE">Medical / Personal Leave (Department Head)</option>
                  <option value="TRANSCRIPT_REQUEST">Official Transcript Request (Registrar)</option>
                  <option value="CLEARANCE">Semester Clearance (Academic Office)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Request for Fall 2026 Fee Installment Plan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Justification & Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide complete explanation and details for academic review..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

