import { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export default function AiSupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the VyapaarSetu AI Assistant. How can I help you support native vendors today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const currentInput = input;
    setInput('');

    // Simulate AI typing delay
    setTimeout(() => {
      let botReply = '';
      const q = currentInput.toLowerCase();
      if (q.includes('payment') || q.includes('upi')) {
        botReply = 'All transactions on VyapaarSetu use standard zero-fee UPI logic directly to the vendor\'s bank account. We do not hold your money.';
      } else if (q.includes('vendor') || q.includes('local')) {
        botReply = 'You can explore local vendors in the `/explore` tab. They are ranked by an ML algorithm favoring proximity, response time, and local community ratings.';
      } else {
        botReply = 'I am currently running in prototype mode! I can answer basic FAQs about payments and vendors using Retrieval-Augmented Generation (RAG).';
      }
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center font-bold text-vs-dark shadow-[0_0_20px_rgba(59,234,122,0.4)] hover:scale-110 transition-transform z-50 ${isOpen ? 'bg-vs-orange' : 'bg-growth-gradient'}`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] bg-vs-card border border-vs-text/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col font-body">
          
          {/* Header */}
          <div className="bg-vs-dark p-4 border-b border-vs-text/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-vs-green/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-vs-green" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm">VyapaarSupport AI</h3>
              <p className="text-xs text-vs-text/50">Online & ready</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[300px] overflow-y-auto p-4 flex flex-col gap-3 bg-vs-dark/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-vs-green/10 border border-vs-green/30 text-white rounded-tr-sm' : 'bg-vs-card border border-vs-text/5 text-vs-text/80 rounded-tl-sm'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-vs-text/5 bg-vs-card flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-vs-dark border border-vs-text/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-vs-green transition-colors"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-vs-green flex items-center justify-center text-vs-dark hover:opacity-90"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          
        </div>
      )}
    </>
  );
}
