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
      <div className="w-full overflow-x-auto bg-black/20 rounded-xl border border-white/10 backdrop-blur-md">
        <table className="w-full text-left text-sm text-white/80">
          <thead className="bg-white/5 text-white/90 uppercase font-semibold text-xs border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Stars</th>
              <th className="px-6 py-4">Sentiment</th>
              <th className="px-6 py-4">Points Selected</th>
              <th className="px-6 py-4">Review Text</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((reviewData) => {
              const { sentiment, points, review } = parseFeedback(reviewData.message, reviewData.rating);
              
              return (
                <tr key={reviewData.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(reviewData.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 items-center">
                      <span className="font-bold mr-1">{reviewData.rating}</span>
                      <Star size={14} className={reviewData.rating >= 4 ? 'text-green-400 fill-green-400' : 'text-red-400 fill-red-400'} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${sentiment === 'Positive' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {points !== '-' ? points.split(', ').map(p => (
                        <span key={p} className="bg-white/5 px-2 py-1 rounded text-xs border border-white/10">{p}</span>
                      )) : <span className="text-white/30 italic">-</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ minWidth: '350px', maxWidth: '800px' }}>
                    <p className="whitespace-pre-wrap text-base leading-relaxed">{review === '-' ? <span className="text-white/30 italic">No text provided</span> : review}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(reviewData.id)}
                      className="text-white/30 hover:text-red-400 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
