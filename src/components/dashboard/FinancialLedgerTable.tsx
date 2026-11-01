"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, Download, Search, FileText } from "lucide-react";

interface LedgerRow {
  id: string;
  description: string;
  feeNature: string;
  session: string;
  date: string;
  charging: number;
  amount: number;
  currentBalance: number;
}

interface FinancialLedgerTableProps {
  currentBalance?: number;
  loanAmount?: number;
  rows: LedgerRow[];
  standalone?: boolean;
}

export function FinancialLedgerTable({
  currentBalance = 222680.0,
  loanAmount = 0.0,
  rows,
  standalone = false,
}: FinancialLedgerTableProps) {
  const [search, setSearch] = useState("");
  const [sessionFilter, setSessionFilter] = useState("ALL");

  const filtered = rows.filter((r) => {
    const matchSearch =
      r.feeNature.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.session.toLowerCase().includes(search.toLowerCase());
    const matchSession = sessionFilter === "ALL" || r.session === sessionFilter;
    return matchSearch && matchSession;
  });

  const exportCSV = () => {
    const headers = ["Description,Fee Nature,Session,Date,Charging,Amount,Current Balance"];
    const lines = filtered.map(
      (r) =>
        `"${r.description}","${r.feeNature}","${r.session}","${r.date}",${r.charging},${r.amount},${r.currentBalance}`
    );
    const blob = new Blob([[...headers, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `UIT_Financial_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
      {/* Table Header matching reference */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-royal-600" />
              <span>Financial Ledger</span>
            </h2>
            {!standalone && (
              <Link
                href="/fees"
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                View
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs mt-1 text-slate-600 dark:text-slate-300">
            <span>
              Current Balance:{" "}
              <strong className="text-amber-600 dark:text-amber-400 font-extrabold">
                ({currentBalance.toFixed(2)})
              </strong>
            </span>
            <span>•</span>
            <span>
              Loan/Deferment Amount:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                ({loanAmount.toFixed(0)})
              </strong>
            </span>
          </div>
        </div>

        {/* Filter and Export */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search nature or session..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-royal-500"
              aria-label="Filter ledger entries"
            />
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Blue Header Bar (as in reference UIT portal) */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-sky-500 text-white font-bold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3">Fee Nature</th>
              <th className="py-2.5 px-3">Session</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-right">Charging (PKR)</th>
              <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
              <th className="py-2.5 px-3 text-right">Current Balance (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No financial ledger records found.
                </td>
              </tr>
            ) : (
              filtered.map((r, idx) => (
                <tr
                  key={r.id || idx}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors text-slate-700 dark:text-slate-200 font-medium"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {r.description}
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 dark:text-slate-100">{r.feeNature}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{r.session}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{r.date}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-100">
                    {r.charging.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {r.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-amber-700 dark:text-amber-400">
                    {r.currentBalance.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Branding Note */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[11px] text-slate-500">
        <span>Displaying verified financial transactions • Decimal precision</span>
        <span className="font-bold text-slate-700 dark:text-slate-300 tracking-wide">
          eDU SMARTZ
        </span>
      </div>
    </div>
  );
}

