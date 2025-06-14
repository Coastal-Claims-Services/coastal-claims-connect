import { 
  KnowledgeTree, 
  KnowledgeItem, 
  RuleSelectionContext, 
  RuleSelectionResult, 
  RuleConflict,
  Department,
  SubDepartment,
  Workflow
} from '@/types/knowledge';

/**
 * Hierarchical rule selection algorithm
 * Traverses Department > Sub-Department > Workflow tree to find applicable rules
 */
export const selectKnowledgeItems = (
  knowledgeTree: KnowledgeTree,
  context: RuleSelectionContext
): RuleSelectionResult => {
  const now = new Date().toISOString();
  
  // Step 1: Find department path
  const candidateItems: KnowledgeItem[] = [];
  const pathsSearched: string[] = [];
  
  // Find matching department
  const matchingDept = knowledgeTree.departments.find(dept => 
    dept.name.toLowerCase().includes(context.userDepartment.toLowerCase()) ||
    context.userDepartment.toLowerCase().includes(dept.name.toLowerCase())
  );
  
  if (matchingDept) {
    // Collect items from department level (if any direct items exist)
    pathsSearched.push(matchingDept.name);
    
    // Traverse sub-departments
    for (const subDept of matchingDept.subDepartments) {
      pathsSearched.push(`${matchingDept.name} > ${subDept.name}`);
      
      // Traverse workflows
      for (const workflow of subDept.workflows) {
        const workflowPath = `${matchingDept.name} > ${subDept.name} > ${workflow.name}`;
        pathsSearched.push(workflowPath);
        
        // Add all items from this workflow
        candidateItems.push(...workflow.items.map(item => ({
          ...item,
          departmentPath: workflowPath
        })));
      }
    }
  }
  
  // Step 2: Add items matching tags/intent (cross-department search)
  if (context.intent) {
    for (const dept of knowledgeTree.departments) {
      for (const subDept of dept.subDepartments) {
        for (const workflow of subDept.workflows) {
          for (const item of workflow.items) {
            const hasMatchingTag = item.tags.some(tag => 
              tag.toLowerCase().includes(context.intent!.toLowerCase()) ||
              context.intent!.toLowerCase().includes(tag.toLowerCase())
            );
            
            if (hasMatchingTag && !candidateItems.find(c => c.id === item.id)) {
              candidateItems.push({
                ...item,
                departmentPath: `${dept.name} > ${subDept.name} > ${workflow.name}`
              });
            }
          }
        }
      }
    }
  }
  
  // Step 3: Filter by scope
  const scopeFilteredItems = candidateItems.filter(item => {
    // Role filter
    if (item.scope.role.length > 0 && !item.scope.role.includes(context.userRole)) {
      return false;
    }
    
    // State filter
    if (context.userState && item.scope.state.length > 0 && 
        !item.scope.state.includes(context.userState)) {
      return false;
    }
    
    // Severity filter
    if (context.claimSeverity && item.scope.severity_max && 
        context.claimSeverity > item.scope.severity_max) {
      return false;
    }
    
    return true;
  });
  
  // Step 4: Filter by active status and date range
  const activeItems = scopeFilteredItems.filter(item => {
    if (!item.isActive) return false;
    
    const effectiveDate = new Date(item.effective);
    const currentDate = new Date(now);
    
    if (effectiveDate > currentDate) return false;
    
    if (item.sunset) {
      const sunsetDate = new Date(item.sunset);
      if (sunsetDate <= currentDate) return false;
    }
    
    return true;
  });
  
  // Step 5: Sort by priority then order
  const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
  const sortedItems = activeItems.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.order - b.order;
  });
  
  // Step 6: Detect conflicts
  const conflicts = detectConflicts(sortedItems);
  
  return {
    selectedItems: sortedItems,
    conflicts,
    auditLog: {
      selectionCriteria: context,
      candidateItems: candidateItems.map(i => i.id),
      filteredItems: sortedItems.map(i => i.id),
      timestamp: now,
      rulePath: pathsSearched.join('; ')
    }
  };
};

