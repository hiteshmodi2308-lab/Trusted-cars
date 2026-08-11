import React, { useState } from 'react';
import { calculateEmi, formatPrice } from '../lib/utils.js';
import { Calculator, CheckCircle2, Info, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface EmiCalculatorProps {
  initialPrice?: number;
  onApplyLoan?: (emiDetails: { carPrice: number; downPayment: number; tenure: number; monthlyEmi: number }) => void;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({ initialPrice = 500000, onApplyLoan }) => {
  const [carPrice, setCarPrice] = useState<number>(initialPrice);
  const [downPayment, setDownPayment] = useState<number>(Math.round(initialPrice * 0.2));
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  const loanAmount = Math.max(0, carPrice - downPayment);
  const emi = calculateEmi(loanAmount, interestRate, tenureYears);

  const principalPercent = emi.totalAmount > 0 ? Math.round((emi.principalAmount / emi.totalAmount) * 100) : 100;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl" id="emi-calculator">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/80 text-red-400 text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5" /> EMI & Financing Calculator
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Plan Your Easy Car Finance
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Reducing-balance EMI estimation with instant approval partners in Karol Bagh
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tie-ups with HDFC, ICICI, Axis & SBI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* INPUT SLIDERS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CAR PRICE */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Car Price (₹)
              </label>
              <span className="text-lg font-black text-white">{formatPrice(carPrice, 'full')}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={3000000}
              step={25000}
              value={carPrice}
              onChange={(e) => {
                const newP = Number(e.target.value);
                setCarPrice(newP);
                if (downPayment > newP) setDownPayment(Math.round(newP * 0.2));
              }}
              className="w-full accent-red-600 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1">
              <span>₹1 Lakh</span>
              <span>₹15 Lakhs</span>
              <span>₹30 Lakhs</span>
            </div>
          </div>

          {/* DOWN PAYMENT */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Down Payment (₹)
              </label>
              <span className="text-lg font-black text-emerald-400">{formatPrice(downPayment, 'full')}</span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.round(carPrice * 0.8)}
              step={10000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1">
              <span>₹0 (100% Loan)</span>
              <span>{Math.round((downPayment / carPrice) * 100)}% Down Payment</span>
              <span>Max ₹{(Math.round(carPrice * 0.8) / 100000).toFixed(1)} L</span>
            </div>
          </div>

          {/* INTEREST RATE & TENURE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Interest Rate (% p.a.)
                </label>
                <span className="text-lg font-black text-white">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={7.5}
                max={18.0}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-red-600 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">National average: 8.5% - 11%</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Loan Tenure (Years)
                </label>
                <span className="text-lg font-black text-white">{tenureYears} Years</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {[1, 2, 3, 4, 5, 7].map((yrs) => (
                  <button
                    key={yrs}
                    type="button"
                    onClick={() => setTenureYears(yrs)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      tenureYears === yrs
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {yrs}Y
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* OUTPUT SUMMARY & VISUAL BREAKDOWN */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
              Estimated Monthly Payment
            </span>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-red-500 tracking-tight">
                ₹{emi.monthlyEmi.toLocaleString('en-IN')}
              </span>
              <span className="text-slate-400 font-semibold text-sm">/ month</span>
            </div>

            {/* BREAKDOWN BAR */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-400">Principal ({principalPercent}%)</span>
                <span className="text-amber-400">Interest ({interestPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${principalPercent}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${interestPercent}%` }} className="bg-amber-500 h-full" />
              </div>
            </div>

            {/* FINANCIAL STATS GRID */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-6">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Loan Amount</span>
                <span className="text-sm font-extrabold text-white">{formatPrice(loanAmount, 'full')}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Total Interest</span>
                <span className="text-sm font-extrabold text-amber-400">{formatPrice(emi.totalInterest, 'full')}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 col-span-2">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Total Amount Payable</span>
                <span className="text-base font-black text-white">{formatPrice(emi.totalAmount, 'full')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onApplyLoan) {
                onApplyLoan({ carPrice, downPayment, tenure: tenureYears, monthlyEmi: emi.monthlyEmi });
              }
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/60 uppercase tracking-wider"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Apply for Instant Loan Approval</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
