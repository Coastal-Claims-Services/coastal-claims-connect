
export interface AssistantSessionMemory {
  sessionId: string;
  userId: string;
  claimId?: string;
  createdAt: Date;
  lastUpdated: Date;
  expiresAt: Date;
  policyReviewSummary?: string;
  scopeNotes?: string;
  estimateDetails?: string;
  aiHistory: {
    assistant: string;
    timestamp: Date;
    context: string;
    handoffType: 'automatic' | 'manual' | 'timeout';
  }[];
}

export interface MemoryScope {
  sessionId: string;
  claimId?: string;
  userId: string;
}
