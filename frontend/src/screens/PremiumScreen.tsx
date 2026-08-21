import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Sparkles,
  Check,
  ShieldCheck,
  DownloadCloud,
  Volume2,
  Waves,
  ArrowRight,
  X,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Lock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PremiumScreenProps {
  user: UserProfile;
  onUpgradePlan: (planName: string) => void;
}

// ── Payment method types ────────────────────────────────────────────────────
type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet';
type GatewayStep = 'summary' | 'method' | 'details' | 'processing' | 'success';

interface PlanConfig {
  id: string;
  name: string;
  badge: string;
  monthlyPrice: string;
  annualPrice: string;
  annualPriceINR: string;
  monthlyPriceINR: string;
  annualBilled: string;
  features: string[];
  color: string;
}

const PLANS: PlanConfig[] = [
  {
    id: 'student',
    name: 'Student Membership',
    badge: 'Most Popular for Students',
    monthlyPrice: '$3.99',
    annualPrice: '$2.99',
    monthlyPriceINR: '₹329',
    annualPriceINR: '₹249',
    annualBilled: '$35.88 / year',
    color: '#00fde7',
    features: [
      'Ad-free uninterrupted music streaming',
      'Offline downloads on up to 3 devices',
      '40Hz Gamma & Alpha acoustic presets',
      'Standard Lossless 320 kbps audio',
      'Student ID verification valid for 4 years',
    ],
  },
  {
    id: 'professional',
    name: 'Pro Master Audio',
    badge: 'Audiophile Choice',
    monthlyPrice: '$8.99',
    annualPrice: '$6.99',
    monthlyPriceINR: '₹749',
    annualPriceINR: '₹579',
    annualBilled: '$83.88 / year',
    color: '#cafd1e',
    features: [
      'Everything in Student Plan',
      'Unlimited offline storage and album caching',
      'Hi-Res Lossless FLAC 24-bit studio fidelity',
      'Live Synthesizer soundscape customizer',
      'Synchronized cross-device playback resumption',
      'Priority feature requests & early releases',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime Music Pass',
    badge: 'One-Time Payment',
    monthlyPrice: '$149.00',
    annualPrice: '$149.00',
    monthlyPriceINR: '₹12,499',
    annualPriceINR: '₹12,499',
    annualBilled: 'Pay once, own forever',
    color: '#ffb700',
    features: [
      'Lifetime access to all current and future albums',
      'Zero subscription fees forever',
      'All Pro & Master acoustic soundscapes',
      'Direct VIP support channel',
    ],
  },
];

const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank',
];

const WALLETS = [
  { id: 'paytm', label: 'Paytm', icon: '💰' },
  { id: 'phonepe', label: 'PhonePe', icon: '📱' },
  { id: 'amazonpay', label: 'Amazon Pay', icon: '🛒' },
  { id: 'mobikwik', label: 'MobiKwik', icon: '👛' },
];

// ── Utility ────────────────────────────────────────────────────────────────
function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
}

// ── Payment Gateway Modal ─────────────────────────────────────────────────
interface GatewayModalProps {
  plan: PlanConfig;
  billingCycle: 'monthly' | 'annual';
  onClose: () => void;
  onSuccess: (planName: string) => void;
}

