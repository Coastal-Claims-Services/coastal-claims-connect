import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Key, Eye, EyeOff, Settings, Shield, Building2, ArrowLeft, Home, Plus, Edit2, Trash2, ChevronDown, ChevronRight, FolderOpen, Folder, FileText, Clock, Tag, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Rule, RuleScope } from '@/types/rules';
import { selectRules, generateRulePrompt } from '@/utils/ruleSelection';
import { KnowledgeTree as KnowledgeTreeType, TreeNodeExpansion } from '@/types/knowledge';
import { createDefaultKnowledgeTree } from '@/utils/knowledgeSelection';
import { KnowledgeTree } from '@/components/knowledge/KnowledgeTree';

// Department structure type
interface Department {
  id: string;
  name: string;
  subDepartments: string[];
}

// Default department structure
const defaultDepartments: Department[] = [
  {
    id: 'management',
    name: 'Management',
    subDepartments: [
      'Claims Director',
      'HR (Human Resources)',
      'Administrative',
      'Onboarding',
      'Reception',
      'Compliance'
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    subDepartments: [
      'AR (Accounts Receivable)',
      'AP (Accounts Payable)'
    ]
  },
  {
    id: 'claims',
    name: 'Claims',
    subDepartments: [
      'MMC (Management Monitored Claims) Public Adjusters',
      'CTG (Cradle to Grave) Public Adjusters',
      'CAN Network (Coastal Adjuster Network)',
      'TLS (Team Lead Support)',
      'Investigation',
      'Estimating'
    ]
  },
  {
    id: 'commercial-claims',
    name: 'Commercial Claims Department',
    subDepartments: []
  },
  {
    id: 'sales',
    name: 'Sales',
    subDepartments: ['Sales Team']
  },
  {
    id: 'strategic-growth',
    name: 'Strategic Growth & Partnerships',
    subDepartments: ['Cristin\'s Role', 'Carlos\'s Role']
  },
  {
    id: 'it',
    name: 'IT',
    subDepartments: []
  },
  {
    id: 'marketing',
    name: 'Marketing',
    subDepartments: []
  },
  {
    id: 'operations',
    name: 'Operations',
    subDepartments: []
  }
];

const Admin = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departmentRules, setDepartmentRules] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [editingDepartment, setEditingDepartment] = useState<{ type: 'main' | 'sub', departmentId?: string, index?: number, value: string } | null>(null);
  const [newMainDepartment, setNewMainDepartment] = useState('');
  const [newSubDepartments, setNewSubDepartments] = useState<Record<string, string>>({});
  
  // Knowledge Management state
  const [knowledgeTree, setKnowledgeTree] = useState<KnowledgeTreeType>(createDefaultKnowledgeTree());
  const [treeExpansion, setTreeExpansion] = useState<TreeNodeExpansion>({});
  
  // Legacy Smart Rules state (for migration)
  const [rules, setRules] = useState<Rule[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already stored
    const storedApiKey = localStorage.getItem('openai_api_key');
    const storedDepartmentRules = localStorage.getItem('department_rules');
    const storedDepartments = localStorage.getItem('department_structure');
    
    if (storedApiKey) {
      setIsApiKeySet(true);
      setApiKey(storedApiKey);
    }
    
    if (storedDepartmentRules) {
      try {
        setDepartmentRules(JSON.parse(storedDepartmentRules));
      } catch (error) {
        console.error('Failed to parse department rules:', error);
      }
    }

    if (storedDepartments) {
      try {
        setDepartments(JSON.parse(storedDepartments));
      } catch (error) {
        console.error('Failed to parse department structure:', error);
      }
    }

    // Load knowledge tree
    const storedKnowledgeTree = localStorage.getItem('knowledge_tree');
    if (storedKnowledgeTree) {
      try {
        setKnowledgeTree(JSON.parse(storedKnowledgeTree));
      } catch (error) {
        console.error('Failed to parse knowledge tree:', error);
      }
    }
  }, []);

  // Generate available departments list from current structure
  const availableDepartments = departments.flatMap(dept => 
    dept.subDepartments.length > 0 
      ? dept.subDepartments.map(sub => `${dept.name} - ${sub}`)
      : [dept.name]
  );

  const handleSaveApiKey = () => {
    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys must start with 'sk-'",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setIsApiKeySet(true);
    toast({
      title: "API Key Saved",
      description: "OpenAI API key has been stored securely in your browser.",
    });
  };

  const handleSaveDepartmentRules = () => {
    if (!selectedDepartment) {
      toast({
        title: "No Department Selected",
        description: "Please select a department before saving rules.",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('department_rules', JSON.stringify(departmentRules));
    toast({
      title: "Department Rules Saved",
      description: `Rules for ${selectedDepartment} have been updated successfully.`,
    });
  };

  const handleRulesChange = (value: string) => {
    if (!selectedDepartment) return;
    
    setDepartmentRules(prev => ({
      ...prev,
      [selectedDepartment]: value
    }));
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsApiKeySet(false);
    toast({
      title: "API Key Removed",
      description: "OpenAI API key has been removed from storage.",
    });
  };

  // Department management functions
  const saveDepartmentStructure = (newDepartments: Department[]) => {
    setDepartments(newDepartments);
    localStorage.setItem('department_structure', JSON.stringify(newDepartments));
  };

  const toggleDepartmentExpansion = (departmentId: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedDepartments(newExpanded);
  };

  const addMainDepartment = () => {
    if (!newMainDepartment.trim()) return;
    
    const newDept: Department = {
      id: Date.now().toString(),
      name: newMainDepartment.trim(),
      subDepartments: []
    };
    
    saveDepartmentStructure([...departments, newDept]);
    setNewMainDepartment('');
    toast({
      title: "Department Added",
      description: `${newMainDepartment} department has been created.`,
    });
  };

  const addSubDepartment = (departmentId: string) => {
    const subDeptName = newSubDepartments[departmentId];
    if (!subDeptName?.trim()) return;

    const updatedDepartments = departments.map(dept => 
      dept.id === departmentId 
        ? { ...dept, subDepartments: [...dept.subDepartments, subDeptName.trim()] }
        : dept
    );

    saveDepartmentStructure(updatedDepartments);
    setNewSubDepartments(prev => ({ ...prev, [departmentId]: '' }));
    toast({
      title: "Sub-department Added",
      description: `${subDeptName} has been added.`,
    });
  };

  const deleteMainDepartment = (departmentId: string) => {
    if (confirm('Are you sure you want to delete this department and all its sub-departments?')) {
      const updatedDepartments = departments.filter(dept => dept.id !== departmentId);
      saveDepartmentStructure(updatedDepartments);
      toast({
        title: "Department Deleted",
        description: "Department has been removed.",
      });
    }
  };

  const deleteSubDepartment = (departmentId: string, subIndex: number) => {
    if (confirm('Are you sure you want to delete this sub-department?')) {
      const updatedDepartments = departments.map(dept => 
        dept.id === departmentId 
          ? { ...dept, subDepartments: dept.subDepartments.filter((_, index) => index !== subIndex) }
          : dept
      );
      saveDepartmentStructure(updatedDepartments);
      toast({
        title: "Sub-department Deleted",
        description: "Sub-department has been removed.",
      });
    }
  };

  const startEditing = (type: 'main' | 'sub', departmentId: string, index?: number) => {
    const dept = departments.find(d => d.id === departmentId);
    if (!dept) return;
    
    const value = type === 'main' 
      ? dept.name 
      : dept.subDepartments[index!];
    
    setEditingDepartment({ type, departmentId, index, value });
  };

  const saveEdit = () => {
    if (!editingDepartment) return;

    const updatedDepartments = departments.map(dept => {
      if (dept.id === editingDepartment.departmentId) {
        if (editingDepartment.type === 'main') {
          return { ...dept, name: editingDepartment.value };
        } else {
          const newSubDepts = [...dept.subDepartments];
          newSubDepts[editingDepartment.index!] = editingDepartment.value;
          return { ...dept, subDepartments: newSubDepts };
        }
      }
      return dept;
    });

    saveDepartmentStructure(updatedDepartments);
    setEditingDepartment(null);
    toast({
      title: "Updated",
      description: "Department name has been updated.",
    });
  };

  const cancelEdit = () => {
    setEditingDepartment(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Chat
          </Link>
          <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI-Powered Assistant</h1>
          <p className="text-slate-400">Administration Panel</p>
        </div>

        <Tabs defaultValue="api-setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="api-setup" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Setup
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Knowledge Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-setup">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  <CardTitle>{isApiKeySet ? 'API Key Management' : 'Setup Required'}</CardTitle>
                </div>
                <CardDescription>
                  {isApiKeySet 
                    ? 'Your OpenAI API key is configured. You can update or remove it below.'
                    : 'To use the AI assistant, please enter your OpenAI API key. This will be stored securely in your browser.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter your OpenAI API key (sk-...)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-slate-700 border-slate-600 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveApiKey} 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!apiKey}
                  >
                    {isApiKeySet ? 'Update API Key' : 'Save API Key & Continue'}
                  </Button>
                  
                  {isApiKeySet && (
                    <Button 
                      onClick={handleRemoveApiKey} 
                      variant="destructive"
                    >
                      Remove API Key
                    </Button>
                  )}
                </div>

                <p className="text-sm text-slate-400">
                  Need an API key?{' '}
                  <a 
                    href="https://platform.openai.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Get one at OpenAI Platform
                  </a>
                </p>

                {isApiKeySet && (
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-md">
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">API Key Status: Connected</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <KnowledgeTree
              knowledgeTree={knowledgeTree}
              onUpdate={(tree) => {
                setKnowledgeTree(tree);
                localStorage.setItem('knowledge_tree', JSON.stringify(tree));
              }}
              expansion={treeExpansion}
              onExpansionChange={setTreeExpansion}
            />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default Admin;