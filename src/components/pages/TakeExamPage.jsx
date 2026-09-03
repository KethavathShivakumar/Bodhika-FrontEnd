import React, { useState } from 'react';

export default function TakeExamPage({ availableExams, onStartExam, onToast }) {
  const [selectedExam, setSelectedExam] = useState(null); // null = listing mode, object = instructions mode
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const categories = ['All', 'Cloud & Data', 'Aptitude', 'Computer Science', 'Medical'];

  const filteredExams = availableExams.filter(exam => {
    if (searchQuery && !exam.name.toLowerCase().includes(searchQuery.toLowerCase()) && !exam.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categoryFilter === 'Cloud & Data' && !exam.category.includes('Cloud')) return false;
    if (categoryFilter === 'Aptitude' && !exam.category.includes('Aptitude')) return false;
    if (categoryFilter === 'Computer Science' && !exam.category.includes('Computer Science')) return false;
    if (categoryFilter === 'Medical' && !exam.category.includes('Medical')) return false;
    return true;
  });

  const handleSelectExamForInstructions = (exam) => {
    setSelectedExam(exam);
    setAgreedToTerms(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToConfirmation = () => {
    if (!agreedToTerms) {
      onToast({
        title: 'Agreement Required',
        message: 'Please check the box confirming you have read and agreed to the exam regulations.',
        type: 'error'
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalConfirmStart = () => {
    setShowConfirmModal(false);
    onStartExam(selectedExam);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-20">
      {/* View 1: Available Exams Listing */}
      {!selectedExam && (
        <>
          {/* Header Banner (Bodhika UI Reference Style) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-2">
                <span className="material-symbols-outlined text-[16px]">assignment</span>
                Active Assessment Portal
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-on-surface">Take Exam</h1>
              <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                Select an examination currently assigned or available to you. You will be able to review detailed instructions and test rules before launching the timed session.
              </p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    categoryFilter === cat
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80 bg-surface-container-low rounded-xl flex items-center px-3.5 h-11 gap-2 border border-transparent focus-within:border-primary focus-within:bg-surface-container-lowest transition-all">
              <span className="material-symbols-outlined text-outline text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search available exams..."
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

          {/* Exams Grid */}
          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredExams.map((exam) => {
                const attemptsLeft = exam.attemptsAllowed - exam.attemptsUsed;
                return (
                  <div
                    key={exam.id}
                    className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 flex flex-col justify-between hover:shadow-hover-card transition-all duration-300 relative group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                          {exam.status}
                        </span>
                        <span className="text-xs font-semibold text-outline">
                          Slot: {exam.attemptsUsed}/{exam.attemptsAllowed} used
                        </span>
                      </div>

                      {/* Title & Subject */}
                      <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block">
                        {exam.grade}
                      </span>
                      <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors mt-0.5">
                        {exam.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">{exam.category}</p>

                      {/* Key Stats Row */}
                      <div className="grid grid-cols-3 gap-2 my-5 pt-3 border-t border-surface-variant/50">
                        <div className="p-2.5 bg-surface-container-low rounded-xl text-center">
                          <span className="text-[10px] text-outline uppercase font-semibold block">Duration</span>
                          <span className="text-sm font-bold text-on-surface mt-0.5 flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-outline">timer</span>
                            {exam.durationMin} mins
                          </span>
                        </div>

                        <div className="p-2.5 bg-surface-container-low rounded-xl text-center">
                          <span className="text-[10px] text-outline uppercase font-semibold block">Questions</span>
                          <span className="text-sm font-bold text-on-surface mt-0.5 flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-outline">quiz</span>
                            {exam.questionsCount} Qs
                          </span>
                        </div>

                        <div className="p-2.5 bg-surface-container-low rounded-xl text-center">
                          <span className="text-[10px] text-outline uppercase font-semibold block">Pass Mark</span>
                          <span className="text-sm font-bold text-secondary mt-0.5 flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">check_circle</span>
                            {exam.passPercent}%
                          </span>
                        </div>
                      </div>

                      {/* Marking details & Access */}
                      <div className="space-y-1.5 text-xs text-on-surface-variant">
                        <div className="flex items-center justify-between">
                          <span className="text-outline">Marking Scheme:</span>
                          <span className="font-semibold text-on-surface">{exam.markingScheme.correct} / correct</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-outline">Access:</span>
                          <span className="font-medium text-secondary">{exam.availableDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-4 border-t border-surface-variant flex items-center justify-between">
                      <span className="text-xs text-outline font-medium">
                        {attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining` : 'No attempts left'}
                      </span>

                      <button
                        onClick={() => handleSelectExamForInstructions(exam)}
                        className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Start / View Exam</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-surface-container-lowest rounded-2xl p-16 text-center border border-outline-variant/30 shadow-soft-card flex flex-col items-center justify-center min-h-[340px]">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
                <span className="material-symbols-outlined text-[32px]">assignment_turned_in</span>
              </div>
              <h3 className="font-semibold text-base text-on-surface">No available examinations found</h3>
              <p className="text-xs text-outline mt-1 max-w-sm">
                There are currently no examinations matching your filter. Browse additional exams or check back when new assessments are scheduled.
              </p>
              <button
                onClick={() => { setCategoryFilter('All'); setSearchQuery(''); }}
                className="mt-5 px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
        </>
      )}

      {/* View 2: Exam Instructions & Confirmation Screen */}
      {selectedExam && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top Return Button */}
          <div>
            <button
              onClick={() => setSelectedExam(null)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Available Exams</span>
            </button>
          </div>

          {/* Exam Header Card */}
          <div className="bg-surface-container-lowest rounded-[24px] p-8 shadow-soft-card border border-outline-variant/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-surface-variant">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold mb-2">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Official Examination Blueprint
                </div>
                <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">
                  {selectedExam.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mt-2">
                  <span>Grade: <strong className="text-on-surface">{selectedExam.grade}</strong></span>
                  <span>•</span>
                  <span>Subject: <strong className="text-on-surface">{selectedExam.subject}</strong></span>
                  <span>•</span>
                  <span>Passing Cutoff: <strong className="text-secondary">{selectedExam.passPercent}%</strong></span>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-surface-container-low text-center min-w-[90px] border border-surface-variant">
                  <span className="text-[10px] uppercase font-bold text-outline">Duration</span>
                  <div className="text-xl font-bold text-on-surface mt-0.5">{selectedExam.durationMin}m</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container-low text-center min-w-[90px] border border-surface-variant">
                  <span className="text-[10px] uppercase font-bold text-outline">Questions</span>
                  <div className="text-xl font-bold text-on-surface mt-0.5">{selectedExam.questionsCount}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-secondary-container/40 text-center min-w-[90px] border border-secondary-container">
                  <span className="text-[10px] uppercase font-bold text-on-secondary-container">Pass Mark</span>
                  <div className="text-xl font-bold text-on-secondary-container mt-0.5">{selectedExam.passPercent}%</div>
                </div>
              </div>
            </div>

            {/* Marking Scheme Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-xl bg-secondary-container/20 border border-secondary-container/50">
                <div className="text-xs font-bold text-on-secondary-container flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Correct Response
                </div>
                <div className="text-sm font-semibold text-on-surface mt-1">{selectedExam.markingScheme.correct}</div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant">
                <div className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">remove_circle</span>
                  Incorrect Response
                </div>
                <div className="text-sm font-semibold text-on-surface mt-1">{selectedExam.markingScheme.incorrect}</div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant">
                <div className="text-xs font-bold text-outline flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">help</span>
                  Unattempted Question
                </div>
                <div className="text-sm font-semibold text-on-surface mt-1">{selectedExam.markingScheme.unattempted}</div>
              </div>
            </div>

            {/* Instructions & Guidelines */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">rule</span>
                Detailed Examination Rules & Procedure
              </h3>

              <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant space-y-2.5">
                {selectedExam.instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allowed vs Not Allowed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              {/* Allowed Actions */}
              <div className="p-5 rounded-2xl bg-secondary-container/15 border border-secondary-container/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  Permitted Candidate Actions
                </div>
                <ul className="space-y-2 text-xs text-on-surface-variant">
                  {selectedExam.allowedActions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-secondary font-bold">✓</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Allowed Actions */}
              <div className="p-5 rounded-2xl bg-error-container/15 border border-error-container/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-error uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">block</span>
                  Prohibited Activities & Disqualifiers
                </div>
                <ul className="space-y-2 text-xs text-on-surface-variant">
                  {selectedExam.notAllowedActions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-error font-bold">✕</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Restrictions & Integrity Notice */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">shield</span>
                System Restrictions & Academic Security
              </div>
              <ul className="space-y-1.5 text-xs text-on-surface-variant">
                {selectedExam.restrictions.map((rst, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline mt-1.5 shrink-0"></span>
                    <span>{rst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 3: Confirmation Checkbox & Start Button */}
            <div className="mt-8 pt-6 border-t border-surface-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <label className="flex items-start gap-3 cursor-pointer group max-w-xl">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                    I confirm that I have read and agree to follow all instructions, rules, and restrictions for this examination.
                  </span>
                  <span className="text-[11px] text-outline mt-0.5">
                    I understand that once the exam begins, the timer cannot be paused and leaving the page consumes an attempt.
                  </span>
                </div>
              </label>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedExam(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Go Back
                </button>

                <button
                  type="button"
                  onClick={handleProceedToConfirmation}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                    agreedToTerms
                      ? 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
                      : 'bg-surface-container-high text-outline cursor-not-allowed'
                  }`}
                >
                  <span>Proceed to Start</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Before Starting (Step 3 & 4) */}
      {showConfirmModal && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-md w-full p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">play_circle</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">Are you ready to start this exam?</h3>
                <p className="text-xs text-outline">Verify summary details before activating timer</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low space-y-2 text-xs border border-surface-variant">
              <div className="flex justify-between">
                <span className="text-outline">Exam Name:</span>
                <span className="font-bold text-on-surface text-right max-w-[200px] truncate">{selectedExam.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Allocated Duration:</span>
                <span className="font-bold text-on-surface">{selectedExam.durationMin} Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Total Questions:</span>
                <span className="font-bold text-on-surface">{selectedExam.questionsCount} Questions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Attempt Consumed:</span>
                <span className="font-semibold text-secondary">Slot {selectedExam.attemptsUsed + 1} of {selectedExam.attemptsAllowed}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">warning</span>
              <p className="leading-relaxed">
                <strong>Important:</strong> The {selectedExam.durationMin}-minute countdown will begin immediately upon clicking Start Exam. You cannot pause or restart this session once initiated.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleFinalConfirmStart}
                className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Start Exam Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
