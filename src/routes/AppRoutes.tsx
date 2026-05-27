import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import { PublicLayout } from "@/src/layouts/PublicLayout";
import { DashboardLayout } from "@/src/layouts/DashboardLayout";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/src/components/AdminProtectedRoute";
import { HomePage } from "@/src/pages/HomePage";
import { Login } from "@/src/pages/Login";
import { Register } from "@/src/pages/Register";
import { Dashboard } from "@/src/pages/Dashboard";
import { Marketplace } from "@/src/pages/Marketplace";
import { ItemDetails } from "@/src/pages/ItemDetails";
import { Agreements } from "@/src/pages/Agreements";
import { Notifications } from "@/src/pages/Notifications";
import { Verification } from "@/src/pages/Verification";
import { PartnerApplication } from "@/src/pages/PartnerApplication";
import { BecomePartner } from "@/src/pages/BecomePartner";
import { Profile } from "@/src/pages/Profile";
import { EditProfile } from "@/src/pages/EditProfile";
import { EmptyState } from "@/src/components/EmptyState";
import { LoadingSkeleton } from "@/src/components/LoadingSkeleton";

import { UploadItem } from "@/src/pages/UploadItem";
import { MyItems } from "@/src/pages/MyItems";
import { IncomingRequests } from "@/src/pages/IncomingRequests";
import { MyRequests } from "@/src/pages/MyRequests";
import { PublicProfile } from "@/src/pages/PublicProfile";
import { AppealSuspension } from "@/src/pages/AppealSuspension";

// Lazy Loaded Admin imports
const AdminDashboard = React.lazy(() => import("@/src/pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const Verifications = React.lazy(() => import("@/src/pages/admin/Verifications").then(m => ({ default: m.Verifications })));
const Partners = React.lazy(() => import("@/src/pages/admin/Partners").then(m => ({ default: m.Partners })));
const Reports = React.lazy(() => import("@/src/pages/admin/Reports").then(m => ({ default: m.Reports })));
const Users = React.lazy(() => import("@/src/pages/admin/Users").then(m => ({ default: m.Users })));
const Items = React.lazy(() => import("@/src/pages/admin/Items").then(m => ({ default: m.Items })));
const Appeals = React.lazy(() => import("@/src/pages/admin/Appeals").then(m => ({ default: m.Appeals })));
const ActivityFeed = React.lazy(() => import("@/src/pages/admin/ActivityFeed").then(m => ({ default: m.ActivityFeed })));

const AdminLoader = () => (
  <div className="p-8 h-full flex flex-col gap-6">
    <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
    <div className="h-[400px] bg-gray-100 rounded-3xl animate-pulse"></div>
  </div>
);

export function AppRoutes() {
  return (
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
        </Route>
      </Route>
    </Routes>
  );
}
