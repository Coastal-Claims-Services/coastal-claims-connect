import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AutomationRule } from '@/types/compliance';
import { Plus, Edit2, Trash2, Zap, Mail, Bell, UserCheck } from 'lucide-react';

interface AutomationRulesProps {
  rules: AutomationRule[];
  onCreateRule: (rule: AutomationRule) => void;
  onUpdateRule: (rule: AutomationRule) => void;
  onDeleteRule: (ruleId: string) => void;
  departments: string[];
}

export const AutomationRules: React.FC<AutomationRulesProps> = ({
  rules,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  departments
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [formData, setFormData] = useState<Partial<AutomationRule>>({
    name: '',
    trigger: {
      event: 'alert_created',
      conditions: {}
    },
    actions: [],
    enabled: true,
    departments: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rule: AutomationRule = {
      id: editingRule?.id || Date.now().toString(),
      ...formData as AutomationRule
    };

    if (editingRule) {
      onUpdateRule(rule);
    } else {
      onCreateRule(rule);
    }

    setShowForm(false);
    setEditingRule(null);
    setFormData({
      name: '',
      trigger: { event: 'alert_created', conditions: {} },
      actions: [],
      enabled: true,
      departments: []
    });
  };

  const startEdit = (rule: AutomationRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setShowForm(true);
  };

  const addAction = () => {
    setFormData({
      ...formData,
      actions: [
        ...(formData.actions || []),
        { type: 'send_email', config: {} }
      ]
    });
  };

  const removeAction = (index: number) => {
    setFormData({
      ...formData,
      actions: formData.actions?.filter((_, i) => i !== index) || []
    });
  };

  const updateAction = (index: number, type: string) => {
    const newActions = [...(formData.actions || [])];
    newActions[index] = { type: type as any, config: {} };
    setFormData({ ...formData, actions: newActions });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'send_email': return <Mail className="w-4 h-4" />;
      case 'create_task': return <Bell className="w-4 h-4" />;
      case 'notify_manager': return <UserCheck className="w-4 h-4" />;
      case 'escalate': return <Zap className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-white">Automation Rules</h3>
          <p className="text-sm text-slate-400">Configure automated responses to compliance events</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {rules.map(rule => (
          <Card key={rule.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-white">{rule.name}</h4>
                    <Badge variant={rule.enabled ? "default" : "outline"}>
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-slate-300 mb-3">
                    <span className="font-medium">Trigger:</span> {rule.trigger.event.replace('_', ' ')}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-slate-400">Actions:</span>
                    {rule.actions.map((action, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {getActionIcon(action.type)}
                        {action.type.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                  
                  {rule.departments.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Departments:</span>
                      {rule.departments.slice(0, 3).map(dept => (
                        <Badge key={dept} variant="secondary" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                      {rule.departments.length > 3 && (
                        <span className="text-xs text-slate-400">+{rule.departments.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(rule)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => onDeleteRule(rule.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {rules.length === 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">No Automation Rules</h4>
              <p className="text-slate-400 mb-4">Create your first automation rule to streamline compliance management</p>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                Create First Rule
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Rule Form */}
      {showForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>{editingRule ? 'Edit' : 'Create'} Automation Rule</CardTitle>
            <CardDescription>Define triggers and actions for automated compliance management</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Notify manager of critical alerts"
                  className="bg-slate-700 border-slate-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Trigger Event</Label>
                <Select 
                  value={formData.trigger?.event} 
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    trigger: { ...formData.trigger!, event: value as any } 
                  })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="alert_created">Alert Created</SelectItem>
                    <SelectItem value="license_expires">License Expires</SelectItem>
                    <SelectItem value="ce_due">CE Credits Due</SelectItem>
                    <SelectItem value="bond_expires">Bond Expires</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Actions</Label>
                  <Button type="button" size="sm" onClick={addAction} variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Action
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.actions?.map((action, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Select 
                        value={action.type} 
                        onValueChange={(value) => updateAction(index, value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="send_email">Send Email</SelectItem>
                          <SelectItem value="create_task">Create Task</SelectItem>
                          <SelectItem value="notify_manager">Notify Manager</SelectItem>
                          <SelectItem value="escalate">Escalate Alert</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => removeAction(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.enabled}
                  onCheckedChange={(enabled) => setFormData({ ...formData, enabled })}
                />
                <Label>Enable this rule</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingRule ? 'Update' : 'Create'} Rule
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};