import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// You might need to create or update these actions
import { saveApplicationData, submitApplication } from '../../Services/ApplicationService';

const ApplicationFormController = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { applicationData, currentStep } = useSelector((state) => state.application);

  const steps = [
    { path: '/application/personal', label: 'Personal Information' },
    { path: '/application/address', label: 'Address' },
    { path: '/application/documents', label: 'Document Upload' },
    { path: '/application/document-preview', label: 'Document Preview' },
    { path: '/application/biometrics', label: 'Biometrics' },
    { path: '/application/review', label: 'Review' },
    { path: '/application/payment', label: 'Payment' }
  ];

  // Get current step index based on URL
  const getCurrentStepIndex = () => {
    const currentPath = location.pathname;
    return steps.findIndex(step => step.path === currentPath);
  };

  // Handle next step navigation
  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      navigate(steps[currentIndex + 1].path);
    }
  };

  // Handle previous step navigation
  const goToPrevStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      navigate(steps[currentIndex - 1].path);
    }
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    // Save current step data
    await dispatch(saveApplicationData(data));
    goToNextStep();
  };

  // Handle payment completion
  const handlePaymentComplete = async (paymentDetails) => {
    try {
      // Submit the complete application with payment details
      await dispatch(submitApplication({
        ...applicationData,
        payment: paymentDetails
      }));

      // Navigate to dashboard with success message
      navigate('/dashboard', {
        state: {
          success: true,
          message: 'Your passport application has been submitted and payment received.'
        }
      });
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  return (
    <div className="application-container max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${getCurrentStepIndex() >= index ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                {index + 1}
              </div>
              <span className="text-xs mt-1 text-center">{step.label}</span>
            </div>
          ))}
        </div>
        <div className="relative h-1 bg-gray-200">
          <div
            className="absolute h-1 bg