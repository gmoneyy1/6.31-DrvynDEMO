import { AppSidebar } from "@/components/AppSidebar";
import { CalendarView } from "@/components/CalendarView";

const Calendar = () => {
  return (
    <div className="flex w-full min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 flex-1 overflow-hidden">
        <CalendarView />
      </div>
    </div>
  );
};

export default Calendar;