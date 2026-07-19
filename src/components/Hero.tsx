import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Heart, Wind } from 'lucide-react';

interface HeroProps {
  onStartCreating: () => void;
  onBrowseCollection: () => void;
}

export default function Hero({ onStartCreating, onBrowseCollection }: HeroProps) {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-[#120905] text-[#fcfaf6] overflow-hidden py-20 md:py-28 border-b border-[#c5a880]/10" id="hero-section">
      {/* Soft natural ambient lighting mimicking distant candlelight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#281810,rgba(18,9,5,0.95),#0c0503)]" />

      {/* Very subtle organic heat glow */}
      <div className="absolute top-1/3 left-1/12 w-[500px] h-[500px] bg-[#c5a880]/3 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/12 w-[400px] h-[400px] bg-[#c5a880]/3 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center z-10 w-full">
        {/* Text Content */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-8 text-left">
          
          {/* Humble Workshop Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2.5 text-[10px] font-mono tracking-[0.3em] uppercase text-[#c5a880] border-b border-[#c5a880]/20 pb-1.5"
          >
            <Compass className="w-3.5 h-3.5 stroke-[1.5px] animate-spin-slow" />
            <span>GBAGADA STUDIOS • LAGOS, NIGERIA</span>
          </motion.div>

          {/* Premium Editorial Typography */}
          <div className="space-y-5">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#fcfaf6] leading-[1.15] tracking-tight font-light"
            >
              Slow-burning warmth, <br />
              <span className="font-normal italic text-[#e2cbb1] font-serif">
                poured by hand.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#e8e4dc]/80 text-sm sm:text-base md:text-lg max-w-xl font-sans font-light leading-relaxed"
            >
              Artisanal scented candles crafted in small, thoughtful batches. Grounded in Lagos, we blend pure soy and coconut wax with therapeutic-grade botanical oils to invite calm, soot-free, and slow-releasing fragrance into your physical spaces.
            </motion.p>
          </div>

          {/* Minimalist Organic Features */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-8 w-full max-w-lg pt-6 border-t border-[#fcfaf6]/10"
          >
            <div className="flex items-start gap-3">
              <div className="p-1 text-[#c5a880]">
                <Heart className="w-4.5 h-4.5 stroke-[1.5px]" />
              </div>
              <div className="text-left">
                <h4 className="text-[11px] text-[#fcfaf6] font-mono tracking-widest uppercase font-semibold">100% CLEAN WAX</h4>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed font-light">Natural soy &amp; coconut blend. Zero paraffin, toxins, or heavy soot.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 text-[#c5a880]">
                <Wind className="w-4.5 h-4.5 stroke-[1.5px]" />
              </div>
              <div className="text-left">
                <h4 className="text-[11px] text-[#fcfaf6] font-mono tracking-widest uppercase font-semibold">THERAPEUTIC SCENTS</h4>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed font-light">Rich botanical aroma formulation curated for sensory restoration.</p>
              </div>
            </div>
          </motion.div>

          {/* Premium Call to Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
          >
            <button
              onClick={onStartCreating}
              className="px-8 py-4 bg-[#c5a880] hover:bg-[#b0936b] text-[#120905] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-xs font-mono uppercase tracking-widest cursor-pointer"
              id="hero-create-btn"
            >
              <span>Design Custom Recipe</span>
              <ArrowRight className="w-4 h-4 stroke-[2px]" />
            </button>

            <button
              onClick={onBrowseCollection}
              className="px-8 py-4 bg-[#1c110a]/60 hover:bg-[#1c110a] border border-[#c5a880]/30 hover:border-[#c5a880]/60 text-[#fcfaf6] font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2.5 text-xs font-mono uppercase tracking-widest cursor-pointer"
              id="hero-browse-btn"
            >
              <span>Explore Collection</span>
            </button>
          </motion.div>
        </div>

        {/* Museum-Framed Real Portrait Image Area */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col items-center justify-center"
        >
          {/* Portrait Gallery Frame */}
          <div className="w-full max-w-[350px] sm:max-w-[390px] flex flex-col items-stretch" id="hero-portrait-frame">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#c5a880]/15 bg-[#170e0a] p-[6px] shadow-2xl group">
              {/* Natural subtle warm tone overlay */}
              <div className="absolute inset-0 bg-[#c5a880]/3 mix-blend-color-burn z-10 pointer-events-none" />
              
              {/* Beautiful local candle image */}
              <img 
                src="/src/assets/images/amber_candle_lumina_1783901509982.jpg" 
                alt="Lumina Lagos handcrafted candle vessel" 
                className="w-full h-full object-cover rounded-md grayscale-[10%] contrast-[105%] brightness-[92%] transition-transform duration-1000 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Gallery Spec Card / Caption underneath instead of overlapping the photo */}
            <div className="mt-4 px-4 py-3 bg-[#1c110a]/40 border border-[#c5a880]/10 rounded-lg flex items-center justify-between text-left">
              <div>
                <span className="text-[9px] text-[#c5a880] font-mono tracking-[0.2em] uppercase block">FEATURED VESSEL</span>
                <h4 className="text-sm font-serif font-light text-[#fcfaf6] mt-0.5">The Signature Eko Sunset</h4>
                <p className="text-[10px] text-stone-400 mt-0.5 font-light font-sans">Warm amber glass, hand-stamped label</p>
              </div>
              <div className="text-right border-l border-[#c5a880]/10 pl-4 shrink-0">
                <span className="text-[10px] text-stone-500 block line-through">₦13,000</span>
                <span className="text-xs font-mono font-medium text-[#c5a880]">₦11,000</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
