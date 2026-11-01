"use client";

import React, { useEffect, useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { apiService } from "@/services/api";
import { FileText, Printer, CheckCircle2, DollarSign, CreditCard, Clock } from "lucide-react";

export default function ChallansPage() {
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payModalChallan, setPayModalChallan] = useState<any | null>(null);
  const [payMethod, setPayMethod] = useState("ONLINE_TRANSFER");
  const [refNumber, setRefNumber] = useState("");
  const [processing, setProcessing] = useState(false);

  const loadChallans = async () => {
    try {
      setLoading(true);
      const res = await apiService.finance.getChallans();
      setChallans(res.challans || []);
    } catch (err) {
      console.error("Failed to load challans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallans();
  }, []);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalChallan || !refNumber) return;

    try {
      setProcessing(true);
      await apiService.finance.payChallan(payModalChallan.id, payMethod, refNumber);
      alert("Payment recorded successfully! General ledger and balance updated.");
      setPayModalChallan(null);
      setRefNumber("");
      loadChallans();
    } catch (err: any) {
      alert("Payment failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-royal-600" />
            <span>Fee Challans & Online Payment</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Downloadable bank vouchers and direct online fee processing
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {challans.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-royal-100 text-royal-800 dark:bg-royal-950 dark:text-royal-300">
                      {c.semester}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                      Challan No: {c.challanNumber}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    Semester Tuition & Academic Services Challan
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      c.status === "PAID"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {c.status === "PAID" ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Paid & Cleared
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" /> Payment Pending
                      </>
                    )}
                  </span>

                  {c.status !== "PAID" && (
                    <button
                      type="button"
                      onClick={() => setPayModalChallan(c)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
                    >
                      Pay Online Now
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    title="Print Bank Challan"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Challan Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs mb-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Issue Date:</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                    {c.issueDate}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Due Date:</span>
                  <span className="font-bold text-rose-600 block mt-0.5">{c.dueDate}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Total Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                    PKR {c.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-royal-50 dark:bg-royal-950/40 border border-royal-200 dark:border-royal-800">
                  <span className="text-royal-700 dark:text-royal-300 font-medium">
                    Payable Amount:
                  </span>
                  <span className="text-base font-black text-royal-900 dark:text-royal-100 block mt-0.5">
                    PKR {c.payableAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Authorized Bank Details:{" "}
                </span>
                {c.bankDetails}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Online Payment Modal */}
      {payModalChallan && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2">
              Pay Challan Online
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter payment transaction reference to clear Challan #{payModalChallan.challanNumber}
            </p>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount to Pay (PKR)
                </label>
                <input
                  type="text"
                  disabled
                  value={`PKR ${payModalChallan.payableAmount.toLocaleString()}`}
                  className="w-full px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value="ONLINE_TRANSFER">Online Bank Transfer (1Link / IBFT)</option>
                  <option value="CREDIT_CARD">Credit / Debit Card (Visa / Mastercard)</option>
                  <option value="BANK_DEPOSIT">HBL Branch Counter Deposit Slip</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Transaction / Deposit Reference ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HBL-FT-984218731"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPayModalChallan(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                >
                  {processing ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

