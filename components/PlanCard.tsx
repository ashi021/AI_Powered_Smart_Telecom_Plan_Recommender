import React from 'react';
import type { TelecomPlan } from '../types';
import { CheckCircleIcon, XCircleIcon, PlusCircleIcon, MinusCircleIcon, StarIcon, TvIcon, PhoneIcon } from './icons';

interface PlanCardProps {
  plan: TelecomPlan;
  isSelectedForCompare: boolean;
  onToggleCompare: (plan: TelecomPlan) => void;
  currencySymbol: string;
}

const FeatureItem: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>; text: string; iconClass?: string }> = ({ icon: Icon, text, iconClass = "text-accent" }) => (
    <div className="flex items-center text-sm text-neutral-600">
        <Icon className={`w-5 h-5 mr-2 flex-shrink-0 ${iconClass}`} />
        <span>{text}</span>
    </div>
);

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelectedForCompare, onToggleCompare, currencySymbol }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full overflow-hidden border border-neutral-200">
      <div className="p-6">
        <h3 className="text-lg font-bold text-primary">{plan.provider}</h3>
        <p className="text-xl font-semibold text-neutral-800 mb-2">{plan.planName}</p>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-neutral-900">{currencySymbol}{plan.monthlyCost}</span>
          <span className="ml-1 text-neutral-500">/month</span>
        </div>

        <div className="space-y-3 mb-4">
          <FeatureItem icon={PhoneIcon} text={`${plan.data} Data`} />
          <FeatureItem icon={StarIcon} text={plan.speed} />
          {plan.ottServices.length > 0 && <FeatureItem icon={TvIcon} text={`Includes ${plan.ottServices.join(', ')}`} />}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-neutral-50 space-y-3 flex-grow">
          <div>
            <h4 className="font-semibold text-sm text-green-600 flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2"/>Pros</h4>
            <ul className="list-disc list-inside text-sm text-neutral-600 pl-2">
                {plan.pros.slice(0, 2).map((pro, i) => <li key={i}>{pro}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-red-600 flex items-center"><XCircleIcon className="w-4 h-4 mr-2"/>Cons</h4>
            <ul className="list-disc list-inside text-sm text-neutral-600 pl-2">
                {plan.cons.slice(0, 2).map((con, i) => <li key={i}>{con}</li>)}
            </ul>
          </div>
      </div>

      <div className="p-6 bg-white mt-auto">
        <button
          onClick={() => onToggleCompare(plan)}
          className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center
            ${isSelectedForCompare
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-primary-light text-primary hover:bg-blue-200'
            }`}
        >
          {isSelectedForCompare 
            ? <><MinusCircleIcon className="w-5 h-5 mr-2" /> Remove from Compare</>
            : <><PlusCircleIcon className="w-5 h-5 mr-2" /> Add to Compare</>
          }
        </button>
      </div>
    </div>
  );
};
