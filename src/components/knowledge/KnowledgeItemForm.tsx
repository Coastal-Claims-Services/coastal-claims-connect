import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { KnowledgeItem, ContentType, KnowledgeScope } from '@/types/knowledge';

interface KnowledgeItemFormProps {
  onSubmit: (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  parentPath: string;
  initialData?: KnowledgeItem;
}

export const KnowledgeItemForm: React.FC<KnowledgeItemFormProps> = ({
  onSubmit,
  parentPath,
  initialData
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'rule' as ContentType,
    content: initialData?.content || '',
    aiInstructions: initialData?.aiInstructions || '',
    commandBody: initialData?.commandBody || '',
    priority: initialData?.priority || 'Medium' as 'High' | 'Medium' | 'Low',
    order: initialData?.order || 1,
    effective: initialData?.effective?.split('T')[0] || new Date().toISOString().split('T')[0],
    sunset: initialData?.sunset?.split('T')[0] || '',
    changeNote: initialData?.changeNote || '',
    isActive: initialData?.isActive ?? true,
    scope: {
      role: initialData?.scope.role || [],
      state: initialData?.scope.state || [],
      severity_max: initialData?.scope.severity_max || undefined,
      department: initialData?.scope.department || []
    },
    tags: initialData?.tags || []
  });

