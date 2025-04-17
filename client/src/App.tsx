import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import PropertyDetail from "@/pages/property-detail";
import PostListing from "@/pages/post-listing";
import Properties from "@/pages/properties";
import Profile from "@/pages/profile";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/properties" component={Properties} />
          <Route path="/property/:id" component={PropertyDetail} />
          <ProtectedRoute path="/post-listing" component={PostListing} />
          <ProtectedRoute path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
