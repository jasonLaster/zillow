import { GeneratedProperty } from '@/types/property';
import { Bath, Bed, Home, MapPin } from 'lucide-react';
import Link from 'next/link';

interface PropertyCardProps {
  property: GeneratedProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatAddress = (address: string) => {
    // Remove city, state from address since we'll show it separately
    return address.split(',')[0] || address;
  };

  return (
    <Link href={`/property/${property.zpid}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
        {/* Property Image */}
        <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
          {property.photos && property.photos.length > 0 ? (
            <>
              <img 
                src={property.photos.find(p => p.isPrimary)?.imageUrl || property.photos[0]?.imageUrl} 
                alt={property.photos.find(p => p.isPrimary)?.caption || property.photos[0]?.caption || `Property at ${property.address}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-white text-gray-800 px-2 py-1 rounded text-sm font-medium">
              {property.status}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <Home size={24} />
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </h3>
            {property.pricePerSqft && (
              <p className="text-sm text-gray-600">
                ${property.pricePerSqft}/sqft
              </p>
            )}
          </div>

          {/* Bed/Bath/Sqft */}
          <div className="flex items-center space-x-4 mb-3 text-gray-600">
            <div className="flex items-center space-x-1">
              <Bed size={16} />
              <span className="text-sm">{property.bedrooms} bd</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath size={16} />
              <span className="text-sm">{property.bathrooms} ba</span>
            </div>
            <div className="flex items-center space-x-1">
              <Home size={16} />
              <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start space-x-1 mb-2">
            <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {formatAddress(property.address)}
              </p>
              <p className="text-sm text-gray-600">
                Oakland, CA {property.zipCode}
              </p>
            </div>
          </div>

          {/* Property Type and Year */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="capitalize">{property.propertyType.replace('_', ' ')}</span>
            <span>Built {property.yearBuilt}</span>
          </div>

          {/* Key Features */}
          {property.listing?.keyFeatures && property.listing.keyFeatures.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-1">
                {property.listing.keyFeatures.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {feature}
                  </span>
                ))}
                {property.listing.keyFeatures.length > 2 && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    +{property.listing.keyFeatures.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Days on Market */}
          {property.listing?.daysOnMarket !== undefined && (
            <div className="mt-2 text-xs text-gray-500">
              {property.listing.daysOnMarket === 0 
                ? 'New listing' 
                : `${property.listing.daysOnMarket} days on market`
              }
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 