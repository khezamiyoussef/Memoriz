import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import LanguageSelect from "./pages/LanguageSelect";
import { LanguageProvider } from "./i18n/LanguageContext";
import PublicSite from "./pages/PublicSite";
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

// Supabase may send email-link results to the site root as #access_token=... or #error=...; keep them
function RootRedirect() {
  const { hash } = useLocation();
  return <Navigate to={{ pathname: "/login", hash }} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL || (import.meta.env.PROD ? "/maryem-birthday-site/" : "/")}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/language" element={<RequireAuth><LanguageSelect /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          {/* Published sites; app routes above must be listed in public.is_reserved_slug() */}
          <Route path="/:slug" element={<PublicSite />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
