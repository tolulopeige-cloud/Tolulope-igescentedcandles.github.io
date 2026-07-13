import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, ShoppingBag, Phone, MapPin, 
  Sparkles, Check, HelpCircle, Menu, X, ArrowUp
} from 'lucide-react';
import { CartItem, StandardProduct, CustomCandle } from './types';

// Child Components
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import BrandStory from './components/BrandStory';
import CandleCreator from './components/CandleCreator';
import CareTips from './components/CareTips';
import Cart from './components/Cart';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedContainerShortcut, setSelectedContainerShortcut] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<string>('');

  // Track scroll position to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('candle_boutique_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart storage:", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('candle_boutique_cart', JSON.stringify(newCart));
  };

  // 1. Add standard/pre-made product to cart
  const handleAddStandardToCart = (product: StandardProduct) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.type === 'standard' && item.standardProduct?.id === product.id
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: `standard_${product.id}_${Date.now()}`,
          type: 'standard',
          standardProduct: product,
          quantity: 1,
        },
      ];
    }
    saveCart(updatedCart);

    // Show quick toast notification
    setAddedToast(`"${product.name}" added to cart!`);
    setTimeout(() => {
      setAddedToast('');
    }, 3000);
  };

  // 2. Add custom bespoke candle to cart
  const handleAddCustomToCart = (customCandleData: Omit<CustomCandle, 'id'>) => {
    const customId = `custom_${Date.now()}`;
    const newCustomCandle: CustomCandle = {
      ...customCandleData,
      id: customId,
    };

    const updatedCart: CartItem[] = [
      ...cartItems,
      {
        id: customId,
        type: 'custom',
        customCandle: newCustomCandle,
        quantity: 1,
      },
    ];
    saveCart(updatedCart);
  };

  // 3. Update item quantity in cart
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updated);
  };

  // 4. Remove item from cart
  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  // 5. Clear cart entirely
  const handleClearCart = () => {
    saveCart([]);
  };

  // Shortcut to redirect container to Scent Builder
  const handleContainerShortcut = (containerId: string) => {
    setSelectedContainerShortcut(containerId);
    // Clear shortcut state immediately so subsequent clicks still trigger
    setTimeout(() => {
      setSelectedContainerShortcut('');
    }, 100);
  };

  const totalCartQty = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf6] text-stone-900 font-sans flex flex-col justify-between selection:bg-[#c5a880]/30 selection:text-stone-900" id="applet-container">
      
      {/* LUXURY ANNOUNCEMENT BANNER */}
      <div className="bg-stone-950 text-[#fefdfa] border-b border-[#c5a880]/15 py-2.5 px-4 text-center text-[10px] font-mono uppercase tracking-[0.25em] relative z-50 flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse" />
        <span>Complimentary Studio pickup in Gbagada • Nationwide Courier Shipping</span>
        <span className="hidden md:inline-block">•</span>
        <span className="hidden md:inline font-semibold text-[#c5a880]">Hand-poured 100% Pure Soy &amp; Coconut wax</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse" />
      </div>

      {/* GLOBAL TOAST BANNER */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 bg-stone-950 text-[#fcfaf6] px-6 py-4 rounded-xl shadow-2xl border border-[#c5a880]/30 flex items-center gap-3 text-xs font-mono max-w-sm"
          >
            <div className="w-6 h-6 rounded-full bg-[#c5a880] text-stone-950 flex items-center justify-center font-bold shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3px]" />
            </div>
            <div className="text-left">
              <p className="font-sans font-medium text-white">Added to Bag</p>
              <p className="text-[10px] text-stone-400 font-light mt-0.5">{addedToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY ELEGANT HEADER */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-xl border-b border-[#c5a880]/10 text-stone-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo Brand Title */}
          <button 
            onClick={() => scrollToSection('hero-section')}
            className="flex items-center gap-3 group text-left cursor-pointer"
            id="brand-logo-btn"
          >
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#c5a880] to-[#f5e3cc] p-[1.5px] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#c5a880] stroke-[2px] animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border border-[#c5a880]/30 animate-ping opacity-25" />
            </div>
            <div>
              <span className="font-serif font-semibold text-xl tracking-[0.2em] text-[#fcfaf6] uppercase block leading-none">
                LUMINA
              </span>
              <span className="text-[9px] text-[#c5a880] font-mono tracking-[0.3em] uppercase block mt-1.5">
                LAGOS
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-[0.2em]">
            <button
              onClick={() => scrollToSection('signature-blends-section')}
              className="hover:text-[#c5a880] transition-colors cursor-pointer relative py-2 group text-stone-300"
            >
              Signature Blends
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a880] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollToSection('brand-story-section')}
              className="hover:text-[#c5a880] transition-colors cursor-pointer relative py-2 group text-stone-300"
            >
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a880] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollToSection('candle-creator-section')}
              className="hover:text-[#c5a880] transition-colors cursor-pointer text-[#c5a880] font-semibold flex items-center gap-1.5 relative py-2 group"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Bespoke Creator</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a880] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollToSection('care-tips-section')}
              className="hover:text-[#c5a880] transition-colors cursor-pointer relative py-2 group text-stone-300"
            >
              Care Guide
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a880] transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>

          {/* Right Header Controls (Cart & Contacts) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('cart-checkout-section')}
              className="relative p-2.5 rounded-lg hover:bg-[#1c110a] border border-[#c5a880]/20 hover:border-[#c5a880]/40 transition-all duration-300 flex items-center gap-2 text-[#fcfaf6]"
              id="header-cart-btn"
              title="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#c5a880]" />
              <span className="text-[10px] font-mono tracking-widest hidden sm:inline uppercase">My Bag</span>
              {totalCartQty > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#c5a880] text-stone-950 font-mono text-[10px] font-bold flex items-center justify-center animate-pulse shadow-md">
                  {totalCartQty}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden hover:bg-stone-900 border border-stone-850 rounded-lg text-stone-400 hover:text-stone-100"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-stone-900 bg-stone-950"
            >
              <div className="px-6 py-6 flex flex-col gap-4 text-xs font-mono uppercase tracking-[0.2em] text-left">
                <button
                  onClick={() => scrollToSection('signature-blends-section')}
                  className="py-2.5 border-b border-stone-900 text-stone-300 hover:text-[#c5a880] transition-colors"
                >
                  Signature Blends
                </button>
                <button
                  onClick={() => scrollToSection('brand-story-section')}
                  className="py-2.5 border-b border-stone-900 text-stone-300 hover:text-[#c5a880] transition-colors"
                >
                  Our Story
                </button>
                <button
                  onClick={() => scrollToSection('candle-creator-section')}
                  className="py-2.5 border-b border-stone-900 text-[#c5a880] hover:text-white transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Bespoke Creator</span>
                </button>
                <button
                  onClick={() => scrollToSection('care-tips-section')}
                  className="py-2.5 text-stone-300 hover:text-[#c5a880] transition-colors"
                >
                  Care Guide
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CORE PAGES & SECTIONS */}
      <main className="flex-grow">
        
        {/* 1. HERO PAGE BANNER */}
        <Hero 
          onStartCreating={() => scrollToSection('candle-creator-section')}
          onBrowseCollection={() => scrollToSection('signature-blends-section')}
        />

        {/* 2. SIGNATURE BESTSELLERS LIST */}
        <ProductCatalog 
          onAddToCart={handleAddStandardToCart}
          onSelectContainer={handleContainerShortcut}
        />

        {/* BRAND STORYTELLING BANNER */}
        <BrandStory />

        {/* 3. INTERACTIVE SCENTED CANDLE CUSTOMIZER */}
        <CandleCreator 
          onAddCustomToCart={handleAddCustomToCart}
          initialContainer={selectedContainerShortcut}
        />

        {/* 4. ESSENTIAL CANDLE BURNING GUIDE */}
        <CareTips />

        {/* 5. SHOPPING CART LIST & WHATSAPP ORDER SUBMISSION */}
        <Cart 
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

      </main>

      {/* LUXURY DESIGNER FOOTER */}
      <footer className="bg-[#120905] text-[#e8e4dc]/70 py-20 border-t border-[#c5a880]/15 text-left relative overflow-hidden">
        {/* Subtle decorative glow in background */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#c5a880]/5 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
          
          {/* Logo / Brand */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#c5a880] to-[#f5e3cc] p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center">
                  <Flame className="w-4.5 h-4.5 text-[#c5a880]" />
                </div>
              </div>
              <div>
                <span className="font-serif font-semibold text-stone-100 tracking-[0.25em] text-lg uppercase block leading-none">LUMINA LAGOS</span>
                <span className="text-[9px] text-[#c5a880] font-mono tracking-[0.3em] uppercase block mt-1">EST. 2019</span>
              </div>
            </div>
            <p className="text-xs text-stone-300 max-w-sm leading-relaxed font-light">
              We design and hand-pour bespoke scented candles in Lagos, Nigeria. Grounded in Gbagada, we ship pure aromatherapy nationwide. Crafted cleanly using eco-friendly natural soy and coconut wax formulations.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#c5a880]/80">
              <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Studio: Gbagada Phase 2, Lagos, Nigeria</span>
            </div>
          </div>

          {/* Scent Categories */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-stone-100 text-xs font-mono uppercase tracking-[0.2em] font-semibold">Fragrance Palettes</h4>
            <ul className="text-xs space-y-3 font-light text-stone-300">
              <li><span className="hover:text-[#c5a880] transition-colors cursor-pointer block">Provincial Lavender (Relaxation)</span></li>
              <li><span className="hover:text-[#c5a880] transition-colors cursor-pointer block">Madagascar Vanilla (Comforting)</span></li>
              <li><span className="hover:text-[#c5a880] transition-colors cursor-pointer block">Lagos Cinnamon &amp; Spice (Energizing)</span></li>
              <li><span className="hover:text-[#c5a880] transition-colors cursor-pointer block">Eucalyptus &amp; Nigerian Mint (Clarity)</span></li>
            </ul>
          </div>

          {/* Quick Support contacts */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-stone-100 text-xs font-mono uppercase tracking-[0.2em] font-semibold">Bespoke Inquiries</h4>
            <p className="text-xs leading-relaxed max-w-xs text-stone-300 font-light">
              Need bulk candles for weddings, luxury hampers, corporate events, or customized party souvenirs?
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/2348164701851?text=Hello%20Lumina%20Lagos%2C%20I%20want%20to%20inquire%20about%20custom%20bulk%20orders."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#1c110a] hover:bg-[#2c1b10] text-[#fcfaf6] border border-[#c5a880]/30 hover:border-[#c5a880]/60 rounded-lg text-xs font-mono transition-all duration-300"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Bulk WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright and Legal lines */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[#c5a880]/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light text-stone-400">
          <div>
            &copy; {new Date().getFullYear()} Lumina Scented Candles. All Rights Reserved.
          </div>
          <div className="flex gap-6 text-[#c5a880]/70 font-mono text-[10px] tracking-widest uppercase">
            <span>HANDPOURED IN LAGOS</span>
            <span>•</span>
            <span>ECO-FRIENDLY ORGANIC WAX</span>
          </div>
        </div>
      </footer>

      {/* FLOAT BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#c5a880] hover:bg-[#b0936b] text-stone-950 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5px]" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
