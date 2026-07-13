import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Star, Flame, Eye } from 'lucide-react';
import { StandardProduct } from '../types';
import { STANDARD_PRODUCTS, CONTAINER_TYPES } from '../data';

interface ProductCatalogProps {
  onAddToCart: (product: StandardProduct) => void;
  onSelectContainer: (containerId: string) => void; // Shortcut to direct them to the builder with this container
}

export default function ProductCatalog({ onAddToCart, onSelectContainer }: ProductCatalogProps) {
  // Helper to format currency
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="py-24 bg-[#fcfaf6] text-stone-900 border-t border-[#c5a880]/20" id="signature-blends-section">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs text-[#c5a880] font-mono uppercase tracking-[0.25em] font-semibold block mb-3">Our Signature Blends</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-950 mb-5">
            Warm &amp; Irresistible Creations
          </h2>
          <div className="h-[1px] w-20 bg-[#c5a880] mx-auto mb-5" />
          <p className="text-stone-600 text-sm sm:text-base font-sans font-light leading-relaxed">
            Poured by hand in our sunlit Gbagada studio, each signature candle is a slow-burning sensory masterpiece designed to fill your home with a comforting, golden flicker and rich, lingering aromas.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STANDARD_PRODUCTS.map((product, idx) => {
            const matchedContainer = CONTAINER_TYPES.find(c => c.id === product.container);
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ 
                  duration: 0.85, 
                  ease: [0.16, 1, 0.3, 1], // Premium easeOutExpo curve
                  delay: idx * 0.12 
                }}
                className="bg-white rounded-xl border border-stone-100 shadow-xs hover:border-[#c5a880]/40 hover:shadow-2xl hover:shadow-[#120905]/5 transition-all duration-300 overflow-hidden flex flex-col group h-full"
                id={`product-card-${product.id}`}
              >
                {/* Product Image Area */}
                <div className="relative aspect-square overflow-hidden bg-stone-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Luxury Product Label Overlay */}
                  <div className="absolute inset-x-0 bottom-10 flex justify-center z-10 pointer-events-none">
                    <div className="w-[130px] md:w-[140px] bg-[#fbfaf5] text-stone-900 border border-stone-250 shadow-lg p-3 rounded-xs flex flex-col items-center justify-center text-center">
                      <span className="text-[7px] tracking-[0.25em] font-sans font-bold text-stone-500 uppercase block mb-0.5">
                        L U M I N A
                      </span>
                      <div className="w-6 h-[1px] bg-stone-300 mb-1" />
                      <h4 className="font-serif font-semibold text-[9px] md:text-[10px] text-stone-900 uppercase tracking-wide leading-tight line-clamp-2 px-1">
                        {product.name}
                      </h4>
                      <div className="h-[1px] w-3 bg-[#c5a880]/30 my-0.5" />
                      <span className="text-[5px] text-stone-400 font-mono tracking-widest uppercase block">
                        Handpoured in Lagos
                      </span>
                      <span className="text-[5px] text-stone-500 font-mono tracking-wider block mt-0.5">
                        {product.size} Signature Scent
                      </span>
                    </div>
                  </div>
                  
                  {/* Category Tag */}
                  {product.tag && (
                    <div className="absolute top-4 left-4 bg-stone-950/95 backdrop-blur-md text-[#c5a880] text-[9px] font-mono tracking-widest uppercase py-1 px-3 rounded-full border border-[#c5a880]/20 shadow-md">
                      {product.tag}
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs text-stone-800 text-[10px] font-mono py-1 px-2.5 rounded-md shadow-xs border border-stone-100 flex items-center gap-1 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#c5a880] text-[#c5a880]" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>

                  {/* Hover Quick actions overlay */}
                  <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => onSelectContainer(product.container)}
                      className="p-3 bg-[#fcfaf6] hover:bg-[#c5a880] hover:text-[#120905] text-stone-900 rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center"
                      title="Customize in Scent Creator"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 flex flex-col flex-grow text-left">
                  {/* Specifications */}
                  <div className="flex gap-2 text-[10px] font-mono text-[#c5a880] uppercase tracking-widest mb-2 font-semibold">
                    <span>{product.size}</span>
                    <span>•</span>
                    <span>{matchedContainer?.name || 'Standard Jar'}</span>
                  </div>

                  <h3 className="text-lg font-serif font-medium text-stone-950 mb-2 group-hover:text-[#c5a880] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed flex-grow font-light">
                    {product.description}
                  </p>

                  {/* Scent profiles details */}
                  <div className="mb-5 pt-3 border-t border-stone-100">
                    <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest block mb-2 font-semibold">Scent Palette:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.scents.map(scId => (
                        <span
                          key={scId}
                          className="text-[10px] bg-stone-50 text-stone-700 px-2.5 py-1 rounded-md font-sans border border-stone-150 font-light"
                        >
                          {scId.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
                    <div>
                      <span className="text-[9px] font-mono text-stone-400 block tracking-wider font-semibold">PRICE</span>
                      <span className="text-lg font-semibold font-sans text-stone-900">{formatNaira(product.priceNgn)}</span>
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="py-2.5 px-4 bg-[#120905] hover:bg-[#c5a880] text-[#fcfaf6] hover:text-[#120905] rounded-lg font-medium text-[10px] font-mono tracking-widest uppercase transition-colors duration-300 flex items-center gap-2 border border-[#c5a880]/10"
                      id={`add-product-${product.id}`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Creator Upsell Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-[#120905] text-[#fcfaf6] rounded-2xl border border-[#c5a880]/20 overflow-hidden p-8 md:p-12 relative flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-2xl"
        >
          {/* Subtle glowing lighting inside */}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#c5a880]/5 rounded-full filter blur-3xl" />
          
          <div className="relative z-10 max-w-xl">
            <span className="text-xs text-[#c5a880] font-mono tracking-[0.2em] uppercase block mb-3 font-semibold">Bespoke Creator Services</span>
            <h3 className="text-2xl md:text-3xl font-serif font-light text-white mb-3">
              Don&apos;t see your perfect fragrance?
            </h3>
            <p className="text-[#e8e4dc]/80 text-xs sm:text-sm leading-relaxed font-light">
              Use our interactive, high-fidelity Scented Candle Creator! Mix up to three exotic scents by percentages, select your preferred clean-burning organic wax, pick a custom jar style, and write a bespoke label for yourself or as a thoughtful gift.
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <a
              href="#candle-creator-section"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#c5a880] hover:bg-[#b0936b] text-[#120905] font-semibold rounded-lg transition-colors duration-300 shadow-xl shadow-[#120905]/40 text-xs font-mono uppercase tracking-widest"
            >
              <Flame className="w-4 h-4" />
              <span>Launch Customizer</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
