import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Send, Bot, User, Sparkles, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';


const AI_RESPONSES = {
  cake: {
    suggestions: ['Custom Photo Cake (₹800)', 'Designer Theme Cake (₹1200)', 'Tier Wedding Cake (₹2500)'],
    description: 'A beautiful handcrafted cake with premium ingredients, customized with your choice of flavors, decorations, and personal messages.',
    vendors: ['Royal Bakery (0.5km)', 'Sweet Delights (1.2km)', 'Cake Factory (2km)'],
  },
  clothing: {
    suggestions: ['Custom Kurta Set (₹1500)', 'Designer Saree Blouse (₹800)', 'Tailored Suit (₹3000)'],
    description: 'Handcrafted clothing tailored to your exact measurements and style preferences, using premium fabrics.',
    vendors: ['Meena Tailoring (0.8km)', 'Fashion Hub (1.5km)', 'Elite Stitchers (2.5km)'],
  },
  furniture: {
    suggestions: ['Custom Bookshelf (₹3500)', 'Study Table (₹5000)', 'Wardrobe (₹8000)'],
    description: 'Handmade furniture crafted from quality wood, designed to fit your space and aesthetic preferences perfectly.',
    vendors: ['Sharma Furniture (1km)', 'WoodCraft Studio (2km)', 'Modern Interiors (3km)'],
  },
  default: {
    suggestions: ['Custom Product A (₹500)', 'Custom Product B (₹1000)', 'Premium Custom (₹2000)'],
    description: 'A custom-made product crafted to your exact specifications by local skilled vendors.',
    vendors: ['Local Vendor 1 (0.5km)', 'Local Vendor 2 (1km)', 'Local Vendor 3 (2km)'],
  },
};

const getAIResponse = (input) => {
  const lower = input.toLowerCase();
  if (lower.includes('cake') || lower.includes('birthday') || lower.includes('bakery')) return AI_RESPONSES.cake;
  if (lower.includes('cloth') || lower.includes('dress') || lower.includes('shirt') || lower.includes('kurta') || lower.includes('tailor')) return AI_RESPONSES.clothing;
  if (lower.includes('furniture') || lower.includes('table') || lower.includes('chair') || lower.includes('shelf')) return AI_RESPONSES.furniture;
  return AI_RESPONSES.default;
};

const AICustomize = () => {
  const { user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I\'m VyapaarSetu AI. Tell me what custom product or service you need, and I\'ll find the best local vendors for you. 🎯', type: 'text' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMsg, type: 'text' }]);

    // Simulate AI typing
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = getAIResponse(userMsg);

    // Add AI suggestion response
    setMessages(prev => [
      ...prev,
      { role: 'bot', text: `Based on "${userMsg}", here are my suggestions:`, type: 'text' },
      { role: 'bot', text: response.suggestions, type: 'suggestions' },
      { role: 'bot', text: `📝 **AI Description:** ${response.description}`, type: 'text' },
      { role: 'bot', text: response.vendors, type: 'vendors' },
      { role: 'bot', text: 'Would you like to place a custom order with any of these vendors? Just tell me which one! 😊', type: 'text' },
    ]);
    setIsTyping(false);

    // Save to Firestore
    if (user) {
      try {
        await addDoc(collection(db, 'custom-orders'), {
          customerId: user.uid,
          requirements: userMsg,
          aiSuggestions: response.suggestions,
          status: 'inquiry',
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not save custom order:', err.message);
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-brand-void text-brand-text flex flex-col pt-20">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-text/10 flex items-center justify-between max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-emerald-700 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">AI Customization</h1>
              <p className="font-mono text-[10px] text-brand-accent">POWERED BY VYAPAARSETU AI</p>
            </div>
          </div>
          <Link to="/marketplace" className="flex items-center gap-2 text-brand-text/60 hover:text-brand-accent font-mono text-xs transition-colors">
            <ArrowLeft size={14} /> Marketplace
          </Link>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 max-w-5xl mx-auto w-full">
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} className="text-brand-accent" />
                  </div>
                )}
                <div className={`max-w-[70%] ${msg.role === 'user' ? 'bg-brand-accent text-brand-void' : 'bg-brand-card border border-brand-text/10'} rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                  {msg.type === 'text' && <p className="font-sans text-sm">{msg.text}</p>}
                  {msg.type === 'suggestions' && (
                    <div className="flex flex-col gap-2">
                      <p className="font-mono text-xs text-brand-text/40 mb-1">💡 PRODUCT SUGGESTIONS</p>
                      {msg.text.map((s, j) => (
                        <div key={j} className="flex items-center gap-2 bg-brand-void/50 px-3 py-2 rounded-lg border border-brand-accent/10">
                          <Package size={14} className="text-brand-accent" />
                          <span className="font-mono text-sm">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.type === 'vendors' && (
                    <div className="flex flex-col gap-2">
                      <p className="font-mono text-xs text-brand-text/40 mb-1">📍 RECOMMENDED VENDORS</p>
                      {msg.text.map((v, j) => (
                        <div key={j} className="flex items-center gap-2 bg-brand-void/50 px-3 py-2 rounded-lg border border-brand-accent/10">
                          <span className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center font-mono text-[10px] text-brand-accent font-bold">{j + 1}</span>
                          <span className="font-mono text-sm">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-brand-text/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={16} className="text-brand-text/60" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-brand-accent" />
                </div>
                <div className="bg-brand-card border border-brand-text/10 rounded-2xl rounded-bl-md px-5 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-brand-text/10 px-6 py-4 bg-brand-card/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="e.g., I need a birthday cake with custom design..."
              className="flex-1 bg-brand-void border border-brand-text/10 text-brand-text px-5 py-3 rounded-full font-sans focus:outline-none focus:border-brand-accent transition-colors"
            />
            <button onClick={handleSend} disabled={!input.trim() || isTyping}
              className="bg-brand-accent text-brand-void w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
          <div className="max-w-5xl mx-auto mt-3 flex flex-wrap gap-2">
            {['Birthday cake with name', 'Custom kurta set', 'Wooden bookshelf'].map(suggestion => (
              <button key={suggestion} onClick={() => { setInput(suggestion); }}
                className="px-3 py-1.5 rounded-full border border-brand-text/10 font-mono text-[10px] text-brand-text/50 hover:border-brand-accent/50 hover:text-brand-accent transition-colors">
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AICustomize;
