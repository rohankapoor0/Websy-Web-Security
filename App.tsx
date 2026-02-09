
import React, { useState } from 'react';
import { analyzeWebsite } from './services/geminiService';
import { AnalysisResult, TrustLevel, UserReview } from './types';
import TrustMeter from './components/TrustMeter';
import VoiceAssistant from './components/VoiceAssistant';

const WebsyLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="30" fill="#0F0E17" />
    <path 
      d="M25 45L40 70L50 55L60 70L75 45M35 38L50 25L65 38" 
      stroke="white" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (!urlPattern.test(url)) {
      setError("Please enter a valid website address.");
      setResult(null);
      return;
    }
    
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const report = await analyzeWebsite(url);
      setResult(report);
    } catch (err) {
      setError("Analysis failed. Please verify the URL and try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-700">
      <BackgroundGraphics />

      {/* Header */}
      <nav className="w-full h-20 px-6 md:px-10 flex items-center justify-between z-50 animate-in fade-in duration-1000">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => {setResult(null); setUrl(''); setError(null);}}
        >
          <WebsyLogo className="w-10 h-10 md:w-12 md:h-12 shadow-xl shadow-black/10 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0F0E17] group-hover:translate-x-1 transition-transform duration-300">
            Websy
          </span>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setShowHowItWorks(true)}
            className="bg-blue-600 text-white px-5 md:px-7 py-2 md:py-2.5 rounded-xl font-semibold shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95"
          >
            How It Works
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-10 md:pt-16 pb-32 flex flex-col items-center">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] md:text-sm font-semibold mb-6 md:mb-8 border border-blue-100 shadow-sm">
            <i className="fas fa-sparkles text-xs animate-pulse"></i>
            <span>AI-Powered Security Analysis</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-[5.5rem] font-extrabold text-[#0F0E17] leading-[1.1] mb-6 md:mb-8">
            Know Before You <br /> Browse.
          </h1>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed font-medium px-2">
            Instantly check if a website is safe for browsing and shopping. Our AI <br className="hidden md:block" />
            analyzes security, scams, and community trust in seconds.
          </p>
        </div>

        {/* Input Area */}
        <div className="w-full max-w-3xl relative mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <form onSubmit={handleScan} className="bg-white rounded-2xl md:rounded-[2rem] p-2 md:p-3 flex flex-col sm:flex-row items-stretch sm:items-center shadow-[0_20px_50px_rgba(46,60,154,0.12)] border border-white/50 relative z-10 gap-2 sm:gap-0 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
            <div className="flex items-center flex-1">
              <div className="pl-4 md:pl-6 pr-3 md:pr-4 text-slate-400">
                <i className={`fas fa-search text-lg md:text-xl ${isScanning ? 'animate-bounce' : ''}`}></i>
              </div>
              <input 
                type="text"
                placeholder="Enter website address..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-base md:text-lg py-3 md:py-4 placeholder:text-slate-300 font-medium text-slate-700"
              />
            </div>
            <button 
              type="submit"
              disabled={isScanning || !url}
              className={`shimmer-btn text-white px-6 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95`}
            >
              {isScanning ? (
                <><i className="fas fa-circle-notch fa-spin"></i> Analyzing...</>
              ) : (
                <>Check Website</>
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 md:mt-6 flex items-center justify-center gap-2 text-rose-500 font-bold bg-rose-50 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-rose-100 animate-in fade-in slide-in-from-top-2 text-sm shadow-sm text-center">
              <i className="fas fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {result && (
          <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            
            {/* 1. Score & Snapshot (Concise) */}
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
               <div className="flex-1 bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center shadow-xl shadow-slate-200/50">
                  <TrustMeter score={result.score} level={result.level} />
                  <div className={`mt-6 px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase ${
                    result.level === TrustLevel.SAFE ? 'bg-emerald-50 text-emerald-600' :
                    result.level === TrustLevel.EMERGING ? 'bg-amber-50 text-amber-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    {result.level} STATUS
                  </div>
               </div>
               
               <div className="flex-[2] bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50">
                  <h3 className="text-xl font-extrabold text-[#0F0E17] mb-6 flex items-center gap-3">
                    <i className="fas fa-fingerprint text-blue-500"></i>
                    Site Snapshot
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                     {result.insights.map((insight, idx) => (
                       <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-start">
                         <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[9px]">{idx + 1}</span>
                         <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">{insight}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* 2. Infrastructure Profile (Technical Audit) */}
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-slate-500/20">
                      <i className="fas fa-microchip"></i>
                  </div>
                  <div>
                      <h3 className="text-2xl font-black text-[#0F0E17]">Infrastructure Profile</h3>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Network & Security Metadata</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <TechCard icon="fa-calendar-check" label="Domain Age" value={`${result.technical.domainAgeDays} Days`} status={result.technical.domainAgeDays > 365 ? 'good' : 'caution'} desc="Longevity of domain registration" />
                  <TechCard icon="fa-shield-halved" label="SSL Status" value={result.technical.ssl ? "Active" : "None"} status={result.technical.ssl ? 'good' : 'bad'} desc="TLS/SSL encryption audit" />
                  <TechCard icon="fa-server" label="Server Node" value={result.technical.serverLocation} status="neutral" desc="Infrastructure routing node" />
                  <TechCard icon="fa-user-secret" label="WHOIS Privacy" value={result.technical.whoisPrivacy ? "Enabled" : "Disabled"} status={result.technical.whoisPrivacy ? 'good' : 'caution'} desc="Ownership data protection" />
                </div>
            </section>

            {/* 3. Pros and Cons */}
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
                      <i className="fas fa-scale-balanced"></i>
                  </div>
                  <div>
                      <h3 className="text-2xl font-black text-[#0F0E17]">Pros and Cons</h3>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Safety Signals & Vulnerabilities</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                      <div className="flex items-center gap-3 text-emerald-600">
                          <i className="fas fa-circle-check text-xl"></i>
                          <h4 className="font-black uppercase tracking-widest text-sm">Pros</h4>
                      </div>
                      <div className="space-y-4">
                          {result.pros.map((pro, i) => (
                          <div key={i} className="flex gap-4 p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                              <i className="fas fa-plus text-emerald-500 mt-1"></i>
                              <p className="text-sm text-slate-700 font-bold">{pro}</p>
                          </div>
                          ))}
                      </div>
                  </div>
                  
                  <div className="space-y-6">
                      <div className="flex items-center gap-3 text-rose-500">
                          <i className="fas fa-triangle-exclamation text-xl"></i>
                          <h4 className="font-black uppercase tracking-widest text-sm">Cons</h4>
                      </div>
                      <div className="space-y-4">
                          {result.cons.map((con, i) => (
                          <div key={i} className="flex gap-4 p-5 bg-rose-50/50 border border-rose-100 rounded-2xl">
                              <i className="fas fa-minus text-rose-400 mt-1"></i>
                              <p className="text-sm text-slate-700 font-bold">{con}</p>
                          </div>
                          ))}
                      </div>
                  </div>
                </div>
            </section>

            {/* 4. Community Intelligence (User Reviews) */}
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
                      <i className="fas fa-comments"></i>
                  </div>
                  <div>
                      <h3 className="text-2xl font-black text-[#0F0E17]">Community Intelligence</h3>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">External Sentiment & Reputation</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.userReviews.length > 0 ? result.userReviews.map((rev, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all group h-full flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xs border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <i className={`fab fa-${rev.source.toLowerCase() === 'reddit' ? 'reddit' : rev.source.toLowerCase() === 'quora' ? 'quora' : 'google'}`}></i>
                              </div>
                              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{rev.source}</span>
                          </div>
                          <i className="fas fa-quote-right text-slate-200"></i>
                          </div>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed italic mb-4 flex-1">"{rev.snippet}"</p>
                      </div>
                  )) : (
                      <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                          <p className="text-slate-400 font-bold">No social threads detected for this domain.</p>
                      </div>
                  )}
                </div>
            </section>

            {/* 5. Score Logic */}
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
                      <i className="fas fa-calculator"></i>
                  </div>
                  <div>
                      <h3 className="text-2xl font-black text-[#0F0E17]">Trust Score Methodology</h3>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Weighted Score Calculation</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Variables</h4>
                      {result.scoreBreakdown.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                          <span className="text-sm text-slate-500 font-bold">{item.label}</span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                              item.points > 0 ? 'bg-emerald-100 text-emerald-700' : 
                              item.points < 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                          }`}>
                              {item.points > 0 ? '+' : ''}{item.points}
                          </span>
                          </div>
                      ))}
                      <div className="pt-4 flex items-center justify-between">
                          <span className="text-base font-black text-slate-800 uppercase tracking-tighter">Aggregated Trust Score</span>
                          <span className="text-3xl font-black text-blue-600">{result.score}/100</span>
                      </div>
                  </div>
                  <div className="flex flex-col justify-center bg-blue-50/50 p-8 md:p-10 rounded-[2.5rem] border border-blue-100">
                      <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <i className="fas fa-info-circle"></i> Audit Summary
                      </p>
                      <p className="text-lg text-slate-700 font-medium leading-relaxed italic">
                          "{result.scoreReasoningLayman}"
                      </p>
                  </div>
                </div>
            </section>

            {/* 6. AI Verdict (Conclusion Section) */}
            <section className="bg-[#0F0E17] border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/30 scroll-mt-20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
                      <i className="fas fa-brain"></i>
                  </div>
                  <div>
                      <h3 className="text-2xl font-black text-white">AI Verdict</h3>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Final Summary</p>
                  </div>
                </div>
                <div className="bg-slate-800/40 p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50">
                  <p className="text-lg text-slate-300 font-medium leading-[1.8] whitespace-pre-wrap">
                      {result.contentAnalysis}
                  </p>
                </div>
            </section>

          </div>
        )}

        {/* Feature Cards */}
        {!result && !isScanning && (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-8 md:mt-10">
            <FeatureBox icon="fa-shopping-cart" title="Safe Shopping" desc="Identify fraudulent retail portals before transacting." delay="delay-100" />
            <FeatureBox icon="fa-envelope-open-text" title="Phishing Analysis" desc="Detect credential theft vectors in real-time." delay="delay-200" />
            <FeatureBox icon="fa-microchip" title="Infrastructure Audit" desc="Deep analysis of domain age and server integrity." delay="delay-300" />
          </div>
        )}
      </main>

      {showHowItWorks && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowHowItWorks(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fas fa-times text-2xl"></i>
            </button>
            <h2 className="text-3xl font-black text-[#0F0E17] mb-8">How Websy works</h2>
            <div className="space-y-8">
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                Our engine aggregates technical audit data with broad social sentiment analysis to establish a definitive Trust Score.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">Technical Audit</h4>
                  <p className="text-xs font-semibold text-slate-500">Validation of domain lifecycle, SSL implementation, and hosting reputation.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">Reputation Engine</h4>
                  <p className="text-xs font-semibold text-slate-500">Parsing community discourse from verified security forums and social platforms.</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowHowItWorks(false)} className="w-full mt-12 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">Close Briefing</button>
          </div>
        </div>
      )}

      {result && <VoiceAssistant currentUrl={result?.url} />}
    </div>
  );
};

const TechCard = ({ icon, label, value, status, desc }: { icon: string, label: string, value: string, status: 'good' | 'caution' | 'bad' | 'neutral', desc: string }) => (
  <div className="flex flex-col p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-all h-full">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${
      status === 'good' ? 'bg-emerald-50 text-emerald-500' :
      status === 'caution' ? 'bg-amber-50 text-amber-500' :
      status === 'bad' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
    }`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <p className="text-lg font-black text-slate-800 mb-2">{value}</p>
    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

const BackgroundGraphics = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    <div className="absolute top-40 -left-20 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
    <div className="absolute top-10 -right-20 w-[25rem] md:w-[35rem] h-[25rem] md:h-[35rem] bg-indigo-100 rounded-full blur-[120px] opacity-40"></div>
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#2E3C9A 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}></div>
  </div>
);

const FeatureBox = ({ icon, title, desc, delay }: { icon: string, title: string, desc: string, delay?: string }) => (
  <div className={`flex flex-col items-center text-center p-8 glass-card rounded-[2.5rem] border border-white hover:scale-105 transition-all duration-700 ${delay}`}>
    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-500 text-2xl mb-6">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-lg font-bold text-[#0F0E17] mb-3">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

export default App;
