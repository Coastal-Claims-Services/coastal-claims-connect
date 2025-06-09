
import React, { useState } from 'react';
import { Search, Filter, Clock, Award, BookOpen, Play, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/Sidebar';

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  progress?: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'required';
  certificate?: boolean;
  assignedBy?: string;
  assignedDate?: Date;
  priority?: 'low' | 'medium' | 'high' | 'required';
  description: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'PDF Converter Training',
    category: 'Technology',
    duration: '15 min',
    status: 'required',
    certificate: false,
    assignedBy: 'Coastal AI',
    assignedDate: new Date(),
    priority: 'required',
    description: 'Learn how to convert image-based PDFs to readable text format for policy analysis.'
  },
  {
    id: '2',
    title: 'Policy Analysis Fundamentals',
    category: 'Claims',
    duration: '45 min',
    progress: 100,
    status: 'completed',
    certificate: true,
    description: 'Complete guide to analyzing insurance policies for coverage and exclusions.'
  },
  {
    id: '3',
    title: 'Hurricane Claims Processing',
    category: 'Claims',
    duration: '30 min',
    progress: 60,
    status: 'in-progress',
    certificate: false,
    description: 'Specialized training for handling hurricane-related insurance claims.'
  },
  {
    id: '4',
    title: 'CCS Scope Pro Advanced',
    category: 'Technology',
    duration: '25 min',
    status: 'not-started',
    certificate: false,
    description: 'Advanced features and techniques for using CCS Scope Pro effectively.'
  },
  {
    id: '5',
    title: 'Customer Communication Best Practices',
    category: 'Professional Development',
    duration: '20 min',
    progress: 100,
    status: 'completed',
    certificate: true,
    description: 'Professional communication strategies for client interactions.'
  }
];

const CoastalU = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const completedCourses = mockCourses.filter(course => course.status === 'completed').length;
  const totalHours = mockCourses.reduce((acc, course) => {
    if (course.status === 'completed') {
      return acc + parseInt(course.duration);
    }
    return acc;
  }, 0);

  const certificates = mockCourses.filter(course => course.certificate && course.status === 'completed').length;

  const getStatusBadge = (course: Course) => {
    switch (course.status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case 'required':
        return <Badge className="bg-red-500 text-white">Required</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getPriorityIcon = (priority?: string) => {
    if (priority === 'required') {
      return <Star className="h-4 w-4 text-red-500 fill-red-500" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      <Sidebar />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Coastal U Learning Center</h1>
            <p className="text-slate-300">Continue your professional development journey</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Courses Completed</p>
                  <p className="text-2xl font-bold text-slate-100">{completedCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Hours Completed</p>
                  <p className="text-2xl font-bold text-slate-100">{Math.floor(totalHours / 60)}h {totalHours % 60}m</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Certificates Earned</p>
                  <p className="text-2xl font-bold text-slate-100">{certificates}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['All', 'Claims', 'Technology', 'Professional Development'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-blue-600 text-white" : "border-slate-600 text-slate-300"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* AI Assignments Alert */}
          {mockCourses.some(course => course.assignedBy === 'Coastal AI') && (
            <Card className="bg-blue-900/30 border-blue-700 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-blue-100">New AI-Assigned Training</h3>
              </div>
              <p className="text-blue-200 text-sm">
                Coastal AI has identified training opportunities based on your recent conversations. Complete these to improve your workflow.
              </p>
            </Card>
          )}

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="bg-slate-800 border-slate-700 p-6 hover:bg-slate-750 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(course.priority)}
                    <h3 className="font-semibold text-slate-100">{course.title}</h3>
                  </div>
                  {getStatusBadge(course)}
                </div>

                <p className="text-slate-400 text-sm mb-4">{course.description}</p>

                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <span>{course.category}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {course.assignedBy && (
                  <div className="bg-slate-700 rounded p-2 mb-4">
                    <p className="text-xs text-slate-300">
                      Assigned by <span className="font-medium text-blue-400">{course.assignedBy}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {course.assignedDate?.toLocaleDateString()}
                    </p>
                  </div>
                )}

                {course.progress !== undefined && course.status === 'in-progress' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button 
                    size="sm" 
                    className={
                      course.status === 'completed' 
                        ? "bg-green-600 hover:bg-green-700" 
                        : course.status === 'required'
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  >
                    {course.status === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {course.status === 'in-progress' ? 'Continue' : 'Start'}
                      </>
                    )}
                  </Button>
                  
                  {course.certificate && course.status === 'completed' && (
                    <Badge className="bg-yellow-600 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoastalU;
