import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/user';

interface UserContextType {
  user: User;
  updateHomeState: (homeState: string) => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: 'john-smith',
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
    }
  });

  const updateHomeState = (homeState: string) => {
    setUser(prev => ({ ...prev, homeState }));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateHomeState, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};