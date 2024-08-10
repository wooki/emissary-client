export const ResourceRequiredFor = (resource) => {
  return resource === 'food' ? 'upkeep' : 'industry';
};

export const TradePolicies = [
  {
    value: 'none',
    title: 'None',
    desc: (resource) => `Do not buy or sell any ${resource}.`,
  },
  {
    value: 'ration',
    title: 'Ration',
    desc: (resource) =>
      `Buy/sell up to half required for ${ResourceRequiredFor(resource)}.`,
  },
  {
    value: 'trade',
    title: 'Trade',
    desc: (resource) =>
      `Buy/sell up to quantity required for ${ResourceRequiredFor(resource)}.`,
  },
  {
    value: 'reserve',
    title: 'Reserve',
    desc: (resource) =>
      `Buy/sell up to twice ${ResourceRequiredFor(resource)}.`,
  },
  {
    value: 'stockpile',
    title: 'Stockpile',
    desc: (resource) =>
      `Buy/sell up to three times ${ResourceRequiredFor(resource)}.`,
  },
  {
    value: 'hoard',
    title: 'Hoard',
    desc: (resource) =>
      `Buy/sell up to five times ${ResourceRequiredFor(resource)}.`,
  },
];
