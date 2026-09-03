import React, { useState } from 'react';

export default function ResourcePreviewModal({ resource, onClose }) {
  const [downloading, setDownloading] = useState(false);

  if (!resource) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Mock instant file download trigger
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(resource, null, 2)], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = resource.fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-secondary uppercase">{resource.company}</span>
                <span className="text-xs text-outline">•</span>
                <span className="text-xs text-outline">{resource.pages} Pages</span>
                <span className="text-xs text-outline">•</span>
                <span className="text-xs text-outline">{resource.questionsCount} Questions</span>
              </div>
              <h3 className="font-semibold text-base text-on-surface leading-tight mt-0.5">{resource.fileName}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant">
            <h4 className="font-medium text-sm text-on-surface">{resource.title}</h4>
            <p className="text-xs text-on-surface-variant mt-1">{resource.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-outline">
                Document Preview & Sample Q&A
              </span>
              <span className="text-xs text-secondary font-medium">Verified Question Bank</span>
            </div>

            {resource.contentPreview && resource.contentPreview.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant/80 hover:border-outline transition-colors">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface-variant text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-on-surface">{item.q}</p>
                    <p className="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg border-l-2 border-secondary">
                      <span className="font-semibold text-secondary">Solution / Explanation: </span>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-container-low border-t border-surface-variant flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Close Preview
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {downloading ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                Downloading {resource.fileName}...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download PDF ({resource.pages} pgs)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
