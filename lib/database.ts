import Database from 'better-sqlite3';
import path from 'path';
import { GeneratedProperty } from '@/types/property';

const dbPath = path.join(process.cwd(), 'data', 'zillow_rockridge.db');
const db = new Database(dbPath, { readonly: true });

export interface DatabaseProperty {
  id: number;
  zpid: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lot_size_sqft?: number;
  year_built: number;
  property_type: string;
  stories?: number;
  garage_spaces?: number;
  parking_spaces?: number;
  price: number;
  price_per_sqft?: number;
  hoa_fee?: number;
  property_tax?: number;
  status: string;
  listing_type: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseListing {
  id: number;
  property_id: number;
  list_date: string;
  days_on_market?: number;
  description?: string;
  key_features?: string;
  agent_name?: string;
  agent_phone?: string;
  agent_email?: string;
  brokerage?: string;
  open_house_dates?: string;
  tour_available: boolean;
  virtual_tour_url?: string;
  original_price?: number;
  price_changes?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseFeatures {
  id: number;
  property_id: number;
  flooring_types?: string;
  kitchen_features?: string;
  bathroom_features?: string;
  fireplace: boolean;
  fireplace_count?: number;
  laundry_features?: string;
  cooling?: string;
  heating?: string;
  yard_features?: string;
  pool: boolean;
  spa: boolean;
  garage_type?: string;
  security_features?: string;
  accessibility_features?: string;
  green_features?: string;
  school_district?: string;
  walkability_score?: number;
  transit_score?: number;
  bike_score?: number;
  created_at: string;
  updated_at: string;
}

export interface DatabasePhoto {
  id: number;
  property_id: number;
  photo_url?: string;
  caption?: string;
  room_type?: string;
  is_primary: boolean;
  sort_order?: number;
  created_at: string;
  image_url?: string;
}

function parseJsonField(field: string | null | undefined): string[] | undefined {
  if (!field) return undefined;
  try {
    return JSON.parse(field);
  } catch {
    return field.split(',').map(s => s.trim()).filter(Boolean);
  }
}

function transformDatabasePropertyToSchema(
  property: DatabaseProperty,
  listing?: DatabaseListing,
  features?: DatabaseFeatures,
  photos?: DatabasePhoto[]
): GeneratedProperty {
  return {
    zpid: property.zpid,
    address: property.address,
    zipCode: property.zip_code,
    latitude: property.latitude,
    longitude: property.longitude,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.sqft,
    lotSizeSqft: property.lot_size_sqft,
    yearBuilt: property.year_built,
    propertyType: property.property_type,
    stories: property.stories,
    garageSpaces: property.garage_spaces,
    parkingSpaces: property.parking_spaces,
    price: property.price,
    pricePerSqft: property.price_per_sqft,
    hoaFee: property.hoa_fee,
    propertyTax: property.property_tax,
    status: property.status,
    listingType: property.listing_type,
    listing: listing ? {
      listDate: listing.list_date,
      daysOnMarket: listing.days_on_market,
      description: listing.description,
      keyFeatures: parseJsonField(listing.key_features),
      agentName: listing.agent_name,
      agentPhone: listing.agent_phone,
      agentEmail: listing.agent_email,
      brokerage: listing.brokerage,
      openHouseDates: parseJsonField(listing.open_house_dates),
      tourAvailable: listing.tour_available,
      virtualTourUrl: listing.virtual_tour_url,
      originalPrice: listing.original_price,
      priceChanges: listing.price_changes ? JSON.parse(listing.price_changes) : undefined,
    } : undefined,
    features: features ? {
      flooringTypes: parseJsonField(features.flooring_types),
      kitchenFeatures: parseJsonField(features.kitchen_features),
      bathroomFeatures: parseJsonField(features.bathroom_features),
      fireplace: features.fireplace,
      fireplaceCount: features.fireplace_count,
      laundryFeatures: features.laundry_features,
      cooling: features.cooling,
      heating: features.heating,
      yardFeatures: parseJsonField(features.yard_features),
      pool: features.pool,
      spa: features.spa,
      garageType: features.garage_type,
      securityFeatures: parseJsonField(features.security_features),
      accessibilityFeatures: parseJsonField(features.accessibility_features),
      greenFeatures: parseJsonField(features.green_features),
      schoolDistrict: features.school_district,
      walkabilityScore: features.walkability_score,
      transitScore: features.transit_score,
      bikeScore: features.bike_score,
    } : undefined,
    photos: photos?.map(photo => ({
      imageUrl: photo.image_url,
      caption: photo.caption,
      roomType: photo.room_type,
      isPrimary: photo.is_primary,
      sortOrder: photo.sort_order,
    })),
  };
}

export function getAllProperties(): GeneratedProperty[] {
  const properties = db.prepare(`
    SELECT * FROM properties 
    ORDER BY price DESC
  `).all() as DatabaseProperty[];

  return properties.map(property => {
    const listing = db.prepare(`
      SELECT * FROM listings WHERE property_id = ?
    `).get(property.id) as DatabaseListing | undefined;

    const features = db.prepare(`
      SELECT * FROM property_features WHERE property_id = ?
    `).get(property.id) as DatabaseFeatures | undefined;

    const photos = db.prepare(`
      SELECT * FROM property_photos WHERE property_id = ? ORDER BY sort_order, is_primary DESC
    `).all(property.id) as DatabasePhoto[];

    return transformDatabasePropertyToSchema(property, listing, features, photos);
  });
}

export function getPropertyByZpid(zpid: string): GeneratedProperty | null {
  const property = db.prepare(`
    SELECT * FROM properties WHERE zpid = ?
  `).get(zpid) as DatabaseProperty | undefined;

  if (!property) return null;

  const listing = db.prepare(`
    SELECT * FROM listings WHERE property_id = ?
  `).get(property.id) as DatabaseListing | undefined;

  const features = db.prepare(`
    SELECT * FROM property_features WHERE property_id = ?
  `).get(property.id) as DatabaseFeatures | undefined;

  const photos = db.prepare(`
    SELECT * FROM property_photos WHERE property_id = ? ORDER BY sort_order, is_primary DESC
  `).all(property.id) as DatabasePhoto[];

  return transformDatabasePropertyToSchema(property, listing, features, photos);
}

export function searchProperties({
  search,
  minPrice,
  maxPrice,
  bedrooms,
  bathrooms,
  propertyType,
  limit = 20,
  offset = 0
}: {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  limit?: number;
  offset?: number;
} = {}): GeneratedProperty[] {
  let query = 'SELECT * FROM properties WHERE 1=1';
  const params: (string | number)[] = [];

  if (search) {
    query += ' AND (address LIKE ? OR city LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern);
  }

  if (minPrice !== undefined) {
    query += ' AND price >= ?';
    params.push(minPrice);
  }

  if (maxPrice !== undefined) {
    query += ' AND price <= ?';
    params.push(maxPrice);
  }

  if (bedrooms !== undefined) {
    query += ' AND bedrooms >= ?';
    params.push(bedrooms);
  }

  if (bathrooms !== undefined) {
    query += ' AND bathrooms >= ?';
    params.push(bathrooms);
  }

  if (propertyType) {
    query += ' AND property_type = ?';
    params.push(propertyType);
  }

  query += ' ORDER BY price DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const properties = db.prepare(query).all(...params) as DatabaseProperty[];

  return properties.map(property => {
    const listing = db.prepare(`
      SELECT * FROM listings WHERE property_id = ?
    `).get(property.id) as DatabaseListing | undefined;

    const features = db.prepare(`
      SELECT * FROM property_features WHERE property_id = ?
    `).get(property.id) as DatabaseFeatures | undefined;

    const photos = db.prepare(`
      SELECT * FROM property_photos WHERE property_id = ? ORDER BY sort_order, is_primary DESC
    `).all(property.id) as DatabasePhoto[];

    return transformDatabasePropertyToSchema(property, listing, features, photos);
  });
}

// Graceful shutdown
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15)); 