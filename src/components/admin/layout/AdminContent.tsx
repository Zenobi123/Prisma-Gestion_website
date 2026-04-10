
import { memo } from 'react';
import DashboardPanel from '../DashboardPanel';
import MessagesPanel from '../MessagesPanel';
import BlogPanel from '../BlogPanel';
import ServicesPanel from '../ServicesPanel';
import HomePanel from '../HomePanel';
import UsersPanel from '../UsersPanel';
import AnalyticsPanel from '../analytics/AnalyticsPanel';
import MediaPanel from '../MediaPanel';
import SEOPanel from '../SEOPanel';
import SecurityPanel from '../SecurityPanel';
import BackupPanel from '../BackupPanel';

interface AdminContentProps {
  activeTab: string;
  activeMessageTab: string;
  setActiveMessageTab: (tab: string) => void;
}

const AdminContentComponent = ({ 
  activeTab, 
  activeMessageTab, 
  setActiveMessageTab 
}: AdminContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPanel />;
      case "messages":
        return <MessagesPanel />;
      case "blog":
        return <BlogPanel />;
      case "services":
        return <ServicesPanel />;
      case "home":
        return <HomePanel />;
      case "users":
        return <UsersPanel />;
      case "analytics":
        return <AnalyticsPanel />;
      case "media":
        return <MediaPanel />;
      case "seo":
        return <SEOPanel />;
      case "security":
        return <SecurityPanel />;
      case "backup":
        return <BackupPanel />;
      default:
        return <DashboardPanel />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-4">
        {renderContent()}
      </div>
    </div>
  );
};

export const AdminContent = memo(AdminContentComponent);
