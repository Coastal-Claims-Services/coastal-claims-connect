import { Rule, RuleSelectionContext, RuleSelectionResult, RuleConflict } from '@/types/rules';

/**
 * Deterministic rule selection algorithm
 * Walks tree from root → leaf, filters by scope, sorts by priority
 */
export const selectRules = (
  allRules: Rule[],
  context: RuleSelectionContext
): RuleSelectionResult => {
  const now = new Date().toISOString();
  
  // Step 1: Collect candidate rules from department path
  const departmentCandidates = allRules.filter(rule => 
    rule.departmentPath.some(path => 
      path.toLowerCase().includes(context.userDepartment.toLowerCase())
    )
  );

  // Step 2: Add rules matching tags/intent (if provided)
  const tagCandidates = context.intent ? 
    allRules.filter(rule => 
      rule.tags.some(tag => tag.toLowerCase().includes(context.intent!.toLowerCase()))
    ) : [];

  const candidateRules = [...new Set([...departmentCandidates, ...tagCandidates])];
  
  // Step 3: Filter by scope
  const scopeFilteredRules = candidateRules.filter(rule => {
    // Role filter
    if (rule.scope.role.length > 0 && !rule.scope.role.includes(context.userRole)) {
      return false;
    }
    
    // State filter
    if (context.userState && rule.scope.state.length > 0 && 
        !rule.scope.state.includes(context.userState)) {
      return false;
    }
    
    // Severity filter
    if (context.claimSeverity && rule.scope.severity_max && 
        context.claimSeverity > rule.scope.severity_max) {
      return false;
    }
    
    return true;
  });

  // Step 4: Filter by active status and date range
  const activeRules = scopeFilteredRules.filter(rule => {
    if (!rule.isActive) return false;
    
    const effectiveDate = new Date(rule.effective);
    const currentDate = new Date(now);
    
    if (effectiveDate > currentDate) return false;
    
    if (rule.sunset) {
      const sunsetDate = new Date(rule.sunset);
      if (sunsetDate <= currentDate) return false;
    }
    
    return true;
  });

  // Step 5: Sort by priority then order
  const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
  const sortedRules = activeRules.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.order - b.order;
  });

  // Step 6: Detect conflicts
  const conflicts = detectConflicts(sortedRules);

  return {
    selectedRules: sortedRules,
    conflicts,
    auditLog: {
      selectionCriteria: context,
      candidateRules: candidateRules.map(r => r.id),
      filteredRules: sortedRules.map(r => r.id),
      timestamp: now
    }
  };
};

/**
 * Detect rule conflicts for admin review
 */
const detectConflicts = (rules: Rule[]): RuleConflict[] => {
  const conflicts: RuleConflict[] = [];
  
  // Group by priority
  const highPriorityRules = rules.filter(r => r.priority === 'High');
  
  // Check for conflicting high-priority rules with similar instructions
  for (let i = 0; i < highPriorityRules.length; i++) {
    for (let j = i + 1; j < highPriorityRules.length; j++) {
      const rule1 = highPriorityRules[i];
      const rule2 = highPriorityRules[j];
      
      // Simple conflict detection based on overlapping keywords
      const keywords1 = rule1.aiInstructions.toLowerCase().split(' ');
      const keywords2 = rule2.aiInstructions.toLowerCase().split(' ');
      const overlap = keywords1.filter(word => keywords2.includes(word));
      
      if (overlap.length > 2) { // Threshold for potential conflict
        conflicts.push({
          rules: [rule1, rule2],
          conflictType: 'instruction',
          severity: 'warning'
        });
      }
    }
  }
  
  return conflicts;
};

/**
 * Generate AI prompt from selected rules
 */
export const generateRulePrompt = (rules: Rule[]): string => {
  if (rules.length === 0) return '';
  
  const ruleInstructions = rules
    .map((rule, index) => `${index + 1}. ${rule.aiInstructions}`)
    .join('\n');
    
  return `You must follow these department-specific rules in order of priority:\n\n${ruleInstructions}`;
};