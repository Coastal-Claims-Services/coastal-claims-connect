export interface RuleScope {
  role: string[];
  state: string[];
  severity_max?: number;
  department?: string[];
}

export interface Rule {
  id: string;
  title: string;
  content: string; // Full SOP text for human training & PDF exports
  aiInstructions: string; // Compact, imperative rule (≤160 chars)
  scope: RuleScope;
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
  order: number;
  version: string;
  effective: string;
  sunset: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  changeNote: string;
  departmentPath: string[]; // Tree path for rule location
  isActive: boolean;
}

export interface RuleConflict {
  rules: Rule[];
  conflictType: 'priority' | 'scope' | 'instruction';
  severity: 'error' | 'warning';
}

export interface RuleSelectionContext {
  userId: string;
  userRole: string;
  userDepartment: string;
  userState?: string;
  claimSeverity?: number;
  intent?: string;
}

export interface RuleSelectionResult {
  selectedRules: Rule[];
  conflicts: RuleConflict[];
  auditLog: {
    selectionCriteria: RuleSelectionContext;
    candidateRules: string[];
    filteredRules: string[];
    timestamp: string;
  };
}