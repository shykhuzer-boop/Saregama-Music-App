import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import {
  Sparkles, Check, ShieldCheck, DownloadCloud, Volume2, Waves,
  ArrowRight, X, CreditCard, Smartphone, Building2, Wallet,
  Lock, CheckCircle2, Loader2, AlertCircle, ChevronRight,
  Wifi, RefreshCw, Copy, Star,
} from 'lucide-react';

interface PremiumScreenProps {
  user: UserProfile;
  onUpgradePlan: (planName: string) => void;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi';
type GatewayStep = 'checkout' | 'processing' | 'success' | 'failed';

interface PlanConfig {
  id: string; name: string; badge: string;
  monthlyPrice: string; annualPrice: string;
  annualPriceINR: string; monthlyPriceINR: string;
  annualBilled: string; features: string[]; color: string;
}

const PLANS: PlanConfig[] = [
  {
    id: 'student', name: 'Student Membership', badge: 'Most Popular for Students',
    monthlyPrice: '$3.99', annualPrice: '$2.99',
    monthlyPriceINR: '₹329', annualPriceINR: '₹249',
    annualBilled: '$35.88 / year', color: '#00fde7',
    features: ['Ad-free uninterrupted music streaming','Offline downloads on up to 3 devices','40Hz Gamma & Alpha acoustic presets','Standard Lossless 320 kbps audio','Student ID verification valid for 4 years'],
  },
  {
    id: 'professional', name: 'Pro Master Audio', badge: 'Audiophile Choice',
    monthlyPrice: '$8.99', annualPrice: '$6.99',
    monthlyPriceINR: '₹749', annualPriceINR: '₹579',
    annualBilled: '$83.88 / year', color: '#cafd1e',
    features: ['Everything in Student Plan','Unlimited offline storage and album caching','Hi-Res Lossless FLAC 24-bit studio fidelity','Live Synthesizer soundscape customizer','Synchronized cross-device playback resumption','Priority feature requests & early releases'],
  },
  {
    id: 'lifetime', name: 'Lifetime Music Pass', badge: 'One-Time Payment',
    monthlyPrice: '$149.00', annualPrice: '$149.00',
    monthlyPriceINR: '₹12,499', annualPriceINR: '₹12,499',
    annualBilled: 'Pay once, own forever', color: '#ffb700',
    features: ['Lifetime access to all current and future albums','Zero subscription fees forever','All Pro & Master acoustic soundscapes','Direct VIP support channel'],
  },
];

const BANKS = [
  { name: 'State Bank of India', abbr: 'SBI',  color: '#1a3a6b' },
  { name: 'HDFC Bank',           abbr: 'HDFC', color: '#004c8f' },
  { name: 'ICICI Bank',          abbr: 'ICICI',color: '#b0272b' },
  { name: 'Axis Bank',           abbr: 'AXIS', color: '#97144d' },
  { name: 'Kotak Bank',          abbr: 'KMB',  color: '#e84118' },
  { name: 'Punjab National Bank',abbr: 'PNB',  color: '#004225' },
  { name: 'Bank of Baroda',      abbr: 'BOB',  color: '#f7941d' },
  { name: 'Canara Bank',         abbr: 'CNR',  color: '#00529b' },
  { name: 'IndusInd Bank',       abbr: 'IIB',  color: '#672d89' },
  { name: 'Yes Bank',            abbr: 'YES',  color: '#00a6a6' },
];

const WALLETS = [
  { id: 'paytm',     label: 'Paytm',       bg: '#002970', emoji: '💙' },
  { id: 'phonepe',   label: 'PhonePe',     bg: '#5f259f', emoji: '💜' },
  { id: 'amazonpay', label: 'Amazon Pay',  bg: '#ff9900', emoji: '🟠' },
  { id: 'mobikwik',  label: 'MobiKwik',    bg: '#0082c9', emoji: '🔵' },
  { id: 'freecharge',label: 'FreeCharge',  bg: '#f7941d', emoji: '🟡' },
  { id: 'airtel',    label: 'Airtel Money',bg: '#e40000', emoji: '🔴' },
];

const EMI_PLANS = [
  { months: 3,  rateLabel: 'No Cost',    extra: '₹0 extra',  badge: 'Popular' },
  { months: 6,  rateLabel: '1.5% p.m.', extra: '+₹49',      badge: '' },
  { months: 9,  rateLabel: '1.5% p.m.', extra: '+₹72',      badge: '' },
  { months: 12, rateLabel: '1.5% p.m.', extra: '+₹98',      badge: 'Flexible' },
];

function fmtCard(v: string) { return v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim(); }
function fmtExp(v: string)  { const d=v.replace(/\D/g,'').slice(0,4); return d.length>2?`${d.slice(0,2)} / ${d.slice(2)}`:d; }
function cardType(n: string): 'visa'|'mc'|'rupay'|'amex'|'' {
  const d = n.replace(/\s/g,'');
  if (/^4/.test(d))          return 'visa';
  if (/^5[1-5]/.test(d))     return 'mc';
  if (/^6/.test(d))          return 'rupay';
  if (/^3[47]/.test(d))      return 'amex';
  return '';
}
function txnId() { return 'pay_' + Math.random().toString(36).slice(2,12).toUpperCase(); }

// ─────────────────────────────────────────────────────────────────────────────
// CARD PREVIEW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CardPreview: React.FC<{ number: string; name: string; expiry: string; flipped: boolean }> = ({ number, name, expiry, flipped }) => {
  const type = cardType(number);
  const display = number.padEnd(19, '•').replace(/(....)/g, '$1 ').trim();
  const expDisplay = expiry || 'MM / YY';

