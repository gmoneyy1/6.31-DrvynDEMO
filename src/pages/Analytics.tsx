import { AppSidebar } from "@/components/AppSidebar";
import { AnalyticsView } from "@/components/AnalyticsView";

const Analytics = () => {
  return (
    <div className="flex w-full min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 flex-1">
        <AnalyticsView />
      </div>
    </div>
  );
};

export default Analytics;