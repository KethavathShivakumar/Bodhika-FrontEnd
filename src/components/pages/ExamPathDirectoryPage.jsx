import React, { useState } from 'react';

export default function ExamPathDirectoryPage({ directoryList, onTrackExam, onToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [bangaloreOnly, setBangaloreOnly] = useState(false);
  const [selectedExamDetails, setSelectedExamDetails] = useState(null);

  const categories = [
    'All',
    'Engineering & Technology',
    'Medical & Health',
    'Law & Government',
    'Management & Commerce',
    'Design, Arts & Culture',
    'Defence',
    'Hospitality & Tourism',
    'International'
  ];

  const filteredExams = directoryList.filter(exam => {
    if (searchQuery && !exam.title.toLowerCase().includes(searchQuery.toLowerCase()) && !exam.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeCategory !== 'All' && exam.category !== activeCategory && exam.track !== activeCategory) {
      return false;
    }
    if (bangaloreOnly && !exam.isBangalore) {
      return false;
    }
    return true;
  });

  const registeredDoneCount = directoryList.filter(e => e.status === 'Registered' || e.status === 'Completed').length;
  const closingSoonCount = directoryList.filter(e => e.daysLeft <= 60).length;
  const bangaloreCount = directoryList.filter(e => e.isBangalore).length;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Banner Section (From Bodhika UI reference) */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-container-low px-8 py-10 border border-outline-variant/30">
        <div className="absolute right-0 top-0 w-80 h-80 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">explore</span>
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-on-surface">ExamPath Directory</h1>
              <p className="text-xs font-semibold text-outline uppercase tracking-wider">All Examinations & Collegiate Entrances</p>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Discover and track national and global examination benchmarks. Filter by discipline, monitor registration deadlines, and align your undergraduate preparation strategy.
          </p>
        </div>
      </section>

      {/* 4 Stat Overview Cards Grid (From Page 13 screenshot & reference) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Exams */}
        <div className="bg-surface-container rounded-2xl p-5 flex flex-col justify-between shadow-soft-card border border-surface-variant">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Total Exams</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-4xl font-extrabold text-on-surface">89</span>
            <span className="material-symbols-outlined text-outline text-[24px]">dataset</span>
          </div>
        </div>

        {/* Closing in 60 Days */}
        <div className="bg-error-container text-on-error-container rounded-2xl p-5 flex flex-col justify-between shadow-soft-card relative overflow-hidden">
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">Closing in 60 Days</span>
          <div className="flex items-baseline justify-between mt-2 z-10">
            <span className="text-4xl font-extrabold">{closingSoonCount}</span>
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-error text-on-error">Urgent</span>
          </div>
          <span className="material-symbols-outlined absolute -bottom-3 -right-3 text-[72px] opacity-15">warning</span>
        </div>

        {/* Registered / Done */}
        <div className="bg-surface-container rounded-2xl p-5 flex flex-col justify-between shadow-soft-card border border-surface-variant">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Registered / Done</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-4xl font-extrabold text-on-surface">{registeredDoneCount}</span>
            <span className="text-xs font-medium text-outline">In Tracker</span>
          </div>
        </div>

        {/* Bangalore Based */}
        <div className="bg-secondary-container text-on-secondary-container rounded-2xl p-5 flex flex-col justify-between shadow-soft-card relative overflow-hidden">
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">Bangalore Based</span>
          <div className="flex items-baseline justify-between mt-2 z-10">
            <span className="text-4xl font-extrabold">{bangaloreCount}</span>
            <span className="material-symbols-outlined text-[24px]">location_city</span>
          </div>
          <span className="material-symbols-outlined absolute -bottom-3 -right-3 text-[72px] opacity-15">location_city</span>
        </div>
      </section>

      {/* Filter and Search Bar (From Page 13 screenshot & reference) */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Bangalore Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-surface-variant/40">
          <div className="w-full sm:w-80 bg-surface-container-low rounded-xl flex items-center px-3.5 h-11 gap-2">
            <span className="material-symbols-outlined text-outline text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search exam or college name..."
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

          <label className="flex items-center gap-2.5 cursor-pointer select-none self-end sm:self-auto">
            <input
              type="checkbox"
              checked={bangaloreOnly}
              onChange={(e) => setBangaloreOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-container-high peer-checked:bg-secondary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative"></div>
            <span className="text-xs font-medium text-on-surface flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Bangalore Centers Only ({bangaloreCount})
            </span>
          </label>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const isCritical = exam.priority === 'CRITICAL';
          const isTracked = exam.status === 'Registered' || exam.status === 'Completed';

          return (
            <div
              key={exam.id}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 hover:shadow-hover-card transition-all duration-300 relative group overflow-hidden"
            >
              {/* Top Accent Gradient Pill */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 pointer-events-none ${
                isCritical ? 'bg-error-container' : 'bg-secondary-container'
              }`}></div>

              <div>
                {/* Header Track & Priority */}
                <div className="flex items-start justify-between z-10 relative">
                  <div>
                    <span className="text-[11px] font-semibold text-outline uppercase tracking-wider block">
                      {exam.track}
                    </span>
                    <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors mt-0.5">
                      {exam.title}
                    </h3>
                    <span className="text-xs text-on-surface-variant block mt-0.5">{exam.subTitle}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                    isCritical ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
                  }`}>
                    {exam.priority}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[11px] font-medium">
                    {exam.category}
                  </span>
                  {exam.isBangalore && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      BLR
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">
                  {exam.description}
                </p>

                {/* Quick Info Grid */}
                <div className="mt-4 pt-3 border-t border-surface-variant/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-outline">
                    <span>Reg. Deadline:</span>
                    <span className="font-semibold text-on-surface">{exam.regDeadline}</span>
                  </div>
                  <div className="flex items-center justify-between text-outline">
                    <span>Fee:</span>
                    <span className="font-semibold text-on-surface">{exam.fee}</span>
                  </div>
                  <div className="text-[11px] text-outline truncate pt-1">
                    <span className="font-medium text-on-surface-variant">Accepted: </span>
                    {exam.acceptedBy}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-5 pt-4 border-t border-surface-variant flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-1 text-xs font-semibold text-error">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  <span>{exam.daysLeft}d left</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onTrackExam(exam.id, isTracked ? 'Not Started' : 'Registered');
                      onToast({
                        title: isTracked ? 'Removed from Tracker' : 'Added to Exam Tracker',
                        message: `${exam.title} is now marked as ${isTracked ? 'Not Started' : 'Registered'}.`,
                        type: 'success'
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                      isTracked 
                        ? 'bg-secondary-container text-on-secondary-container' 
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                    title="Track in My Exam Tracker"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isTracked ? 'task_alt' : 'bookmark_add'}
                    </span>
                    <span>{isTracked ? 'Tracked' : 'Track'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedExamDetails(exam)}
                    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1"
                  >
                    <span>Details</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Quick Details Modal */}
      {selectedExamDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-secondary uppercase">{selectedExamDetails.track}</span>
                <h3 className="font-bold text-xl text-on-surface mt-0.5">{selectedExamDetails.title}</h3>
                <p className="text-xs text-outline">{selectedExamDetails.subTitle}</p>
              </div>
              <button 
                onClick={() => setSelectedExamDetails(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-outline">Exam Dates:</span>
                <span className="font-semibold text-on-surface text-right">{selectedExamDetails.examDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Registration Deadline:</span>
                <span className="font-semibold text-on-surface">{selectedExamDetails.regDeadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Fee:</span>
                <span className="font-semibold text-on-surface">{selectedExamDetails.fee}</span>
              </div>
              <div className="pt-2 border-t border-surface-variant">
                <span className="text-outline block mb-1">Target Universities:</span>
                <p className="text-on-surface leading-relaxed">{selectedExamDetails.acceptedBy}</p>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              {selectedExamDetails.description}
            </p>

            <div className="pt-3 border-t border-surface-variant flex justify-end gap-2">
              <button
                onClick={() => setSelectedExamDetails(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
