
import React from 'react';
import { Calculator, User, MapPin, CheckCircle, DollarSign, FileText, MessageSquare, Eye } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: string;
}

interface RegistrationStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

const iconMap = {
  'basic-info': Calculator,
  'services': User,
  'coverage': MapPin,
  'expertise': CheckCircle,
  'billing': DollarSign,
  'credentials': FileText,
  'communication': MessageSquare,
  'review': Eye
};

export const RegistrationSteps: React.FC<RegistrationStepsProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  return (
    <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg p-4">
      {steps.map((step, index) => {
        const Icon = iconMap[step.icon as keyof typeof iconMap] || Calculator;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div
            key={step.id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onStepClick(index)}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : isCompleted
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-600 text-slate-400'
              }`}
            >
              <Icon size={20} />
            </div>
            <span
              className={`text-sm font-medium ${
                isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
