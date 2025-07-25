import useAuth from '../hooks/useAuth';
import { Button } from '../components/ui/button.jsx';
import Listings from './Listings.jsx';
import { useState, useEffect } from 'react';
import API from '../utils/api.js';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const [myBuildings, setMyBuildings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [forumPosts, setForumPosts] = useState([]);
  const [newForumPost, setNewForumPost] = useState('');
  const [review, setReview] = useState({ safety: '', water: '', landlordReliability: '' });
  const [myReviews, setMyReviews] = useState([]);

  const [loadingForum, setLoadingForum] = useState(false); // ✅ NEW
  const [loadingReviews, setLoadingReviews] = useState(false); // ✅ NEW
  const [nearbyOnly, setNearbyOnly] = useState(false); // ✅ NEW
  const [location, setLocation] = useState(null); // ✅ NEW

  useEffect(() => {
    API.get('/listings').then(res => setMyBuildings(res.data));
  }, []);

  // ✅ NEW: Proximity toggle handling
  useEffect(() => {
    if (nearbyOnly && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.warn("Geolocation failed:", err.message);
        }
      );
    } else {
      setLocation(null);
    }
  }, [nearbyOnly]);

  useEffect(() => {
    API.get('/listings').then(res => setMyBuildings(res.data));
  }, []);

  useEffect(() => {
    if (selectedListing) {
      setLoadingForum(true);
      setLoadingReviews(true);
      API.get(`/forum/${selectedListing}`)
      .then(res => setForumPosts(res.data))
      .catch(() => setForumPosts([]))
      .finally(() => setLoadingForum(false));

    API.get(`/reviews/${selectedListing}`)
      .then(res => setMyReviews(res.data))
      .catch(() => setMyReviews([]))
      .finally(() => setLoadingReviews(false));
  }
}, [selectedListing]);


  const handleForumPost = async (e) => {
    e.preventDefault();
    if (!newForumPost.trim()) return;
    await API.post(`/forum/${selectedListing}`, { content: newForumPost });
    setNewForumPost('');
    const res = await API.get(`/forum/${selectedListing}`);
    setForumPosts(res.data);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    await API.post(`/reviews/${selectedListing}`, review);
    setReview({ safety: '', water: '', landlordReliability: '' });
    const res = await API.get(`/reviews/${selectedListing}`);
    setMyReviews(res.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-slate-200 dark:from-zinc-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto py-8">

        {/* Header Section */}
        <div className="bg-zinc-50 dark:bg-zinc-800 p-8 rounded-2xl shadow mb-8 border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-2">Tenant Dashboard</h2>
          <p className='font-bold'>Welcome <span className="font-semibold text-emerald-900 ">{user?.username}</span></p>
          {/* <Button className="mt-4" onClick={logout}>Logout</Button> */}
        </div>

        {/* Listings with Proximity Filter ✅ */}
        {/* <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Browse Listings</h3>
          <label className="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={nearbyOnly}
              onChange={() => setNearbyOnly(!nearbyOnly)}
            />
            Show Nearby Listings Only
          </label>
          <Listings onSelect={setSelectedListing} location={location} />
        </div> */}



<div className="mb-12">
  {/* Header with subtle background */}
  <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-xl p-6 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
        Browse Listings
      </h3>
      <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-600 ml-4"></div>
    </div>
    
    {/* Custom styled checkbox */}
    <div className="relative">
      <label className="group flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white/60 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/60 hover:border-slate-300/90 dark:hover:border-slate-500/70 transition-all duration-200 ease-out">
        {/* Custom checkbox */}
        <div className="relative">
          <input
            type="checkbox"
            checked={nearbyOnly}
            onChange={() => setNearbyOnly(!nearbyOnly)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ease-out ${
            nearbyOnly 
              ? 'bg-slate-600 border-slate-600 dark:bg-slate-400 dark:border-slate-400' 
              : 'bg-transparent border-slate-400 dark:border-slate-500 group-hover:border-slate-500 dark:group-hover:border-slate-400'
          }`}>
            {nearbyOnly && (
              <svg 
                className="w-3 h-3 text-white dark:text-slate-800 absolute top-0.5 left-0.5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Label text with subtle styling */}
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-200">
          Show Nearby Listings Only
        </span>
        
        {/* Subtle indicator dot */}
        <div className={`ml-auto w-2 h-2 rounded-full transition-all duration-200 ${
          nearbyOnly 
            ? 'bg-slate-500 dark:bg-slate-400 scale-100' 
            : 'bg-slate-300 dark:bg-slate-600 scale-75 opacity-60'
        }`}></div>
      </label>
    </div>
  </div>

  {/* Listings component wrapper with subtle shadow */}
  {/* <div className="mt-6 bg-white/40 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
    <Listings onSelect={setSelectedListing} location={location} />
  </div> */}


{/* Enhanced Listings wrapper with professional styling */}
<div className="mt-8">
  <div className="relative group">
    {/* Subtle background glow effect */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-300/20 via-gray-300/20 to-slate-300/20 dark:from-slate-600/20 dark:via-gray-600/20 dark:to-slate-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Main container */}
    <div className="relative bg-gradient-to-br from-white/60 via-slate-50/40 to-gray-50/60 dark:from-slate-800/40 dark:via-slate-700/30 dark:to-gray-800/40 rounded-xl border border-slate-200/60 dark:border-slate-600/40 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 ease-out overflow-hidden">
      
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-400/50 dark:via-slate-500/50 to-transparent"></div>
      
      {/* Content area with padding */}
      <div className="p-6">
        {/* Optional header for listings */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/40 dark:border-slate-600/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-500 dark:bg-slate-400 rounded-full"></div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 tracking-wide">
              Available Properties
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100/60 dark:bg-slate-700/40 px-2 py-1 rounded-full">
            Live Results
          </div>
        </div>
        
        {/* Listings component */}
        <div className="relative">
          <Listings onSelect={setSelectedListing} location={location} />
        </div>
      </div>
      
      {/* Bottom subtle accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300/40 dark:via-slate-600/40 to-transparent"></div>
    </div>
  </div>
</div>

</div>






        {/* My Buildings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">My Buildings</h3>
          <ul className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-2 border border-zinc-200 dark:border-zinc-700">
            {myBuildings.map(b => (
              <li key={b._id} className="border-b border-zinc-200 dark:border-zinc-700 py-1">
                <button className="text-blue-700 dark:text-blue-300 hover:underline" onClick={() => setSelectedListing(b._id)}>
                  {b.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditional content when a listing is selected */}
        {selectedListing && (
          <>
            {/* Forum Section ✅ With username and loading */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Forum</h3>
              <form onSubmit={handleForumPost} className="flex gap-2 mb-2">
                <input
                  className="flex-1 border border-zinc-300 bg-zinc-50 rounded-lg px-2 py-1 text-zinc-700"
                  value={newForumPost}
                  onChange={e => setNewForumPost(e.target.value)}
                  placeholder="Post a message..."
                />
                <Button type="submit">Post</Button>
              </form>
              {loadingForum ? (
                <p className="text-sm text-zinc-400">Loading forum posts...</p>
              ) : (
                <ul className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2 border border-zinc-200 dark:border-zinc-700">
                  {forumPosts.map(post => (
                    <li key={post._id} className="border-b border-zinc-200 dark:border-zinc-700 py-1">
                      <span className="font-semibold">{post.author?.username || 'Anonymous'}:</span> {post.content}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Review Section ✅ With loading */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Submit a Silent Review</h3>
              <form onSubmit={handleReview} className="flex flex-col gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Safety (1-5)"
                  value={review.safety}
                  onChange={e => setReview({ ...review, safety: e.target.value })}
                  className="border border-zinc-300 bg-zinc-50 rounded-lg px-2 py-1"
                  required
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Water (1-5)"
                  value={review.water}
                  onChange={e => setReview({ ...review, water: e.target.value })}
                  className="border border-zinc-300 bg-zinc-50 rounded-lg px-2 py-1"
                  required
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Landlord Reliability (1-5)"
                  value={review.landlordReliability}
                  onChange={e => setReview({ ...review, landlordReliability: e.target.value })}
                  className="border border-zinc-300 bg-zinc-50 rounded-lg px-2 py-1"
                  required
                />
                <Button type="submit">Submit Review</Button>
              </form>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">My Reviews</h3>
              {loadingReviews ? (
                <p className="text-sm text-zinc-400">Loading reviews...</p>
              ) : (
                <ul className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2 border border-zinc-200 dark:border-zinc-700">
                  {myReviews.map(r => (
                    <li key={r._id} className="border-b border-zinc-200 dark:border-zinc-700 py-1">
                      Safety: {r.safety}, Water: {r.water}, Landlord: {r.landlordReliability}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ✅ New: Rent Payment Stub */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Pay Rent</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Coming soon: rent payment via MPesa or card.</p>
              <Button disabled>Pay Now</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;