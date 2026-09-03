import React from 'react';

export default function MyPerformancePage({ onNavigateToHistory }) {
  const performanceSubjects = [
    {
      subject: "DP-900: Azure Data Fundamentals",
      attemptsCount: 2,
      mostRecent: 0,
      best: 70,
      average: 35,
      trendPoints: [
        { date: "04 Aug", score: 70, passed: true },
        { date: "27 Aug", score: 0, passed: false }
      ],
      color: "#ba1a1a", // drop
      summary: "Significant decrease observed in attempt 2 due to incomplete submission. Focus on Azure Cosmos DB and Data Factory pipelines to recover."
    },
    {
      subject: "General Knowledge",
      attemptsCount: 3,
      mostRecent: 0,
      best: 90,
      average: 30,
      trendPoints: [
        { date: "22 Aug", score: 90, passed: true },
        { date: "26 Aug", score: 0, passed: false },
        { date: "26 Aug", score: 0, passed: false }
      ],
      color: "#416656",
      summary: "Exceptional peak at 90% in Cricket Legends. Two subsequent attempts timed out early without answer selection."
    },
    {
      subject: "Verbal Ability",
      attemptsCount: 2,
      mostRecent: 78,
      best: 78,
      average: 70.5,
      trendPoints: [
        { date: "02 Aug", score: 63, passed: true },
        { date: "04 Aug", score: 78, passed: true }
      ],
      color: "#416656", // growth
      summary: "Consistent upward trajectory (+15%). Reading comprehension and grammar metrics show mastery above standard cutoff."
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-2">
          <span className="material-symbols-outlined text-[16px]">analytics</span>
          Cognitive Trend Analysis
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">My Performance</h1>
        <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
          Score trend across your most recent completed exams in each subject (up to the last 10 per subject).
        </p>
      </div>

      {/* Subject Performance Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {performanceSubjects.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 flex flex-col justify-between hover:shadow-hover-card transition-shadow duration-300"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-on-surface leading-tight">
                      {item.subject}
                    </h3>
                    <span className="text-[11px] text-outline mt-0.5 block">
                      {item.attemptsCount} completed attempts shown
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigateToHistory(item.subject)}
                    className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                    title="View history for this subject"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </button>
                </div>

                {/* Stat Metrics Row */}
                <div className="grid grid-cols-3 gap-2 my-5 text-center">
                  <div className="p-2.5 rounded-xl bg-surface-container-low">
                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider block">Most Recent</span>
                    <span className={`text-xl font-bold mt-0.5 block ${item.mostRecent >= 60 ? 'text-secondary' : 'text-error'}`}>
                      {item.mostRecent}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low">
                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider block">Best</span>
                    <span className="text-xl font-bold text-on-surface mt-0.5 block">
                      {item.best}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low">
                    <span className="text-[10px] font-semibold text-outline uppercase tracking-wider block">Average</span>
                    <span className="text-xl font-bold text-on-surface-variant mt-0.5 block">
                      {item.average}%
                    </span>
                  </div>
                </div>

                {/* Trend Graph Area */}
                <div className="bg-surface-container-low/50 rounded-xl p-4 border border-surface-variant/60 relative">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-outline uppercase tracking-wider mb-2">
                    <span>Score Progress</span>
                    <span>100% Target</span>
                  </div>

                  {/* SVG Line Graph */}
                  <div className="relative h-44 w-full">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-outline opacity-40">
                      <div className="border-b border-surface-variant w-full">100%</div>
                      <div className="border-b border-surface-variant w-full">80%</div>
                      <div className="border-b border-surface-variant w-full">60%</div>
                      <div className="border-b border-surface-variant w-full">40%</div>
                      <div className="border-b border-surface-variant w-full">20%</div>
                      <div className="border-b border-surface-variant w-full">0%</div>
                    </div>

                    {/* SVG Line */}
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150">
                      {/* Calculate coordinates */}
                      {(() => {
                        const count = item.trendPoints.length;
                        const points = item.trendPoints.map((pt, i) => {
                          const x = count === 1 ? 150 : (i / (count - 1)) * 260 + 20;
                          const y = 140 - (pt.score / 100) * 125;
                          return { x, y, pt };
                        });

                        const pathD = points.reduce((acc, p, idx) => {
                          return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                        }, "");

                        return (
                          <>
                            {/* Area fill */}
                            <path
                              d={`${pathD} L ${points[points.length - 1].x} 145 L ${points[0].x} 145 Z`}
                              fill={item.color}
                              fillOpacity="0.08"
                            />
                            {/* Line */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke={item.color}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* Data points */}
                            {points.map((p, idx) => (
                              <g key={idx} className="cursor-pointer">
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r="5"
                                  fill="#ffffff"
                                  stroke={item.color}
                                  strokeWidth="3"
                                />
                                <text
                                  x={p.x}
                                  y={p.y - 10}
                                  fontSize="10"
                                  fontWeight="bold"
                                  fill="#1a1c1d"
                                  textAnchor="middle"
                                >
                                  {p.pt.score}%
                                </text>
                              </g>
                            ))}
                          </>
                        );
                      })()}
                    </svg>

                    {/* Dates beneath axis */}
                    <div className="flex justify-between text-[10px] text-outline font-medium pt-1 px-3">
                      {item.trendPoints.map((pt, i) => (
                        <span key={i}>{pt.date}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnostic Recommendation */}
              <div className="mt-4 pt-3 border-t border-surface-variant text-xs text-on-surface-variant leading-relaxed">
                <span className="font-semibold text-on-surface">Insight: </span>
                {item.summary}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
