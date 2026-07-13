import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Flame, Droplet } from 'lucide-react';

interface HeroProps {
  onStartCreating: () => void;
  onBrowseCollection: () => void;
}

export default function Hero({ onStartCreating, onBrowseCollection }: HeroProps) {
  return (
    <div className="relative min-h-[92vh] flex items-center justify-center bg-[#120905] text-[#fcfaf6] overflow-hidden py-16 md:py-24" id="hero-section">
      {/* Background elegant lighting overlay */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_120%] from-[#23150d]/60 via-[#120905] to-[#0c0503]" />

      {/* Floating sand-gold glow fields */}
      <div className="absolute top-1/4 left-1/10 w-[450px] h-[450px] bg-[#c5a880]/5 rounded-full filter blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-[#c5a880]/4 rounded-full filter blur-[120px] animate-pulse delay-2000" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10 w-full">
        {/* Text Content */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] text-[11px] font-mono uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handpoured in Gbagada, Lagos</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#fcfaf6] leading-[1.1] tracking-tight font-light"
            >
              Wrap Your Space in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fefdfa] via-[#e2cbb1] to-[#c5a880] font-normal italic pr-2">
                Warm Luxury &amp; Glow
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[#e8e4dc]/85 text-base sm:text-lg max-w-xl font-sans font-light leading-relaxed"
            >
              Experience the soothing crackle and beautiful warmth of premium, hand-poured candles. Made cleanly using 100% organic soy and coconut wax, infused with rich, slow-releasing Lagos-inspired aromas designed for absolute relaxation.
            </motion.p>
          </div>

          {/* Core Brand Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="grid grid-cols-2 gap-6 w-full max-w-md pt-2 border-t border-[#fcfaf6]/10"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-[#1c110a] border border-[#c5a880]/20 text-[#c5a880]">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-[#c5a880] font-mono tracking-widest uppercase">SOOT-FREE</p>
                <p className="text-sm font-medium text-[#fcfaf6]">100% Organic Wax</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-[#1c110a] border border-[#c5a880]/20 text-[#c5a880]">
                <Droplet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-[#c5a880] font-mono tracking-widest uppercase">SENSORY DRAFT</p>
                <p className="text-sm font-medium text-[#fcfaf6]">Therapeutic Oils</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
          >
            <button
              onClick={onStartCreating}
              className="px-8 py-4 bg-[#c5a880] hover:bg-[#b0936b] text-[#120905] font-semibold rounded-lg shadow-xl shadow-[#120905]/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-xs font-mono uppercase tracking-widest"
              id="hero-create-btn"
            >
              <span>Design Bespoke Candle</span>
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={onBrowseCollection}
              className="px-8 py-4 bg-[#1c110a]/40 hover:bg-[#1c110a] border border-[#c5a880]/30 hover:border-[#c5a880]/60 text-[#fcfaf6] font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2.5 text-xs font-mono uppercase tracking-widest"
              id="hero-browse-btn"
            >
              <span>Browse Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Feature Aesthetic Card / Image Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-2xl overflow-hidden border border-[#c5a880]/20 shadow-2xl bg-[#0c0503] p-1 group">
            {/* Ambient gold ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#c5a880]/15 via-transparent to-[#c5a880]/25 opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Featured Image */}
            <img 
              src="/src/assets/images/amber_candle_lumina_1783901509982.jpg" 
              alt="Premium Scented Candle" 
              className="w-full h-full object-cover rounded-xl transition-all duration-1000 transform group-hover:scale-103"
              referrerPolicy="no-referrer"
            />

            {/* Luxury Product Label Overlay */}
            <div className="absolute inset-x-0 bottom-[32%] flex justify-center z-10 pointer-events-none">
              <div className="w-[140px] bg-[#fbfaf5] text-stone-900 border border-stone-300 shadow-xl p-3.5 rounded-xs flex flex-col items-center justify-center text-center">
                <span className="text-[8px] tracking-[0.25em] font-sans font-bold text-stone-500 uppercase block mb-0.5">
                  L U M I N A
                </span>
                <div className="w-8 h-[1px] bg-stone-300 mb-1" />
                <h4 className="font-serif font-semibold text-[10px] text-stone-900 uppercase tracking-wide leading-tight px-1">
                  Eko Sunset
                </h4>
                <div className="h-[1px] w-4 bg-[#c5a880]/40 my-0.5" />
                <span className="text-[5.5px] text-stone-400 font-mono tracking-widest uppercase block">
                  Handpoured in Lagos
                </span>
                <span className="text-[5px] text-stone-500 font-mono tracking-wider block mt-0.5">
                  8oz Soy Blend
                </span>
              </div>
            </div>

            {/* Glowing flame graphic overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[22%] w-10 h-10 flex items-center justify-center">
              <div className="absolute w-4 h-8 bg-gradient-to-t from-orange-600 via-amber-400 to-[#c5a880] rounded-full blur-xs opacity-90 animate-pulse" />
              <div className="absolute w-6 h-6 bg-[#c5a880]/20 rounded-full blur-md animate-ping" />
            </div>

            {/* Floating banner label */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#0c0503]/90 backdrop-blur-md border border-[#c5a880]/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#c5a880] font-mono font-medium tracking-widest uppercase">PREMIUM PICKS</p>
                <h4 className="text-base font-serif font-medium text-[#fcfaf6]">The Signature Eko Sunset</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block line-through">₦13,000</span>
                <span className="text-sm font-semibold text-[#c5a880]">₦11,000</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
