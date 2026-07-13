import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Trash2, Plus, Minus, Send, 
  MapPin, User, Phone, Clipboard, ArrowRight,
  Shield, CheckCircle, Info, Settings, Save, AlertTriangle
} from 'lucide-react';
import { CartItem, LagosDeliveryArea } from '../types';
import { 
  WAX_TYPES, CONTAINER_TYPES, CANDLE_SIZES, 
  WICK_TYPES, SCENT_OPTIONS, LAGOS_DELIVERY_AREAS,
  WHATSAPP_VENDOR_NUMBER
} from '../data';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps) {
  // Checkout form details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('gbagada-pickup');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Clear validation error when inputs change
  useEffect(() => {
    setValidationError('');
  }, [customerName, customerPhone, selectedRegionId, deliveryAddress]);

  // Scented Candle Business Owner Settings (Dynamic WhatsApp number)
  const [vendorPhone, setVendorPhone] = useState<string>(WHATSAPP_VENDOR_NUMBER);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isSavedSettings, setIsSavedSettings] = useState<boolean>(false);

  // Load custom phone from localStorage if exists
  useEffect(() => {
    const saved = localStorage.getItem('candle_vendor_phone');
    if (saved && saved !== '2348030001234') {
      setVendorPhone(saved);
    }
  }, []);

  const handleSaveVendorPhone = () => {
    localStorage.setItem('candle_vendor_phone', vendorPhone);
    setIsSavedSettings(true);
    setTimeout(() => {
      setIsSavedSettings(false);
    }, 2000);
  };

  // Helper calculation
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      if (item.type === 'custom' && item.customCandle) {
        return acc + item.customCandle.priceNgn * item.quantity;
      } else if (item.type === 'standard' && item.standardProduct) {
        return acc + item.standardProduct.priceNgn * item.quantity;
      }
      return acc;
    }, 0);
  };

  const selectedRegion = LAGOS_DELIVERY_AREAS.find(r => r.id === selectedRegionId) || LAGOS_DELIVERY_AREAS[0];
  const itemsSubtotal = getSubtotal();
  const deliveryFee = selectedRegion.feeNgn;
  const grandTotal = itemsSubtotal + deliveryFee;

  // Formatter
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Validate form inputs
  const validateForm = () => {
    if (!customerName.trim()) return 'Please enter your full name.';
    if (!customerPhone.trim()) return 'Please enter your contact phone number.';
    if (selectedRegionId !== 'gbagada-pickup' && !deliveryAddress.trim()) {
      return 'Please specify your physical delivery address in Lagos.';
    }
    return null;
  };

  // Handle building the beautiful WhatsApp message
  const handleCheckout = () => {
    const valError = validateForm();
    if (valError) {
      setValidationError(valError);
      const el = document.getElementById('checkout-delivery-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setValidationError('');

    // Build perfect elegant order text representation
    let msg = `✨ *LUMINA SCENTED CANDLES - LAGOS* ✨\n`;
    msg += `===============================\n\n`;
    msg += `📦 *NEW CUSTOMER ORDER* 📦\n\n`;
    msg += `👤 *Customer Details:*\n`;
    msg += `• *Name:* ${customerName}\n`;
    msg += `• *Phone:* ${customerPhone}\n`;
    msg += `• *Service:* ${selectedRegion.name}\n`;
    if (selectedRegionId !== 'gbagada-pickup') {
      msg += `• *Address:* ${deliveryAddress}\n`;
    }
    if (orderNotes.trim()) {
      msg += `• *Notes:* ${orderNotes}\n`;
    }
    msg += `\n-------------------------------\n\n`;
    msg += `🛍️ *Order Items:* \n\n`;

    cartItems.forEach((item, index) => {
      if (item.type === 'custom' && item.customCandle) {
        const c = item.customCandle;
        const waxName = WAX_TYPES.find(w => w.id === c.wax)?.name;
        const containerName = CONTAINER_TYPES.find(co => co.id === c.container)?.name;
        const wickName = WICK_TYPES.find(wi => wi.id === c.wick)?.name;
        
        // Format scent mixture
        const scentsStr = Object.entries(c.scents)
          .map(([scId, percent]) => {
            const scentName = SCENT_OPTIONS.find(s => s.id === scId)?.name || scId;
            return `${scentName} (${percent}%)`;
          })
          .join(', ');

        msg += `${index + 1}. 🕯️ *BESPOKE CUSTOM CANDLE* (Qty: ${item.quantity})\n`;
        msg += `   • *Wax Base:* ${waxName}\n`;
        msg += `   • *Container:* ${containerName}\n`;
        msg += `   • *Size:* ${c.size}\n`;
        msg += `   • *Wick:* ${wickName}\n`;
        msg += `   • *Scent Cocktail:* ${scentsStr}\n`;
        msg += `   • *Scent Throw Intensity:* ${c.scentIntensity ? c.scentIntensity.toUpperCase() : 'BALANCED'}\n`;
        msg += `   • *Label Custom Title:* "${c.label.text}" (${c.label.style.toUpperCase()})\n`;
        msg += `   • *Label Subtitle:* "${c.label.subtitle}"\n`;
        msg += `   • *Subtotal:* ${formatNaira(c.priceNgn * item.quantity)}\n\n`;
      } else if (item.type === 'standard' && item.standardProduct) {
        const p = item.standardProduct;
        msg += `${index + 1}. 🕯️ *SIGNATURE ${p.name.toUpperCase()}* (Qty: ${item.quantity})\n`;
        msg += `   • *Vessel & Size:* ${p.size} in ${p.container.toUpperCase()} Jar\n`;
        msg += `   • *Subtotal:* ${formatNaira(p.priceNgn * item.quantity)}\n\n`;
      }
    });

    msg += `===============================\n\n`;
    msg += `💳 *Financial Summary:*\n`;
    msg += `• *Items Subtotal:* ${formatNaira(itemsSubtotal)}\n`;
    msg += `• *Lagos Delivery Fee:* ${formatNaira(deliveryFee)}\n`;
    msg += `• *Grand Total:* *${formatNaira(grandTotal)}*\n\n`;
    msg += `-------------------------------\n`;
    msg += `_Order generated on Lumina Lagos. Looking forward to your luxury handpoured experience!_`;

    // Encode URL and redirect
    const cleanPhone = vendorPhone.replace(/\+/g, '').replace(/\s/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    
    // Redirect to WhatsApp
    window.open(waUrl, '_blank');
  };

  return (
    <section className="py-24 bg-[#120905] text-[#fcfaf6] border-t border-[#c5a880]/15" id="cart-checkout-section">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs text-[#c5a880] font-mono uppercase tracking-[0.2em] font-semibold block mb-3">My Shopping Bag</span>
          <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-white mb-4">
            Review &amp; Order Checkout
          </h2>
          <div className="h-[1px] w-16 bg-[#c5a880] mx-auto mb-5" />
          <p className="text-stone-300 text-xs sm:text-sm font-sans leading-relaxed font-light">
            Ready to ignite your space? Review your bespoke customized recipes and signature scent orders, select your delivery option, and send your checkout receipt directly to our WhatsApp.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-stone-950 border border-stone-800 rounded-2xl p-12 text-center max-w-xl mx-auto flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-medium text-stone-200 mb-2">Your Shopping Cart is Empty</h3>
              <p className="text-stone-400 text-xs sm:text-sm">Explore our signature blends, or play around with the bespoke candle creator to custom design your luxury scent.</p>
            </div>
            <a
              href="#candle-creator-section"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs tracking-wider uppercase font-medium rounded-lg transition-colors duration-300"
            >
              Start Creating Now
            </a>
          </motion.div>
        ) : (
          /* Cart Grid Content */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: Cart List (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-stone-950 rounded-2xl border border-stone-800 p-6 shadow-xl">
                <div className="flex justify-between items-center pb-4 border-b border-stone-800 mb-6">
                  <h3 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-500" />
                    <span>Cart Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
                  </h3>
                  <button
                    onClick={onClearCart}
                    className="text-xs font-mono text-stone-500 hover:text-red-400 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const isCustom = item.type === 'custom';
                    const title = isCustom ? 'Bespoke Custom Candle' : item.standardProduct?.name;
                    const price = isCustom ? item.customCandle!.priceNgn : item.standardProduct!.priceNgn;
                    const image = isCustom 
                      ? CONTAINER_TYPES.find(c => c.id === item.customCandle?.container)?.image 
                      : item.standardProduct?.image;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 hover:border-stone-800 transition-all text-left"
                      >
                        {/* Image & Description */}
                        <div className="flex gap-4 items-start flex-grow">
                          <img
                            src={image}
                            alt={title}
                            className="w-16 h-16 rounded-lg object-cover bg-stone-800 shrink-0 border border-stone-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-stone-100 text-sm sm:text-base">
                              {title}
                            </h4>
                            
                            {/* Specifications checklist depending on item type */}
                            {isCustom && item.customCandle ? (
                              <div className="text-[11px] text-stone-400 mt-1 space-y-0.5 leading-relaxed font-sans">
                                <p>• Base: {WAX_TYPES.find(w => w.id === item.customCandle?.wax)?.name}</p>
                                <p>• Vessel: {CONTAINER_TYPES.find(co => co.id === item.customCandle?.container)?.name} ({item.customCandle.size})</p>
                                <p>• Wick: {WICK_TYPES.find(wi => wi.id === item.customCandle?.wick)?.name}</p>
                                <p>• Blend: {Object.entries(item.customCandle.scents).map(([id, perc]) => `${SCENT_OPTIONS.find(s => s.id === id)?.name} (${perc}%)`).join(', ')}</p>
                                <p>• Throw Intensity: <span className="capitalize font-semibold text-[#c5a880]">{item.customCandle.scentIntensity || 'balanced'}</span></p>
                                <p className="font-mono text-[10px] text-amber-300 mt-1 bg-stone-950/80 px-2 py-0.5 rounded-sm inline-block border border-stone-850">
                                  Label: &ldquo;{item.customCandle.label.text}&rdquo; ({item.customCandle.label.style})
                                </p>
                              </div>
                            ) : (
                              <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                                Signature {item.standardProduct?.size} in luxury {item.standardProduct?.container.toUpperCase()} jar. Crafted with cotton/wood wicks and signature scents.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quantity Counter & Price Action */}
                        <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-stone-800/80 pt-4 sm:pt-0 gap-3">
                          <span className="font-mono font-bold text-sm text-stone-100">
                            {formatNaira(price * item.quantity)}
                          </span>

                          <div className="flex items-center gap-1">
                            <div className="flex items-center bg-stone-950 border border-stone-800 rounded-lg overflow-hidden p-0.5">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3.5 font-mono text-xs text-stone-200">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-2 text-stone-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Vendor setup settings (extremely helpful for real deployment) */}
              <div className="bg-stone-950 rounded-2xl border border-stone-800 p-4 shadow-md text-left">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center justify-between w-full text-stone-400 hover:text-stone-200 transition-colors text-xs font-mono"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>MERCHANT SETTING: SET WHATSAPP CONTACT</span>
                  </span>
                  <span>{showSettings ? 'CLOSE' : 'OPEN'}</span>
                </button>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="pt-2 border-t border-stone-800 flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-grow w-full">
                          <label className="block text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-1">
                            WhatsApp Business Phone (Include country code e.g. 2348030001234)
                          </label>
                          <input
                            type="text"
                            value={vendorPhone}
                            onChange={(e) => setVendorPhone(e.target.value)}
                            className="w-full px-3.5 py-2 text-xs bg-stone-900 border border-stone-800 text-stone-100 rounded-lg focus:outline-hidden focus:border-amber-500"
                            placeholder="e.g. 2348030001234"
                          />
                        </div>
                        <button
                          onClick={handleSaveVendorPhone}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shrink-0"
                        >
                          {isSavedSettings ? <CheckCircle className="w-4.5 h-4.5" /> : <Save className="w-4 h-4" />}
                          <span>{isSavedSettings ? 'Saved!' : 'Save Number'}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-500 font-sans mt-2">
                        Configure this phone number to direct the orders to your personal/business WhatsApp line. It is safely stored in your local browser cache.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>


            {/* RIGHT: Delivery details and Checkout Forms (5 cols) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* Delivery Details Container */}
              <div id="checkout-delivery-card" className="bg-[#120905] rounded-2xl border border-[#c5a880]/20 p-6 shadow-xl space-y-6 scroll-mt-24">
                <h3 className="text-lg font-serif font-semibold text-white flex items-center gap-2 pb-4 border-b border-stone-850">
                  <MapPin className="w-5 h-5 text-[#c5a880]" />
                  <span>Delivery & Customer Details</span>
                </h3>

                {/* Inline Animated Error Alert */}
                <AnimatePresence>
                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 text-xs font-sans overflow-hidden"
                    >
                      <AlertTriangle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-grow">
                        <p className="font-semibold text-red-200">Delivery Detail Needed</p>
                        <p className="text-red-300/90 mt-0.5 font-light">{validationError}</p>
                      </div>
                      <button 
                        onClick={() => setValidationError('')}
                        className="text-red-400 hover:text-red-200 font-bold ml-auto text-sm leading-none focus:outline-hidden"
                      >
                        ×
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name */}
                <div>
                  <label className="block text-[10px] font-mono text-[#c5a880] uppercase tracking-widest mb-1.5 font-semibold">Your Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-800 text-stone-100 rounded-xl focus:outline-hidden focus:border-[#c5a880] text-sm font-sans"
                      placeholder="e.g. Tola Alabi"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-mono text-[#c5a880] uppercase tracking-widest mb-1.5 font-semibold">Phone Number (WhatsApp) *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-800 text-stone-100 rounded-xl focus:outline-hidden focus:border-[#c5a880] text-sm font-sans"
                      placeholder="e.g. 08060879654"
                    />
                  </div>
                </div>

                {/* Lagos delivery region select */}
                <div>
                  <label className="block text-[10px] font-mono text-[#c5a880] uppercase tracking-widest mb-1.5 font-semibold">Lagos Delivery Region *</label>
                  <select
                    value={selectedRegionId}
                    onChange={(e) => setSelectedRegionId(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-800 text-stone-100 rounded-xl focus:outline-hidden focus:border-[#c5a880] text-sm font-sans outline-hidden"
                  >
                    {LAGOS_DELIVERY_AREAS.map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name} (+{formatNaira(area.feeNgn)})
                      </option>
                    ))}
                  </select>
                  
                  {/* Delivery notification card */}
                  <div className="mt-2.5 p-3 rounded-lg bg-stone-900 border border-stone-850 flex gap-2.5 items-center">
                    <Info className="w-4 h-4 text-[#c5a880] shrink-0" />
                    <span className="text-[11px] text-stone-400">
                      Estimated Delivery Period: <strong className="text-stone-200">{selectedRegion.time}</strong>
                    </span>
                  </div>
                </div>

                {/* Specific physical Address (Show conditionally if not local pickup) */}
                {selectedRegionId !== 'gbagada-pickup' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="block text-[10px] font-mono text-[#c5a880] uppercase tracking-widest mb-1 font-semibold">Detailed Physical Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-stone-900 border border-stone-800 text-stone-100 rounded-xl focus:outline-hidden focus:border-[#c5a880] text-sm font-sans"
                      placeholder="e.g. House 14, Olusegun Street, Phase 2, Gbagada, Lagos"
                    />
                  </motion.div>
                )}

                {/* Additional Notes */}
                <div>
                  <label className="block text-[10px] font-mono text-[#c5a880] uppercase tracking-widest mb-1.5 font-semibold">Order Notes / Custom Requests</label>
                  <div className="relative">
                    <Clipboard className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
                    <textarea
                      rows={2}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-800 text-stone-100 rounded-xl focus:outline-hidden focus:border-[#c5a880] text-sm font-sans"
                      placeholder="e.g. Please pack custom candle in a gift bag; it's a gift."
                    />
                  </div>
                </div>
              </div>

              {/* Order pricing summary card */}
              <div className="bg-[#120905] rounded-2xl border border-[#c5a880]/20 p-6 shadow-xl space-y-4">
                <h4 className="text-xs font-mono text-[#c5a880] uppercase tracking-widest font-semibold pb-2 border-b border-stone-800">
                  Billing & Order Financials
                </h4>
                
                <div className="space-y-2 text-sm font-sans text-stone-300">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-mono">{formatNaira(itemsSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lagos Delivery Fee</span>
                    <span className="font-mono">{formatNaira(deliveryFee)}</span>
                  </div>
                  <div className="h-px bg-stone-800/80 my-2" />
                  <div className="flex justify-between text-base font-serif font-semibold text-white">
                    <span>Grand Total</span>
                    <span className="font-mono text-[#c5a880]">{formatNaira(grandTotal)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium rounded-xl text-xs tracking-wider uppercase transition-all duration-300 shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2"
                    id="checkout-wa-btn"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Order via WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2.5 justify-center text-[10px] text-stone-500 pt-2 border-t border-stone-850">
                  <Shield className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>Security Guaranteed. Orders are manually verified by you.</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
