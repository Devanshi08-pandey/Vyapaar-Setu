import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Store, User, Mail, Lock, Sparkles, Map as MapIcon } from 'lucide-react';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const BUSINESS_TYPES = ['Grocery', 'Pharmacy', 'Bakery', 'Hardware', 'Printing', 'Pots', 'Services'];
const SERVICE_TYPES = ['Barber', 'Tailor', 'Electrician', 'Plumber'];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('Grocery');
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'vendor' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log("Location access denied")
      );
    }
  }, [role]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) { setLocation({ lat: e.latlng.lat, lng: e.latlng.lng }); },
    });
    return (
      <Marker 
        position={[location.lat, location.lng]} 
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const pos = e.target.getLatLng();
            setLocation({ lat: pos.lat, lng: pos.lng });
          }
        }}
      />
    );
  };

  const MapRecenter = ({ pos }) => {
    const map = useMap();
    useEffect(() => { map.setView([pos.lat, pos.lng], map.getZoom()); }, [pos, map]);
    return null;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { 
        name, email, password, role, 
        ...(role === 'vendor' && { businessName, phone, businessType, serviceType, location }) 
      };
      const user = await register(payload);
      navigate(user.role === 'vendor' ? '/vendor-dashboard' : '/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const [addressQuery, setAddressQuery] = useState('');
  const [searchingAddress, setSearchingAddress] = useState(false);

  const handleAddressSearch = async (e) => {
    e.preventDefault();
    if (!addressQuery.trim()) return;
    setSearchingAddress(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert("Location not found. Try a more specific address.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    } finally {
      setSearchingAddress(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-void p-6 pt-24 pb-12">
      <div className={`bg-brand-card p-8 rounded-3xl border border-brand-accent/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all duration-500 flex flex-col ${role === 'vendor' ? 'max-w-4xl w-full lg:flex-row gap-8' : 'max-w-md w-full'}`}>
        
        {/* Form Section */}
        <div className={`flex-1 ${role === 'vendor' ? 'lg:pr-4' : ''}`}>
          <h2 className="font-display text-4xl font-black text-brand-text mb-2 tracking-tighter">{t('register')}</h2>
          <p className="font-mono text-[10px] text-brand-text/30 uppercase tracking-[0.2em] mb-8">Deploying your node to the network</p>
          
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 font-mono text-xs">{error}</div>}
          
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div className="flex p-1 bg-brand-void/50 rounded-xl mb-4 border border-white/5">
              <button type="button" onClick={() => setRole('customer')} className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-widest rounded-lg transition-all ${role === 'customer' ? 'bg-brand-accent text-brand-void font-bold shadow-lg' : 'text-brand-text/40 hover:text-brand-text'}`}>{t('register_customer')}</button>
              <button type="button" onClick={() => setRole('vendor')} className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-widest rounded-lg transition-all ${role === 'vendor' ? 'bg-brand-accent text-brand-void font-bold shadow-lg' : 'text-brand-text/40 hover:text-brand-text'}`}>{t('register_vendor')}</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2"><User size={10}/> {t('register_fullname')}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-brand-void/80 border border-brand-text/5 text-brand-text p-3 rounded-xl font-sans focus:outline-none focus:border-brand-accent transition-all" />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2"><Mail size={10}/> {t('register_email')}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-brand-void/80 border border-brand-text/5 text-brand-text p-3 rounded-xl font-sans focus:outline-none focus:border-brand-accent transition-all" />
              </div>
            </div>

            <div className={`grid grid-cols-1 ${role === 'vendor' ? 'md:grid-cols-2' : ''} gap-4`}>
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2"><Lock size={10}/> {t('register_password')}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-brand-void/80 border border-brand-text/5 text-brand-text p-3 rounded-xl font-sans focus:outline-none focus:border-brand-accent transition-all" />
              </div>
              {role === 'vendor' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-right-4">
                  <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2"><Phone size={10}/> Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full bg-brand-void/80 border border-brand-text/5 text-brand-text p-3 rounded-xl font-sans focus:outline-none focus:border-brand-accent transition-all" />
                </div>
              )}
            </div>

            {role === 'vendor' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2"><Store size={10}/> {t('register_business')}</label>
                    <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required className="w-full bg-brand-void/80 border border-brand-text/5 text-brand-text p-3 rounded-xl font-sans focus:outline-none focus:border-brand-accent transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest mb-1 ml-1">Business Type</label>
                    <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="w-full bg-brand-void/80 border border-brand-text/5 text-brand-text p-3 rounded-xl font-sans focus:outline-none focus:border-brand-accent appearance-none">
                      {BUSINESS_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                    </select>
                  </div>
                </div>
                {businessType === 'Services' && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-left-4">
                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest mb-1 ml-1">Service Category</label>
                    <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required className="w-full bg-brand-void/80 border border-brand-text/5 text-brand-text p-3 rounded-xl font-sans focus:outline-none focus:border-brand-accent appearance-none">
                      <option value="">Select Service...</option>
                      {SERVICE_TYPES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-brand-accent text-brand-void font-black py-4 mt-6 rounded-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50">
              {loading ? "INITIALIZING..." : <><Sparkles size={16}/> {t('register_submit')}</>}
            </button>
          </form>
          
          <p className="font-mono text-[10px] text-brand-text/30 mt-8 text-center uppercase tracking-widest">
            {t('register_existing')} <Link to="/login" className="text-brand-accent font-bold hover:underline transition-all">{t('register_login_link')}</Link>
          </p>
        </div>

        {/* Map Section for Vendors */}
        {role === 'vendor' && (
          <div className="lg:w-1/2 flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-700">
             <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-2">
                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-[0.2em] flex items-center gap-2"><MapPin size={10}/> Geospatial Protocol</label>
                    <div className="font-mono text-[9px] text-brand-accent/50 bg-brand-accent/5 px-2 py-1 rounded-lg border border-brand-accent/10">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </div>
                </div>
                <form onSubmit={handleAddressSearch} className="flex gap-2 p-1 bg-brand-void/50 border border-white/5 rounded-2xl">
                    <input 
                        type="text" 
                        value={addressQuery} 
                        onChange={(e) => setAddressQuery(e.target.value)}
                        placeholder="Type location (city, area, shop...)"
                        className="flex-1 bg-transparent border-none text-[11px] font-mono p-2 focus:outline-none"
                    />
                    <button 
                        type="submit" 
                        disabled={searchingAddress}
                        className="bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-xl border border-brand-accent/20 hover:bg-brand-accent hover:text-brand-void transition-all font-mono text-[10px] font-bold"
                    >
                        {searchingAddress ? 'SYNCING...' : 'SEARCH'}
                    </button>
                </form>
             </div>
             <div className="flex-1 min-h-[350px] bg-brand-void rounded-3xl overflow-hidden border border-brand-text/5 shadow-2xl relative">
                <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                  <MapRecenter pos={location} />
                </MapContainer>
                <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-brand-void/90 backdrop-blur-md p-3 rounded-xl border border-white/5 pointer-events-none">
                   <p className="font-mono text-[9px] text-brand-text/30 uppercase tracking-tighter leading-tight text-center">Click or drag the marker to lock your business node location</p>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;
