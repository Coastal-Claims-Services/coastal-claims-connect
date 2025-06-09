
import { AssistantSessionMemory, MemoryScope } from '@/types/memory';

// In-memory store (can be extended to localStorage or backend later)
const memoryStore: Record<string, AssistantSessionMemory> = {};

// 24 hour session expiry
const SESSION_TTL = 24 * 60 * 60 * 1000;

export const MemoryManager = {
  create(scope: MemoryScope, claimId?: string): AssistantSessionMemory {
    const now = new Date();
    const memory: AssistantSessionMemory = {
      sessionId: scope.sessionId,
      userId: scope.userId,
      claimId: claimId,
      createdAt: now,
      lastUpdated: now,
      expiresAt: new Date(now.getTime() + SESSION_TTL),
      aiHistory: []
    };
    
    memoryStore[scope.sessionId] = memory;
    console.log(`Memory created for session: ${scope.sessionId}`);
    return memory;
  },

  get(sessionId: string): AssistantSessionMemory | null {
    const memory = memoryStore[sessionId];
    
    if (!memory) {
      return null;
    }

    // Check if memory has expired
    if (new Date() > memory.expiresAt) {
      console.log(`Memory expired for session: ${sessionId}`);
      delete memoryStore[sessionId];
      return null;
    }

    return memory;
  },

  update(sessionId: string, updates: Partial<AssistantSessionMemory>): AssistantSessionMemory | null {
    const memory = this.get(sessionId);
    if (!memory) {
      console.log(`No memory found for session: ${sessionId}`);
      return null;
    }

    const updatedMemory = {
      ...memory,
      ...updates,
      lastUpdated: new Date(),
      // Extend expiry when memory is actively being used
      expiresAt: new Date(Date.now() + SESSION_TTL)
    };

    memoryStore[sessionId] = updatedMemory;
    console.log(`Memory updated for session: ${sessionId}`);
    return updatedMemory;
  },

  reset(sessionId: string): void {
    delete memoryStore[sessionId];
    console.log(`Memory reset for session: ${sessionId}`);
  },

  addToHistory(sessionId: string, assistant: string, context: string, handoffType: 'automatic' | 'manual' | 'timeout' = 'automatic'): void {
    const memory = this.get(sessionId);
    if (!memory) return;

    memory.aiHistory.push({
      assistant,
      timestamp: new Date(),
      context,
      handoffType
    });

    this.update(sessionId, { aiHistory: memory.aiHistory });
  },

  validateMemory(memory: AssistantSessionMemory): boolean {
    // Check if memory is valid and not too old
    const now = new Date();
    const isExpired = now > memory.expiresAt;
    const historyTooLong = memory.aiHistory.length > 20; // Prevent memory bloat
    
    if (isExpired || historyTooLong) {
      console.log(`Memory validation failed: expired=${isExpired}, historyTooLong=${historyTooLong}`);
      return false;
    }

    return true;
  },

  injectToPrompt(sessionId: string, targetAssistant: string): string {
    const memory = this.get(sessionId);
    if (!memory || !this.validateMemory(memory)) {
      return '';
    }

    let contextPrompt = '';

    // Add relevant context based on target assistant
    if (targetAssistant === 'CCS Policy Pro' && memory.policyReviewSummary) {
      contextPrompt += `Previous Policy Review: ${memory.policyReviewSummary}\n\n`;
    }

    if (targetAssistant === 'CCS Scope Pro' && memory.policyReviewSummary) {
      contextPrompt += `Policy Review Summary: ${memory.policyReviewSummary}\n\n`;
    }

    if (targetAssistant === 'Claims Processor' && (memory.policyReviewSummary || memory.scopeNotes)) {
      if (memory.policyReviewSummary) {
        contextPrompt += `Policy Review: ${memory.policyReviewSummary}\n\n`;
      }
      if (memory.scopeNotes) {
        contextPrompt += `Scope Notes: ${memory.scopeNotes}\n\n`;
      }
    }

    // Add recent AI history for context
    const recentHistory = memory.aiHistory.slice(-3); // Last 3 interactions
    if (recentHistory.length > 0) {
      contextPrompt += 'Recent Assistant Chain: ';
      contextPrompt += recentHistory.map(h => h.assistant).join(' → ');
      contextPrompt += '\n\n';
    }

    return contextPrompt;
  },

  // Generate a unique session ID
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Get all active memories (for debugging)
  getAllActive(): AssistantSessionMemory[] {
    return Object.values(memoryStore).filter(memory => 
      this.validateMemory(memory)
    );
  }
};
