import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Star } from 'lucide-react';

export default function BrandStory() {
  const [imgSrc, setImgSrc] = React.useState('/src/assets/images/founder_potrait.jpg');

  return (
    <section className="py-28 bg-[#120905] text-[#fcfaf6] relative overflow-hidden" id="brand-story-section">
      {/* Premium Background gradients mimicking low, warm candlelight glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-950/20 rounded-full filter blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-900/10 rounded-full filter blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Soft elegant horizontal separator lines */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-stone-800/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-stone-800/40 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual Side: Gallery Portrait Framing */}
          <div className="lg:col-span-5 flex flex-col items-center order-last lg:order-first">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              {/* Luxury Double Pinstripe Border Frame */}
              <div className="absolute -inset-3 border border-[#c5a880]/15 rounded-2xl pointer-events-none z-0" />
              <div className="absolute -inset-1.5 border border-[#c5a880]/30 rounded-xl pointer-events-none z-0" />
              
              {/* Corner accent ornaments */}
              <div className="absolute -top-3 -left-3 w-3 h-3 border-t-2 border-l-2 border-[#c5a880] rounded-tl" />
              <div className="absolute -top-3 -right-3 w-3 h-3 border-t-2 border-r-2 border-[#c5a880] rounded-tr" />
              <div className="absolute -bottom-3 -left-3 w-3 h-3 border-b-2 border-l-2 border-[#c5a880] rounded-bl" />
              <div className="absolute -bottom-3 -right-3 w-3 h-3 border-b-2 border-r-2 border-[#c5a880] rounded-br" />

              {/* Main Image Mask */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-[#c5a880]/40 shadow-2xl bg-stone-950 group z-10">
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent z-10 mix-blend-multiply" />
                <img 
                  src={imgSrc} 
                  alt="Tolulope Ige - Founder of Lumina Lagos" 
                  className="w-full h-full object-cover rounded-md opacity-95 group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (imgSrc !== '/src/assets/images/founder_portrait_1783899668220.jpg') {
                      setImgSrc('/src/assets/images/founder_portrait_1783899668220.jpg');
                    }
                  }}
                />
                
                {/* Micro Established Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[8px] font-mono tracking-[0.25em] text-[#c5a880] bg-stone-950/90 backdrop-blur-md px-3 py-1.5 rounded-sm border border-[#c5a880]/30 uppercase">
                    EST. 2019
                  </span>
                </div>
              </div>

              {/* Elegant Portrait Caption Below (Fully unobstructed face) */}
              <div className="mt-6 text-center z-10 relative">
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#c5a880] uppercase block mb-1">
                  Founder &amp; Chief Perfumer
                </span>
                <h4 className="font-serif text-lg text-white font-medium tracking-wide">
                  Tolulope Ige
                </h4>
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <span className="h-[1px] w-4 bg-stone-800" />
                  <p className="text-[10px] text-stone-400 font-mono tracking-widest uppercase">
                    Lumina Lagos HQ
                  </p>
                  <span className="h-[1px] w-4 bg-stone-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Story Side */}
          <div className="lg:col-span-7 text-left flex flex-col justify-center space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/20 text-[#c5a880] text-[10px] font-mono uppercase tracking-[0.25em] self-start">
              <Sparkles className="w-3 h-3 text-[#c5a880] animate-pulse" />
              <span>THE BRAND MANIFESTO</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight text-white leading-[1.15]">
                Designing the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5e3cc] via-[#c5a880] to-[#f5e3cc] font-normal italic">
                  Invisible Architecture
                </span>{" "}
                of Space
              </h2>
              
              {/* Custom refined divider */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-[1px] w-12 bg-[#c5a880]/30" />
                <div className="w-1.5 h-1.5 rotate-45 bg-[#c5a880] opacity-70" />
                <div className="h-[1px] w-20 bg-[#c5a880]/30" />
              </div>
            </div>

            {/* Narratives */}
            <div className="space-y-5 font-sans text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                Every candle is a story waiting to unfold—a quiet, comforting hum of warmth in a sensory world. Founded in <strong className="text-[#c5a880] font-normal font-mono">2019</strong> by <strong className="text-white font-normal">Tolulope Ige</strong>, Lumina Lagos was born from a singular, heartfelt desire: to ensure that every home feels like a true sanctuary.
              </p>
              <p>
                Tolulope believed that a beautiful, aromatic space has the profound power to shift a room&apos;s energy and lift your spirit. Scents are not mere background decorations; they are the <strong className="text-stone-100 font-normal italic">invisible design of our lives</strong>—quietly comforting us through long days, soothing restless minds, and turning simple, routine moments into beautiful, celebratory rituals.
              </p>
              <p>
                What began as a passionate artisanal pursuit in Lagos has blossomed into a signature luxury brand. From our dedicated studio, we hand-blend pure, clean-burning soy and coconut wax with therapeutic botanical oils. When you ignite a Lumina candle, you are not simply lighting a wick—you are illuminating a vision of cozy luxury and absolute peace.
              </p>
            </div>

            {/* Elegant Callout Founder's Note Box */}
            <div className="relative p-6 rounded-xl bg-stone-950/50 border border-[#c5a880]/15 backdrop-blur-md">
              <div className="absolute -top-3 left-6 px-3 bg-[#120905] text-[#c5a880] font-serif italic text-xs tracking-wide">
                A Founder&apos;s Note
              </div>
              <p className="font-serif italic text-stone-200 text-sm sm:text-base leading-relaxed">
                &ldquo;A beautiful space is an invisible hug. It starts with a simple flicker of a flame and ends with a lasting, beautiful feeling.&rdquo;
              </p>
              <div className="mt-3.5 pt-3 border-t border-stone-900/60 flex items-center justify-between text-[11px]">
                <span className="font-sans font-medium text-stone-100 tracking-wider uppercase">— Tolulope Ige</span>
                <span className="font-mono text-[#c5a880] tracking-widest uppercase">LUMINA LAGOS</span>
              </div>
            </div>

            {/* Core Values row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-stone-900/80">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-900 text-[#c5a880] shrink-0">
                  <Flame className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h5 className="font-serif font-medium text-sm text-stone-100">Pure Formulations</h5>
                  <p className="text-xs text-stone-400 leading-normal mt-1">Soot-free organic soy and coconut wax hand-poured with absolute precision.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-900 text-[#c5a880] shrink-0">
                  <Star className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h5 className="font-serif font-medium text-sm text-stone-100">Mindful Ambience</h5>
                  <p className="text-xs text-stone-400 leading-normal mt-1">Scent profiles crafted to bring restoration, luxury, and peace to your day.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

