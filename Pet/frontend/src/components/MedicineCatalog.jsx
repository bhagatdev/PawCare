import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Pill, ShoppingCart, RefreshCw, AlertCircle, CheckCircle2, X } from 'lucide-react';
import api from '../api';

const CATEGORIES = [
  'All',
  'Supplements',
  'First Aid',
  'Antibiotics',
  'Grooming',
  'General',
];

export default function MedicineCatalog() {
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedIds, setAddedIds] = useState([]);

  // Fetch medicines dynamically from DRF whenever searchQuery or selectedCategory changes
  useEffect(() => {
    const controller = new AbortController();

    const fetchMedicines = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = {};
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        const response = await api.get('medicines/', {
          params,
          signal: controller.signal,
        });

        // Handle both DRF paginated ({ results: [...] }) and unpaginated responses
        const data = response.data.results || response.data;
        setMedicines(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('Error fetching medicines:', err);
          setError('Unable to load medicines from the server. Please check your backend connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce search requests slightly (250ms) to prevent spamming the backend
    const timeoutId = setTimeout(() => {
      fetchMedicines();
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (id) => {
    setAddedIds((prev) => [...prev, id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((item) => item !== id));
    }, 1500);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left font-sans">
      {/* Title & Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Pill className="w-4 h-4 text-teal-400" />
            <span>Pet Pharmacy Directory</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Veterinary Medicines & Treatments
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Search certified prescription treatments, supplements, and pet healthcare supplies.
          </p>
        </div>

        <span className="text-xs text-slate-400 self-start md:self-auto bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full font-medium">
          Showing {medicines.length} {medicines.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* Search Bar & Category Filter Controls */}
      <div className="space-y-4 mb-8">
        {/* Search Input Field */}
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by medicine name, symptoms, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Horizontal Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25 ring-1 ring-teal-400'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 animate-pulse"
            >
              <div className="h-48 bg-slate-800 rounded-2xl" />
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error Alert */}
      {!loading && error && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-4 max-w-2xl mx-auto my-8">
          <AlertCircle className="w-6 h-6 shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Connection Error</h4>
            <p className="text-xs text-rose-200">{error}</p>
          </div>
        </div>
      )}

      {/* Empty Search / Filter State */}
      {!loading && !error && medicines.length === 0 && (
        <div className="py-20 text-center text-slate-400 space-y-3 bg-slate-900/30 rounded-3xl border border-slate-800/80 p-8">
          <Pill className="w-12 h-12 mx-auto text-slate-600" />
          <h4 className="text-base font-bold text-white">No Medicines Found</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No products match "{searchQuery}" in category "{selectedCategory}". Try clearing your filters or search keywords.
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold transition-all"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Animated Re-arranging Medicine Grid with layout prop */}
      {!loading && !error && medicines.length > 0 && (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {medicines.map((med) => {
              const isAdded = addedIds.includes(med.id);
              const inStock = med.stock_quantity > 0;

              return (
                <motion.div
                  layout
                  key={med.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-3xl bg-slate-900/85 border border-slate-800/90 hover:border-teal-500/50 p-5 flex flex-col justify-between shadow-xl hover:shadow-teal-500/10 transition-all backdrop-blur-sm"
                >
                  <div>
                    {/* Image & Category Pill */}
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-950 mb-4">
                      {med.image_url ? (
                        <img
                          src={med.image_url}
                          alt={med.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950">
                          <Pill className="w-10 h-10 mb-1" />
                          <span className="text-[11px]">No image provided</span>
                        </div>
                      )}

                      {/* Category Tag */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/90 text-teal-300 border border-teal-500/30 backdrop-blur-md">
                        {med.category || 'General'}
                      </span>

                      {/* Stock Badge */}
                      <span
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-md ${
                          inStock
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-rose-500/90 text-white'
                        }`}
                      >
                        {inStock ? `${med.stock_quantity} In Stock` : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Name & Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                        {med.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {med.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Add to Cart Action */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Price
                      </span>
                      <span className="text-xl font-extrabold text-teal-400">
                        ₹{Number(med.price_inr || med.price).toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!inStock}
                      onClick={() => handleAddToCart(med.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        !inStock
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-500 text-white'
                          : 'bg-teal-500 hover:bg-teal-400 text-white shadow-md shadow-teal-500/20 active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
