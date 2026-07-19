import React from 'react';
import { Zap, Heart, Globe, Footprints } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="font-sans"
      style={{
        backgroundColor: 'var(--mp-sidebar)',
        borderTop: '1px solid rgba(139,92,246,0.2)',
        color: 'var(--mp-muted)'
      }}
    >
      {/* Community Impact Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(124,58,237,0.15))',
          borderBottom: '1px solid rgba(139,92,246,0.2)',
          padding: '1.5rem 1rem'
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div
              className="p-2 rounded-lg"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA' }}
            >
              <Globe className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <h4 className="font-bold text-base md:text-lg" style={{ color: '#fff' }}>
                Our Community's Green Footprint
              </h4>
              <p className="text-xs md:text-sm" style={{ color: '#C4B5FD' }}>
                Every meal ordered helps heal the planet.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div
              className="backdrop-blur-sm rounded-xl px-4 py-2 text-center min-w-[120px]"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <div className="font-extrabold text-lg md:text-xl flex items-center justify-center" style={{ color: '#A78BFA' }}>
                <Footprints className="w-4 h-4 mr-1" />
                42,822
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#C4B5FD' }}>Green Deliveries</div>
            </div>
            <div
              className="backdrop-blur-sm rounded-xl px-4 py-2 text-center min-w-[120px]"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <div className="font-extrabold text-lg md:text-xl flex items-center justify-center" style={{ color: '#F59E0B' }}>
                🌱 1,284,530
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#FCD34D' }}>Points Rewarded</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div
                className="p-1.5 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
              >
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ color: '#fff' }}>EcoEats</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--mp-muted)' }}>
              Pioneering sustainable, low-emission food delivery. Partnering exclusively with local
              eco-certified kitchens and organic growers.
            </p>
          </div>

          {/* Sustainable Sourcing */}
          <div>
            <h5 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#fff' }}>
              Sustainable Sourcing
            </h5>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--mp-muted)' }}>
              {['100% Organic Farms', 'Zero-Waste Kitchen Standards', 'Self-Pickup Rewards', 'Eco-Packaging Materials'].map(item => (
                <li key={item}>
                  <a href="#/" className="transition-colors hover:text-violet-400" style={{ color: 'inherit' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Green Fleet */}
          <div>
            <h5 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#fff' }}>
              Green Fleet
            </h5>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--mp-muted)' }}>
              {['Bicycle Couriers', 'Electric Vehicles', 'Solar Drone Delivery', 'Low Emission Routing'].map(item => (
                <li key={item}>
                  <a href="#/" className="transition-colors hover:text-violet-400" style={{ color: 'inherit' }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#fff' }}>
              Join the Movement
            </h5>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--mp-muted)' }}>
              Subscribe to get zero-waste recipes, green dining tips, and exclusive discounts.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 rounded-l-lg text-sm outline-none"
                style={{
                  background: 'rgba(15,23,42,0.8)',
                  border: '1px solid rgba(139,92,246,0.25)',
                  borderRight: 'none',
                  color: '#fff'
                }}
              />
              <button
                className="px-4 py-2 font-bold rounded-r-lg text-sm text-white cursor-pointer transition-all"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                  boxShadow: '0 0 12px rgba(139,92,246,0.4)'
                }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ margin: '2rem 0', borderColor: 'rgba(139,92,246,0.15)' }} />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs gap-4" style={{ color: 'var(--mp-muted)' }}>
          <p>© {new Date().getFullYear()} EcoEats Technologies Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center">
            Made with <Heart className="w-3 h-3 mx-1 animate-pulse" style={{ color: '#EF4444' }} /> for a healthier planet.
          </p>
        </div>
      </div>
    </footer>
  );
}
