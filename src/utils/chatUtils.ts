
import { UserRole } from '@/types/user';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  aiAssistant?: string;
  status?: 'sending' | 'sent' | 'processing';
}

// Mock user data - in real implementation this would come from the portal login
export const mockUser = {
  name: 'John Smith',
  department: 'CAN program',
  role: 'Public Adjuster',
  accessLevel: 'Senior',
  homeState: 'Florida',
  userType: {
    type: 'developer' as const,
    permissions: {
      manageUsers: false,
      manageAIs: true,
      editAIPrompts: true,
      systemSettings: false
    }
  } as UserRole
};

export const initialMessages: Message[] = [
  {
    id: '1',
    content: `Hello John Smith! I can see from your login that you work in the CAN program as a Public Adjuster. Perfect! I'm Coastal AI - your AI Switchboard Operator.

I'll route your questions to the most appropriate specialist based on your role and access level.

May I first ask: is your question today procedural related or is it about claims specifically, as this will affect the list of AI assistants I can provide for you?`,
    sender: 'ai',
    timestamp: new Date(),
    aiAssistant: 'Coastal AI'
  },
  {
    id: '2',
    content: 'I have a question on how to do a policy review',
    sender: 'user',
    timestamp: new Date(),
    status: 'sent'
  },
  {
    id: '3',
    content: 'Perfect! For a policy review, I\'ll need you to upload the PDF policy document. Please upload the policy PDF below and I\'ll have our Policy Expert AI analyze it for you.',
    sender: 'ai',
    timestamp: new Date(),
    aiAssistant: 'Coastal AI'
  },
  {
    id: '4',
    content: '📎 Policy document uploaded: Policy_Review_Document.pdf',
    sender: 'user',
    timestamp: new Date(),
    status: 'sent'
  },
  {
    id: '5',
    content: `I cannot read your PDF. It's likely an image-based PDF or has copy protection enabled. 

To extract the text, you'll need to convert it to a readable format. Do you know how to convert it, or would you like instructions?`,
    sender: 'ai',
    timestamp: new Date(),
    aiAssistant: 'Coastal AI'
  },
  {
    id: '6',
    content: 'no i do not know how',
    sender: 'user',
    timestamp: new Date(),
    status: 'sent'
  },
  {
    id: '7',
    content: 'I have added the PDF converter training to your Coastal U account. After you watch the video and have converted the PDF, please come back and drop the policy in so I can complete this policy review for you.',
    sender: 'ai',
    timestamp: new Date(),
    aiAssistant: 'Coastal AI'
  },
  {
    id: '8',
    content: '📎 Policy document uploaded: Policy_Review_Document.pdf',
    sender: 'user',
    timestamp: new Date(),
    status: 'sent'
  },
  {
    id: '9',
    content: `Perfect! I've completed your policy review. Based on your role as a ${mockUser.role}, I've generated a comprehensive analysis of the Frank J. Hawkins policy. The report includes all critical details including coverage limits, deductibles, exclusions, and potential gaps that may affect claim handling.

Key highlights from the review:
• Coverage A (Dwelling): $500,900
• Hurricane Deductible: $10,018 (2% of Coverage A)
• Missing matching endorsement and cosmetic coverage
• Ensuing loss language needs clarification for sand-related damage

The complete detailed report is available for download below.`,
    sender: 'ai',
    timestamp: new Date(),
    aiAssistant: 'CCS Policy Pro'
  },
  {
    id: '10',
    content: 'This is only my second claim with coastal please advise on my next steps if you can',
    sender: 'user',
    timestamp: new Date(),
    status: 'sent'
  },
  {
    id: '11',
    content: `John, I've checked the SOP procedures for what to do after completing a Policy Pro review. Here's a bullet point list of your next few steps:

• **Step 1:** Load the Policy Pro review into the Public Adjuster folder files and documents in the CRM

• **Step 2:** Complete the CCS Scope Pro template and load that into the Public Adjuster files in the Docs folder and the company's CRM

• **Step 3:** Click "Action Item Ready for Estimating"

Once the estimate is returned, please come back and let me know, and I will help you with the next few steps.`,
    sender: 'ai',
    timestamp: new Date(),
    aiAssistant: 'Coastal AI'
  },
  {
    id: '12',
    content: 'I\'ve received the estimate back from estimating what are my next steps',
    sender: 'user',
    timestamp: new Date(),
    status: 'sent'
  },
  {
    id: '13',
    content: `Great news John! Glad to hear you received the estimate back. Here are your next few steps according to the SOPs:

**Creating a Claims Demand**

Your next few steps are to create a claims demand. Listed below are the bullet point items you'll need for that:

• **Step 1:** Claims demand will be compiled of but not limited to:
  - The Coastal Claims estimate
  - Photo report
  - Aerial roof measurements (such as Eagle View)
  - A demand letter

• **Step 2:** Add any supporting information that the insured may have provided you (like cost invoices for example)

• **Step 3:** Access demand templates in the company's CRM under "Templates" - you can populate it and save it as draft

• **Step 4:** Load all of these documents into the PA folder subfolder "Demand"

• **Step 5:** Send all these documents to the insurance carrier along with CC: the insured and contractor of record

**Required Peer Review Process:**

If you have any questions about this process, please set a PR with your manager and explain the questions you have.

If you do not have any questions on this process, it is still necessary for you to set a PR with your manager at a minimum of every 15 days with an explanation of claim status.

Note: If the manager feels that the peer review is not necessary, they will note the file, cancel the peer review, and advise on any direction needed.`,
    sender: 'ai',
    timestamp: new Date(),
    aiAssistant: 'Coastal AI'
  }
];

