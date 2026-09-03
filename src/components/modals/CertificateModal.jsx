import React from 'react';

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Bar (hidden during print) */}
        <div className="p-4 px-6 border-b border-surface-variant flex items-center justify-between bg-surface-container-low print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
            <span className="font-semibold text-sm text-on-surface">Verified Academic Credential</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-3 sm:p-8 overflow-y-auto flex items-center justify-center bg-surface-dim/40">
          <div 
            id="printable-certificate"
            className="w-full bg-white text-gray-900 border-[8px] sm:border-[12px] border-double border-gray-300 p-5 sm:p-10 rounded-xl relative shadow-hover-card"
            style={{ maxWidth: '720px', minHeight: '500px' }}
          >
            {/* Elegant Corner Motifs */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gray-400"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gray-400"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gray-400"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gray-400"></div>

            {/* Header / Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs tracking-widest uppercase font-semibold mb-3">
                Bodhika Academic Council
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 uppercase">
                {certificate.title}
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                Official Examination Certification
              </p>
            </div>

            {/* Body */}
            <div className="text-center my-6 space-y-3">
              <p className="text-sm text-gray-600 italic">This is proudly presented to</p>
              <h2 className="text-2xl font-bold text-gray-900 tracking-normal border-b-2 border-gray-200 pb-2 inline-block px-8">
                {certificate.recipientName}
              </h2>
              <p className="text-xs text-gray-500">Student ID: {certificate.studentId}</p>
              <p className="text-sm text-gray-700 max-w-md mx-auto leading-relaxed pt-2">
                For demonstrating exceptional aptitude, mastery, and successfully clearing the examination:
              </p>
              <p className="text-lg font-semibold text-gray-900 pt-1">
                {certificate.examName}
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <span>Score Attained: {certificate.score}</span>
                <span>•</span>
                <span>Status: {certificate.grade}</span>
              </div>
            </div>

            {/* Footer & Signature */}
            <div className="mt-10 pt-6 border-t border-gray-200 grid grid-cols-3 items-end text-center">
              <div className="text-left">
                <div className="text-[11px] font-mono text-gray-400">Verification ID:</div>
                <div className="text-xs font-mono font-bold text-gray-700">{certificate.verificationCode}</div>
                <div className="text-[10px] text-gray-400 mt-1">Issued on {certificate.issueDate}</div>
              </div>

              {/* Gold Seal Motif */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-amber-400 bg-amber-50 flex items-center justify-center text-amber-700 shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">verified</span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-serif italic text-base text-gray-800">K. Riyatrix</div>
                <div className="border-t border-gray-400 w-32 ml-auto mt-1"></div>
                <div className="text-[11px] font-medium text-gray-600 mt-1">{certificate.signedBy}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