  const [newTag, setNewTag] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newState, setNewState] = useState('');
  const [newDepartment, setNewDepartment] = useState('');

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addRole = () => {
    if (newRole.trim() && !formData.scope.role.includes(newRole.trim())) {
      setFormData(prev => ({
        ...prev,
        scope: {
          ...prev.scope,
          role: [...prev.scope.role, newRole.trim()]
        }
      }));
      setNewRole('');
    }
  };

  const removeRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      scope: {
        ...prev.scope,
        role: prev.scope.role.filter(r => r !== role)
      }
    }));
  };

  const addState = () => {
    if (newState.trim() && !formData.scope.state.includes(newState.trim())) {
      setFormData(prev => ({
        ...prev,
        scope: {
          ...prev.scope,
          state: [...prev.scope.state, newState.trim()]
        }
      }));
      setNewState('');
    }
  };

  const removeState = (state: string) => {
    setFormData(prev => ({
      ...prev,
      scope: {
        ...prev.scope,
        state: prev.scope.state.filter(s => s !== state)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
      title: formData.title,
      type: formData.type,
      scope: formData.scope,
      tags: formData.tags,
      priority: formData.priority,
      order: formData.order,
      effective: formData.effective,
      sunset: formData.sunset || null,
      changeNote: formData.changeNote,
      updatedBy: 'admin', // TODO: Get from user context
      isActive: formData.isActive
    };

    // Add content based on type
    if (formData.type === 'rule') {
      item.aiInstructions = formData.aiInstructions;
    } else if (formData.type === 'command') {
      item.commandBody = formData.commandBody;
    } else if (formData.type === 'smartRule') {
      item.content = formData.content;
      item.aiInstructions = formData.aiInstructions;
    } else if (formData.type === 'sop') {
      item.content = formData.content;
    }

    onSubmit(item);
  };

  const getCharacterCount = (text: string) => text.length;
  const isRuleOverLimit = formData.type === 'rule' && getCharacterCount(formData.aiInstructions) > 160;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-sm">Basic Information</CardTitle>
          <CardDescription>Path: {parentPath}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-600 border-slate-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Content Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: ContentType) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-slate-600 border-slate-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="rule">Rule (≤160 char AI instruction)</SelectItem>
                  <SelectItem value="command">Command (Structured action)</SelectItem>
                  <SelectItem value="smartRule">Smart Rule (Logic + instruction)</SelectItem>
                  <SelectItem value="sop">SOP (Human procedures)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'High' | 'Medium' | 'Low') => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="bg-slate-600 border-slate-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                className="bg-slate-600 border-slate-500"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="effective">Effective Date</Label>
              <Input
                id="effective"
                type="date"
                value={formData.effective}
                onChange={(e) => setFormData(prev => ({ ...prev, effective: e.target.value }))}
                className="bg-slate-600 border-slate-500"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Fields */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-sm">Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.type === 'rule' && (
            <div>
              <Label htmlFor="aiInstructions">
                AI Instructions (≤160 characters)
                <span className={`ml-2 text-xs ${isRuleOverLimit ? 'text-red-400' : 'text-slate-400'}`}>
                  {getCharacterCount(formData.aiInstructions)}/160
                </span>
              </Label>
              <Textarea
                id="aiInstructions"
                value={formData.aiInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, aiInstructions: e.target.value }))}
                className={`bg-slate-600 border-slate-500 ${isRuleOverLimit ? 'border-red-500' : ''}`}
                placeholder="Imperative instruction for AI (e.g., 'Always verify lien documentation before proceeding')"
                rows={3}
                required
              />
              {isRuleOverLimit && (
                <p className="text-red-400 text-xs mt-1">Rules must be 160 characters or less</p>
              )}
            </div>
          )}

          {formData.type === 'command' && (
            <div>
              <Label htmlFor="commandBody">Command Body</Label>
              <Textarea
                id="commandBody"
                value={formData.commandBody}
                onChange={(e) => setFormData(prev => ({ ...prev, commandBody: e.target.value }))}
                className="bg-slate-600 border-slate-500"
                placeholder="JSON structure or API call definition"
                rows={4}
                required
              />
            </div>
          )}

          {(formData.type === 'smartRule' || formData.type === 'sop') && (
            <div>
              <Label htmlFor="content">
                {formData.type === 'smartRule' ? 'Smart Rule Logic' : 'SOP Content'}
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="bg-slate-600 border-slate-500"
                placeholder={
                  formData.type === 'smartRule' 
                    ? 'JSONLogic or YAML logic block...' 
                    : 'Markdown content for human procedures...'
                }
                rows={6}
                required
              />
            </div>
          )}

          {formData.type === 'smartRule' && (
            <div>
              <Label htmlFor="smartRuleInstructions">AI Instructions (from logic evaluation)</Label>
              <Textarea
                id="smartRuleInstructions"
                value={formData.aiInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, aiInstructions: e.target.value }))}
                className="bg-slate-600 border-slate-500"
                placeholder="Resulting instruction when logic evaluates to true"
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scope & Tags */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-sm">Scope & Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Roles */}
          <div>
            <Label>Applicable Roles</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Add role (e.g., PA, Adjuster)"
                className="bg-slate-600 border-slate-500"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
              />
              <Button type="button" onClick={addRole} className="bg-blue-600 hover:bg-blue-700">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.scope.role.map(role => (
                <Badge key={role} variant="outline" className="text-xs">
                  {role}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRole(role)}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* States */}
          <div>
            <Label>Applicable States</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                placeholder="Add state (e.g., FL, GA)"
                className="bg-slate-600 border-slate-500"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addState())}
              />
              <Button type="button" onClick={addState} className="bg-blue-600 hover:bg-blue-700">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.scope.state.map(state => (
                <Badge key={state} variant="outline" className="text-xs">
                  {state}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeState(state)}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Severity Max */}
          <div>
            <Label htmlFor="severityMax">Maximum Claim Severity (optional)</Label>
            <Input
              id="severityMax"
              type="number"
              value={formData.scope.severity_max || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                scope: {
                  ...prev.scope,
                  severity_max: e.target.value ? parseInt(e.target.value) : undefined
                }
              }))}
              className="bg-slate-600 border-slate-500"
              min="1"
              max="10"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag (e.g., onboarding, lien)"
                className="bg-slate-600 border-slate-500"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} className="bg-blue-600 hover:bg-blue-700">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="bg-green-600 hover:bg-green-700"
          disabled={isRuleOverLimit}
        >
          {initialData ? 'Update' : 'Create'} {formData.type}
        </Button>
        <Button type="button" variant="outline" className="border-slate-600">
          Cancel
        </Button>
      </div>
    </form>
  );
};