
export interface AIAssistant {
  id: string;
  name: string;
  specialty: string;
  description: string;
  color: string;
  available: boolean;
  departments: string[];
  systemPrompt?: string;
  modelConfig?: {
    temperature: number;
    maxTokens: number;
  };
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const aiAssistantsData: AIAssistant[] = [
  {
    id: 'claims-processor',
    name: 'Claims Processor AI',
    specialty: 'Claims Processing',
    description: 'Handles claim submissions, documentation, and processing workflows',
    color: 'bg-blue-500',
    available: true,
    departments: ['CAN program', 'Claims', 'Operations'],
    systemPrompt: 'You are a claims processing specialist...',
    modelConfig: { temperature: 0.3, maxTokens: 2000 }
  },
  {
    id: 'policy-expert',
    name: 'CCS Policy Pro',
    specialty: 'Policy Analysis',
    description: 'Interprets insurance policies, coverage details, and exclusions',
    color: 'bg-green-500',
    available: true,
    departments: ['CAN program', 'Policy', 'Underwriting'],
    systemPrompt: 'You are a policy analysis expert...',
    modelConfig: { temperature: 0.2, maxTokens: 2000 }
  },
  {
    id: 'damage-assessor',
    name: 'Damage Assessment AI',
    specialty: 'Damage Assessment',
    description: 'Analyzes property damage reports and assessment methodologies',
    color: 'bg-purple-500',
    available: true,
    departments: ['CAN program', 'Claims', 'Field Operations'],
    systemPrompt: 'You are a damage assessment specialist...',
    modelConfig: { temperature: 0.3, maxTokens: 2000 }
  },
  {
    id: 'legal-advisor',
    name: 'Legal Advisor AI',
    specialty: 'Legal Compliance',
    description: 'Provides guidance on legal requirements and compliance issues',
    color: 'bg-amber-500',
    available: false,
    departments: ['Legal', 'Compliance'],
    systemPrompt: 'You are a legal compliance advisor...',
    modelConfig: { temperature: 0.1, maxTokens: 2000 }
  },
  {
    id: 'customer-service',
    name: 'Customer Service AI',
    specialty: 'Customer Relations',
    description: 'Handles customer communications and service inquiries',
    color: 'bg-teal-500',
    available: true,
    departments: ['Customer Service', 'Support'],
    systemPrompt: 'You are a customer service specialist...',
    modelConfig: { temperature: 0.4, maxTokens: 1500 }
  }
];
