import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { UserProfile } from '../types';
import { COUNTRIES, Country } from '../data/countries';
import { GlobeAltIcon, UsersIcon, DevicePhoneMobileIcon, TvIcon, WifiIcon } from './icons';

interface RecommendationFormProps {
  onSubmit: (profile: UserProfile) => void;
  loading: boolean;
}

const PRIMARY_USES = ['Streaming Video/Music', 'Gaming', 'Social Media', 'Work/Hotspot', 'General Browsing'];

const SERVICE_OPTIONS = {
  ott: { name: 'OTT Services', icon: TvIcon, options: ['Netflix', 'Disney+', 'Spotify', 'YouTube Premium', 'Max'] },
  connectivity: { name: 'Connectivity', icon: WifiIcon, options: ['5G Access', 'Mobile Hotspot', 'International Roaming'] },
  family: { name: 'Family Perks', icon: UsersIcon, options: ['Multi-line Discount', 'Shared Data Pool', 'Parental Controls'] },
  device: { name: 'Device Perks', icon: DevicePhoneMobileIcon, options: ['Device Insurance', 'Early Upgrade', 'Trade-in Offers'] },
};

export const RecommendationForm: React.FC<RecommendationFormProps> = ({ onSubmit, loading }) => {
  const [country, setCountry] = useState(COUNTRIES[0].code);
  const [city, setCity] = useState(COUNTRIES[0].cities[0]);
  const [numUsers, setNumUsers] = useState(1);
  const [dataUsage, setDataUsage] = useState(20); // GB
  const [primaryUses, setPrimaryUses] = useState<string[]>(['Streaming Video/Music']);
  const [budget, setBudget] = useState(75);
  const [wantsNewDevice, setWantsNewDevice] = useState(false);
  const [services, setServices] = useState<UserProfile['services']>({ ott: [], connectivity: [], family: [], device: [] });
  const [preferredProviders, setPreferredProviders] = useState<string[]>([]);
  
  const [countryInput, setCountryInput] = useState(COUNTRIES[0].name);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const countryInputRef = useRef<HTMLDivElement>(null);

  const selectedCountryData = useMemo(() => {
    return COUNTRIES.find(c => c.code === country) || COUNTRIES[0];
  }, [country]);

  const { cities, currency, providers } = selectedCountryData;

  const filteredCountries = useMemo(() => {
    if (!countryInput) return [];
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(countryInput.toLowerCase())
    );
  }, [countryInput]);
  
  useEffect(() => {
    // Reset city and providers when country changes
    if (selectedCountryData) {
      setCity(selectedCountryData.cities[0] || '');
      setPreferredProviders([]);
    }
  }, [country, selectedCountryData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryInputRef.current && !countryInputRef.current.contains(event.target as Node)) {
        setShowCountrySuggestions(false);
        // Optional: snap to a valid country name if input is left in an invalid state
        const currentCountry = COUNTRIES.find(c => c.code === country);
        if(currentCountry) setCountryInput(currentCountry.name);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [country]);

  const handleCountrySelect = (selectedCountry: Country) => {
    setCountry(selectedCountry.code);
    setCountryInput(selectedCountry.name);
    setShowCountrySuggestions(false);
  };
  
  const handleServiceChange = (category: keyof UserProfile['services'], option: string) => {
    setServices(prev => {
      const currentCategory = prev[category];
      const newCategory = currentCategory.includes(option)
        ? currentCategory.filter(item => item !== option)
        : [...currentCategory, option];
      return { ...prev, [category]: newCategory };
    });
  };

  const handleProviderToggle = (provider: string) => {
    setPreferredProviders(prev =>
      prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider]
    );
  };
  
  const handlePrimaryUseChange = (use: string) => {
    setPrimaryUses(prev =>
      prev.includes(use)
        ? prev.filter(item => item !== use)
        : [...prev, use]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    onSubmit({ country, city, numUsers, dataUsage, primaryUses, budget, wantsNewDevice, services, preferredProviders });
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-in space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Location */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-neutral-700 flex items-center"><GlobeAltIcon className="w-6 h-6 mr-2 text-primary" />Location</h3>
          <div className="relative" ref={countryInputRef}>
            <label htmlFor="country" className="block text-sm font-medium text-neutral-600 mb-1">Country</label>
            <input 
              id="country" 
              type="text"
              value={countryInput}
              onChange={e => {
                setCountryInput(e.target.value);
                if (!showCountrySuggestions) setShowCountrySuggestions(true);
              }}
              onFocus={() => setShowCountrySuggestions(true)}
              disabled={loading} 
              className="w-full p-2 border border-neutral-300 rounded-md bg-white focus:ring-2 focus:ring-primary disabled:bg-neutral-100"
              autoComplete="off"
            />
            {showCountrySuggestions && filteredCountries.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-neutral-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                {filteredCountries.map(c => (
                  <li 
                    key={c.code} 
                    onClick={() => handleCountrySelect(c)}
                    className="px-4 py-2 hover:bg-primary-light cursor-pointer"
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-neutral-600 mb-1">City</label>
            <select id="city" value={city} onChange={e => setCity(e.target.value)} disabled={loading || cities.length === 0} className="w-full p-2 border border-neutral-300 rounded-md bg-white focus:ring-2 focus:ring-primary disabled:bg-neutral-100">
              {cities.map(cityName => <option key={cityName} value={cityName}>{cityName}</option>)}
            </select>
          </div>
        </div>

        {/* Usage Profile */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-neutral-700 flex items-center"><UsersIcon className="w-6 h-6 mr-2 text-primary" />Your Profile</h3>
          <div>
            <label htmlFor="numUsers" className="block text-sm font-medium text-neutral-600 mb-1">Number of Lines: <span className="font-bold text-primary">{numUsers}</span></label>
            <input id="numUsers" type="range" min="1" max="10" value={numUsers} onChange={e => setNumUsers(Number(e.target.value))} disabled={loading} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary" />
          </div>
          <div>
            <label htmlFor="dataUsage" className="block text-sm font-medium text-neutral-600 mb-1">Monthly Data: <span className="font-bold text-primary">{dataUsage} GB</span></label>
            <input id="dataUsage" type="range" min="5" max="200" step="5" value={dataUsage} onChange={e => setDataUsage(Number(e.target.value))} disabled={loading} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary" />
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-neutral-700 flex items-center"><DevicePhoneMobileIcon className="w-6 h-6 mr-2 text-primary" />Preferences</h3>
          <div>
             <label htmlFor="budget" className="block text-sm font-medium text-neutral-600 mb-1">Max Budget: <span className="font-bold text-primary">{currency.symbol}{budget}/month</span></label>
             <input id="budget" type="range" min="20" max="200" step="5" value={budget} onChange={e => setBudget(Number(e.target.value))} disabled={loading} className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary" />
          </div>
          <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-md">
            <label htmlFor="wantsNewDevice" className="font-medium text-neutral-700">Include new device offers?</label>
            <button type="button" role="switch" aria-checked={wantsNewDevice} onClick={() => setWantsNewDevice(!wantsNewDevice)} disabled={loading} className={`${wantsNewDevice ? 'bg-primary' : 'bg-neutral-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
              <span className={`${wantsNewDevice ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Primary Uses */}
      <div>
        <h3 className="font-bold text-lg text-neutral-700 mb-2">Primary Uses</h3>
        <div className="flex flex-wrap gap-2">
          {PRIMARY_USES.map(use => (
            <button key={use} type="button" onClick={() => handlePrimaryUseChange(use)} disabled={loading} className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${primaryUses.includes(use) ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'}`}>
              {use}
            </button>
          ))}
        </div>
      </div>

      {/* Services and Perks */}
      <div>
        <h3 className="font-bold text-lg text-neutral-700 mb-4">Features & Perks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.keys(SERVICE_OPTIONS) as Array<keyof typeof SERVICE_OPTIONS>).map((key) => {
            const value = SERVICE_OPTIONS[key];
            return (
              <div key={key}>
                <h4 className="font-semibold text-neutral-800 mb-2 flex items-center">
                  <value.icon className="w-5 h-5 mr-2 text-primary" />
                  {value.name}
                </h4>
                <div className="space-y-2">
                  {value.options.map(option => (
                    <label key={option} className="flex items-center text-sm text-neutral-600 cursor-pointer">
                      <input type="checkbox" disabled={loading} checked={services[key].includes(option)} onChange={() => handleServiceChange(key, option)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2" />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
       {/* Provider Selection */}
      <div>
        <h3 className="font-bold text-lg text-neutral-700 mb-2">Select Providers (Optional)</h3>
        <p className="text-sm text-neutral-500 mb-3">Get recommendations only from the providers you select.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {providers.map(provider => (
            <button type="button" key={provider} onClick={() => handleProviderToggle(provider)} disabled={loading} className={`text-center p-3 border rounded-lg transition-all duration-200 ${preferredProviders.includes(provider) ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-neutral-300 hover:border-primary hover:text-primary'}`}>
               <span className="font-semibold text-sm">{provider}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <button type="submit" disabled={loading} className="bg-primary text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-primary-dark transition-all duration-300 disabled:bg-neutral-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100">
          {loading ? 'Analyzing...' : 'Find My Plan'}
        </button>
      </div>
    </form>
  );
};