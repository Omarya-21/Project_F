import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatTime } from '../utils/formatTime';

export default function ReviewSection({ productID }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`/api/reviews/${productID}`);
      setReviews(res.data.reviews || []);
      setAverage(res.data.average || 0);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productID]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to leave a review');
    
    setSubmitting(true);
    try {
      await axios.post('/api/reviews', {
        productID,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-20 pt-20 border-t border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic mb-2 tracking-tight">Field Reports</h2>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">User feedback and performance ratings</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-4 rounded-2xl">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-blue-500">{Number(average).toFixed(1)}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Average</span>
          </div>
          <div className="h-10 w-[1px] bg-gray-800"></div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                size={16} 
                className={s <= Math.round(average) ? 'text-blue-500 fill-blue-500' : 'text-gray-700'} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          {user ? (
            <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl sticky top-24">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-500" /> Write Report
              </h3>
              
              <div className="mb-6">
                <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Tactical Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-2 rounded-lg border transition-all ${rating >= s ? 'bg-blue-600/20 border-blue-600/50 text-blue-500' : 'bg-gray-800/50 border-gray-700 text-gray-600'}`}
                    >
                      <Star size={20} className={rating >= s ? 'fill-blue-500' : ''} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Comments</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Analyze component performance..."
                  className="w-full bg-black/50 border border-gray-800 rounded-xl p-4 text-white text-sm focus:border-blue-500 outline-none transition-all min-h-[120px] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-xs tracking-widest disabled:opacity-50"
              >
                <Send size={16} /> {submitting ? 'Transmitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl text-center">
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-6 leading-relaxed">Authentication required to submit performance reports</p>
              <Link to="/login" className="inline-block bg-white text-black font-black px-8 py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">
                Login Now
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <p className="text-gray-500 italic">Accessing review database...</p>
          ) : reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.reviewID} className="bg-gray-900/30 border border-gray-800/50 p-8 rounded-3xl hover:border-gray-700 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 border border-blue-600/30 rounded-full flex items-center justify-center text-blue-500 font-black text-sm">
                      {rev.user_name[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase italic">{rev.user_name}</h4>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            size={10} 
                            className={s <= rev.raiting ? 'text-blue-500 fill-blue-500' : 'text-gray-700'} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                    {formatTime(rev.created_at)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-900/10 border border-dashed border-gray-800 rounded-3xl">
              <MessageSquare size={48} className="text-gray-800 mx-auto mb-4" />
              <p className="text-gray-600 font-bold text-sm uppercase tracking-widest">No reports in database</p>
              <p className="text-gray-700 text-xs mt-2 uppercase tracking-tight">Be the first to analyze this component</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
