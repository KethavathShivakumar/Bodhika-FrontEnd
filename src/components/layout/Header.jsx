import React, { useState } from 'react';

export default function Header({ 
  user, 
  sidebarOpen, 
  onToggleSidebar, 
  onSearchSelect, 
  onLogout, 
  onNavigate 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "Exam Assigned", message: "DP-900: Azure Data Fundamentals Practice Test 1 is ready.", time: "10m ago", read: false },
    { id: 2, title: "Registration Warning", message: "SAT 2026-27 registration closes in 33 days.", time: "2h ago", read: false },
    { id: 3, title: "Certificate Generated", message: "Certificate for International Cricket Legends is available.", time: "1d ago", read: true },
  ];

  const searchResults = [
    { type: 'Exam', title: 'DP-900: Azure Data Fundamentals', page: 'exams', sub: 'upcoming' },
    { type: 'Exam', title: 'SAT 2026-27', page: 'exampath-directory', sub: 'all' },
    { type: 'Exam', title: 'JEE Main 2027', page: 'exampath-directory', sub: 'all' },
    { type: 'Resource', title: 'TCS MCQ Questions PDF', page: 'study-resources', sub: 'interview-mcq' },
    { type: 'Course', title: 'System Architecture & Scalable Cloud', page: 'teacher-courses', sub: null },
    { type: 'Directory', title: 'Career Compass Diagnostic', page: 'career-compass', sub: null },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-surface-bright/90 backdrop-blur-xl z-40 flex items-center justify-between px-5 sm:px-8 border-b border-outline-variant/20 shadow-soft-card">
      {/* Left: ☰ Bodhika Logo & Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 rounded-xl hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer focus:outline-none"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-label="Toggle navigation sidebar"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-black shrink-0 border border-outline-variant/30">
            <img src="/bodhika-logo.png" alt="Bodhika Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg sm:text-xl tracking-tight text-on-surface leading-tight">Bodhika</span>
            <span className="text-[10px] font-medium text-outline uppercase tracking-wider hidden sm:block">Assessment Suite</span>
          </div>
        </div>
      </div>
      {/* Middle: Search Input Bar (Desktop / Tablet) */}
      <div className="relative hidden md:block flex-1 max-w-md mx-4">
        <div className="h-11 w-full bg-surface-container-low rounded-full flex items-center px-4 gap-2.5 transition-all focus-within:bg-surface-container-lowest focus-within:ring-1 focus-within:ring-primary shadow-sm">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search exams, resources, subjects, teachers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="bg-transparent border-none outline-none text-sm w-full text-on-surface placeholder:text-outline"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
              className="text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Instant Search Suggestions Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute top-14 left-0 w-full bg-surface-container-lowest rounded-2xl shadow-float border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-outline">Quick Navigation</div>
            {searchResults.length > 0 ? (
              searchResults.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onNavigate(item.page, item.sub);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-surface-container-low transition-colors text-left"
                >
                  <span className="text-sm font-medium text-on-surface">{item.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                    {item.type}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-on-surface-variant text-center">No matching results found</div>
            )}
          </div>
        )}
      </div>

      {/* Right User & Actions Bar */}
      <div className="flex items-center gap-5">
        {/* Notifications Icon with popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-surface-container-lowest rounded-2xl shadow-float border border-outline-variant/30 py-3 z-50">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-surface-variant">
                <span className="font-semibold text-sm text-on-surface">Notifications</span>
                <span className="text-xs text-secondary font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-surface-variant/40 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 hover:bg-surface-container-low transition-colors ${!n.read ? 'bg-secondary-container/10' : ''}`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-on-surface">{n.title}</span>
                      <span className="text-[10px] text-outline">{n.time}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Identity Chip */}
        <div 
          onClick={() => onNavigate('settings', 'profile')}
          className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          <div className="text-right hidden sm:block">
            <div className="font-medium text-sm text-on-surface leading-tight">{user.name}</div>
            <div className="text-[11px] text-outline tracking-tight">Student ID: {user.id}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center border border-outline-variant/30 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high text-on-surface hover:bg-error-container hover:text-on-error-container transition-colors text-xs font-medium"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
