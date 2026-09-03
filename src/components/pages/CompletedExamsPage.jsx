import React, { useState } from 'react';

export default function CompletedExamsPage({ attempts, onViewResult, onRetakeExam, onBackToDashboard }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('All'); // 'All' | 'Pass' | 'Fail'
  const [subjectFilter, setSubjectFilter] = useState('All');

  // Derive unique subjects
  const subjects = ['All', ...new Set(attempts.map(a => a.subject))];

  const filteredAttempts = attempts.filter(att => {
    if (searchQuery && !att.exam.toLowerCase().includes(searchQuery.toLowerCase()) && !att.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (resultFilter !== 'All' && att.result !== resultFilter) return false;
    if (subjectFilter !== 'All' && att.subject !== subjectFilter) return false;
    return true;
  });

  const getExamIcon = (att) => {
    const text = (att.exam + ' ' + att.subject + ' ' + (att.grade || '')).toLowerCase();
    if (text.includes('azure') || text.includes('cloud') || text.includes('dp-900')) return 'cloud';
    if (text.includes('verbal') || text.includes('aptitude')) return 'psychology';
    if (text.includes('python') || text.includes('algorithm') || text.includes('code')) return 'terminal';
    if (text.includes('biology') || text.includes('neet') || text.includes('medical')) return 'biotech';
    if (text.includes('cricket') || text.includes('sports') || text.includes('gk')) return 'sports_cricket';
    return 'assignment_turned_in';
  };

  const totalCompleted = attempts.length;
  const passedCount = attempts.filter(a => a.result === 'Pass').length;
  const passRate = totalCompleted > 0 ? Math.round((passedCount / totalCompleted) * 100) : 0;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-1.5">
            <span className="material-symbols-outlined text-[15px]">task_alt</span>
            Examination Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">Completed Exams</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Review finalized assessments, comprehensive score breakdowns, and performance percentiles.
          </p>
        </div>

        {/* Top summary badge pills */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-variant text-center flex-1 sm:flex-initial">
            <span className="text-[10px] uppercase font-bold text-outline block">Completed</span>
            <span className="text-sm font-bold text-on-surface">{totalCompleted} Exams</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-secondary-container/40 border border-secondary-container text-center flex-1 sm:flex-initial">
            <span className="text-[10px] uppercase font-bold text-on-secondary-container block">Pass Rate</span>
            <span className="text-sm font-bold text-on-secondary-container">{passRate}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-soft-card border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Pass', 'Fail'].map((status) => (
            <button
              key={status}
              onClick={() => setResultFilter(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                resultFilter === status
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              }`}
            >
              {status === 'All' ? 'All Results' : status === 'Pass' ? 'Passed Only' : 'Failed Only'}
            </button>
          ))}

          <div className="h-4 w-px bg-surface-variant mx-1 hidden sm:block"></div>

          {/* Subject Dropdown */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-surface-container-low h-8 px-3 rounded-lg text-xs font-medium text-on-surface outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
          >
            {subjects.map(subj => (
              <option key={subj} value={subj}>
                {subj === 'All' ? '— All Subjects —' : subj}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 bg-surface-container-low rounded-xl flex items-center px-3 h-9 gap-2 border border-transparent focus-within:border-primary focus-within:bg-surface-container-lowest transition-all">
          <span className="material-symbols-outlined text-outline text-[16px]">search</span>
          <input
            type="text"
            placeholder="Search completed exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-on-surface placeholder:text-outline"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-outline hover:text-on-surface">
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Completed Exams Grid */}
      {filteredAttempts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredAttempts.map((att) => {
            const isPass = att.result === 'Pass';
            return (
              <div
                key={att.id}
                className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-soft-card hover:shadow-hover-card hover:border-outline-variant/60 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent top border based on pass/fail */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
                    isPass ? 'bg-secondary' : 'bg-error/60'
                  }`}
                ></div>

                <div>
                  {/* Card Top Row: Subject Icon + Grade Label + Pass/Fail Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isPass
                            ? 'bg-secondary-container/50 text-on-secondary-container'
                            : 'bg-error-container/40 text-on-error-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{getExamIcon(att)}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider block truncate">
                          {att.grade || 'Academic Exam'}
                        </span>
                        <span className="text-[11px] font-medium text-on-surface-variant truncate block">
                          {att.subject}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 flex items-center gap-1 ${
                        isPass
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {isPass ? 'check_circle' : 'cancel'}
                      </span>
                      <span>{isPass ? 'Passed' : 'Failed'}</span>
                    </span>
                  </div>

                  {/* Exam Name */}
                  <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                    {att.exam}
                  </h3>

                  {/* Questions & Duration Subtitle */}
                  <div className="text-[11px] text-outline mt-1 flex items-center gap-1.5">
                    <span>{att.questionsCount || 10} Questions</span>
                    <span>•</span>
                    <span>{att.durationMin ? `${att.durationMin} min` : att.duration}</span>
                  </div>

                  {/* Prominent Score & Result Banner */}
                  <div className="my-3 p-3 rounded-xl bg-surface-container-low/70 border border-surface-variant/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Score Obtained</span>
                      <div className="text-lg font-extrabold text-on-surface mt-0.5 font-mono">
                        {att.score}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Percentage</span>
                      <div
                        className={`text-lg font-extrabold mt-0.5 ${
                          isPass ? 'text-secondary' : 'text-error'
                        }`}
                      >
                        {att.scorePercent}%
                      </div>
                    </div>
                  </div>

                  {/* Completion Date & Attempt Slot */}
                  <div className="flex items-center justify-between text-[11px] text-outline px-0.5">
                    <span className="flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                      <span>Completed: {att.date}</span>
                    </span>
                    <span className="font-medium text-on-surface-variant shrink-0">
                      {att.attemptsUsed || `Attempt ${att.attempts}`}
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 mt-3 border-t border-surface-variant/50 flex items-center gap-2">
                  <button
                    onClick={() => onViewResult(att)}
                    className="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition-all font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">visibility</span>
                    <span>View Results</span>
                  </button>

                  <button
                    onClick={() => onRetakeExam(att)}
                    className="p-2 rounded-xl border border-surface-variant text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    title="Retake this exam"
                  >
                    <span className="material-symbols-outlined text-[16px] block">replay</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant/30 shadow-soft-card flex flex-col items-center justify-center min-h-[260px]">
          <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
            <span className="material-symbols-outlined text-[28px]">fact_check</span>
          </div>
          <h3 className="font-bold text-base text-on-surface">No completed examinations match your criteria</h3>
          <p className="text-xs text-outline mt-1 max-w-sm">
            Try adjusting your search query or filter to view results.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setResultFilter('All'); setSubjectFilter('All'); }}
            className="mt-4 px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
