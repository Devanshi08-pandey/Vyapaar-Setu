import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';
import { Scissors, Wrench, Zap, Droplets, MapPin, Star, Search, Award, Clock, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'barber', label: 'Barber', icon: Scissors, color: 'from-purple-500 to-indigo-600' },
  { id: 'tailor', label: 'Tailor', icon: Scissors, color: 'from-pink-500 to-rose-600' },
  { id: 'electrician', label: 'Electrician', icon: Zap, color: 'from-yellow-500 to-amber-600' },
  { id: 'plumber', label: 'Plumber', icon: Droplets, color: 'from-blue-500 to-cyan-600' },
];

const DEMO_SERVICES = [
  { _id: 'svc-1', name: 'Rajesh Hair Studio', category: 'barber', description: 'Premium grooming: haircuts, beard styling, facials, head massages, and hair coloring. Walk-ins welcome.', price: 200, rating: 4.8, reviewCount: 234, availability: 'Available Today', distance: '0.5 km', experience: '12 years', badge: 'Top Rated', image: 'https://i.pinimg.com/736x/c7/57/9b/c7579bf129a2cbf0824c16f715fa6b07.jpg' },
  { _id: 'svc-2', name: 'Modern Touch Salon', category: 'barber', description: 'Unisex salon offering haircuts, coloring, keratin treatments, bridal packages, and spa services.', price: 350, rating: 4.7, reviewCount: 189, availability: 'Available Today', distance: '1.5 km', experience: '8 years', badge: 'Nearby', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=250&fit=crop' },
  { _id: 'svc-3', name: 'Meena Custom Tailoring', category: 'tailor', description: 'Expert custom stitching, alterations, designer wear, lehengas, kurtas, and wedding outfits.', price: 500, rating: 4.9, reviewCount: 312, availability: 'Available Today', distance: '0.8 km', experience: '20 years', badge: 'Best in Area', image: 'https://i.pinimg.com/1200x/a0/c9/73/a0c973da66d6ae5cccc9fa889eae3465.jpg' },
  { _id: 'svc-4', name: 'Elite Stitch House', category: 'tailor', description: 'Premium tailoring for suits, blazers, ethnic wear, and trouser alterations. Same-day express service available.', price: 800, rating: 4.6, reviewCount: 145, availability: 'Busy', distance: '2.0 km', experience: '15 years', badge: 'Fast Service', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop' },
  { _id: 'svc-5', name: 'Quick Fix Electricals', category: 'electrician', description: 'Same-day electrical repairs, wiring, inverter installation, MCB repairs, and full rewiring. Emergency available.', price: 500, rating: 4.6, reviewCount: 178, availability: 'Available Today', distance: '1.2 km', experience: '10 years', badge: 'Top Rated', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop' },
  { _id: 'svc-6', name: 'PowerLine Solutions', category: 'electrician', description: 'Commercial & residential electrical services. Solar panel installation, generator wiring, and safety audits.', price: 800, rating: 4.4, reviewCount: 92, availability: 'Available Today', distance: '3.0 km', experience: '7 years', badge: 'Nearby', image: 'https://i.pinimg.com/1200x/19/3a/cf/193acf81d80f5f83b202c2b00fc407ff.jpg' },
  { _id: 'svc-7', name: 'Sharma Plumbing Works', category: 'plumber', description: 'Expert plumbing: pipe repairs, bathroom fittings, water heater installation, and drainage solutions.', price: 400, rating: 4.5, reviewCount: 156, availability: 'Available Today', distance: '2.0 km', experience: '18 years', badge: 'Fast Service', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=250&fit=crop' },
  { _id: 'svc-8', name: 'AquaFix Pro Services', category: 'plumber', description: 'RO water purifier servicing, tank cleaning, leakage repair, and full bathroom renovation.', price: 600, rating: 4.7, reviewCount: 108, availability: 'Available Today', distance: '1.8 km', experience: '6 years', badge: 'Best in Area', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=250&fit=crop' },
];

const Services = () => {
  const { t } = useContext(LanguageContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchServices();
  }, [activeCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesRef = collection(db, 'services');
      let q;
      if (activeCategory !== 'all') {
        q = query(servicesRef, where('category', '==', activeCategory));
      } else {
        q = servicesRef;
      }
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
      setServices(fetched.length > 0 ? fetched : DEMO_SERVICES);
    } catch (err) {
      console.warn('Could not fetch services, showing demo:', err.message);
      setServices(DEMO_SERVICES);
    }
    setLoading(false);
  };

  const filtered = services
    .filter(s => activeCategory === 'all' || s.category === activeCategory)
    .filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getCategoryIcon = (cat) => {
    const found = CATEGORIES.find(c => c.id === cat);
    return found ? found.icon : Wrench;
  };

  const getBadgeStyle = (badge) => {
    switch (badge) {
      case 'Top Rated': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Best in Area': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Nearby': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Fast Service': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-brand-accent/20 text-brand-accent border-brand-accent/30';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-brand-void text-brand-text p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Local <span className="text-brand-accent italic font-drama font-normal">Services</span>
            </h1>
            <p className="font-mono text-brand-text/60 max-w-xl mx-auto">
              Book trusted local service providers near you.
            </p>
          </header>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 rounded-full font-mono text-xs transition-all ${activeCategory === 'all' ? 'bg-brand-accent text-brand-void' : 'bg-brand-card text-brand-text/60 border border-brand-text/10 hover:border-brand-accent/50'}`}
            >
              ALL SERVICES
            </button>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs transition-all ${activeCategory === cat.id ? 'bg-brand-accent text-brand-void' : 'bg-brand-card text-brand-text/60 border border-brand-text/10 hover:border-brand-accent/50'}`}
                >
                  <Icon size={14} /> {cat.label.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="w-full bg-brand-card border border-brand-text/10 text-brand-text px-12 py-3 rounded-full font-sans focus:outline-none focus:border-brand-accent transition-colors"
              />
            </div>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="text-center font-mono text-brand-accent animate-pulse py-12">LOADING SERVICES...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center font-mono text-brand-text/50 py-12">No services found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(service => {
                const Icon = getCategoryIcon(service.category);
                const catObj = CATEGORIES.find(c => c.id === service.category);
                return (
                  <Link to={`/service/${service._id}`} key={service._id}
                    className="group bg-brand-card rounded-2xl border border-brand-text/10 overflow-hidden hover:border-brand-accent/50 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col">
                    {/* Header with image */}
                    <div className="h-44 relative overflow-hidden">
                      {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${catObj?.color || 'from-brand-accent to-emerald-700'} flex items-center justify-center`}>
                          <Icon size={48} className="text-white/20" />
                        </div>
                      )}
                      {/* Badge */}
                      {service.badge && (
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border backdrop-blur-sm flex items-center gap-1 ${getBadgeStyle(service.badge)}`}>
                          {service.badge === 'Top Rated' && <Award size={10} />}
                          {service.badge === 'Best in Area' && <Star size={10} />}
                          {service.badge === 'Fast Service' && <Zap size={10} />}
                          {service.badge}
                        </span>
                      )}
                      {/* Rating */}
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="font-mono text-xs text-white">{service.rating}</span>
                        <span className="font-mono text-[9px] text-white/60">({service.reviewCount})</span>
                      </div>
                      {/* Availability */}
                      <div className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold backdrop-blur-sm flex items-center gap-1 ${service.availability === 'Available Today' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        <CheckCircle size={10} />
                        {service.availability}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[10px] text-brand-accent uppercase bg-brand-accent/10 px-2 py-0.5 rounded">{service.category}</span>
                        <span className="font-mono text-[10px] text-brand-text/40 flex items-center gap-0.5"><Clock size={8} /> {service.experience}</span>
                      </div>
                      <h3 className="font-display font-bold text-xl mb-1 group-hover:text-brand-accent transition-colors leading-tight">{service.name}</h3>
                      <p className="font-mono text-[11px] text-brand-text/50 mb-4 line-clamp-2">{service.description}</p>
                      <div className="mt-auto flex items-center justify-between mb-3">
                        <span className="font-mono font-bold text-brand-accent text-lg">₹{service.price}<span className="text-xs text-brand-text/40">/service</span></span>
                        <div className="flex items-center gap-1 text-brand-text/40 font-mono text-xs">
                          <MapPin size={12} /> {service.distance}
                        </div>
                      </div>
                      {/* Book Now button */}
                      <div className="bg-brand-accent text-brand-void py-2.5 rounded-xl font-mono text-xs font-bold text-center hover:scale-[1.02] transition-transform">
                        BOOK NOW
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Services;
