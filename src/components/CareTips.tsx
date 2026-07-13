import React from 'react';
import { Flame, ShieldAlert, Sparkles, Clock } from 'lucide-react';

export default function CareTips() {
  const tips = [
    {
      id: 1,
      icon: <Flame className="w-6 h-6 text-[#c5a880]" />,
      title: 'Trim the Wick First',
      description: 'Always trim your wick to 1/4 inch (6mm) before every single lighting. This ensures a clean, steady, soot-free flame and prevents tunneling.',
    },
    {
      id: 2,
      icon: <Clock className="w-6 h-6 text-[#c5a880]" />,
      title: 'The Golden First Burn',
      description: 'On your first burn, allow the candle to burn for 2-3 hours until the melted wax pool entirely reaches the edge of your luxury glass/ceramic jar.',
    },
    {
      id: 3,
      icon: <ShieldAlert className="w-6 h-6 text-[#c5a880]" />,
      title: 'Burn Period Maximums',
      description: 'Do not burn your scented candles for more than 4 consecutive hours. Allow the container to cool down before relighting.',
    },
    {
      id: 4,
      icon: <Sparkles className="w-6 h-6 text-[#c5a880]" />,
      title: 'Safe Repurposing',
      description: 'Our containers are designed to be reused! When only 1/2 inch of wax remains, clean out the container with warm soapy water to reuse as a makeup brush holder or plant pot.',
    },
  ];

  return (
    <section className="py-24 bg-[#fcfaf6] border-t border-[#c5a880]/20" id="care-tips-section">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs text-[#c5a880] font-mono uppercase tracking-[0.25em] font-semibold block mb-3">Candle Craftsmanship</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-950 mb-5">
            The Burning Ritual: Candle Care Guide
          </h2>
          <div className="h-[1px] w-20 bg-[#c5a880] mx-auto mb-5" />
          <p className="text-stone-600 text-sm sm:text-base font-sans font-light leading-relaxed">
            Ensure your bespoke, handpoured scented candles burn cleanly, safely, and project their beautiful aromas optimally by following our recommended burning rituals.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="p-8 bg-white rounded-xl border border-stone-100 shadow-xs hover:border-[#c5a880]/30 hover:shadow-xl hover:shadow-stone-950/2 transition-all duration-300 text-left"
              id={`care-tip-${tip.id}`}
            >
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 inline-block mb-5">
                {tip.icon}
              </div>
              <h3 className="font-serif font-semibold text-stone-900 text-lg mb-3">
                {tip.title}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footnote / Lagos Pickup Location */}
        <div className="mt-20 bg-[#faf6ee] border border-[#c5a880]/20 rounded-2xl p-8 text-left flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs">
          <div>
            <h4 className="font-serif font-semibold text-stone-900 text-lg flex items-center gap-2">
              <span className="text-[#c5a880]">📍</span> 
              <span>Local Gbagada Workshop Pickup Available</span>
            </h4>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 font-light max-w-2xl">
              Prefer to pick up your candles yourself? Visit our studio in Gbagada, Lagos. Select &quot;Gbagada Office (Free Pickup)&quot; during checkout.
            </p>
          </div>
          <div className="text-[#c5a880] bg-[#120905] px-4 py-2 rounded-lg font-mono text-xs tracking-widest uppercase font-semibold shrink-0">
            MON - SAT: 9:00 AM - 6:00 PM
          </div>
        </div>

      </div>
    </section>
  );
}
