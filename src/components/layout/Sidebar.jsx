import React, { useState } from 'react';

export default function Sidebar({ isOpen = true, activePage, setActivePage, subPage, setSubPage }) {
  const [academicExpanded, setAcademicExpanded] = useState({
    myExams: true,
    studyResources: true,
    examPath: true,
  });

  const toggleSubmenu = (menu) => {
    setAcademicExpanded(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navItemClass = (pageKey, subKey = null) => {
    const isCurrent = subKey 
      ? activePage === pageKey && subPage === subKey
      : activePage === pageKey && (!subKey || subPage === null);

    if (isCurrent) {
      return "flex items-center px-4 py-2.5 rounded-xl transition-all bg-secondary-container text-on-secondary-container font-medium shadow-sm";
    }
    return "flex items-center px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all group";
  };

  const subNavItemClass = (pageKey, subKey) => {
    const isCurrent = activePage === pageKey && subPage === subKey;
    if (isCurrent) {
      return "flex items-center pl-8 pr-4 py-2 rounded-lg text-sm bg-secondary-container/60 text-on-secondary-container font-medium";
    }
    return "flex items-center pl-8 pr-4 py-2 rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all";
  };

  return (
    <aside 
      className={`fixed left-0 top-20 bottom-0 w-[280px] bg-surface-container-lowest z-30 flex flex-col shadow-sidebar border-r border-outline-variant/20 overflow-y-auto transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Navigation Sections */}
      <nav className="flex-1 px-4 py-3 space-y-1">
        {/* Examination Group */}
        <div className="pt-2 pb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-outline">
          Examination
        </div>

        <button
          onClick={() => { setActivePage('dashboard'); setSubPage(null); }}
          className={`w-full text-left ${navItemClass('dashboard')}`}
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">dashboard</span>
          <span className="text-sm">Dashboard</span>
        </button>

        <button
          onClick={() => { setActivePage('exams'); setSubPage('upcoming'); }}
          className={`w-full text-left ${navItemClass('exams', 'upcoming')}`}
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">assignment</span>
          <span className="text-sm">Upcoming Exams</span>
        </button>

        <button
          onClick={() => { setActivePage('completed-exams'); setSubPage(null); }}
          className={`w-full text-left ${navItemClass('completed-exams')}`}
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">task_alt</span>
          <span className="text-sm">Completed Exams</span>
        </button>

        <button
          onClick={() => { setActivePage('browse-enroll'); setSubPage(null); }}
          className={`w-full text-left ${navItemClass('browse-enroll')}`}
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">shopping_cart</span>
          <span className="text-sm">Browse & Enroll</span>
        </button>

        <button
          onClick={() => { setActivePage('history'); setSubPage('chart'); }}
          className={`w-full text-left ${navItemClass('history')}`}
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">history_edu</span>
          <span className="text-sm">Recent Results</span>
        </button>

        <button
          onClick={() => { setActivePage('performance'); setSubPage(null); }}
          className={`w-full text-left ${navItemClass('performance')}`}
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">monitoring</span>
          <span className="text-sm">My Performance</span>
        </button>

        <button
          onClick={() => { setActivePage('certificates'); setSubPage(null); }}
          className={`w-full text-left ${navItemClass('certificates')}`}
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">workspace_premium</span>
          <span className="text-sm">Certificates</span>
        </button>

        {/* Academic Group */}
        <div className="pt-4 pb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-outline">
          Academic
        </div>

        {/* My Exams dropdown */}
        <div>
          <button
            onClick={() => toggleSubmenu('myExams')}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-left"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-3 text-[20px]">clinical_notes</span>
              <span className="text-sm">My Exams</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-outline transition-transform duration-200" style={{ transform: academicExpanded.myExams ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>
          {academicExpanded.myExams && (
            <div className="space-y-1 mt-1 pl-2 border-l border-surface-variant ml-5">
              <button
                onClick={() => { setActivePage('exams'); setSubPage('upcoming'); }}
                className={`w-full text-left ${subNavItemClass('exams', 'upcoming')}`}
              >
                Available
              </button>
              <button
                onClick={() => { setActivePage('scheduled-exams'); setSubPage(null); }}
                className={`w-full text-left ${subNavItemClass('scheduled-exams', null)}`}
              >
                Scheduled
              </button>
              <button
                onClick={() => { setActivePage('take-exam'); setSubPage(null); }}
                className={`w-full text-left ${subNavItemClass('take-exam', null)}`}
              >
                Take Exam
              </button>
              <button
                onClick={() => { setActivePage('teacher-courses'); setSubPage(null); }}
                className={`w-full text-left ${subNavItemClass('teacher-courses', null)}`}
              >
                Teacher Courses
              </button>
            </div>
          )}
        </div>

        {/* Study Resources dropdown */}
        <div>
          <button
            onClick={() => toggleSubmenu('studyResources')}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-left"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-3 text-[20px]">library_books</span>
              <span className="text-sm">Study Resources</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-outline transition-transform duration-200" style={{ transform: academicExpanded.studyResources ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>
          {academicExpanded.studyResources && (
            <div className="space-y-1 mt-1 pl-2 border-l border-surface-variant ml-5">
              <button
                onClick={() => { setActivePage('study-resources'); setSubPage('all'); }}
                className={`w-full text-left ${subNavItemClass('study-resources', 'all')}`}
              >
                All References
              </button>
              <button
                onClick={() => { setActivePage('study-resources'); setSubPage('books'); }}
                className={`w-full text-left ${subNavItemClass('study-resources', 'books')}`}
              >
                Books
              </button>
              <button
                onClick={() => { setActivePage('study-resources'); setSubPage('videos'); }}
                className={`w-full text-left ${subNavItemClass('study-resources', 'videos')}`}
              >
                Videos
              </button>
              <button
                onClick={() => { setActivePage('study-resources'); setSubPage('interview-mcq'); }}
                className={`w-full text-left ${subNavItemClass('study-resources', 'interview-mcq')}`}
              >
                Interview Q - MCQ
              </button>
              <button
                onClick={() => { setActivePage('study-resources'); setSubPage('interview-tech'); }}
                className={`w-full text-left ${subNavItemClass('study-resources', 'interview-tech')}`}
              >
                Interview Q - Technical
              </button>
            </div>
          )}
        </div>

        {/* ExamPath Directory dropdown */}
        <div>
          <button
            onClick={() => toggleSubmenu('examPath')}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-left"
          >
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-3 text-[20px]">explore</span>
              <span className="text-sm">ExamPath Directory</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-outline transition-transform duration-200" style={{ transform: academicExpanded.examPath ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>
          {academicExpanded.examPath && (
            <div className="space-y-1 mt-1 pl-2 border-l border-surface-variant ml-5">
              <button
                onClick={() => { setActivePage('exampath-directory'); setSubPage('all'); }}
                className={`w-full text-left ${subNavItemClass('exampath-directory', 'all')}`}
              >
                All Exams & Colleges
              </button>
              <button
                onClick={() => { setActivePage('exampath-timeline'); setSubPage(null); }}
                className={`w-full text-left ${subNavItemClass('exampath-timeline', null)}`}
              >
                Timeline & Deadlines
              </button>
              <button
                onClick={() => { setActivePage('career-compass'); setSubPage(null); }}
                className={`w-full text-left ${subNavItemClass('career-compass', null)}`}
              >
                Career Compass
              </button>
              <button
                onClick={() => { setActivePage('exam-tracker'); setSubPage(null); }}
                className={`w-full text-left ${subNavItemClass('exam-tracker', null)}`}
              >
                My Exam Tracker
              </button>
            </div>
          )}
        </div>

        {/* Preferences Group */}
        <div className="pt-4 pb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-outline">
          Preferences
        </div>

        <button
          onClick={() => { setActivePage('settings'); setSubPage('profile'); }}
          className={`w-full text-left ${navItemClass('settings', 'profile')}`}
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">settings</span>
          <span className="text-sm">Account Settings</span>
        </button>

        <button
          onClick={() => { setActivePage('settings'); setSubPage('password'); }}
          className={`w-full text-left ${navItemClass('settings', 'password')}`}
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">lock_reset</span>
          <span className="text-sm">Change Password</span>
        </button>
      </nav>

      {/* Footer Copyright */}
      <div className="p-4 border-t border-surface-variant/40 mt-auto text-[11px] text-outline text-center">
        © 2026 Riyatrix Systems Private Limited
      </div>
    </aside>
  );
}
