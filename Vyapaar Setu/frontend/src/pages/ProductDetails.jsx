import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { CheckCircle, MapPin, ShoppingCart, MessageCircle, CreditCard, Sparkles } from 'lucide-react';
import { db } from '../config/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

import WhatsAppButton from '../components/WhatsAppButton';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleRazorpay = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const options = {
      key: "rzp_test_placeholder",
      amount: product.price * 100,
      currency: "INR",
      name: "VyapaarSetu",
      description: `Purchase: ${product.name}`,
      handler: async function (response) {
        setProcessing(true);
        try {
          await addDoc(collection(db, 'orders'), {
            customerId: user.uid,
            customerName: user.name || user.displayName,
            customerPhone: user.phone || '',
            vendorId: product.vendorId || 'demo_vendor',
            items: [{
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              vendorPhone: product.vendorPhone || ''
            }],
            totalAmount: product.price,
            paymentId: response.razorpay_payment_id,
            status: 'PAID',
            method: 'Razorpay',
            createdAt: new Date().toISOString()
          });
          navigate('/dashboard');
        } catch (error) {
          console.error("Order completion error", error);
        } finally {
          setProcessing(false);
        }
      },
      prefill: {
        name: user.name || user.displayName,
        email: user.email,
        contact: user.phone || ""
      },
      theme: { color: "#10b981" }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handleAddToCart = () => {
    addToCart({ _id: product.id, id: product.id, ...product });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product) return (<div className="min-h-screen bg-brand-void text-brand-accent flex justify-center items-center font-mono animate-pulse">SYNCING NODE DATA...</div>);

  return (
    <div className="min-h-screen bg-brand-void text-brand-text p-6 md:p-12 pt-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Visual Hub */}
        <div className="relative group rounded-[3rem] overflow-hidden bg-brand-card border border-white/5 shadow-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <img src={product.images?.[0]} alt={product.name} className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute top-8 left-8 flex flex-col gap-3">
             <span className="bg-brand-void/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 font-mono text-[10px] uppercase font-black tracking-widest text-brand-accent">
               <Sparkles size={14} /> AI Verified
             </span>
          </div>
        </div>

        {/* Intelligence Hub */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-display text-[10px] font-black tracking-[0.3em] uppercase bg-brand-accent/10 text-brand-accent px-4 py-1.5 rounded-lg border border-brand-accent/20">
              {product.category}
            </span>
            <span className="font-mono text-[10px] text-brand-text/30 flex items-center gap-2 uppercase font-bold italic tracking-wider">
              <MapPin size={12} /> {product.distance || 'Localized Node'}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">{product.name}</h1>
          
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-display text-4xl md:text-5xl font-black text-white">₹{product.price}</span>
            {product.oldPrice && <span className="font-mono text-xl text-brand-text/20 line-through">₹{product.oldPrice}</span>}
          </div>

          <p className="font-mono text-xs md:text-sm text-brand-text/50 leading-relaxed mb-10 max-w-lg">
            {product.description || "Decoded item description missing. Quality verified by local network protocol."}
          </p>

          <div className="p-6 bg-brand-card border border-white/5 rounded-3xl mb-12 flex items-center justify-between group/vendor hover:border-brand-accent/20 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20 group-hover/vendor:bg-brand-accent group-hover/vendor:text-brand-void transition-colors">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg">{product.vendorName || 'Independent Node'}</h4>
                <p className="font-mono text-[10px] text-brand-text/20 uppercase tracking-widest">Verified Merchant</p>
              </div>
            </div>
            <WhatsAppButton 
              phone={product.vendorPhone || "919000000000"} 
              message={`Hello, I want to order ${product.name} (₹${product.price}) from VyapaarSetu.`}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleRazorpay} disabled={processing} className="flex-[2] bg-brand-accent text-brand-void py-5 rounded-2xl font-display font-black text-sm tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
              <CreditCard size={20} strokeWidth={3} /> {processing ? 'PROCESSING...' : 'INITIALIZE PURCHASE'}
            </button>
            <button onClick={handleAddToCart} className={`flex-1 py-5 rounded-2xl font-display font-black text-sm tracking-[0.2em] transition-all border ${addedToCart ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
              {addedToCart ? 'IN HUB' : 'ADD TO HUB'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
