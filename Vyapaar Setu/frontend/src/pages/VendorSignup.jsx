import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MapPin, Store, Mail, Phone, User, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const BUSINESS_TYPES = [
    'Grocery', 'Pharmacy', 'Bakery', 'Hardware', 'Printing', 'Pots', 'Services'
];

const SERVICE_TYPES = [
    'Barber', 'Tailor', 'Electrician', 'Plumber'
];

const VendorSignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        businessType: 'Grocery',
        serviceType: '',
        location: { lat: 28.6139, lng: 77.2090 } // Default to New Delhi
    });

    useEffect(() => {
        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setFormData(prev => ({
                        ...prev,
                        location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
                    }));
                },
                (err) => console.log("Location access denied, using fallback.")
            );
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const LocationMarker = () => {
        const map = useMap();
        
        useMapEvents({
            click(e) {
                setFormData(prev => ({
                    ...prev,
                    location: { lat: e.latlng.lat, lng: e.latlng.lng }
                }));
            },
        });

        const eventHandlers = {
            dragend(e) {
                const marker = e.target;
                const position = marker.getLatLng();
                setFormData(prev => ({
                    ...prev,
                    location: { lat: position.lat, lng: position.lng }
                }));
            },
        };

        return (
            <Marker 
                position={[formData.location.lat, formData.location.lng]} 
                draggable={true}
                eventHandlers={eventHandlers}
            />
        );
    };

    // Helper to recenter map when location changes
    const MapRecenter = ({ pos }) => {
        const map = useMap();
        useEffect(() => {
            map.setView([pos.lat, pos.lng], map.getZoom());
        }, [pos, map]);
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await addDoc(collection(db, 'vendors'), {
                ...formData,
                role: 'vendor',
                createdAt: serverTimestamp(),
                approved: false
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-brand-void text-brand-text flex items-center justify-center p-6">
                <div className="text-center space-y-6 animate-in fade-in duration-700">
                    <div className="w-24 h-24 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto border border-brand-accent/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                        <CheckCircle size={48} className="text-brand-accent" />
                    </div>
                    <h1 className="font-display text-4xl font-black tracking-tighter">REGISTRATION SUCCESSFUL</h1>
                    <p className="font-mono text-brand-text/40 tracking-widest uppercase">Initializing your vendor node. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-void text-brand-text p-6 md:p-12 pt-32 selection:bg-brand-accent selection:text-brand-void">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    
                    {/* Form Side */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter leading-none italic">
                                JOIN THE <span className="text-brand-accent block">NETWORK</span>
                            </h1>
                            <p className="font-mono text-xs text-brand-text/30 tracking-widest uppercase">
                                Deploy your business to the hyper-local edge. 
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <User size={12} /> Contact Name
                                    </label>
                                    <input 
                                        required name="name" type="text" value={formData.name} onChange={handleChange}
                                        className="w-full bg-brand-card/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Mail size={12} /> Email Node
                                    </label>
                                    <input 
                                        required name="email" type="email" value={formData.email} onChange={handleChange}
                                        className="w-full bg-brand-card/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent transition-all outline-none"
                                        placeholder="vendor@vyapaarsetu.com"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Phone size={12} /> Phone Signal
                                    </label>
                                    <input 
                                        required name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                        className="w-full bg-brand-card/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent transition-all outline-none"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Store size={12} /> Business Name
                                    </label>
                                    <input 
                                        required name="businessName" type="text" value={formData.businessName} onChange={handleChange}
                                        className="w-full bg-brand-card/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent transition-all outline-none"
                                        placeholder="The Sourdough Hub"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-[0.2em]">Business Protocol</label>
                                    <select 
                                        name="businessType" value={formData.businessType} onChange={handleChange}
                                        className="w-full bg-brand-card/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent transition-all outline-none appearance-none"
                                    >
                                        {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>

                                {formData.businessType === 'Services' && (
                                    <div className="space-y-2 animate-in slide-in-from-left-4 duration-300">
                                        <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-[0.2em]">Service Stream</label>
                                        <select 
                                            name="serviceType" value={formData.serviceType} onChange={handleChange}
                                            className="w-full bg-brand-card/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select Service...</option>
                                            {SERVICE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit" disabled={loading}
                                className="w-full bg-brand-accent text-brand-void py-5 rounded-2xl font-display font-black text-sm tracking-[0.2em] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <><Sparkles size={18} /> INITIALIZE VENDOR NODE</>}
                            </button>
                        </form>
                    </div>

                    {/* Map Side */}
                    <div className="space-y-6">
                        <div className="bg-brand-card/30 border border-white/5 rounded-[2.5rem] p-4 space-y-4">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex flex-col">
                                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-[0.2em]">Geo-spatial Sync</label>
                                    <span className="font-mono text-[11px] text-brand-accent flex items-center gap-1.5 mt-1 font-bold">
                                        <MapPin size={12} /> {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                                    </span>
                                </div>
                                <div className="text-[10px] font-mono text-brand-text/20 uppercase tracking-widest text-right">
                                    Click or drag to <br/> lock position
                                </div>
                            </div>
                            
                            <div className="h-[450px] rounded-3xl overflow-hidden border border-white/5 shadow-2xl z-0">
                                <MapContainer 
                                    center={[formData.location.lat, formData.location.lng]} 
                                    zoom={13} 
                                    scrollWheelZoom={true}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker />
                                    <MapRecenter pos={formData.location} />
                                </MapContainer>
                            </div>
                        </div>

                        <div className="p-6 bg-brand-void border border-white/5 rounded-2xl">
                             <p className="font-mono text-[10px] text-brand-text/20 leading-relaxed uppercase tracking-tighter">
                                By registering, you agree to the hyper-local commerce protocols and edge-node data distribution standards of the VyapaarSetu network.
                             </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VendorSignup;
