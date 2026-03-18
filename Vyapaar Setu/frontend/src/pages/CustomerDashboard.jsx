import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import WhatsAppButton from '../components/WhatsAppButton';
import { User, Mail, Phone, Calendar, ShoppingBag, Search } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      navigate('/vendor-dashboard');
      return;
    }

    const qOrders = query(collection(db, 'orders'), where('customerId', '==', user.uid));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const ords = [];
      snapshot.forEach((doc) => ords.push({ id: doc.id, ...doc.data() }));
      // Sort by date descending
      ords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ords);
    });

    return () => unsubOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-void text-brand-text p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="bg-brand-accent/20 p-2 rounded-lg">
                 <User className="text-brand-accent" size={24} />
               </div>
               <h1 className="font-display text-4xl font-bold">Terminal: <span className="text-brand-accent">{user.name || user.displayName || 'User'}</span></h1>
            </div>
            <p className="font-mono text-sm text-brand-text/60">Session Active • Data Grid Operational</p>
          </div>
          <Link to="/marketplace" className="flex items-center gap-3 bg-brand-accent text-brand-void px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all font-display font-black text-xs tracking-widest shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]">
            <Search size={18} />
            SCAN MARKETPLACE
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-brand-card p-6 rounded-2xl border border-brand-text/10">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <User size={20} className="text-brand-accent" />
                Profile Metrics
              </h2>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center gap-3 p-3 bg-brand-void/50 rounded-xl border border-white/5">
                  <Mail size={16} className="text-brand-text/40" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-brand-void/50 rounded-xl border border-white/5">
                  <Phone size={16} className="text-brand-text/40" />
                  <span>{user.phone || 'No phone linked'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-brand-void/50 rounded-xl border border-white/5">
                  <Calendar size={16} className="text-brand-text/40" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-card p-6 rounded-2xl border border-brand-accent/20">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-accent" />
                Quick Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-void/50 p-4 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] text-brand-text/40 uppercase tracking-widest mb-1">Orders</p>
                  <p className="text-2xl font-bold text-brand-accent">{orders.length}</p>
                </div>
                <div className="bg-brand-void/50 p-4 rounded-xl border border-white/5 text-center">
                  <p className="text-[10px] text-brand-text/40 uppercase tracking-widest mb-1">Spending</p>
                  <p className="text-2xl font-bold text-brand-accent">₹{orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Area */}
          <div className="lg:col-span-2">
            <div className="bg-brand-card p-8 rounded-2xl border border-brand-text/10 min-h-[500px]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-display text-2xl font-bold">Transaction History</h2>
                <div className="bg-brand-accent/10 px-3 py-1 rounded-full border border-brand-accent/20">
                  <span className="font-mono text-[10px] text-brand-accent tracking-widest uppercase">Live Sync</span>
                </div>
              </div>
              
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-brand-text/10 rounded-2xl">
                  <ShoppingBag size={48} className="text-brand-text/10 mb-4" />
                  <p className="font-mono text-brand-text/40 text-sm">No transaction packets found in local storage.</p>
                </div>
              ) : (
                 <div className="flex flex-col gap-4">
                  {orders.map(order => (
                    <div key={order.id} className="p-6 bg-brand-void/50 rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-colors group">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest">ORDER_ID:</span>
                            <span className="font-mono text-xs text-brand-accent">{order.id.toUpperCase()}</span>
                          </div>
                          <p className="font-display font-bold text-lg">₹{order.totalAmount}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest border ${
                            order.status === 'PAID' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          }`}>
                            {order.status}
                          </span>
                          <span className="font-mono text-[10px] text-brand-text/40 tracking-widest">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="bg-brand-card px-2 py-1 rounded border border-white/5 text-[10px] font-mono text-brand-text/60">
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                        </div>
                        <WhatsAppButton 
                          phone={order.items[0]?.vendorPhone || "919000000000"} 
                          message={`Hi! I have an order (ID: ${order.id.slice(0,8)}) for ${order.items.map(i => i.name).join(', ')}. Could you please update me?`}
                          className="w-full md:w-auto text-[10px]"
                        />
                      </div>
                    </div>
                  ))}
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
