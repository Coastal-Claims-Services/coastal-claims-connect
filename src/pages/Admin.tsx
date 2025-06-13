import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Key, Eye, EyeOff, Settings, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [systemRules, setSystemRules] = useState('');
  const [routingRules, setRoutingRules] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already stored
    const storedApiKey = localStorage.getItem('openai_api_key');
    const storedSystemRules = localStorage.getItem('system_rules');
    const storedRoutingRules = localStorage.getItem('routing_rules');
    
    if (storedApiKey) {
      setIsApiKeySet(true);
      setApiKey(storedApiKey);
    }
    
    if (storedSystemRules) {
      setSystemRules(storedSystemRules);
    }
    
    if (storedRoutingRules) {
      setRoutingRules(storedRoutingRules);
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

  const handleSaveRules = () => {
    localStorage.setItem('system_rules', systemRules);
    localStorage.setItem('routing_rules', routingRules);
    toast({
      title: "Rules Saved",
      description: "System and routing rules have been updated successfully.",
    });
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
                  <CardTitle>System Rules</CardTitle>
                  <CardDescription>
                    Define how the AI assistants should behave and respond to users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter system-wide rules and guidelines for AI behavior..."
                    value={systemRules}
                    onChange={(e) => setSystemRules(e.target.value)}
                    className="bg-slate-700 border-slate-600 min-h-[120px]"
                  />
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Routing Rules</CardTitle>
                  <CardDescription>
                    Configure how user queries are routed to specific AI assistants based on role and context.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Define routing logic, conditions, and assistant assignment rules..."
                    value={routingRules}
                    onChange={(e) => setRoutingRules(e.target.value)}
                    className="bg-slate-700 border-slate-600 min-h-[120px]"
                  />
                </CardContent>
              </Card>

              <Button 
                onClick={handleSaveRules}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Rules Configuration
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;