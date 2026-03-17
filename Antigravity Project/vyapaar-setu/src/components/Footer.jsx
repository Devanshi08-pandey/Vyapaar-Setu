export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black pt-20 pb-8 px-6 md:px-16 rounded-t-[3.5rem] mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 mb-20">
        
        {/* Brand Column */}
        <div className="flex flex-col md:w-1/3">
          <div className="font-heading font-bold text-3xl text-vs-text tracking-wide mb-4">
            Vyapaar<span className="text-vs-green">Setu</span>
          </div>
          <p className="text-vs-text/50 font-body text-sm max-w-sm mb-8 leading-relaxed">
            Connecting Local Businesses to the Digital Economy. The smartest way to discover, order, and grow in your neighborhood.
          </p>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-vs-dark rounded-full w-fit border border-vs-text/5">
            <div className="w-2 h-2 rounded-full bg-vs-green animate-pulse shadow-[0_0_8px_rgba(59,234,122,0.8)]" />
            <span className="font-mono text-xs text-vs-green uppercase tracking-widest">System Operational</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="flex gap-16 md:gap-24">
          <div className="flex flex-col gap-4 text-sm font-body">
            <h4 className="font-heading font-semibold text-vs-text mb-2">Marketplace</h4>
            <a href="#" className="text-vs-text/50 hover:text-vs-green transition-colors">Discover Shops</a>
            <a href="#" className="text-vs-text/50 hover:text-vs-green transition-colors">Local Services</a>
            <a href="#" className="text-vs-text/50 hover:text-vs-green transition-colors">Daily Routines</a>
            <a href="#" className="text-vs-text/50 hover:text-vs-green transition-colors">Help Center</a>
          </div>

          <div className="flex flex-col gap-4 text-sm font-body">
            <h4 className="font-heading font-semibold text-vs-text mb-2">Vendors</h4>
            <a href="#" className="text-vs-text/50 hover:text-vs-green transition-colors">Open Storefront</a>
            <a href="#" className="text-vs-text/50 hover:text-vs-green transition-colors">Pricing & UPI</a>
            <a href="#" className="text-vs-text/50 hover:text-vs-green transition-colors">Analytics Guide</a>
            <a href="#" className="text-vs-text/50 hover:text-vs-green transition-colors">Partner API</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-vs-text/10 text-xs text-vs-text/40 font-mono">
        <p>&copy; {currentYear} VyapaarSetu Hub Inc. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-vs-text transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-vs-text transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-vs-text transition-colors">Vendor Agreement</a>
        </div>
      </div>
    </footer>
  );
}