export const validateFile = (file: File): string | null => {
  if (file.type !== 'application/pdf') {
    return 'Please upload a PDF file only.';
  }
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return 'File size must be less than 10MB.';
  }
  return null;
};

export const simulateTrainingAssignment = (courseName: string) => {
  console.log(`Training assigned: ${courseName}`);
  // In real implementation, this would make an API call to assign the course
};

export const downloadPolicyReport = (user: typeof mockUser) => {
  const reportContent = `POLICY REVIEW REPORT
Generated by: Coastal Claims Services Policy Pro™
Generated on: ${new Date().toLocaleDateString()}
Reviewed by: ${user.name} (${user.role})

📘 POLICY BASICS

Named Insured(s): FRANK J HAWKINS
Insured Address: 2917 CAPTIVA WAY, SARASOTA, FL 34231

✅ Mortgage
Name: Not Specified
Loan #: Not Specified
Mailing Address: Not Specified

✅ Insurance Carrier
Carrier: Farmers Casualty Insurance Company
Policy Period: 10/14/2023 to 10/14/2024
Agent (information and address): Not Specified

🏠 PROPERTY DETAILS (UNDERWRITING SNAPSHOT)

County property appraiser search website: https://www.sc-pa.com/
Year Built: 1974
Square Footage: Not Specified
Roof Year: Not Specified
Foundation: Frame Construction
Interior/Exterior: Not Specified

🧾 DEDUCTIBLES SECTION

Type                    Amount
Hurricane              $10,018 (2% of Coverage A)
All Other Perils       $1,000

🛡️ COVERAGE TOTALS SECTION

Coverage    Description                    Limit
A          Dwelling                       $500,900
B          Other Structures               $100,180
C          Personal Property              $375,675
D          Loss of Use (up to 24 mo.)     $264,665
A,B,C,D    Total Combined                 $1,241,420

📄 ENDORSEMENTS

Limited Replacement Plus Incl
Replacement Cost on Contents Incl
13 - Back Up of Sewer, Drain and Sump Pump Coverage: $250 Deductible
15 - Ordinance or Law 50% of Coverage A
25 - Personal Injury Coverage
Forms and Endorsements: 7083-000 (0698), H633F, H768, H698G, H302B, H326, H101, H445FL, H781, H870, H331C, H708C, H603

⚠️ EXCLUSIONS / GAPS / LIMITATIONS

Matching endorsement: No
Cosmetic Endorsement: No
Roof payment schedule: No
Right to repair / Our option: Clarification Needed – language unclear
ACV (actual cash value endorsement): No
Ensuing loss: (storm/wind created an opening)
Language not found regarding "Sand" or associated ensuing loss coverage.

📝 EXAMINATION UNDER OATH (EUO)

Party                    EUO Requirement
Insured                 ✅ Yes
Public Adjuster (PA)    ❌ No

Note: PAs cannot be compelled to EUO, but may be subpoenaed for records or deposition in litigation.

⏳ LEGAL / STATUTORY INFO

Statute of Limitations to File Claim: Not Specified
"Suit Against Us" Clause Language: Not Specified

Appraisal
Appraisal Clause Present? Yes — Language not provided in excerpts, assumed present based on standard Florida HO policies.

🗓️ REVIEW DATA

Generated on: ${new Date().toLocaleDateString()}
Reviewed by: Coastal Claims Services Policy Pro™

---
This report was generated by Coastal AI Policy Expert for ${user.name}
Department: ${user.department}
Role: ${user.role}`;

  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Frank_Hawkins_Policy_Review_Report.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
