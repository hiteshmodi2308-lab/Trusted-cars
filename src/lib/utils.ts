/**
 * Format price in Indian Rupees (INR)
 * e.g. 450000 -> "₹4.50 Lakh" or "₹4,50,000"
 */
export function formatPrice(amount: number, format: 'lakh' | 'full' | 'auto' = 'auto'): string {
  if (isNaN(amount) || amount === 0) return '₹0';

  if (format === 'lakh' || (format === 'auto' && amount >= 100000)) {
    const lakhs = amount / 100000;
    if (amount >= 10000000) {
      const crores = amount / 10000000;
      return `₹${crores.toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(2)} Lakh`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format KM driven
 * e.g. 45000 -> "45,000 km"
 */
export function formatKm(km: number): string {
  return `${new Intl.NumberFormat('en-IN').format(km)} km`;
}

/**
 * Standard Reducing-Balance EMI Calculation Formula
 * EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
 * P = Principal Loan Amount
 * R = Monthly Interest Rate (Annual Rate / 12 / 100)
 * N = Loan Tenure in Months
 */
export function calculateEmi(principal: number, annualInterestRate: number, tenureInYears: number): {
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
  principalAmount: number;
} {
  if (principal <= 0 || annualInterestRate <= 0 || tenureInYears <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalAmount: 0, principalAmount: principal };
  }

  const monthlyRate = annualInterestRate / 12 / 100;
  const tenureInMonths = tenureInYears * 12;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
    (Math.pow(1 + monthlyRate, tenureInMonths) - 1);

  const totalAmount = emi * tenureInMonths;
  const totalInterest = totalAmount - principal;

  return {
    monthlyEmi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    principalAmount: Math.round(principal),
  };
}

/**
 * Generate SEO slug from car details
 * e.g. Make: Maruti, Model: Dzire, Variant: ZXi, Year: 2019, Loc: Delhi
 * -> "maruti-dzire-zxi-2019-delhi"
 */
export function generateCarSlug(make: string, model: string, variant: string, year: number, id?: string): string {
  const text = `${make} ${model} ${variant} ${year} delhi`.toLowerCase();
  const slug = text
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return id ? `${slug}-${id.slice(-6)}` : slug;
}

/**
 * Build WhatsApp click to chat link
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

/**
 * Build phone call link
 */
export function getCallUrl(phone: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleanPhone}`;
}

/**
 * Format Date to Indian standard string e.g. "11 Aug 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