const GatewayModal: React.FC<GatewayModalProps> = ({ plan, billingCycle, onClose, onSuccess }) => {
  const [step, setStep] = useState<GatewayStep>('summary');
  const [method, setMethod] = useState<PaymentMethod>('card');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  // UPI
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  // Net banking
  const [selectedBank, setSelectedBank] = useState('');

  // Wallet
  const [selectedWallet, setSelectedWallet] = useState('');

  // OTP (simulated 2FA step)
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');

  const price = billingCycle === 'annual' ? plan.annualPriceINR : plan.monthlyPriceINR;
  const priceUSD = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const isLifetime = plan.id === 'lifetime';
  const displayPrice = isLifetime ? plan.annualPriceINR : price;

  // Simulate processing
  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'upi') {
      if (!upiId.match(/^[\w.\-_]{3,}@[a-zA-Z]{3,}$/)) {
        setUpiError('Enter a valid UPI ID (e.g. name@upi)');
        return;
      }
      setUpiError('');
    }

    if (!otpSent) {
      setOtpSent(true);
      return; // Show OTP field
    }

    if (otp !== '123456') {
      setOtpError('Incorrect OTP. Try 123456 for demo.');
      return;
    }

    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(plan.name);
        onClose();
      }, 2200);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#0e1600] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00fde7]/10 border border-[#00fde7]/30 flex items-center justify-center">
              <Lock size={15} className="text-[#00fde7]" />
            </div>
            <div>
              <p className="text-[11px] text-[#92b900] font-medium">Secure Checkout</p>
              <h3 className="font-bold text-white text-sm leading-tight">{plan.name}</h3>
            </div>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button onClick={onClose} className="text-[#92b900] hover:text-white p-1 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* ── STEP: summary ── */}
        {step === 'summary' && (
          <div className="px-6 py-5 space-y-5">
            {/* Order summary */}
            <div className="bg-[#141c00] rounded-2xl p-4 border border-white/5 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#92b900]">Plan</span>
                <span className="text-white font-semibold">{plan.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#92b900]">Billing</span>
                <span className="text-white font-semibold capitalize">{isLifetime ? 'One-time' : billingCycle}</span>
              </div>
              <div className="border-t border-white/5 pt-2.5 flex justify-between">
                <span className="text-[#92b900] text-xs font-semibold">Total</span>
                <div className="text-right">
                  <span className="text-[#00fde7] font-extrabold text-lg">{displayPrice}</span>
                  <span className="text-[#92b900] text-[10px] block">{priceUSD} {isLifetime ? '(one-time)' : `/ ${billingCycle === 'annual' ? 'mo, billed annually' : 'month'}`}</span>
                </div>
              </div>
            </div>

            {/* Features recap */}
            <div className="space-y-2">
              {plan.features.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#cafd1e]">
                  <Check size={13} className="text-[#00fde7] shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('method')}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] shadow-lg shadow-[#00fde7]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Proceed to Payment</span>
              <ArrowRight size={16} />
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#92b900]">
              <Lock size={11} />
              <span>256-bit SSL encrypted · Powered by Razorpay</span>
            </p>
          </div>
        )}

        {/* ── STEP: method ── */}
        {step === 'method' && (
          <div className="px-6 py-5 space-y-4">
            <p className="text-xs font-semibold text-[#92b900] uppercase tracking-wider">Select Payment Method</p>

            {/* Method selector */}
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { id: 'card',        icon: <CreditCard size={18} />,   label: 'Credit / Debit Card' },
                { id: 'upi',         icon: <Smartphone size={18} />,   label: 'UPI' },
                { id: 'netbanking',  icon: <Building2 size={18} />,    label: 'Net Banking' },
                { id: 'wallet',      icon: <Wallet size={18} />,       label: 'Wallets' },
              ] as { id: PaymentMethod; icon: React.ReactNode; label: string }[]).map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-2 py-3.5 px-3 rounded-2xl border text-xs font-semibold transition-all ${
                    method === m.id
                      ? 'bg-[#00fde7]/10 border-[#00fde7] text-[#00fde7]'
                      : 'bg-[#141c00] border-white/5 text-[#92b900] hover:border-white/20 hover:text-white'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Amount reminder */}
            <div className="flex items-center justify-between bg-[#141c00] rounded-xl px-4 py-2.5 border border-white/5 text-xs">
              <span className="text-[#92b900]">Amount to pay</span>
              <span className="font-extrabold text-[#00fde7] text-base">{displayPrice}</span>
            </div>

            <button
              onClick={() => setStep('details')}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] shadow-lg shadow-[#00fde7]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              Continue with {method === 'card' ? 'Card' : method === 'upi' ? 'UPI' : method === 'netbanking' ? 'Net Banking' : 'Wallet'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── STEP: details ── */}
        {step === 'details' && (
          <form onSubmit={handlePay} className="px-6 py-5 space-y-4">

            {/* ── Card form ── */}
            {method === 'card' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#92b900] uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard size={13} /> Card Details
                </p>
                <div>
                  <label className="block text-[11px] text-[#92b900] mb-1">Card Number</label>
                  <input
                    required value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-[#00fde7] tracking-widest"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#92b900] mb-1">Cardholder Name</label>
                  <input
                    required value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder="Name as on card"
                    className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#00fde7]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#92b900] mb-1">Expiry</label>
                    <input
                      required value={cardExpiry}
                      onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM / YY"
                      className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-[#00fde7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#92b900] mb-1">CVV</label>
                    <input
                      required value={cardCvv} maxLength={4}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      type="password"
                      className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-[#00fde7]"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-[#92b900] cursor-pointer">
                  <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-[#00fde7] bg-[#0a1000]" />
                  <span>Securely save card for future payments</span>
                </label>
              </div>
            )}

            {/* ── UPI form ── */}
            {method === 'upi' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#92b900] uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone size={13} /> UPI Payment
                </p>
                <div>
                  <label className="block text-[11px] text-[#92b900] mb-1">UPI ID</label>
                  <input
                    required value={upiId}
                    onChange={e => { setUpiId(e.target.value); setUpiError(''); }}
                    placeholder="yourname@upi"
                    className={`w-full bg-[#0a1000] border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#00fde7] ${upiError ? 'border-[#ff5b5b]' : 'border-white/10'}`}
                  />
                  {upiError && <p className="text-[11px] text-[#ff5b5b] mt-1 flex items-center gap-1"><AlertCircle size={11} />{upiError}</p>}
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {['@oksbi', '@ybl', '@paytm', '@ibl'].map(suffix => (
                    <button key={suffix} type="button"
                      onClick={() => setUpiId(prev => prev.split('@')[0] + suffix)}
                      className="text-[11px] py-1 rounded-lg bg-[#141c00] border border-white/5 text-[#92b900] hover:border-[#00fde7]/40 hover:text-[#00fde7] transition-colors font-mono">
                      {suffix}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Net Banking ── */}
            {method === 'netbanking' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#92b900] uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={13} /> Select Your Bank
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar">
                  {BANKS.map(bank => (
                    <button key={bank} type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${
                        selectedBank === bank
                          ? 'border-[#00fde7] bg-[#00fde7]/10 text-[#00fde7] font-semibold'
                          : 'border-white/5 bg-[#141c00] text-[#92b900] hover:border-white/20 hover:text-white'
                      }`}>
                      {bank}
                    </button>
                  ))}
                </div>
                {!selectedBank && <p className="text-[11px] text-[#92b900]">Select a bank to continue.</p>}
              </div>
            )}

            {/* ── Wallets ── */}
            {method === 'wallet' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#92b900] uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet size={13} /> Select Wallet
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {WALLETS.map(w => (
                    <button key={w.id} type="button"
                      onClick={() => setSelectedWallet(w.id)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                        selectedWallet === w.id
                          ? 'border-[#00fde7] bg-[#00fde7]/10 text-[#00fde7]'
                          : 'border-white/5 bg-[#141c00] text-[#92b900] hover:border-white/20 hover:text-white'
                      }`}>
                      <span className="text-lg">{w.icon}</span>
                      <span>{w.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── OTP step (shown after first submit) ── */}
            {otpSent && (
              <div className="bg-[#141c00] rounded-2xl p-4 border border-[#00fde7]/20 space-y-2">
                <p className="text-xs text-[#00fde7] font-semibold flex items-center gap-1.5">
                  <Smartphone size={13} /> OTP sent to registered mobile
                </p>
                <p className="text-[11px] text-[#92b900]">Enter the 6-digit OTP (use <span className="text-white font-mono">123456</span> for demo)</p>
                <input
                  required value={otp} maxLength={6}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
                  placeholder="• • • • • •"
                  className={`w-full bg-[#0a1000] border rounded-xl px-4 py-2.5 text-lg text-white font-mono tracking-[0.4em] text-center outline-none focus:border-[#00fde7] ${otpError ? 'border-[#ff5b5b]' : 'border-white/10'}`}
                />
                {otpError && <p className="text-[11px] text-[#ff5b5b] flex items-center gap-1"><AlertCircle size={11} />{otpError}</p>}
              </div>
            )}

            {/* Pay button */}
            <button
              type="submit"
              disabled={method === 'netbanking' && !selectedBank || method === 'wallet' && !selectedWallet}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] shadow-lg shadow-[#00fde7]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lock size={15} />
              <span>{otpSent ? `Verify & Pay ${displayPrice}` : `Pay ${displayPrice} Securely`}</span>
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#92b900]">
              <Lock size={11} />
              <span>256-bit SSL · RBI compliant · PCI-DSS Level 1</span>
            </p>

            <button type="button" onClick={() => { setStep('method'); setOtpSent(false); setOtp(''); setOtpError(''); }}
              className="w-full text-xs text-[#92b900] hover:text-white transition-colors">
              ← Change payment method
            </button>
          </form>
        )}

        {/* ── STEP: processing ── */}
        {step === 'processing' && (
          <div className="px-6 py-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#00fde7]/10 border border-[#00fde7]/30 flex items-center justify-center">
              <Loader2 size={30} className="text-[#00fde7] animate-spin" />
            </div>
            <h3 className="font-bold text-white text-lg">Processing Payment…</h3>
            <p className="text-xs text-[#92b900] text-center">Please do not close or refresh this page.</p>
            <div className="w-48 h-1 bg-[#141c00] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#00fde7] rounded-full animate-[grow_2s_ease-in-out_forwards]" style={{ width: '100%', transformOrigin: 'left', animation: 'none', transition: 'width 2s ease' }} />
            </div>
          </div>
        )}

        {/* ── STEP: success ── */}
        {step === 'success' && (
          <div className="px-6 py-12 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#00fde7]/15 border-2 border-[#00fde7] flex items-center justify-center">
              <CheckCircle2 size={40} className="text-[#00fde7]" />
            </div>
            <h3 className="font-serif-heading font-extrabold text-white text-2xl">Payment Successful!</h3>
            <p className="text-sm text-[#92b900] text-center">
              Welcome to <span className="text-[#00fde7] font-semibold">{plan.name}</span>.<br />
              Your Pro features are now active.
            </p>
            <div className="bg-[#141c00] rounded-2xl px-5 py-3 border border-[#00fde7]/20 text-xs space-y-1.5 w-full">
              <div className="flex justify-between"><span className="text-[#92b900]">Amount Paid</span><span className="text-white font-bold">{displayPrice}</span></div>
              <div className="flex justify-between"><span className="text-[#92b900]">Transaction ID</span><span className="text-white font-mono">TXN{Date.now().toString().slice(-8)}</span></div>
              <div className="flex justify-between"><span className="text-[#92b900]">Status</span><span className="text-[#00fde7] font-semibold">Confirmed ✓</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Premium Screen ───────────────────────────────────────────────────
export const PremiumScreen: React.FC<PremiumScreenProps> = ({ user, onUpgradePlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('student');
  const [gatewayPlan, setGatewayPlan] = useState<PlanConfig | null>(null);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const handleOpenGateway = (plan: PlanConfig) => {
    setGatewayPlan(plan);
  };

  const handlePaymentSuccess = (planName: string) => {
    onUpgradePlan(planName);
  };

  return (
    <div className="flex flex-col gap-8 pb-32 max-w-5xl mx-auto">

      {/* Header */}
      <section className="text-center flex flex-col items-center gap-3 pt-2">
        <div className="inline-flex items-center gap-2 bg-[#ff5b5b]/20 border border-[#ff5b5b]/40 text-[#ff5b5b] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Saregama Pro Experience</span>
        </div>
        <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#00fde7] tracking-tight">
          Pure Music Without Interruptions
        </h2>
        <p className="text-sm md:text-base text-[#92b900] max-w-2xl">
          Upgrade to eliminate ads, unlock full offline storage, and experience studio-grade lossless audio.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center gap-3 mt-4 bg-[#141c00] p-1.5 rounded-full border border-white/10">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-[#00fde7] text-[#00443d] font-bold shadow-md' : 'text-[#92b900] hover:text-white'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-[#00fde7] text-[#00443d] font-bold shadow-md' : 'text-[#92b900] hover:text-white'}`}
          >
            <span>Annual</span>
            <span className="bg-[#ff5b5b] text-white text-[9px] px-1.5 rounded font-bold">SAVE 25%</span>
          </button>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {PLANS.map(plan => {
          const isSelected = selectedPlanId === plan.id;
          const isCurrent = user.planName.toLowerCase().includes(plan.id);
          const isLifetime = plan.id === 'lifetime';
          const displayAmt = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
          const displayINR = isLifetime ? plan.annualPriceINR : (billingCycle === 'annual' ? plan.annualPriceINR : plan.monthlyPriceINR);

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`bg-[#141c00] rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-300 relative cursor-pointer ${
                isSelected ? 'border-[#00fde7] ring-2 ring-[#00fde7]/30 shadow-2xl shadow-[#00fde7]/10 -translate-y-1' : 'border-white/5 hover:border-white/20'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6 bg-[#00fde7] text-[#00443d] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="font-serif-heading font-bold text-xl text-white mt-1">{plan.name}</h3>

                <div className="mt-4 mb-1 flex items-baseline gap-1">
                  <span className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-[#00fde7]">{displayAmt}</span>
                  <span className="text-xs text-[#92b900]">/ {isLifetime ? 'once' : 'month'}</span>
                </div>
                <p className="text-[11px] text-[#cafd1e] font-semibold mb-1">{displayINR} {isLifetime ? '(one-time)' : `/ ${billingCycle === 'annual' ? 'mo' : 'month'} INR`}</p>
                <p className="text-xs text-[#92b900] mb-5">
                  {billingCycle === 'annual' ? plan.annualBilled : 'Billed monthly, cancel anytime'}
                </p>

                {/* Features */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#cafd1e]">
                      <Check size={14} className="text-[#00fde7] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 pt-4">
                <button
                  onClick={e => { e.stopPropagation(); if (!isCurrent) handleOpenGateway(plan); }}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-[#192300] border border-[#00fde7]/40 text-[#00fde7] cursor-default'
                      : isSelected
                      ? 'bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] shadow-lg shadow-[#00fde7]/20 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-[#1f2a00] hover:bg-[#2c3a00] text-[#cafd1e]'
                  }`}
                >
                  {isCurrent ? (
                    <span>Current Active Plan</span>
                  ) : (
                    <>
                      <span>Subscribe — {displayINR}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Why Saregama */}
      <section className="bg-[#141c00] rounded-3xl p-6 sm:p-8 border border-white/5 text-left">
        <h3 className="font-serif-heading font-bold text-xl text-white mb-6 text-center">
          Why Saregama is Built Differently
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <ShieldCheck size={22} />, title: 'Zero Advertising', desc: 'No audio sponsorships, loud commercial interruptions, or tracking scripts during listening.' },
            { icon: <Waves size={22} />,       title: '40Hz Binaural Audio', desc: 'Synthesized pure acoustic frequency layers designed for immersive spatial listening.' },
            { icon: <DownloadCloud size={22} />, title: 'Protected Offline Mode', desc: 'Keep listening seamlessly in transit, on flights, and remote spots without WiFi.' },
            { icon: <Volume2 size={22} />,     title: 'Lossless Studio Fidelity', desc: 'Clean 320 kbps & FLAC streams preserving analog acoustic harmonics and subtle vinyl texture.' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#00fde7]/10 flex items-center justify-center text-[#00fde7]">
                {item.icon}
              </div>
              <h4 className="font-semibold text-sm text-white">{item.title}</h4>
              <p className="text-xs text-[#92b900] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Gateway Modal */}
      {gatewayPlan && (
        <GatewayModal
          plan={gatewayPlan}
          billingCycle={billingCycle}
          onClose={() => setGatewayPlan(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
