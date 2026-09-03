import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Toast from './components/common/Toast';

// Modals
import EnrollModal from './components/modals/EnrollModal';
import AttemptDetailsModal from './components/modals/AttemptDetailsModal';
import CertificateModal from './components/modals/CertificateModal';
import ResourcePreviewModal from './components/modals/ResourcePreviewModal';

// Pages
import ExaminationListPage from './components/pages/ExaminationListPage';
import ExamHistoryPage from './components/pages/ExamHistoryPage';
import BrowseEnrollPage from './components/pages/BrowseEnrollPage';
import MyPerformancePage from './components/pages/MyPerformancePage';
import CertificatesPage from './components/pages/CertificatesPage';
import TeacherCoursesPage from './components/pages/TeacherCoursesPage';
import StudyResourcesPage from './components/pages/StudyResourcesPage';
import ExamPathDirectoryPage from './components/pages/ExamPathDirectoryPage';
import TimelineDeadlinesPage from './components/pages/TimelineDeadlinesPage';
import CareerCompassPage from './components/pages/CareerCompassPage';
import ExamTrackerPage from './components/pages/ExamTrackerPage';
import AccountSettingsPage from './components/pages/AccountSettingsPage';
import TakeExamPage from './components/pages/TakeExamPage';
import CompletedExamsPage from './components/pages/CompletedExamsPage';
import ScheduledExamsPage from './components/pages/ScheduledExamsPage';
import LiveExamPage from './components/pages/LiveExamPage';

// Mock Data
import {
  currentUser as initialUser,
  initialAttempts,
  initialExamList,
  browseEnrollExams,
  directoryExams as initialDirectory,
  teacherCourses as initialCourses,
  studyResources,
  scheduledExams,
  initialCertificates,
  availableExamsForTaking,
  careerCompassQuestions
} from './data/mockData';

