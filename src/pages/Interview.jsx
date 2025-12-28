import React, { useState, useEffect } from 'react';
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import { Calendar, Clock, Users, Plus, Trash2, ChevronRight, ChevronLeft, Save, Eye, FileText, Code, Brain, Settings } from 'lucide-react';
import { getAuthToken } from '../utils/handleToken';
import { useParams, useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const baseUrl = import.meta.env.VITE_API_URL;
// Form Container Component
const FormContainer = ({ children, isVisible = true }) => (
  <div className={`container mx-auto px-4 py-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
    <div className="max-w-5xl mx-auto">
      {children}
    </div>
  </div>
);

// Message Notification Component
const MessageNotification = ({ message, messageType, onClose }) => {
  if (!message) return null;
  
  const bgColor = messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
                  messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
                  'bg-blue-50 border-blue-200 text-blue-800';
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-2xl border shadow-lg z-50 ${bgColor}`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700 text-xl">
          ×
        </button>
      </div>
    </div>
  );
};

// Interview Setup Page
const InterviewSetup = ({ onNext, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.desc.trim()) newErrors.desc = 'Description is required';
    if (!formData.post.trim()) newErrors.post = 'Position is required';
    if (!formData.submissionDeadline) newErrors.submissionDeadline = 'Submission deadline is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Valid duration is required';
    if (formData.DSA + formData.Dev !== 100) newErrors.allocation = 'DSA and Dev percentages must total 100%';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mr-4">
          <Settings className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-3xl font-semibold text-gray-900">Interview Setup</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Job Description</label>
            <textarea
              value={formData.desc}
              onChange={(e) => handleInputChange('desc', e.target.value)}
              placeholder="Enter detailed job description..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-32 text-gray-900 placeholder-gray-500"
            />
            {errors.desc && <p className="text-red-600 text-sm mt-2 font-medium">{errors.desc}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Position</label>
            <input
              type="text"
              value={formData.post}
              onChange={(e) => handleInputChange('post', e.target.value)}
              placeholder="e.g., Backend Developer"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            {errors.post && <p className="text-red-600 text-sm mt-2 font-medium">{errors.post}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Experience Required (years)</label>
            <input
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
              min="0"
              max="20"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
            {errors.experience && <p className="text-red-600 text-sm mt-2 font-medium">{errors.experience}</p>}
          </div>
        </div>
        
        {/* Timing Information */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Submission Deadline</label>
            <input
              type="datetime-local"
              value={formData.submissionDeadline}
              onChange={(e) => handleInputChange('submissionDeadline', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
            {errors.submissionDeadline && <p className="text-red-600 text-sm mt-2 font-medium">{errors.submissionDeadline}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Interview Start Time</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
            {errors.startTime && <p className="text-red-600 text-sm mt-2 font-medium">{errors.startTime}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Interview End Time</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
            {errors.endTime && <p className="text-red-600 text-sm mt-2 font-medium">{errors.endTime}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
              min="1"
              max="300"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
            {errors.duration && <p className="text-red-600 text-sm mt-2 font-medium">{errors.duration}</p>}
          </div>
        </div>
      </div>
      
      {/* Question Allocation */}
      <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">Question Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">DSA Questions (%)</label>
            <input
              type="number"
              value={formData.DSA}
              onChange={(e) => handleInputChange('DSA', parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-white border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Development Questions (%)</label>
            <input
              type="number"
              value={formData.Dev}
              onChange={(e) => handleInputChange('Dev', parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="w-full px-4 py-3 bg-white border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>
          
          <div className="flex items-center justify-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ask_questions_on_resume}
                onChange={(e) => handleInputChange('ask_questions_on_resume', e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded-lg focus:ring-purple-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Ask questions on resume</span>
            </label>
          </div>
        </div>
        
        {errors.allocation && <p className="text-red-600 text-sm mt-3 font-medium">{errors.allocation}</p>}
        
        <div className="mt-3 text-sm text-gray-600 font-medium">
          Total: {formData.DSA + formData.Dev}% (must equal 100%)
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
        >
          <span>Next: Questions</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Questions Configuration Page
const QuestionsConfig = ({ onNext, onBack, formData, setFormData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('dev');

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', answer: '' }]
    }));
  };

  const handleRemoveQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleAddDSATopic = () => {
    setFormData(prev => ({
      ...prev,
      dsa_topics: [...prev.dsa_topics, { topic: '', difficulty: 'Medium', number_of_questions: 1 }]
    }));
  };

  const handleRemoveDSATopic = (index) => {
    setFormData(prev => ({
      ...prev,
      dsa_topics: prev.dsa_topics.filter((_, i) => i !== index)
    }));
  };

  const handleDSATopicChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      dsa_topics: prev.dsa_topics.map((topic, i) => 
        i === index ? { ...topic, [field]: value } : topic
      )
    }));
  };

const generateQuestionsWithGroq = async () => {
  if (!GROQ_API_KEY) {
    toast.error('Groq API key not configured');
    return;
  }

  setIsGenerating(true);

  try {
    const existingQuestions = formData.questions
      .map((q) => q.question)
      .join('\n');

    const prompt = `Generate 1 new technical interview question for a ${formData.post} position with ${formData.experience} years of experience.

Job description:
${formData.desc}

Do NOT repeat these questions:
${existingQuestions}

Return ONLY a JSON array of objects with "question" and "answer" fields.
No markdown, no explanations.

Example:
[
  {
    "question": "What is the difference between let and var in JavaScript?",
    "answer": "let has block scope while var has function scope."
  }
]`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are a technical interview question generator. Always respond with a valid JSON array only. No markdown or extra text.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err?.error?.message || `Groq API failed (${response.status})`
      );
    }

    const data = await response.json();

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Groq API');
    }

    let cleanedText = data.choices[0].message.content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    const match = cleanedText.match(/\[[\s\S]*\]/);
    if (!match) {
      throw new Error('No valid JSON array found in response');
    }

    cleanedText = match[0];

    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', cleanedText);
      throw new Error('Failed to parse JSON from Groq response');
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions generated');
    }

    const validQuestions = questions.filter(
      (q) =>
        q &&
        typeof q.question === 'string' &&
        typeof q.answer === 'string' &&
        q.question.trim() &&
        q.answer.trim()
    );

    if (!validQuestions.length) {
      throw new Error('Generated questions are invalid');
    }

    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, validQuestions[0]],
    }));

    toast.success('Successfully generated and added 1 question!');
  } catch (error) {
    console.error('Error generating questions:', error);
    toast.error(`Failed to generate questions: ${error.message}`);
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">Questions Configuration</h2>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors flex items-center space-x-2 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8 bg-gray-100 rounded-2xl p-2">
        <button
          onClick={() => setActiveTab('dev')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            activeTab === 'dev' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Code className="w-5 h-5" />
          <span>Development Questions</span>
        </button>
        <button
          onClick={() => setActiveTab('dsa')}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            activeTab === 'dsa' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Brain className="w-5 h-5" />
          <span>DSA Topics</span>
        </button>
      </div>

      {/* Development Questions Tab */}
      {activeTab === 'dev' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Development Questions ({formData.Dev}%)</h3>
            <div className="flex space-x-3">
              <button onClick={generateQuestionsWithGroq}  // Changed from generateQuestionsWithGemini
  disabled={isGenerating}
  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2 shadow-lg"
>
  <Brain className="w-5 h-5" />
  <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
</button>
              <button
                onClick={handleAddQuestion}
                className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors flex items-center space-x-2 font-semibold shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {formData.questions.map((question, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">Question {index + 1}</span>
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className="text-red-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <textarea
                    value={question.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    placeholder="Enter your question..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-20 text-gray-900 placeholder-gray-500"
                  />
                  <textarea
                    value={question.answer}
                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                    placeholder="Enter the expected answer..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-16 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DSA Topics Tab */}
      {activeTab === 'dsa' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">DSA Topics ({formData.DSA}%)</h3>
            <button
              onClick={handleAddDSATopic}
              className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors flex items-center space-x-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Topic</span>
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {formData.dsa_topics.map((topic, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Topic {index + 1}</span>
                  <button
                    onClick={() => handleRemoveDSATopic(index)}
                    className="text-red-500 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                    <input
                      type="text"
                      value={topic.topic}
                      onChange={(e) => handleDSATopicChange(index, 'topic', e.target.value)}
                      placeholder="e.g., Trees, Graphs"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={topic.difficulty}
                      onChange={(e) => handleDSATopicChange(index, 'difficulty', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Questions</label>
                    <input
                      type="number"
                      value={topic.number_of_questions}
                      onChange={(e) => handleDSATopicChange(index, 'number_of_questions', parseInt(e.target.value) || 1)}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={onNext}
          className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
        >
          <span>Next: Review</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Review and Submit Page
const ReviewSubmit = ({ onBack, formData, onSubmit, isLoading, isEditMode })  => {
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
            <Eye className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900">Review & Submit</h2>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors flex items-center space-x-2 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-semibold text-gray-600">Position:</span>
              <p className="text-gray-900 font-medium mt-1">{formData.post}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Experience Required:</span>
              <p className="text-gray-900 font-medium mt-1">{formData.experience} years</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm font-semibold text-gray-600">Description:</span>
              <p className="text-gray-900 font-medium mt-1">{formData.desc}</p>
            </div>
          </div>
        </div>

        {/* Timing Information */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Timing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-semibold text-gray-600">Submission Deadline:</span>
              <p className="text-gray-900 font-medium mt-1">{formatDateTime(formData.submissionDeadline)}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Duration:</span>
              <p className="text-gray-900 font-medium mt-1">{formData.duration} minutes</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Start Time:</span>
              <p className="text-gray-900 font-medium mt-1">{formatDateTime(formData.startTime)}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">End Time:</span>
              <p className="text-gray-900 font-medium mt-1">{formatDateTime(formData.endTime)}</p>
            </div>
          </div>
        </div>

        {/* Question Configuration */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Question Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <span className="text-sm font-semibold text-gray-600">DSA Questions:</span>
              <p className="text-gray-900 font-medium mt-1">{formData.DSA}%</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Development Questions:</span>
              <p className="text-gray-900 font-medium mt-1">{formData.Dev}%</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Resume Questions:</span>
              <p className="text-gray-900 font-medium mt-1">{formData.ask_questions_on_resume ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-semibold text-gray-600">Development Questions:</span>
              <p className="text-gray-900 font-medium mt-1">{formData.questions.length} questions</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">DSA Topics:</span>
              <p className="text-gray-900 font-medium mt-1">{formData.dsa_topics.length} topics</p>
            </div>
          </div>
        </div>

        {/* Development Questions Preview */}
        {formData.questions.length > 0 && (
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Development Questions Preview</h3>
            <div className="max-h-40 overflow-y-auto space-y-3">
              {formData.questions.slice(0, 3).map((question, index) => (
                <div key={index} className="text-sm">
                  <span className="font-semibold text-purple-600">{index + 1}.</span>
                  <span className="text-gray-900 ml-2 font-medium">{question.question}</span>
                </div>
              ))}
              {formData.questions.length > 3 && (
                <div className="text-sm text-gray-600 font-medium">
                  ... and {formData.questions.length - 3} more questions
                </div>
              )}
            </div>
          </div>
        )}

        {/* DSA Topics Preview */}
        {formData.dsa_topics.length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">DSA Topics Preview</h3>
            <div className="max-h-40 overflow-y-auto space-y-3">
              {formData.dsa_topics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900 font-medium">{topic.topic}</span>
                  <div className="flex space-x-6">
                    <span className="text-gray-600 font-medium">Difficulty: {topic.difficulty}</span>
                    <span className="text-gray-600 font-medium">Questions: {topic.number_of_questions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 flex items-center space-x-3 shadow-lg hover:shadow-xl"
        >
          <Save className="w-5 h-5" />
          <span>{isLoading ? (isEditMode ? 'Updating Interview...' : 'Creating Interview...') : (isEditMode ? 'Update Interview' : 'Create Interview')}</span>
        </button>
      </div>
    </div>
  );
};

// Main Interview Creation Component
const InterviewCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    desc: '',
    post: '',
    experience: 0,
    submissionDeadline: '',
    startTime: '',
    endTime: '',
    duration: 60,
    DSA: 60,
    Dev: 40,
    ask_questions_on_resume: true,
    questions: [],
    dsa_topics: []
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      loadInterviewData(id);
    }
  }, [id]);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const loadInterviewData = async (interviewId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${baseUrl}/interview/get-interview/${interviewId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setOriginalData(data);
        
        const formatForInput = (isoString) => {
          return new Date(isoString).toISOString().slice(0, 16);
        };
  
        setFormData({
          desc: data.desc || '',
          post: data.post || '',
          experience: data.experience || 0,
          submissionDeadline: formatForInput(data.submissionDeadline),
          startTime: formatForInput(data.startTime),
          endTime: formatForInput(data.endTime),
          duration: data.duration || 60,
          DSA: data.DSA || 60,
          Dev: data.Dev || 40,
          ask_questions_on_resume: data.ask_questions_on_resume || true,
          questions: data.questions || [],
          dsa_topics: data.dsa_topics || []
        });
      } else {
        showMessage('Failed to load interview data', 'error');
      }
    } catch (error) {
      console.error('Error loading interview:', error);
      showMessage('Error loading interview data', 'error');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
  
    try {
      if (!formData.desc.trim()) {
        showMessage('Description is required', 'error');
        setIsLoading(false);
        return;
      }
  
      if (!formData.post.trim()) {
        showMessage('Position is required', 'error');
        setIsLoading(false);
        return;
      }
  
      const submissionDeadline = new Date(formData.submissionDeadline);
      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);
  
      if (isNaN(submissionDeadline.getTime()) || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        showMessage('Invalid date format', 'error');
        setIsLoading(false);
        return;
      }
  
      if (formData.DSA + formData.Dev !== 100) {
        showMessage('DSA and Dev percentages must total 100%', 'error');
        setIsLoading(false);
        return;
      }
  
      const payload = {
        desc: formData.desc.trim(),
        post: formData.post.trim(),
        experience: parseInt(formData.experience),
        submissionDeadline: submissionDeadline.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: parseInt(formData.duration),
        DSA: parseInt(formData.DSA),
        Dev: parseInt(formData.Dev),
        ask_questions_on_resume: Boolean(formData.ask_questions_on_resume),
        questions: formData.questions.filter(q => q.question.trim() && q.answer.trim()),
        dsa_topics: formData.dsa_topics.filter(topic => topic.topic.trim()),
      };
  
      console.log('Payload being sent:', JSON.stringify(payload, null, 2));
  
      const token = getAuthToken();
      if (!token) {
        showMessage('Authentication token not found. Please login again.', 'error');
        setIsLoading(false);
        return;
      }
  
      const url = isEditMode
        ? `${baseUrl}/interview/edit-interview/${id}/`
        : `${baseUrl}/interview/create-interview/`;
  
      const method = isEditMode ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const successMessage = isEditMode
          ? 'Interview updated successfully!'
          : 'Interview created successfully!';
        showMessage(successMessage, 'success');
  
        setTimeout(() => {
          const queryParams = new URLSearchParams(window.location.search);
          const orgId = queryParams.get('orgId');
  
          if (isEditMode && orgId) {
            navigate(`/org-dashboard/${orgId}`);
          } else {
            setFormData({
              desc: '',
              post: '',
              experience: 0,
              submissionDeadline: '',
              startTime: '',
              endTime: '',
              duration: 60,
              DSA: 60,
              Dev: 40,
              ask_questions_on_resume: true,
              questions: [],
              dsa_topics: [],
            });
            setCurrentStep(1);
          }
        }, 2000);
      } else {
        let errorMessage = isEditMode
          ? 'Failed to update interview'
          : 'Failed to create interview';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMessage = errorData.detail;
        } catch (err) {
          // Ignore JSON parse errors
        }
        showMessage(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error with interview:', error);
      showMessage('Server error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    const prefix = isEditMode ? 'Edit ' : '';
    switch (currentStep) {
      case 1: return `${prefix}Interview Setup`;
      case 2: return `${prefix}Questions Configuration`;
      case 3: return `${prefix}Review & Submit`;
      default: return `${prefix}Interview Creation`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header />
      
      {/* Progress Indicator */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-20 h-1 ml-4 rounded-full transition-all duration-300 ${
                      currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600 font-medium bg-white px-4 py-2 rounded-xl border border-gray-200">
              Step {currentStep} of 3: {getStepTitle()}
            </div>
          </div>
        </div>
      </div>
      
      <FormContainer isVisible={isVisible}>
        {currentStep === 1 && (
          <InterviewSetup
            onNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        
        {currentStep === 2 && (
          <QuestionsConfig
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        
        {currentStep === 3 && (
          <ReviewSubmit
            onBack={handleBack}
            formData={formData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isEditMode={isEditMode}
          />
        )}
      </FormContainer>
      
      <Footer />

      <MessageNotification
        message={message}
        messageType={messageType}
        onClose={clearMessage}
      />
    </div>
  );
};

export default InterviewCreation;