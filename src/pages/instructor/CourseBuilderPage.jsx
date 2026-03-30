import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/client';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2LessonPrep from './steps/Step2LessonPrep';
import Step3Pricing from './steps/Step3Pricing';
import Step4Review from './steps/Step4Review';

/**
 * Multi-step course builder UI
 * Follows the exact 4-step flow specified in requirements
 */
export const CourseBuilderPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: '',
    description: '',
    category: '',
    duration_weeks: '',
    required_hours_per_week: '',
    subscription_price: '',
    education_level: '',
    target_audience: '',
    objectives: '',
    language: 'English',
    price: 0,
    thumbnail: null,

    // Step 2: Lesson Preparation
    chapters: [],

    // Step 3: Pricing
    coupon_code: '',
    payment_method: 'credit_card',

    // Step 4: Review - will be populated after save
    courseId: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [invoicePreview, setInvoicePreview] = useState(null);

  const handleNext = async () => {
    // Validate current step
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    let success = true;
    if (currentStep === 1) {
      // Save course - Step 1
      success = await saveStep1();
    } else if (currentStep === 2) {
      // Save chapters - Step 2
      success = await saveStep2();
    } else if (currentStep === 3) {
      // Fetch invoice preview - Step 3
      success = await fetchInvoicePreview();
    }

    if (success) {
      setErrors({});
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.title?.trim()) newErrors.title = 'Course title is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.duration_weeks) newErrors.duration_weeks = 'Duration is required';
      if (!formData.subscription_price) newErrors.subscription_price = 'Price is required';
      if (!formData.education_level) newErrors.education_level = 'Education level is required';
      if (!formData.target_audience?.trim()) newErrors.target_audience = 'Target audience is required';
      if (!formData.objectives?.trim()) newErrors.objectives = 'Objectives are required';
    }
    return newErrors;
  };

  const saveStep1 = async () => {
    try {
      setLoading(true);
      
      if (!isAuthenticated || !token) {
        setErrors({ submit: 'You must be logged in to create a course' });
        navigate('/login', { replace: true });
        return false;
      }

      const response = await axiosInstance.post('/api/courses', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        level: formData.education_level,
        duration_weeks: parseInt(formData.duration_weeks) || 0,
        required_hours_per_week: parseInt(formData.required_hours_per_week) || 0,
        subscription_price: parseFloat(formData.subscription_price) || 0,
        education_level: formData.education_level,
        target_audience: formData.target_audience.trim(),
        objectives: formData.objectives.trim(),
        language: formData.language,
        price: parseFloat(formData.subscription_price) || 0,
      });
      
      // Handle response - different API versions may have different structures
      let courseId = null;
      if (response.data?.data?.id) {
        courseId = response.data.data.id;
      } else if (response.data?.id) {
        courseId = response.data.id;
      }
      
      if (!courseId) {
        console.error('API Response:', response.data);
        setErrors({ submit: 'Invalid response from server' });
        return false;
      }
      setFormData(prev => ({ ...prev, courseId }));
      return true;
    } catch (err) {
      console.error('Course creation error:', err);
      const errorMsg = err.message || err.data?.message || 'Failed to save course. Please try again.';
      setErrors({ submit: errorMsg });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const saveStep2 = async () => {
    if (!formData.courseId) {
      setErrors({ submit: 'Course not found. Please save basic info first.' });
      return false;
    }

    if (!formData.chapters || formData.chapters.length === 0) {
      setErrors({ submit: 'Please add at least one chapter' });
      return false;
    }

    try {
      setLoading(true);
      for (const chapter of formData.chapters) {
        if (chapter.isNew || !chapter.id) {
          const formDataChapter = new FormData();
          formDataChapter.append('title', chapter.title);
          formDataChapter.append('subtitle', chapter.subtitle || '');
          formDataChapter.append('description', chapter.description || '');
          formDataChapter.append('intro_message', chapter.intro_message || '');
          formDataChapter.append('week_number', chapter.week_number || 0);
          formDataChapter.append('order_index', chapter.order_index || 0);
          if (chapter.thumbnail instanceof File) {
            formDataChapter.append('thumbnail', chapter.thumbnail);
          }

          try {
            const chapterRes = await axiosInstance.post(
              `/api/courses/${formData.courseId}/chapters`,
              formDataChapter,
              { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            const chapterId = chapterRes.data?.data?.id || chapterRes.data?.id;

            // Save exercises for this chapter
            if (chapter.exercises && chapter.exercises.length > 0) {
              for (const exercise of chapter.exercises) {
                if (exercise.isNew || !exercise.id) {
                  try {
                    await axiosInstance.post(
                      `/api/chapters/${chapterId}/exercises`,
                      {
                        question: exercise.question,
                        type: exercise.type,
                        options: exercise.options || [],
                        correct_answer: exercise.correct_answer,
                        points: exercise.points || 0,
                        order_index: exercise.order_index || 0,
                      }
                    );
                  } catch (exerciseErr) {
                    console.error('Exercise creation error:', exerciseErr);
                    // Continue with other exercises even if one fails
                  }
                }
              }
            }
          } catch (chapterErr) {
            console.error('Chapter creation error:', chapterErr);
            setErrors({ submit: chapterErr.message || 'Failed to save a chapter' });
            return false;
          }
        }
      }
      return true;
    } catch (err) {
      console.error('Step 2 save error:', err);
      setErrors({ submit: err.message || 'Failed to save chapters' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoicePreview = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/invoices/preview', {
        params: {
          course_id: formData.courseId,
          coupon_code: formData.coupon_code || undefined,
        }
      });
      const invoiceData = response.data?.data || response.data;
      setInvoicePreview(invoiceData);
      return true;
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to load invoice' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      // Process payment
      const paymentRes = await axiosInstance.post('/api/payments', {
        course_id: formData.courseId,
        payment_method: formData.payment_method,
        coupon_code: formData.coupon_code || undefined,
      });

      if (paymentRes.data.success) {
        navigate(`/instructor/courses/${formData.courseId}/review`);
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Payment failed' });
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-2">Follow the steps below to create and publish your course</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <StepIndicator number={1} title="Basic Info" active={currentStep === 1} completed={currentStep > 1} />
            <StepIndicator number={2} title="Lessons" active={currentStep === 2} completed={currentStep > 2} />
            <StepIndicator number={3} title="Pricing" active={currentStep === 3} completed={currentStep > 3} />
            <StepIndicator number={4} title="Review" active={currentStep === 4} completed={currentStep > 4} />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold mb-2">Error:</p>
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          {currentStep === 1 && (
            <Step1BasicInfo formData={formData} setFormData={setFormData} errors={errors} />
          )}
          {currentStep === 2 && (
            <Step2LessonPrep formData={formData} setFormData={setFormData} errors={errors} />
          )}
          {currentStep === 3 && (
            <Step3Pricing
              formData={formData}
              setFormData={setFormData}
              invoicePreview={invoicePreview}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <Step4Review formData={formData} invoicePreview={invoicePreview} />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="space-x-4">
              {currentStep < 4 && (
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Next'}
                </button>
              )}
              {currentStep === 4 && (
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Publish Course'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepIndicator = ({ number, title, active, completed }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
        completed
          ? 'bg-green-500 text-white'
          : active
          ? 'bg-blue-600 text-white ring-4 ring-blue-200'
          : 'bg-gray-200 text-gray-600'
      }`}
    >
      {completed ? '✓' : number}
    </div>
    <p className={`text-sm font-medium mt-2 ${active ? 'text-blue-600' : 'text-gray-600'}`}>{title}</p>
  </div>
);
