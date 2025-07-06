import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertConfiguration } from '@/types/compliance';
import { X } from 'lucide-react';

interface AlertConfigFormProps {
  alert?: AlertConfiguration;
  onSave: (alert: AlertConfiguration) => void;
  onCancel: () => void;
  departments: string[];
}

export const AlertConfigForm: React.FC<AlertConfigFormProps> = ({
  alert,
  onSave,
  onCancel,
  departments
}) => {
  const [formData, setFormData] = useState<Partial<AlertConfiguration>>(alert || {
    name: '',
    type: 'license_expiry',
    threshold: 30,
    thresholdUnit: 'days',
    severity: 'medium',
    enabled: true,
    notificationMethods: ['in_app'],
    departments: [],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: alert?.id || Date.now().toString(),
      ...formData
    } as AlertConfiguration);
  };

  const toggleDepartment = (dept: string) => {
    const current = formData.departments || [];
    setFormData({
      ...formData,
      departments: current.includes(dept)
        ? current.filter(d => d !== dept)
        : [...current, dept]
    });
  };

  const toggleNotificationMethod = (method: 'email' | 'in_app' | 'sms') => {
    const current = formData.notificationMethods || [];
    setFormData({
      ...formData,
      notificationMethods: current.includes(method)
        ? current.filter(m => m !== method)
        : [...current, method]
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle>{alert ? 'Edit Alert Configuration' : 'New Alert Configuration'}</CardTitle>
        <CardDescription>Configure when and how compliance alerts are triggered</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Alert Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., License Expiry Warning"
                className="bg-slate-700 border-slate-600"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Alert Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="license_expiry">License Expiry</SelectItem>
                  <SelectItem value="ce_credits">CE Credits Due</SelectItem>
                  <SelectItem value="bond_expiry">Bond Expiry</SelectItem>
                  <SelectItem value="custom">Custom Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Threshold</Label>
              <Input
                type="number"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
                className="bg-slate-700 border-slate-600"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={formData.thresholdUnit} onValueChange={(value) => setFormData({ ...formData, thresholdUnit: value as any })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="credits">Credits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value as any })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description of this alert configuration"
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <Label>Notification Methods</Label>
            <div className="flex gap-4">
              {(['in_app', 'email', 'sms'] as const).map(method => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.notificationMethods?.includes(method)}
                    onChange={() => toggleNotificationMethod(method)}
                    className="rounded"
                  />
                  <span className="capitalize">{method.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Departments</Label>
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <Badge
                  key={dept}
                  variant={formData.departments?.includes(dept) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleDepartment(dept)}
                >
                  {dept}
                  {formData.departments?.includes(dept) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.enabled}
              onCheckedChange={(enabled) => setFormData({ ...formData, enabled })}
            />
            <Label>Enable this alert configuration</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {alert ? 'Update' : 'Create'} Alert
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};