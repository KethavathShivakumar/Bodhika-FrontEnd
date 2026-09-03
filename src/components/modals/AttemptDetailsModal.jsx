import React from 'react';

export default function AttemptDetailsModal({ attempt, onClose, onRetake }) {
  if (!attempt) return null;

  const isPass = attempt.result === 'Pass';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isPass ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
            }`}>
              <span className="material-symbols-outlined text-[22px]">
                {isPass ? 'emoji_events' : 'sentiment_dissatisfied'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-outline uppercase">{attempt.grade}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  isPass ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                }`}>
                  {attempt.result}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-on-surface leading-tight mt-0.5">{attempt.exam}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-container-low p-4 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">Score</span>
              <div className="text-2xl font-bold text-on-surface mt-1">{attempt.score}</div>
              <span className="text-xs font-semibold text-secondary">{attempt.scorePercent}%</span>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">Rank</span>
              <div className="text-2xl font-bold text-on-surface mt-1">{attempt.rank}</div>
              <span className="text-xs text-on-surface-variant">In Session</span>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">Duration</span>
              <div className="text-2xl font-bold text-on-surface mt-1">{attempt.duration}</div>
              <span className="text-xs text-on-surface-variant">Time Taken</span>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl text-center">
              <span className="text-[11px] font-semibold text-outline uppercase tracking-wider">Attempts</span>
              <div className="text-2xl font-bold text-on-surface mt-1">{attempt.attempts}</div>
              <span className="text-xs text-on-surface-variant">Slot Used</span>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-variant">
            <h4 className="text-xs font-semibold text-outline uppercase tracking-wider mb-3">Question Breakdown</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 p-2.5 bg-surface-container-lowest rounded-xl">
                <span className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <div>
                  <div className="text-xs text-outline">Correct</div>
                  <div className="font-bold text-base text-on-surface">{attempt.correct}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-surface-container-lowest rounded-xl">
                <span className="w-7 h-7 rounded-lg bg-error-container text-on-error-container flex items-center justify-center font-bold text-xs">
                  ✕
                </span>
                <div>
                  <div className="text-xs text-outline">Incorrect</div>
                  <div className="font-bold text-base text-on-surface">{attempt.wrong}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-surface-container-lowest rounded-xl">
                <span className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-xs">
                  —
                </span>
                <div>
                  <div className="text-xs text-outline">Skipped</div>
                  <div className="font-bold text-base text-on-surface">{attempt.skipped}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-variant/80">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Attempt Notes & Diagnostic</span>
            <p className="text-sm text-on-surface mt-1.5 leading-relaxed">
              {attempt.details || "Performance recorded successfully in academic archive."}
            </p>
            <div className="text-[11px] text-outline mt-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              <span>Taken on {attempt.date}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-container-low border-t border-surface-variant flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onRetake) onRetake(attempt);
            }}
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">replay</span>
            <span>Retake Exam</span>
          </button>
        </div>
      </div>
    </div>
  );
}
