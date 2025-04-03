
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useHealthCare } from "@/context/HealthCareContext";
import { cn } from "@/lib/utils";
import { ProfileMenu } from "./Profile";
import { AppointmentDialog } from "./Appointment";
import { emergencyContacts, getRandomHealthTip } from "@/utils/healthData";
import { Calendar, AlertTriangle, Globe, Lightbulb, Clock, XCircle, User } from "lucide-react";

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

// Change the SidebarButton to not be used with asChild from Radix UI
const SidebarButton = React.forwardRef<HTMLButtonElement, SidebarButtonProps>(
  ({ icon, label, onClick, className }, ref) => {
    return (
      <Button 
        ref={ref}
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 text-healthcare-sidebar-foreground hover:bg-healthcare-primary hover:text-white",
          className
        )}
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </Button>
    );
  }
);
SidebarButton.displayName = "SidebarButton";

export function HealthCareSidebar() {
  const { 
    profileMenuOpen, 
    toggleProfileMenu, 
    addMessage, 
    clearChat,
    appointments
  } = useHealthCare();
  
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const showEmergencyContacts = () => {
    const contactList = Object.entries(emergencyContacts)
      .map(([service, number]) => `${service}: ${number}`)
      .join("\n");
    addMessage(`Emergency contacts:\n${contactList}`, "HealthCare Bot");
  };

  const showHealthTip = () => {
    const tip = getRandomHealthTip();
    addMessage(tip, "HealthCare Bot");
  };

  const showReminders = () => {
    if (appointments.length === 0) {
      addMessage("You have no reminders set.", "HealthCare Bot");
      return;
    }
    
    let message = "Here are your reminders:\n";
    appointments.forEach((app, index) => {
      message += `${index + 1}. ${app.date} at ${app.time}: ${app.reason}\n`;
    });
    
    addMessage(message, "HealthCare Bot");
  };

  const switchLanguage = () => {
    addMessage("Language switching feature is not implemented in this demo version.", "HealthCare Bot");
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-healthcare-primary text-white rounded-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>
      
      <div className={cn(
        "bg-healthcare-sidebar text-white h-screen flex flex-col transition-all duration-300 shadow-lg overflow-y-auto",
        sidebarOpen ? "w-64" : "w-0 lg:w-16",
        "fixed lg:relative z-40"
      )}>
        <div className="p-4 flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="mb-8 mt-4 text-center">
            <h2 className={cn(
              "font-bold text-xl mb-1 transition-opacity",
              !sidebarOpen && "lg:opacity-0"
            )}>
              Healthcare Bot
            </h2>
            <p className={cn(
              "text-xs text-gray-300 transition-opacity",
              !sidebarOpen && "lg:opacity-0"
            )}>
              Your virtual health assistant
            </p>
          </div>
          
          {/* Profile Section */}
          <div className="relative mb-4">
            <SidebarButton 
              icon={<User size={18} />} 
              label="Profile" 
              onClick={toggleProfileMenu} 
            />
            
            {profileMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-50">
                <ProfileMenu />
              </div>
            )}
          </div>
          
          {/* Sidebar Buttons */}
          <div className="space-y-1 flex-1">
            <SidebarButton 
              icon={<Clock size={18} />} 
              label="Reminders" 
              onClick={showReminders} 
            />
            
            <SidebarButton 
              icon={<Globe size={18} />} 
              label="Language" 
              onClick={switchLanguage} 
            />
            
            <SidebarButton 
              icon={<AlertTriangle size={18} />} 
              label="Emergency" 
              onClick={showEmergencyContacts} 
            />
            
            <SidebarButton 
              icon={<Lightbulb size={18} />} 
              label="Health Tips" 
              onClick={showHealthTip} 
            />
            
            <AppointmentDialog>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-healthcare-sidebar-foreground hover:bg-healthcare-primary hover:text-white"
              >
                <Calendar size={18} />
                <span>Schedule</span>
              </Button>
            </AppointmentDialog>
            
            <SidebarButton 
              icon={<XCircle size={18} />} 
              label="Clear Chat" 
              onClick={clearChat} 
            />
          </div>
          
          {/* Footer */}
          <div className={cn(
            "mt-4 text-xs text-gray-300 text-center transition-opacity",
            !sidebarOpen && "lg:opacity-0"
          )}>
            © 2025 HealthCare Bot
          </div>
        </div>
      </div>
    </>
  );
}
