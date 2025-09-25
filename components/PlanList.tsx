import React from 'react';
import { PlanCard } from './PlanCard';
import type { TelecomPlan } from '../types';

interface PlanListProps {
  plans: TelecomPlan[];
  loading: boolean;
  comparisonPlans: TelecomPlan[];
  onToggleCompare: (plan: TelecomPlan) => void;
  currencySymbol: string;
}

export const PlanList: React.FC<PlanListProps> = ({ plans, loading, comparisonPlans, onToggleCompare, currencySymbol }) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4 text-neutral-700">Finding the best plans for you...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-neutral-300 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">Top Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div key={plan.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-in opacity-0">
            <PlanCard
                plan={plan}
                isSelectedForCompare={comparisonPlans.some(p => p.id === plan.id)}
                onToggleCompare={onToggleCompare}
                currencySymbol={currencySymbol}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
