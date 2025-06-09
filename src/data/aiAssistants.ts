
export interface AIAssistant {
  id: string;
  name: string;
  specialty: string;
  description: string;
  color: string;
  available: boolean;
  departments: string[];
}

export const aiAssistantsData: AIAssistant[] = [
  {
    id: 'claims-processor',
    name: 'Claims Processor AI',
    specialty: 'Claims Processing',
    description: 'Handles claim submissions, documentation, and processing workflows',
    color: 'bg-blue-500',
    available: true,
    departments: ['CAN program', 'Claims', 'Operations']
  },
  {
    id: 'policy-expert',
    name: 'CCS Policy Pro',
    specialty: 'Policy Analysis',
    description: 'Interprets insurance policies, coverage details, and exclusions',
    color: 'bg-green-500',
    available: true,
    departments: ['CAN program', 'Policy', 'Underwriting']
  },
  {
    id: 'damage-assessor',
    name: 'Damage Assessment AI',
    specialty: 'Damage Assessment',
    description: 'Analyzes property damage reports and assessment methodologies',
    color: 'bg-purple-500',
    available: true,
    departments: ['CAN program', 'Claims', 'Field Operations']
  },
  {
    id: 'legal-advisor',
    name: 'Legal Advisor AI',
    specialty: 'Legal Compliance',
    description: 'Provides guidance on legal requirements and compliance issues',
    color: 'bg-amber-500',
    available: false,
    departments: ['Legal', 'Compliance']
  },
  {
    id: 'customer-service',
    name: 'Customer Service AI',
    specialty: 'Customer Relations',
    description: 'Handles customer communications and service inquiries',
    color: 'bg-teal-500',
    available: true,
    departments: ['Customer Service', 'Support']
  }
];
