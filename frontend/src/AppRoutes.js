import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import main pages
import Dashboard from './Pages/Dashboard.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import NotFound from './Pages/NotFound.jsx';
import Profile from './Pages/Profile.jsx';
import SupportTicket from './Pages/SupportTicket.jsx';
import FAQ from './Pages/FAQ.jsx';
import Helpcenter from './Pages/Helpcenter.jsx';

// Import ApplicationSteps pages
import ApplicationFormController from './Pages/ApplicationSteps/ApplicationFormController.jsx';
import PersonalInfo from './Pages/ApplicationSteps/PersonalInfo.jsx';
import AddressInfo from './Pages/ApplicationSteps/AddressInfo.jsx';
import DocumentUpload from './Pages/ApplicationSteps/DocumentUpload.jsx';
import DocumentPreview from './Pages/ApplicationSteps/DocumentPreview.jsx';
import BiometricStep from './Pages/ApplicationSteps/BiometricStep.jsx';
import ApplicationReview from './Pages/ApplicationSteps/ApplicationReview.jsx';
import ReviewStep from './Pages/ApplicationSteps/ReviewStep.jsx';

// Import Admin pages
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';
import DocumentVerification from './Pages/Admin/DocumentVerification.jsx';
import SystemSettings from './Pages/Admin/SystemSettings.jsx';
import UserManagement from './Pages/Admin/UserManagement.jsx';

// Import Payment component
import PaymentForm from './Components/Payments/PaymentForm.jsx';

// Import Biometric components if needed as standalone pages
import BiometricCapture from './Components/Biometrics/BiometricCapture.jsx';
import BiometricVerification from './Components/Biometrics/BiometricVerification.jsx';
import FacialRecognition from './Components/Biometrics/FacialRecognition.jsx';
import FingerprintCapture from './Components/Biometrics/FingerprintCapture.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/help" element={<Helpcenter />} />
      <Route path="/faq" element={<FAQ />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><SupportTicket /></ProtectedRoute>} />

      {/* Standalone biometric routes if needed */}
      <Route path="/biometrics/capture" element={<ProtectedRoute><BiometricCapture /></ProtectedRoute>} />
      <Route path="/biometrics/verify" element={<ProtectedRoute><BiometricVerification /></ProtectedRoute>} />
      <Route path="/biometrics/facial" element={<ProtectedRoute><FacialRecognition /></ProtectedRoute>} />
      <Route path="/biometrics/fingerprint" element={<ProtectedRoute><FingerprintCapture /></ProtectedRoute>} />

      {/* ApplicationSteps flow */}
      <Route path="/application" element={<ProtectedRoute><ApplicationFormController /></ProtectedRoute>}>
        <Route index element={<Navigate to="/application/personal" replace />} />
        <Route path="personal" element={<PersonalInfo />} />
        <Route path="address" element={<AddressInfo />} />
        <Route path="documents" element={<DocumentUpload />} />
        <Route path="document-preview" element={<DocumentPreview />} />
        <Route path="biometrics" element={<BiometricStep />} />
        <Route path="review" element={<ApplicationReview />} />
        <Route path="payment" element={<PaymentForm />} />
      </Route>

      {/* Review step (if used as a standalone page) */}
      <Route path="/review/:applicationId" element={<ProtectedRoute><ReviewStep /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/verification" element={<AdminRoute><DocumentVerification /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />

      {/* Settings route (if needed) */}
      <Route path="/settings" element={<ProtectedRoute><SystemSettings /></ProtectedRoute>} />

      {/* Notification list (if implemented) */}
      <Route path="/notifications" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;