import React, { useState } from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { EmiCalculator } from '../components/EmiCalculator.js';
import { EnquiryModal } from '../components/EnquiryModal.js';
import {
  Calculator,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileText,
  Building2,
  Percent,
  Clock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface FinancePageProps {
  onNavigate: (path: string) => void;
}

export const FinancePage: React.FC<FinancePageProps> = ({ onNavigate }) => {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header currentPath="/finance" onNavigate={onNavigate} />

      {/* HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Calculator className="w-4 h-4 text-red-500" />
            <span>Used Car Loans starting at 8.9% p.a.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Easy Car Finance & <br />
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
              Paperless Loan Approvals
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium mt-3 leading-relaxed">
            Get up to 90% funding on certified pre-owned cars in Karol Bagh with flexible tenures up to 7 years.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        
        {/* 1. CALCULATOR */}
        <EmiCalculator onApplyLoan={() => setEnquiryModalOpen(true)} />

        {/* 2. BANK TIE UPS */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-1">
              Official Financing Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Instant Approval Banks</h2>
            <p className="text-xs text-slate-400 mt-1">Direct tie-ups with leading Indian nationalized & private banks</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'State Bank of India', 'IDFC FIRST Bank', 'IndusInd Bank'].map((bank, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center hover:border-red-900 transition-colors">
                <Building2 className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-white">{bank}</h4>
                <p className="text-[10px] text-emerald-400 mt-1">Instant Approval</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. DOCUMENTATION & PROCESS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-500">
              <FileText className="w-4 h-4" />
              <span>Minimal Documentation</span>
            </div>
            <h3 className="text-2xl font-black text-white">Required Documents</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Identity Proof:</strong> Aadhaar Card / PAN Card / Passport</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Address Proof:</strong> Utility Bill / Rent Agreement / Passport</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Income Proof:</strong> 3 Months Salary Slips or 2 Years ITR for Business</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Bank Statement:</strong> 6 Months updated bank statement</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400">
              <Clock className="w-4 h-4" />
              <span>Speed & Efficiency</span>
            </div>
            <h3 className="text-2xl font-black text-white">Loan Approval Steps</h3>
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-white">Select Vehicle & Submit Application</h4>
                  <p className="text-slate-400">Choose your car and provide basic KYC details to our loan desk in Karol Bagh.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-white">Instant Credit Check & Approval</h4>
                  <p className="text-slate-400">In-house banking desk gets soft approval within 30 to 60 minutes.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-white">Disbursement & Delivery</h4>
                  <p className="text-slate-400">Sign digital loan documents and drive home your car on the same day!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer onNavigate={onNavigate} />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        type="Loan Application"
        initialMessage="Hi, I want to apply for car financing at Trusted Cars Karol Bagh. Please verify my loan eligibility."
      />
    </div>
  );
};
