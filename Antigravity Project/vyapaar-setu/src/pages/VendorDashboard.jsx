import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Package, MessageSquare, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import CustomCursor from '../components/CustomCursor';
import gsap from 'gsap';

export default function VendorDashboard() {
  const [productName, setProductName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDescription, setAiDescription] = useState("");

  const handleGenerateDescription = async () => {
    if (!productName) return;
    setIsGenerating(true);
    setAiDescription("");

    try {
      const res = await fetch('http://localhost:8000/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: productName })
      });
      const data = await res.json();
      
      // Simulate typing effect for the AI generation
      let i = 0;
      const text = data.draft_description;
      const timer = setInterval(() => {
        setAiDescription(prev => prev + text.charAt(i));
        i++;
        if (i >= text.length) clearInterval(timer);
      }, 30);
      
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-vs-dark pb-20 font-body text-vs-text">
      <CustomCursor />
      
      {/* Header */}
      <header className="bg-vs-card/80 backdrop-blur-xl border-b border-vs-text/5 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-vs-text/50 hover:text-vs-green transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="font-heading font-bold text-xl tracking-wide">
              Vyapaar<span className="text-vs-orange">Vendor</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-growth-gradient flex items-center justify-center text-vs-dark font-bold font-heading">
              C
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Upload & AI Generataion */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-vs-card rounded-2xl p-6 border border-vs-text/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-growth-gradient opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none" />
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-vs-orange" /> Add New Product
            </h2>
            
            <div className="flex flex-col gap-6">
              
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-vs-dark border border-dashed border-vs-text/20 rounded-xl flex flex-col items-center justify-center text-vs-text/40 hover:text-vs-green hover:border-vs-green transition-colors cursor-pointer shrink-0">
                  <ImageIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">Upload Image</span>
                </div>
                
                <div className="flex-1 flex flex-col gap-4">
                  <input 
                    type="text" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product Name (e.g., Sourdough Bread)" 
                    className="w-full bg-vs-dark border border-vs-text/10 rounded-xl px-4 py-3 font-body focus:border-vs-green transition-colors"
                  />
                  <div className="flex gap-2">
                    <input type="text" placeholder="Price (₹)" className="w-1/3 bg-vs-dark border border-vs-text/10 rounded-xl px-4 py-3 font-body focus:border-vs-green transition-colors" />
                    <input type="text" placeholder="Category" className="flex-1 bg-vs-dark border border-vs-text/10 rounded-xl px-4 py-3 font-body focus:border-vs-green transition-colors" />
                  </div>
                </div>
              </div>

              {/* AI Description Generator */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-vs-text/70">Product Description</label>
                  <button 
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || !productName}
                    className="flex items-center gap-1.5 text-xs font-heading font-bold text-vs-dark bg-growth-gradient px-3 py-1.5 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGenerating ? "Generating..." : "Magic Write with AI"}
                  </button>
                </div>
                <textarea 
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  className="w-full bg-vs-dark border border-vs-text/10 rounded-xl px-4 py-3 font-body focus:border-vs-green transition-colors min-h-[120px] placeholder:text-vs-text/20"
                  placeholder="Describe your product... or use AI to generate a professional description."
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-vs-text/5">
                <button className="bg-vs-orange text-vs-dark font-heading font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
                  Publish to Local Store
                </button>
              </div>

            </div>
          </div>

          {/* Review Sentiment Analysis */}
          <div className="bg-vs-card rounded-2xl p-6 border border-vs-text/5">
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-vs-green" /> AI Review Analyzer
            </h2>
            <p className="text-sm text-vs-text/50 mb-6">Our NLP model categorizes incoming feedback so you know exactly what your community loves.</p>
            
            <div className="space-y-4">
              {[
                { r: "The bread is extremely fresh and delivered fast!", s: "Positive", color: "text-vs-green border-vs-green/30 bg-vs-green/10" },
                { r: "Price is a bit high, but taste is okay.", s: "Neutral", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
                { r: "Order was delayed by an hour today.", s: "Negative", color: "text-red-400 border-red-400/30 bg-red-400/10" }
              ].map((rev, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-vs-text/5 bg-vs-dark/50">
                  <div className={`text-xs font-mono font-bold px-2 py-1 rounded border ${rev.color}`}>
                    {rev.s}
                  </div>
                  <p className="text-sm text-vs-text/80">{rev.r}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: ML Analytics */}
        <div className="space-y-8">
          <div className="bg-vs-card rounded-2xl p-6 border border-vs-green/20 relative shadow-[0_0_30px_rgba(59,234,122,0.05)]">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <TrendingUp className="w-24 h-24 text-vs-green" />
            </div>
            
            <div className="flex items-center gap-2 text-vs-green font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> ML Sales Prediction
            </div>
            <h3 className="text-4xl font-heading font-bold mb-1">₹42,500</h3>
            <p className="text-sm text-vs-text/60 mb-8">Expected revenue this week (+15% vs last)</p>

            <div className="space-y-4 relative z-10">
              <h4 className="text-sm font-heading font-medium text-vs-text/80">Trending in your neighborhood</h4>
              <div className="flex items-center justify-between p-3 rounded-lg bg-vs-dark border border-vs-text/5">
                <span className="text-sm font-medium">Sourdough Loaf</span>
                <span className="text-xs font-mono text-vs-green">High Demand</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-vs-dark border border-vs-text/5">
                <span className="text-sm font-medium">Croissants</span>
                <span className="text-xs font-mono text-vs-orange">Rising</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
