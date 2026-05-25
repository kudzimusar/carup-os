import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Bell, Search, TrendingUp, ArrowDownRight, Clock, Star, Zap, ChevronRight, X, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------
// Hook: useDiscovery (Addiction Engine)
// ---------------------------------------------------------
export function useDiscovery() {
  const { vehicles } = useApp();
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('carup_watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [savedSearches, setSavedSearches] = useState(() => {
    const saved = localStorage.getItem('carup_saved_searches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [viewHistory, setViewHistory] = useState(() => {
    const saved = localStorage.getItem('carup_view_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist
  useEffect(() => { localStorage.setItem('carup_watchlist', JSON.stringify(watchlist)); }, [watchlist]);
  useEffect(() => { localStorage.setItem('carup_saved_searches', JSON.stringify(savedSearches)); }, [savedSearches]);
  useEffect(() => { localStorage.setItem('carup_view_history', JSON.stringify(viewHistory)); }, [viewHistory]);

  const toggleWatchlist = (vin) => {
    setWatchlist(prev => prev.includes(vin) ? prev.filter(id => id !== vin) : [...prev, vin]);
  };

  const saveSearch = (queryObj) => {
    setSavedSearches(prev => {
      // Prevent duplicates
      const isDupe = prev.some(s => s.query === queryObj.query);
      if (isDupe) return prev;
      return [{ ...queryObj, id: Date.now().toString(), date: new Date().toISOString() }, ...prev].slice(0, 5);
    });
  };

  const removeSearch = (id) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  };

  const trackView = (vin) => {
    setViewHistory(prev => {
      const filtered = prev.filter(id => id !== vin);
      return [vin, ...filtered].slice(0, 10); // Keep last 10 viewed
    });
  };

  // Generate similar vehicles based on history and watchlist
  const similarVehicles = useMemo(() => {
    const seedVins = [...new Set([...watchlist, ...viewHistory])];
    if (seedVins.length === 0) return vehicles.slice(0, 3); // Fallback to trending
    
    const seedCars = vehicles.filter(v => seedVins.includes(v.vin));
    const makes = [...new Set(seedCars.map(c => c.make))];
    const avgPrice = seedCars.reduce((sum, c) => sum + c.price, 0) / seedCars.length || 0;

    return vehicles
      .filter(v => !seedVins.includes(v.vin)) // Don't show already seen/watchlisted
      .map(v => {
        let score = 0;
        if (makes.includes(v.make)) score += 5;
        if (Math.abs(v.price - avgPrice) < 2000) score += 3;
        if (v.trustIndex > 80) score += 2;
        return { ...v, recommendationScore: score };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 4);
  }, [watchlist, viewHistory, vehicles]);

  // Fake price drop generator for dopamine hits
  const priceDrops = useMemo(() => {
    if (watchlist.length === 0) return [];
    // Randomly pick one or two cars from watchlist to have a "recent price drop"
    const dropCandidates = vehicles.filter(v => watchlist.includes(v.vin));
    return dropCandidates.slice(0, 2).map(v => ({
      ...v,
      dropAmount: Math.floor(Math.random() * 300) + 100,
      dropTime: 'Just now'
    }));
  }, [watchlist, vehicles]);

  return {
    watchlist, toggleWatchlist,
    savedSearches, saveSearch, removeSearch,
    viewHistory, trackView,
    similarVehicles,
    priceDrops
  };
}

// ---------------------------------------------------------
// UI Component: WatchlistBadge (Heart Icon with Count)
// ---------------------------------------------------------
export function WatchlistBadge({ onClick }) {
  const { watchlist } = useDiscovery();
  return (
    <button onClick={onClick} className="relative p-2 text-gray-400 hover:text-rose-400 transition-colors">
      <Heart className="w-5 h-5" />
      {watchlist.length > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-zinc-900 shadow-[0_0_8px_rgba(244,63,94,0.6)]">
          {watchlist.length}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------
// UI Component: PriceDropAlertsWidget
// ---------------------------------------------------------
export function PriceDropAlertsWidget() {
  const { priceDrops, toggleWatchlist } = useDiscovery();
  
  if (priceDrops.length === 0) return null;

  return (
    <div className="bg-zinc-900/80 border border-green-500/20 rounded-xl p-4 mb-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-1 h-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"></div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-green-500/10 rounded-lg">
          <Zap className="w-4 h-4 text-green-400 fill-green-400/20" />
        </div>
        <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider flex-1">Price Drop Alerts</h3>
        <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          LIVE
        </span>
      </div>

      <div className="space-y-3 relative z-10">
        {priceDrops.map(car => (
          <div key={car.vin} className="flex items-center gap-3 bg-black/40 p-2.5 rounded-lg border border-white/5 hover:border-green-500/30 transition-colors cursor-pointer">
            <div className="w-12 h-10 rounded bg-zinc-800 flex items-center justify-center border border-white/5 overflow-hidden">
               <img src={`https://source.unsplash.com/random/100x80/?car,${car.make}`} alt={car.make} className="w-full h-full object-cover opacity-80 mix-blend-luminosity" onError={(e) => e.target.style.display='none'}/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{car.year} {car.make} {car.model}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-zinc-400 line-through">${(car.price + car.dropAmount).toLocaleString()}</span>
                <div className="flex items-center text-xs font-bold text-green-400">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  ${car.dropAmount}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">${car.price.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{car.dropTime}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// UI Component: SimilarVehiclesFeed (Endless scroll feel)
// ---------------------------------------------------------
export function SimilarVehiclesFeed() {
  const { similarVehicles, toggleWatchlist, watchlist } = useDiscovery();
  const navigate = useNavigate();

  if (similarVehicles.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Because you looked</h2>
        </div>
        <button className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
          View all <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {similarVehicles.map(car => {
          const isWatched = watchlist.includes(car.vin);
          return (
            <div key={car.vin} className="group relative bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)]">
              {/* Image Area */}
              <div className="h-32 bg-zinc-800 relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                 <img src={`https://source.unsplash.com/random/400x300/?car,${car.make},${car.color}`} alt={car.make} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" onError={(e) => e.target.style.display='none'}/>
                 
                 {/* Quick Watchlist Toggle */}
                 <button 
                   onClick={(e) => { e.stopPropagation(); toggleWatchlist(car.vin); }}
                   className={`absolute top-2 right-2 z-20 p-2 rounded-full backdrop-blur-md border transition-all ${isWatched ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-black/40 border-white/10 text-white/70 hover:bg-black/60'}`}
                 >
                   <Heart className={`w-4 h-4 ${isWatched ? 'fill-rose-500' : ''}`} />
                 </button>
                 
                 {/* Match Score */}
                 <div className="absolute top-2 left-2 z-20 px-2 py-1 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded text-[10px] font-bold text-blue-300 flex items-center gap-1">
                   <Star className="w-3 h-3 fill-blue-400" />
                   {Math.min(99, 80 + car.recommendationScore * 2)}% MATCH
                 </div>
              </div>
              
              {/* Details */}
              <div className="p-3 relative z-20 bg-zinc-900">
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{car.year} {car.make} {car.model}</h3>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{car.mileage.toLocaleString()} km</div>
                    <div className="text-lg font-bold text-white leading-none mt-1">${car.price.toLocaleString()}</div>
                  </div>
                  <button onClick={() => navigate(`/compare`)} className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// UI Component: SavedSearchesDropdown / Panel
// ---------------------------------------------------------
export function SavedSearchesPanel() {
  const { savedSearches, removeSearch } = useDiscovery();
  
  if (savedSearches.length === 0) return null;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-4 h-4 text-zinc-400" />
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Recent Searches</h3>
      </div>
      <div className="space-y-2">
        {savedSearches.map(search => (
          <div key={search.id} className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-1.5 bg-zinc-800 rounded text-zinc-400 group-hover:text-white transition-colors">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className="text-sm font-medium text-zinc-200 truncate">{search.query}</div>
                <div className="text-[10px] text-zinc-500">{new Date(search.date).toLocaleDateString()} &middot; {search.resultsCount} results</div>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); removeSearch(search.id); }}
              className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// UI Component: AddictionSidebar (Wrapper for all)
// ---------------------------------------------------------
export function AddictionSidebar() {
  return (
    <div className="space-y-4">
      <PriceDropAlertsWidget />
      <SavedSearchesPanel />
    </div>
  );
}

