import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function CareerCompassPage({ questions, onNavigateToExam, onToast }) {
  const [answers, setAnswers] = useState({
    1: 'tech',
    2: 'code',
    3: 'dev',
    4: 'algo',
    5: 'tech_leader'
  });
  const [result, setResult] = useState(null);

  const handleSelect = (qId, optId) => {
    setAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleGenerateRecommendations = () => {
    // Determine highest scoring track
    const trackScores = {
      'Engineering & Technology': 0,
      'Medical & Health': 0,
      'Management & Commerce': 0,
      'Design, Arts & Culture': 0,
      'Law & Government': 0
    };

    questions.forEach(q => {
      const chosenOpt = q.options.find(o => o.id === answers[q.id]);
      if (chosenOpt && chosenOpt.track && trackScores[chosenOpt.track] !== undefined) {
        trackScores[chosenOpt.track] += 1;
      } else if (chosenOpt && chosenOpt.track) {
        trackScores[chosenOpt.track] = (trackScores[chosenOpt.track] || 0) + 1;
      }
    });

    const topTrack = Object.keys(trackScores).reduce((a, b) => trackScores[a] > trackScores[b] ? a : b);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    setResult({
      track: topTrack,
      confidence: '94% Match',
      recommendedExams: [
        { title: 'JEE Main 2027', category: 'Engineering', daysLeft: 91 },
        { title: 'SAT 2026-27', category: 'International (MIT/Stanford)', daysLeft: 33 },
        { title: 'DP-900: Azure Data Fundamentals', category: 'Cloud Certification', daysLeft: 15 }
      ],
      careers: ['Distributed Systems Architect', 'AI/ML Infrastructure Engineer', 'Algorithmic Researcher'],
      advisory: 'Your answers demonstrate exceptionally high analytical orientation combined with deep focus on programmatic construction and algorithmic reasoning.'
    });

    onToast({
      title: 'Profile Diagnostic Complete',
      message: `Your recommended path is: ${topTrack}`,
      type: 'success'
    });
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-10 pb-20 relative">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Header Banner (From Bodhika UI reference) */}
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-4">
          <span className="material-symbols-outlined text-[16px]">explore</span>
          Cognitive Inclination Diagnostic
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-3">Career Compass</h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Answer these 5 quick questions to discover your natural academic inclinations, matched professional directions, and the targeted entrance examinations in the ExamPath Directory that lead there.
        </p>
      </header>

      {/* Questions Stack */}
      <div className="space-y-8">
        {questions.map((q) => {
          const selectedVal = answers[q.id];
          return (
            <section
              key={q.id}
              className="bg-surface-container-lowest rounded-[24px] p-6 sm:p-8 shadow-soft-card border border-outline-variant/30"
            >
              {/* Question Heading */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {q.id}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface leading-tight">
                    {q.prompt}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">{q.subtitle}</p>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {q.options.map((opt) => {
                  const isChecked = selectedVal === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className="group relative cursor-pointer select-none"
                    >
                      <div
                        className={`h-full p-5 rounded-2xl transition-all duration-200 border flex flex-col justify-between ${
                          isChecked
                            ? 'bg-primary-container text-white border-primary shadow-md'
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-inverse-surface text-on-primary'
                                : 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[22px]">{opt.icon}</span>
                          </div>

                          {/* Custom Radio Circle */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isChecked
                                ? 'border-secondary-container bg-secondary-container text-on-secondary-container'
                                : 'border-outline-variant bg-transparent'
                            }`}
                          >
                            {isChecked && <div className="w-2 h-2 rounded-full bg-on-secondary-container"></div>}
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className={`font-semibold text-sm mb-1 ${isChecked ? 'text-white' : 'text-on-surface'}`}>
                            {opt.label}
                          </div>
                          <p className={`text-xs leading-relaxed ${isChecked ? 'text-neutral-300' : 'text-on-surface-variant'}`}>
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Submit / Diagnostic Trigger */}
      <div className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-2xl shadow-soft-card border border-outline-variant/30">
        <div>
          <h3 className="font-semibold text-base text-on-surface">Ready to compute your direction?</h3>
          <p className="text-xs text-outline">All 5 questions answered based on your instinct.</p>
        </div>
        <button
          onClick={handleGenerateRecommendations}
          className="px-6 py-3 rounded-full bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span>Generate Career Recommendations</span>
        </button>
      </div>

      {/* Dynamic Recommendation Panel */}
      {result && (
        <section className="bg-surface-container-lowest rounded-[24px] p-8 shadow-hover-card border-2 border-secondary-container space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
              </div>
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Top Recommended Track</span>
                <h2 className="text-2xl font-bold text-on-surface mt-0.5">{result.track}</h2>
              </div>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
              {result.confidence}
            </span>
          </div>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            {result.advisory}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Suggested Careers */}
            <div className="p-5 rounded-2xl bg-surface-container-low space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-outline">High-Impact Suggested Careers</h4>
              <ul className="space-y-2">
                {result.careers.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-on-surface font-medium">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Exams in Directory */}
            <div className="p-5 rounded-2xl bg-surface-container-low space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-outline">Target ExamPath Benchmarks</h4>
              <div className="space-y-2">
                {result.recommendedExams.map((ex, i) => (
                  <div key={i} className="p-3 bg-surface-container-lowest rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-on-surface">{ex.title}</div>
                      <div className="text-[10px] text-outline">{ex.category}</div>
                    </div>
                    <span className="text-xs font-bold text-error">{ex.daysLeft}d left</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
