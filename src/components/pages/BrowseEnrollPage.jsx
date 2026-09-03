import React, { useState } from 'react';

export default function BrowseEnrollPage({ catalog, onEnroll, onBackToMyExams }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredCatalog = catalog.filter(exam => {
    if (searchQuery && !exam.name.toLowerCase().includes(searchQuery.toLowerCase()) && !exam.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedSubject !== 'All' && exam.subject !== selectedSubject) return false;
    if (selectedType !== 'All' && exam.type !== selectedType) return false;
    return true;
  });

  // Group by subject / category
  const categories = [...new Set(filteredCatalog.map(item => item.subject))];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-2">
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            Academic Marketplace
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Browse & Enroll in Exams</h1>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
            Each exam has its own price. Enroll in one to access it — payment is processed securely via Razorpay.
          </p>
        </div>
        <button
          onClick={onBackToMyExams}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to My Exams</span>
        </button>
      </div>

      {/* Filter and Search Bar (From Page 3 screenshot) */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="relative">
            <label className="text-[11px] font-semibold text-outline uppercase tracking-wider block mb-1.5">
              Search Exams or Subjects
            </label>
            <div className="h-11 bg-surface-container-low rounded-xl px-3.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search exams or subjects..."
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

          {/* Filter by Subject */}
          <div>
            <label className="text-[11px] font-semibold text-outline uppercase tracking-wider block mb-1.5">
              By Subject
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full h-11 bg-surface-container-low rounded-xl px-3.5 text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
              >
                <option value="All">All Subjects</option>
                <option value="NEET">NEET</option>
                <option value="JEE Main">JEE Main</option>
                <option value="UPSC">UPSC</option>
                <option value="GRE">GRE</option>
                <option value="GMAT">GMAT</option>
              </select>
            </div>
          </div>

          {/* Filter by Type */}
          <div>
            <label className="text-[11px] font-semibold text-outline uppercase tracking-wider block mb-1.5">
              By Type (IN NEET / JEE / UPSC · US GRE / GMAT)
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-11 bg-surface-container-low rounded-xl px-3.5 text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
              >
                <option value="All">All Types</option>
                <option value="NEET">NEET Medical Mocks</option>
                <option value="JEE">JEE Engineering</option>
                <option value="UPSC">UPSC Civil Services</option>
                <option value="GRE / GMAT">GRE / GMAT International</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Group Sections */}
      {categories.length > 0 ? (
        categories.map((category) => {
          const items = filteredCatalog.filter(e => e.subject === category);
          return (
            <div key={category} className="space-y-4">
              {/* Category Header Badge */}
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-lg bg-secondary text-on-secondary font-bold text-xs uppercase tracking-wider shadow-sm">
                  {category}
                </span>
                <div className="h-px bg-surface-variant flex-1"></div>
                <span className="text-xs text-outline font-medium">{items.length} options available</span>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-surface-container-lowest rounded-2xl p-5 shadow-soft-card border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 hover:shadow-hover-card transition-all duration-300 group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
                          {exam.type}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          <span>{exam.rating}</span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">
                        {exam.name}
                      </h3>

                      <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">
                        {exam.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {exam.tags?.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 bg-surface-container-low rounded-md text-outline">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-surface-variant/60 flex flex-col gap-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-outline">Fee:</span>
                        <div className="text-xl font-bold text-on-surface">
                          {exam.currency}{exam.price.toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => onEnroll(exam)}
                        className="w-full py-2.5 rounded-xl bg-error hover:bg-error/90 text-on-error text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">lock_open</span>
                        <span>Enroll — {exam.currency}{exam.price.toFixed(2)}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center text-on-surface-variant border border-outline-variant/30">
          <span className="material-symbols-outlined text-[40px] text-outline mb-2">search_off</span>
          <h3 className="font-semibold text-base text-on-surface">No examinations match your criteria</h3>
          <p className="text-xs text-outline mt-1">Try relaxing your search terms or reset the filters.</p>
        </div>
      )}
    </div>
  );
}
