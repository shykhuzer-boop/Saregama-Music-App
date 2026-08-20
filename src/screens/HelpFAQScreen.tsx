import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Headphones, 
  Radio, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  MessageSquare,
  FileQuestion,
  LifeBuoy
} from 'lucide-react';
import { FAQItem, SupportTicket, UserProfile } from '../types';
import { defaultFAQs } from '../data/userData';
import { audioEngine } from '../services/audioService';

interface HelpFAQScreenProps {
  user: UserProfile;
}

export const HelpFAQScreen: React.FC<HelpFAQScreenProps> = ({ user }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Stereo Diagnostics State
  const [activeChannelTest, setActiveChannelTest] = useState<'left' | 'right' | 'binaural' | null>(null);

  // Support Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('audio');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittedTickets, setSubmittedTickets] = useState<SupportTicket[]>([
    {
      id: 'SAR-8921',
      userName: user.name,
      userEmail: user.email,
      subject: 'Stanford student verification renewal',
      category: 'account',
      message: 'Verified academic email attached for 2026 semester.',
      priority: 'low',
      status: 'resolved',
      createdAt: '2026-02-15'
    }
  ]);
  const [ticketSuccessToast, setTicketSuccessToast] = useState<string | null>(null);

  const categories = ['All', 'Offline & Storage', '40Hz Binaural Science', 'Pro & Subscriptions', 'Audio & Sound Engine', 'Account & Privacy', 'Keyboard Shortcuts'];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query || 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query) ||
      faq.tags.some((t) => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const handleTestChannel = (channel: 'left' | 'right' | 'binaural') => {
    setActiveChannelTest(channel);
    if (channel === 'binaural') {
      audioEngine.playPreset('binaural_flow');
      setTimeout(() => {
        audioEngine.stop();
        setActiveChannelTest(null);
      }, 3000);
    } else {
      audioEngine.testChannel(channel);
      setTimeout(() => {
        setActiveChannelTest(null);
      }, 1400);
    }
  };

  const handleStopAudioTest = () => {
    audioEngine.stop();
    setActiveChannelTest(null);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    const newTicket: SupportTicket = {
      id: `SAR-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: user.name,
      userEmail: user.email,
      subject: ticketSubject.trim(),
      category: ticketCategory,
      message: ticketMessage.trim(),
      priority: ticketPriority,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSubmittedTickets([newTicket, ...submittedTickets]);
    setTicketSubject('');
    setTicketMessage('');
    setTicketSuccessToast(`Support ticket ${newTicket.id} created! Our audio engineers will respond to ${user.email}.`);
    
    setTimeout(() => {
      setTicketSuccessToast(null);
    }, 6000);
  };

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-r from-[#141c00] via-[#192300] to-[#0f1700] border border-[#00fde7]/20 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#00fde7]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#0a1000] border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00fde7] mb-3.5">
            <LifeBuoy size={14} className="text-[#00fde7]" />
            <span>Saregama Help & Audio Knowledge Base</span>
          </div>

          <h1 className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            How can we help your music experience?
          </h1>
          <p className="text-sm sm:text-base text-[#92b900] mt-2">
            Search answers on offline downloads, 40Hz binaural neuro-acoustics, student discounts, and sound synthesizer settings.
          </p>

          {/* Live System Uptime indicator */}
          <div className="flex items-center gap-3 mt-4 text-xs font-semibold text-[#cafd1e]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00fde7] animate-ping" />
              <span className="text-[#00fde7]">Audio Engine Systems 100% Operational</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[#92b900]">Ad-Free Protection Active</span>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#92b900]" />
            <input
              type="text"
              id="faq-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. 40Hz binaural, clear cache, student pass, shortcuts)..."
              className="w-full bg-[#0a1000] border border-white/15 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-[#cafd1e] placeholder:text-[#92b900]/70 outline-none focus:border-[#00fde7] focus:ring-1 focus:ring-[#00fde7] transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#92b900] hover:text-white bg-white/10 px-2 py-0.5 rounded-full"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`faq-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#00fde7] text-[#00443d] shadow-md shadow-[#00fde7]/10 scale-105'
                : 'bg-[#141c00] text-[#92b900] hover:text-[#cafd1e] hover:bg-[#192300] border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Main FAQ Accordion Grid */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-heading font-bold text-xl text-[#00fde7] flex items-center gap-2">
            <FileQuestion size={20} />
            <span>Frequently Asked Questions ({filteredFaqs.length})</span>
          </h2>
          {searchQuery && (
            <span className="text-xs text-[#92b900]">
              Showing results for "{searchQuery}"
            </span>
          )}
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-[#141c00] border border-white/5 rounded-2xl">
            <p className="text-sm text-[#cafd1e] font-semibold">No questions matched your search.</p>
            <p className="text-xs text-[#92b900] mt-1">Try searching for "binaural", "storage", or "FLAC", or submit a question below.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className={`bg-[#141c00] border rounded-2xl transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-[#00fde7]/40 shadow-lg bg-[#162000]'
                      : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-[#00fde7] shrink-0" />
                      <span className="font-semibold text-sm sm:text-base text-white truncate">
                        {faq.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline-block bg-[#1f2a00] text-[#00fde7] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {faq.category}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-[#00fde7]" />
                      ) : (
                        <ChevronDown size={18} className="text-[#92b900]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#cafd1e] leading-relaxed border-t border-white/5 animate-fade-in">
                      <p className="text-[#cafd1e]/90 font-normal">{faq.answer}</p>
                      
                      <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-2 border-t border-white/5">
                        <span className="text-[10px] text-[#92b900] uppercase font-bold mr-1">Related tags:</span>
                        {faq.tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchQuery(tag);
                            }}
                            className="bg-[#0a1000] hover:bg-[#1f2a00] text-[#00fde7] text-[10px] px-2 py-0.5 rounded border border-white/10 hover:border-[#00fde7]/40 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Interactive Headphone & Stereo Diagnostic Lab */}
      <section className="bg-[#141c00] border border-[#00fde7]/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1f2a00] text-[#00fde7] px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Headphones size={14} />
              <span>Headphone Stereo & Binaural Diagnostic Tool</span>
            </div>
            <h3 className="font-serif-heading font-bold text-xl sm:text-2xl text-white">
              Verify your stereo separation for 40Hz gamma beats
            </h3>
            <p className="text-xs sm:text-sm text-[#92b900] mt-1 max-w-xl">
              Binaural beats require distinct frequencies in each ear. Click the diagnostic buttons below while wearing your headphones to test left and right channel integrity.
            </p>
          </div>

          {activeChannelTest && (
            <button
              onClick={handleStopAudioTest}
              className="self-start md:self-auto bg-[#3a0d0d] hover:bg-[#521313] text-[#ff9999] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-[#ff5b5b]/30 transition-all animate-pulse"
            >
              <VolumeX size={15} />
              <span>Stop Test Tone</span>
            </button>
          )}
        </div>

        {/* Diagnostic Control Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <button
            id="test-left-ear-btn"
            onClick={() => handleTestChannel('left')}
            className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 group ${
              activeChannelTest === 'left'
                ? 'bg-[#00fde7]/20 border-[#00fde7] ring-2 ring-[#00fde7]/30'
                : 'bg-[#192300] hover:bg-[#233000] border-white/10 hover:border-[#00fde7]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Left Channel</span>
              <Volume2 size={18} className={activeChannelTest === 'left' ? 'text-[#00fde7] animate-bounce' : 'text-[#92b900]'} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#00fde7]">Test Left Ear (440Hz)</div>
              <div className="text-[11px] text-[#92b900]">Isolated left-only panning</div>
            </div>
          </button>

          <button
            id="test-right-ear-btn"
            onClick={() => handleTestChannel('right')}
            className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 group ${
              activeChannelTest === 'right'
                ? 'bg-[#00fde7]/20 border-[#00fde7] ring-2 ring-[#00fde7]/30'
                : 'bg-[#192300] hover:bg-[#233000] border-white/10 hover:border-[#00fde7]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Right Channel</span>
              <Volume2 size={18} className={activeChannelTest === 'right' ? 'text-[#00fde7] animate-bounce' : 'text-[#92b900]'} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#00fde7]">Test Right Ear (880Hz)</div>
              <div className="text-[11px] text-[#92b900]">Isolated right-only panning</div>
            </div>
          </button>

          <button
            id="test-binaural-sync-btn"
            onClick={() => handleTestChannel('binaural')}
            className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 group ${
              activeChannelTest === 'binaural'
                ? 'bg-[#00fde7]/20 border-[#00fde7] ring-2 ring-[#00fde7]/30'
                : 'bg-[#192300] hover:bg-[#233000] border-white/10 hover:border-[#00fde7]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Stereo Synthesis</span>
              <Sparkles size={18} className={activeChannelTest === 'binaural' ? 'text-[#ff5b5b] animate-spin' : 'text-[#92b900]'} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#cafd1e]">40Hz Gamma Beat Pulse</div>
              <div className="text-[11px] text-[#92b900]">Full neural synchronization wave</div>
            </div>
          </button>
        </div>
      </section>

      {/* Keyboard Shortcuts Reference Guide */}
      <section className="bg-[#141c00] border border-white/5 rounded-3xl p-6 sm:p-8">
        <h3 className="font-serif-heading font-bold text-xl text-[#00fde7] mb-4 flex items-center gap-2">
          <Keyboard size={20} />
          <span>Keyboard Shortcuts & Quick Controls</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 bg-[#0a1000] border border-white/5 rounded-2xl flex items-center justify-between">
            <span className="text-xs text-[#92b900]">Play / Pause</span>
            <kbd className="bg-[#1f2a00] text-[#00fde7] px-2.5 py-1 rounded text-xs font-mono font-bold border border-white/10">Space</kbd>
          </div>

          <div className="p-3.5 bg-[#0a1000] border border-white/5 rounded-2xl flex items-center justify-between">
            <span className="text-xs text-[#92b900]">Mute Audio</span>
            <kbd className="bg-[#1f2a00] text-[#00fde7] px-2.5 py-1 rounded text-xs font-mono font-bold border border-white/10">M</kbd>
          </div>

          <div className="p-3.5 bg-[#0a1000] border border-white/5 rounded-2xl flex items-center justify-between">
            <span className="text-xs text-[#92b900]">Full-Screen Player</span>
            <kbd className="bg-[#1f2a00] text-[#00fde7] px-2.5 py-1 rounded text-xs font-mono font-bold border border-white/10">F</kbd>
          </div>

          <div className="p-3.5 bg-[#0a1000] border border-white/5 rounded-2xl flex items-center justify-between">
            <span className="text-xs text-[#92b900]">Seek 5s Forward/Back</span>
            <kbd className="bg-[#1f2a00] text-[#00fde7] px-2.5 py-1 rounded text-xs font-mono font-bold border border-white/10">← / →</kbd>
          </div>
        </div>
      </section>

      {/* Support Ticket & Feedback Form */}
      <section className="bg-[#141c00] border border-white/10 rounded-3xl p-6 sm:p-8 relative">
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-2 bg-[#192300] text-[#cafd1e] px-3 py-1 rounded-full text-xs font-bold mb-2">
            <MessageSquare size={14} className="text-[#00fde7]" />
            <span>Contact Support & Audio Engineering</span>
          </div>
          <h3 className="font-serif-heading font-bold text-2xl text-white">
            Have a question or custom soundscape request?
          </h3>
          <p className="text-xs sm:text-sm text-[#92b900] mt-1">
            Submit a support ticket and our engineering team will assist you within 24 hours.
          </p>
        </div>

        {ticketSuccessToast && (
          <div className="mb-6 p-4 bg-[#003828] border border-[#00fde7]/50 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-[#00fde7] animate-fade-in-up">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{ticketSuccessToast}</span>
          </div>
        )}

        <form onSubmit={handleSubmitTicket} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#cafd1e] mb-1.5">
                Category
              </label>
              <select
                id="ticket-category-select"
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value as SupportTicket['category'])}
                className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
              >
                <option value="audio">Audio & Synthesizer Engine</option>
                <option value="downloads">Offline Downloads & Storage</option>
                <option value="account">Account & Student Verification</option>
                <option value="billing">Pro Subscription & Plans</option>
                <option value="feature">Feature / Soundscape Request</option>
                <option value="bug">Report a Playback Bug</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cafd1e] mb-1.5">
                Priority
              </label>
              <select
                id="ticket-priority-select"
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value as SupportTicket['priority'])}
                className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
              >
                <option value="low">Low (General Inquiry)</option>
                <option value="medium">Medium (Account/Feature)</option>
                <option value="high">High (Playback Interruption)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cafd1e] mb-1.5">
              Subject
            </label>
            <input
              type="text"
              id="ticket-subject-input"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Requesting 528Hz Solfeggio frequency preset"
              className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cafd1e] mb-1.5">
              Detailed Description
            </label>
            <textarea
              id="ticket-message-textarea"
              required
              rows={4}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Describe your question, device setup, or request..."
              className="w-full bg-[#0a1000] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#cafd1e] outline-none focus:border-[#00fde7]"
            />
          </div>

          <button
            type="submit"
            id="ticket-submit-btn"
            className="bg-[#00fde7] hover:bg-[#49dbf4] text-[#00443d] font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00fde7]/20"
          >
            <Send size={16} />
            <span>Submit Support Ticket</span>
          </button>
        </form>

        {/* Existing User Tickets */}
        {submittedTickets.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-xs font-bold text-[#92b900] uppercase tracking-wider mb-3">
              Your Open & Recent Tickets ({submittedTickets.length})
            </h4>
            <div className="space-y-2.5">
              {submittedTickets.map((t) => (
                <div key={t.id} className="p-3.5 bg-[#0a1000] border border-white/5 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="text-[#00fde7]">#{t.id}</span>
                      <span>{t.subject}</span>
                    </div>
                    <div className="text-[11px] text-[#92b900] mt-0.5">
                      Submitted on {t.createdAt} • Category: {t.category}
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.status === 'resolved'
                      ? 'bg-[#003828] text-[#00fde7] border border-[#00fde7]/30'
                      : 'bg-[#ffb700]/20 text-[#ffb700] border border-[#ffb700]/40'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
