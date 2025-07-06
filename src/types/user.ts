
export interface UserRole {
  type: 'user' | 'admin' | 'developer';
  permissions: {
    manageUsers?: boolean;
    manageAIs: boolean;
    editAIPrompts?: boolean;
    systemSettings?: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  department: string;
  role: string;
  homeState: string;
  accessLevel: string;
  userType: UserRole;
}
