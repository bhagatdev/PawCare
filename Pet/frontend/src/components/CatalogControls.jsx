import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  IndianRupee,
  RotateCcw,
  Check,
  Tag
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Supplements',
  'First Aid',
  'Antibiotics',
  'Grooming',
  'General',
];

const SORT_OPTIONS = [
  { id: '', label: 'Relevance / Default' },
  { id: 'price', label: 'Price: Low to High' },
  { id: '-price', label: 'Price: High to Low' },
  { id: 'name', label: 'Alphabetical: A to Z' },
];

export default function CatalogControls({ onFilterChange, onSortChange }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sliderMax, setSliderMax] = useState(2500);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Debounced emission for price inputs to prevent spamming the Django backend
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange({
          category: selectedCategory === 'All' ? '' : selectedCategory,
          min_price: minPrice ? Number(minPrice) : '',
          max_price: maxPrice ? Number(maxPrice) : '',
        });
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [minPrice, maxPrice, selectedCategory, onFilterChange]);

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setIsSortDropdownOpen(false);
    if (onSortChange) {
      onSortChange(option.id);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSort(SORT_OPTIONS[0]);
    setMinPrice('');
    setMaxPrice('');
    setSliderMax(2500);
    if (onSortChange) onSortChange('');
    if (onFilterChange) onFilterChange({ category: '', min_price: '', max_price: '' });
  };

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (selectedSort.id ? 1 : 0);

  return (
    <div className="w-full mb-8 font-sans text-left">
      {/* ------------------------------------------------------------- */}
      {/* MOBILE TRIGGER BUTTON (< md screens)                          */}
      {/* ------------------------------------------------------------- */}
      <div className="flex md:hidden items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex-1 min-h-[44px] px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-800 font-bold text-xs flex items-center justify-center gap-2 active:bg-slate-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <span>Filters & Sort</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="min-h-[44px] px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center gap-1.5"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP HORIZONTAL CONTROL BAR (>= md screens)                */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:flex flex-col gap-4 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm">
        {/* Upper Row: Categories & Quick Sort */}
        <div className="flex items-center justify-between gap-4">
          {/* Scrollable Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-500'
                      : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200/50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Desktop Sort Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <span className="text-slate-400 font-medium">Sort by:</span>
              <span className="text-teal-800">{selectedSort.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu with Framer Motion */}
            <AnimatePresence>
              {isSortDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-30"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSortSelect(opt)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        selectedSort.id === opt.id
                          ? 'bg-teal-50 text-teal-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedSort.id === opt.id && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Lower Row: Price Range Input & Slider */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 gap-6">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
              Price Range:
            </span>

            {/* Min Price Input */}
            <div className="relative w-28">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <span className="text-slate-400 text-xs font-bold">to</span>

            {/* Max Price Input */}
            <div className="relative w-28">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Visual Slider */}
            <div className="flex-1 ml-2 flex items-center gap-2">
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={maxPrice || sliderMax}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setSliderMax(Number(e.target.value));
                }}
                className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                ₹{maxPrice || sliderMax}
              </span>
            </div>
          </div>

          {/* Reset Filters Link */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE SLIDING BOTTOM-SHEET DRAWER                            */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden overflow-hidden font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs"
            />

            {/* Sliding Bottom Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl p-6 space-y-5 max-h-[88vh] overflow-y-auto z-50 text-left"
            >
              {/* Drawer Top Handle & Title */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">Filters & Sorting</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="min-h-[44px] min-w-[44px] rounded-xl text-slate-400 hover:text-slate-700 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Sort Options */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Sort By
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSortSelect(opt)}
                      className={`min-h-[44px] px-4 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                        selectedSort.id === opt.id
                          ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedSort.id === opt.id && <Check className="w-4 h-4 text-teal-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Price Range */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Price Filter (₹)
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Minimum</span>
                    <input
                      type="number"
                      placeholder="₹ Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Maximum</span>
                    <input
                      type="number"
                      placeholder="₹ Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={maxPrice || sliderMax}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setSliderMax(Number(e.target.value));
                  }}
                  className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Apply / Reset Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="min-h-[44px] px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex-1 min-h-[44px] py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Apply Filters ({activeFilterCount})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
