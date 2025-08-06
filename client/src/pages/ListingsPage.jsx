import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listingsAPI } from '../utils/api.js';
import useAuth from '../hooks/useAuth.js';
import ListingCard from '../components/ListingCard.jsx';
import ListingDialog from '../components/ListingDialog.jsx';
import { Search, Filter, MapPin, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from "react-hot-toast";
import { Button } from '../components/ui/button';

export default function ListingsPage({ onSelect }) {
  // State management
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    bedrooms: ''
  });
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user, isAdmin, isLandlord } = useAuth();

  // Fetch listings with proper error handling
  const fetchListings = async () => {
    try {
      setError(null);
      
      // Build query parameters
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.location) params.location = filters.location;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.category) params.category = filters.category;
      if (verifiedOnly) params.verified = true;

      const response = await listingsAPI.getAll(params);
      
      // Handle different response structures
      const listingsData = response.data || response.listings || response;
      setListings(Array.isArray(listingsData) ? listingsData : []);
      
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err.message);
      toast.error("Failed to load listings.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings when dependencies change
  useEffect(() => {
    setLoading(true);
    fetchListings();
  }, [searchTerm, filters, verifiedOnly]);

  // Refresh listings
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
    toast.success('Listings refreshed');
  };

  // Client-side filtering (backup if API doesn't support all filters)
  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchTerm || 
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || listing.category === filters.category;
    const matchesMinPrice = !filters.minPrice || (listing.price && listing.price >= parseInt(filters.minPrice));
    const matchesMaxPrice = !filters.maxPrice || (listing.price && listing.price <= parseInt(filters.maxPrice));
    const matchesLocation = !filters.location || 
      listing.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
      listing.address?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesBedrooms = !filters.bedrooms || listing.bedrooms === parseInt(filters.bedrooms);
    const matchesVerified = !verifiedOnly || listing.verified;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && 
           matchesLocation && matchesBedrooms && matchesVerified;
  });

  // Create new listing
  const handleCreate = async (listingData) => {
    try {
      const response = await listingsAPI.create(listingData);
      const newListing = response.data || response.listing || response;
      setListings((prev) => [newListing, ...prev]);
      toast.success("Listing created successfully!");
    } catch (err) {
      console.error("Error creating listing:", err);
      toast.error(err.message || "Failed to create listing.");
    }
  };

  // Toggle verification (admin only)
  const handleVerify = async (id) => {
    if (!isAdmin) {
      toast.error('Only administrators can verify listings');
      return;
    }

    try {
      const listing = listings.find((l) => l._id === id);
      if (!listing) return;

      const response = await listingsAPI.update(id, {
        verified: !listing.verified,
      });

      const updatedListing = response.data || response.listing || response;
      
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, verified: updatedListing.verified } : l))
      );
      
      toast.success(`Listing ${updatedListing.verified ? 'verified' : 'unverified'}`);
    } catch (error) {
      console.error("Error verifying listing:", error);
      toast.error("Failed to update verification status.");
    }
  };

  // Delete listing
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    
    try {
      await listingsAPI.delete(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
      toast.success("Listing deleted successfully.");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing.");
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      bedrooms: ''
    });
    setVerifiedOnly(false);
    setSearchTerm('');
  };

  // Loading state
  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
          <p className="text-purple-600 dark:text-purple-300 font-medium">Loading listings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && listings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-20 p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Failed to Load Listings
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error}
          </p>
          <Button onClick={fetchListings} className="bg-purple-600 hover:bg-purple-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-20 pb-2">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Available Properties
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Discover your perfect home from our curated listings
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              {(isLandlord || isAdmin) && (
                <ListingDialog onSubmit={handleCreate} />
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/60 dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-500"
              />
            </div>

            {/* Verified Toggle */}
            <label className="flex items-center space-x-2 px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-slate-200 dark:border-slate-600">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Verified Only</span>
            </label>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/60 dark:bg-slate-700/60 text-slate-900 dark:text-slate-100"
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
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/60 dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-500"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/60 dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-500"
              />

              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/60 dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-500"
              />

              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white/60 dark:bg-slate-700/60 text-slate-900 dark:text-slate-100"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                onClick={clearFilters}
                className="col-span-full md:col-span-1 lg:col-span-1"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing {filteredListings.length} of {listings.length} properties
            {verifiedOnly && " (verified only)"}
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => onSelect ? onSelect(listing) : navigate(`/listings/${listing._id}`)}
                className="cursor-pointer"
              >
                <ListingCard
                  listing={listing}
                  onVerify={handleVerify}
                  onDelete={handleDelete}
                  showActions={isAdmin || (isLandlord && listing.createdBy === user?.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
              <div className="text-slate-400 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No properties found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchTerm || Object.values(filters).some(Boolean) || verifiedOnly
                  ? 'Try adjusting your search criteria or filters'
                  : 'No property listings have been created yet'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(searchTerm || Object.values(filters).some(Boolean) || verifiedOnly) && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                )}
                {(isLandlord || isAdmin) && !searchTerm && !Object.values(filters).some(Boolean) && !verifiedOnly && (
                  <ListingDialog onSubmit={handleCreate} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        {filteredListings.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {loading && <span className="italic">Refreshing...</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 