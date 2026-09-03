import React, { useState } from 'react';

export default function CertificatesPage({ certificates, onViewCertificate }) {
  const [showDemoEmpty, setShowDemoEmpty] = useState(false);

  const displayedCerts = showDemoEmpty ? [] : certificates;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-[16px]">military_tech</span>
            Verified Credentials
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">My Certificates</h1>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
            Certificates of completion and merit issued to you. Click View / Print to open a printable copy (Print → Save as PDF from your browser).
          </p>
        </div>

        {/* Demo State Switcher */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-variant text-xs">
          <span className="text-outline font-medium">Preview Empty State:</span>
          <button
            onClick={() => setShowDemoEmpty(!showDemoEmpty)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              showDemoEmpty ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'
            }`}
          >
            {showDemoEmpty ? 'Showing Empty' : 'Showing Issued (2)'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {displayedCerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedCerts.map((cert) => (
            <div
              key={cert.id}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-soft-card border border-outline-variant/30 flex flex-col justify-between hover:shadow-hover-card transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full pointer-events-none"></div>

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                        {cert.grade}
                      </span>
                      <h3 className="font-bold text-lg text-on-surface leading-tight mt-0.5">
                        {cert.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 my-4">
                  <div className="p-3.5 bg-surface-container-low rounded-xl">
                    <div className="text-[11px] text-outline uppercase font-semibold">Examination Target</div>
                    <div className="text-sm font-semibold text-on-surface mt-0.5">{cert.examName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-surface-container-low rounded-xl">
                      <span className="text-[10px] text-outline uppercase font-semibold">Attained Score</span>
                      <div className="font-bold text-base text-secondary mt-0.5">{cert.score}</div>
                    </div>
                    <div className="p-2.5 bg-surface-container-low rounded-xl">
                      <span className="text-[10px] text-outline uppercase font-semibold">Issue Date</span>
                      <div className="font-bold text-xs text-on-surface mt-1">{cert.issueDate}</div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-outline flex items-center gap-1.5 pt-1">
                    <span className="material-symbols-outlined text-[14px]">qr_code</span>
                    <span>{cert.verificationCode}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-variant flex items-center justify-between mt-2">
                <span className="inline-flex items-center gap-1 text-xs text-secondary font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  {cert.status}
                </span>

                <button
                  onClick={() => onViewCertificate(cert)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>View / Print</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State (Exact Match to Page 6 screenshot) */
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center border border-outline-variant/30 shadow-soft-card flex flex-col items-center justify-center min-h-[380px]">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
            <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
          </div>
          <h3 className="font-semibold text-lg text-on-surface">No certificates have been issued to you yet.</h3>
          <p className="text-xs text-outline mt-1.5 max-w-md">
            Complete assigned assessments or entrance mocks with a passing grade to unlock your verified merit credentials.
          </p>
          <button
            onClick={() => setShowDemoEmpty(false)}
            className="mt-6 px-5 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-colors"
          >
            Show Earned Credentials
          </button>
        </div>
      )}
    </div>
  );
}
