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
        id: 'management',
        name: 'Management',
        description: 'Executive and administrative oversight',
        order: 1,
        subDepartments: [
          {
            id: 'claims-director',
            name: 'Claims Director',
            description: 'Claims management oversight',
            order: 1,
            workflows: [
              {
                id: 'policy-review',
                name: 'Policy Review Process',
                description: 'Review and approve policy changes',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'hr',
            name: 'HR (Human Resources)',
            description: 'Human resources management',
            order: 2,
            workflows: [
              {
                id: 'employee-onboarding',
                name: 'Employee Onboarding',
                description: 'New employee integration process',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'onboarding',
            name: 'Onboarding',
            description: 'Client and staff onboarding processes',
            order: 3,
            workflows: [
              {
                id: 'client-onboarding',
                name: 'Client Onboarding',
                description: 'Process for bringing new clients into the system',
                order: 1,
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
              }
            ]
          }
        ]
      },
      {
        id: 'finance',
        name: 'Finance',
        description: 'Financial operations and accounting',
        order: 2,
        subDepartments: [
          {
            id: 'accounts-receivable',
            name: 'AR (Accounts Receivable)',
            description: 'Client billing and payment processing',
            order: 1,
            workflows: [
              {
                id: 'billing-process',
                name: 'Billing Process',
                description: 'Client invoicing and payment tracking',
                order: 1,
                items: []
              }
            ]
          },
          {
            id: 'accounts-payable',
            name: 'AP (Accounts Payable)',
            description: 'Vendor payments and expense management',
            order: 2,
            workflows: [
              {
                id: 'expense-processing',
                name: 'Expense Processing',
                description: 'Process and approve expenses',
                order: 1,
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
        order: 3,
        subDepartments: [
          {
            id: 'mmc-adjusters',
            name: 'MMC (Management Monitored Claims) Public Adjusters',
            description: 'Management Monitored Claims adjusters',
            order: 1,
            workflows: [
              {
                id: 'claim-intake',
                name: 'Claim Intake',
                description: 'Initial claim processing and documentation',
                order: 1,
                items: []
              },
              {
                id: 'damage-assessment',
                name: 'Damage Assessment',
                description: 'Property damage evaluation process',
                order: 2,
                items: []
              }
            ]
          },
          {
            id: 'ctg-adjusters',
            name: 'CTG (Cradle to Grave) Public Adjusters',
            description: 'Cradle to Grave claims management',
            order: 2,
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
            order: 3,
            workflows: [
              {
                id: 'network-coordination',
                name: 'Network Coordination',
                description: 'Coordinate adjuster network activities',
                order: 1,
                items: []
              }
            ]
          }
        ]
      }
    ],
    version: 'v2025-06-14-001',
    lastModified: new Date().toISOString()
  };
};