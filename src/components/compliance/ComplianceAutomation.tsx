import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertConfigForm } from './AlertConfigForm';
import { AlertDashboard } from './AlertDashboard';
import { AutomationRules } from './AutomationRules';
import { AlertConfiguration, SystemAlert, AutomationRule, ComplianceStats } from '@/types/compliance';
import { useToast } from '@/hooks/use-toast';
import { Settings, BarChart3, Zap, Plus } from 'lucide-react';

interface ComplianceAutomationProps {
  departments: string[];
}

export const ComplianceAutomation: React.FC<ComplianceAutomationProps> = ({ departments }) => {
  const [alertConfigs, setAlertConfigs] = useState<AlertConfiguration[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AlertConfiguration | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved configurations
    const savedConfigs = localStorage.getItem('alert_configurations');
    const savedRules = localStorage.getItem('automation_rules');
    const savedAlerts = localStorage.getItem('system_alerts');

    if (savedConfigs) {
      try {
        setAlertConfigs(JSON.parse(savedConfigs));
      } catch (error) {
        console.error('Failed to parse alert configurations:', error);
      }
    } else {
      // Initialize with default configurations
      const defaultConfigs: AlertConfiguration[] = [
        {
          id: 'license-expiry-30',
          name: 'License Expiry Warning (30 days)',
          type: 'license_expiry',
          threshold: 30,
          thresholdUnit: 'days',
          severity: 'medium',
          enabled: true,
          notificationMethods: ['in_app', 'email'],
          departments: [],
          description: 'Alert when licenses expire within 30 days'
        },
        {
          id: 'ce-credits-90',
          name: 'CE Credits Due (90 days)',
          type: 'ce_credits',
          threshold: 90,
          thresholdUnit: 'days',
          severity: 'low',
          enabled: true,
          notificationMethods: ['in_app'],
          departments: [],
          description: 'Alert when CE credits are due within 90 days'
        }
      ];
      setAlertConfigs(defaultConfigs);
      localStorage.setItem('alert_configurations', JSON.stringify(defaultConfigs));
    }

    if (savedRules) {
      try {
        setAutomationRules(JSON.parse(savedRules));
      } catch (error) {
        console.error('Failed to parse automation rules:', error);
      }
    }

    if (savedAlerts) {
      try {
        setSystemAlerts(JSON.parse(savedAlerts));
      } catch (error) {
        console.error('Failed to parse system alerts:', error);
      }
    } else {
      // TODO: Fetch real alerts from compliance monitoring system
      // For now, start with empty alerts until real data source is connected
      setSystemAlerts([]);
    }
  }, []);

  const handleSaveAlertConfig = (config: AlertConfiguration) => {
    const updatedConfigs = editingConfig
      ? alertConfigs.map(c => c.id === config.id ? config : c)
      : [...alertConfigs, config];
    
    setAlertConfigs(updatedConfigs);
    localStorage.setItem('alert_configurations', JSON.stringify(updatedConfigs));
    
    setShowConfigForm(false);
    setEditingConfig(null);
    
    toast({
      title: "Alert Configuration Saved",
      description: `${config.name} has been ${editingConfig ? 'updated' : 'created'} successfully.`,
    });
  };

  const handleDeleteAlertConfig = (configId: string) => {
    if (confirm('Are you sure you want to delete this alert configuration?')) {
      const updatedConfigs = alertConfigs.filter(c => c.id !== configId);
      setAlertConfigs(updatedConfigs);
      localStorage.setItem('alert_configurations', JSON.stringify(updatedConfigs));
      
      toast({
        title: "Configuration Deleted",
        description: "Alert configuration has been removed.",
      });
    }
  };

  const handleDismissAlert = (alertId: string) => {
    const updatedAlerts = systemAlerts.map(alert =>
      alert.id === alertId
        ? { ...alert, dismissed: true, dismissedAt: new Date().toISOString() }
        : alert
    );
    setSystemAlerts(updatedAlerts);
    localStorage.setItem('system_alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: "Alert Dismissed",
      description: "Alert has been marked as resolved.",
    });
  };

  const handleSnoozeAlert = (alertId: string, hours: number) => {
    const snoozeUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    const updatedAlerts = systemAlerts.map(alert =>
      alert.id === alertId ? { ...alert, snoozeUntil } : alert
    );
    setSystemAlerts(updatedAlerts);
    localStorage.setItem('system_alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: "Alert Snoozed",
      description: `Alert will reappear in ${hours} hours.`,
    });
  };

  const handleCreateAutomationRule = (rule: AutomationRule) => {
    const updatedRules = [...automationRules, rule];
    setAutomationRules(updatedRules);
    localStorage.setItem('automation_rules', JSON.stringify(updatedRules));
    
    toast({
      title: "Automation Rule Created",
      description: `${rule.name} has been created successfully.`,
    });
  };

  const handleUpdateAutomationRule = (rule: AutomationRule) => {
    const updatedRules = automationRules.map(r => r.id === rule.id ? rule : r);
    setAutomationRules(updatedRules);
    localStorage.setItem('automation_rules', JSON.stringify(updatedRules));
    
    toast({
      title: "Automation Rule Updated",
      description: `${rule.name} has been updated successfully.`,
    });
  };

  const handleDeleteAutomationRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this automation rule?')) {
      const updatedRules = automationRules.filter(r => r.id !== ruleId);
      setAutomationRules(updatedRules);
      localStorage.setItem('automation_rules', JSON.stringify(updatedRules));
      
      toast({
        title: "Automation Rule Deleted",
        description: "Rule has been removed.",
      });
    }
  };

  const startEditConfig = (config: AlertConfiguration) => {
    setEditingConfig(config);
    setShowConfigForm(true);
  };

  // Calculate stats
  const stats: ComplianceStats = {
    totalAlerts: systemAlerts.length,
    criticalAlerts: systemAlerts.filter(a => a.severity === 'critical' && !a.dismissed).length,
    dismissedAlerts: systemAlerts.filter(a => a.dismissed).length,
    alertsByType: systemAlerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    alertsBySeverity: systemAlerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Compliance Automation</h2>
        <p className="text-slate-400">Configure alerts, view system status, and manage automation rules</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Alert Configuration
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AlertDashboard
            alerts={systemAlerts}
            stats={stats}
            onDismissAlert={handleDismissAlert}
            onSnoozeAlert={handleSnoozeAlert}
          />
        </TabsContent>

        <TabsContent value="alerts">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-white">Alert Configurations</h3>
                <p className="text-sm text-slate-400">Configure when and how compliance alerts are triggered</p>
              </div>
              <Button onClick={() => setShowConfigForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Alert Configuration
              </Button>
            </div>

            {showConfigForm && (
              <AlertConfigForm
                alert={editingConfig || undefined}
                onSave={handleSaveAlertConfig}
                onCancel={() => {
                  setShowConfigForm(false);
                  setEditingConfig(null);
                }}
                departments={departments}
              />
            )}

            <div className="grid gap-4">
              {alertConfigs.map(config => (
                <Card key={config.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-white">{config.name}</h4>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              config.severity === 'critical' ? 'bg-red-600' :
                              config.severity === 'high' ? 'bg-orange-600' :
                              config.severity === 'medium' ? 'bg-yellow-600' :
                              'bg-blue-600'
                            }`}>
                              {config.severity}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              config.enabled ? 'bg-green-600' : 'bg-gray-600'
                            }`}>
                              {config.enabled ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-2">
                          {config.description || `${config.type.replace('_', ' ')} alert with ${config.threshold} ${config.thresholdUnit} threshold`}
                        </p>
                        
                        <div className="text-xs text-slate-400">
                          Notifications: {config.notificationMethods.join(', ')}
                          {config.departments.length > 0 && (
                            <span> • Departments: {config.departments.slice(0, 2).join(', ')}{config.departments.length > 2 ? ` +${config.departments.length - 2} more` : ''}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEditConfig(config)}>
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteAlertConfig(config.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {alertConfigs.length === 0 && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-8 text-center">
                    <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white mb-2">No Alert Configurations</h4>
                    <p className="text-slate-400 mb-4">Create your first alert configuration to start monitoring compliance</p>
                    <Button onClick={() => setShowConfigForm(true)} className="bg-blue-600 hover:bg-blue-700">
                      Create First Alert
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <AutomationRules
            rules={automationRules}
            onCreateRule={handleCreateAutomationRule}
            onUpdateRule={handleUpdateAutomationRule}
            onDeleteRule={handleDeleteAutomationRule}
            departments={departments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};