import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollManager } from "@/components/layout/ScrollManager";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import WhatWeDoMain from "./pages/WhatWeDoMain";
import WhatWeDoForEmployers from "./pages/WhatWeDoForEmployers";
import HowWeDoIt from "./pages/HowWeDoIt";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import Quickstart from "./pages/Quickstart";
import QuickstartChapter from "./pages/QuickstartChapter";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import SuccessStories from "./pages/SuccessStories";
import SuccessStoryDetail from "./pages/SuccessStoryDetail";
import LMS from "./pages/LMS";
import IELTSPrep from "./pages/lms/IELTSPrep";
import CertifiedGlobalNurse from "./pages/lms/CertifiedGlobalNurse";
import NCLEX from "./pages/lms/NCLEX";
import BatchProgram from "./pages/programs/BatchProgram";
import RequirementCriteria from "./pages/programs/RequirementCriteria";
import Webinar from "./pages/programs/Webinar";
import WebinarDetail from "./pages/programs/WebinarDetail";
import Help from "./pages/Help";
import Employer from "./pages/Employer";
import EmployerThanks from "./pages/EmployerThanks";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Portal from "./pages/Portal";
import AccountSettings from "./pages/AccountSettings";
import { PortalProtectedRoute } from "./components/portal/PortalProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCandidates from "./pages/admin/Candidates";
import AdminEmployers from "./pages/admin/Employers";
import AdminContentManager from "./pages/admin/ContentManager";
import AdminChatEscalations from "./pages/admin/ChatEscalations";
import AdminSettings from "./pages/admin/Settings";
import AdminWebinars from "./pages/admin/Webinars";
import WhyChooseUs from "./pages/WhyChooseUs";
import ApiDocs from "./pages/ApiDocs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollManager />
            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/about/vision" element={<Navigate to="/about#vision" replace />} />
              <Route path="/about/mission" element={<Navigate to="/about#mission" replace />} />
              <Route path="/about/values" element={<Navigate to="/about#values" replace />} />
              <Route path="/team" element={<Navigate to="/about#team" replace />} />
              {/* What We Do */}
              <Route path="/what-we-do" element={<WhatWeDoMain />} />
              <Route path="/what-we-do/candidates" element={<Navigate to="/what-we-do#candidates" replace />} />
              <Route path="/what-we-do/employers" element={<WhatWeDoForEmployers />} />
              <Route path="/what-we-do/dont-do" element={<Navigate to="/what-we-do" replace />} />
              {/* How We Do It */}
              <Route path="/how-we-do-it" element={<HowWeDoIt />} />
              <Route path="/how-we-do-it/approach" element={<Navigate to="/how-we-do-it#approach" replace />} />
              <Route path="/how-we-do-it/difference" element={<Navigate to="/how-we-do-it#difference" replace />} />
              <Route path="/how-we-do-it/journey" element={<Navigate to="/how-we-do-it#journey" replace />} />
              <Route path="/why-choose-us" element={<WhyChooseUs />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/success" element={<RegisterSuccess />} />
              <Route path="/quickstart" element={<Quickstart />} />
              <Route path="/quickstart/:slug" element={<QuickstartChapter />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/success-stories/:slug" element={<SuccessStoryDetail />} />
              <Route path="/lms" element={<LMS />} />
              <Route path="/lms/ielts" element={<IELTSPrep />} />
              <Route path="/lms/certified" element={<CertifiedGlobalNurse />} />
              <Route path="/lms/nclex" element={<NCLEX />} />
              <Route path="/programs" element={<BatchProgram />} />
              <Route path="/programs/batch" element={<BatchProgram />} />
              <Route path="/programs/requirements" element={<RequirementCriteria />} />
              <Route path="/programs/webinar" element={<Webinar />} />
              <Route path="/programs/webinar/:slug" element={<WebinarDetail />} />
              <Route path="/help" element={<Help />} />
              <Route path="/employer" element={<Employer />} />
              <Route path="/employer/thanks" element={<EmployerThanks />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* Candidate Portal */}
              <Route path="/portal" element={<PortalProtectedRoute><Portal /></PortalProtectedRoute>} />
              <Route path="/account-settings" element={<PortalProtectedRoute><AccountSettings /></PortalProtectedRoute>} />
              {/* Admin (protected) */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/candidates" element={<ProtectedRoute><AdminCandidates /></ProtectedRoute>} />
              <Route path="/admin/employers" element={<ProtectedRoute><AdminEmployers /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute><AdminContentManager /></ProtectedRoute>} />
              <Route path="/admin/webinars" element={<ProtectedRoute><AdminWebinars /></ProtectedRoute>} />
              <Route path="/admin/chat-escalations" element={<ProtectedRoute><AdminChatEscalations /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              <Route path="/docs" element={<ApiDocs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
