import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, MapPin, X } from 'lucide-react';
import { MAHARASHTRA_CITIES, CityData } from '../constants';

interface SearchableCitySelectProps {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchableCitySelect: React.FC<SearchableCitySelectProps> = ({ 
  value, 
  onChange, 
  placeholder = "Select your city...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = useMemo(() => {
    return MAHARASHTRA_CITIES.filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const groupedCities = useMemo(() => {
    // Explicitly type the groups as Record<string, CityData[]> to aid type inference
    const groups: Record<string, CityData[]> = {};
    filteredCities.forEach(city => {
      if (!groups[city.district]) groups[city.district] = [];
      groups[city.district].push(city);
    });
    return groups;
  }, [filteredCities]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500 transition-all text-left flex items-center justify-between"
      >
        <span className={value ? "text-black" : "text-[#666666]"}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="p-3 border-b border-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                autoFocus
                type="text"
                placeholder="Search city or district..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg border-none text-sm focus:ring-2 focus:ring-orange-500 text-black placeholder:text-[#666666]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {Object.keys(groupedCities).length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm">No cities found</div>
            ) : (
              /* Cast Object.entries to a specific type to avoid 'unknown' inference for the second element (cities) */
              (Object.entries(groupedCities) as [string, CityData[]][]).map(([district, cities]) => (
                <div key={district}>
                  <div className="px-4 py-2 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-50">
                    District: {district}
                  </div>
                  {cities.map(city => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => {
                        onChange(city.name);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 ${value === city.name ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700'}`}
                    >
                      <MapPin size={14} className={value === city.name ? 'text-orange-500' : 'text-slate-300'} />
                      <div className="flex-1">
                        <div className="text-sm">{city.name}</div>
                        <div className="text-[10px] opacity-60 uppercase">{city.region} Region</div>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableCitySelect;