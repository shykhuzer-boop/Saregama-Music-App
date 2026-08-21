import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  DownloadCloud, 
  Volume2, 
  Waves, 
  Zap, 
  ArrowRight,
  Headphones
} from 'lucide-react';

interface PremiumScreenProps {
  user: UserProfile;
  onUpgradePlan: (planName: string) => void;
}

export const PremiumScreen: React.FC<PremiumScreenProps> = ({
  user,
  onUpgradePlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('student');
  const [isSuccess, setIsSuccess] = useState(false);

  const plans = [
    {
      id: 'student',
      name: 'Student Membership',
      badge: 'Most Popular for Students',
      monthlyPrice: '$3.99',
      annualPrice: '$2.99',
      annualBilled: '$35.88 / year',
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
      annualBilled: '$83.88 / year',
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
      annualBilled: 'Pay once, own forever',
      features: [
        'Lifetime access to all current and future albums',
        'Zero subscription fees forever',
        'All Pro & Master acoustic soundscapes',
        'Direct VIP support channel',
      ],
    },
  ];

  const handleSubscribe = (planName: string) => {
    onUpgradePlan(planName);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div id="premium-screen-container" className="flex flex-col gap-8 pb-32 max-w-5xl mx-auto">
      {/* Header Banner */}
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

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center gap-3 mt-4 bg-[#141c00] p-1.5 rounded-full border border-white/10">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-[#00fde7] text-[#00443d] font-bold shadow-md'
                : 'text-[#92b900] hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-[#00fde7] text-[#00443d] font-bold shadow-md'
                : 'text-[#92b900] hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="bg-[#ff5b5b] text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
              SAVE 25%
            </span>
          </button>
        </div>
      </section>

      {/* Plan Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const isUserCurrent = user.planName.toLowerCase().includes(plan.id);

          return (
            <div
              key={plan.id}
              id={`plan-card-${plan.id}`}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`
                bg-[#141c00] rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-300 relative cursor-pointer
                ${isSelected
                  ? 'border-[#00fde7] ring-2 ring-[#00fde7]/30 shadow-2xl shadow-[#00fde7]/10 -translate-y-1'
                  : 'border-white/5 hover:border-white/20'
                }
              `}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6 bg-[#00fde7] text-[#00443d] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="font-serif-heading font-bold text-xl text-white mt-1">
                  {plan.name}
                </h3>
                
                <div className="mt-4 mb-2 flex items-baseline gap-1">
                  <span className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-[#00fde7]">
                    {billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-xs text-[#92b900]">/ month</span>
                </div>

                <p className="text-xs text-[#92b900] mb-6">
                  {billingCycle === 'annual' ? plan.annualBilled : 'Billed monthly, cancel anytime'}
                </p>

                {/* Features List */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#cafd1e]">
                      <Check size={16} className="text-[#00fde7] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  id={`subscribe-btn-${plan.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(plan.name);
                  }}
                  className={`
                    w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                    ${isUserCurrent
                      ? 'bg-[#192300] border border-[#00fde7]/40 text-[#00fde7]'
                      : isSelected
                      ? 'bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] shadow-lg shadow-[#00fde7]/20 hover:scale-102 active:scale-98'
                      : 'bg-[#1f2a00] hover:bg-[#2c3a00] text-[#cafd1e]'
                    }
                  `}
                >
                  <span>{isUserCurrent ? 'Current Active Plan' : 'Select & Upgrade'}</span>
                  {!isUserCurrent && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Feature Matrix / Trust Badges */}
      <section className="bg-[#141c00] rounded-3xl p-6 sm:p-8 border border-white/5 text-left">
        <h3 className="font-serif-heading font-bold text-xl text-white mb-6 text-center">
          Why Saregama is Built Differently
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#00fde7]/10 flex items-center justify-center text-[#00fde7]">
              <ShieldCheck size={22} />
            </div>
            <h4 className="font-semibold text-sm text-white">Zero Advertising</h4>
            <p className="text-xs text-[#92b900] leading-relaxed">
              No audio sponsorships, loud commercial interruptions, or tracking scripts during listening.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#00fde7]/10 flex items-center justify-center text-[#00fde7]">
              <Waves size={22} />
            </div>
            <h4 className="font-semibold text-sm text-white">40Hz Binaural Audio</h4>
            <p className="text-xs text-[#92b900] leading-relaxed">
              Synthesized pure acoustic frequency layers designed for immersive spatial listening.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#00fde7]/10 flex items-center justify-center text-[#00fde7]">
              <DownloadCloud size={22} />
            </div>
            <h4 className="font-semibold text-sm text-white">Protected Offline Mode</h4>
            <p className="text-xs text-[#92b900] leading-relaxed">
              Keep listening seamlessly in transit, on flights, and remote spots without WiFi.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#00fde7]/10 flex items-center justify-center text-[#00fde7]">
              <Volume2 size={22} />
            </div>
            <h4 className="font-semibold text-sm text-white">Lossless Studio Fidelity</h4>
            <p className="text-xs text-[#92b900] leading-relaxed">
              Clean 320 kbps & FLAC streams preserving analog acoustic harmonics and subtle vinyl texture.
            </p>
          </div>
        </div>
      </section>

      {/* Success Notification Banner */}
      {isSuccess && (
        <div className="fixed bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#00fde7] text-[#00443d] font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2.5 animate-fade-in-up">
          <Check size={18} />
          <span>Membership successfully updated! Pro features activated.</span>
        </div>
      )}
    </div>
  );
};
