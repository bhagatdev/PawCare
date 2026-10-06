import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill,
  Search,
  SlidersHorizontal,
  X,
  IndianRupee,
  ShoppingBag,
  Plus,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import api from '../api';

const CATEGORIES = [
  'All',
  'Supplements',
  'First Aid',
  'Antibiotics',
  'Grooming',
  'Nutrition',
];

const FALLBACK_PHARMACY = [
  {
    id: 1,
    name: 'Melonex Pet Oral Suspension (Meloxicam 1.5mg/ml, 10ml)',
    category: 'First Aid',
    price_inr: 145.00,
    stock: 42,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    description: 'Intas Pharmaceuticals. Fast-acting anti-inflammatory oral suspension for acute musculoskeletal pain.'
  },
  {
    id: 2,
    name: 'Savavet Kiwof Plus Broad Spectrum Dewormer (4 Tabs)',
    category: 'Antibiotics',
    price_inr: 210.00,
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400',
    description: 'Praziquantel, Pyrantel embonate & Febantel chewable tablets for broad-spectrum roundworms & tapeworms.'
  },
  {
    id: 3,
    name: 'Bravecto Chewable Fluralaner Tablet (10-20 kg)',
    category: 'Supplements',
    price_inr: 1850.00,
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
    description: 'MSD Animal Health. Sustained 12-week chewable oral protection against ticks and fleas in canines.'
  },
  {
    id: 4,
    name: 'Pet Derm Medicated Chlorhexidine Shampoo (200ml)',
    category: 'Grooming',
    price_inr: 395.00,
    stock: 24,
    image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=400',
    description: 'Antifungal and antimicrobial therapeutic cleansing wash for dermatitis, hot spots & itchy coat.'
  },
  {
    id: 5,
    name: 'Himalaya Liv.52 Pet Liver Support Tonic (110ml)',
    category: 'Supplements',
    price_inr: 175.00,
    stock: 60,
    image_url: 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?auto=format&fit=crop&q=80&w=400',
    description: 'Himalaya Wellness. Natural herbal hepatoprotective supplement promoting appetite and liver repair.'
  },
  {
    id: 6,
    name: 'Ceff Pet (Cephalexin 300mg Strip of 6)',
    category: 'Antibiotics',
    price_inr: 240.00,
    stock: 28,
    image_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=400',
    description: 'Potent cephalosporin antibiotic prescribed for bacterial skin and soft-tissue infections.'
  },
  {
    id: 7,
    name: 'EarKleen Otic Cleanser with Tea Tree Oil (50ml)',
    category: 'First Aid',
    price_inr: 280.00,
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400',
    description: 'Soothing antiseptic ear drops that eliminate wax buildup and deodorize infected ear canals.'
  },
  {
    id: 8,
    name: 'Vivaldis Samolin Gut Probiotics Sachets (10s)',
    category: 'Nutrition',
    price_inr: 360.00,
    stock: 8,
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400',
    description: 'Live gut probiotics and prebiotics restoring stool balance during antibiotic therapy.'
  }
];

