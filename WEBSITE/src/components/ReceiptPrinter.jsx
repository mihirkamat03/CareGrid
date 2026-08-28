import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCareGrid } from '../context/CareGridContext';
import { Printer, CheckCircle, Scissors } from 'lucide-react';
import './ReceiptPrinter.css';

function ReceiptPrinter() {
  const { paymentSuccess, paymentAmount, setPaymentSuccess, paymentSource, markPaymentComplete } = useCareGrid();
  const [step, setStep] = useState('initial'); // initial -> printing -> printed -> torn -> done
  
  const overlayRef = useRef(null);
  const paperRef = useRef(null);
  const topPartRef = useRef(null);
  const bottomPartRef = useRef(null);

  // Mount animation for overlay
  useEffect(() => {
    if (paymentSuccess && step === 'initial') {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }
  }, [paymentSuccess, step]);

  if (!paymentSuccess) return null;

  const handlePrint = () => {
    setStep('printing');
    // Animate paper coming down
    setTimeout(() => {
      gsap.fromTo(paperRef.current, 
        { y: -500 }, 
        { y: 0, duration: 2, ease: "power1.inOut", onComplete: () => setStep('printed') }
      );
    }, 100);
  };

  const handleTear = () => {
    setStep('torn');
    const tl = gsap.timeline();
    
    // Split apart
    tl.to(topPartRef.current, { y: -300, opacity: 0, duration: 1, ease: "power2.in" }, 0.5);
    tl.to(bottomPartRef.current, { y: 150, scale: 1.05, duration: 1, ease: "power2.out", onComplete: () => setStep('done') }, 0.5);
  };

  const handleDone = () => {
    if (markPaymentComplete) markPaymentComplete();
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.5, onComplete: () => {
      setPaymentSuccess(false);
      setStep('initial');
    }});
  };

  const today = new Date().toLocaleDateString();
  const txnId = `CG-${Math.floor(Math.random()*100000000)}`;

  const getSourceDisplay = () => {
    switch (paymentSource) {
      case 'doctor_fee': return 'Consultation Fee';
      case 'pharmacy': return 'Pharmacy Items';
      case 'token_tracking': return 'Token Booking';
      default: return 'Platform Fee';
    }
  };

  return (
    <div className="receipt-overlay" ref={overlayRef}>
      {step === 'initial' && (
        <div className="receipt-prompt">
          <div className="prompt-icon"><CheckCircle size={48} className="text-emerald" /></div>
          <h2>Payment Authorized</h2>
          <p className="text-muted">₹{paymentAmount} processed successfully.</p>
          <button className="print-btn" onClick={handlePrint}>
            <Printer size={20} /> Generate Receipt
          </button>
        </div>
      )}

      {(step === 'printing' || step === 'printed' || step === 'torn' || step === 'done') && (
        <div className="printer-container">
          {step !== 'done' && <div className="printer-slot"></div>}
          
          <div className="paper-container">
            <div className={`receipt-full ${step === 'torn' || step === 'done' ? 'is-torn' : ''}`} ref={paperRef}>
              
              <div className="receipt-top-half" ref={topPartRef}>
                <div className="receipt-header">
                  <h2>CareGrid</h2>
                  <p>Transaction Receipt</p>
                </div>
                <div className="receipt-meta">
                  <div className="r-row"><span>Date</span><strong>{today}</strong></div>
                  <div className="r-row"><span>Txn ID</span><strong>{txnId}</strong></div>
                  <div className="r-row"><span>Method</span><strong>Card ending in 4242</strong></div>
                </div>
                
                {/* Tear line container */}
                <div className="tear-line">
                  <div className="tear-zigzag"></div>
                </div>
              </div>
              
              <div className="receipt-bottom-half" ref={bottomPartRef}>
                <div className="receipt-details">
                  <div className="r-row"><span>{getSourceDisplay()}</span><strong>₹{paymentAmount}</strong></div>
                  <div className="r-row"><span>Taxes</span><strong>₹0.00</strong></div>
                  <div className="divider"></div>
                  <div className="r-row total"><span>Total Paid</span><strong>₹{paymentAmount}</strong></div>
                </div>
                <div className="receipt-footer">
                  <p>Thank you for using CareGrid.</p>
                  <p>Stay healthy!</p>
                </div>

                {step === 'done' && (
                  <div className="done-overlay">
                    <div className="receipt-confetti">
                      {[...Array(15)].map((_, i) => <div key={i} className={`r-confetti p-${i}`}></div>)}
                    </div>
                    <h3>Payment Complete!</h3>
                    <button className="done-btn" onClick={handleDone}>Done</button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {step === 'printed' && (
            <button className="tear-btn" onClick={handleTear}>
              <Scissors size={18} /> Print & Tear Receipt
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ReceiptPrinter;
