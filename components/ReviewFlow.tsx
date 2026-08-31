"use client";

import { useState } from 'react';
import StarRating from './StarRating';
import { submitFeedback } from '@/lib/supabase';

interface ReviewFlowProps {
  business: {
    id: string;
    business_name: string;
    logo_url: string;
    google_review_url: string;
  };
}

export default function ReviewFlow({ business }: ReviewFlowProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRating = (val: number) => {
    setRating(val);
    // If rating is 4 or 5, redirect to Google immediately (the 'stealth' redirect)
    if (val >= 4) {
      window.location.href = business.google_review_url;
    }
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    
    if (rating >= 4) {
      // Stealth redirect to Google
      window.location.href = business.google_review_url;
      // We don't set submitting to false so the button stays disabled while redirecting
    } else {
      // 1 to 3 stars: submit internally
      try {
        await submitFeedback(business.id, rating, message);
        setSubmitted(true);
      } catch (err) {
        console.error(err);
        alert('Something went wrong. Please try again.');
        setSubmitting(false);
      }
    }
  };

  if (submitted) {
    return (
      <div className="card text-center animate-fade-in flex flex-col items-center py-8">
        <svg className="success-checkmark mb-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <h2 className="text-2xl font-bold mb-4">We apologize for your experience.</h2>
        <p className="text-muted">Thank you for letting us know. We are working hard to improve.</p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="flex flex-col items-center mb-6">
        <img 
          src={business.logo_url} 
          alt={`${business.business_name} logo`} 
          className="avatar mb-4"
        />
        <h1 className="text-xl font-bold">{business.business_name}</h1>
      </div>

      <h2 className="text-2xl font-bold text-center mt-6">
        How was your experience?
      </h2>

      {/* Removed disabled={rating > 0} so users can change their rating */}
      <StarRating onRating={setRating} disabled={submitting} />

      {rating > 0 && (
        <div className="animate-fade-in flex flex-col items-center w-full">
          {rating <= 3 && (
            <div className="form-group w-full mb-4">
              <label className="label">Please tell us what we could improve:</label>
              <textarea 
                className="textarea w-full" 
                placeholder="Your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          )}
          
          <button 
            className="btn btn-primary w-full mt-4" 
            onClick={handleSubmit}
            disabled={submitting || (rating <= 3 && message.trim() === '')}
          >
            {submitting ? 'Processing...' : 'Send Feedback'}
          </button>
        </div>
      )}
    </div>
  );
}
