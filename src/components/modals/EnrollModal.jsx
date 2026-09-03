import React, { useState } from 'react';

export default function EnrollModal({ exam, onClose, onConfirm }) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);

  if (!exam) return null;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onConfirm(exam);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-[24px] shadow-float border border-outline-variant/30 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-surface-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-on-surface">Enroll in Examination</h3>
              <p className="text-xs text-on-surface-variant">Secure checkout powered by Razorpay</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Exam Summary */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-variant/60 flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-secondary uppercase tracking-wider">{exam.type || 'EXAM'}</span>
              <h4 className="font-semibold text-base text-on-surface mt-0.5">{exam.name}</h4>
              <p className="text-xs text-on-surface-variant mt-1">{exam.description || 'Full mock exam package with answer explanations.'}</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-xs text-outline">Fee</div>
              <div className="text-xl font-bold text-on-surface">₹{exam.price.toFixed(2)}</div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-outline mb-2 block">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'upi'
                    ? 'border-primary bg-primary/5 text-on-surface font-semibold ring-1 ring-primary'
                    : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
                <span className="text-xs">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/5 text-on-surface font-semibold ring-1 ring-primary'
                    : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">credit_card</span>
                <span className="text-xs">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'netbanking'
                    ? 'border-primary bg-primary/5 text-on-surface font-semibold ring-1 ring-primary'
                    : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
                <span className="text-xs">NetBanking</span>
              </button>
            </div>
          </div>

          {/* Secure Trust Badge */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low px-3.5 py-2.5 rounded-xl">
            <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
            <span>256-bit encrypted transaction. Immediate instant access on completion.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-container-low border-t border-surface-variant flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePay}
            disabled={processing}
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                Processing ₹{exam.price.toFixed(2)}...
              </>
            ) : (
              <>
                <span>Pay & Enroll Now</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
