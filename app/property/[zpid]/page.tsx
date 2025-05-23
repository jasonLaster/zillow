'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { GeneratedProperty } from '@/types/property';
import { 
  ArrowLeft, Bath, Bed, Calendar, DollarSign, 
  Home, MapPin, Phone, Mail, Building, Clock,
  Thermometer, GraduationCap, TreePine
} from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetailPage() {
  const params = useParams();
  const zpid = params.zpid as string;
  const [property, setProperty] = useState<GeneratedProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${zpid}`);
        if (!response.ok) {
          throw new Error('Property not found');
        }
        const data = await response.json();
        setProperty(data.property);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (zpid) {
      fetchProperty();
    }
  }, [zpid]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested property could not be found.'}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to listings</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Home className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Zillow Clone</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Hero */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Property Image */}
          <div className="h-96 bg-gradient-to-br from-blue-400 to-blue-600 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute top-6 left-6">
              <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {property.status}
              </span>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{formatPrice(property.price)}</h1>
              {property.pricePerSqft && (
                <p className="text-lg">${property.pricePerSqft}/sqft</p>
              )}
            </div>
          </div>

          {/* Property Basic Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.address}</h2>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-1" />
                  <span>Oakland, CA {property.zipCode}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">ZPID: {property.zpid}</p>
                <p className="text-sm text-gray-600">Built in {property.yearBuilt}</p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Bed size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Bath size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Home size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="font-semibold">{property.sqft.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Property Type</p>
                  <p className="font-semibold capitalize">{property.propertyType.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {property.listing?.description && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.listing.description}</p>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium capitalize">{property.propertyType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stories:</span>
                    <span className="font-medium">{property.stories || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Garage Spaces:</span>
                    <span className="font-medium">{property.garageSpaces || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking Spaces:</span>
                    <span className="font-medium">{property.parkingSpaces || '0'}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lot Size:</span>
                    <span className="font-medium">{property.lotSizeSqft?.toLocaleString() || 'N/A'} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HOA Fee:</span>
                    <span className="font-medium">{property.hoaFee ? `$${property.hoaFee}/month` : 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Tax:</span>
                    <span className="font-medium">{property.propertyTax ? `$${property.propertyTax.toLocaleString()}/year` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listing Type:</span>
                    <span className="font-medium">{property.listingType || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {property.features && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Features & Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Interior Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Home size={16} className="mr-2" />
                      Interior
                    </h4>
                    <div className="space-y-2">
                      {property.features.flooringTypes && (
                        <div>
                          <span className="text-sm text-gray-600">Flooring: </span>
                          <span className="text-sm">{property.features.flooringTypes.join(', ')}</span>
                        </div>
                      )}
                      {property.features.kitchenFeatures && (
                        <div>
                          <span className="text-sm text-gray-600">Kitchen: </span>
                          <span className="text-sm">{property.features.kitchenFeatures.join(', ')}</span>
                        </div>
                      )}
                      {property.features.bathroomFeatures && (
                        <div>
                          <span className="text-sm text-gray-600">Bathroom: </span>
                          <span className="text-sm">{property.features.bathroomFeatures.join(', ')}</span>
                        </div>
                      )}
                      {property.features.fireplace && (
                        <div className="flex items-center text-sm">
                          <span className="text-green-600 mr-2">✓</span>
                          Fireplace {property.features.fireplaceCount && `(${property.features.fireplaceCount})`}
                        </div>
                      )}
                      {property.features.laundryFeatures && (
                        <div>
                          <span className="text-sm text-gray-600">Laundry: </span>
                          <span className="text-sm">{property.features.laundryFeatures}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Systems & Utilities */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Thermometer size={16} className="mr-2" />
                      Systems
                    </h4>
                    <div className="space-y-2">
                      {property.features.heating && (
                        <div>
                          <span className="text-sm text-gray-600">Heating: </span>
                          <span className="text-sm">{property.features.heating}</span>
                        </div>
                      )}
                      {property.features.cooling && (
                        <div>
                          <span className="text-sm text-gray-600">Cooling: </span>
                          <span className="text-sm">{property.features.cooling}</span>
                        </div>
                      )}
                      {property.features.garageType && (
                        <div>
                          <span className="text-sm text-gray-600">Garage: </span>
                          <span className="text-sm">{property.features.garageType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Outdoor & Additional */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <TreePine size={16} className="mr-2" />
                    Additional Features
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.features.pool && (
                      <div className="flex items-center text-sm">
                        <span className="text-blue-600 mr-2">✓</span>
                        Pool
                      </div>
                    )}
                    {property.features.spa && (
                      <div className="flex items-center text-sm">
                        <span className="text-blue-600 mr-2">✓</span>
                        Spa
                      </div>
                    )}
                    {property.features.yardFeatures?.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-600 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Neighborhood Scores */}
            {property.features && (property.features.walkabilityScore || property.features.transitScore || property.features.bikeScore) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Neighborhood Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {property.features.walkabilityScore && (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">{property.features.walkabilityScore}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">Walk Score</h4>
                      <p className="text-sm text-gray-600">Daily errands on foot</p>
                    </div>
                  )}
                  {property.features.transitScore && (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">{property.features.transitScore}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">Transit Score</h4>
                      <p className="text-sm text-gray-600">Public transportation</p>
                    </div>
                  )}
                  {property.features.bikeScore && (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-orange-600">{property.features.bikeScore}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">Bike Score</h4>
                      <p className="text-sm text-gray-600">Bike-friendly streets</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            {property.listing && (property.listing.agentName || property.listing.brokerage) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Agent</h3>
                {property.listing.agentName && (
                  <p className="font-semibold text-gray-900 mb-2">{property.listing.agentName}</p>
                )}
                {property.listing.brokerage && (
                  <p className="text-gray-600 mb-4">{property.listing.brokerage}</p>
                )}
                <div className="space-y-2">
                  {property.listing.agentPhone && (
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-2" />
                      <span className="text-sm">{property.listing.agentPhone}</span>
                    </div>
                  )}
                  {property.listing.agentEmail && (
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2" />
                      <span className="text-sm">{property.listing.agentEmail}</span>
                    </div>
                  )}
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Agent
                </button>
              </div>
            )}

            {/* Listing Info */}
            {property.listing && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Listing Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Calendar size={16} className="mr-2" />
                      Listed
                    </span>
                    <span className="font-medium">{formatDate(property.listing.listDate)}</span>
                  </div>
                  {property.listing.daysOnMarket !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Clock size={16} className="mr-2" />
                        Days on Market
                      </span>
                      <span className="font-medium">{property.listing.daysOnMarket}</span>
                    </div>
                  )}
                  {property.listing.originalPrice && property.listing.originalPrice !== property.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center">
                        <DollarSign size={16} className="mr-2" />
                        Original Price
                      </span>
                      <span className="font-medium">{formatPrice(property.listing.originalPrice)}</span>
                    </div>
                  )}
                  {property.listing.tourAvailable && (
                    <div className="flex items-center text-green-600">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Virtual tour available</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Features */}
            {property.listing?.keyFeatures && property.listing.keyFeatures.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-2">
                  {property.listing.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* School District */}
            {property.features?.schoolDistrict && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <GraduationCap size={20} className="mr-2" />
                  School District
                </h3>
                <p className="text-gray-700">{property.features.schoolDistrict}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 