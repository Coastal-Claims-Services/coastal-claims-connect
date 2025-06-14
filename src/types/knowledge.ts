// Knowledge Management System - Hierarchical Structure
// Department > Sub-Department > Workflow > Content Types

export type ContentType = 'rule' | 'command' | 'smartRule' | 'sop';

export interface KnowledgeScope {
  role: string[];
  state: string[];
  severity_max?: number;
  department?: string[];
}

export interface KnowledgeItem {
  id: string;
  title: string;
  type: ContentType;
  
  // Content fields (conditional based on type)
  content?: string;              // For SOP & smartRule (rich text/markdown)
  aiInstructions?: string;       // For rule (≤160 chars)
  commandBody?: string;          // For command (structured payload)
  
  // Meta fields
  scope: KnowledgeScope;
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
  order: number;
  version: string;
  effective: string;            // ISO date
  sunset: string | null;        // ISO date or null
  
  // Audit fields
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  changeNote: string;
  isActive: boolean;
  
  // Runtime field for tracking source path
  departmentPath?: string;       // Added during rule selection
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  items: KnowledgeItem[];
  order: number;
}

export interface SubDepartment {
  id: string;
  name: string;
  description?: string;
  workflows: Workflow[];
  order: number;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  subDepartments: SubDepartment[];
  order: number;
}

export interface KnowledgeTree {
  departments: Department[];
  version: string;
  lastModified: string;
}

export interface RuleConflict {
  items: KnowledgeItem[];
  conflictType: 'priority' | 'scope' | 'instruction';
  severity: 'error' | 'warning';
  path: string; // Department > SubDept > Workflow
}

export interface RuleSelectionContext {
  userId: string;
  userRole: string;
  userDepartment: string;
  userState?: string;
  claimSeverity?: number;
  intent?: string;
  workflowContext?: string; // Current workflow being worked on
}

export interface RuleSelectionResult {
  selectedItems: KnowledgeItem[];
  conflicts: RuleConflict[];
  auditLog: {
    selectionCriteria: RuleSelectionContext;
    candidateItems: string[];
    filteredItems: string[];
    timestamp: string;
    rulePath: string; // The path where rules were found
  };
}

// Helper types for UI
export interface TreeNodeExpansion {
  [key: string]: boolean; // nodeId -> expanded state
}

export interface EditingState {
  type: 'department' | 'subDepartment' | 'workflow' | 'item';
  id: string;
  parentId?: string;
  isNew?: boolean;
}