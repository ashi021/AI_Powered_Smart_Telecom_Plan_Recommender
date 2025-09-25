export interface UserProfile {
  country: string; // e.g., 'US'
  city: string;
  numUsers: number;
  dataUsage: number; // in GB
  primaryUses: string[]; // e.g., ['Streaming', 'Gaming', 'Work']
  budget: number; // monthly budget
  wantsNewDevice: boolean;
  services: {
    ott: string[];
    connectivity: string[];
    family: string[];
    device: string[];
  };
  preferredProviders: string[];
}

export interface TelecomPlan {
  id: string;
  provider: string;
  planName: string;
  monthlyCost: number;
  data: string; // e.g., '50GB', 'Unlimited'
  speed: string; // e.g., 'Up to 100Mbps'
  contractLength: string; // e.g., '24 months', 'No contract'
  ottServices: string[];
  familyBenefits: string[];
  roaming: string;
  devicePerks: string;
  pros: string[];
  cons: string[];
}