/**
 * Detect rule conflicts for admin review
 */
const detectConflicts = (items: KnowledgeItem[]): RuleConflict[] => {
  const conflicts: RuleConflict[] = [];
  
  // Group by priority and type
  const highPriorityRules = items.filter(i => i.priority === 'High' && i.type === 'rule');
  
  // Check for conflicting high-priority rules with similar instructions
  for (let i = 0; i < highPriorityRules.length; i++) {
    for (let j = i + 1; j < highPriorityRules.length; j++) {
      const item1 = highPriorityRules[i];
      const item2 = highPriorityRules[j];
      
      if (!item1.aiInstructions || !item2.aiInstructions) continue;
      
      // Simple conflict detection based on overlapping keywords
      const keywords1 = item1.aiInstructions.toLowerCase().split(/\s+/);
      const keywords2 = item2.aiInstructions.toLowerCase().split(/\s+/);
      const overlap = keywords1.filter(word => 
        word.length > 3 && keywords2.includes(word)
      );
      
      if (overlap.length > 2) { // Threshold for potential conflict
        conflicts.push({
          items: [item1, item2],
          conflictType: 'instruction',
          severity: 'warning',
          path: (item1 as any).departmentPath || 'Unknown'
        });
      }
    }
  }
  
  return conflicts;
};

/**
 * Generate AI prompt from selected knowledge items
 */
export const generateKnowledgePrompt = (items: KnowledgeItem[]): string => {
  if (items.length === 0) return '';
  
  const rules = items.filter(item => item.type === 'rule' && item.aiInstructions);
  const commands = items.filter(item => item.type === 'command');
  
  let prompt = '';
  
  // Add rules to system prompt
  if (rules.length > 0) {
    const ruleInstructions = rules
      .map((rule, index) => `${index + 1}. ${rule.aiInstructions}`)
      .join('\n');
    prompt += `You must follow these department-specific rules in order of priority:\n\n${ruleInstructions}\n\n`;
  }
  
  // Add available commands context
  if (commands.length > 0) {
    const commandsList = commands
      .map(cmd => `- ${cmd.title}: ${cmd.commandBody}`)
      .join('\n');
    prompt += `Available commands you can suggest or reference:\n\n${commandsList}\n\n`;
  }
  
  return prompt;
};

/**
 * Create default knowledge tree structure
 */
