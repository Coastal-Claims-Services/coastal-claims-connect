import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit2, Trash2, FolderOpen, Folder, FileText, Command, Settings, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { KnowledgeTree as KnowledgeTreeType, Department, SubDepartment, Workflow, KnowledgeItem, TreeNodeExpansion, EditingState, ContentType } from '@/types/knowledge';
import { KnowledgeItemForm } from './KnowledgeItemForm';

interface KnowledgeTreeProps {
  knowledgeTree: KnowledgeTreeType;
  onUpdate: (tree: KnowledgeTreeType) => void;
  expansion: TreeNodeExpansion;
  onExpansionChange: (expansion: TreeNodeExpansion) => void;
}

export const KnowledgeTree: React.FC<KnowledgeTreeProps> = ({
  knowledgeTree,
  onUpdate,
  expansion,
  onExpansionChange
}) => {
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [newItemDialog, setNewItemDialog] = useState<{ 
    workflowId: string; 
    parentPath: string; 
    open: boolean 
  } | null>(null);

  const toggleExpansion = (nodeId: string) => {
    onExpansionChange({
      ...expansion,
      [nodeId]: !expansion[nodeId]
    });
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'rule': return <Settings className="h-3 w-3" />;
      case 'command': return <Command className="h-3 w-3" />;
      case 'smartRule': return <Settings className="h-3 w-3" />;
      case 'sop': return <Book className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getContentTypeBadge = (type: ContentType) => {
    const colors = {
      rule: 'bg-blue-600',
      command: 'bg-green-600', 
      smartRule: 'bg-purple-600',
      sop: 'bg-amber-600'
    };
    return <Badge className={`text-xs ${colors[type]}`}>{type}</Badge>;
  };

  const addDepartment = () => {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: 'New Department',
      description: '',
      order: knowledgeTree.departments.length + 1,
      subDepartments: []
    };
    
    onUpdate({
      ...knowledgeTree,
      departments: [...knowledgeTree.departments, newDept],
      lastModified: new Date().toISOString()
    });
    
    setEditing({ type: 'department', id: newDept.id, isNew: true });
  };

  const addSubDepartment = (departmentId: string) => {
    const newSubDept: SubDepartment = {
      id: `subdept-${Date.now()}`,
      name: 'New Sub-Department',
      description: '',
      order: 1,
      workflows: []
    };

    const updatedTree = {
      ...knowledgeTree,
      departments: knowledgeTree.departments.map(dept =>
        dept.id === departmentId
          ? { ...dept, subDepartments: [...dept.subDepartments, newSubDept] }
          : dept
      ),
      lastModified: new Date().toISOString()
    };

    onUpdate(updatedTree);
    setEditing({ type: 'subDepartment', id: newSubDept.id, parentId: departmentId, isNew: true });
  };

  const addWorkflow = (departmentId: string, subDepartmentId: string) => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      order: 1,
      items: []
    };

    const updatedTree = {
      ...knowledgeTree,
      departments: knowledgeTree.departments.map(dept =>
        dept.id === departmentId
          ? {
              ...dept,
              subDepartments: dept.subDepartments.map(subDept =>
                subDept.id === subDepartmentId
                  ? { ...subDept, workflows: [...subDept.workflows, newWorkflow] }
                  : subDept
              )
            }
          : dept
      ),
      lastModified: new Date().toISOString()
    };

    onUpdate(updatedTree);
    setEditing({ type: 'workflow', id: newWorkflow.id, parentId: subDepartmentId, isNew: true });
  };

  const saveEdit = (newName: string) => {
    if (!editing) return;

    const updatedTree = { ...knowledgeTree };

    if (editing.type === 'department') {
      updatedTree.departments = updatedTree.departments.map(dept =>
        dept.id === editing.id ? { ...dept, name: newName } : dept
      );
    } else if (editing.type === 'subDepartment') {
      updatedTree.departments = updatedTree.departments.map(dept =>
        dept.subDepartments.some(sub => sub.id === editing.id)
          ? {
              ...dept,
              subDepartments: dept.subDepartments.map(sub =>
                sub.id === editing.id ? { ...sub, name: newName } : sub
              )
            }
          : dept
      );
    } else if (editing.type === 'workflow') {
      updatedTree.departments = updatedTree.departments.map(dept => ({
        ...dept,
        subDepartments: dept.subDepartments.map(sub =>
          sub.workflows.some(wf => wf.id === editing.id)
            ? {
                ...sub,
                workflows: sub.workflows.map(wf =>
                  wf.id === editing.id ? { ...wf, name: newName } : wf
                )
              }
            : sub
        )
      }));
    }

    updatedTree.lastModified = new Date().toISOString();
    onUpdate(updatedTree);
    setEditing(null);
  };

  const deleteNode = (type: string, id: string, parentId?: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    const updatedTree = { ...knowledgeTree };

    if (type === 'department') {
      updatedTree.departments = updatedTree.departments.filter(dept => dept.id !== id);
    } else if (type === 'subDepartment') {
      updatedTree.departments = updatedTree.departments.map(dept => ({
        ...dept,
        subDepartments: dept.subDepartments.filter(sub => sub.id !== id)
      }));
    } else if (type === 'workflow') {
      updatedTree.departments = updatedTree.departments.map(dept => ({
        ...dept,
        subDepartments: dept.subDepartments.map(sub => ({
          ...sub,
          workflows: sub.workflows.filter(wf => wf.id !== id)
        }))
      }));
    }

    updatedTree.lastModified = new Date().toISOString();
    onUpdate(updatedTree);
  };

  const addKnowledgeItem = (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    if (!newItemDialog) return;

    const newItem: KnowledgeItem = {
      ...item,
      id: `item-${Date.now()}`,
      version: `v${new Date().toISOString().split('T')[0]}-001`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTree = { ...knowledgeTree };
    
    // Find the workflow and add the item
    for (const dept of updatedTree.departments) {
      for (const subDept of dept.subDepartments) {
        const workflow = subDept.workflows.find(wf => wf.id === newItemDialog.workflowId);
        if (workflow) {
          workflow.items.push(newItem);
          break;
        }
      }
    }

    updatedTree.lastModified = new Date().toISOString();
    onUpdate(updatedTree);
    setNewItemDialog(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Knowledge Management Tree</h3>
          <p className="text-sm text-slate-400">
            Manage rules, commands, smart rules, and SOPs in hierarchical structure
          </p>
        </div>
        <Button onClick={addDepartment} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Tree Structure */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="space-y-2">
          {knowledgeTree.departments.map((dept) => (
            <div key={dept.id} className="space-y-1">
              {/* Department Level */}
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-700/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpansion(dept.id)}
                  className="h-6 w-6 p-0"
                >
                  {expansion[dept.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                
                {expansion[dept.id] ? (
                  <FolderOpen className="h-4 w-4 text-blue-400" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-400" />
                )}

                {editing?.type === 'department' && editing.id === dept.id ? (
                  <Input
                    defaultValue={dept.name}
                    className="h-6 text-sm bg-slate-700 border-slate-600 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit((e.target as HTMLInputElement).value);
                      } else if (e.key === 'Escape') {
                        setEditing(null);
                      }
                    }}
                    onBlur={(e) => saveEdit(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className="text-slate-100 font-medium flex-1">{dept.name}</span>
                )}

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing({ type: 'department', id: dept.id })}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addSubDepartment(dept.id)}
                    className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNode('department', dept.id)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Sub-Departments */}
              {expansion[dept.id] && dept.subDepartments.map((subDept) => (
                <div key={subDept.id} className="ml-6 space-y-1">
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-700/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpansion(subDept.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expansion[subDept.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <FolderOpen className="h-4 w-4 text-purple-400" />

                    {editing?.type === 'subDepartment' && editing.id === subDept.id ? (
                      <Input
                        defaultValue={subDept.name}
                        className="h-6 text-sm bg-slate-700 border-slate-600 flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveEdit((e.target as HTMLInputElement).value);
                          } else if (e.key === 'Escape') {
                            setEditing(null);
                          }
                        }}
                        onBlur={(e) => saveEdit(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="text-slate-200 flex-1">{subDept.name}</span>
                    )}

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing({ type: 'subDepartment', id: subDept.id })}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addWorkflow(dept.id, subDept.id)}
                        className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNode('subDepartment', subDept.id)}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Workflows */}
                  {expansion[subDept.id] && subDept.workflows.map((workflow) => (
                    <div key={workflow.id} className="ml-6 space-y-1">
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-700/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpansion(workflow.id)}
                          className="h-6 w-6 p-0"
                        >
                          {expansion[workflow.id] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <FileText className="h-4 w-4 text-amber-400" />

                        {editing?.type === 'workflow' && editing.id === workflow.id ? (
                          <Input
                            defaultValue={workflow.name}
                            className="h-6 text-sm bg-slate-700 border-slate-600 flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveEdit((e.target as HTMLInputElement).value);
                              } else if (e.key === 'Escape') {
                                setEditing(null);
                              }
                            }}
                            onBlur={(e) => saveEdit(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span className="text-slate-300 flex-1">{workflow.name}</span>
                        )}

                        <Badge variant="outline" className="text-xs">
                          {workflow.items.length} items
                        </Badge>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditing({ type: 'workflow', id: workflow.id })}
                            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Dialog 
                            open={newItemDialog?.workflowId === workflow.id && newItemDialog.open}
                            onOpenChange={(open) => setNewItemDialog(open ? { 
                              workflowId: workflow.id, 
                              parentPath: `${dept.name} > ${subDept.name} > ${workflow.name}`,
                              open 
                            } : null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Add Knowledge Item</DialogTitle>
                              </DialogHeader>
                              <KnowledgeItemForm 
                                onSubmit={addKnowledgeItem}
                                parentPath={`${dept.name} > ${subDept.name} > ${workflow.name}`}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNode('workflow', workflow.id)}
                            className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Knowledge Items */}
                      {expansion[workflow.id] && workflow.items.map((item) => (
                        <div key={item.id} className="ml-6 flex items-center gap-2 p-2 rounded-md hover:bg-slate-700/50">
                          <div className="w-6" /> {/* Spacer for alignment */}
                          {getContentTypeIcon(item.type)}
                          <span className="text-slate-400 text-sm flex-1">{item.title}</span>
                          {getContentTypeBadge(item.type)}
                          <Badge className={`text-xs ${
                            item.priority === 'High' ? 'bg-red-600' : 
                            item.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                          }`}>
                            {item.priority}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-100"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};