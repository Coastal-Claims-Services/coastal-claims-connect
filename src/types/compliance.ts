export interface AlertConfiguration {
  id: string;
  name: string;
  type: 'license_expiry' | 'ce_credits' | 'bond_expiry' | 'custom';
  threshold: number;
  thresholdUnit: 'days' | 'hours' | 'credits';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notificationMethods: ('email' | 'in_app' | 'sms')[];
  departments: string[];
  description?: string;
}

export interface SystemAlert {
  id: string;
  adjusterId: string;
  adjusterName: string;
  type: AlertConfiguration['type'];
  severity: AlertConfiguration['severity'];
  title: string;
  message: string;
  createdAt: string;
  dueDate?: string;
  dismissed: boolean;
  dismissedAt?: string;
  dismissedBy?: string;
  snoozeUntil?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    event: 'alert_created' | 'license_expires' | 'ce_due' | 'bond_expires';
    conditions: Record<string, any>;
  };
  actions: {
    type: 'send_email' | 'create_task' | 'notify_manager' | 'escalate';
    config: Record<string, any>;
  }[];
  enabled: boolean;
  departments: string[];
}

export interface ComplianceStats {
  totalAlerts: number;
  criticalAlerts: number;
  dismissedAlerts: number;
  alertsByType: Record<string, number>;
  alertsBySeverity: Record<string, number>;
}