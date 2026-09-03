import React, { useState } from 'react';

export default function TeacherCoursesPage({ courses, onToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Free' | 'Paid'
  const [courseList, setCourseList] = useState(courses);

  const filteredCourses = courseList.filter(c => {
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && !c.instructor.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterType === 'Free' && !c.isFree) return false;
    if (filterType === 'Paid' && c.isFree) return false;
    return true;
  });

  const handleEnrollCourse = (id) => {
    setCourseList(prev => prev.map(c => c.id === id ? { ...c, enrolled: true } : c));
    onToast({ title: 'Course Enrolled', message: 'You have been successfully registered in the lecture portal.', type: 'success' });
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant mb-2">
          <span className="material-symbols-outlined text-[16px]">school</span>
          Faculty Masterclasses
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Teacher Online Courses</h1>
        <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
          Curated video series, subject deep-dives, and problem solving workshops led by senior educators.
        </p>
      </div>

      {/* Search and Filters Toolbar (From Page 8 & 9 screenshots) */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <div className="h-11 bg-surface-container-low rounded-xl px-3.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search teacher or course..."
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('All')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'All'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('Free')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'Free'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            Free only
          </button>
          <button
            onClick={() => setFilterType('Paid')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'Paid'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            Paid only
          </button>
        </div>
      </div>

      {/* Courses Grid or Empty State */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-soft-card border border-outline-variant/30 flex flex-col justify-between hover:shadow-hover-card transition-all duration-300 group"
            >
              <div>
                {/* Course Banner */}
                <div className="h-40 relative overflow-hidden bg-surface-container">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-primary/80 backdrop-blur-md text-on-primary text-[10px] font-bold uppercase tracking-wider">
                    {course.isFree ? 'FREE' : `₹${course.price}`}
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-outline mb-1.5">
                    <span>{course.category}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">
                    {course.title}
                  </h3>

                  <div className="mt-3 pt-3 border-t border-surface-variant/60 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface text-xs font-bold shrink-0">
                      {course.instructor[0]}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-on-surface truncate">{course.instructor}</div>
                      <div className="text-[10px] text-outline truncate">{course.institution}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                {course.enrolled ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-semibold flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Enrolled</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnrollCourse(course.id)}
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    <span>{course.isFree ? 'Enroll Free' : `Enroll for ₹${course.price}`}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State (Exact match to Page 8 & 9 screenshot) */
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center border border-outline-variant/30 shadow-soft-card flex flex-col items-center justify-center min-h-[360px]">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
            <span className="material-symbols-outlined text-[32px]">school</span>
          </div>
          <h3 className="font-semibold text-lg text-on-surface">No online courses found.</h3>
          <p className="text-xs text-outline mt-1.5 max-w-sm">
            Try adjusting your search keywords or switch between free and paid filters.
          </p>
        </div>
      )}
    </div>
  );
}
