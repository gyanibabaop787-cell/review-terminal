"use client";

import { useState } from 'react';
import StarRating from './StarRating';
import { submitFeedback } from '@/lib/supabase';
import { Shuffle, Copy, Check } from 'lucide-react';
import { feedbackPhrases } from '@/lib/feedbackData';

interface ReviewFlowProps {
  business: {
    id: string;
    business_name: string;
    logo_url: string;
    google_review_url: string;
  };
}

const TAGS = ['Serving', 'Staff Behaviour', 'Cleaning', 'Room Quality'];

export default function ReviewFlow({ business }: ReviewFlowProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [positiveTags, setPositiveTags] = useState<string[]>([]);
  const [negativeTags, setNegativeTags] = useState<string[]>([]);
  
  const [autoFillEnabled, setAutoFillEnabled] = useState(true);
  const [autoFilledPhrases, setAutoFilledPhrases] = useState<{ [tag: string]: string }>({});

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRatingChange = (val: number) => {
    setRating(val);
    // If they change to 4 or 5 stars, clear any negative tags they might have selected
    if (val >= 4) {
      setNegativeTags([]);
      setAutoFilledPhrases(prev => {
        const updated = { ...prev };
        TAGS.forEach(tag => {
          if (feedbackPhrases.negative[tag as keyof typeof feedbackPhrases.negative].includes(updated[tag])) {
            delete updated[tag];
          }
        });
        rebuildMessage(updated);
        return updated;
      });
    }
  };

  const toggleTag = (tag: string, type: 'positive' | 'negative') => {
    let isSelecting = false;

    if (type === 'positive') {
      const isAlreadyPositive = positiveTags.includes(tag);
      isSelecting = !isAlreadyPositive;
      
      setPositiveTags(prev => 
        isAlreadyPositive ? prev.filter(t => t !== tag) : [...prev, tag]
      );
      setNegativeTags(prev => prev.filter(t => t !== tag));
    } else {
      const isAlreadyNegative = negativeTags.includes(tag);
      isSelecting = !isAlreadyNegative;
      
      setNegativeTags(prev => 
        isAlreadyNegative ? prev.filter(t => t !== tag) : [...prev, tag]
      );
      setPositiveTags(prev => prev.filter(t => t !== tag));
    }

    if (autoFillEnabled) {
      if (isSelecting) {
        // Pick a random phrase
        const phrases = feedbackPhrases[type][tag as keyof typeof feedbackPhrases['positive']];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        setAutoFilledPhrases(prev => {
          const updated = { ...prev, [tag]: randomPhrase };
          rebuildMessage(updated);
          return updated;
        });
      } else {
        // Remove the phrase
        setAutoFilledPhrases(prev => {
          const updated = { ...prev };
          delete updated[tag];
          rebuildMessage(updated);
          return updated;
        });
      }
    }
  };

  const toggleAutoFill = () => {
    const newState = !autoFillEnabled;
    setAutoFillEnabled(newState);
    if (!newState) {
      setAutoFilledPhrases({});
      setMessage('');
    } else {
      // Generate phrases for already selected tags
      const newPhrases: { [tag: string]: string } = {};
      
      positiveTags.forEach(tag => {
        const phrases = feedbackPhrases['positive'][tag as keyof typeof feedbackPhrases['positive']];
        newPhrases[tag] = phrases[Math.floor(Math.random() * phrases.length)];
      });
      
      negativeTags.forEach(tag => {
        const phrases = feedbackPhrases['negative'][tag as keyof typeof feedbackPhrases['negative']];
        newPhrases[tag] = phrases[Math.floor(Math.random() * phrases.length)];
      });
      
      setAutoFilledPhrases(newPhrases);
      rebuildMessage(newPhrases);
    }
  };

  const randomizePhrases = () => {
    if (!autoFillEnabled) return;
    const newPhrases: { [tag: string]: string } = {};
    
    positiveTags.forEach(tag => {
      const phrases = feedbackPhrases['positive'][tag as keyof typeof feedbackPhrases['positive']];
      newPhrases[tag] = phrases[Math.floor(Math.random() * phrases.length)];
    });
    
    negativeTags.forEach(tag => {
      const phrases = feedbackPhrases['negative'][tag as keyof typeof feedbackPhrases['negative']];
      newPhrases[tag] = phrases[Math.floor(Math.random() * phrases.length)];
    });
    
    setAutoFilledPhrases(newPhrases);
    rebuildMessage(newPhrases);
  };

  const rebuildMessage = (phrasesObj: { [key: string]: string }) => {
    const newMsg = Object.values(phrasesObj).join(' ');
    setMessage(newMsg);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (autoFillEnabled) {
      setAutoFillEnabled(false);
      setAutoFilledPhrases({});
    }
  };

  const getFullText = () => {
    const finalMessageParts = [];
    if (positiveTags.length > 0) finalMessageParts.push(`Positive: ${positiveTags.join(', ')}`);
    if (rating <= 3 && negativeTags.length > 0) finalMessageParts.push(`Negative: ${negativeTags.join(', ')}`);
    if (message.trim()) finalMessageParts.push(`Feedback: ${message.trim()}`);
    return finalMessageParts.join('\n\n');
  };

  const handleCopy = async () => {
    const text = getFullText();
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Clipboard copy failed', err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setSubmitting(true);
    
    const text = getFullText();

    try {
      // Always submit the rating to our database first, even if they didn't write any text
      await submitFeedback(business.id, rating, text);
      
      if (rating >= 4) {
         // Auto-copy the review text
         if (text) {
           try {
             await navigator.clipboard.writeText(text);
             setCopied(true);
           } catch (err) {
             console.error('Clipboard copy failed', err);
           }
         }
         
         // Delay the redirect slightly so they can see the "Copied!" state
         setTimeout(() => {
           window.location.href = business.google_review_url;
         }, 1500);
      } else {
         // It's a negative review, we show the internal "Thank you" screen
         setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="card text-center animate-fade-in flex flex-col items-center py-10 w-full max-w-sm mx-auto">
        <svg className="success-checkmark mb-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path className="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <h2 className="text-2xl font-bold mb-4 text-white">Feedback Received</h2>
        <p className="text-muted text-sm px-4">Thank you for letting us know. We are working hard to improve your experience.</p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in w-full max-w-sm mx-auto p-5 sm:p-8">
      <div className="flex flex-col items-center mb-8">
        {business.logo_url && (
          <div className="relative">
            <img 
              src={business.logo_url} 
              alt={`${business.business_name} logo`} 
              className="avatar mb-4 relative z-10"
            />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full z-0"></div>
          </div>
        )}
        <h1 className="text-xl font-bold text-white tracking-wide text-center mt-2">{business.business_name}</h1>
      </div>

      <h2 className="text-2xl font-bold text-center mt-6 mb-2 text-white/90">
        How was your experience?
      </h2>
      <p className="text-center text-sm text-muted mb-6">Tap a star to rate us</p>

      <StarRating onRating={handleRatingChange} disabled={submitting} />

      {rating > 0 && (
        <div className="animate-fade-in flex flex-col items-start w-full mt-6">
          
          <div className="w-full mb-6">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-gradient-positive">What did we do well? (Positive)</h3>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button
                  key={`pos-${tag}`}
                  onClick={() => toggleTag(tag, 'positive')}
                  className={`tag-btn ${positiveTags.includes(tag) ? 'tag-positive-active' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {rating <= 3 && (
            <div className="w-full mb-6">
              <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-gradient-negative">What could we improve? (Negative)</h3>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={`neg-${tag}`}
                    onClick={() => toggleTag(tag, 'negative')}
                    className={`tag-btn ${negativeTags.includes(tag) ? 'tag-negative-active' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group w-full mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-3 w-full">
              <label className="label text-xs mb-0 text-white/70">Any additional comments?</label>
              <div className="flex flex-row items-center justify-end w-full sm:w-auto gap-3">
                {autoFillEnabled && (positiveTags.length > 0 || negativeTags.length > 0) && (
                  <button 
                    type="button"
                    onClick={randomizePhrases} 
                    className="shuffle-btn"
                    title="Randomize phrases"
                  >
                    <Shuffle size={12} />
                    Shuffle
                  </button>
                )}
                <span className="text-xs text-white/50">Auto-fill</span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={autoFillEnabled} onChange={toggleAutoFill} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            <textarea 
              className="textarea w-full text-base" 
              placeholder="Share your thoughts here..."
              value={message}
              onChange={handleMessageChange}
              rows={4}
            />
          </div>
          
          <div className="flex flex-col gap-3 w-full">
            <button 
              type="button"
              className="btn flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white w-full shadow-lg transition-all py-3"
              onClick={handleCopy}
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              {copied ? 'Copied to Clipboard!' : 'Copy Review to Clipboard'}
            </button>

            <button 
              className="btn btn-primary w-full shadow-lg py-3" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (copied ? 'Copied! Redirecting to Google...' : 'Processing...') : 'Submit Feedback'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
