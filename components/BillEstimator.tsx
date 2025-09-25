
import React, { useState, useEffect } from 'react';
import type { TelecomPlan } from '../types';
import { CalculatorIcon } from './icons';

interface BillEstimatorProps {
  plans?: TelecomPlan[];
  currencySymbol: string;
}

export const BillEstimator: React.FC<BillEstimatorProps> = ({ plans, currencySymbol }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [numLines, setNumLines] = useState(1);
  const [taxRate, setTaxRate] = useState(15); // Default 15% tax/fee rate
  const [total, setTotal] = useState(0);

  const selectedPlan = plans?.find(p => p.id === selectedPlanId);

  useEffect(() => {
    if (selectedPlan) {
      const baseCost = selectedPlan.monthlyCost * numLines;
      const taxes = baseCost * (taxRate / 100);
      setTotal(baseCost + taxes);
    } else {
      setTotal(0);
    }
  }, [selectedPlan, numLines, taxRate]);
  
  useEffect(() => {
    if (plans && plans.length > 0) {
      if (!plans.find(p => p.id === selectedPlanId)) {
        setSelectedPlanId(plans[0].id);
        setNumLines(1);
      }
    } else {
      setSelectedPlanId(null);
    }
  }, [plans, selectedPlanId]);


  if (!plans || plans.length === 0) {
    return (
      <div className="text-center p-8 bg-neutral-50 rounded-lg animate-slide-in">
        <CalculatorIcon className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
        <h3 className="text-xl font-semibold text-neutral-700">Bill Estimator</h3>
        <p className="text-neutral-500 mt-2">
          First, find some recommended plans using the 'Finder' tab. Your recommendations will appear here to estimate your monthly bill.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-slide-in p-4 md:p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6 text-center">Estimate Your Monthly Bill</h2>
      
      <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
        <div>
          <label htmlFor="plan-select" className="block text-sm font-medium text-neutral-600 mb-1">Select a Recommended Plan</label>
          <select 
            id="plan-select"
            value={selectedPlanId ?? ''}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-md bg-white focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>Select a plan</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.provider} - {plan.planName} ({currencySymbol}{plan.monthlyCost}/mo)
              </option>
            ))}
          </select>
        </div>

        {selectedPlan && (
          <>
            <div>
              <label htmlFor="num-lines" className="block text-sm font-medium text-neutral-600 mb-1">
                Number of Lines: <span className="font-bold text-primary">{numLines}</span>
              </label>
              <input 
                id="num-lines" 
                type="range" 
                min="1" 
                max="10" 
                value={numLines} 
                onChange={e => setNumLines(Number(e.target.value))} 
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary" 
              />
            </div>
            
            <div>
              <label htmlFor="tax-rate" className="block text-sm font-medium text-neutral-600 mb-1">
                Estimated Taxes & Fees Rate: <span className="font-bold text-primary">{taxRate}%</span>
              </label>
              <input 
                id="tax-rate" 
                type="range" 
                min="5" 
                max="30"
                step="1" 
                value={taxRate} 
                onChange={e => setTaxRate(Number(e.target.value))} 
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary" 
              />
            </div>

            <div className="pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-neutral-700">Base Cost:</span>
                    <span className="font-medium text-neutral-800">{currencySymbol}{(selectedPlan.monthlyCost * numLines).toFixed(2)}</span>
                </div>
                 <div className="flex justify-between items-center text-sm text-neutral-500">
                    <span>Taxes & Fees (~{taxRate}%):</span>
                    <span>{currencySymbol}{(selectedPlan.monthlyCost * numLines * (taxRate / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold mt-4">
                    <span className="text-primary">Estimated Total:</span>
                    <span className="text-primary">{currencySymbol}{total.toFixed(2)}</span>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
