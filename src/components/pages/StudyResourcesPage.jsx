import React, { useState, useEffect } from 'react';

export default function StudyResourcesPage({ resources, onOpenResource, initialCategory = 'all', onToast }) {
  const [activeTab, setActiveTab] = useState(initialCategory); // 'all' | 'books' | 'videos' | 'interview-mcq' | 'interview-tech'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Sync with initialCategory if passed or updated from parent/sidebar
  useEffect(() => {
    if (initialCategory) {
      setActiveTab(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    { id: 'all', label: 'All References', icon: 'auto_stories' },
    { id: 'books', label: 'Books', icon: 'menu_book' },
    { id: 'videos', label: 'Videos', icon: 'smart_display' },
    { id: 'interview-mcq', label: 'Interview Q - MCQ', icon: 'quiz' },
    { id: 'interview-tech', label: 'Interview Q - Technical', icon: 'terminal' }
  ];

  const filteredResources = resources.filter(res => {
    // Search query filter
    if (searchQuery && !res.title.toLowerCase().includes(searchQuery.toLowerCase()) && !res.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Subject filter
    if (selectedSubject !== 'All' && res.category !== selectedSubject) {
      return false;
    }
    // Tab category filter
    if (activeTab === 'books' && res.type !== 'Books') return false;
    if (activeTab === 'videos' && res.type !== 'Videos') return false;
    if (activeTab === 'interview-mcq' && res.type !== 'Interview Q - MCQ') return false;
    if (activeTab === 'interview-tech' && res.type !== 'Interview Q - Technical') return false;

    return true;
  });

  const handleClear = () => {
    setSearchQuery('');
    setSelectedSubject('All');
  };

  const getCompanyColor = (company) => {
    switch (company?.toLowerCase()) {
      case 'tcs': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'infosys': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'accenture': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'amazon': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'microsoft': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-surface-container-high text-on-surface-variant border-surface-variant';
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-1.5">
          <span className="material-symbols-outlined text-[15px]">library_books</span>
          Academic Archive & Knowledge Base
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">Study Resources</h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 max-w-2xl leading-relaxed">
          Access complete curriculum reference books, recorded faculty lectures, and recruitment question banks.
        </p>
      </div>

      {/* 5 Main Section Tabs (All References, Books, Videos, Interview Q - MCQ, Interview Q - Technical) */}
      <div className="bg-surface-container-lowest rounded-2xl p-2 sm:p-2.5 shadow-soft-card border border-outline-variant/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search and Subject Toolbar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-soft-card border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex-1 bg-surface-container-low rounded-xl px-3.5 h-10 flex items-center gap-2 border border-transparent focus-within:border-primary focus-within:bg-surface-container-lowest transition-all">
          <span className="material-symbols-outlined text-outline text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search resources by title, keywords, authors, company..."
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

        {/* Subject Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-10 bg-surface-container-low rounded-xl px-3 text-xs text-on-surface outline-none focus:ring-1 focus:ring-primary cursor-pointer border border-transparent"
          >
            <option value="All">All Disciplines</option>
            <option value="Computer Science">Computer Science & IT</option>
            <option value="Interview Questions">Interview Question Sets</option>
            <option value="Medical">Medical & NEET</option>
            <option value="Aptitude">Aptitude & Speed Math</option>
          </select>

          <button
            type="button"
            onClick={handleClear}
            className="h-10 px-4 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors text-xs font-semibold flex items-center gap-1 shrink-0"
            title="Clear filters"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Resources Count & Feedback */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="font-bold text-on-surface">
          Showing {filteredResources.length} items in{' '}
          <span className="text-secondary">{categories.find(c => c.id === activeTab)?.label}</span>
        </span>
        <span className="text-outline hidden sm:block">Click any item to view PDF, read e-book, or stream lecture</span>
      </div>

      {/* Resources Compact Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredResources.map((res) => {
            const isVideo = res.type === 'Videos';
            const isBook = res.type === 'Books';

            return (
              <div
                key={res.id}
                className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-soft-card hover:shadow-hover-card hover:border-outline-variant/60 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Visual Header / Media Preview */}
                  {isVideo && res.thumbnail ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3 bg-surface-container">
                      <img src={res.thumbnail} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-md">
                          <span className="material-symbols-outlined text-[22px] ml-0.5">play_arrow</span>
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-mono font-bold">
                        {res.duration}
                      </span>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold">
                        {res.videoQuality || '1080p'}
                      </span>
                    </div>
                  ) : null}

                  {/* Top Metadata Row: Company/Author Tag + Format Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCompanyColor(res.company)}`}>
                      {res.company || res.author}
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        {isVideo ? 'smart_display' : isBook ? 'menu_book' : 'description'}
                      </span>
                      <span>{res.format || res.type}</span>
                    </span>
                  </div>

                  {/* Resource Title */}
                  <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
                    {res.title}
                  </h3>

                  {/* Description Preview */}
                  <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>

                  {/* Mini Stats Box */}
                  <div className="my-3 p-2.5 rounded-xl bg-surface-container-low/70 border border-surface-variant/40 flex items-center justify-between text-[11px]">
                    <span className="text-outline">
                      {isBook ? `${res.pages} Pages • ${res.edition || 'Revised'}` :
                       isVideo ? `Duration: ${res.duration}` :
                       `${res.questionsCount} Questions • ${res.pages} Pages`}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      <span>{res.rating || '4.9'}</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-surface-variant/50 flex items-center gap-2">
                  {isVideo ? (
                    <button
                      onClick={() => setActiveVideoModal(res)}
                      className="w-full py-2 px-3 rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition-all font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">play_circle</span>
                      <span>Watch Lecture</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenResource(res)}
                      className="w-full py-2 px-3 rounded-xl bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] transition-all font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isBook ? 'menu_book' : 'open_in_new'}
                      </span>
                      <span>{isBook ? 'Read E-Book' : 'Open Question Bank'}</span>
                    </button>
                  )}
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
          <h3 className="font-bold text-base text-on-surface">No resources found in this category</h3>
          <p className="text-xs text-outline mt-1 max-w-sm">
            Try adjusting your search terms or switch to All References to browse all materials.
          </p>
          <button
            onClick={() => { setActiveTab('all'); handleClear(); }}
            className="mt-4 px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container-highest transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Interactive Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-surface-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">smart_display</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-on-surface truncate max-w-[280px] sm:max-w-md">
                    {activeVideoModal.title}
                  </h3>
                  <p className="text-xs text-outline">
                    Instructor: {activeVideoModal.author} • {activeVideoModal.duration} • {activeVideoModal.videoQuality}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Video Viewport Simulation */}
            <div className="relative w-full aspect-video bg-black flex flex-col justify-between p-4 group">
              <img
                src={activeVideoModal.thumbnail}
                alt={activeVideoModal.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="relative z-10 flex justify-between items-center text-white text-xs">
                <span className="px-2 py-0.5 rounded bg-black/60 font-semibold">{activeVideoModal.category}</span>
                <span className="px-2 py-0.5 rounded bg-black/60 font-mono">1080p HD</span>
              </div>

              <div className="relative z-10 flex items-center justify-center">
                <button
                  onClick={() => onToast({ title: 'Stream Active', message: 'Video stream playing in HD buffer.', type: 'info' })}
                  className="w-16 h-16 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[36px] ml-1">play_arrow</span>
                </button>
              </div>

              {/* Player Bottom Bar */}
              <div className="relative z-10 bg-black/70 rounded-xl p-2.5 backdrop-blur-sm space-y-1.5 text-white">
                <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div className="w-1/3 bg-secondary h-full rounded-full"></div>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] cursor-pointer">play_arrow</span>
                    <span className="material-symbols-outlined text-[18px] cursor-pointer">volume_up</span>
                    <span className="font-mono">14:20 / {activeVideoModal.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="cursor-pointer hover:text-secondary">1.0x</span>
                    <span className="material-symbols-outlined text-[18px] cursor-pointer">fullscreen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content & Chapters */}
            <div className="p-5 overflow-y-auto space-y-3 bg-surface-container-lowest">
              <h4 className="font-bold text-xs uppercase tracking-wider text-outline">Course Syllabus Chapters</h4>
              <div className="space-y-2">
                {activeVideoModal.contentPreview?.map((mod, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-container-low border border-surface-variant text-xs space-y-1">
                    <span className="font-bold text-on-surface block">{mod.q}</span>
                    <span className="text-on-surface-variant block">{mod.a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface-container-low border-t border-surface-variant flex items-center justify-between">
              <span className="text-xs text-outline">Bodhika Masterclass Series</span>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
