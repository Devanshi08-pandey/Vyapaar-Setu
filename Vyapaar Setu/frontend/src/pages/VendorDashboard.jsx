import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { api } from '../config/api';
import WhatsAppButton from '../components/WhatsAppButton';
import { Package, TrendingUp, HelpCircle, Power, User, Clock, CheckCircle, XCircle } from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isOnline, setIsOnline] = useState(user?.isOnline ?? true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'vendor') {
      window.location.href = '/dashboard'; // Force hard redirect to be safer
      return;
    }

    // Listen to vendor's products
    const qProducts = query(collection(db, 'products'), where('vendorId', '==', user.uid));
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      const prods = [];
      snapshot.forEach((doc) => prods.push({ id: doc.id, ...doc.data() }));
      setProducts(prods);
    });

    // Targeted order listener - much more efficient
    const qOrders = query(
      collection(db, 'orders'), 
      where('vendorIds', 'array-contains', user.uid)
    );

    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
       const ords = [];
       snapshot.forEach((doc) => {
         ords.push({ id: doc.id, ...doc.data() });
       });
       // Fallback for old orders that don't have vendorIds array yet
       if (ords.length === 0) {
         // This is a temporary fallback - in a real app we'd migrate data
         const qOldOrders = query(collection(db, 'orders'), where('customerId', '!=', '')); // Broad but better than nothing
         onSnapshot(qOldOrders, (oldSnap) => {
            const filtered = [];
            oldSnap.forEach(d => {
              const data = d.data();
              if (data.items?.some(i => i.vendorId === user.uid)) filtered.push({ id: d.id, ...data });
            });
            setOrders(prev => [...new Set([...prev, ...filtered])].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
         });
       } else {
         ords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
         setOrders(ords);
       }
    });

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, [user, navigate]);

  const toggleAvailability = async () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    try {
      await updateDoc(doc(db, 'users', user.uid), { isOnline: nextStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'grocery', description: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!newProduct.name) return;
    setIsGenerating(true);
    try {
      const response = await api.generateDescription(newProduct.name, newProduct.category);
      setNewProduct(prev => ({ ...prev, description: response.description || response.text || '' }));
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    try {
      await addDoc(collection(db, 'products'), {
        vendorId: user.uid,
        vendorName: user.businessName || user.name,
        vendorPhone: user.phone || '',
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        description: newProduct.description,
        createdAt: serverTimestamp()
      });
      setNewProduct({ name: '', price: '', category: 'grocery', description: '' });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-void text-brand-text p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">Node Operations: <span className="text-brand-accent">{user.businessName || user.name || 'Vendor'}</span></h1>
            <div className="flex items-center gap-3">
               <div className={`flex items-center gap-2 font-mono text-[10px] px-3 py-1.5 rounded border ${
                 isOnline ? 'text-brand-accent bg-brand-accent/10 border-brand-accent/20' : 'text-red-500 bg-red-500/10 border-red-500/20'
               }`}>
                 <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-brand-accent animate-pulse' : 'bg-red-500'}`}></span>
                 {isOnline ? 'SYSTEM ONLINE — TRANSMITTING' : 'OFFLINE — POWER SAVE'}
               </div>
               <button 
                 onClick={toggleAvailability}
                 className="flex items-center gap-2 bg-brand-card border border-white/5 px-4 py-1.5 rounded-lg hover:border-brand-accent transition-all text-[10px] font-mono"
               >
                 <Power size={12} className={isOnline ? 'text-brand-accent' : 'text-red-500'} />
                 TOGGLE POWER
               </button>
            </div>
          </div>
          
          <div className="bg-brand-card p-4 rounded-2xl border border-brand-text/10 flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-[10px] text-brand-text/40 tracking-widest">BUSINESS_ID</p>
              <p className="font-mono text-xs text-brand-accent">{user.uid.slice(0,12)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
              <Package size={20} className="text-brand-accent" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-card p-6 rounded-2xl border border-brand-accent/10 flex flex-col gap-4">
            <div className="flex justify-between items-center text-brand-text/60">
              <span className="font-mono text-sm uppercase tracking-wider">Revenue Stream</span>
              <TrendingUp size={20} className="text-brand-accent" />
            </div>
            <span className="font-display text-4xl font-semibold">₹{orders.filter(o => o.status === 'DELIVERED' || o.status === 'PAID').reduce((acc, curr) => acc + (curr.totalAmount || 0), 0)}</span>
          </div>

          <div className="bg-brand-card p-6 rounded-2xl border border-brand-accent/10 flex flex-col gap-4">
            <div className="flex justify-between items-center text-brand-text/60">
              <span className="font-mono text-sm uppercase tracking-wider">Deployed Asset Load</span>
              <Package size={20} className="text-brand-accent" />
            </div>
            <span className="font-display text-4xl font-semibold">{products.length}</span>
          </div>

          <div className="bg-brand-card p-6 rounded-2xl border border-brand-accent/10 flex flex-col gap-4">
            <div className="flex justify-between items-center text-brand-text/60">
              <span className="font-mono text-sm uppercase tracking-wider">Incoming Data Packets</span>
              <HelpCircle size={20} className="text-brand-accent" />
            </div>
            <span className="font-display text-4xl font-semibold">{orders.filter(o => o.status === 'PAID').length}</span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Incoming Orders Stream */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-brand-card p-8 rounded-3xl border border-brand-text/10 min-h-[400px]">
              <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
                <Clock className="text-brand-accent" size={24} />
                Order Management Queue
              </h2>
              
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-brand-text/10 rounded-2xl">
                  <Package size={48} className="text-brand-text/10 mb-4" />
                  <p className="font-mono text-brand-text/40 text-sm">No incoming order packets detected.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {orders.map(order => (
                    <div key={order.id} className="p-6 bg-brand-void/50 rounded-2xl border border-white/5 hover:border-brand-accent/20 transition-all">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                           <div className="bg-brand-accent/10 p-3 rounded-xl border border-brand-accent/20">
                             <User className="text-brand-accent" size={20} />
                           </div>
                           <div>
                             <p className="font-display font-bold">{order.customerName || 'Anonymous User'}</p>
                             <p className="font-mono text-[10px] text-brand-text/40">ID: {order.id.toUpperCase()}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest border ${
                             order.status === 'PAID' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 
                             order.status === 'DELIVERED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                             'bg-gray-500/10 text-gray-500 border-gray-500/20'
                           }`}>
                             {order.status}
                           </span>
                           <WhatsAppButton 
                             phone={order.customerPhone || "919000000000"} 
                             message={`Hi ${order.customerName}, I'm processing your order from VyapaarSetu. It's currently ${order.status}.`}
                             className="text-[10px]"
                           />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                         <div className="bg-brand-card p-4 rounded-xl border border-white/5">
                            <p className="font-mono text-[10px] text-brand-text/40 uppercase mb-3">Itemized List</p>
                            <div className="space-y-2">
                               {order.items.filter(i => i.vendorId === user.uid).map((item, idx) => (
                                 <div key={idx} className="flex justify-between text-xs font-mono">
                                   <span className="text-brand-text/80">{item.name} x{item.quantity}</span>
                                   <span className="text-brand-accent">₹{item.price * item.quantity}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                         <div className="flex gap-2">
                            {order.status === 'PAID' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-void py-3 rounded-xl font-display font-black text-[10px] hover:brightness-110 transition-all uppercase"
                              >
                                <CheckCircle size={14} /> MARK DELIVERED
                              </button>
                            )}
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                              className="px-4 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-xl hover:bg-red-500/20 transition-all"
                            >
                              <XCircle size={14} />
                            </button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inventory Map */}
            <div className="bg-brand-card p-8 rounded-3xl border border-brand-text/10">
               <h2 className="font-display text-2xl font-bold mb-8">Node Inventory History</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(product => (
                  <div key={product.id} className="p-5 border border-white/5 rounded-2xl bg-brand-void/50 group hover:border-brand-accent/20 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-display font-bold text-lg">{product.name}</h3>
                      <p className="text-brand-accent font-mono font-bold">₹{product.price}</p>
                    </div>
                    <p className="text-xs text-brand-text/40 line-clamp-2 font-mono mb-4">{product.description || 'No system description provided.'}</p>
                    <div className="flex justify-between items-center text-[10px] font-mono text-brand-text/20 uppercase tracking-widest border-t border-white/5 pt-3">
                       <span>{product.category}</span>
                       <span>{new Date(product.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Product Interface */}
          <div className="space-y-6">
            <div className="bg-brand-card p-8 rounded-3xl border border-brand-accent/20 sticky top-24">
              <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
                <Package className="text-brand-accent" size={24} />
                DEPLOY ASSET
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block font-mono text-[10px] text-brand-text/40 mb-2 uppercase tracking-widest">Asset Identifier</label>
                  <input 
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-brand-void/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent outline-none ring-offset-brand-void transition-all"
                    placeholder="ENTER PRODUCT NAME"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-brand-text/40 mb-2 uppercase tracking-widest">Rate (₹)</label>
                    <input 
                      type="number" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full bg-brand-void/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-brand-text/40 mb-2 uppercase tracking-widest">Class</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-brand-void/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent outline-none appearance-none transition-all"
                    >
                      <option value="grocery">Grocery</option>
                      <option value="bakery">Bakery</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="hardware">Hardware</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest">System Logic Profile</label>
                    <button 
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating || !newProduct.name}
                      className="text-[10px] font-display font-black text-brand-accent flex items-center gap-1 hover:brightness-125 disabled:opacity-30 transition-all uppercase tracking-tighter"
                    >
                      <TrendingUp size={12} /> {isGenerating ? 'COMPUTING...' : 'AI GENERATE'}
                    </button>
                  </div>
                  <textarea 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full bg-brand-void/50 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-brand-accent outline-none h-40 resize-none transition-all"
                    placeholder="INPUT ASSET CHARACTERISTICS..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-brand-accent text-brand-void py-5 rounded-2xl font-display font-black text-xs tracking-[0.2em] hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase"
                >
                  INITIALIZE DEPLOYMENT
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
