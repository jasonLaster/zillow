'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
  }) => void;
}

export default function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Convert to API format
    const apiFilters: {
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      bathrooms?: number;
      propertyType?: string;
    } = {};
    if (newFilters.minPrice) apiFilters.minPrice = parseInt(newFilters.minPrice);
    if (newFilters.maxPrice) apiFilters.maxPrice = parseInt(newFilters.maxPrice);
    if (newFilters.bedrooms) apiFilters.bedrooms = parseInt(newFilters.bedrooms);
    if (newFilters.bathrooms) apiFilters.bathrooms = parseFloat(newFilters.bathrooms);
    if (newFilters.propertyType) apiFilters.propertyType = newFilters.propertyType;
    
    onFiltersChange(apiFilters);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
    });
    onFiltersChange({});
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Oakland, CA"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <select
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="500000">$500K</option>
                <option value="750000">$750K</option>
                <option value="1000000">$1M</option>
                <option value="1500000">$1.5M</option>
                <option value="2000000">$2M</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <select
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="750000">$750K</option>
                <option value="1000000">$1M</option>
                <option value="1500000">$1.5M</option>
                <option value="2000000">$2M</option>
                <option value="3000000">$3M</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="single_family">Single Family</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 