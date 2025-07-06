export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  location: string;
  email: string;
  phone: string;
  startDate: string;
  complianceStatus: 'compliant' | 'warning' | 'critical';
  licenses: {
    state: string;
    licenseNumber: string;
    expires: string;
    status: 'active' | 'expired' | 'pending';
  }[];
  ceCredits: {
    required: number;
    completed: number;
    deadline: string;
  };
  bonds: {
    type: string;
    amount: string;
    expires: string;
    status: 'active' | 'expired';
  }[];
}

export const employees: Employee[] = [
  {
    id: 'aaron-tuck',
    name: 'Aaron Tuck',
    initials: 'AT',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'New Smyrna Beach, FL',
    email: 'aaron@coastalclaims.net',
    phone: '17273647761',
    startDate: 'Feb 2019',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-12345', expires: '2025-02-28', status: 'active' },
      { state: 'GA', licenseNumber: 'GA-67890', expires: '2024-12-31', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 18, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-01-15', status: 'active' }]
  },
  {
    id: 'adam-whitney',
    name: 'Adam Whitney',
    initials: 'AW',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'South FL',
    email: 'awhitney@coastalclaims.net',
    phone: '(754)271-4282',
    startDate: 'Oct 2024',
    complianceStatus: 'warning',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-54321', expires: '2025-10-31', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 8, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-03-01', status: 'active' }]
  },
  {
    id: 'barry-krecow',
    name: 'Barry Krecow',
    initials: 'BK',
    role: '0823',
    department: 'Claims',
    location: 'South FL',
    email: 'bkrecow@coastalclaims.net',
    phone: '12393504855',
    startDate: 'Sep 2024',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-11111', expires: '2025-09-30', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 20, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-02-15', status: 'active' }]
  },
  {
    id: 'bill-prendergast',
    name: 'Bill Prendergast',
    initials: 'BP',
    role: 'Branch Manager of Indialantic',
    department: 'Claims',
    location: 'Indialantic Beach, FL',
    email: 'bill@coastalclaims.net',
    phone: '3215018635',
    startDate: 'Dec 2021',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-22222', expires: '2025-12-31', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 24, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$100,000', expires: '2025-06-01', status: 'active' }]
  },
  {
    id: 'carey-schiavi',
    name: 'Carey Schiavi',
    initials: 'CS',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'Indialantic Beach, FL',
    email: 'cschiavi@coastalclaims.net',
    phone: '7722605955',
    startDate: 'Oct 2023',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-33333', expires: '2025-10-31', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 16, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-04-01', status: 'active' }]
  },
  {
    id: 'carl-renner',
    name: 'Carl Joseph Renner',
    initials: 'CR',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'New Smyrna Beach, FL',
    email: 'carl@coastalclaims.net',
    phone: '3863662699',
    startDate: 'Nov 2021',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-44444', expires: '2025-11-30', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 22, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-05-15', status: 'active' }]
  },
  {
    id: 'carlos-machin',
    name: 'Carlos Machin',
    initials: 'CM',
    role: 'Branch Manager of South Florida',
    department: 'Claims',
    location: 'South FL',
    email: 'cmachin@coastalclaims.net',
    phone: '5618794885',
    startDate: 'Jun 2024',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-55555', expires: '2025-06-30', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 20, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$100,000', expires: '2025-08-01', status: 'active' }]
  },
  {
    id: 'carlos-puente',
    name: 'Carlos Puente',
    initials: 'CP',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'New Smyrna Beach, FL',
    email: 'carlos@coastalclaims.net',
    phone: '17863065904',
    startDate: 'Feb 2021',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-66666', expires: '2025-02-28', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 24, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-01-01', status: 'active' }]
  },
  {
    id: 'chris-mccombs',
    name: 'Chris McCombs',
    initials: 'CM',
    role: 'Branch Manager of Texas',
    department: 'Claims',
    location: 'Haslet, TX',
    email: 'chrismccombs@coastalclaims.net',
    phone: '(314)-809-8274',
    startDate: 'Jul 2023',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'TX', licenseNumber: 'TX-77777', expires: '2025-07-31', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 20, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$100,000', expires: '2025-09-01', status: 'active' }]
  },
  {
    id: 'chris-taylor',
    name: 'Chris Taylor',
    initials: 'CT',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'New Smyrna Beach, FL',
    email: 'ctaylor@coastalclaims.net',
    phone: '17274207561',
    startDate: 'Oct 2024',
    complianceStatus: 'warning',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-88888', expires: '2025-10-31', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 6, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-02-01', status: 'active' }]
  },
  {
    id: 'christopher-hubbard',
    name: 'Christopher Hubbard',
    initials: 'CH',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'Haslet, TX',
    email: 'chubbard@coastalclaims.net',
    phone: '12144540171',
    startDate: 'Jan 2025',
    complianceStatus: 'critical',
    licenses: [
      { state: 'TX', licenseNumber: 'TX-99999', expires: '2025-01-31', status: 'pending' }
    ],
    ceCredits: { required: 24, completed: 0, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-01-15', status: 'active' }]
  },
  {
    id: 'dan-labow',
    name: 'Dan Labow',
    initials: 'DL',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'South FL',
    email: 'dlabow@coastalclaims.net',
    phone: '9549145454',
    startDate: 'Aug 2024',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-10101', expires: '2025-08-31', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 14, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-03-15', status: 'active' }]
  },
  {
    id: 'deanna-dolan',
    name: 'Deanna Dolan',
    initials: 'DD',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'New Smyrna Beach, FL',
    email: 'deanna@coastalclaims.net',
    phone: '13863145202',
    startDate: 'Apr 2021',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-20202', expires: '2025-04-30', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 24, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-07-01', status: 'active' }]
  },
  {
    id: 'jason-james',
    name: 'Jason James',
    initials: 'JJ',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'New Smyrna Beach, FL',
    email: 'jjames@coastalclaims.net',
    phone: '13869511677',
    startDate: 'Sep 2022',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-30303', expires: '2025-09-30', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 18, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-04-15', status: 'active' }]
  },
  {
    id: 'jessica-jones',
    name: 'Jessica Jones',
    initials: 'JJ',
    role: 'Public Adjuster',
    department: 'Claims',
    location: 'New Smyrna Beach, FL',
    email: 'jjones@coastalclaims.net',
    phone: '3864536020',
    startDate: 'Nov 2023',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-40404', expires: '2025-11-30', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 16, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$50,000', expires: '2025-05-01', status: 'active' }]
  },
  // ... continuing with more employees (abbreviated for space)
  {
    id: 'michael-manning',
    name: 'Michael Manning',
    initials: 'MM',
    role: 'Branch Manager of NSB',
    department: 'Claims',
    location: 'New Smyrna Beach, FL',
    email: 'mmanning@coastalclaims.net',
    phone: '13214266566',
    startDate: 'Mar 2023',
    complianceStatus: 'compliant',
    licenses: [
      { state: 'FL', licenseNumber: 'PA-50505', expires: '2025-03-31', status: 'active' }
    ],
    ceCredits: { required: 24, completed: 24, deadline: '2024-12-31' },
    bonds: [{ type: 'Surety Bond', amount: '$100,000', expires: '2025-06-15', status: 'active' }]
  }
];

export const getEmployeesByLocation = (location: string) => {
  return employees.filter(emp => emp.location.includes(location));
};

export const getEmployeesByRole = (role: string) => {
  return employees.filter(emp => emp.role.toLowerCase().includes(role.toLowerCase()));
};

export const getEmployeesByComplianceStatus = (status: 'compliant' | 'warning' | 'critical') => {
  return employees.filter(emp => emp.complianceStatus === status);
};