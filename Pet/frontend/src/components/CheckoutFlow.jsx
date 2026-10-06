import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ChevronLeft,
  Lock,
  Phone,
  MapPin,
  Home
} from 'lucide-react';

export default function CheckoutFlow({
  isOpen = false,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onOrderPlaced,
}) {
  const [step, setStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment, 4: Confirmation
  const [shippingData, setShippingData] = useState({
    fullName: 'Elena Vasquez',
    phone: '+1 (555) 234-8890',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    postalCode: '97477',
    notes: 'Please ring bell; leave in shade if pet is in yard.',
  });
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cod' | 'insurance'
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 4.99;
  const grandTotal = subtotal + shippingFee;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderSummary = {
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        items: cartItems,
        total: grandTotal,
        shipping: shippingData,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setCompletedOrder(orderSummary);
      setIsProcessing(false);
      setStep(4);
      if (onOrderPlaced) onOrderPlaced(orderSummary);
    }, 1400);
  };

  const handleDismiss = () => {
    setStep(1);
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Semi-transparent Backdrop Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleDismiss}
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Responsive Slide Drawer (Bottom on mobile, Right on desktop) */}
      <div className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-lg z-50">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-full bg-white rounded-t-3xl md:rounded-t-none md:rounded-l-3xl shadow-2xl flex flex-col justify-between max-h-[92vh] md:h-full text-left"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step > 1 && step < 4 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="min-h-[44px] min-w-[44px] rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {step === 1 && 'Your Medicine Cart'}
                  {step === 2 && 'Shipping & Delivery Address'}
                  {step === 3 && 'Payment & Verification'}
                  {step === 4 && 'Order Confirmed!'}
                </h2>
                <p className="text-xs text-slate-500">
                  {step === 1 && `${cartItems.length} items in package`}
                  {step === 2 && 'Step 2 of 3 • Direct clinic delivery'}
                  {step === 3 && 'Step 3 of 3 • Encrypted checkout'}
                  {step === 4 && 'Dispatched to licensed fulfillment center'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="min-h-[44px] min-w-[44px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content by Step */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* STEP 1: CART ITEMS */}
            {step === 1 && (
              <>
                {cartItems.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 space-y-3">
                    <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
                    <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                    <p className="text-xs text-slate-500">Add medicines to initiate delivery.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden">
                          <img
                            src={item.image_url || item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200';
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                          <span className="text-xs font-semibold text-teal-700">
                            ${Number(item.price).toFixed(2)}
                          </span>

                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, Math.max(0, (item.quantity || 1) - 1))}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-xs active:bg-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 px-1">{item.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-xs active:bg-slate-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem && onRemoveItem(item.id)}
                          className="min-h-[44px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-rose-500"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: SHIPPING DETAILS (MOBILE KEYBOARD OPTIMIZED) */}
            {step === 2 && (
              <form id="shipping-form" onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={shippingData.fullName}
                    onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone (Delivery SMS)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      className="w-full min-h-[44px] pl-10 pr-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                  <div className="relative">
                    <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="street-address"
                      value={shippingData.street}
                      onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                      className="w-full min-h-[44px] pl-10 pr-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      value={shippingData.postalCode}
                      onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    value={shippingData.notes}
                    onChange={(e) => setShippingData({ ...shippingData, notes: e.target.value })}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </form>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  {[
                    { id: 'card', label: 'Credit or Debit Card', desc: 'Encrypted via Stripe / PawCare Vault', icon: CreditCard },
                    { id: 'insurance', label: 'Pet Health Savings / Insurance', desc: 'Direct claim billing (Nationwide, Trupanion, Lemonade)', icon: ShieldCheck },
                    { id: 'cod', label: 'Pay On Delivery', desc: 'Cash or mobile QR upon medicine handover', icon: Truck },
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = paymentMethod === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPaymentMethod(p.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold block">{p.label}</span>
                            <span className="text-[11px] text-slate-500">{p.desc}</span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-teal-600 bg-teal-600' : 'border-slate-300'}`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Lock className="w-3.5 h-3.5 text-teal-600" />
                    <span>256-Bit SSL Pharmacy Security</span>
                  </div>
                  <p className="text-[11px]">
                    Prescription verifications and automated refill reminders are automatically linked to Elena's pet passport.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: ORDER CONFIRMED */}
            {step === 4 && completedOrder && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Order Successfully Placed!</h3>
                  <p className="text-xs text-slate-500 mt-1">Confirmation #{completedOrder.orderId}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery To:</span>
                    <span className="font-semibold text-slate-800">{completedOrder.shipping.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Address:</span>
                    <span className="font-semibold text-slate-800">{completedOrder.shipping.street}, {completedOrder.shipping.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Delivery:</span>
                    <span className="font-semibold text-emerald-700">Tomorrow by 4:00 PM</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-800">Total Paid:</span>
                    <span className="font-extrabold text-teal-800 text-sm">${completedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full min-h-[44px] py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Done & Back to Store
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions (Step 1-3) */}
          {step < 4 && cartItems.length > 0 && (
            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Total (incl. delivery):</span>
                <span className="text-lg font-extrabold text-teal-800">${grandTotal.toFixed(2)}</span>
              </div>

              {step === 1 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full min-h-[44px] py-3 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="submit"
                  form="shipping-form"
                  className="w-full min-h-[44px] py-3 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="w-full min-h-[44px] py-3 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Authorize Order (${grandTotal.toFixed(2)})</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