export default function Pharmacy({ onAddToCart, onOpenCart, cartCount = 0 }) {
  const [medicines, setMedicines] = useState(FALLBACK_PHARMACY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [addedItemName, setAddedItemName] = useState(null);

  useEffect(() => {
    async function loadMedicines() {
      try {
        const res = await api.get('medicines/');
        const data = res.data.results || res.data;
        if (Array.isArray(data) && data.length > 0) {
          setMedicines(data);
        }
      } catch (err) {
        console.warn('Backend medicines API offline, using local Jamshedpur catalog:', err);
      }
    }
    loadMedicines();
  }, []);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const name = m.name.toLowerCase();
      const desc = (m.description || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || desc.includes(query);
      const matchesCategory =
        selectedCategory === 'All' || m.category?.toLowerCase() === selectedCategory.toLowerCase();
      const price = Number(m.price_inr || m.price) || 0;
      const matchesPrice = price <= maxPrice;
      const matchesStock = onlyInStock ? (m.stock || m.stock_quantity) > 0 : true;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });
  }, [medicines, searchQuery, selectedCategory, maxPrice, onlyInStock]);

  const handleAdd = (med) => {
    if (onAddToCart) onAddToCart(med);
    setAddedItemName(med.name);
    setTimeout(() => setAddedItemName(null), 2000);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(2500);
    setOnlyInStock(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              <span>Certified Indian Veterinary Dispensary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Veterinary Pharmaceuticals & Care Store
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Temperature-controlled medicine delivery across Bistupur, Sakchi, and Kadma.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenCart}
              className="min-h-[44px] px-5 rounded-2xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md shadow-teal-700/20 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Added Toast */}
        <AnimatePresence>
          {addedItemName && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-4 z-50 bg-teal-800 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Added to Basket: {addedItemName}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid: Desktop Sidebar Filters (3 cols) + Product Grid (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ------------------------------------------------------------- */}
          {/* DESKTOP SIDEBAR FILTERS (Hidden on Mobile)                     */}
          {/* ------------------------------------------------------------- */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                <span>Filters & Price</span>
              </h3>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Maximum Price</span>
                <span className="text-teal-700">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹100</span>
                <span>₹3,000</span>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Category
              </span>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-teal-700 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Toggle */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <span>Show In-Stock Only</span>
              </label>
            </div>

            {/* Delivery Guarantee Info */}
            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Truck className="w-3.5 h-3.5 text-teal-600" />
                <span>Jamshedpur Cold-Box</span>
              </div>
              <p className="text-[11px] text-teal-700">
                Free insulated delivery on orders above ₹499 across Bistupur, Sakchi, and Kadma.
              </p>
            </div>
          </aside>

          {/* ------------------------------------------------------------- */}
          {/* MAIN PRODUCT AREA (9 cols)                                    */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Search Bar + Mobile Filter Trigger */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search medicines (e.g. Melonex, Bravecto, Liv.52, Ceff Pet)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full min-h-[44px] pl-10 pr-4 rounded-2xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden min-h-[44px] px-4 rounded-2xl bg-white border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                <span>Filters</span>
              </button>
            </div>

            {/* Results Count Banner */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Showing <strong>{filteredMedicines.length}</strong> pharmaceuticals</span>
              {selectedCategory !== 'All' && (
                <span className="font-bold text-teal-700">Category: {selectedCategory}</span>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMedicines.map((med) => {
                const price = Number(med.price_inr || med.price) || 0;
                const inStock = (med.stock || med.stock_quantity || 10) > 0;

                return (
                  <motion.div
                    key={med.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="w-full h-44 rounded-2xl bg-slate-100 overflow-hidden mb-3 relative">
                        <img
                          src={med.image_url}
                          alt={med.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400';
                          }}
                        />
                        <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-teal-900 text-[10px] font-black px-2.5 py-1 rounded-lg border border-slate-200">
                          {med.category}
                        </span>
                        <span
                          className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                        {med.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                        {med.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                        <span className="text-base font-black text-teal-800">
                          ₹{price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(med)}
                        disabled={!inStock}
                        className="min-h-[40px] px-4 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-40 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredMedicines.length === 0 && (
              <div className="py-20 text-center text-slate-400 space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
                <Pill className="w-12 h-12 mx-auto text-slate-300" />
                <h4 className="text-base font-bold text-slate-800">No Medicines Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your price slider or searching for a different pharmaceutical active ingredient.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* MOBILE SLIDING FILTER DRAWER (< lg screens)                   */}
        {/* ------------------------------------------------------------- */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className="relative w-4/5 max-w-sm bg-white h-full p-6 shadow-2xl space-y-6 overflow-y-auto text-left z-10"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Filter Medicines</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Category
                  </span>
                  <div className="space-y-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                          selectedCategory === cat
                            ? 'bg-teal-700 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Max Price</span>
                    <span className="text-teal-700">₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-md"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
