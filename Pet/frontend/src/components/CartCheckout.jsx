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
  Smartphone,
  Building,
  CheckCircle2,
  Lock,
  IndianRupee,
  Sparkles,
  MapPin
} from 'lucide-react';
import api from '../api';

export default function CartCheckout({
  isOpen = false,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onOrderCompleted,
}) {
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('14/B, Contractors Area, Main Road, Bistupur, Jamshedpur');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Subtotal in INR
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price_inr || item.price) || 0) * (item.quantity || 1),
    0
  );

  // Free delivery across Jamshedpur for orders >= ₹499
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const grandTotal = subtotal + deliveryFee;

  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const handleProcessRazorpay = async () => {
    setIsProcessing(true);

    const generatedOrderId = `ORD-JSR-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedPaymentId = `pay_JSR_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const orderPayload = {
      status: 'Placed',
      payment_status: 'Paid',
      total_amount_inr: grandTotal,
      delivery_zone: 'Bistupur Hub -> Sakchi Market Express',
      shipping_address: deliveryAddress,
      razorpay_order_id: generatedOrderId,
      razorpay_payment_id: generatedPaymentId,
    };

    try {
      await api.post('orders/', orderPayload);
    } catch (err) {
      console.warn('Backend order recording local fallback:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      const fakeOrder = {
        orderId: generatedOrderId,
        razorpayPaymentId: generatedPaymentId,
        items: [...cartItems],
        totalAmount: grandTotal,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        deliveryZone: 'Bistupur Hub -> Sakchi -> Kadma Route',
        destinationAddress: deliveryAddress,
        status: 'Dispatched',
      };
      setConfirmedOrder(fakeOrder);
      if (onOrderCompleted) {
        onOrderCompleted(fakeOrder);
      }
    }, 1200);
  };

  const handleCloseAll = () => {
    setIsRazorpayModalOpen(false);
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans text-left">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Sliding Side Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
              aria-label="Shopping Cart"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      Medicine Basket
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {totalItemCount} {totalItemCount === 1 ? 'product' : 'products'} • Jamshedpur Express
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="py-24 text-center text-slate-400 space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Your basket is empty</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore our veterinary pharmacy store to add supplements, syrups, and tablets.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const price = Number(item.price_inr || item.price) || 0;
                    const quantity = item.quantity || 1;

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-200 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200';
                              }}
                            />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-slate-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs font-black text-teal-700 mt-0.5">
                            ₹{price.toFixed(2)}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity &&
                                onUpdateQuantity(item.id, Math.max(0, quantity - 1))
                              }
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors text-xs cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 px-1">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity &&
                                onUpdateQuantity(item.id, quantity + 1)
                              }
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors text-xs cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right flex flex-col justify-between items-end h-14">
                          {onRemoveItem && (
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <span className="text-xs font-bold text-slate-900">
                            ₹{(price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer & Checkout CTA */}
              {cartItems.length > 0 && (
                <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Free Jamshedpur Delivery &gt; ₹499
                    </span>
                    <span className="font-bold text-slate-800">
                      {deliveryFee === 0 ? 'Qualified' : `Add ₹${(499 - subtotal).toFixed(0)} more`}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Delivery (Bistupur Hub)</span>
                      <span className="font-semibold text-emerald-700">
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Payable</span>
                      <span className="text-base font-black text-teal-800">
                        ₹{grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRazorpayModalOpen(true)}
                    className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-black text-sm shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <span>Proceed to Pay (₹{grandTotal.toFixed(2)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.aside>
          </div>

          {/* ========================================================= */}
          {/* RAZORPAY CHECKOUT FORM MODAL                              */}
          {/* ========================================================= */}
          <AnimatePresence>
            {isRazorpayModalOpen && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left"
                >
                  {/* Razorpay Top Header */}
                  <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                        <Lock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Razorpay Trusted Indian Payment Gateway</span>
                      </div>
                      <h3 className="text-base font-extrabold mt-0.5">PawCare Dispensary Jamshedpur</h3>
                      <p className="text-[11px] text-slate-300">GSTIN: 20AABCP1330F1Z5 • Drug Lic: JH-JSR-2022-2910</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-300 block uppercase">Payable</span>
                      <span className="text-lg font-black text-white">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {confirmedOrder ? (
                    <div className="p-6 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Payment Confirmed!</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Payment ID: <span className="font-mono font-bold text-slate-700">{confirmedOrder.razorpayPaymentId}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Order ID: <span className="font-mono font-bold text-teal-700">{confirmedOrder.orderId}</span>
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-800 text-left space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                          <span>Cold-Box Packaging Dispatched</span>
                        </div>
                        <p className="text-[11px] text-teal-700">
                          Assigned to Ramesh Yadav (Hero Electric Optima - Cold Carrier). ETA ~25 mins to {confirmedOrder.destinationAddress}.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCloseAll}
                        className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        Track Shipment in Dashboard
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Destination Address */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          <span>Delivery Address in Jamshedpur</span>
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      {/* Payment Methods */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Choose Payment Option
                        </label>

                        {/* UPI */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                            paymentMethod === 'upi'
                              ? 'border-indigo-600 bg-indigo-50/60 font-bold text-indigo-900'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                              <span className="text-[10px] text-slate-400">Zero transaction surcharge</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-indigo-600">Fastest</span>
                        </button>

                        {/* Cards */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                            paymentMethod === 'card'
                              ? 'border-indigo-600 bg-indigo-50/60 font-bold text-indigo-900'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">Credit / Debit Cards (RuPay, Visa, Mastercard)</span>
                              <span className="text-[10px] text-slate-400">Domestic & International Indian cards</span>
                            </div>
                          </div>
                        </button>

                        {/* Netbanking */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('netbanking')}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                            paymentMethod === 'netbanking'
                              ? 'border-indigo-600 bg-indigo-50/60 font-bold text-indigo-900'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                              <Building className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">Net Banking</span>
                              <span className="text-[10px] text-slate-400">SBI, HDFC, ICICI, Axis, Bank of India</span>
                            </div>
                          </div>
                        </button>
                      </div>

                      {paymentMethod === 'upi' && (
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter UPI ID (e.g. mobile@upi)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setUpiId('9876543210@paytm')}
                            className="px-2.5 py-1 text-[11px] bg-indigo-100 text-indigo-700 rounded-xl font-bold"
                          >
                            Fill Demo
                          </button>
                        </div>
                      )}

                      {/* Modal Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsRazorpayModalOpen(false)}
                          disabled={isProcessing}
                          className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleProcessRazorpay}
                          disabled={isProcessing}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-black shadow-md shadow-blue-800/20 flex items-center justify-center gap-1.5"
                        >
                          {isProcessing ? (
                            <span>Securing Payment...</span>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4" />
                              <span>Authorize ₹{grandTotal.toFixed(2)}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
