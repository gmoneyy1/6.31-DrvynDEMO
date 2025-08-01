import { Calendar, BarChart3, Users, User, TrendingUp, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navigationItems = [
  { title: "Dashboard", icon: BarChart3, href: "/" },
  { title: "Calendar", icon: Calendar, href: "/calendar" },
  { title: "Analytics", icon: TrendingUp, href: "/analytics" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

export function AppSidebar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-card border-r border-border flex flex-col z-50">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Drvyn
        </h1>
        <p className="text-sm text-muted-foreground mt-1">AI Productivity</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.title}
              variant="nav"
              className="w-full h-12 text-left"
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </nav>

      {/* Profile section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{user?.username || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-auto p-2 flex items-center space-x-2 hover:bg-accent/50 transition-colors text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}