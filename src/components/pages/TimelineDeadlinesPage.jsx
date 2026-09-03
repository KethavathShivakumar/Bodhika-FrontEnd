import React from 'react';

export default function TimelineDeadlinesPage({ onToast }) {
  const timelineGroups = [
    {
      month: "October 2026",
      events: [
        {
          id: "t-1",
          dateNum: "03",
          dateDay: "SAT",
          title: "SAT 2026-27 Reasoning Test",
          track: "International",
          priority: "HIGH PRIORITY",
          priorityColor: "bg-error-container text-on-error-container",
          borderAccent: "bg-error",
          closingNote: "Registration closes Oct 03, 2026 (recommended)",
          centers: "Multiple Centers / Digital CBT",
          officialUrl: "https://satsuite.collegeboard.org",
          examWindow: "Exam: Aug, Sep, Oct, Nov, Dec 2026 · Mar, May, Jun 2027"
        },
        {
          id: "t-2",
          dateNum: "15",
          dateDay: "THU",
          title: "TOEFL iBT Examination",
          track: "International",
          priority: "NORMAL PRIORITY",
          priorityColor: "bg-surface-container-highest text-on-surface-variant",
          borderAccent: "bg-secondary",
          closingNote: "Registration closes Oct 01, 2026",
          centers: "Online / Select Centers",
          officialUrl: "https://ets.org/toefl",
          examWindow: "Exam Window: Continuous Testing"
        }
      ]
    },
    {
      month: "November 2026",
      events: [
        {
          id: "t-3",
          dateNum: "01",
          dateDay: "SUN",
          title: "US Common App (Early Decision / Action)",
          track: "International",
          priority: "HIGH PRIORITY",
          priorityColor: "bg-error-container text-on-error-container",
          borderAccent: "bg-error",
          closingNote: "Deadline: Nov 1 (ED) / Jan 15 (RD) 2027",
          centers: "Online Portal Submission (900+ Universities)",
          officialUrl: "https://commonapp.org",
          examWindow: "Admission Cycle Fall 2027"
        },
        {
          id: "t-4",
          dateNum: "30",
          dateDay: "MON",
          title: "JEE Main 2027 (Session 1)",
          track: "Engineering & Technology",
          priority: "CRITICAL",
          priorityColor: "bg-error-container text-on-error-container",
          borderAccent: "bg-error",
          closingNote: "Registration deadline: Late Nov 2026",
          centers: "All Major Cities across India & Overseas",
          officialUrl: "https://jeemain.nta.ac.in",
          examWindow: "Examination Dates: Jan 21-30, 2027"
        },
        {
          id: "t-5",
          dateNum: "30",
          dateDay: "MON",
          title: "CLAT 2027 (Common Law Admission Test)",
          track: "Law & Government",
          priority: "HIGH PRIORITY",
          priorityColor: "bg-error-container text-on-error-container",
          borderAccent: "bg-secondary",
          closingNote: "Registration deadline: Nov 2026",
          centers: "Offline Pen-Paper Centers Nationwide",
          officialUrl: "https://consortiumofnlus.ac.in",
          examWindow: "Examination Date: Dec 2026"
        },
        {
          id: "t-6",
          dateNum: "30",
          dateDay: "MON",
          title: "AILET 2027 (NLU Delhi)",
          track: "Law & Government",
          priority: "HIGH PRIORITY",
          priorityColor: "bg-secondary-container text-on-secondary-container",
          borderAccent: "bg-secondary",
          closingNote: "Registration deadline: Nov 2026",
          centers: "NLU Delhi Designated Test Centers",
          officialUrl: "https://nationallawuniversitydelhi.in",
          examWindow: "Examination Date: Dec 2026"
        },
        {
          id: "t-7",
          dateNum: "30",
          dateDay: "MON",
          title: "IIM Bangalore UG Entrance 2027",
          track: "Management & Commerce",
          priority: "HIGH PRIORITY",
          priorityColor: "bg-secondary-container text-on-secondary-container",
          borderAccent: "bg-secondary",
          closingNote: "Registration deadline: Nov 2026",
          centers: "Bangalore & Regional Test Centers",
          officialUrl: "https://iimb.ac.in",
          examWindow: "Window: Oct-Nov 2026 (Early Evaluation)"
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-2">
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            Chronological Academic Milestones
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Timeline & Deadlines</h1>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
            Key registration windows and examination dates for your academic roadmap. Never miss a critical filing deadline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast({ title: 'Calendar Synced', message: 'Examination deadlines exported to iCal format.', type: 'success' })}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            <span>Sync with Calendar</span>
          </button>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative pl-6 sm:pl-10">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[31px] sm:left-[47px] top-4 bottom-0 w-0.5 bg-outline-variant/40"></div>

        {timelineGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-12 relative">
            {/* Month Marker */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-soft-card border border-outline-variant/30 z-10 shrink-0">
                <span className="material-symbols-outlined text-outline text-[22px]">calendar_month</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface tracking-tight">{group.month}</h2>
            </div>

            {/* Event Items in Month */}
            <div className="space-y-5 ml-4 sm:ml-6 pl-6 sm:pl-8">
              {group.events.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-soft-card border border-outline-variant/30 hover:shadow-hover-card transition-shadow duration-300 relative overflow-hidden group"
                >
                  {/* Left Color Accent Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${evt.borderAccent}`}></div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pl-2">
                    {/* Date Block */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-surface-container-low flex flex-col items-center justify-center shrink-0 border border-surface-variant">
                        <span className="text-2xl font-extrabold text-on-surface leading-none">{evt.dateNum}</span>
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider mt-1">{evt.dateDay}</span>
                      </div>

                      {/* Content Block */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                            {evt.track}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${evt.priorityColor}`}>
                            {evt.priority}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                          {evt.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mt-1.5">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-outline">schedule</span>
                            {evt.closingNote}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                            {evt.centers}
                          </span>
                        </div>

                        <div className="text-[11px] text-outline mt-1 font-medium">
                          {evt.examWindow}
                        </div>
                      </div>
                    </div>

                    {/* Action Block */}
                    <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                      <a
                        href={evt.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>Official Portal</span>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
