'use client';

import { useState, useEffect } from 'react';
import { GeneratedProperty } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import SearchFilters from '@/components/SearchFilters';
import { Home, MapPin, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [properties, setProperties] = useState<GeneratedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchProperties = async (searchFilters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/properties?${queryParams}`);
      const data = await response.json();
      
      if (data.properties) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Home className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Zillow Clone</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Buy</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Sell</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Rent</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Agent finder</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Dream Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover properties in Oakland&apos;s vibrant Rockridge neighborhood
          </p>
          <div className="flex items-center justify-center space-x-4 text-blue-100">
            <div className="flex items-center space-x-1">
              <MapPin size={20} />
              <span>Oakland, CA</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp size={20} />
              <span>{properties.length} properties available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <SearchFilters onFiltersChange={handleFiltersChange} />

        {/* Properties Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Properties for sale in Rockridge, Oakland
            </h2>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${properties.length} results`}
            </p>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.zpid} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Home size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search filters to see more results.</p>
            </div>
          )}
        </section>

        {/* Neighborhood Info */}
        <section className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Rockridge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-700 mb-4">
                Rockridge is one of Oakland&apos;s most desirable neighborhoods, known for its tree-lined streets, 
                charming Craftsman homes, and vibrant College Avenue corridor. The area offers easy access to 
                BART, making it popular with commuters to San Francisco.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Excellent restaurants and cafes along College Avenue</li>
                <li>• Close to UC Berkeley campus</li>
                <li>• Great walkability and bike-friendly streets</li>
                <li>• Beautiful parks and hiking trails nearby</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Transportation</h3>
              <p className="text-gray-700 mb-4">
                Rockridge BART station provides direct access to San Francisco, downtown Oakland, 
                and the rest of the Bay Area. The neighborhood also has excellent bus connections 
                and is very bike-friendly.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">85</div>
                  <div className="text-sm text-gray-600">Transit Score</div>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">80</div>
                  <div className="text-sm text-gray-600">Walk Score</div>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <div className="text-2xl font-bold text-orange-600">70</div>
                  <div className="text-sm text-gray-600">Bike Score</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home size={24} />
                <span className="text-xl font-bold">Zillow Clone</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect home in Oakland.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Buy</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Homes for sale</a></li>
                <li><a href="#" className="hover:text-white">Open houses</a></li>
                <li><a href="#" className="hover:text-white">New construction</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Sell</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Get home value</a></li>
                <li><a href="#" className="hover:text-white">Find an agent</a></li>
                <li><a href="#" className="hover:text-white">Seller resources</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contact us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Terms of use</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Zillow Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
