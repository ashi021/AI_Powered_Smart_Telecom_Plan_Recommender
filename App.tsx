import React, { useState, useCallback } from 'react';
import { RecommendationForm } from './components/RecommendationForm';
import { PlanList } from './components/PlanList';
import { ComparisonView } from './components/ComparisonView';
import { CoverageMap } from './components/CoverageMap';
import { SpeedTest } from './components/SpeedTest';
import { BillEstimator } from './components/BillEstimator';
import { getTelecomRecommendations } from './services/geminiService';
import type { TelecomPlan, UserProfile } from './types';
import { Header } from './components/Header';
import { WifiIcon, MapPinIcon, BoltIcon, CalculatorIcon, Bars3BottomLeftIcon } from './components/icons';
import { COUNTRIES } from './data/countries';

type Tab = 'recommender' | 'map' | 'speedTest' | 'estimator';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendedPlans, setRecommendedPlans] = useState<TelecomPlan[]>([]);
  const [comparisonPlans, setComparisonPlans] = useState<TelecomPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('recommender');
  const [currency, setCurrency] = useState<string>('$');

  const handleProfileSubmit = useCallback(async (profile: UserProfile) => {
    setUserProfile(profile);
    setLoading(true);
    setError(null);
    setRecommendedPlans([]);
    setComparisonPlans([]);
    
    const selectedCountry = COUNTRIES.find(c => c.code === profile.country);
    setCurrency(selectedCountry?.currency.symbol || '$');
    const providers = selectedCountry?.providers || [];

    try {
      const plans = await getTelecomRecommendations(profile, providers);
      setRecommendedPlans(plans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleComparison = (plan: TelecomPlan) => {
    setComparisonPlans(prev =>
      prev.find(p => p.id === plan.id)
        ? prev.filter(p => p.id !== plan.id)
        : [...prev, plan]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recommender':
        return (
          <>
            <RecommendationForm onSubmit={handleProfileSubmit} loading={loading} />
            {error && <div className="mt-6 text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
            <PlanList
              plans={recommendedPlans}
              loading={loading}
              comparisonPlans={comparisonPlans}
              onToggleCompare={toggleComparison}
              currencySymbol={currency}
            />
            {comparisonPlans.length > 0 && <ComparisonView plans={comparisonPlans} currencySymbol={currency} />}
          </>
        );
      case 'map':
        return <CoverageMap />;
      case 'speedTest':
        return <SpeedTest />;
      case 'estimator':
        return <BillEstimator plans={recommendedPlans.length > 0 ? recommendedPlans : undefined} currencySymbol={currency} />;
      default:
        return null;
    }
  };
  
  const TABS: { id: Tab; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'recommender', label: 'Finder', icon: Bars3BottomLeftIcon },
    { id: 'map', label: 'Coverage', icon: MapPinIcon },
    { id: 'speedTest', label: 'Speed Test', icon: BoltIcon },
    { id: 'estimator', label: 'Bill Estimator', icon: CalculatorIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-800">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="mb-6 border-b border-neutral-200">
            <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap flex items-center py-3 px-2 sm:px-4 font-medium text-sm sm:text-base border-b-2 transition-colors duration-200 ease-in-out
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          {renderTabContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-neutral-500 text-sm">
        <p>Telecom Plan Finder &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;