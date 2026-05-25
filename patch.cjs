const fs = require('fs');
let content = fs.readFileSync('src/components/Marketplace.jsx', 'utf8');

content = content.replace(
  "import { ReservationLedger } from './ui/ReservationLedger'",
  "import { ReservationLedger } from './ui/ReservationLedger'\nimport { useDiscovery, WatchlistBadge, AddictionSidebar, SimilarVehiclesFeed } from './discovery/AddictionLoops'"
);

content = content.replace(
  "const [showCartModal, setShowCartModal] = useState(false)",
  "const [showCartModal, setShowCartModal] = useState(false)\n  \n  const { toggleWatchlist, watchlist, trackView, saveSearch } = useDiscovery()\n\n  // Track search when term changes significantly or user pauses\n  React.useEffect(() => {\n    if (searchTerm.length > 2) {\n      const timer = setTimeout(() => saveSearch({ query: searchTerm, resultsCount: filteredVehicles.length }), 1500)\n      return () => clearTimeout(timer)\n    }\n  }, [searchTerm])"
);

content = content.replace(
  "if (selectedVehicle) {",
  "if (selectedVehicle) {\n      trackView(selectedVehicle.vin)"
);

content = content.replace(
  "{/* Vehicle Grid */}\n      <div className=\"grid-3\">",
  "{/* Addiction Loops Layout Container */}\n      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>\n        \n        {/* Main Grid */}\n        <div style={{ flex: '1', minWidth: '0' }}>\n          <div className=\"grid-3\">"
);

content = content.replace(
  "{renderVehicleImage(vehicle.color, vehicle.make)}",
  "{/* Watchlist Quick Toggle over Image */}\n                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>\n                  <button \n                    onClick={(e) => { e.stopPropagation(); toggleWatchlist(vehicle.vin); }}\n                    className={`p-2 rounded-full backdrop-blur-md border transition-all ${watchlist.includes(vehicle.vin) ? 'bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-black/40 border-white/10 text-white/70 hover:bg-black/60'}`}\n                  >\n                     <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill={watchlist.includes(vehicle.vin) ? 'currentColor' : 'none'} stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"/></svg>\n                  </button>\n                </div>\n\n                {renderVehicleImage(vehicle.color, vehicle.make)}"
);

content = content.replace(
  "<span className={`trust-score-badge ${getTrustBadgeClass(vehicle.trustIndex)}`}>\n                <Shield size={14} />\n                {vehicle.trustIndex}% Trust\n              </span>",
  "<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>\n                <WatchlistBadge onClick={(e) => { e.stopPropagation(); toggleWatchlist(vehicle.vin); }} />\n                <span className={`trust-score-badge ${getTrustBadgeClass(vehicle.trustIndex)}`}>\n                  <Shield size={14} />\n                  {vehicle.trustIndex}% Trust\n                </span>\n              </div>"
);

// We need to find the end of the filteredVehicles.map to close our new layout containers
// It ends with:
//         ))}
//       </div>
//
//       {/* Digital Passport Detailed Modal overlay */}

content = content.replace(
  "        ))}\n      </div>\n\n      {/* Digital Passport Detailed Modal overlay */}",
  "        ))}\n          </div>\n          {filteredVehicles.length === 0 && (\n            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>\n              No vehicles match your criteria.\n            </div>\n          )}\n          \n          {/* Similar Vehicles Endless Feed Hook */}\n          <div style={{ marginTop: '40px' }}>\n             <SimilarVehiclesFeed />\n          </div>\n        </div>\n\n        {/* Sidebar Addiction Loops */}\n        <div style={{ width: '320px', flexShrink: 0, position: 'sticky', top: '24px' }}>\n           <AddictionSidebar />\n        </div>\n\n      </div>\n\n      {/* Digital Passport Detailed Modal overlay */}"
);

fs.writeFileSync('src/components/Marketplace.jsx', content);
