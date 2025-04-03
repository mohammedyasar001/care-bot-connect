
import { HealthCareProvider } from "@/context/HealthCareContext";
import { HealthCareSidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <HealthCareProvider>
      <div className="flex h-screen bg-healthcare-background overflow-hidden">
        <HealthCareSidebar />
        
        <main className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
          <header className="mb-4">
            <h1 className="text-2xl font-bold text-healthcare-primary">
              HealthCare Bot: Your Virtual Health Assistant
            </h1>
            <p className="text-sm text-gray-500">
              Ask about symptoms, medications, or health advice
            </p>
          </header>
          
          <div className="flex-1 overflow-hidden">
            <ChatInterface />
          </div>
        </main>
      </div>
    </HealthCareProvider>
  );
};

export default Index;
