import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, MessageCircle, Filter, ChevronDown, ArrowLeft, X } from 'lucide-react';
import CustomCursor from '../components/CustomCursor';
import Lenis from 'lenis';
import gsap from 'gsap';

// Categories remain static for now
const CATEGORIES = ["All", "Food & Groceries", "Home Services", "Clothing & Fashion", "Electronics"];

export default function Marketplace() {
  const [vendors, setVendors] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [aiNote, setAiNote] = useState(null);

  // Webhook integration states
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleOpenModal = (vendor) => {
    setSelectedVendor(vendor);
    setSubmitSuccess(false);
  };

  const handleCloseModal = () => {
    setSelectedVendor(null);
    setFormData({ name: '', phone: '', email: '' });
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!selectedVendor) return;
    
    setIsSubmitting(true);
    
    const payload = {
      name: formData.name,
      phone: formData.phone,
      vendor_job: selectedVendor.category,
      email: formData.email
    };

    try {
      await fetch('https://devanshi0812.app.n8n.cloud/webhook/7891438f-2e91-466f-966b-0ae24802bc6f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Fetch initial vendors from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/vendors')
      .then(res => res.json())
      .then(data => setVendors(data))
      .catch(err => console.error("Failed to fetch vendors:", err));
  }, []);

  // Handle Smart AI Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setAiNote(null);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      setIsSearching(true);
      fetch('http://localhost:8000/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      })
      .then(res => res.json())
      .then(data => {
        setVendors(data.results);
        setAiNote(data.ai_note);
        setIsSearching(false);
      })
      .catch(err => {
        console.error("AI Search failed:", err);
        setIsSearching(false);
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredVendors = vendors.filter(v => {
    const matchesCat = activeCategory === "All" || v.category === activeCategory;
    // Smart search handled by backend, so we only filter categories locally here
    return matchesCat;
  });

  return (
    <div className="min-h-screen bg-vs-dark pb-20">
      <CustomCursor />
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-vs-dark/80 backdrop-blur-xl border-b border-vs-text/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Back */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            <Link to="/" className="text-vs-text/50 hover:text-vs-green transition-colors hidden md:block group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link to="/" className="font-heading font-bold text-2xl tracking-wide">
              Vyapaar<span className="text-vs-green">Setu</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vs-text/40" />
            <input 
              type="text" 
              placeholder="Search local vendors, products, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-vs-card border border-vs-text/10 rounded-full pl-11 pr-4 py-2.5 text-sm font-body focus:outline-none focus:border-vs-green transition-colors placeholder:text-vs-text/30"
            />
          </div>

          {/* Location / User profile */}
          <div className="hidden md:flex items-center gap-3 text-sm font-body text-vs-text/60">
            <div className="flex items-center gap-1.5 bg-vs-card px-3 py-1.5 rounded-full border border-vs-text/5">
              <MapPin className="w-3.5 h-3.5 text-vs-orange" />
              <span>Koramangala, BLR</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 bg-vs-card/50 rounded-2xl p-6 border border-vs-text/5">
            <div className="flex items-center gap-2 mb-6 text-vs-text/50 uppercase tracking-widest text-xs font-mono">
              <Filter className="w-3.5 h-3.5" /> Filters
            </div>
            
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-heading font-medium transition-colors ${activeCategory === cat ? 'bg-vs-dark text-vs-green border border-vs-green/20' : 'text-vs-text/60 hover:text-vs-text hover:bg-vs-text/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid Results */}
        <div className="flex-grow">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
                Local Discovery {isSearching && <span className="w-4 h-4 rounded-full border-2 border-vs-green/30 border-t-vs-green animate-spin" />}
              </h1>
              {aiNote && <p className="text-vs-green/70 text-sm mt-2 font-mono">{aiNote}</p>}
            </div>
            <span className="font-mono text-sm text-vs-green bg-vs-green/10 px-3 py-1 rounded-full">{filteredVendors.length} matches</span>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-20 text-vs-text/40 font-body">
              No vendors found matching "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map(vendor => (
                <div key={vendor.id} className="bg-vs-card rounded-2xl overflow-hidden border border-vs-text/5 hover:border-vs-green/30 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,234,122,0.05)] group">
                  {/* Image */}
                  <div className="h-48 overflow-hidden relative">
                    <img src={vendor.img} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                    <div className="absolute top-3 right-3 bg-vs-dark/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono font-medium border border-vs-text/10 text-vs-text">
                      {vendor.distance}
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="p-5">
                    <div className="text-xs font-mono text-vs-orange mb-2">{vendor.category}</div>
                    <h3 className="font-heading font-bold text-lg mb-2 truncate">{vendor.name}</h3>
                    
                    <div className="flex items-center gap-1.5 text-sm mb-5">
                      <Star className="w-4 h-4 text-vs-green fill-vs-green" />
                      <span className="font-body font-medium">{vendor.rating}</span>
                      <span className="text-vs-text/40">({vendor.reviews} reviews)</span>
                    </div>

                    <button 
                      onClick={() => handleOpenModal(vendor)}
                      className="w-full flex items-center justify-center gap-2 bg-vs-text/5 hover:bg-vs-green text-vs-text hover:text-vs-dark font-heading font-semibold py-3 rounded-xl transition-colors">
                      <MessageCircle className="w-4 h-4" /> Contact Vendor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Inquiry Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-vs-dark/80 backdrop-blur-sm p-4">
          <div className="bg-vs-card border border-vs-text/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-vs-text/50 hover:text-vs-text"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-heading font-bold mb-2">Contact Vendor</h2>
              <p className="text-sm text-vs-text/60 mb-6">
                Send your details to <strong>{selectedVendor.name}</strong> ({selectedVendor.category}). They will get back to you shortly.
              </p>

              {submitSuccess ? (
                <div className="bg-vs-green/10 border border-vs-green/30 text-vs-green px-4 py-6 rounded-xl text-center font-medium font-body flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-vs-green/20 rounded-full flex items-center justify-center mb-2">
                    <MessageCircle className="w-6 h-6 text-vs-green" />
                  </div>
                  Request sent successfully!
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="flex flex-col gap-4">
                  <div>
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-vs-dark border border-vs-text/10 rounded-xl px-4 py-3 font-body focus:outline-none focus:border-vs-green transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      required
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-vs-dark border border-vs-text/10 rounded-xl px-4 py-3 font-body focus:outline-none focus:border-vs-green transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-vs-dark border border-vs-text/10 rounded-xl px-4 py-3 font-body focus:outline-none focus:border-vs-green transition-colors text-sm"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-vs-green text-vs-dark font-heading font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Details"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
