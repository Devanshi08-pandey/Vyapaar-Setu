export default function SocialProof() {
  const partners = [
    "Vyaapar", "PhonePe", "Google Pay", "Paytm", "BHIM UPI", "Razorpay",
    "Open Network for Digital Commerce", "Local Chamber of Commerce"
  ];
  const stats = [
    "10,000+ Local Vendors Onboarded", 
    "₹50Cr+ Monthly Neighborhood Transactions", 
    "4.9★ Vendor Satisfaction",
    "0% Commission on UPI Payments"
  ];

  return (
    <section className="relative w-full py-16 bg-vs-card overflow-hidden border-t border-b border-vs-green/10">
      {/* Edge Gradients */}
      <div 
        className="absolute inset-y-0 left-0 w-32 md:w-64 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #121815, transparent)' }}
      />
      <div 
        className="absolute inset-y-0 right-0 w-32 md:w-64 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #121815, transparent)' }}
      />

      <div className="flex flex-col gap-10">
        {/* Top Row: Logos/Partners */}
        <div className="flex whitespace-nowrap opacity-60">
          <div className="animate-[scroll_35s_linear_infinite] flex items-center min-w-full">
            {[...partners, ...partners].map((partner, i) => (
              <div 
                key={`p-${i}`} 
                className="mx-10 md:mx-16 font-heading text-xl md:text-2xl font-bold tracking-tight text-vs-text/50 uppercase"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Stats */}
        <div className="flex whitespace-nowrap opacity-80">
          <div className="animate-[scroll_40s_linear_infinite_reverse] flex items-center min-w-full">
            {[...stats, ...stats].map((stat, i) => (
              <div 
                key={`s-${i}`} 
                className="mx-8 md:mx-12 font-mono text-sm md:text-base text-vs-green flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-vs-orange animate-pulse" />
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
