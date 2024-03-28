export const computeOptions = [
  {
    id: '1',
    name: 'CPU Compute',
    status: 'Available',
    charge: '$0.01/hr',
    provider: 'AWS',
    geography: 'North America',
    available: true
  },
  {
    id: '2',
    name: 'GPU Compute',
    status: 'Unavailable',
    charge: '$0.10/hr',
    provider: 'AWS',
    geography: 'North America',
    available: false
  },
  {
    id: '3',
    name: 'TPU Compute',
    status: 'Unavailable',
    charge: '$0.20/hr',
    provider: 'GCP',
    geography: 'North America',
    available: false
  },
  {
    id: '4',
    name: 'FPGA Compute',
    status: 'Unavailable',
    charge: '$0.05/hr',
    provider: 'Azure',
    geography: 'North America',
    available: false
  },
  {
    id: '5',
    name: 'Quantum Compute',
    status: 'Unavailable',
    charge: '$0.50/hr',
    provider: 'IBM',
    geography: 'North America',
    available: false
  }
]
