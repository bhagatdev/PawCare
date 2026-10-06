import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, FileUp, Plus, Star, Check, ShieldAlert, Sparkles, Filter, Search } from 'lucide-react';
import { mockProducts } from '../data/mockData';

export default function PharmacySection({ onAddToCart, onOpenPrescriptionModal }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [rxOnly, setRxOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState([]);

  const categories = [
    { id: 'all', label: 'All Medicines' },
    { id: 'flea_tick', label: 'Flea & Tick' },
    { id: 'supplements', label: 'Supplements' },
    { id: 'dermatology', label: 'Dermatology & Skin' },
    { id: 'digestive', label: 'Digestive Probiotics' },
    { id: 'antibiotics', label: 'Antibiotics' },
    { id: 'eye_ear', label: 'Eye & Ear Care' },
  ];

  const filteredProducts = mockProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesRx = !rxOnly || p.requiresPrescription;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRx && matchesSearch;
  });

  const handleAdd = (product) => {
    onAddToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Rx Upload Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
        <div className="lg:col-span-8 text-left">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Pill className="w-4 h-4 text-teal-400" />
            <span>Licensed Veterinary Pharmacy & Delivery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Certified Pet Medicines, Delivered Same-Day
          </h2>
          <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
            100% genuine FDA-approved pet medications, heartworm preventatives, joint nutrition, and therapeutic diets with licensed pharmacist verification.
          </p>
        </div>

        {/* Prescription Upload Callout Card */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-teal-900/30 via-slate-900/80 to-slate-900/90 border border-teal-500/30 flex flex-col justify-between text-left shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Have a Vet Prescription?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Upload your doctor's script for instant verification and automatic refills.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPrescriptionModal}
            className="mt-4 w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02]"
          >
            <FileUp className="w-4 h-4" />
            Upload Prescription Script
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRxOnly(!rxOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              rxOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Rx Required Only
          </button>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicine brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => {
          const isAdded = addedIds.includes(product.id);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl bg-slate-900/85 border border-slate-800 hover:border-teal-500/40 p-5 flex flex-col justify-between shadow-xl transition-all text-left group"
            >
              <div>
                {/* Image and Badges */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 h-48 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Chip */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-900/90 text-teal-300 border border-teal-500/30 backdrop-blur-md">
                    {product.categoryName}
                  </span>

                  {/* Prescription Indicator */}
                  {product.requiresPrescription ? (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold bg-amber-500/90 text-black flex items-center gap-1 shadow-md">
                      <ShieldAlert className="w-3 h-3" />
                      Rx Required
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/80 text-white backdrop-blur-md">
                      Over The Counter
                    </span>
                  )}
                </div>

                {/* Brand & Title */}
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{product.brand}</p>
                  <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{product.description}</p>
                </div>

                {/* Dosage advice */}
                <div className="mt-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-teal-400/90">
                  <span className="font-semibold text-slate-300">Dosage: </span>
                  {product.dosage}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-white">{product.rating}</span>
                  <span className="text-[11px] text-slate-400">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Bottom Price & Add to Cart */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">
                      ${(product.discountPrice || product.price).toFixed(2)}
                    </span>
                    {product.discountPrice && (
                      <span className="text-xs text-slate-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">In Stock • Fast Delivery</span>
                </div>

                <button
                  onClick={() => handleAdd(product)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isAdded
                      ? 'bg-emerald-500 text-white'
                      : 'bg-teal-500 hover:bg-teal-400 text-white shadow-md shadow-teal-500/20 hover:scale-105'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
