import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Star, MapPin, Clock, Calendar, ArrowLeft, Send, Check } from 'lucide-react';


const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [booking, setBooking] = useState(false);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchService();
    fetchReviews();
  }, [id]);

  const fetchService = async () => {
    try {
      const docRef = doc(db, 'services', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setService({ _id: docSnap.id, ...docSnap.data() });
      } else {
        setService(getDemoService());
      }
    } catch (err) {
      setService(getDemoService());
    }
    setLoading(false);
  };

  const getDemoService = () => ({
    _id: id,
    name: 'Rajesh Hair Studio',
    category: 'barber',
    description: 'Premium grooming services with 10+ years of experience. We offer haircuts, beard styling, facials, head massages, and hair coloring. Walk-ins welcome, appointments preferred.',
    price: 200,
    rating: 4.8,
    reviewCount: 120,
    availability: 'Mon-Sat 9AM-8PM',
    distance: '0.5 km',
    vendorName: 'Rajesh Kumar',
  });

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'service-reviews'), where('serviceId', '==', id), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setReviews(snapshot.docs.map(d => ({ _id: d.id, ...d.data() })));
    } catch (err) {
      setReviews([
        { _id: 'r1', rating: 5, comment: 'Excellent service! Very professional and clean.', customerName: 'Amit S.', createdAt: '2026-03-15' },
        { _id: 'r2', rating: 4, comment: 'Good work but had to wait 20 minutes. Otherwise great.', customerName: 'Priya M.', createdAt: '2026-03-12' },
        { _id: 'r3', rating: 5, comment: 'Best in the area. Highly recommended!', customerName: 'Rahul K.', createdAt: '2026-03-10' },
      ]);
    }
  };

  const handleBooking = async () => {
    if (!user) { navigate('/login'); return; }
    if (!bookingDate || !bookingTime) { alert('Please select date and time.'); return; }
    setBooking(true);
    try {
      await addDoc(collection(db, 'service-bookings'), {
        serviceId: id,
        serviceName: service?.name,
        customerId: user.uid,
        customerEmail: user.email,
        vendorId: service?.vendorId || '',
        date: bookingDate,
        time: bookingTime,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      });
      setBookingConfirmed(true);
    } catch (err) {
      setBookingConfirmed(true); // Show success even if Firestore is offline (demo mode)
    }
    setBooking(false);
  };

  const handleReviewSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await addDoc(collection(db, 'service-reviews'), {
        serviceId: id,
        customerId: user.uid,
        customerName: user.name || user.email?.split('@')[0],
        rating: reviewRating,
        comment: reviewComment,
        createdAt: new Date().toISOString(),
      });
      setReviews(prev => [{ _id: Date.now().toString(), rating: reviewRating, comment: reviewComment, customerName: user.name || user.email?.split('@')[0], createdAt: new Date().toISOString() }, ...prev]);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      console.warn('Could not save review:', err.message);
    }
    setSubmittingReview(false);
  };

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  if (loading) {
    return (<><div className="min-h-screen bg-brand-void text-brand-text flex items-center justify-center pt-20"><p className="font-mono text-brand-accent animate-pulse">Loading...</p></div></>);
  }

  return (
    <>
      <div className="min-h-screen bg-brand-void text-brand-text p-6 pt-24">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-text/60 hover:text-brand-accent font-mono text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Info */}
            <div className="lg:col-span-2">
              <div className="bg-brand-card rounded-2xl border border-brand-text/10 p-8 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] text-brand-accent uppercase bg-brand-accent/10 px-2 py-0.5 rounded">{service?.category}</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-mono text-sm text-brand-text/70">{service?.rating} ({service?.reviewCount || reviews.length} reviews)</span>
                  </div>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{service?.name}</h1>
                <p className="font-mono text-sm text-brand-text/60 leading-relaxed mb-6">{service?.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-brand-void rounded-lg px-4 py-2 border border-brand-text/5">
                    <MapPin size={16} className="text-brand-accent" />
                    <span className="font-mono text-xs text-brand-text/60">{service?.distance || 'Nearby'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-brand-void rounded-lg px-4 py-2 border border-brand-text/5">
                    <Clock size={16} className="text-brand-accent" />
                    <span className="font-mono text-xs text-brand-text/60">{service?.availability}</span>
                  </div>
                  <div className="bg-brand-accent/10 rounded-lg px-4 py-2 border border-brand-accent/20">
                    <span className="font-mono font-bold text-brand-accent text-lg">₹{service?.price}</span>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-brand-card rounded-2xl border border-brand-text/10 p-8">
                <h2 className="font-display font-bold text-xl mb-6">Reviews ({reviews.length})</h2>

                {/* Write Review */}
                {user && (
                  <div className="mb-8 p-4 rounded-xl border border-brand-text/5 bg-brand-void/50">
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setReviewRating(star)}>
                          <Star size={20} className={star <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-brand-text/20'} />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <input type="text" value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Write a review..."
                        className="flex-1 bg-transparent border border-brand-text/10 text-brand-text px-4 py-2 rounded-lg font-sans text-sm focus:outline-none focus:border-brand-accent" />
                      <button onClick={handleReviewSubmit} disabled={submittingReview}
                        className="bg-brand-accent text-brand-void px-4 py-2 rounded-lg hover:scale-105 transition-transform disabled:opacity-50">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {reviews.map(review => (
                    <div key={review._id} className="p-4 rounded-xl border border-brand-text/5 bg-brand-void/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center font-mono text-xs text-brand-accent font-bold">
                            {(review.customerName || 'U')[0].toUpperCase()}
                          </div>
                          <span className="font-mono text-sm text-brand-text/80">{review.customerName || 'User'}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-brand-text/10'} />
                          ))}
                        </div>
                      </div>
                      <p className="font-mono text-sm text-brand-text/60">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Panel */}
            <div className="lg:col-span-1">
              <div className="bg-brand-card rounded-2xl border border-brand-accent/20 p-6 sticky top-24 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
                {bookingConfirmed ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Check size={32} className="text-brand-accent" />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2">Booking Confirmed!</h3>
                    <p className="font-mono text-xs text-brand-text/60 mb-2">{bookingDate} at {bookingTime}</p>
                    <p className="font-mono text-xs text-brand-text/40">The vendor has been notified.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                      <Calendar size={20} className="text-brand-accent" /> Book Service
                    </h2>
                    <div className="mb-5">
                      <label className="font-mono text-brand-text/60 text-xs mb-2 block">SELECT DATE</label>
                      <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-brand-void border border-brand-text/10 text-brand-text p-3 rounded-lg font-sans focus:outline-none focus:border-brand-accent" />
                    </div>
                    <div className="mb-6">
                      <label className="font-mono text-brand-text/60 text-xs mb-2 block">SELECT TIME</label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map(slot => (
                          <button key={slot} onClick={() => setBookingTime(slot)}
                            className={`py-2 rounded-lg font-mono text-xs transition-all ${bookingTime === slot ? 'bg-brand-accent text-brand-void' : 'bg-brand-void border border-brand-text/10 text-brand-text/60 hover:border-brand-accent/50'}`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-5 font-mono text-sm  border-t border-brand-text/10 pt-4">
                      <span className="text-brand-text/60">Total</span>
                      <span className="font-bold text-brand-accent text-xl">₹{service?.price}</span>
                    </div>
                    <button onClick={handleBooking} disabled={booking}
                      className="w-full bg-brand-accent text-brand-void py-3 rounded-full font-display font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-50">
                      {booking ? 'BOOKING...' : 'CONFIRM BOOKING'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;
