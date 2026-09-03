import React, { useState, useMemo } from 'react';

export default function ExamHistoryPage({ attempts, onBackToExams, onViewAttempt, onRetakeExam, initialSubject = 'All' }) {
  const [timeRange, setTimeRange] = useState('5'); // '5' | '10' | 'all'
  const [subjectFilter, setSubjectFilter] = useState(initialSubject);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Derive unique subjects
  const subjects = ['All', ...new Set(attempts.map(a => a.subject))];

  // Filter attempts by subject
  const subjectFilteredAttempts = useMemo(() => {
    return attempts.filter(att => {
      if (subjectFilter !== 'All' && att.subject !== subjectFilter) return false;
      return true;
    });
  }, [attempts, subjectFilter]);

  // Apply time range slice (attempts are newest first, so reverse for chronological chart display)
  const chartAttempts = useMemo(() => {
    const list = [...subjectFilteredAttempts];
    const sliced = timeRange === '5' ? list.slice(0, 5) : timeRange === '10' ? list.slice(0, 10) : list;
    return sliced.reverse(); // oldest to newest for chronological left-to-right trend
  }, [subjectFilteredAttempts, timeRange]);

  // Summary Metrics calculations
  const totalExams = subjectFilteredAttempts.length;
  const passedCount = subjectFilteredAttempts.filter(a => a.result === 'Pass').length;
  const passRate = totalExams > 0 ? Math.round((passedCount / totalExams) * 100) : 0;
  
  const scoreValues = subjectFilteredAttempts.map(a => a.scorePercent);
  const avgScore = scoreValues.length > 0 ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : 0;
  const highestScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;
  const lowestScore = scoreValues.length > 0 ? Math.min(...scoreValues) : 0;

  // SVG Chart Geometry calculations
  const svgWidth = 800;
  const svgHeight = 240;
  const paddingX = 50;
  const paddingY = 35;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const points = useMemo(() => {
    if (chartAttempts.length === 0) return [];
    if (chartAttempts.length === 1) {
      return [{
        x: paddingX + chartWidth / 2,
        y: svgHeight - paddingY - (chartAttempts[0].scorePercent / 100) * chartHeight,
        attempt: chartAttempts[0]
      }];
    }
    const step = chartWidth / (chartAttempts.length - 1);
    return chartAttempts.map((att, idx) => {
      const x = paddingX + idx * step;
      const y = svgHeight - paddingY - (att.scorePercent / 100) * chartHeight;
      return { x, y, attempt: att };
    });
  }, [chartAttempts, chartWidth, chartHeight, svgHeight, paddingX, paddingY]);

  // Generate smooth cubic bezier SVG path
  const linePath = useMemo(() => {
    if (points.length < 2) return '';
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX},${current.y} ${controlX},${next.y} ${next.x},${next.y}`;
    }
    return path;
  }, [points]);

  // Generate smooth area path under line
  const areaPath = useMemo(() => {
    if (points.length < 2) return '';
    const bottomY = svgHeight - paddingY;
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [linePath, points, svgHeight, paddingY]);

  // Pass threshold guideline Y coordinate (60%)
  const passThresholdY = svgHeight - paddingY - 0.6 * chartHeight;

  const getExamIcon = (att) => {
    const text = (att.exam + ' ' + att.subject).toLowerCase();
    if (text.includes('azure') || text.includes('cloud') || text.includes('dp-900')) return 'cloud';
    if (text.includes('verbal') || text.includes('aptitude')) return 'psychology';
    if (text.includes('python') || text.includes('algorithm') || text.includes('code')) return 'terminal';
    if (text.includes('biology') || text.includes('neet') || text.includes('medical')) return 'biotech';
    if (text.includes('cricket') || text.includes('sports') || text.includes('gk')) return 'sports_cricket';
    return 'assignment_turned_in';
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-1.5">
            <span className="material-symbols-outlined text-[15px]">monitoring</span>
            Analytics & Score Trends
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">Recent Results</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Your performance across your recent examinations with interactive trend telemetry.
          </p>
        </div>

        <button
          onClick={onBackToExams}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Exams</span>
        </button>
      </div>

      {/* 4 Compact Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft-card flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Average Score</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">analytics</span>
          </div>
          <span className="text-2xl font-extrabold text-on-surface mt-1">{avgScore}%</span>
          <span className="text-[11px] text-outline mt-0.5">Across {totalExams} examinations</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft-card flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Highest Score</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
          </div>
          <span className="text-2xl font-extrabold text-secondary mt-1">{highestScore}%</span>
          <span className="text-[11px] text-secondary font-medium mt-0.5">Peak performance</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft-card flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Exams Completed</span>
            <span className="material-symbols-outlined text-on-surface text-[18px]">verified</span>
          </div>
          <span className="text-2xl font-extrabold text-on-surface mt-1">{totalExams}</span>
          <span className="text-[11px] text-outline mt-0.5">{passedCount} Passed · {totalExams - passedCount} Failed</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft-card flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Pass Rate</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
          </div>
          <span className="text-2xl font-extrabold text-secondary mt-1">{passRate}%</span>
          <span className="text-[11px] text-outline mt-0.5">Threshold: 60%</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft-card flex flex-col justify-center col-span-2 sm:col-span-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">Lowest Score</span>
            <span className="material-symbols-outlined text-error text-[18px]">flag</span>
          </div>
          <span className="text-2xl font-extrabold text-error mt-1">{lowestScore}%</span>
          <span className="text-[11px] text-outline mt-0.5">Area for remediation</span>
        </div>
      </div>

      {/* Graphical Representation: Modern Performance Trend Dashboard Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 space-y-5">
        {/* Chart Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-surface-variant/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
              <h2 className="font-bold text-base text-on-surface">Performance Trend</h2>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Percentage score trajectory across sequential examinations. Hover any node for attempt telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-surface-container-low h-8 px-3 rounded-xl text-xs font-medium text-on-surface outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>
              ))}
            </select>

            {/* Time Range Selector */}
            <div className="flex bg-surface-container-low p-1 rounded-xl border border-surface-variant text-xs font-semibold">
              <button
                onClick={() => setTimeRange('5')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === '5'
                    ? 'bg-surface-container-lowest shadow-sm text-on-surface'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Last 5 Exams
              </button>
              <button
                onClick={() => setTimeRange('10')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === '10'
                    ? 'bg-surface-container-lowest shadow-sm text-on-surface'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                Last 10 Exams
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === 'all'
                    ? 'bg-surface-container-lowest shadow-sm text-on-surface'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                All Results
              </button>
            </div>
          </div>
        </div>

        {/* Interactive SVG Line Graph Container */}
        <div className="relative w-full overflow-hidden">
          {points.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-56 sm:h-64 select-none min-w-[600px]"
              >
                <defs>
                  {/* Soft mint gradient beneath the curve */}
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#416656" stopOpacity="0.28" />
                    <stop offset="85%" stopColor="#416656" stopOpacity="0.02" />
                    <stop offset="100%" stopColor="#416656" stopOpacity="0" />
                  </linearGradient>

                  {/* Horizontal grid patterns */}
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Horizontal Grid lines (0%, 25%, 50%, 75%, 100%) */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = svgHeight - paddingY - (val / 100) * chartHeight;
                  return (
                    <g key={val}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#e2e3e5"
                        strokeDasharray={val === 0 ? "none" : "3,3"}
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 10}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[10px] font-mono fill-outline"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* 60% Passing Benchmark Guideline */}
                <line
                  x1={paddingX}
                  y1={passThresholdY}
                  x2={svgWidth - paddingX}
                  y2={passThresholdY}
                  stroke="#eab308"
                  strokeWidth="1.5"
                  strokeDasharray="6,4"
                />
                <text
                  x={svgWidth - paddingX}
                  y={passThresholdY - 6}
                  textAnchor="end"
                  className="text-[10px] font-bold fill-amber-700"
                >
                  60% Pass Benchmark
                </text>

                {/* Area Gradient Fill */}
                {areaPath && (
                  <path d={areaPath} fill="url(#trendGradient)" />
                )}

                {/* Smooth Trend Curve */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#416656"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points / Circles */}
                {points.map((pt, idx) => {
                  const isHovered = hoveredPoint?.attempt.id === pt.attempt.id;
                  const isPass = pt.attempt.result === 'Pass';
                  return (
                    <g key={idx} className="cursor-pointer">
                      {/* Active hover ring */}
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="11"
                          fill="#416656"
                          fillOpacity="0.2"
                        />
                      )}

                      {/* Main node point */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? "6" : "4.5"}
                        fill={isPass ? "#416656" : "#ba1a1a"}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        onClick={() => onViewAttempt(pt.attempt)}
                        className="transition-all duration-150"
                      />

                      {/* Percentage Tag above point */}
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        className={`text-[11px] font-bold ${
                          isPass ? 'fill-secondary' : 'fill-error'
                        }`}
                      >
                        {pt.attempt.scorePercent}%
                      </text>

                      {/* Date label beneath X-axis */}
                      <text
                        x={pt.x}
                        y={svgHeight - paddingY + 18}
                        textAnchor="middle"
                        className="text-[10px] font-medium fill-outline"
                      >
                        {pt.attempt.date.slice(0, 6)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div className="py-12 text-center text-outline text-xs">
              No examination records found for the selected subject.
            </div>
          )}

          {/* Interactive Hover Tooltip Float */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none bg-surface-container-lowest rounded-xl p-3 shadow-float border border-outline-variant/40 text-xs z-30 transition-all duration-150 space-y-1 min-w-[200px]"
              style={{
                left: `${Math.min(Math.max(hoveredPoint.x - 100, 10), svgWidth - 220)}px`,
                top: `${Math.max(hoveredPoint.y - 85, 10)}px`
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-on-surface truncate max-w-[140px]">
                  {hoveredPoint.attempt.exam}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    hoveredPoint.attempt.result === 'Pass'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  {hoveredPoint.attempt.result}
                </span>
              </div>
              <div className="text-[11px] text-outline flex items-center justify-between">
                <span>Date: {hoveredPoint.attempt.date}</span>
                <span className="font-bold text-on-surface">{hoveredPoint.attempt.score}</span>
              </div>
              <div className="text-secondary font-bold text-xs">
                Score: {hoveredPoint.attempt.scorePercent}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section: List of Most Recent Exam Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-on-surface">history</span>
            <h3 className="font-bold text-base text-on-surface">Detailed Examination Logs</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
              {subjectFilteredAttempts.length} Records
            </span>
          </div>
          <span className="text-xs text-outline hidden sm:block">Sorted chronologically by newest completion</span>
        </div>

        {/* Compact Result Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {subjectFilteredAttempts.map((att) => {
            const isPass = att.result === 'Pass';
            return (
              <div
                key={att.id}
                className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-soft-card hover:shadow-hover-card hover:border-outline-variant/60 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Top line: Icon + Subject + Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isPass
                            ? 'bg-secondary-container/50 text-on-secondary-container'
                            : 'bg-error-container/40 text-on-error-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{getExamIcon(att)}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider block truncate">
                          {att.grade}
                        </span>
                        <span className="text-xs font-semibold text-on-surface-variant truncate block">
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
                        {isPass ? 'check' : 'close'}
                      </span>
                      <span>{isPass ? 'Passed' : 'Failed'}</span>
                    </span>
                  </div>

                  {/* Exam Name */}
                  <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {att.exam}
                  </h4>

                  {/* Score & Duration Row */}
                  <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-surface-container-low/70 text-center border border-surface-variant/40">
                    <div>
                      <span className="text-[9px] font-semibold text-outline uppercase block">Marks</span>
                      <span className="text-xs font-bold text-on-surface">{att.score}</span>
                    </div>
                    <div className="border-x border-surface-variant/60">
                      <span className="text-[9px] font-semibold text-outline uppercase block">Percentage</span>
                      <span className={`text-xs font-bold ${isPass ? 'text-secondary' : 'text-error'}`}>
                        {att.scorePercent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-semibold text-outline uppercase block">Duration</span>
                      <span className="text-xs font-bold text-on-surface">{att.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-outline px-0.5">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">event</span>
                      <span>{att.completionDate || att.date}</span>
                    </span>
                    <span className="font-medium text-on-surface-variant">
                      {att.attemptsUsed || `Attempt ${att.attempts}`}
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 mt-3 border-t border-surface-variant/50 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-outline truncate">
                    {att.correct} correct · {att.wrong} wrong · {att.skipped} skipped
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRetakeExam(att)}
                      className="p-1.5 rounded-lg border border-surface-variant text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                      title="Retake this exam"
                    >
                      <span className="material-symbols-outlined text-[15px] block">replay</span>
                    </button>
                    <button
                      onClick={() => onViewAttempt(att)}
                      className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-95 transition-all text-xs font-semibold flex items-center gap-1 shadow-sm"
                    >
                      <span>View Results</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
