"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FinancialLedgerTable } from "@/components/dashboard/FinancialLedgerTable";
import { apiService } from "@/services/api";
import { CreditCard, DollarSign, FileText, ArrowRight, ShieldCheck, Download } from "lucide-react";

export default function FeesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLedger() {
      try {
        setLoading(true);
        const res = await apiService.finance.getLedger();
        setData(res);
      } catch (err) {
        console.error("Finance load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLedger();
  }, []);

  return (
    <PortalLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-royal-600" />
            <span>Student Financial Ledger & Dues</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accounting General Ledger • Transparent fee charging, debit/credit entries, and balances
          </p>
        </div>

        <Link
          href="/fees/challans"
          className="px-4 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow"
        >
          <FileText className="w-4 h-4" />
          <span>View Challans & Pay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Current Outstanding Balance
              </div>
              <div className="text-3xl font-black text-amber-900 dark:text-amber-100 mt-2">
                PKR {data.currentBalance.toLocaleString()}
              </div>
              <div className="text-[11px] text-amber-700/70 mt-1">
                Loan / Deferment Amount: PKR {data.loanAmount.toLocaleString()}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Cumulative Charging
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                PKR {data.totalCharging.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Tuition, Exams, & Campus Services</div>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Total Verified Payments
              </div>
              <div className="text-3xl font-black text-emerald-600 mt-2">
                PKR {data.totalPaid.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700/70 mt-1">Verified via Bank Records</div>
            </div>
          </div>

          {/* Full Transaction Ledger */}
          <FinancialLedgerTable
            currentBalance={data.currentBalance}
            loanAmount={data.loanAmount}
            rows={data.ledger}
            standalone={true}
          />
        </div>
      ) : null}
    </PortalLayout>
  );
}

