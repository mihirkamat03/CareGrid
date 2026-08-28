import React, { useState, useEffect, useRef } from 'react';
import { useCareGrid } from '../context/CareGridContext';
import gsap from 'gsap';
import { CreditCard, Check, X, Shield, Lock } from 'lucide-react';
import './PaymentModal.css';

function PaymentModal() {
  const { showPaymentModal, setShowPaymentModal, paymentAmount, setPaymentSuccess, paymentSource } = useCareGrid();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const checkRef = useRef(null);

  useEffect(() => {
    if (showPaymentModal) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(cardRef.current, { y: 50, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
    }
  }, [showPaymentModal]);

  if (!showPaymentModal) return null;

  const getSourceMessage = () => {
    switch (paymentSource) {
      case 'doctor_fee': return 'Doctor Consultation Fee';
      case 'pharmacy': return 'Pharmacy Order';
      case 'token_tracking': return 'Token Booking Fee';
      default: return 'Secure Payment';
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    gsap.to(cardRef.current, { y: 50, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: () => {
      setShowPaymentModal(false);
      setShowSuccess(false);
    }});
  };

  const handlePay = () => {
    setIsProcessing(true);
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Animate checkmark
      setTimeout(() => {
        if (checkRef.current) {
          gsap.fromTo(checkRef.current, 
            { scale: 0, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
          );
        }
      }, 50);

      // Transition to ReceiptPrinter
      setTimeout(() => {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.5, onComplete: () => {
          setPaymentSuccess(true);
          setShowPaymentModal(false);
          setShowSuccess(false);
        }});
      }, 2000);
    }, 2000);
  };

  return (
    <div className="payment-modal-overlay" ref={overlayRef}>
      <div className="payment-modal-card" ref={cardRef}>
        {!isProcessing && !showSuccess && (
          <button className="close-button" onClick={handleClose}><X size={24} /></button>
        )}
        
        {!isProcessing && !showSuccess ? (
          <>
            <div className="payment-header">
              <div className="icon-circle">
                <CreditCard size={28} className="text-emerald" />
              </div>
              <h2>CareGrid Checkout</h2>
              <p className="text-muted">{getSourceMessage()}</p>
            </div>

            <div className="payment-amount-box">
              <span className="text-muted">Total Amount</span>
              <h1 className="glowing-amount">₹{paymentAmount}</h1>
            </div>

            <div className="card-input-container">
              <div className="input-group">
                <label>Card Number</label>
                <div className="input-with-icon">
                  <CreditCard size={18} className="input-icon" />
                  <input type="text" value="**** **** **** 4242" readOnly />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Expiry</label>
                  <input type="text" value="12/28" readOnly />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input type="password" value="***" readOnly />
                  </div>
                </div>
              </div>
            </div>

            <button className="pay-button" onClick={handlePay}>
              Pay ₹{paymentAmount}
            </button>
            <div className="secure-footer">
              <Shield size={16} />
              <span>Payments are secure and encrypted</span>
            </div>
          </>
        ) : showSuccess ? (
          <div className="success-state">
            <div className="confetti-container">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`confetti piece-${i}`}></div>
              ))}
            </div>
            <div className="check-wrapper" ref={checkRef}>
              <Check size={64} className="check-icon" />
            </div>
            <h2>Payment Successful!</h2>
            <p className="text-muted">Redirecting to receipt...</p>
          </div>
        ) : (
          <div className="processing-state">
            <div className="spinner-ring"></div>
            <h3>Processing...</h3>
            <p className="text-muted">Please do not close this window</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