export const createDefaultKnowledgeTree = (): KnowledgeTree => {
  return {
    departments: [
      {
        id: 'executive',
        name: 'Executive',
        description: 'Executive leadership team',
        order: 1,
        subDepartments: [
          {
            id: 'executive-general',
            name: 'General',
            description: 'Universal rules and policies for all Executive team members',
            order: 1,
            workflows: [
              {
                id: 'executive-general-policies',
                name: 'Executive General Policies',
                description: 'Company-wide executive policies and procedures',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'ceo',
            name: 'CEO',
            description: 'Chief Executive Officer',
            order: 2,
            workflows: [
              {
                id: 'strategic-planning',
                name: 'Strategic Planning',
                description: 'Company strategic planning and vision',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'president',
            name: 'President',
            description: 'Company President',
            order: 3,
            workflows: [
              {
                id: 'operational-oversight',
                name: 'Operational Oversight',
                description: 'Overall operational management',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'cfo',
            name: 'CFO',
            description: 'Chief Financial Officer',
            order: 4,
            workflows: [
              {
                id: 'financial-oversight',
                name: 'Financial Oversight',
                description: 'Financial planning and control',
                order: 1,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'management',
        name: 'Management',
        description: 'Management team oversight',
        order: 2,
        subDepartments: [
          {
            id: 'management-general',
            name: 'General',
            description: 'Universal policies for all Management team members',
            order: 1,
            workflows: [
              {
                id: 'management-general-policies',
                name: 'Management General Policies',
                description: 'Company-wide management policies and procedures',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'claims-director',
            name: 'Claims Director',
            description: 'Claims management oversight',
            order: 2,
            workflows: [
              {
                id: 'claims-oversight',
                name: 'Claims Oversight',
                description: 'Overall claims department management',
                order: 1,
                items: []
              },
              {
                id: 'policy-review',
                name: 'Policy Review Process',
                description: 'Review and approve policy changes',
                order: 2,
                items: []
              }
            ]
          },
          {
            id: 'hr',
            name: 'HR (Human Resources)',
            description: 'Human resources management',
            order: 3,
            workflows: [
              {
                id: 'employee-management',
                name: 'Employee Management',
                description: 'Employee lifecycle management',
                order: 1,
                items: []
              },
              {
                id: 'recruitment',
                name: 'Recruitment',
                description: 'Hiring and onboarding processes',
                order: 2,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'administrative',
        name: 'Administrative',
        description: 'Administrative operations',
        order: 3,
        subDepartments: [
          {
            id: 'administrative-general',
            name: 'General',
            description: 'Universal policies for all Administrative team members',
            order: 1,
            workflows: [
              {
                id: 'administrative-general-policies',
                name: 'Administrative General Policies',
                description: 'Company-wide administrative policies and procedures',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'onboarding',
            name: 'Onboarding',
            description: 'Client and staff onboarding processes',
            order: 2,
            workflows: [
              {
                id: 'client-onboarding',
                name: 'Client Onboarding',
                description: 'New client setup and documentation',
                order: 1,
                items: []
              },
              {
                id: 'staff-onboarding',
                name: 'Staff Onboarding',
                description: 'New employee onboarding process',
                order: 2,
                items: []
              }
            ]
          },
          {
            id: 'reception',
            name: 'Reception',
            description: 'Front desk and customer service',
            order: 3,
            workflows: [
              {
                id: 'customer-service',
                name: 'Customer Service',
                description: 'Front desk customer interaction',
                order: 1,
                items: []
              },
              {
                id: 'call-handling',
                name: 'Call Handling',
                description: 'Phone and inquiry management',
                order: 2,
                items: []
              }
            ]
          },
          {
            id: 'compliance',
            name: 'Compliance',
            description: 'Regulatory and policy compliance',
            order: 4,
            workflows: [
              {
                id: 'regulatory-compliance',
                name: 'Regulatory Compliance',
                description: 'State and federal regulation adherence',
                order: 1,
                items: []
              },
              {
                id: 'audit-preparation',
                name: 'Audit Preparation',
                description: 'Compliance audit readiness',
                order: 2,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'finance',
        name: 'Finance Department (directed by CFO)',
        description: 'Financial operations and accounting',
        order: 4,
        subDepartments: [
          {
            id: 'finance-general',
            name: 'General',
            description: 'Universal policies for all Finance team members',
            order: 1,
            workflows: [
              {
                id: 'finance-general-policies',
                name: 'Finance General Policies',
                description: 'Company-wide finance policies and procedures',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'accounts-receivable',
            name: 'AR (Accounts Receivable)',
            description: 'Client billing and payment processing',
            order: 2,
            workflows: [
              {
                id: 'billing-process',
                name: 'Billing Process',
                description: 'Client invoicing and payment tracking',
                order: 1,
                items: []
              },
              {
                id: 'collections',
                name: 'Collections',
                description: 'Outstanding payment collection',
                order: 2,
                items: []
              }
            ]
          },
          {
            id: 'accounts-payable',
            name: 'AP (Accounts Payable)',
            description: 'Vendor payments and expense management',
            order: 3,
            workflows: [
              {
                id: 'expense-processing',
                name: 'Expense Processing',
                description: 'Process and approve vendor payments',
                order: 1,
                items: []
              },
              {
                id: 'budget-management',
                name: 'Budget Management',
                description: 'Budget tracking and control',
                order: 2,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'claims',
        name: 'Claims',
        description: 'Claims processing and management',
        order: 5,
        subDepartments: [
          {
            id: 'claims-general',
            name: 'General',
            description: 'Universal policies for all Claims team members (e.g., CCS Policy Pro)',
            order: 1,
            workflows: [
              {
                id: 'claims-general-policies',
                name: 'Claims General Policies',
                description: 'Company-wide claims policies and tools like CCS Policy Pro',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'mmc-adjusters',
            name: 'MMC (Management Monitored Claims) Public Adjusters',
            description: 'Management monitored claims processing',
            order: 2,
            workflows: [
              {
                id: 'claim-intake',
                name: 'Claim Intake',
                description: 'Initial claim processing and documentation',
                order: 1,
                items: []
              },
              {
                id: 'claim-review',
                name: 'Claim Review',
                description: 'Management review of claims',
                order: 2,
                items: []
              }
            ]
          },
          {
            id: 'ctg-adjusters',
            name: 'CTG (Cradle to Grave) Public Adjusters',
            description: 'Full service claims management',
            order: 3,
            workflows: [
              {
                id: 'full-service-claims',
                name: 'Full Service Claims',
                description: 'End-to-end claims management',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'can-network',
            name: 'CAN Network (Coastal Adjuster Network)',
            description: 'Network of coastal adjusters',
            order: 4,
            workflows: [
              {
                id: 'network-coordination',
                name: 'Network Coordination',
                description: 'Adjuster network management',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'tls',
            name: 'TLS (Team Lead Support)',
            description: 'Team leadership support services',
            order: 5,
            workflows: [
              {
                id: 'team-support',
                name: 'Team Support',
                description: 'Support for claims teams',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'investigation',
            name: 'Investigation',
            description: 'Claims investigation services',
            order: 6,
            workflows: [
              {
                id: 'claim-investigation',
                name: 'Claim Investigation',
                description: 'Detailed claim investigation process',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'estimating',
            name: 'Estimating',
            description: 'Damage estimation and assessment',
            order: 7,
            workflows: [
              {
                id: 'damage-estimation',
                name: 'Damage Estimation',
                description: 'Property damage assessment and estimation',
                order: 1,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'commercial-claims',
        name: 'Commercial Claims Department',
        description: 'Commercial claims processing',
        order: 6,
        subDepartments: [
          {
            id: 'commercial-general',
            name: 'General',
            description: 'Universal policies for all Commercial Claims team members',
            order: 1,
            workflows: [
              {
                id: 'commercial-general-policies',
                name: 'Commercial General Policies',
                description: 'Company-wide commercial claims policies and procedures',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'president-commercial',
            name: 'President of Commercial Claims',
            description: 'Commercial claims leadership',
            order: 2,
            workflows: [
              {
                id: 'commercial-oversight',
                name: 'Commercial Oversight',
                description: 'Commercial claims department management',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'coo-commercial',
            name: '2 COOs',
            description: 'Chief Operating Officers for commercial claims',
            order: 3,
            workflows: [
              {
                id: 'operations-management',
                name: 'Operations Management',
                description: 'Commercial claims operations',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'detailed-adjusters',
            name: 'Detailed Adjusters',
            description: 'Specialized commercial adjusters',
            order: 4,
            workflows: [
              {
                id: 'detailed-adjustment',
                name: 'Detailed Adjustment',
                description: 'Complex commercial claim adjustment',
                order: 1,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'sales',
        name: 'Sales',
        description: 'Sales and business development',
        order: 7,
        subDepartments: [
          {
            id: 'sales-general',
            name: 'General',
            description: 'Universal policies for all Sales team members',
            order: 1,
            workflows: [
              {
                id: 'sales-general-policies',
                name: 'Sales General Policies',
                description: 'Company-wide sales policies and procedures',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'sales-team',
            name: 'Sales Team',
            description: 'Sales representatives and account management',
            order: 2,
            workflows: [
              {
                id: 'lead-generation',
                name: 'Lead Generation',
                description: 'New client acquisition',
                order: 1,
                items: []
              },
              {
                id: 'account-management',
                name: 'Account Management',
                description: 'Existing client relationship management',
                order: 2,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'strategic-growth',
        name: 'Strategic Growth & Partnerships',
        description: 'Business growth and partnership development',
        order: 8,
        subDepartments: [
          {
            id: 'strategic-general',
            name: 'General',
            description: 'Universal policies for all Strategic Growth & Partnerships team members',
            order: 1,
            workflows: [
              {
                id: 'strategic-general-policies',
                name: 'Strategic General Policies',
                description: 'Company-wide strategic growth and partnership policies',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'cristin-role',
            name: 'Cristin\'s Role',
            description: 'Strategic growth initiatives',
            order: 2,
            workflows: [
              {
                id: 'growth-strategy',
                name: 'Growth Strategy',
                description: 'Strategic business growth planning',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'carlos-role',
            name: 'Carlos\'s Role',
            description: 'Partnership development',
            order: 3,
            workflows: [
              {
                id: 'partnership-development',
                name: 'Partnership Development',
                description: 'Strategic partnership initiatives',
                order: 1,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'it',
        name: 'IT',
        description: 'Information technology services',
        order: 9,
        subDepartments: [
          {
            id: 'it-general',
            name: 'General',
            description: 'Universal policies for all IT team members',
            order: 1,
            workflows: [
              {
                id: 'it-general-policies',
                name: 'IT General Policies',
                description: 'Company-wide IT policies and procedures',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'it-support',
            name: 'IT Support',
            description: 'Technology support and infrastructure',
            order: 2,
            workflows: [
              {
                id: 'system-administration',
                name: 'System Administration',
                description: 'IT infrastructure management',
                order: 1,
                items: []
              },
              {
                id: 'user-support',
                name: 'User Support',
                description: 'Employee technology assistance',
                order: 2,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Marketing and communications',
        order: 10,
        subDepartments: [
          {
            id: 'marketing-general',
            name: 'General',
            description: 'Universal policies for all Marketing team members',
            order: 1,
            workflows: [
              {
                id: 'marketing-general-policies',
                name: 'Marketing General Policies',
                description: 'Company-wide marketing policies and procedures',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'marketing-team',
            name: 'Marketing Team',
            description: 'Marketing campaigns and communications',
            order: 2,
            workflows: [
              {
                id: 'campaign-management',
                name: 'Campaign Management',
                description: 'Marketing campaign development and execution',
                order: 1,
                items: []
              },
              {
                id: 'brand-management',
                name: 'Brand Management',
                description: 'Brand consistency and messaging',
                order: 2,
                items: []
              }
            ]
          }
        ]
      },
      {
        id: 'operations',
        name: 'Operations',
        description: 'Operational management and support',
        order: 11,
        subDepartments: [
          {
            id: 'operations-general',
            name: 'General',
            description: 'Universal policies for all Operations team members',
            order: 1,
            workflows: [
              {
                id: 'operations-general-policies',
                name: 'Operations General Policies',
                description: 'Company-wide operations policies and procedures',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'operations-team',
            name: 'Operations Team',
            description: 'General operational support',
            order: 2,
            workflows: [
              {
                id: 'process-improvement',
                name: 'Process Improvement',
                description: 'Operational efficiency initiatives',
                order: 1,
                items: []
              },
              {
                id: 'quality-assurance',
                name: 'Quality Assurance',
                description: 'Quality control and assurance',
                order: 2,
                items: []
              }
            ]
          }
        ]
      }
    ],
    version: 'v2025-06-14-002',
    lastModified: new Date().toISOString()
  };
};