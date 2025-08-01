import { AppSidebar } from "@/components/AppSidebar";
import { SettingsView } from "@/components/SettingsView";

const Settings = () => {
  return (
    <div className="flex w-full min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 flex-1">
        <SettingsView />
      </div>
    </div>
  );
};

export default Settings;