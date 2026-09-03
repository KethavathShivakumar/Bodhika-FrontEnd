import React, { useState } from 'react';

export default function ExamTrackerPage({ directoryList, onUpdateStatus, onToast }) {
  const [filterQuery, setFilterQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('All');

  const filteredItems = directoryList.filter(item => {
    if (filterQuery && !item.title.toLowerCase().includes(filterQuery.toLowerCase()) && !item.subTitle?.toLowerCase().includes(filterQuery.toLowerCase())) {
      return false;
    }
    if (trackFilter !== 'All' && item.track !== trackFilter) {
      return false;
    }
    return true;
  });

  // Calculate live counters
  const registeredCount = directoryList.filter(i => i.status === 'Registered').length;
  const completedCount = directoryList.filter(i => i.status === 'Completed').length;
  const skippingCount = directoryList.filter(i => i.status === 'Skipping').length;
  const remainingCount = directoryList.length - registeredCount - completedCount - skippingCount;

  const handleStatusChange = (id, newStatus) => {
    onUpdateStatus(id, newStatus);
    onToast({
      title: 'Status Updated',
      message: `Exam status set to "${newStatus}". Tracker summary refreshed.`,
      type: 'success'
    });
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Exam,Track,Priority,Reg Deadline,Status"].join(",") + "\n"
      + directoryList.map(e => `"${e.title}","${e.track}","${e.priority}","${e.regDeadline}","${e.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bodhika_exam_tracker_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast({ title: 'Export Successful', message: 'Exam tracker log exported as CSV.', type: 'info' });
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Summary Section */}
      <section className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant w-max">
          <span className="material-symbols-outlined text-[16px]">checklist</span>
          Application Pipeline
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">My Exam Tracker</h1>
        <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Monitor your upcoming examination schedules, registration deadlines, and active application statuses all in one central workspace.
        </p>

        {/* 4 Summary Metric Cards (From Page 16 screenshot & Bodhika UI reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
          {/* Registered */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group shadow-soft-card border border-surface-variant transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-4 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
              Registered
            </div>
            <div className="text-4xl font-extrabold text-on-surface relative z-10">{registeredCount}</div>
            <span className="material-symbols-outlined absolute -bottom-3 -right-3 text-[72px] text-outline opacity-10">
              app_registration
            </span>
          </div>

          {/* Completed */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group shadow-soft-card border border-surface-variant transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-4 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
              Completed
            </div>
            <div className="text-4xl font-extrabold text-on-surface relative z-10">{completedCount}</div>
            <span className="material-symbols-outlined absolute -bottom-3 -right-3 text-[72px] text-outline opacity-10">
              task_alt
            </span>
          </div>

          {/* Skipping */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group shadow-soft-card border border-surface-variant transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-4 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
              Skipping
            </div>
            <div className="text-4xl font-extrabold text-on-surface relative z-10">{skippingCount}</div>
            <span className="material-symbols-outlined absolute -bottom-3 -right-3 text-[72px] text-outline opacity-10">
              block
            </span>
          </div>

          {/* Remaining */}
          <div className="bg-surface-container-highest rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group shadow-md border border-outline-variant/40 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-2 text-on-surface text-xs font-bold uppercase tracking-wider mb-4 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
              Remaining
            </div>
            <div className="text-4xl font-extrabold text-on-surface relative z-10">{remainingCount}</div>
            <span className="material-symbols-outlined absolute -bottom-3 -right-3 text-[72px] text-primary opacity-10">
              hourglass_empty
            </span>
          </div>
        </div>
      </section>

      {/* Main Content: Exam Log Table Section */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-soft-card border border-outline-variant/30 overflow-hidden flex flex-col">
        {/* Table Filter & Actions Bar */}
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-surface-variant">
          <div>
            <h2 className="font-bold text-base text-on-surface">Detailed Examination Log</h2>
            <p className="text-xs text-outline mt-0.5">Toggle personal status to rebalance your preparation pipeline</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-10 bg-surface-container-low rounded-xl flex items-center px-3 gap-2 flex-1 sm:w-64">
              <span className="material-symbols-outlined text-outline text-[18px]">filter_list</span>
              <input
                type="text"
                placeholder="Filter exams..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-on-surface placeholder:text-outline"
              />
            </div>

            <button
              onClick={handleExport}
              className="h-10 px-4 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider border-b border-surface-variant">
                <th className="py-3.5 px-6">Exam / College</th>
                <th className="py-3.5 px-4">Track</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Reg. Deadline</th>
                <th className="py-3.5 px-6 text-right">My Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/60 text-xs">
              {filteredItems.map((item) => {
                const isCritical = item.priority === 'CRITICAL';
                return (
                  <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    {/* Exam Name */}
                    <td className="py-4 px-6 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-outline text-[20px]">school</span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-outline mt-0.5">{item.subTitle}</div>
                        </div>
                      </div>
                    </td>

                    {/* Track */}
                    <td className="py-4 px-4 align-middle">
                      <span className="px-2.5 py-1 rounded-md bg-secondary-container/60 text-on-secondary-container text-[11px] font-semibold">
                        {item.track}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-4 align-middle">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isCritical ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {item.priority}
                      </span>
                    </td>

                    {/* Reg Deadline */}
                    <td className="py-4 px-4 align-middle font-medium text-on-surface">
                      {item.regDeadline}
                    </td>

                    {/* My Status Dropdown (Live interactive update!) */}
                    <td className="py-4 px-6 align-middle text-right">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`h-9 px-3 rounded-xl text-xs font-semibold outline-none cursor-pointer transition-all border ${
                          item.status === 'Registered'
                            ? 'bg-secondary-container text-on-secondary-container border-secondary/30'
                            : item.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : item.status === 'Skipping'
                            ? 'bg-error-container text-on-error-container border-error/30'
                            : 'bg-surface-container-low text-on-surface-variant border-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="Registered">Registered</option>
                        <option value="Completed">Completed</option>
                        <option value="Skipping">Skipping</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
