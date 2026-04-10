
import { useState, useCallback } from 'react';

interface UseAdminTabsReturn {
  activeTab: string;
  activeMessageTab: string;
  isLoading: boolean;
  setActiveTab: (tab: string) => void;
  setActiveMessageTab: (tab: string) => void;
}

export const useAdminTabs = (): UseAdminTabsReturn => {
  const [activeTab, setActiveTabState] = useState("dashboard");
  const [activeMessageTab, setActiveMessageTab] = useState("contacts");
  const [isLoading, setIsLoading] = useState(false);

  const setActiveTab = useCallback((newTab: string) => {
    if (newTab === activeTab) return;
    
    console.log('Setting active tab:', newTab);
    setActiveTabState(newTab);
  }, [activeTab]);

  return {
    activeTab,
    activeMessageTab,
    isLoading,
    setActiveTab,
    setActiveMessageTab
  };
};