export default function App() {
  const [user, setUser] = useState(initialUser);
  const [activePage, setActivePage] = useState('dashboard');
  const [subPage, setSubPage] = useState(null);

  // Core dynamic datasets
  const [examList, setExamList] = useState(initialExamList);
  const [availableExams, setAvailableExams] = useState(availableExamsForTaking);
  const [attempts, setAttempts] = useState(initialAttempts);
  const [directoryList, setDirectoryList] = useState(initialDirectory);
  const [courses, setCourses] = useState(initialCourses);
  const [certificates, setCertificates] = useState(initialCertificates);

  // Modal states
  const [activeEnrollExam, setActiveEnrollExam] = useState(null);
  const [activeAttemptModal, setActiveAttemptModal] = useState(null);
  const [activeCertModal, setActiveCertModal] = useState(null);
  const [activeResourceModal, setActiveResourceModal] = useState(null);
  const [currentTakingExam, setCurrentTakingExam] = useState(null);

  // Sidebar collapse state: on desktop (>=1024px) defaults to open; on mobile (<1024px) defaults to closed
  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [savedSidebarState, setSavedSidebarState] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  const handleNavigate = (page, sub = null) => {
    // If leaving live exam, restore previous sidebar state
    if (activePage === 'live-exam' && page !== 'live-exam') {
      setSidebarOpen(savedSidebarState);
    }
    setActivePage(page);
    setSubPage(sub);

    // MOBILE BEHAVIOR:
    // On mobile, selecting ANY page/navigation item automatically closes the sidebar.
    if (isMobile()) {
      setSidebarOpen(false);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch live exam
  const handleLaunchExam = (exam) => {
    // If specific exam passed, match from available exams or use default
    const matched = availableExams.find(e => e.id === exam?.id || e.name === exam?.name) || exam || availableExams[0];
    setCurrentTakingExam(matched);
    setSavedSidebarState(sidebarOpen);
    setSidebarOpen(false); // Exception: automatically collapse sidebar during live exam
    setActivePage('live-exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Complete exam handler
  const handleCompleteExam = (newAttempt) => {
    setAttempts(prev => [newAttempt, ...prev]);
    setSidebarOpen(savedSidebarState); // Restore sidebar state when exam ends
    showToast({
      title: 'Exam Submitted',
      message: `Score: ${newAttempt.score} (${newAttempt.percentage}%). Result saved to history.`,
      type: 'success'
    });

    // Update attempts used count in availableExams
    setAvailableExams(prev => prev.map(ex => {
      if (ex.name === newAttempt.exam) {
        return {
          ...ex,
          attemptsUsed: Math.min(ex.attemptsAllowed, ex.attemptsUsed + 1)
        };
      }
      return ex;
    }));

    // Update in general exam list
    setExamList(prev => prev.map(ex => {
      if (ex.name === newAttempt.exam) {
        return {
          ...ex,
          status: 'Done',
          attempts: '2/3'
        };
      }
      return ex;
    }));

    // If passed, generate certificate
    if (newAttempt.result === 'Pass') {
      const newCert = {
        id: `CERT-BDK-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: "Certificate of Successful Competency",
        examName: newAttempt.exam,
        recipientName: user.name,
        studentId: user.id,
        issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        score: `${newAttempt.scorePercent}%`,
        grade: "Distinction",
        verificationCode: `BDK-VRF-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        signedBy: "Academic Director, Bodhika Examinations",
        status: "Verified & Active"
      };
      setCertificates(prev => [newCert, ...prev]);
    }
  };

  // Enroll confirmation
  const handleConfirmEnroll = (exam) => {
    setActiveEnrollExam(null);
    const newExamItem = {
      id: `ex-${Date.now()}`,
      name: exam.name,
      category: exam.subject,
      grade: exam.type,
      subject: exam.subject,
      lang: "EN",
      questions: 45,
      passPercent: "60%",
      timeMin: 60,
      status: "Upcoming",
      due: "30 Sep 2026",
      access: "Enrolled",
      attempts: "0/3",
      retakeAllowed: false,
      price: exam.price,
      isFree: false
    };
    setExamList(prev => [newExamItem, ...prev]);
    showToast({
      title: 'Enrollment Confirmed!',
      message: `You now have full access to ${exam.name}. Check Upcoming Exams.`,
      type: 'success'
    });
  };

  // Update directory status
  const handleUpdateExamTrackerStatus = (id, newStatus) => {
    setDirectoryList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  return (
    <div className="min-h-screen bg-background font-sans text-on-background flex">
      {/* Bodhika 280px Left Sidebar */}
      {/* Top Header (Sticky 80px) */}
      <Header
        user={user}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onSearchSelect={(item) => handleNavigate(item.page, item.sub)}
        onNavigate={handleNavigate}
        onLogout={() => {
          showToast({ title: 'Logged Out', message: 'Session terminated securely.', type: 'info' });
        }}
      />

      {/* Left Collapsible Navigation Sidebar with Mobile Drawer Backdrop */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        activePage={activePage}
        subPage={subPage}
      />

      {/* Main Workspace Area (Offset by 280px left sidebar when open on desktop, with smooth transition) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'lg:pl-[280px]' : 'pl-0'
      }`}>
        {/* Page Content Canvas */}
        <main className="pt-24 sm:pt-28 px-4 sm:px-6 lg:px-12 pb-16 flex-1 w-full max-w-full overflow-x-hidden">
          {/* Page 1: Dashboard / Examination List */}
          {(activePage === 'dashboard' || (activePage === 'exams' && subPage === 'upcoming')) && (
            <ExaminationListPage
              exams={
                subPage === 'upcoming' ? examList.filter(e => e.status !== 'Done') :
                examList
              }
              onTakeExam={(exam) => {
                if (exam) {
                  const matched = availableExams.find(e => e.name === exam.name) || exam;
                  handleLaunchExam(matched);
                } else {
                  handleNavigate('take-exam');
                }
              }}
              onViewHistory={(subj) => {
                setActivePage('history');
                setSubPage(null);
              }}
              onToast={showToast}
            />
          )}

          {/* Completed Exams Page (Compact Card Grid with Marks, %, Pass/Fail & View Results) */}
          {(activePage === 'completed-exams' || (activePage === 'exams' && subPage === 'completed')) && (
            <CompletedExamsPage
              attempts={attempts}
              onViewResult={(att) => setActiveAttemptModal(att)}
              onRetakeExam={(att) => {
                const matched = availableExams.find(e => e.name === att.exam);
                if (matched) {
                  handleLaunchExam(matched);
                } else {
                  handleNavigate('take-exam');
                }
              }}
              onBackToDashboard={() => handleNavigate('dashboard')}
            />
          )}

          {/* Scheduled Exams Page (My Exams -> Scheduled) */}
          {(activePage === 'scheduled-exams' || (activePage === 'exams' && subPage === 'scheduled')) && (
            <ScheduledExamsPage
              scheduledList={scheduledExams}
              onStartExam={(exam) => {
                const matched = availableExams.find(e => e.name === exam.name) || exam;
                handleLaunchExam(matched);
              }}
              onToast={showToast}
            />
          )}

          {/* New General Take Exam Flow */}
          {activePage === 'take-exam' && (
            <TakeExamPage
              availableExams={availableExams}
              onStartExam={(exam) => {
                handleLaunchExam(exam);
              }}
              onToast={showToast}
            />
          )}

          {/* Page 2 & 4: Exam History */}
          {activePage === 'history' && (
            <ExamHistoryPage
              attempts={attempts}
              onBackToExams={() => handleNavigate('dashboard')}
              onViewAttempt={(att) => setActiveAttemptModal(att)}
              onRetakeExam={(att) => {
                const matched = availableExams.find(e => e.name === att.exam);
                if (matched) {
                  handleLaunchExam(matched);
                } else {
                  handleNavigate('take-exam');
                }
              }}
            />
          )}

          {/* Page 3 & 7: Browse & Enroll */}
          {activePage === 'browse-enroll' && (
            <BrowseEnrollPage
              catalog={browseEnrollExams}
              onEnroll={(exam) => setActiveEnrollExam(exam)}
              onBackToMyExams={() => handleNavigate('dashboard')}
            />
          )}

          {/* Page 5: My Performance */}
          {activePage === 'performance' && (
            <MyPerformancePage
              onNavigateToHistory={(subj) => {
                setActivePage('history');
                setSubPage('chart');
              }}
            />
          )}

          {/* Page 6: My Certificates */}
          {activePage === 'certificates' && (
            <CertificatesPage
              certificates={certificates}
              onViewCertificate={(cert) => setActiveCertModal(cert)}
            />
          )}

          {/* Page 8 & 9: Teacher Online Courses */}
          {activePage === 'teacher-courses' && (
            <TeacherCoursesPage
              courses={courses}
              onToast={showToast}
            />
          )}

          {/* Page 10, 11, 12: Study Resources */}
          {activePage === 'study-resources' && (
            <StudyResourcesPage
              resources={studyResources}
              initialCategory={subPage || 'all'}
              onOpenResource={(res) => setActiveResourceModal(res)}
              onToast={showToast}
            />
          )}

          {/* Page 13: ExamPath Directory */}
          {activePage === 'exampath-directory' && (
            <ExamPathDirectoryPage
              directoryList={directoryList}
              onTrackExam={handleUpdateExamTrackerStatus}
              onToast={showToast}
            />
          )}

          {/* Page 14: Timeline & Deadlines */}
          {activePage === 'exampath-timeline' && (
            <TimelineDeadlinesPage
              onToast={showToast}
            />
          )}

          {/* Page 15: Career Compass */}
          {activePage === 'career-compass' && (
            <CareerCompassPage
              questions={careerCompassQuestions}
              onNavigateToExam={() => handleNavigate('exampath-directory')}
              onToast={showToast}
            />
          )}

          {/* Page 16: My Exam Tracker */}
          {activePage === 'exam-tracker' && (
            <ExamTrackerPage
              directoryList={directoryList}
              onUpdateStatus={handleUpdateExamTrackerStatus}
              onToast={showToast}
            />
          )}

          {/* Page 17 & 18: Account Settings */}
          {activePage === 'settings' && (
            <AccountSettingsPage
              user={user}
              initialTab={subPage === 'password' ? 'password' : 'profile'}
              onUpdateUser={setUser}
              onToast={showToast}
            />
          )}

          {/* Page 19 & 20: Live Exam Simulator */}
          {activePage === 'live-exam' && (
            <LiveExamPage
              exam={currentTakingExam || availableExams[0]}
              onCompleteExam={handleCompleteExam}
              onExitExam={() => handleNavigate('take-exam')}
              onToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <EnrollModal
        exam={activeEnrollExam}
        onClose={() => setActiveEnrollExam(null)}
        onConfirm={handleConfirmEnroll}
      />

      <AttemptDetailsModal
        attempt={activeAttemptModal}
        onClose={() => setActiveAttemptModal(null)}
        onRetake={(att) => {
          const matched = availableExams.find(e => e.name === att.exam);
          if (matched) {
            handleLaunchExam(matched);
          } else {
            handleNavigate('take-exam');
          }
        }}
      />

      <CertificateModal
        certificate={activeCertModal}
        onClose={() => setActiveCertModal(null)}
      />

      <ResourcePreviewModal
        resource={activeResourceModal}
        onClose={() => setActiveResourceModal(null)}
      />

      {/* Global Toast Notification */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
