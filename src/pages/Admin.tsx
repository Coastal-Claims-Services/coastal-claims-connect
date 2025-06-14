import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Key, Eye, EyeOff, Settings, Shield, Building2, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const availableDepartments = [
  // Executive
  'CEO', 'President', 'CFO',
  
  // Management  
  'Claims Director', 'HR (Human Resources)', 'Administrative', 
  'Onboarding', 'Reception', 'Compliance',
  
  // Finance
  'AR (Accounts Receivable)', 'AP (Accounts Payable)',
  
  // Claims
  'MMC (Management Monitored Claims) Public Adjusters',
  'CTG (Cradle to Grave) Public Adjusters', 
  'CAN Network (Coastal Adjuster Network)',
  'TLS (Team Lead Support)', 'Investigation', 'Estimating',
  
  // Commercial Claims
  'Commercial Claims',
  
  // Other Departments
  'Sales Team', 'Strategic Growth & Partnerships', 'IT', 'Marketing', 'Operations'
];

const Admin = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departmentRules, setDepartmentRules] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already stored
    const storedApiKey = localStorage.getItem('openai_api_key');
    const storedDepartmentRules = localStorage.getItem('department_rules');
    
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
  }, []);

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
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Rules & Commands
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

          <TabsContent value="rules">
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <CardTitle>Department Rules</CardTitle>
                  </div>
                  <CardDescription>
                    Configure department-specific rules and behavior for AI assistants. Select a department to manage its rules.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Department</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Choose a department..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {availableDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept} className="text-slate-100">
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDepartment && (
                    <div className="space-y-2">
                      <Label>Rules for {selectedDepartment}</Label>
                      <Textarea
                        placeholder={`Enter specific rules and guidelines for ${selectedDepartment} department...`}
                        value={departmentRules[selectedDepartment] || ''}
                        onChange={(e) => handleRulesChange(e.target.value)}
                        className="bg-slate-700 border-slate-600 min-h-[200px]"
                      />
                      <p className="text-xs text-slate-400">
                        These rules will be applied to AI assistants when responding to users from the {selectedDepartment} department.
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={handleSaveDepartmentRules}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!selectedDepartment}
                  >
                    Save Department Rules
                  </Button>
                </CardContent>
              </Card>

              {Object.keys(departmentRules).length > 0 && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Configured Departments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(departmentRules).map((dept) => (
                        <div key={dept} className="flex items-center justify-between p-2 bg-slate-700 rounded text-sm">
                          <span>{dept}</span>
                          <span className="text-green-400">✓</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;