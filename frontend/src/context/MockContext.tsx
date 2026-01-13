import React, { createContext, useContext, useState, useEffect } from 'react';

interface MockContextType {
  useMocks: boolean;
  setUseMocks: (value: boolean) => void;
}

const MockContext = createContext<MockContextType | undefined>(undefined);

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [useMocks, setUseMocks] = useState(() => {
    // Check localStorage for user preference
    const stored = localStorage.getItem('useMocks');
    return stored !== null ? JSON.parse(stored) : false; // Default to real API
  });

  useEffect(() => {
    localStorage.setItem('useMocks', JSON.stringify(useMocks));
  }, [useMocks]);

  return (
    <MockContext.Provider value={{ useMocks, setUseMocks }}>
      {children}
    </MockContext.Provider>
  );
}

export function useMockContext() {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error('useMockContext must be used within MockProvider');
  }
  return context;
}
