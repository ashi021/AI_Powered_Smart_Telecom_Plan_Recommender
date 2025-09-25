export interface Country {
  code: string;
  name: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  cities: string[];
  providers: string[];
  lat: number;
  lng: number;
  zoom: number;
}

export const COUNTRIES: Country[] = [
  {
    code: 'US',
    name: 'United States',
    currency: { code: 'USD', name: 'United States Dollar', symbol: '$' },
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    providers: ['Verizon', 'AT&T', 'T-Mobile'],
    lat: 37.0902,
    lng: -95.7129,
    zoom: 4,
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
    cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
    providers: ['Rogers', 'Bell', 'Telus'],
    lat: 56.1304,
    lng: -106.3468,
    zoom: 4,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: { code: 'GBP', name: 'British Pound', symbol: '£' },
    cities: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
    providers: ['EE', 'O2', 'Vodafone', 'Three'],
    lat: 55.3781,
    lng: -3.4360,
    zoom: 5,
  },
    {
    code: 'AU',
    name: 'Australia',
    currency: { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    providers: ['Telstra', 'Optus', 'Vodafone'],
    lat: -25.2744,
    lng: 133.7751,
    zoom: 4,
  },
  {
    code: 'IN',
    name: 'India',
    currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
    providers: ['Jio', 'Airtel', 'Vodafone Idea'],
    lat: 20.5937,
    lng: 78.9629,
    zoom: 5,
  }
];
