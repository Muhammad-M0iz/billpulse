import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminFeaturesPage } from "../pages/admin/AdminFeaturesPage";
import { AdminPlansPage } from "../pages/admin/AdminPlansPage";
import { AdminUsagePage } from "../pages/admin/AdminUsagePage";
import { AdminTransactionsPage } from "../pages/admin/AdminTransactionsPage";
import { BuyerDashboard } from "../pages/buyer/BuyerDashboard";
import { BrowsePlansPage } from "../pages/buyer/BrowsePlansPage";
import { MySubscriptionsPage } from "../pages/buyer/MySubscriptionsPage";
import { MyTransactionsPage } from "../pages/buyer/MyTransactionsPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/features"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminFeaturesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/plans"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPlansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usage"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminTransactionsPage />
            </ProtectedRoute>
          }
        />

        {/* Buyer Protected Routes */}
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute requiredRole="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/plans"
          element={<BrowsePlansPage />}
        />
        <Route
          path="/buyer/subscriptions"
          element={
            <ProtectedRoute requiredRole="buyer">
              <MySubscriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/transactions"
          element={
            <ProtectedRoute requiredRole="buyer">
              <MyTransactionsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
