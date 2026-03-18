import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Check, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

import { initializePayment } from '../utils/payment';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleRazorpay = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProcessing(true);

    const options = {
      key: "rzp_test_placeholder", // Replace with real key in prod
      amount: cartTotal * 100,
      currency: "INR",
      name: "VyapaarSetu",
      description: `Cart Checkout - ${cartCount} items`,
      handler: async function (response) {
        try {
          const vendorIds = [...new Set(cart.map(item => item.vendorId).filter(id => id))];
          const orderData = {
            customerId: user.uid,
            customerName: user.name || user.displayName,
            customerEmail: user.email,
            vendorIds: vendorIds, // Enable efficient multi-vendor querying
            items: cart.map(item => ({
              productId: item._id || item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              vendorId: item.vendorId || '',
            })),
            totalAmount: cartTotal,
            paymentId: response.razorpay_payment_id,
            status: 'PAID',
            method: 'Razorpay',
            createdAt: new Date().toISOString(),
          };
          await addDoc(collection(db, 'orders'), orderData);
          clearCart();
          setOrderPlaced(true);
        } catch (err) {
          console.error('Order failed:', err);
          alert('Order generation failed. Please contact support.');
        } finally {
          setProcessing(false);
        }
      },
      modal: {
        ondismiss: function() {
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

    await initializePayment(options);
  };

  if (orderPlaced) {
    return (
      <>
        <div className="min-h-screen bg-brand-void text-brand-text flex items-center justify-center p-6 pt-20">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-brand-accent" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-3">Order Confirmed!</h1>
            <p className="font-mono text-brand-text/60 mb-8">Your payment was successful. Vendors have been notified.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/marketplace" className="bg-brand-accent text-brand-void px-6 py-3 rounded-full font-display font-semibold text-sm hover:scale-105 transition-transform">
                CONTINUE SHOPPING
              </Link>
              <Link to="/dashboard" className="bg-brand-card border border-brand-text/10 text-brand-text px-6 py-3 rounded-full font-display font-semibold text-sm hover:scale-105 transition-transform">
                VIEW ORDERS
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-brand-void text-brand-text p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
              <ShoppingBag className="inline-block mr-3 text-brand-accent" size={36} />
              Cart <span className="font-mono text-lg text-brand-text/40">({cartCount})</span>
            </h1>
          </div>
          <Link to="/marketplace" className="flex items-center gap-2 text-brand-text/60 hover:text-brand-accent font-mono text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Marketplace
          </Link>
        </header>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="text-brand-text/20 mx-auto mb-6" />
            <p className="font-mono text-brand-text/50 mb-6">Your cart is empty.</p>
            <Link to="/marketplace" className="bg-brand-accent text-brand-void px-6 py-3 rounded-full font-display font-semibold text-sm hover:scale-105 transition-transform">
              BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map(item => (
                <div key={item._id} className="bg-brand-card rounded-2xl border border-brand-text/10 p-5 flex gap-5 items-center">
                  <div className="w-20 h-20 rounded-xl bg-brand-void/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.images?.[0] ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : <ShoppingBag size={24} className="text-brand-text/20" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg truncate">{item.name}</h3>
                    <p className="font-mono text-brand-accent font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-brand-void border border-brand-text/10 flex items-center justify-center hover:border-brand-accent transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="font-mono text-lg w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-brand-void border border-brand-text/10 flex items-center justify-center hover:border-brand-accent transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="font-mono font-bold text-brand-text min-w-[70px] text-right">
                    ₹{item.price * item.quantity}
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-400/60 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-brand-card rounded-2xl border border-brand-accent/20 p-6 sticky top-24 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
                <h2 className="font-display font-bold text-xl mb-6">Order Summary</h2>
                <div className="flex flex-col gap-3 font-mono text-sm mb-6">
                  <div className="flex justify-between text-brand-text/60">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-brand-text/60">
                    <span>Delivery</span>
                    <span className="text-brand-accent">FREE</span>
                  </div>
                  <div className="border-t border-brand-text/10 pt-3 flex justify-between font-bold text-lg text-brand-text">
                    <span>Total</span>
                    <span className="text-brand-accent">₹{cartTotal}</span>
                  </div>
                </div>

                <button onClick={handleRazorpay} disabled={processing}
                  className="w-full bg-brand-accent text-brand-void py-4 rounded-xl font-display font-black text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center justify-center gap-3">
                  <CreditCard size={18} />
                  {processing ? 'PROCESSING...' : `SECURE CHECKOUT (₹${cartTotal})`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Cart;
