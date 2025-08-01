import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="flex w-full min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 flex-1">
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
