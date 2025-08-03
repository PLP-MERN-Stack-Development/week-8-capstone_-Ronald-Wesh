import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { Button } from '../components/ui/button.jsx';
//import Listings from './Listings';
import API from '../utils/api.js';


const ListingCard = ({ listing }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  useEffect(() => {
    axios.get('/api/listings')
      .then(res => setListings(res.data))
      .catch(err => console.error(err));
  }, []);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={listing.images?.[0] || '/api/placeholder/400/300'} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsBookmarked(!isBookmarked);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} />
        </button>
        <div className="absolute bottom-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {listing.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {listing.title}
          </h3>
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            KSh {listing.price?.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{listing.location}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {listing.description}
        </p>

        {/* Property Details */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
          {listing.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{listing.bedrooms} beds</span>
            </div>
          )}
          {listing.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{listing.bathrooms} baths</span>
            </div>
          )}
          {listing.area && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{listing.area} sq ft</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link
          to={`/listing/${listing._id}`}
          className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-2 rounded-lg font-medium transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('/api/listings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setListings(data.listings || data);
        } else {
          console.error('Failed to fetch listings');
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || listing.category === filters.category;
    const matchesMinPrice = !filters.minPrice || listing.price >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || listing.price <= parseInt(filters.maxPrice);
    const matchesLocation = !filters.location || listing.location?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesBedrooms = !filters.bedrooms || listing.bedrooms === parseInt(filters.bedrooms);

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesLocation && matchesBedrooms;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          <p className="text-purple-300 font-medium">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Available Properties
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover your perfect home from our curated listings
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="room">Room</option>
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />

              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredListings.length} of {listings.length} properties
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}

        {/* Quick Action for Landlords */}
        {user?.role === 'landlord' && (
          <div className="fixed bottom-6 right-6">
            <Link
              to="/dashboard/landlord"
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span className="sr-only">Add Listing</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;