import React, { useState } from 'react';

export default function ScheduledExamsPage({ scheduledList, onStartExam, onToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Mandatory' | 'Online' | 'Center'
  const [activeHallTicket, setActiveHallTicket] = useState(null);

  const filteredExams = scheduledList.filter(exam => {
    if (searchQuery && !exam.name.toLowerCase().includes(searchQuery.toLowerCase()) && !exam.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterType === 'Mandatory' && !exam.mandatory) return false;
    if (filterType === 'Online' && !exam.mode.includes('Online')) return false;
    if (filterType === 'Center' && !exam.mode.includes('Center') && !exam.mode.includes('Lab')) return false;
    return true;
  });

  const getExamIcon = (exam) => {
    const text = (exam.name + ' ' + exam.subject + ' ' + exam.category).toLowerCase();
    if (text.includes('azure') || text.includes('cloud')) return 'cloud';
    if (text.includes('python') || text.includes('algorithm')) return 'terminal';
    if (text.includes('biology') || text.includes('neet')) return 'biotech';
    if (text.includes('jee') || text.includes('physics')) return 'functions';
    return 'calendar_month';
  };

  const handleAddToCalendar = (exam) => {
    onToast({
      title: 'Calendar Reminder Added',
      message: `Event for ${exam.name} on ${exam.date} at ${exam.startTime} added to your calendar.`,
      type: 'success'
    });
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-1.5">
            <span className="material-symbols-outlined text-[15px]">event_upcoming</span>
            Timetabled Academic Calendar
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">Scheduled Examinations</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Confirmed proctored examinations, reporting schedules, and hall tickets for upcoming test windows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onToast({ title: 'Schedule Synced', message: 'All exam windows updated with central academic server.', type: 'info' })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Sync Calendar</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Total Scheduled</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">event</span>
          </div>
          <div className="text-2xl font-extrabold text-on-surface mt-1">{scheduledList.length} Tests</div>
          <div className="text-[11px] text-outline mt-0.5">Confirmed candidate slots</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Next Assessment</span>
            <span className="material-symbols-outlined text-amber-600 text-[18px]">timer</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">In 2 Days</div>
          <div className="text-[11px] text-outline mt-0.5">12 Sep 2026 • 10:00 AM</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Proctored Mocks</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
          </div>
          <div className="text-2xl font-extrabold text-on-surface mt-1">
            {scheduledList.filter(e => e.mandatory).length} Mandatory
          </div>
          <div className="text-[11px] text-secondary font-medium mt-0.5">Academic requirement</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Timezone</span>
            <span className="material-symbols-outlined text-outline text-[18px]">schedule</span>
          </div>
          <div className="text-xl font-bold text-on-surface mt-1">IST (UTC+5:30)</div>
          <div className="text-[11px] text-outline mt-0.5">Automated server sync</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-soft-card border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'All', label: 'All Scheduled' },
            { id: 'Mandatory', label: 'Mandatory Only' },
            { id: 'Online', label: 'Online CBT' },
            { id: 'Center', label: 'Campus Lab Center' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 bg-surface-container-low rounded-xl flex items-center px-3 h-9 gap-2 border border-transparent focus-within:border-primary focus-within:bg-surface-container-lowest transition-all">
          <span className="material-symbols-outlined text-outline text-[16px]">search</span>
          <input
            type="text"
            placeholder="Search scheduled exam..."
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

      {/* Scheduled Exams Compact Card Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-soft-card hover:shadow-hover-card hover:border-outline-variant/60 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent line based on days left */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  exam.daysLeft <= 3 ? 'bg-amber-500' : 'bg-secondary'
                }`}
              ></div>

              <div>
                {/* Top Row: Icon + Grade + Countdown Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-surface-container-low group-hover:bg-secondary-container/30 flex items-center justify-center text-on-surface group-hover:text-secondary transition-colors shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{getExamIcon(exam)}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block truncate">
                        {exam.grade}
                      </span>
                      <span className="text-[11px] font-medium text-on-surface-variant truncate block">
                        {exam.subject}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1 ${
                      exam.daysLeft <= 3
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    <span>{exam.countdown}</span>
                  </span>
                </div>

                {/* Exam Title */}
                <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                  {exam.name}
                </h3>

                {/* Date & Time Window Box */}
                <div className="my-3 p-3 rounded-xl bg-surface-container-low/70 border border-surface-variant/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                    <span className="material-symbols-outlined text-[15px] text-secondary">calendar_today</span>
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-outline">
                    <span className="material-symbols-outlined text-[14px]">access_time</span>
                    <span>{exam.timeWindow}</span>
                  </div>
                </div>

                {/* Mode & Venue Info */}
                <div className="space-y-1.5 text-[11px] text-outline mb-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 truncate">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      <span className="truncate">{exam.center}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration: <strong className="text-on-surface">{exam.durationMin}m</strong></span>
                    <span>Questions: <strong className="text-on-surface">{exam.questionsCount} Qs</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 mt-3 border-t border-surface-variant/50 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveHallTicket(exam)}
                    className="flex-1 py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">badge</span>
                    <span>Hall Ticket</span>
                  </button>

                  <button
                    onClick={() => handleAddToCalendar(exam)}
                    className="p-2 rounded-xl border border-surface-variant text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    title="Add to Calendar"
                  >
                    <span className="material-symbols-outlined text-[16px] block">calendar_add_on</span>
                  </button>
                </div>

                <button
                  onClick={() => onStartExam(exam)}
                  className="w-full py-2 px-3 rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition-all font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[15px]">login</span>
                  <span>Enter Test Lobby</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant/30 shadow-soft-card flex flex-col items-center justify-center min-h-[260px]">
          <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
            <span className="material-symbols-outlined text-[28px]">event_busy</span>
          </div>
          <h3 className="font-bold text-base text-on-surface">No scheduled examinations found</h3>
          <p className="text-xs text-outline mt-1 max-w-sm">
            You do not currently have any scheduled assessments matching this filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setFilterType('All'); }}
            className="mt-4 px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Hall Ticket / Schedule Slip Modal */}
      {activeHallTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-lg w-full p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-surface-variant pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Official Examination Hall Ticket</h3>
                  <p className="text-xs text-outline">Bodhika Unified Academic Assessment Portal</p>
                </div>
              </div>
              <button
                onClick={() => setActiveHallTicket(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Slip Details Grid */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant/50 space-y-3.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-surface-variant/40">
                <span className="text-outline">Hall Ticket Number:</span>
                <span className="font-mono font-bold text-on-surface">{activeHallTicket.hallTicketNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Examination:</span>
                <span className="font-bold text-on-surface text-right max-w-[240px] truncate">{activeHallTicket.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Date & Time:</span>
                <span className="font-bold text-secondary text-right">{activeHallTicket.date} • {activeHallTicket.timeWindow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Reporting Time:</span>
                <span className="font-bold text-amber-700">{activeHallTicket.reportingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Assigned Slot / Center:</span>
                <span className="font-medium text-on-surface text-right">{activeHallTicket.slot} • {activeHallTicket.center}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-surface-variant/40">
                <span className="text-outline">Candidate ID:</span>
                <span className="font-bold text-on-surface font-mono">BDK-2024 (Kethavath Shivakumar)</span>
              </div>
            </div>

            {/* Instructions Alert */}
            <div className="p-3.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px] flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">info</span>
              <p>{activeHallTicket.instructions}</p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  onToast({ title: 'Print Prompt', message: 'Generating print version of Hall Ticket.', type: 'info' });
                }}
                className="px-4 py-2 rounded-full border border-surface-variant text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Ticket</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveHallTicket(null)}
                className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
