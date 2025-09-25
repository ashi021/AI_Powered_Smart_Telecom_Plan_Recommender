import React from 'react';
import type { TelecomPlan } from '../types';
import { CheckCircleIcon } from './icons';

interface ComparisonViewProps {
  plans: TelecomPlan[];
  currencySymbol: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ plans, currencySymbol }) => {
  if (plans.length === 0) return null;

  const features = [
    { key: 'monthlyCost', label: 'Monthly Cost', format: (val: number) => `${currencySymbol}${val}` },
    { key: 'data', label: 'Data Allowance' },
    { key: 'speed', label: 'Speed' },
    { key: 'contractLength', label: 'Contract' },
    { key: 'ottServices', label: 'OTT Services', format: (val: string[]) => val.join(', ') || 'None' },
    { key: 'familyBenefits', label: 'Family Benefits', format: (val: string[]) => val.join(', ') || 'None' },
    { key: 'roaming', label: 'Roaming' },
    { key: 'devicePerks', label: 'Device Perks' },
  ];

  return (
    <div className="mt-12 animate-slide-in">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">Plan Comparison</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-4">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left font-bold text-neutral-600 border-b-2 border-neutral-200 w-1/4">Feature</th>
              {plans.map(plan => (
                <th key={plan.id} className="p-4 text-left font-bold text-primary border-b-2 border-neutral-200">
                  {plan.provider} - {plan.planName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(feature => (
              <tr key={feature.key} className="border-b border-neutral-100 last:border-b-0">
                <td className="p-4 font-semibold text-neutral-700">{feature.label}</td>
                {plans.map(plan => {
                  const value = plan[feature.key as keyof TelecomPlan];
                  return (
                    <td key={plan.id} className="p-4 text-neutral-600">
                      {feature.format ? feature.format(value as any) : (value || 'N/A')}
                    </td>
                  )
                })}
              </tr>
            ))}
             <tr className="border-b border-neutral-100 last:border-b-0">
                <td className="p-4 font-semibold text-neutral-700">Pros</td>
                {plans.map(plan => (
                    <td key={plan.id} className="p-4 text-neutral-600">
                        <ul className="space-y-1">
                            {plan.pros.map((pro, i) => (
                                <li key={i} className="flex items-start text-sm">
                                    <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                                    <span>{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
