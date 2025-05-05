import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Dashboard from "@/pages/Dashboard";
import Schedule from "@/pages/Schedule";
import Reminders from "@/pages/Reminders";
import Guests from "@/pages/Guests";
// Profile page removed per user request

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/guests" component={Guests} />
      {/* Profile page route removed per user request */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex min-h-screen">
          {/* Main content with padding for the side navbar */}
          <div className="flex flex-col flex-grow pr-20"> {/* Added right padding for the navbar */}
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
          {/* Side navbar */}
          <Navbar />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
