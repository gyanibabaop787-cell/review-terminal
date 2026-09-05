"use client";

import { useEffect, useState } from 'react';
import { getFeedbackByBusinessId, deleteFeedback, deleteAllFeedbackByBusinessId } from '@/lib/supabase';
import { Star, Trash2 } from 'lucide-react';

export default function ReviewsTable({ businessId, refreshTick = 0 }: { businessId: string, refreshTick?: number }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const data = await getFeedbackByBusinessId(businessId);
        setReviews(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    }
    
    if (businessId) {
      loadReviews();
    }
  }, [businessId, refreshTick]);

  if (!businessId) return null;
  if (loading) return <div className="text-center p-8 text-white/50">Loading reviews...</div>;
  if (error) return <div className="text-center p-8 text-red-400">{error}</div>;
  if (reviews.length === 0) return <div className="text-center p-8 text-white/50 bg-white/5 rounded-xl border border-white/10">No reviews found for this business yet.</div>;

  const parseFeedback = (msg: string, rating: number) => {
    if (!msg) return { sentiment: rating >= 4 ? 'Positive' : 'Negative', points: '-', review: '-' };
    
    let sentiment = rating >= 4 ? 'Positive' : 'Negative';
    let points = '-';
    let review = '-';
    
    const hasPositive = msg.includes('Positive: ');
    const hasNegative = msg.includes('Negative: ');
    const hasFeedback = msg.includes('Feedback: ');
    
    if (hasPositive) {
      sentiment = 'Positive';
      points = msg.split('Positive: ')[1].split('\n\n')[0];
    } else if (hasNegative) {
      sentiment = 'Negative';
      points = msg.split('Negative: ')[1].split('\n\n')[0];
    }
    
    if (hasFeedback) {
      review = msg.split('Feedback: ')[1];
    } else if (!hasPositive && !hasNegative) {
      review = msg;
    }
    
    return { sentiment, points, review };
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteFeedback(id);
        setReviews(reviews.filter(r => r.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete review');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL reviews for this business? This action cannot be undone.')) {
      try {
        await deleteAllFeedbackByBusinessId(businessId);
        setReviews([]);
      } catch (err: any) {
        alert(err.message || 'Failed to delete reviews');
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-end">
        <button 
          onClick={handleDeleteAll}
          className="btn bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-sm py-2 px-4 flex items-center gap-2"
        >
          <Trash2 size={16} /> Delete All Reviews
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reviews.map((reviewData) => {
          const { sentiment, points, review } = parseFeedback(reviewData.message, reviewData.rating);
          
          return (
            <div key={reviewData.id} className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col hover:bg-white/5 transition-all duration-300 relative group overflow-hidden">
              {/* Top Section: Rating & Date */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <span className="font-bold text-white mr-1 text-sm">{reviewData.rating}.0</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        size={14} 
                        className={star <= reviewData.rating 
                          ? (reviewData.rating >= 4 ? 'text-green-400 fill-green-400' : 'text-red-400 fill-red-400') 
                          : 'text-white/20'
                        } 
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-white/40 font-medium">
                  {new Date(reviewData.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>

              {/* Sentiment Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center shadow-sm ${
                  sentiment === 'Positive' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${sentiment === 'Positive' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  {sentiment} Experience
                </span>
              </div>

              {/* Points Selected */}
              {points !== '-' && (
                <div className="mb-4">
                  <div className="text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {points.split(', ').map(p => (
                      <span key={p} className="bg-white/5 px-2.5 py-1 rounded-md text-xs border border-white/10 text-white/80">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Text */}
              <div className="flex-1 min-h-[80px]">
                <div className="text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">Feedback</div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 h-full">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                    {review === '-' ? <span className="text-white/30 italic">No text provided by the customer.</span> : review}
                  </p>
                </div>
              </div>

              {/* Delete Action Overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(reviewData.id)}
                  className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white p-2 rounded-full backdrop-blur-md border border-red-500/30 transition-all shadow-lg"
                  title="Delete Review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
