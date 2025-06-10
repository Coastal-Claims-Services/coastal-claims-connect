import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RegistrationSteps } from '@/components/registration/RegistrationSteps';
import { BasicInfoStep } from '@/components/registration/BasicInfoStep';
import { ServicesStep } from '@/components/registration/ServicesStep';
import { CoverageStep } from '@/components/registration/CoverageStep';
import { ExpertiseStep } from '@/components/registration/ExpertiseStep';
import { CredentialsStep } from '@/components/registration/CredentialsStep';
import { BillingStep } from '@/components/registration/BillingStep';
import { CommunicationStep } from '@/components/registration/CommunicationStep';
import { ReviewStep } from '@/components/registration/ReviewStep';

const steps = [
  { id: 'basic-info', label: 'Basic Info', icon: 'basic-info' },
  { id: 'services', label: 'Services', icon: 'services' },
  { id: 'coverage', label: 'Coverage', icon: 'coverage' },
  { id: 'expertise', label: 'Expertise', icon: 'expertise' },
  { id: 'billing', label: 'Billing', icon: 'billing' },
  { id: 'credentials', label: 'Credentials', icon: 'credentials' },
  { id: 'communication', label: 'Communication', icon: 'communication' },
  { id: 'review', label: 'Review', icon: 'review' }
];

export interface PartnerFormData {
  // Basic Info
  companyName: string;
  contactName: string;
  title: string;
  businessEmail: string;
  directPhone: string;
  companyWebsite: string;
  mainOfficeAddress: string;
  mailingAddress: string;
  
  // Services
  serviceCategories: string[];
  contractorSpecialty?: string;
  
  // Coverage
  licensedStates: string[];
  primaryState: string;
  willingToTravel: 'yes' | 'no' | 'case-by-case';
  
  // Expertise
  fieldOfPractice: string;
  clientTypes: string;
  maxClaimSize: string;
  
  // Credentials
  isLicensed: 'yes' | 'no' | 'pending';
  businessLicenseFile?: File;
  insuranceCertificateFile?: File;
  providesReferences: 'yes' | 'no';
  
  // Billing
  billingDisclosure?: string;
  acknowledgesDisclosure?: boolean;
  billingMethods?: string[];
  hourlyRate?: string;
  contingencyRate?: string;
  minimumFee?: string;
  travelRate?: string;
  paymentSchedule?: string;
  additionalBillingInfo?: string;
  
  // Communication
  preferredContact?: 'email' | 'phone' | 'text' | 'any';
  responseTime?: string;
  urgentAssignments?: 'yes' | 'no' | 'depends';
  additionalNotes?: string;
}

const PartnerRegistration = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PartnerFormData>({
    companyName: '',
    contactName: '',
    title: '',
    businessEmail: '',
    directPhone: '',
    companyWebsite: '',
    mainOfficeAddress: '',
    mailingAddress: '',
    serviceCategories: [],
    licensedStates: [],
    primaryState: '',
    willingToTravel: 'yes',
    fieldOfPractice: '',
    clientTypes: '',
    maxClaimSize: '',
    isLicensed: 'yes',
    providesReferences: 'yes',
    acknowledgesDisclosure: false
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<PartnerFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentStep = () => {
    switch (steps[currentStep].id) {
      case 'basic-info':
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 'services':
        return <ServicesStep formData={formData} updateFormData={updateFormData} />;
      case 'coverage':
        return <CoverageStep formData={formData} updateFormData={updateFormData} />;
      case 'expertise':
        return <ExpertiseStep formData={formData} updateFormData={updateFormData} />;
      case 'credentials':
        return <CredentialsStep formData={formData} updateFormData={updateFormData} />;
      case 'billing':
        return <BillingStep formData={formData} updateFormData={updateFormData} />;
      case 'communication':
        return <CommunicationStep formData={formData} updateFormData={updateFormData} />;
      case 'review':
        return <ReviewStep formData={formData} onEditStep={setCurrentStep} />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">
              {steps[currentStep].label} Step
            </h3>
            <p className="text-slate-400">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-white">Partner Registration</h1>
              <p className="text-slate-400">Coastal Claims Services</p>
            </div>
          </div>
          <div className="text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Steps */}
        <RegistrationSteps 
          steps={steps} 
          currentStep={currentStep} 
          onStepClick={setCurrentStep}
        />

        {/* Form Content */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <div className="p-8">
            {renderCurrentStep()}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegistration;
