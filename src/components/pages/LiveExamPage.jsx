import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function LiveExamPage({ exam, onCompleteExam, onExitExam, onToast }) {
  const questions = exam?.questions || [];
  const totalQuestions = questions.length || 1;
  const initialDuration = (exam?.durationMin || 15) * 60;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: 'B' }
  const [skippedQuestions, setSkippedQuestions] = useState({}); // { [qId]: true }
  const [reviewQuestions, setReviewQuestions] = useState({}); // { [qId]: true }
  const [visitedQuestions, setVisitedQuestions] = useState({ 1: true });
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [layoutMode, setLayoutMode] = useState('stacked'); // 'stacked' | 'side-by-side'
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [examResult, setExamResult] = useState(null);

  // Active countdown timer
  useEffect(() => {
    if (examResult) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examResult]);

  const currentQ = questions[currentQIndex] || questions[0];

  const goToQuestion = (index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQIndex(index);
      setVisitedQuestions(prev => ({ ...prev, [questions[index].id]: true }));
    }
  };

  const handleSelectOption = (optId) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optId }));
    setSkippedQuestions(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleReview = () => {
    setReviewQuestions(prev => {
      const copy = { ...prev };
      if (copy[currentQ.id]) {
        delete copy[currentQ.id];
        onToast({ title: 'Flag Removed', message: `Question ${currentQ.id} unflagged.`, type: 'info' });
      } else {
        copy[currentQ.id] = true;
        onToast({ title: 'Marked for Review', message: `Question ${currentQ.id} flagged for review.`, type: 'info' });
      }
      return copy;
    });
  };

  const handleSkip = () => {
    setSkippedQuestions(prev => ({ ...prev, [currentQ.id]: true }));
    if (currentQIndex < totalQuestions - 1) {
      goToQuestion(currentQIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < totalQuestions - 1) {
      goToQuestion(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      goToQuestion(currentQIndex - 1);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const reviewCount = Object.keys(reviewQuestions).length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleSubmitExam = () => {
    setShowSubmitModal(false);

    // Calculate score
    let correctCount = 0;
    let wrongCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      } else if (selectedAnswers[q.id] !== undefined) {
        wrongCount++;
      }
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passThreshold = exam?.passPercent || 60;
    const passed = scorePercent >= passThreshold;

    if (passed) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // safe fallback
      }
    }

    const resultData = {
      id: `att-${Date.now()}`,
      rank: passed ? "#1" : "#2",
      exam: exam?.name || "Official Examination",
      grade: exam?.grade || "Academic Evaluation",
      subject: exam?.subject || "Examination Assessment",
      score: `${correctCount} / ${totalQuestions}`,
      scorePercent,
      correct: correctCount,
      wrong: wrongCount,
      skipped: totalQuestions - answeredCount,
      result: passed ? "Pass" : "Fail",
      attempts: `${(exam?.attemptsUsed || 1) + 1}/${exam?.attemptsAllowed || 3}`,
      duration: formatTimer(initialDuration - timeLeft),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      details: passed
        ? `Congratulations! You successfully cleared ${exam?.name || 'the examination'} with ${scorePercent}% (Cutoff: ${passThreshold}%).`
        : `Passing cutoff (${passThreshold}%) was not reached on this attempt. Review question solutions below.`
    };

    setExamResult(resultData);
    if (onCompleteExam) {
      onCompleteExam(resultData);
    }
    onToast({
      title: passed ? 'Exam Passed! 🎉' : 'Exam Submitted',
      message: `Attained Score: ${scorePercent}%. Result: ${resultData.result}`,
      type: passed ? 'success' : 'error'
    });
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Banner: Collapsible Instructions */}
      {showInstructions && (
        <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-outline-variant/30 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface shrink-0">
              <span className="material-symbols-outlined text-[20px]">info</span>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">Active Session Guidelines</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Each question has one correct choice. You can mark questions for review using the bookmark flag button.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstructions(false)}
              className="px-3.5 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Main Exam Title & Metadata Header */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
              {exam?.grade}
            </span>
            <span className="text-xs text-outline">•</span>
            <span className="text-xs font-medium text-outline">{exam?.category}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            {exam?.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mt-2">
            <span>Subject: <strong className="text-on-surface">{exam?.subject}</strong></span>
            <span>•</span>
            <span>Questions: <strong className="text-on-surface">{totalQuestions}</strong></span>
            <span>•</span>
            <span>Pass Cutoff: <strong className="text-secondary">{exam?.passPercent}%</strong></span>
          </div>
        </div>

        {/* Right Stats: Timer & Layout Switcher */}
        <div className="flex flex-wrap items-center gap-4 self-end md:self-auto">
          {/* Layout switcher */}
          <div className="flex bg-surface-container-low p-1 rounded-xl border border-surface-variant text-xs font-semibold">
            <button
              onClick={() => setLayoutMode('stacked')}
              className={`px-3 py-1 rounded-lg transition-all ${layoutMode === 'stacked' ? 'bg-surface-container-lowest shadow-sm text-on-surface' : 'text-outline'}`}
            >
              Stacked
            </button>
            <button
              onClick={() => setLayoutMode('side-by-side')}
              className={`px-3 py-1 rounded-lg transition-all ${layoutMode === 'side-by-side' ? 'bg-surface-container-lowest shadow-sm text-on-surface' : 'text-outline'}`}
            >
              Side-by-side
            </button>
          </div>

          {/* Time Left Counter */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary-container/40 border border-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-[20px] animate-pulse">timer</span>
            <span className="text-xs font-semibold">Time Left:</span>
            <span className="text-base font-mono font-bold">{formatTimer(timeLeft)}</span>
          </div>

          {/* Answered counter */}
          <div className="text-xs font-semibold text-on-surface bg-surface-container-low px-3 py-2 rounded-xl">
            Answered: <span className="text-secondary font-bold">{answeredCount}</span> / {totalQuestions}
          </div>

          <button
            onClick={onExitExam}
            className="text-xs text-outline hover:text-error transition-colors px-2 py-1"
          >
            Exit Exam
          </button>
        </div>
      </div>

      {/* Question Navigator Palette */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-soft-card border border-outline-variant/30 space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-surface-variant pb-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-primary ring-2 ring-primary/30"></span>
              <span className="text-on-surface-variant font-medium">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span className="text-on-surface-variant font-medium">Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600"></span>
              <span className="text-on-surface-variant font-medium">Marked for Review ({reviewCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="text-on-surface-variant font-medium">Skipped</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
              <span className="text-on-surface-variant font-medium">Not visited</span>
            </div>
          </div>

          <span className="text-xs text-outline">Click any number to jump directly to that question</span>
        </div>

        {/* Numbers Palette Row */}
        <div className="flex flex-wrap items-center gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentQIndex;
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isReviewed = reviewQuestions[q.id];
            const isSkipped = skippedQuestions[q.id];
            const isVisited = visitedQuestions[q.id];

            let paletteStyle = "bg-surface-container-low text-outline border-transparent";
            if (isAnswered) {
              paletteStyle = "bg-secondary text-on-secondary border-secondary font-bold";
            } else if (isReviewed) {
              paletteStyle = "bg-purple-100 text-purple-900 border-purple-400 font-bold ring-1 ring-purple-300";
            } else if (isSkipped) {
              paletteStyle = "bg-amber-100 text-amber-900 border-amber-300 font-bold";
            } else if (isVisited) {
              paletteStyle = "bg-surface-container-high text-on-surface font-semibold";
            }

            if (isCurrent) {
              paletteStyle = "bg-primary text-on-primary font-bold ring-4 ring-primary/20 scale-105 z-10";
            }

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs transition-all border relative ${paletteStyle}`}
              >
                <span>{idx + 1}</span>
                {isReviewed && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-600 ring-2 ring-surface-container-lowest"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Workspace */}
      <div className={`grid gap-6 ${layoutMode === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Question & Options Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-soft-card border border-outline-variant/30 space-y-6">
          {/* Question Meta & Controls Bar */}
          <div className="flex items-center justify-between border-b border-surface-variant pb-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                {currentQ.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
                {currentQ.type}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleReview}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 border ${
                  reviewQuestions[currentQ.id]
                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border-surface-variant'
                }`}
                title="Flag this question for later review"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {reviewQuestions[currentQ.id] ? 'bookmark_added' : 'bookmark_border'}
                </span>
                <span>{reviewQuestions[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>

              <button
                onClick={handleSkip}
                className="px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-semibold transition-colors border border-amber-200"
              >
                Skip for now
              </button>
              <button
                onClick={handlePrev}
                disabled={currentQIndex === 0}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors disabled:opacity-40"
              >
                ‹ Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQIndex === totalQuestions - 1}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Next ›
              </button>
            </div>
          </div>

          {/* Question Statement */}
          <div className="text-base sm:text-lg font-medium text-on-surface leading-relaxed pt-2">
            {currentQ.question}
          </div>

          {/* Interactive Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options?.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              return (
                <label
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className="block cursor-pointer select-none group"
                >
                  <div
                    className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'bg-primary-container text-white border-primary shadow-sm ring-1 ring-primary'
                        : 'bg-surface-container-low hover:bg-surface-container border-surface-variant text-on-surface'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-white text-primary'
                          : 'bg-surface-container-high text-on-surface-variant group-hover:bg-surface-container-highest'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="text-sm font-medium leading-normal flex-1">
                      {opt.text}
                    </span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[20px] text-white">
                        check_circle
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          {/* Bottom Actions Bar */}
          <div className="pt-6 border-t border-surface-variant flex items-center justify-between">
            <span className="text-xs text-outline">
              Question {currentQIndex + 1} of {totalQuestions}
            </span>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-2.5 rounded-full bg-secondary text-on-secondary text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span>Submit Exam</span>
            </button>
          </div>
        </div>

        {/* Side-by-side Reference / Palette Panel */}
        {layoutMode === 'side-by-side' && (
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-soft-card border border-outline-variant/30 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-base text-on-surface">Live Exam Status Matrix</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Review your current question progress before final submission.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-surface-container-low text-center">
                  <span className="text-[10px] uppercase font-bold text-outline">Answered</span>
                  <div className="text-2xl font-bold text-secondary">{answeredCount}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-purple-50 text-center border border-purple-200">
                  <span className="text-[10px] uppercase font-bold text-purple-800">For Review</span>
                  <div className="text-2xl font-bold text-purple-800">{reviewCount}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low text-center">
                  <span className="text-[10px] uppercase font-bold text-outline">Unanswered</span>
                  <div className="text-2xl font-bold text-error">{unansweredCount}</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant text-xs text-outline">
              Passing Cutoff: {exam?.passPercent || 60}% required to clear this evaluation.
            </div>
          </div>
        )}
      </div>

      {/* Step 7: Submit Confirmation Dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-md w-full p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">Submit Examination?</h3>
                <p className="text-xs text-outline">Review your progress before concluding</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low space-y-2 text-xs border border-surface-variant">
              <div className="flex justify-between">
                <span className="text-outline">Questions Answered:</span>
                <span className="font-bold text-secondary">{answeredCount} of {totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Unanswered Questions:</span>
                <span className="font-bold text-error">{unansweredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Questions Marked for Review:</span>
                <span className="font-bold text-purple-700">{reviewCount}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-surface-variant/60">
                <span className="text-outline">Time Remaining:</span>
                <span className="font-mono font-bold text-on-surface">{formatTimer(timeLeft)}</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you want to finalize this exam? Your responses will be scored immediately and your attempt logged in Academic History.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Continue Exam
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 8: Completion / Score Report Modal */}
      {examResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-surface-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  examResult.result === 'Pass' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                }`}>
                  <span className="material-symbols-outlined text-[28px]">
                    {examResult.result === 'Pass' ? 'verified' : 'cancel'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-outline uppercase">{examResult.grade}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                      examResult.result === 'Pass' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                    }`}>
                      {examResult.result}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-on-surface mt-0.5">{examResult.exam}</h3>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Score Highlight Card */}
              <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-variant flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">Attained Score</span>
                  <div className="text-4xl font-extrabold text-on-surface mt-1">{examResult.scorePercent}%</div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {examResult.correct} correct out of {totalQuestions} questions ({examResult.details})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-surface-container-lowest rounded-xl text-center min-w-[90px]">
                    <div className="text-xs text-outline">Correct</div>
                    <div className="text-lg font-bold text-secondary">{examResult.correct}</div>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-xl text-center min-w-[90px]">
                    <div className="text-xs text-outline">Wrong</div>
                    <div className="text-lg font-bold text-error">{examResult.wrong}</div>
                  </div>
                  <div className="p-3 bg-surface-container-lowest rounded-xl text-center min-w-[90px]">
                    <div className="text-xs text-outline">Time</div>
                    <div className="text-lg font-bold text-on-surface">{examResult.duration}</div>
                  </div>
                </div>
              </div>

              {/* Question Review & Solutions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-outline">Answer Review & Explanations</h4>
                {questions.map((q, idx) => {
                  const studentAns = selectedAnswers[q.id];
                  const isCorrect = studentAns === q.correctAnswer;
                  return (
                    <div key={q.id} className="p-4 rounded-xl bg-surface-container-low border border-surface-variant space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCorrect ? 'bg-secondary text-on-secondary' : 'bg-error text-on-error'
                          }`}>
                            {isCorrect ? '✓' : '✕'}
                          </span>
                          <span className="text-xs font-bold text-on-surface">Question {idx + 1}</span>
                        </div>
                        <span className={`text-[11px] font-bold ${isCorrect ? 'text-secondary' : studentAns ? 'text-error' : 'text-outline'}`}>
                          {isCorrect ? 'Correct' : studentAns ? `Incorrect (Your choice: ${studentAns})` : 'Skipped'}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-on-surface">{q.question}</p>

                      <div className="p-2.5 rounded-lg bg-surface-container-lowest text-xs text-on-surface-variant">
                        <span className="font-semibold text-secondary">Explanation: </span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-surface-container-low border-t border-surface-variant flex items-center justify-between">
              <button
                type="button"
                onClick={onExitExam}
                className="px-5 py-2 rounded-full text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Back to Available Exams
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAnswers({});
                  setSkippedQuestions({});
                  setReviewQuestions({});
                  setCurrentQIndex(0);
                  setTimeLeft(initialDuration);
                  setExamResult(null);
                }}
                className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">replay</span>
                <span>Retake Exam</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
