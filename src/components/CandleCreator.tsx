import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Flame, Sliders, Type, Info, 
  Plus, Minus, RefreshCw, ShoppingCart, 
  HelpCircle, Check, Compass, Eye, Heart
} from 'lucide-react';
import { 
  WaxTypeId, ContainerTypeId, CandleSizeId, 
  WickTypeId, LabelStyleId, CustomCandle, ScentOption 
} from '../types';
import { 
  WAX_TYPES, CONTAINER_TYPES, CANDLE_SIZES, 
  WICK_TYPES, SCENT_OPTIONS 
} from '../data';
import FragranceWheel from './FragranceWheel';

interface CandleCreatorProps {
  onAddCustomToCart: (candle: Omit<CustomCandle, 'id'>) => void;
  initialContainer?: string;
}

export default function CandleCreator({ onAddCustomToCart, initialContainer }: CandleCreatorProps) {
  // Creator Options State
  const [selectedWax, setSelectedWax] = useState<WaxTypeId>('soy');
  const [selectedContainer, setSelectedContainer] = useState<ContainerTypeId>('amber');
  const [selectedSize, setSelectedSize] = useState<CandleSizeId>('8oz');
  const [selectedWick, setSelectedWick] = useState<WickTypeId>('cotton');
  
  // Scents State: Record of scentId to percentage (e.g. { vanilla: 50, lavender: 50 })
  const [selectedScents, setSelectedScents] = useState<Record<string, number>>({
    'vanilla': 100
  });
  const [scentIntensity, setScentIntensity] = useState<'subtle' | 'balanced' | 'strong'>('balanced');

  // Label State
  const [labelText, setLabelText] = useState<string>('AURA OF LAGOS');
  const [labelSubtitle, setLabelSubtitle] = useState<string>('Scented Candle');
  const [labelStyle, setLabelStyle] = useState<LabelStyleId>('classic');

  // Interactive UI State
  const isLit = true;
  const [activeTab, setActiveTab] = useState<'base' | 'scents' | 'label'>('base');
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Sync initial container if passed down from shortcuts
  useEffect(() => {
    if (initialContainer) {
      setSelectedContainer(initialContainer as ContainerTypeId);
      // Automatically scroll to the section
      const element = document.getElementById('candle-creator-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialContainer]);

  // Calculate live price
  const calculatePrice = () => {
    const waxPrice = WAX_TYPES.find(w => w.id === selectedWax)?.priceNgn || 0;
    const containerPrice = CONTAINER_TYPES.find(c => c.id === selectedContainer)?.priceNgn || 0;
    const sizePrice = CANDLE_SIZES.find(s => s.id === selectedSize)?.priceNgn || 0;
    const wickPrice = WICK_TYPES.find(w => w.id === selectedWick)?.priceNgn || 0;
    
    // Scents are typically covered, but we add a premium for more complex blends
    const uniqueScentCount = Object.keys(selectedScents).length;
    const scentPremium = uniqueScentCount > 1 ? (uniqueScentCount - 1) * 800 : 0;

    return waxPrice + containerPrice + sizePrice + wickPrice + scentPremium;
  };

  const currentPrice = calculatePrice();

  // Handle scent toggle
  const handleToggleScent = (scId: string) => {
    const currentActive = Object.keys(selectedScents);
    
    if (selectedScents[scId] !== undefined) {
      // Don't allow removing the last scent
      if (currentActive.length === 1) return;
      
      const updated = { ...selectedScents };
      delete updated[scId];
      
      // Re-balance remaining
      const remainingKeys = Object.keys(updated);
      const equalShare = Math.floor(100 / remainingKeys.length);
      remainingKeys.forEach((k, idx) => {
        updated[k] = idx === remainingKeys.length - 1 ? 100 - (equalShare * (remainingKeys.length - 1)) : equalShare;
      });
      setSelectedScents(updated);
    } else {
      // Max 3 scents in a custom blend
      if (currentActive.length >= 3) return;

      const updated = { ...selectedScents, [scId]: 0 };
      const newActive = Object.keys(updated);
      const equalShare = Math.floor(100 / newActive.length);
      newActive.forEach((k, idx) => {
        updated[k] = idx === newActive.length - 1 ? 100 - (equalShare * (newActive.length - 1)) : equalShare;
      });
      setSelectedScents(updated);
    }
  };

  // Adjust scent percentages safely
  const handleScentPercentChange = (scId: string, newValue: number) => {
    const activeIds = Object.keys(selectedScents);
    if (activeIds.length === 1) return; // Can't adjust if only one scent

    if (activeIds.length === 2) {
      const otherId = activeIds.find(id => id !== scId)!;
      const targetVal = Math.max(0, Math.min(100, newValue));
      setSelectedScents({
        [scId]: targetVal,
        [otherId]: 100 - targetVal
      });
    } else if (activeIds.length === 3) {
      // 3-way distribution: adjust target, distribute diff proportionally to others
      const otherIds = activeIds.filter(id => id !== scId);
      const currentVal = selectedScents[scId];
      const diff = newValue - currentVal;
      
      const other1Val = selectedScents[otherIds[0]];
      const other2Val = selectedScents[otherIds[1]];
      const sumOthers = other1Val + other2Val;

      let updated = { ...selectedScents };
      updated[scId] = Math.max(0, Math.min(100, newValue));

      if (sumOthers > 0) {
        // Distribute diff proportionally
        const share1 = Math.round((other1Val / sumOthers) * diff);
        const share2 = diff - share1;

        updated[otherIds[0]] = Math.max(0, other1Val - share1);
        updated[otherIds[1]] = Math.max(0, other2Val - share2);
      } else {
        // If others were 0, divide remainder equally
        const rem = 100 - updated[scId];
        updated[otherIds[0]] = Math.floor(rem / 2);
        updated[otherIds[1]] = rem - Math.floor(rem / 2);
      }

      // Final sanitization of sum to 100
      const total = updated[scId] + updated[otherIds[0]] + updated[otherIds[1]];
      if (total !== 100) {
        updated[otherIds[1]] += (100 - total);
      }
      setSelectedScents(updated);
    }
  };

  // Helper to get active container data
  const activeContainerData = CONTAINER_TYPES.find(c => c.id === selectedContainer)!;

  // Render Label Style Preview Classes
  const getLabelStyleClasses = () => {
    switch (labelStyle) {
      case 'classic':
        return 'border border-amber-900/40 p-3 font-serif bg-cream text-stone-900 text-center flex flex-col justify-center items-center shadow-xs rounded-xs';
      case 'minimalist':
        return 'border-t-2 border-b-2 border-stone-800 py-4 px-2 font-sans tracking-widest text-stone-800 text-center flex flex-col justify-center items-center';
      case 'vintage':
        return 'border-4 double border-amber-900 p-2.5 font-serif text-amber-950 text-center bg-amber-50/90 rounded-sm italic shadow-md';
      case 'botanical':
        return 'border border-emerald-800/30 p-3 font-mono text-emerald-950 bg-stone-50 text-center relative rounded-lg shadow-inner';
      default:
        return 'p-3 bg-white text-stone-900 text-center';
    }
  };

  // Add customized candle to cart
  const handleAddToCart = () => {
    onAddCustomToCart({
      wax: selectedWax,
      container: selectedContainer,
      size: selectedSize,
      wick: selectedWick,
      scents: selectedScents,
      scentIntensity,
      label: {
        text: labelText || 'Bespoke Scent',
        subtitle: labelSubtitle || 'Handcrafted',
        style: labelStyle,
      },
      priceNgn: currentPrice,
    });
    
    // Show success banner
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  // Currency Formatter
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="py-20 bg-[#faf6ee] text-stone-900 relative border-t border-amber-100/50" id="candle-creator-section">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Success Alert toast */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#2d1b10] text-[#fcfaf6] px-6 py-4 rounded-xl shadow-2xl border border-amber-500/30 flex items-center gap-3"
            >
              <div className="p-1 bg-amber-500 rounded-full text-stone-950">
                <Check className="w-4 h-4 stroke-[3px]" />
              </div>
              <div className="text-left">
                <p className="font-serif text-sm font-semibold">Bespoke Candle Saved!</p>
                <p className="text-[11px] text-[#f5ebd9]">Added to your checkout cart. Check your cart to finalize order.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs text-amber-800 font-mono uppercase tracking-widest font-bold block mb-2">Artisan Workshop</span>
          <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-stone-950 mb-4">
            Bespoke Scent Designer
          </h2>
          <div className="h-0.5 w-16 bg-amber-600 mx-auto mb-4" />
          <p className="text-stone-700 text-sm sm:text-base font-sans leading-relaxed">
            Express your unique essence. Select a slow-burning clean organic wax, pick a handcrafted luxury vessel, select a therapeutic wick, blend up to three exotic scents, and sign your masterpiece with a personalized, beautiful label.
          </p>
        </div>

        {/* Creator Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT: Live Scent/Candle visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between bg-stone-950 border border-stone-800 rounded-2xl p-6 relative overflow-hidden min-h-[500px] lg:min-h-auto shadow-2xl">
            {/* Ambient visual background highlights */}
            <div className="absolute inset-0 bg-radial-[circle_at_50%_40%] from-amber-500/10 via-stone-950 to-stone-950" />
            
            {/* Visualizer header metrics */}
            <div className="w-full flex justify-between items-center z-10 text-stone-400 font-mono text-[10px]">
              <div className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                <span>GBAGADA WORKSHOP</span>
              </div>
              <div className="px-2.5 py-1 rounded-full border border-stone-800 text-stone-400 bg-stone-900/50 flex items-center gap-1.5 uppercase font-semibold">
                <Eye className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>LIVE PREVIEW</span>
              </div>
            </div>

            {/* MAIN CANDLE STAGE */}
            <div className="relative flex-grow flex items-center justify-center w-full py-12">
              <div className="relative w-72 h-72 flex items-center justify-center">
                
                {/* 1. Scent Vapor Waves when lit */}
                <AnimatePresence>
                  {isLit && (
                    <div className="absolute -top-12 inset-x-0 h-28 pointer-events-none flex justify-center items-end z-20">
                      {/* Interactive vapor waves matching scents chosen */}
                      {Object.keys(selectedScents).map((scId, idx) => {
                        const scentOpt = SCENT_OPTIONS.find(s => s.id === scId);
                        return (
                          <motion.div
                            key={scId}
                            initial={{ opacity: 0, y: 15, scale: 0.8 }}
                            animate={{ 
                              opacity: [0, 0.4, 0.6, 0], 
                              y: [-10, -50, -90], 
                              scale: [0.8, 1.2, 1.4],
                              x: [0, (idx - 1) * 20, (idx - 1) * 40] 
                            }}
                            transition={{ 
                              duration: 3, 
                              repeat: Infinity, 
                              delay: idx * 0.8,
                              ease: "easeInOut" 
                            }}
                            className={`absolute w-12 h-12 rounded-full filter blur-xl bg-gradient-to-tr ${scentOpt?.color || 'from-amber-400 to-amber-500'}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>

                {/* 2. Actual Real Image Preview matching active container selection */}
                <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-2xl border border-stone-800/80 z-10 p-0.5 bg-stone-900 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent" />
                  <img
                    src={activeContainerData.image}
                    alt={activeContainerData.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* 3. Personalized Physical Label Overlay */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 z-20">
                    <div className={`${getLabelStyleClasses()} border border-stone-300 shadow-lg bg-[#fbfaf7] text-stone-900 rounded-sm p-3 flex flex-col items-center justify-center`}>
                      {/* Brand Header */}
                      <span className="text-[8px] tracking-[0.25em] font-sans font-bold text-stone-500 uppercase block mb-1">
                        L U M I N A
                      </span>
                      
                      <div className="w-8 h-[1px] bg-stone-300 mb-1.5" />
                      
                      {/* Scent Scent Name (Matches scent choice) */}
                      <h5 className="font-serif font-semibold text-xs tracking-wide uppercase leading-tight line-clamp-1 text-stone-900">
                        {labelText || (Object.keys(selectedScents).length > 0 
                          ? Object.keys(selectedScents).map(id => id.replace('_', ' ')).join(' & ')
                          : 'Bespoke Blend')}
                      </h5>
                      
                      <div className="h-[1px] w-4 bg-amber-800/20 my-1" />
                      
                      <p className="text-[8px] text-stone-500 tracking-wider italic leading-tight line-clamp-1">
                        {labelSubtitle || 'Handpoured in Lagos'}
                      </p>
                      
                      {/* Standard Product Subtitle details */}
                      <p className="text-[6px] text-stone-400 font-mono tracking-widest mt-1.5 uppercase">
                        {selectedSize} • {WAX_TYPES.find(w => w.id === selectedWax)?.name.replace('Wax', '').trim()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specs Summary Footer */}
            <div className="w-full z-10 pt-4 border-t border-stone-800 text-left">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">Configuration Summary:</span>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 text-xs text-stone-300 font-sans">
                <span>{WAX_TYPES.find(w => w.id === selectedWax)?.name}</span>
                <span className="text-stone-700">•</span>
                <span>{activeContainerData.name}</span>
                <span className="text-stone-700">•</span>
                <span>{selectedSize}</span>
                <span className="text-stone-700">•</span>
                <span>{WICK_TYPES.find(w => w.id === selectedWick)?.name}</span>
              </div>
            </div>

          </div>


          {/* RIGHT: Option selectors */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-100 shadow-xl p-6 sm:p-8 flex flex-col justify-between text-left">
            <div>
              {/* Creator Tabs */}
              <div className="flex border-b border-stone-100 mb-8 overflow-x-auto gap-2">
                <button
                  onClick={() => setActiveTab('base')}
                  className={`pb-4 px-2 font-serif text-sm tracking-wide font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'base'
                      ? 'border-amber-600 text-stone-900'
                      : 'border-transparent text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>1. Wax & Vessel</span>
                </button>
                <button
                  onClick={() => setActiveTab('scents')}
                  className={`pb-4 px-2 font-serif text-sm tracking-wide font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'scents'
                      ? 'border-amber-600 text-stone-900'
                      : 'border-transparent text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>2. Scent Blender</span>
                </button>
                <button
                  onClick={() => setActiveTab('label')}
                  className={`pb-4 px-2 font-serif text-sm tracking-wide font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'label'
                      ? 'border-amber-600 text-stone-900'
                      : 'border-transparent text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>3. Custom Label</span>
                </button>
              </div>

              {/* TAB CONTENT: 1. WAX & VESSEL */}
              {activeTab === 'base' && (
                <div className="space-y-6">
                  {/* Wax Type Selection */}
                  <div>
                    <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold mb-3">Select Wax Base</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {WAX_TYPES.map(w => (
                        <button
                          key={w.id}
                          onClick={() => setSelectedWax(w.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            selectedWax === w.id
                              ? 'border-amber-600 bg-amber-50/20 ring-1 ring-amber-600'
                              : 'border-stone-100 hover:border-stone-300 bg-stone-50/50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-stone-900 text-sm">{w.name}</span>
                            <span className="text-xs font-mono font-medium text-amber-800">
                              {w.priceNgn === 4500 ? 'Base' : `+₦${(w.priceNgn - 4500).toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 leading-relaxed">{w.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vessel/Container Selection */}
                  <div>
                    <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold mb-3">Select Container Vessel</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CONTAINER_TYPES.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedContainer(c.id)}
                          className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                            selectedContainer === c.id
                              ? 'border-amber-600 bg-amber-50/20 ring-1 ring-amber-600'
                              : 'border-stone-100 hover:border-stone-300 bg-stone-50/50'
                          }`}
                        >
                          {/* Mini visual swatch indicator */}
                          <div className={`w-10 h-10 rounded-lg shrink-0 border shadow-inner ${c.colorClass}`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-stone-900 text-sm">{c.name}</span>
                              <span className="text-[10px] font-mono text-amber-800">
                                {c.priceNgn === 2500 ? 'Base' : `+₦${(c.priceNgn - 2500).toLocaleString()}`}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 leading-relaxed">{c.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Candle Size Selection & Wick Type Selection (Two Column) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold mb-3">Select Candle Size</h4>
                      <div className="space-y-2">
                        {CANDLE_SIZES.map(s => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSize(s.id)}
                            className={`w-full p-3.5 rounded-xl border text-left transition-all flex justify-between items-center ${
                              selectedSize === s.id
                                ? 'border-amber-600 bg-amber-50/20 ring-1 ring-amber-600'
                                : 'border-stone-100 hover:border-stone-300 bg-stone-50/50'
                            }`}
                          >
                            <div>
                              <span className="font-semibold text-stone-900 text-xs sm:text-sm block">{s.name}</span>
                              <span className="text-[10px] text-stone-500">{s.description}</span>
                            </div>
                            <span className="text-xs font-mono font-medium text-amber-800">
                              {s.priceNgn === 2000 ? 'Base' : `+₦${(s.priceNgn - 2000).toLocaleString()}`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold mb-3">Select Wick Type</h4>
                      <div className="space-y-2">
                        {WICK_TYPES.map(w => (
                          <button
                            key={w.id}
                            onClick={() => setSelectedWick(w.id)}
                            className={`w-full p-3.5 rounded-xl border text-left transition-all flex justify-between items-center ${
                              selectedWick === w.id
                                ? 'border-amber-600 bg-amber-50/20 ring-1 ring-amber-600'
                                : 'border-stone-100 hover:border-stone-300 bg-stone-50/50'
                            }`}
                          >
                            <div>
                              <span className="font-semibold text-stone-900 text-xs sm:text-sm block">{w.name}</span>
                              <span className="text-[10px] text-stone-500">{w.description}</span>
                            </div>
                            <span className="text-xs font-mono font-medium text-amber-800">
                              {w.priceNgn === 500 ? 'Base' : `+₦${(w.priceNgn - 500).toLocaleString()}`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: 2. SCENT BLENDER */}
              {activeTab === 'scents' && (
                <div className="space-y-6">
                  {/* Instructional alert */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3 text-stone-700">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-semibold text-stone-900 mb-0.5">Scent Blending Rule (Max 3)</p>
                      <p>Select up to 3 scents from our exotic palette. Adjust their volume percentage sliders below to balance your unique candle recipe. Your scent cocktail must equal exactly 100%.</p>
                    </div>
                  </div>

                  {/* Interactive Fragrance Wheel Graphic */}
                  <FragranceWheel 
                    selectedScents={selectedScents}
                    onToggleScent={handleToggleScent}
                  />

                  {/* Scent Grid Palette selection */}
                  <div>
                    <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold mb-3">Scent Selection Palette</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SCENT_OPTIONS.map(s => {
                        const isSelected = selectedScents[s.id] !== undefined;
                        const isMaxReached = Object.keys(selectedScents).length >= 3;
                        const isDisabled = !isSelected && isMaxReached;

                        return (
                          <button
                            key={s.id}
                            disabled={isDisabled}
                            onClick={() => handleToggleScent(s.id)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'border-amber-600 bg-amber-500/5 shadow-inner'
                                : isDisabled
                                ? 'opacity-40 cursor-not-allowed border-stone-100 bg-stone-50'
                                : 'border-stone-100 hover:border-stone-200 bg-stone-50/50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1.5">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-mono uppercase tracking-wider font-semibold ${
                                s.category === 'Floral' ? 'bg-pink-50 text-pink-700' :
                                s.category === 'Woody' ? 'bg-amber-50 text-amber-800' :
                                s.category === 'Sweet & Warm' ? 'bg-yellow-50 text-yellow-800' :
                                s.category === 'Fresh & Herbal' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                              }`}>
                                {s.category}
                              </span>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-amber-600 flex items-center justify-center text-white">
                                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                                </div>
                              )}
                            </div>
                            <span className="font-serif font-bold text-stone-900 text-xs sm:text-sm block line-clamp-1">{s.name}</span>
                            <span className="text-[10px] text-stone-500 line-clamp-1 italic mt-0.5">{s.notes}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sliders for active elements */}
                  <div className="pt-4 border-t border-stone-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold">Blend Customizer Proportions</h4>
                      <span className="text-xs font-mono font-semibold bg-stone-100 text-stone-800 px-2 py-0.5 rounded-full">
                        Total Recipe: 100%
                      </span>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(selectedScents).map(([scId, percent]) => {
                        const scentData = SCENT_OPTIONS.find(s => s.id === scId);
                        if (!scentData) return null;

                        const isActiveOnlyOne = Object.keys(selectedScents).length === 1;

                        return (
                          <div key={scId} className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${scentData.color}`} />
                                <span className="font-serif font-bold text-stone-900 text-sm">{scentData.name}</span>
                              </div>
                              <span className="text-sm font-mono font-bold text-amber-800">{percent}%</span>
                            </div>
                            
                            {isActiveOnlyOne ? (
                              <p className="text-[10px] text-stone-400 font-sans italic">Only one scent selected. Add more scents above to blend.</p>
                            ) : (
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={percent}
                                onChange={(e) => handleScentPercentChange(scId, parseInt(e.target.value))}
                                className="w-full accent-amber-600 cursor-ew-resize h-1.5 bg-stone-200 rounded-lg appearance-none"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scent Intensity Level Selector */}
                  <div className="pt-6 border-t border-stone-100">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-left">
                        <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold block">Scent Throw Intensity</h4>
                        <p className="text-[10px] text-stone-500 font-sans">Adjust the concentration and throw of your bespoke fragrance cocktail</p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-[#c5a880]/15 text-[#c5a880] px-3 py-1 rounded-full border border-[#c5a880]/20 uppercase tracking-wider">
                        {scentIntensity}
                      </span>
                    </div>

                    <div className="bg-stone-50 rounded-xl p-5 border border-stone-100 space-y-5">
                      <div className="relative pt-2">
                        {/* Custom Slider Input */}
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="1"
                          value={scentIntensity === 'subtle' ? 0 : scentIntensity === 'strong' ? 2 : 1}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setScentIntensity(val === 0 ? 'subtle' : val === 2 ? 'strong' : 'balanced');
                          }}
                          className="w-full accent-[#c5a880] cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none relative z-10"
                        />

                        {/* Custom visual ticks underneath */}
                        <div className="flex justify-between text-[11px] font-mono text-stone-400 mt-2.5 px-1 font-semibold">
                          <button 
                            type="button" 
                            onClick={() => setScentIntensity('subtle')}
                            className={`transition-colors hover:text-[#c5a880] ${scentIntensity === 'subtle' ? 'text-[#c5a880] font-bold' : ''}`}
                          >
                            Subtle (Low)
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setScentIntensity('balanced')}
                            className={`transition-colors hover:text-[#c5a880] ${scentIntensity === 'balanced' ? 'text-[#c5a880] font-bold' : ''}`}
                          >
                            Balanced (Mid)
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setScentIntensity('strong')}
                            className={`transition-colors hover:text-[#c5a880] ${scentIntensity === 'strong' ? 'text-[#c5a880] font-bold' : ''}`}
                          >
                            Strong (High)
                          </button>
                        </div>
                      </div>

                      {/* Display info block of the selected intensity level */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={scentIntensity}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-stone-150 text-stone-700 text-xs text-left"
                        >
                          <div className="text-xl shrink-0 mt-0.5">
                            {scentIntensity === 'subtle' ? '🍃' : scentIntensity === 'strong' ? '🔥' : '✨'}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900 flex items-center gap-1.5 capitalize">
                              {scentIntensity} Fragrance Throw
                            </p>
                            <p className="text-stone-500 mt-1 font-light leading-relaxed">
                              {scentIntensity === 'subtle' && 'A gentle, slow-release whisper of aroma. Excellent for small home workspaces, powder rooms, or sensitive noses.'}
                              {scentIntensity === 'balanced' && 'Our signature optimized formulation. Releases a constant, luxurious sensory field filling average-sized bedrooms and living areas.'}
                              {scentIntensity === 'strong' && 'Maximized aroma concentration for high throw. Fills sprawling open-plan spaces, office lobbies, or double-height ceilings effortlessly.'}
                            </p>
                            <span className="inline-block mt-2 text-[10px] font-mono text-[#c5a880] bg-[#c5a880]/10 px-2 py-0.5 rounded-xs font-semibold border border-[#c5a880]/10">
                              {scentIntensity === 'subtle' && 'Ideal for: Cozy rooms (10-15 sqm)'}
                              {scentIntensity === 'balanced' && 'Ideal for: Main rooms (15-30 sqm)'}
                              {scentIntensity === 'strong' && 'Ideal for: Grand/Open spaces (30+ sqm)'}
                            </span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: 3. CUSTOM LABEL */}
              {activeTab === 'label' && (
                <div className="space-y-6">
                  {/* Headline & Input */}
                  <div>
                    <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold mb-3">Label Texting Layout</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-stone-500 uppercase tracking-wider mb-1.5">Primary Title (Max 24 characters)</label>
                        <input
                          type="text"
                          maxLength={24}
                          value={labelText}
                          onChange={(e) => setLabelText(e.target.value)}
                          className="w-full px-4 py-3 border border-stone-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl outline-hidden text-sm"
                          placeholder="e.g. LAGOS GLOW"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-stone-500 uppercase tracking-wider mb-1.5">Secondary Subtitle (Max 30 characters)</label>
                        <input
                          type="text"
                          maxLength={30}
                          value={labelSubtitle}
                          onChange={(e) => setLabelSubtitle(e.target.value)}
                          className="w-full px-4 py-3 border border-stone-200 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-xl outline-hidden text-sm"
                          placeholder="e.g. Luxury Handpoured Soy Candle"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Font theme/Border style selection */}
                  <div>
                    <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-semibold mb-3">Label Styling Theme</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setLabelStyle('classic')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          labelStyle === 'classic'
                            ? 'border-amber-600 bg-amber-50/20 ring-1 ring-amber-600'
                            : 'border-stone-100 hover:border-stone-300 bg-stone-50/50'
                        }`}
                      >
                        <span className="font-serif font-bold text-xs sm:text-sm block mb-1">Classic Elegance</span>
                        <p className="text-[11px] text-stone-500 leading-tight">Serif fonts with an elegant double margin border. Traditional apothecary style.</p>
                      </button>

                      <button
                        onClick={() => setLabelStyle('minimalist')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          labelStyle === 'minimalist'
                            ? 'border-amber-600 bg-amber-50/20 ring-1 ring-amber-600'
                            : 'border-stone-100 hover:border-stone-300 bg-stone-50/50'
                        }`}
                      >
                        <span className="font-sans font-bold tracking-wider text-xs sm:text-sm block mb-1">Modern Minimal</span>
                        <p className="text-[11px] text-stone-500 leading-tight">Clean tracking, spacious margins, sans-serif design, subtle modern bars.</p>
                      </button>

                      <button
                        onClick={() => setLabelStyle('vintage')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          labelStyle === 'vintage'
                            ? 'border-amber-600 bg-amber-50/20 ring-1 ring-amber-600'
                            : 'border-stone-100 hover:border-stone-300 bg-stone-50/50'
                        }`}
                      >
                        <span className="font-serif italic font-semibold text-xs sm:text-sm block mb-1">Retro Vintage</span>
                        <p className="text-[11px] text-stone-500 leading-tight">Ornate classic borders, cream paper colors, heavy serif display branding.</p>
                      </button>

                      <button
                        onClick={() => setLabelStyle('botanical')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          labelStyle === 'botanical'
                            ? 'border-amber-600 bg-amber-50/20 ring-1 ring-amber-600'
                            : 'border-stone-100 hover:border-stone-300 bg-stone-50/50'
                        }`}
                      >
                        <span className="font-mono font-bold text-xs sm:text-sm block mb-1">Earthy Botanical</span>
                        <p className="text-[11px] text-stone-500 leading-tight">Monospace organic layouts, clean lines, styled with an earth tone backdrop.</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price section & Checkout button */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-stone-400 block tracking-widest uppercase">ESTIMATED PRICE</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-stone-900">{formatNaira(currentPrice)}</span>
                  <span className="text-[10px] text-stone-400 font-mono">NGN</span>
                </div>
                <p className="text-[9px] text-stone-400 font-sans mt-0.5">Tax and local Gbagada packaging included</p>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium text-xs tracking-wider uppercase transition-colors duration-300 flex items-center justify-center gap-2"
                id="creator-add-to-cart-btn"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Save bespoke candle to cart</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
