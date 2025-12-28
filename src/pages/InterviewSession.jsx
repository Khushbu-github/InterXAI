import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthToken, fetchWithToken } from "../utils/handleToken";
import { Loader2, Send, MessageCircle, User, Mic, MicOff, Volume2, VolumeX, Play, Sparkles } from "lucide-react";
import { useSession } from '../utils/SessionContext'; // Add this import

const InterviewSession = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { sessionId, setSessionId } = useSession(); // Add this hook

  const token = getAuthToken();
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [endTime, setEndTime] = useState(null);
  const [interviewActive, setInterviewActive] = useState(false);
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(() => {
    const saved = localStorage.getItem('speechEnabled');
    return saved !== null ? saved !== 'false' : true;
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const hasInitialized = useRef(false);
  const chatEndRef = useRef(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const speechQueueRef = useRef([]);
  const API_URL = import.meta.env.VITE_API_URL;

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(false);
      setSpeechEnabled(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = navigator.language || 'en-US';

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
      stopSpeaking();
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setAnswer(prev => {
        const withoutInterim = prev.replace(/\[.*?\]/g, '');
        return finalTranscript ? withoutInterim + finalTranscript : withoutInterim + `[${interimTranscript}]`;
      });
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      setAnswer(prev => prev.replace(/\[.*?\]/g, ''));
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setAnswer(prev => prev.replace(/\[.*?\]/g, ''));
    };

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Persist speechEnabled
  useEffect(() => {
    localStorage.setItem('speechEnabled', speechEnabled);
  }, [speechEnabled]);

  // Function to stop all speech synthesis
  const stopSpeaking = () => {
    console.log('Stopping speech synthesis');
    window.speechSynthesis.cancel();
    if (currentUtteranceRef.current) {
      currentUtteranceRef.current = null;
    }
    speechQueueRef.current = [];
    setIsSpeaking(false);
  };

  // Enhanced text-to-speech function with better coordination
  const speakText = (text, priority = false) => {
    if (!speechEnabled || !text) return;

    console.log('Speaking text:', text.substring(0, 50) + '...');

    // If user is listening (talking), don't interrupt
    if (isListening && !priority) {
      console.log('User is speaking, queuing speech');
      speechQueueRef.current.push(text);
      return;
    }
    // Stop any current speech
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    currentUtteranceRef.current = utterance;

    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
      currentUtteranceRef.current = null;

      // Process queued speech if any
      if (speechQueueRef.current.length > 0 && !isListening) {
        const nextText = speechQueueRef.current.shift();
        setTimeout(() => speakText(nextText), 500);
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  // Auto-speak new questions with delay to ensure proper coordination
  useEffect(() => {
    if (currentQuestion && !questionLoading && speechEnabled) {
      // Wait a bit to ensure any previous speech has stopped
      setTimeout(() => {
        if (!isListening) { // Only speak if user is not talking
          speakText(currentQuestion);
        } else {
          // Queue the question to be spoken after user stops talking
          speechQueueRef.current.push(currentQuestion);
        }
      }, 800);
    }
  }, [currentQuestion, questionLoading, speechEnabled]);

  // Monitor listening state changes
  useEffect(() => {
    if (isListening) {
      // User started talking, stop AI speech immediately
      console.log('User started listening, stopping speech');
      stopSpeaking();
    } else {
      // User stopped talking, process queued speech
      console.log('User stopped listening, processing queue');
      if (speechQueueRef.current.length > 0 && speechEnabled) {
        const nextText = speechQueueRef.current.shift();
        setTimeout(() => speakText(nextText), 1000);
      }
    }
  }, [isListening, speechEnabled]);

  // Toggle speech recognition with proper coordination
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      console.log('Stopping speech recognition');
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      console.log('Starting speech recognition');
      // Stop any ongoing speech before starting to listen
      stopSpeaking();

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
      }
    }
  };

  // Toggle text-to-speech
  const toggleSpeech = () => {
    const newState = !speechEnabled;
    setSpeechEnabled(newState);

    if (!newState) {
      // If disabling speech, stop current speech and clear queue
      stopSpeaking();
      speechQueueRef.current = [];
    }
  };

  // Replay current question
  const replayQuestion = () => {
    if (currentQuestion) {
      // Stop listening if active before replaying
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }

      // Speak with high priority (interrupts other speech)
      setTimeout(() => speakText(currentQuestion, true), 300);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [chatHistory]);

  // Fetch interview details & initialize (but don't start session yet)
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const initInterviewDetails = async () => {
      try {
        const interviewData = await fetchWithToken(
          `${API_URL}/interview/get-all-interviews/`,
          token
        );
        const currentInterview = interviewData.find(
          (item) => item.id === parseInt(interviewId)
        );
        if (!currentInterview) {
          setError("Interview not found.");
          setLoading(false);
          return;
        }
        const now = new Date();
        const start = new Date(currentInterview.startTime);
        const end = new Date(currentInterview.endTime);
        setEndTime(end);
        if (now < start) {
          setError("Interview has not started yet.");
          setLoading(false);
          return;
        }
        if (now > end) {
          setError("Interview time has ended.");
          setLoading(false);
          return;
        }
        setInterviewActive(true);
        setLoading(false);

      } catch (err) {
        console.error('Error loading interview details:', err);
        setError("Error loading interview details.");
        setLoading(false);
      }
    };
    initInterviewDetails();
  }, [interviewId, token, navigate]);

  // Auto-end interview when endTime reached
  useEffect(() => {
    if (!endTime) return;
    const timer = setInterval(async () => {
      if (new Date() >= endTime) {
        setCompleted(true);
        setCurrentQuestion(null);
        // Stop all voice activities when interview ends
        stopSpeaking();
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
        try {
          if (sessionId) {
            await fetchWithToken(
              `${API_URL}/interview/interview-session/${sessionId}/complete`,
              token,
              null,
              "POST"
            );
          }
        } catch (err) {
          console.error("Error finalizing session:", err);
        }
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, isListening, sessionId, token]);

  // Redirect to DasInterViewPlatform after completion
  useEffect(() => {
    if (completed) {
      setTimeout(() => {
        navigate(sessionId ? `/resume-platform/${sessionId}` : "/");
      }, 2000);
    }
  }, [completed, sessionId, navigate]);

  // Enhanced submit answer with better error handling
  const handleNext = async () => {
    if (!answer.trim()) {
      setError("Please provide an answer before proceeding.");
      return;
    }
    if (answer.length > 5000) {
      setError("Answer is too long. Please keep it under 5000 characters.");
      return;
    }

    // Validation checks
    if (!sessionId) {
      setError("Session not initialized. Please restart the interview.");
      return;
    }

    if (!token) {
      setError("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    console.log('=== SUBMISSION DEBUG ===');
    console.log('Session ID:', sessionId);
    console.log('Answer length:', answer.length);
    console.log('API URL:', `${API_URL}/interview/interview-session/${sessionId}/`);

    // Stop all voice activities when submitting
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();
    speechQueueRef.current = [];

    setChatHistory((prev) => [...prev, { question: currentQuestion, answer }]);
    const currentAnswer = answer;
    setAnswer("");
    setQuestionLoading(true);
    setError(null);

    try {
      const payload = { 
        answer: currentAnswer.trim()
      };

      console.log('Sending payload:', payload);

      const data = await fetchWithToken(
        `${API_URL}/interview/interview-session/${sessionId}/?answer=${currentAnswer.trim()}`,
        token,
        payload,
        "POST"
      );

      console.log('Response received:', data);

      if (!data) {
        throw new Error("No response received from server");
      }

      // Check for errors in response
      if (data.error) {
        throw new Error(data.error);
      }

      // Handle completion
      if (data.completed === true || data.status === 'completed') {
        console.log('Interview completed');
        setCompleted(true);
        return;
      }

      // Handle next question - try different possible field names
      const nextQuestion = data.current_question || data.question || data.next_question;
      
      if (nextQuestion) {
        console.log('Setting next question:', nextQuestion);
        setCurrentQuestion(nextQuestion);
      } else {
        console.warn('No next question found in response:', data);
        // If no question but not completed, this might be an error
        if (!data.completed) {
          throw new Error("No next question received and interview not marked as completed");
        }
      }
      
    } catch (err) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Error:', err);
      
      // Restore answer if submission failed
      setAnswer(currentAnswer);
      
      // Specific error handling
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError("Session expired. Please log in again.");
        navigate("/login");
      } else if (err.message.includes('404')) {
        setError("Interview session not found. Please restart the interview.");
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err.message || "Error submitting answer. Please try again.");
      }
      
      // Remove the failed answer from chat history
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Starting interview session for interview ID:', interviewId);
      
      // Initialize the actual interview session when user clicks start
      const data = await fetchWithToken(
        `${API_URL}/interview/interview-session-initializer/${interviewId}/`,
        token,
        null,
        "POST"
      );

      console.log('Interview initialization response:', data);

      if (!data) {
        throw new Error("No response from server");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.session_id) {
        throw new Error("No session ID received from server");
      }
      console.log('Setting session ID in context:', data.session_id);
      setSessionId(data.session_id);
      
      // Handle initial question - try different field names
      const initialQuestion = data.question || data.current_question || data.first_question;
      if (initialQuestion) {
        setCurrentQuestion(initialQuestion);
      } else {
        throw new Error("No initial question received");
      }

      setShowWelcome(false);

      // Welcome message after session starts
      if (speechEnabled) {
        setTimeout(() => {
          speakText("Welcome to your interview. I'll read each question aloud, and you can respond using your voice or by typing. Let's begin with the first question.", true);
        }, 1500);
      }
    } catch (err) {
      console.error('Error starting interview:', err);
      
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        setError("Unauthorized. Please log in again.");
        navigate("/login");
      } else {
        setError(err.message || "Error starting interview session. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-white to-lavender-50 text-purple-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping"></div>
            <Loader2 className="relative animate-spin w-12 h-12 text-purple-600" />
          </div>
          <p className="text-lg font-medium">Preparing your interview...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-white to-lavender-50 text-purple-900">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-purple-200 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-xl font-semibold text-red-600 mb-4">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => {
                setError(null);
                if (sessionId && currentQuestion) {
                  // If we have an active session, just clear error
                  return;
                } else {
                  // Otherwise go back
                  navigate(-1);
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {sessionId && currentQuestion ? 'Continue' : 'Go Back'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-lavender-50 flex items-center justify-center p-4">
        <div className="bg-white/70 backdrop-blur-xl p-12 rounded-3xl border border-purple-200/50 shadow-2xl max-w-lg w-full text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-lavender-200 to-transparent rounded-full translate-x-12 translate-y-12"></div>

          <div className="relative z-10">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Sparkles size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
              AI Voice Interview
            </h1>
            <p className="text-purple-700 mb-8 text-lg leading-relaxed">
              Experience a natural conversation with our AI interviewer. Questions will be read aloud and you can respond using voice input for a seamless interview experience.
            </p>
            <div className="flex items-center justify-center space-x-6 mb-8 text-sm text-purple-600">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5" />
                <span>Voice Questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5" />
                <span>Voice Answers</span>
              </div>
            </div>
            <button
              onClick={handleStartInterview}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:from-purple-700 hover:to-purple-800"
            >
              Begin Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-lavender-50 flex items-center justify-center p-4">
        <div className="bg-white/70 backdrop-blur-xl p-12 rounded-3xl border border-green-200/50 shadow-2xl max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-purple-50 opacity-50"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Sparkles size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Interview Complete!
            </h1>
            <p className="text-purple-700 text-lg mb-6">
              Thank you for your time. We'll be in touch soon with the results.
            </p>
            <div className="flex items-center justify-center space-x-2 text-purple-600">
              <Loader2 className="animate-spin w-5 h-5" />
              <span>Redirecting to dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Interview UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-lavender-50">
      {/* Modern Header with Voice Controls */}
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-200/50 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  AI Voice Interview
                </h1>
                <div className="flex items-center space-x-4 text-sm mt-1">
                  {sessionId && (
                    <span className="text-purple-600">Session: {sessionId}</span>
                  )}
                  {isSpeaking && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Volume2 size={14} className="animate-pulse" />
                      <span>AI is speaking...</span>
                    </div>
                  )}
                  {isListening && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>Listening...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSpeech}
                className={`p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                  speechEnabled
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                }`}
                title={speechEnabled ? 'Disable voice output' : 'Enable voice output'}
                aria-label={speechEnabled ? 'Disable voice output' : 'Enable voice output'}
              >
                {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>

              {currentQuestion && (
                <button
                  onClick={replayQuestion}
                  disabled={isListening}
                  className={`p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isListening
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                  }`}
                  title="Replay current question"
                  aria-label="Replay current question"
                >
                  <Play size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-120px)]">
        {/* Chat History Sidebar */}
        <div className="w-1/3 bg-white/60 backdrop-blur-md border-r border-purple-200/50 flex flex-col">
          <div className="p-6 border-b border-purple-200/50">
            <h2 className="text-xl font-bold text-purple-800 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <span>Conversation</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatHistory.length === 0 ? (
              <div className="text-center text-purple-400 mt-16">
                <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-purple-300" />
                </div>
                <p className="text-lg font-medium mb-2">No messages yet</p>
                <p className="text-sm">Your conversation will appear here as you progress</p>
              </div>
            ) : (
              chatHistory.map((item, index) => (
                <div key={index} className="space-y-4">
                  {/* Question */}
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-purple-200/50">
                        <p className="text-purple-600 font-semibold text-sm mb-2">
                          Question {index + 1}
                        </p>
                        <p className="text-purple-800 leading-relaxed">{item.question}</p>
                      </div>
                    </div>
                  </div>
                  {/* Answer */}
                  <div className="flex space-x-4 ml-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200/50">
                        <p className="text-blue-600 font-semibold text-sm mb-2">
                          Your Response
                        </p>
                        <p className="text-blue-800 leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8 flex items-start justify-center overflow-y-auto">
            {questionLoading ? (
              <div className="flex flex-col items-center justify-center space-y-6 min-h-[500px]">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                </div>
                <p className="text-xl font-semibold text-purple-700">Analyzing your response...</p>
                <p className="text-purple-500">Please wait while we prepare the next question</p>
              </div>
            ) : currentQuestion && (
              <div className="max-w-4xl w-full">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-purple-200/50 shadow-2xl relative overflow-hidden">
                  {/* Decorative background */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-transparent rounded-full -translate-y-20 translate-x-20"></div>

                  <div className="relative z-10 p-10">
                    {/* Question Header - Fixed Height */}
                    <div className="flex items-center space-x-4 mb-8 h-16">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <MessageCircle size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-purple-800">
                          Question {chatHistory.length + 1}
                        </h3>
                      </div>
                      {(isSpeaking || isListening) && (
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          {isSpeaking && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <Volume2 size={20} className="animate-pulse" />
                              <span className="text-sm font-medium">Speaking...</span>
                            </div>
                          )}
                          {isListening && (
                            <div className="flex items-center space-x-2 text-red-600">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium">Listening...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Question Box - Fixed Height */}
                    <div className="mb-8 h-32">
                      <div className="h-full p-6 bg-gradient-to-r from-purple-50 to-lavender-50 rounded-2xl border border-purple-200/50 overflow-y-auto">
                        <p className="text-xl text-purple-800 leading-relaxed font-medium">
                          {currentQuestion}
                        </p>
                      </div>
                    </div>

                    {/* Answer Section - Fixed Layout */}
                    <div className="space-y-6">
                      <div className="relative">
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          className="w-full h-40 bg-white/90 backdrop-blur-sm text-purple-800 p-6 rounded-2xl border border-purple-200/50 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 resize-none text-lg shadow-sm"
                          placeholder={isSpeaking ? "Please wait, AI is speaking..." : "Share your thoughts here or use the voice input..."}
                          disabled={isSpeaking}
                          aria-label="Answer input"
                        />
                        {answer.length > 0 && (
                          <div className="absolute bottom-2 right-2 text-sm text-purple-500">
                            {answer.length}/5000
                          </div>
                        )}
                      </div>
                      {!speechSupported && (
                        <div className="text-red-600 text-sm mt-2">
                          Voice input is not supported in this browser. Please type your answers.
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2 text-sm text-purple-600">
                          {speechSupported && (
                            <>
                              <Mic size={16} />
                              <span>Click the microphone to use voice input</span>
                            </>
                          )}
                        </div>
                        <div className="flex space-x-4">
                          {speechSupported && (
                            <button
                              onClick={toggleListening}
                              disabled={isSpeaking}
                              className={`p-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                                isListening
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                                  : isSpeaking
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                              }`}
                              title={isListening ? 'Stop listening' : 'Start voice input'}
                              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                            >
                              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                          )}
                          <button
                            onClick={handleNext}
                            disabled={!answer.trim() || questionLoading || isSpeaking}
                            className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 ${
                              !answer.trim() || questionLoading || isSpeaking
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                            }`}
                            aria-label="Submit answer"
                          >
                            {questionLoading ? (
                              <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <span>Next</span>
                                <Send size={20} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;