  const NetworkBadge = () => (
    <div className="text-right">
      {type === 'visa'  && <span className="font-bold italic text-white text-xl tracking-widest">VISA</span>}
      {type === 'mc'    && <div className="flex gap-[-4px]"><div className="w-7 h-7 rounded-full bg-red-500 opacity-90" /><div className="w-7 h-7 rounded-full bg-yellow-400 opacity-90 -ml-3" /></div>}
      {type === 'rupay' && <span className="font-bold text-white text-sm bg-orange-600 px-2 py-0.5 rounded">RuPay</span>}
      {type === 'amex'  && <span className="font-bold text-white text-sm">AMEX</span>}
      {type === ''      && <div className="w-10 h-6 rounded bg-white/20" />}
    </div>
  );

  return (
    <div className="relative w-full h-44 [perspective:1000px] select-none">
      <div className={`w-full h-full relative [transform-style:preserve-3d] transition-transform duration-500 ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-gradient-to-br from-[#1a2e00] via-[#0d2200] to-[#001a33] border border-white/10 p-5 flex flex-col justify-between shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)' }} />
          <div className="flex justify-between items-start">
            <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-90 flex items-center justify-center">
              <div className="w-5 h-3.5 rounded-sm border-2 border-yellow-700/50" />
            </div>
            <NetworkBadge />
          </div>
          <div>
            <p className="font-mono text-white text-lg tracking-[0.2em] font-bold">{display}</p>
            <div className="flex justify-between items-end mt-3">
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-wider">Card Holder</p>
                <p className="text-white text-xs font-semibold mt-0.5 truncate max-w-[140px]">{name || 'YOUR NAME'}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-white/40 uppercase tracking-wider">Expires</p>
                <p className="text-white text-xs font-semibold mt-0.5">{expDisplay}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] border border-white/10 overflow-hidden shadow-2xl">
          <div className="w-full h-10 bg-black/80 mt-6" />
          <div className="px-5 mt-4">
            <div className="w-full h-8 bg-white/10 rounded flex items-center justify-end pr-3">
              <p className="font-mono text-white text-sm tracking-widest">•••</p>
            </div>
            <p className="text-[10px] text-white/40 mt-2 text-right">CVV</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GATEWAY MODAL — Razorpay-style split layout
// ─────────────────────────────────────────────────────────────────────────────
interface GatewayModalProps {
  plan: PlanConfig;
  billingCycle: 'monthly' | 'annual';
  onClose: () => void;
  onSuccess: (planName: string) => void;
}

const GatewayModal: React.FC<GatewayModalProps> = ({ plan, billingCycle, onClose, onSuccess }) => {
  const isLifetime = plan.id === 'lifetime';
  const displayINR  = isLifetime ? plan.annualPriceINR : (billingCycle === 'annual' ? plan.annualPriceINR : plan.monthlyPriceINR);
  const displayUSD  = isLifetime ? plan.annualPrice    : (billingCycle === 'annual' ? plan.annualPrice    : plan.monthlyPrice);

  // Top-level step
  const [step, setStep]       = useState<GatewayStep>('checkout');
  const [method, setMethod]   = useState<PaymentMethod>('upi');

  // Card state
  const [cardNum, setCardNum]   = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp]   = useState('');
  const [cardCvv, setCardCvv]   = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [flipped, setFlipped]   = useState(false);

  // UPI state
  const [upiId, setUpiId]         = useState('');
  const [upiError, setUpiError]   = useState('');
  const [upiMode, setUpiMode]     = useState<'id'|'qr'>('id');
  const [upiPoll, setUpiPoll]     = useState(false);
  const [upiCountdown, setUpiCountdown] = useState(300); // 5 min

  // Net banking
  const [bank, setBank]           = useState('');

  // Wallet
  const [wallet, setWallet]       = useState('');

  // EMI
  const [emiPlan, setEmiPlan]     = useState(3);

  // OTP
  const [otpSent, setOtpSent]     = useState(false);
  const [otp, setOtp]             = useState('');
  const [otpErr, setOtpErr]       = useState('');

  // Result
  const [txn]                     = useState(txnId);
  const [progress, setProgress]   = useState(0);

  const methods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'upi',        label: 'UPI',             icon: <Smartphone size={15} /> },
    { id: 'card',       label: 'Card',            icon: <CreditCard size={15} /> },
    { id: 'netbanking', label: 'Net Banking',     icon: <Building2 size={15} /> },
    { id: 'wallet',     label: 'Wallets',         icon: <Wallet size={15} /> },
    { id: 'emi',        label: 'EMI',             icon: <Star size={15} /> },
  ];

  // UPI QR countdown
  useEffect(() => {
    if (!upiPoll) return;
    if (upiCountdown <= 0) { setUpiPoll(false); return; }
    const t = setTimeout(() => setUpiCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [upiPoll, upiCountdown]);

  // Progress bar during processing
  useEffect(() => {
    if (step !== 'processing') return;
    setProgress(0);
    const t = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(t); return 100; } return p + 2; }), 40);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setStep('success'), 300);
    }
  }, [progress]);

  const startProcessing = () => {
    setStep('processing');
    setTimeout(() => { onSuccess(plan.name); }, 4500);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'upi' && upiMode === 'id') {
      if (!upiId.match(/^[\w.\-_]{2,}@[a-zA-Z]{3,}$/)) { setUpiError('Enter a valid UPI ID — e.g. name@upi'); return; }
    }
    if (!otpSent) { setOtpSent(true); return; }
    if (otp !== '123456') { setOtpErr('Wrong OTP. For demo use 123456'); return; }
    startProcessing();
  };

  const handleUpiQrPay = () => { setUpiPoll(true); setTimeout(() => { setUpiPoll(false); startProcessing(); }, 6000); };

  const fmtTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  if (step === 'processing') return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1200] border border-white/10 rounded-3xl w-full max-w-sm p-8 shadow-2xl flex flex-col items-center gap-5">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#00fde7]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00fde7] animate-spin" />
          <div className="absolute inset-2 rounded-full bg-[#00fde7]/10 flex items-center justify-center">
            <Lock size={22} className="text-[#00fde7]" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-white text-lg">Processing Payment</h3>
          <p className="text-xs text-[#92b900] mt-1">Please wait, do not press back or close</p>
        </div>
        <div className="w-full bg-[#141c00] rounded-full h-2 overflow-hidden border border-white/5">
          <div className="h-full bg-gradient-to-r from-[#00fde7] to-[#cafd1e] rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs text-[#92b900]">Transaction ID</p>
          <p className="font-mono text-white text-sm">{txn}</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#92b900]">
          <Wifi size={12} className="animate-pulse text-[#00fde7]" />
          <span>Connecting to payment gateway…</span>
        </div>
      </div>
    </div>
  );

  if (step === 'success') return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1200] border border-[#00fde7]/30 rounded-3xl w-full max-w-sm p-8 shadow-2xl flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#00fde7]/10 border-2 border-[#00fde7] flex items-center justify-center">
            <CheckCircle2 size={40} className="text-[#00fde7]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#cafd1e] rounded-full flex items-center justify-center shadow-lg">
            <Check size={14} className="text-[#141c00]" strokeWidth={3} />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-serif-heading font-extrabold text-white text-2xl">Payment Successful!</h3>
          <p className="text-sm text-[#92b900] mt-1.5">
            Welcome to <span className="text-[#00fde7] font-semibold">{plan.name}</span>
          </p>
        </div>
        <div className="w-full bg-[#141c00] rounded-2xl p-4 border border-white/5 space-y-2.5 text-xs">
          <div className="flex justify-between"><span className="text-[#92b900]">Amount Paid</span><span className="text-white font-bold">{displayINR}</span></div>
          <div className="flex justify-between"><span className="text-[#92b900]">Plan</span><span className="text-white font-semibold">{plan.name}</span></div>
          <div className="flex justify-between"><span className="text-[#92b900]">Transaction ID</span>
            <span className="text-white font-mono flex items-center gap-1">{txn.slice(0,14)}
              <button onClick={() => navigator.clipboard?.writeText(txn)} className="text-[#00fde7] hover:text-white"><Copy size={10} /></button>
            </span>
          </div>
          <div className="flex justify-between"><span className="text-[#92b900]">Status</span><span className="text-[#00fde7] font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00fde7] animate-pulse" />Captured</span></div>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-sm transition-all hover:scale-[1.01]">
          Start Listening →
        </button>
      </div>
    </div>
  );

  if (step === 'failed') return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e1200] border border-[#ff5b5b]/30 rounded-3xl w-full max-w-sm p-8 shadow-2xl flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#ff5b5b]/10 border-2 border-[#ff5b5b] flex items-center justify-center">
          <AlertCircle size={40} className="text-[#ff5b5b]" />
        </div>
        <div className="text-center">
          <h3 className="font-serif-heading font-extrabold text-white text-2xl">Payment Failed</h3>
          <p className="text-sm text-[#92b900] mt-1.5">Your payment could not be processed. No amount was deducted.</p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={() => { setStep('checkout'); setOtpSent(false); setOtp(''); }} className="flex-1 py-3 rounded-xl bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-sm flex items-center justify-center gap-2">
            <RefreshCw size={14} /> Retry
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm">Close</button>
        </div>
      </div>
    </div>
  );

  // ── checkout step (split layout like Razorpay) ────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#0b0f00] border border-white/10 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col sm:flex-row max-h-[95vh]">

        {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
        <div className="sm:w-72 bg-gradient-to-b from-[#001a00] to-[#000d00] p-6 flex flex-col justify-between gap-6 shrink-0">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#00fde7]/10 border border-[#00fde7]/30 flex items-center justify-center">
                <Waves size={18} className="text-[#00fde7]" />
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-tight">Saregama</p>
                <p className="text-[10px] text-[#92b900]">Secure Checkout</p>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-5">
              <p className="text-[11px] text-[#92b900] uppercase tracking-wider mb-1">Amount Due</p>
              <p className="font-serif-heading font-extrabold text-3xl text-[#00fde7]">{displayINR}</p>
              <p className="text-xs text-[#92b900] mt-0.5">{displayUSD} · {isLifetime ? 'One-time' : billingCycle}</p>
            </div>

            {/* Order details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#92b900]">Plan</span>
                <span className="text-white font-semibold text-right max-w-[130px]">{plan.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#92b900]">Billing</span>
                <span className="text-white font-semibold capitalize">{isLifetime ? 'One-time' : billingCycle}</span>
              </div>
              {plan.features.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-[#cafd1e]/80 py-0.5">
                  <Check size={11} className="text-[#00fde7] shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-[#92b900]">
              <Lock size={11} className="text-[#00fde7] shrink-0" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#92b900]">
              <ShieldCheck size={11} className="text-[#00fde7] shrink-0" />
              <span>RBI Compliant · PCI-DSS Level 1</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#92b900]">
              <Wifi size={11} className="text-[#00fde7] shrink-0" />
              <span>Powered by Razorpay</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
            <p className="text-xs font-semibold text-white">Choose Payment Method</p>
            <button onClick={onClose} className="text-[#92b900] hover:text-white transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          {/* Method tabs */}
          <div className="flex gap-1 px-4 pt-4 pb-2 overflow-x-auto no-scrollbar shrink-0">
            {methods.map(m => (
              <button key={m.id} onClick={() => { setMethod(m.id); setOtpSent(false); setOtp(''); setOtpErr(''); }}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  method === m.id
                    ? 'bg-[#00fde7]/10 border-[#00fde7] text-[#00fde7]'
                    : 'bg-transparent border-white/5 text-[#92b900] hover:border-white/20 hover:text-white'
                }`}>
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Scrollable form area */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 pt-2">

            <form onSubmit={handlePay} className="space-y-4">

              {/* ── UPI ── */}
              {method === 'upi' && (
                <div className="space-y-4">
                  {/* UPI mode toggle */}
                  <div className="flex gap-2">
                    {(['id','qr'] as const).map(m => (
                      <button key={m} type="button" onClick={() => { setUpiMode(m); setUpiPoll(false); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${upiMode===m?'bg-[#00fde7]/10 border-[#00fde7] text-[#00fde7]':'border-white/5 text-[#92b900] hover:text-white'}`}>
                        {m === 'id' ? '📝 Enter UPI ID' : '📷 Scan QR Code'}
                      </button>
                    ))}
                  </div>

                  {upiMode === 'id' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] text-[#92b900] mb-1.5 font-medium">UPI ID</label>
                        <div className="relative">
                          <input required value={upiId} onChange={e => { setUpiId(e.target.value); setUpiError(''); }}
                            placeholder="mobilenumber@upi"
                            className={`w-full bg-[#0a1000] border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00fde7] transition-colors ${upiError?'border-[#ff5b5b]':'border-white/10'}`}
                          />
                          {upiId && !upiError && <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00fde7]" />}
                        </div>
                        {upiError && <p className="text-[11px] text-[#ff5b5b] mt-1 flex items-center gap-1"><AlertCircle size={11}/>{upiError}</p>}
                      </div>
                      {/* Quick handle chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {['@oksbi','@ybl','@paytm','@axl','@ibl','@upi'].map(s => (
                          <button key={s} type="button"
                            onClick={() => setUpiId(upiId.split('@')[0] + s)}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-[#141c00] border border-white/5 text-[#92b900] hover:border-[#00fde7]/40 hover:text-[#00fde7] transition-all font-mono">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {upiMode === 'qr' && (
                    <div className="flex flex-col items-center gap-4 py-2">
                      {/* Simulated QR — a patterned SVG placeholder */}
                      <div className="relative w-44 h-44 bg-white rounded-2xl p-3 shadow-xl">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* QR pattern dots */}
                          {[...Array(7)].map((_, r) => [...Array(7)].map((_, c) => {
                            const corner = (r<3&&c<3)||(r<3&&c>3)||(r>3&&c<3);
                            return corner ? null : (
                              <rect key={`${r}${c}`} x={5+c*13} y={5+r*13}
                                width={Math.random()>0.4?10:6} height={Math.random()>0.4?10:6}
                                rx="1.5" fill="#111" opacity={Math.random()>0.3?1:0.4} />
                            );
                          }))}
                          {/* Corner markers */}
                          {[[5,5],[5,72],[72,5]].map(([x,y],i) => (
                            <g key={i}>
                              <rect x={x} y={y} width={23} height={23} rx="3" fill="none" stroke="#111" strokeWidth="3.5"/>
                              <rect x={x+5} y={y+5} width={13} height={13} rx="2" fill="#111"/>
                            </g>
                          ))}
                          <text x="50" y="96" textAnchor="middle" fontSize="5" fill="#666">Saregama · UPI</text>
                        </svg>
                        {upiPoll && (
                          <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center gap-2">
                            <Loader2 size={28} className="text-[#00fde7] animate-spin" />
                            <p className="text-[11px] text-gray-600 font-medium">Waiting for payment…</p>
                            <p className="text-xs font-mono text-gray-500">{fmtTime(upiCountdown)}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs font-semibold text-white">Scan with any UPI app</p>
                        <p className="text-[11px] text-[#92b900]">Google Pay · PhonePe · Paytm · BHIM</p>
                        <p className="text-[11px] text-[#92b900]">QR valid for <span className="text-[#00fde7] font-mono">{fmtTime(upiCountdown)}</span></p>
                      </div>
                      <button type="button" onClick={handleUpiQrPay}
                        className="w-full py-3 rounded-xl bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} /> I have completed payment
                      </button>
                      {!upiPoll && (
                        <button type="button" onClick={handleUpiQrPay}
                          className="text-xs text-[#92b900] hover:text-[#00fde7] transition-colors">
                          Simulate QR scan (demo)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── CARD ── */}
              {method === 'card' && (
                <div className="space-y-4">
                  <CardPreview number={cardNum} name={cardName} expiry={cardExp} flipped={flipped} />
                  <div>
                    <label className="block text-[11px] text-[#92b900] mb-1.5 font-medium">Card Number</label>
                    <input required value={cardNum} onChange={e => setCardNum(fmtCard(e.target.value))}
                      placeholder="1234  5678  9012  3456"
                      className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono tracking-widest outline-none focus:border-[#00fde7]" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#92b900] mb-1.5 font-medium">Name on Card</label>
                    <input required value={cardName} onChange={e => setCardName(e.target.value)}
                      placeholder="As printed on card"
                      className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00fde7]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#92b900] mb-1.5 font-medium">Expiry</label>
                      <input required value={cardExp} onChange={e => setCardExp(fmtExp(e.target.value))}
                        placeholder="MM / YY"
                        className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#00fde7]" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#92b900] mb-1.5 font-medium">CVV</label>
                      <input required value={cardCvv} maxLength={4} type="password"
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g,'').slice(0,4))}
                        onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)}
                        placeholder="•••"
                        className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none focus:border-[#00fde7]" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-[#92b900] cursor-pointer">
                    <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} className="w-3.5 h-3.5 rounded accent-[#00fde7]" />
                    <span>Securely save card for faster payments</span>
                  </label>
                </div>
              )}

              {/* ── NET BANKING ── */}
              {method === 'netbanking' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-[#92b900] font-medium">Select Your Bank</p>
                  <div className="grid grid-cols-2 gap-2">
                    {BANKS.map(b => (
                      <button key={b.name} type="button" onClick={() => setBank(b.name)}
                        className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-all text-left ${bank===b.name?'border-[#00fde7] bg-[#00fde7]/10 text-[#00fde7]':'border-white/5 bg-[#0a1000] text-[#92b900] hover:border-white/20 hover:text-white'}`}>
                        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white text-[9px] font-extrabold"
                          style={{ background: b.color }}>
                          {b.abbr}
                        </div>
                        <span className="leading-tight">{b.name}</span>
                      </button>
                    ))}
                  </div>
                  {!bank && <p className="text-[11px] text-[#92b900] flex items-center gap-1"><AlertCircle size={11}/>Please select a bank to continue</p>}
                </div>
              )}

              {/* ── WALLETS ── */}
              {method === 'wallet' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-[#92b900] font-medium">Select Wallet</p>
                  <div className="grid grid-cols-2 gap-3">
                    {WALLETS.map(w => (
                      <button key={w.id} type="button" onClick={() => setWallet(w.id)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border font-semibold transition-all text-sm ${wallet===w.id?'border-[#00fde7] bg-[#00fde7]/10 text-[#00fde7]':'border-white/5 bg-[#0a1000] text-[#92b900] hover:border-white/20 hover:text-white'}`}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ background: w.bg }}>
                          {w.emoji}
                        </div>
                        <span>{w.label}</span>
                      </button>
                    ))}
                  </div>
                  {!wallet && <p className="text-[11px] text-[#92b900] flex items-center gap-1"><AlertCircle size={11}/>Please select a wallet to continue</p>}
                </div>
              )}

              {/* ── EMI ── */}
              {method === 'emi' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-[#92b900] font-medium">Select EMI Tenure</p>
                  <div className="space-y-2">
                    {EMI_PLANS.map(e => {
                      const rawINR = parseInt(displayINR.replace(/[^\d]/g,''));
                      const monthly = Math.ceil(rawINR / e.months);
                      return (
                        <button key={e.months} type="button" onClick={() => setEmiPlan(e.months)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all ${emiPlan===e.months?'border-[#00fde7] bg-[#00fde7]/10':'border-white/5 bg-[#0a1000] hover:border-white/20'}`}>
                          <div className="text-left">
                            <p className={emiPlan===e.months?'text-[#00fde7]':'text-white'}>{e.months} Months</p>
                            <p className="text-[11px] text-[#92b900] mt-0.5">{e.rateLabel} · {e.extra}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-base ${emiPlan===e.months?'text-[#00fde7]':'text-white'}`}>₹{monthly.toLocaleString('en-IN')}</p>
                            <p className="text-[10px] text-[#92b900]">per month</p>
                          </div>
                          {e.badge && <span className="ml-2 bg-[#cafd1e] text-[#141c00] text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">{e.badge}</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-[#92b900]">Processed via your saved card. Standard EMI terms apply.</p>
                </div>
              )}

              {/* ── OTP box ── */}
              {otpSent && method !== 'upi' && (
                <div className="bg-[#0a1200] rounded-2xl p-4 border border-[#00fde7]/20 space-y-2.5">
                  <div className="flex items-center gap-2 text-[#00fde7]">
                    <Smartphone size={14} />
                    <p className="text-xs font-semibold">OTP sent to your registered mobile number</p>
                  </div>
                  <p className="text-[11px] text-[#92b900]">Enter 6-digit OTP — use <span className="text-white font-mono font-bold">123456</span> for demo</p>
                  <div className="flex gap-2">
                    {[...Array(6)].map((_, i) => (
                      <input key={i} maxLength={1} value={otp[i] || ''} readOnly
                        className={`flex-1 h-11 rounded-xl border text-center font-mono text-base text-white bg-[#141c00] outline-none ${otp[i]?'border-[#00fde7] text-[#00fde7]':'border-white/10'}`} />
                    ))}
                  </div>
                  <input type="text" maxLength={6} value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g,'').slice(0,6)); setOtpErr(''); }}
                    placeholder="Enter OTP"
                    className={`w-full bg-transparent border rounded-xl px-4 py-2.5 text-sm text-white font-mono tracking-[0.5em] text-center outline-none focus:border-[#00fde7] ${otpErr?'border-[#ff5b5b]':'border-white/10'}`} />
                  {otpErr && <p className="text-[11px] text-[#ff5b5b] flex items-center gap-1"><AlertCircle size={11}/>{otpErr}</p>}
                  <button type="button" className="text-[11px] text-[#00fde7] hover:text-white transition-colors">Resend OTP</button>
                </div>
              )}

              {/* ── PAY BUTTON ── */}
              {!(method === 'upi' && upiMode === 'qr') && (
                <button type="submit"
                  disabled={(method==='netbanking'&&!bank)||(method==='wallet'&&!wallet)}
                  className="w-full py-4 rounded-xl bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-sm shadow-lg shadow-[#00fde7]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
                  <Lock size={15} />
                  <span>{otpSent ? `Verify & Pay ${displayINR}` : `Pay ${displayINR} Securely`}</span>
                </button>
              )}

              <p className="text-center text-[10px] text-[#92b900] flex items-center justify-center gap-1.5 pt-1">
                <Lock size={10} />
                <span>Your payment info is encrypted and secure</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PREMIUM SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export const PremiumScreen: React.FC<PremiumScreenProps> = ({ user, onUpgradePlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [gatewayPlan, setGatewayPlan]   = useState<PlanConfig | null>(null);

  return (
    <div className="flex flex-col gap-8 pb-32 max-w-5xl mx-auto">

      {/* Header */}
      <section className="text-center flex flex-col items-center gap-3 pt-2">
        <div className="inline-flex items-center gap-2 bg-[#ff5b5b]/20 border border-[#ff5b5b]/40 text-[#ff5b5b] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} /><span>Saregama Pro Experience</span>
        </div>
        <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#00fde7] tracking-tight">
          Pure Music Without Interruptions
        </h2>
        <p className="text-sm md:text-base text-[#92b900] max-w-2xl">
          Upgrade to eliminate ads, unlock full offline storage, and experience studio-grade lossless audio.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center gap-1 mt-4 bg-[#141c00] p-1.5 rounded-full border border-white/10">
          <button onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${billingCycle==='monthly'?'bg-[#00fde7] text-[#00443d] font-bold shadow-md':'text-[#92b900] hover:text-white'}`}>
            Monthly
          </button>
          <button onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${billingCycle==='annual'?'bg-[#00fde7] text-[#00443d] font-bold shadow-md':'text-[#92b900] hover:text-white'}`}>
            <span>Annual</span>
            <span className="bg-[#ff5b5b] text-white text-[9px] px-1.5 rounded font-bold">SAVE 25%</span>
          </button>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {PLANS.map(plan => {
          const isCurrent = user.planName.toLowerCase().includes(plan.id);
          const isLifetime = plan.id === 'lifetime';
          const displayAmt = billingCycle === 'annual' ? plan.annualPrice    : plan.monthlyPrice;
          const displayINR = isLifetime ? plan.annualPriceINR : (billingCycle==='annual'?plan.annualPriceINR:plan.monthlyPriceINR);

          return (
            <div key={plan.id}
              className={`bg-[#141c00] rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-300 relative ${
                isCurrent?'border-[#00fde7] ring-2 ring-[#00fde7]/20':'border-white/5 hover:border-white/20 hover:-translate-y-1'}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-6 bg-[#00fde7] text-[#00443d] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}
              <div>
                <h3 className="font-serif-heading font-bold text-xl text-white mt-1">{plan.name}</h3>
                <div className="mt-4 mb-1 flex items-baseline gap-1">
                  <span className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-[#00fde7]">{displayAmt}</span>
                  <span className="text-xs text-[#92b900]">/ {isLifetime?'once':'month'}</span>
                </div>
                <p className="text-[11px] text-[#cafd1e] font-semibold mb-1">{displayINR} {isLifetime?'(one-time)':`/ ${billingCycle==='annual'?'mo':'month'} INR`}</p>
                <p className="text-xs text-[#92b900] mb-5">{billingCycle==='annual'?plan.annualBilled:'Billed monthly, cancel anytime'}</p>
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  {plan.features.map((f,i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#cafd1e]">
                      <Check size={14} className="text-[#00fde7] shrink-0 mt-0.5" /><span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-4">
                <button
                  onClick={() => { if (!isCurrent) setGatewayPlan(plan); }}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-[#192300] border border-[#00fde7]/40 text-[#00fde7] cursor-default'
                      : 'bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] shadow-lg shadow-[#00fde7]/20 hover:scale-[1.02] active:scale-[0.98]'
                  }`}>
                  {isCurrent ? 'Current Active Plan' : <><span>Subscribe — {displayINR}</span><ArrowRight size={15}/></>}
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
            { icon:<ShieldCheck size={22}/>, title:'Zero Advertising',       desc:'No audio interruptions, loud commercials, or third-party tracking scripts.' },
            { icon:<Waves size={22}/>,       title:'40Hz Binaural Audio',    desc:'Pure acoustic frequency layers engineered for deep focus and immersive spatial experience.' },
            { icon:<DownloadCloud size={22}/>,title:'Protected Offline Mode',desc:'Full playback in flights, transit, and no-signal areas — crystal-clear lossless.' },
            { icon:<Volume2 size={22}/>,     title:'Studio Lossless Fidelity',desc:'320 kbps & FLAC streams preserving analog warmth, resonance, and raga overtones.' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#00fde7]/10 flex items-center justify-center text-[#00fde7]">{item.icon}</div>
              <h4 className="font-semibold text-sm text-white">{item.title}</h4>
              <p className="text-xs text-[#92b900] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gateway Modal */}
      {gatewayPlan && (
        <GatewayModal
          plan={gatewayPlan}
          billingCycle={billingCycle}
          onClose={() => setGatewayPlan(null)}
          onSuccess={planName => { onUpgradePlan(planName); setGatewayPlan(null); }}
        />
      )}
    </div>
  );
};
