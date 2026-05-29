import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import { PublicLayout } from "@/src/layouts/PublicLayout";
import { DashboardLayout } from "@/src/layouts/DashboardLayout";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/src/components/AdminProtectedRoute";
// Lazy Loaded Pages
const HomePage = React.lazy(() => import("@/src/pages/HomePage").then(m => ({ default: m.HomePage })));
const Login = React.lazy(() => import("@/src/pages/Login").then(m => ({ default: m.Login })));
const Register = React.lazy(() => import("@/src/pages/Register").then(m => ({ default: m.Register })));
const Dashboard = React.lazy(() => import("@/src/pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Marketplace = React.lazy(() => import("@/src/pages/Marketplace").then(m => ({ default: m.Marketplace })));
const ItemDetails = React.lazy(() => import("@/src/pages/ItemDetails").then(m => ({ default: m.ItemDetails })));
const Agreements = React.lazy(() => import("@/src/pages/Agreements").then(m => ({ default: m.Agreements })));
const Notifications = React.lazy(() => import("@/src/pages/Notifications").then(m => ({ default: m.Notifications })));
const Verification = React.lazy(() => import("@/src/pages/Verification").then(m => ({ default: m.Verification })));
const PartnerApplication = React.lazy(() => import("@/src/pages/PartnerApplication").then(m => ({ default: m.PartnerApplication })));
const BecomePartner = React.lazy(() => import("@/src/pages/BecomePartner").then(m => ({ default: m.BecomePartner })));

// Public Informational Pages
const Blog = React.lazy(() => import("@/src/pages/public/Blog").then(m => ({ default: m.Blog })));
const FAQPage = React.lazy(() => import("@/src/pages/public/FAQPage").then(m => ({ default: m.FAQPage })));
const AboutUs = React.lazy(() => import("@/src/pages/public/AboutUs").then(m => ({ default: m.AboutUs })));
const LendingGuide = React.lazy(() => import("@/src/pages/public/LendingGuide").then(m => ({ default: m.LendingGuide })));

// Public Community Pages
const CommunityRules = React.lazy(() => import("@/src/pages/public/CommunityRules").then(m => ({ default: m.CommunityRules })));
const TrustAndSafety = React.lazy(() => import("@/src/pages/public/TrustAndSafety").then(m => ({ default: m.TrustAndSafety })));
const Insurance = React.lazy(() => import("@/src/pages/public/Insurance").then(m => ({ default: m.Insurance })));
const VerificationInfo = React.lazy(() => import("@/src/pages/public/VerificationInfo").then(m => ({ default: m.VerificationInfo })));

// Public Legal Pages
const PrivacyPolicy = React.lazy(() => import("@/src/pages/public/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = React.lazy(() => import("@/src/pages/public/TermsOfService").then(m => ({ default: m.TermsOfService })));
const CookiePolicy = React.lazy(() => import("@/src/pages/public/CookiePolicy").then(m => ({ default: m.CookiePolicy })));
const LenderAgreement = React.lazy(() => import("@/src/pages/public/LenderAgreement").then(m => ({ default: m.LenderAgreement })));

const Profile = React.lazy(() => import("@/src/pages/Profile").then(m => ({ default: m.Profile })));
const EditProfile = React.lazy(() => import("@/src/pages/EditProfile").then(m => ({ default: m.EditProfile })));
const UploadItem = React.lazy(() => import("@/src/pages/UploadItem").then(m => ({ default: m.UploadItem })));
const MyItems = React.lazy(() => import("@/src/pages/MyItems").then(m => ({ default: m.MyItems })));
const IncomingRequests = React.lazy(() => import("@/src/pages/IncomingRequests").then(m => ({ default: m.IncomingRequests })));
const MyRequests = React.lazy(() => import("@/src/pages/MyRequests").then(m => ({ default: m.MyRequests })));
const PublicProfile = React.lazy(() => import("@/src/pages/PublicProfile").then(m => ({ default: m.PublicProfile })));
const AppealSuspension = React.lazy(() => import("@/src/pages/AppealSuspension").then(m => ({ default: m.AppealSuspension })));
const Complaints = React.lazy(() => import("@/src/pages/Complaints").then(m => ({ default: m.Complaints })));

// Lazy Loaded Admin imports
const AdminDashboard = React.lazy(() => import("@/src/pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const Verifications = React.lazy(() => import("@/src/pages/admin/Verifications").then(m => ({ default: m.Verifications })));
const Partners = React.lazy(() => import("@/src/pages/admin/Partners").then(m => ({ default: m.Partners })));
const Reports = React.lazy(() => import("@/src/pages/admin/Reports").then(m => ({ default: m.Reports })));
const Users = React.lazy(() => import("@/src/pages/admin/Users").then(m => ({ default: m.Users })));
const Items = React.lazy(() => import("@/src/pages/admin/Items").then(m => ({ default: m.Items })));
const Appeals = React.lazy(() => import("@/src/pages/admin/Appeals").then(m => ({ default: m.Appeals })));
const ActivityFeed = React.lazy(() => import("@/src/pages/admin/ActivityFeed").then(m => ({ default: m.ActivityFeed })));
const AdminComplaints = React.lazy(() => import("@/src/pages/admin/AdminComplaints").then(m => ({ default: m.AdminComplaints })));

const PageLoader = () => (
  <div className="p-8 h-screen w-full flex flex-col gap-6 max-w-7xl mx-auto">
    <div className="h-12 bg-gray-200/50 rounded-2xl w-1/3 animate-pulse"></div>
    <div className="h-[60vh] bg-gray-100/50 rounded-3xl animate-pulse"></div>
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/become-partner" element={<BecomePartner />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ItemDetails />} />
        <Route path="/users/:id" element={<PublicProfile />} />
        <Route path="/suspended" element={<AppealSuspension />} />

        {/* Informational Pages */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/lending-guide" element={<LendingGuide />} />

        {/* Community Pages */}
        <Route path="/community-rules" element={<CommunityRules />} />
        <Route path="/trust-safety" element={<TrustAndSafety />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/verification-info" element={<VerificationInfo />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/lender-agreement" element={<LenderAgreement />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/:id" element={<ItemDetails />} />
          <Route path="upload" element={<UploadItem />} />
          <Route path="my-items" element={<MyItems />} />
          <Route path="incoming-requests" element={<IncomingRequests />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="agreements" element={<Agreements />} />
          <Route path="verification" element={<Verification />} />
          <Route path="partner" element={<PartnerApplication />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="appeal" element={<AppealSuspension />} />
          <Route path="complaints" element={<Complaints />} />
        </Route>
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<DashboardLayout />}>
           <Route index element={<AdminDashboard />} />
           <Route path="verifications" element={<Verifications />} />
           <Route path="partners" element={<Partners />} />
           <Route path="reports" element={<Reports />} />
           <Route path="users" element={<Users />} />
           <Route path="items" element={<Items />} />
           <Route path="appeals" element={<Appeals />} />
           <Route path="activity" element={<ActivityFeed />} />
           <Route path="complaints" element={<AdminComplaints />} />
        </Route>
      </Route>
      </Routes>
    </Suspense>
  );
}
