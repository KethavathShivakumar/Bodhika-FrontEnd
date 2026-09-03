import React, { useState } from 'react';

export default function ExaminationListPage({ exams, onTakeExam, onViewHistory, onToast }) {
  const [searchName, setSearchName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedFee, setSelectedFee] = useState('All');
  const [selectedChapter, setSelectedChapter] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const handleReset = () => {
    setSearchName('');
    setSelectedGrade('All');
    setSelectedSubject('All');
    setSelectedType('All');
    setSelectedCountry('All');
    setSelectedFee('All');
    setSelectedChapter('All');
    setSelectedLanguage('All');
    setSortBy('newest');
    onToast({ title: 'Filters Reset', message: 'All filters cleared to defaults.', type: 'info' });
  };

  const filteredExams = exams.filter(e => {
    if (searchName && !e.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    if (selectedGrade !== 'All' && e.grade !== selectedGrade) return false;
    if (selectedSubject !== 'All' && e.subject !== selectedSubject) return false;
    if (selectedFee === 'Free' && !e.isFree) return false;
    if (selectedFee === 'Paid' && e.isFree) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'oldest') return a.id.localeCompare(b.id);
    return b.id.localeCompare(a.id); // newest default
  });

  // Helper to pick a clean, contextual Material Symbol for each exam
  const getExamIcon = (exam) => {
    const text = (exam.name + ' ' + exam.subject + ' ' + exam.category + ' ' + exam.grade).toLowerCase();
    if (text.includes('azure') || text.includes('cloud') || text.includes('dp-900')) return 'cloud';
    if (text.includes('verbal') || text.includes('english') || text.includes('aptitude')) return 'psychology';
    if (text.includes('python') || text.includes('algorithm') || text.includes('coding')) return 'terminal';
    if (text.includes('biology') || text.includes('neet') || text.includes('medical')) return 'biotech';
    if (text.includes('physics') || text.includes('math') || text.includes('jee')) return 'functions';
    if (text.includes('cricket') || text.includes('sports') || text.includes('gk')) return 'sports_cricket';
    if (text.includes('technical') || text.includes('tcs') || text.includes('infosys')) return 'code';
    return 'assignment';
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-1.5">
            <span className="material-symbols-outlined text-[15px]">dashboard</span>
            Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">Examination Management</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Access your assigned academic assessments, scheduled entrance mocks, and review past attempts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTakeExam()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
            <span>Take Exam</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-soft-card border border-outline-variant/30 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Exam Name Search */}
          <div className="flex flex-col gap-1 lg:col-span-2">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Exam Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full bg-surface-container-low h-9 rounded-xl px-3 text-xs text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary"
              />
              {searchName && (
                <button
                  onClick={() => setSearchName('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Grade */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-surface-container-low h-9 rounded-xl px-2.5 text-xs text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="All">— All Grades —</option>
              <option value="Aptitude Test">Aptitude Test</option>
              <option value="Microsoft Certifications">Microsoft Certifications</option>
              <option value="Technical Assessment">Technical Assessment</option>
              <option value="Medical Entrance">Medical Entrance</option>
              <option value="Engineering Entrance">Engineering Entrance</option>
              <option value="General Knowledge">General Knowledge</option>
              <option value="Campus Placement">Campus Placement</option>
            </select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-surface-container-low h-9 rounded-xl px-2.5 text-xs text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="All">— All Subjects —</option>
              <option value="Verbal Ability">Verbal Ability</option>
              <option value="DP-900: Azure Data Fundamentals">DP-900: Azure Data</option>
              <option value="Computer Science">Computer Science</option>
              <option value="NEET Biology">NEET Biology</option>
              <option value="Mathematics & Physics">Mathematics & Physics</option>
              <option value="General Knowledge">General Knowledge</option>
              <option value="Technical Aptitude">Technical Aptitude</option>
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-surface-container-low h-9 rounded-xl px-2.5 text-xs text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="All">— All Types —</option>
              <option value="Mock">Mock Test</option>
              <option value="Practice">Practice Test</option>
              <option value="Assessment">Assessment</option>
            </select>
          </div>

          {/* Fee */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Fee</label>
            <select
              value={selectedFee}
              onChange={(e) => setSelectedFee(e.target.value)}
              className="w-full bg-surface-container-low h-9 rounded-xl px-2.5 text-xs text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="All">— Paid & Free —</option>
              <option value="Free">Free Only</option>
              <option value="Paid">Paid Only</option>
            </select>
          </div>
        </div>

        {/* Second Row of Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 pt-2 border-t border-surface-variant/40 items-end">
          {/* Chapter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Chapter</label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full bg-surface-container-low h-9 rounded-xl px-2.5 text-xs text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="All">— All Chapters —</option>
              <option value="Ch1">Core Concepts</option>
              <option value="Ch2">Relational Workloads</option>
              <option value="Ch3">Analytics & Warehousing</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-surface-container-low h-9 rounded-xl px-2.5 text-xs text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="All">— All Languages —</option>
              <option value="EN">English (EN)</option>
              <option value="HI">Hindi (HI)</option>
            </select>
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-surface-container-low h-9 rounded-xl px-2.5 text-xs text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="All">— All Countries —</option>
              <option value="IN">India</option>
              <option value="US">United States</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-surface-container-low h-9 rounded-xl px-2.5 text-xs text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Filter Action Buttons */}
          <div className="lg:col-span-2 flex items-center gap-2 justify-end">
            <button
              onClick={() => onToast({ title: 'Filters Applied', message: `Showing ${filteredExams.length} examinations.`, type: 'info' })}
              className="h-9 px-4 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[15px]">filter_list</span>
              <span>Filter</span>
            </button>
            <button
              onClick={handleReset}
              className="h-9 px-3.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors text-xs font-semibold flex items-center gap-1"
              title="Clear all filters"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Examination Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </div>
          <div>
            <h2 className="font-bold text-base text-on-surface">Examination Catalog</h2>
            <p className="text-xs text-outline">Available tests formatted in compact cards</p>
          </div>
          <span className="ml-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
            {filteredExams.length} Available
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-outline hidden sm:flex">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span>Click any card to start or retake an assessment</span>
        </div>
      </div>

      {/* Redesigned Compact Card/Box Grid (Replacing the large horizontal table) */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredExams.map((exam) => {
            const isDone = exam.status === 'Done';
            return (
              <div
                key={exam.id}
                className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-soft-card hover:shadow-hover-card hover:border-outline-variant/60 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-primary transition-colors"></div>

                <div>
                  {/* Card Top Row: Subject Icon + Grade Label + Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-surface-container-low group-hover:bg-secondary-container/30 flex items-center justify-center text-on-surface group-hover:text-secondary transition-colors shrink-0">
                        <span className="material-symbols-outlined text-[20px]">{getExamIcon(exam)}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider block truncate">
                          {exam.grade || 'Assessment'}
                        </span>
                        <span className="text-[11px] font-medium text-on-surface-variant truncate block">
                          {exam.subject}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                      isDone
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container-high text-on-surface'
                    }`}>
                      {isDone && <span className="material-symbols-outlined text-[12px]">check</span>}
                      {exam.status}
                    </span>
                  </div>

                  {/* Exam Name */}
                  <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                    {exam.name}
                  </h3>

                  {/* Compact Metrics Row (Questions, Duration, Pass Mark) */}
                  <div className="grid grid-cols-3 gap-1.5 py-2.5 my-3 bg-surface-container-low/70 rounded-xl px-2 border border-surface-variant/40 text-center">
                    <div>
                      <span className="text-[9px] text-outline uppercase font-semibold block">Questions</span>
                      <span className="text-xs font-bold text-on-surface mt-0.5 block">{exam.questions} Qs</span>
                    </div>
                    <div className="border-x border-surface-variant/60">
                      <span className="text-[9px] text-outline uppercase font-semibold block">Duration</span>
                      <span className="text-xs font-bold text-on-surface mt-0.5 block">{exam.timeMin}m</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-outline uppercase font-semibold block">Pass Mark</span>
                      <span className="text-xs font-bold text-secondary mt-0.5 block">{exam.passPercent}</span>
                    </div>
                  </div>

                  {/* Due Date & Attempts Info */}
                  <div className="flex items-center justify-between text-[11px] text-outline px-0.5 mb-1">
                    <span className="flex items-center gap-1 truncate text-outline">
                      <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                      <span className="truncate">{exam.due && exam.due !== '—' ? `Due ${exam.due}` : 'Always open'}</span>
                    </span>
                    <span className="font-medium text-on-surface-variant shrink-0">
                      Slot: {exam.attempts}
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 mt-3 border-t border-surface-variant/50 flex items-center gap-2">
                  <button
                    onClick={() => onViewHistory(exam.subject)}
                    className="p-2 rounded-xl border border-surface-variant text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    title="View attempt history"
                  >
                    <span className="material-symbols-outlined text-[16px] block">history</span>
                  </button>
                  <button
                    onClick={() => onTakeExam(exam)}
                    className="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition-all font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isDone ? 'replay' : 'play_arrow'}
                    </span>
                    <span>{isDone ? `Retake (${exam.attempts})` : 'Start Exam'}</span>
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
            <span className="material-symbols-outlined text-[28px]">search_off</span>
          </div>
          <h3 className="font-bold text-base text-on-surface">No examinations match your criteria</h3>
          <p className="text-xs text-outline mt-1 max-w-sm">
            Try adjusting your name search or grade/subject filters to view available assessments.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
