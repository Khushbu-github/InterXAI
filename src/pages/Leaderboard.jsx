import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Trophy, Medal, Award, User, Calendar, Clock, TrendingUp, Eye, FileText, Download, ArrowLeft,
  Star, BookOpen, Briefcase, GraduationCap, Code, Award as AwardIcon, Target, CheckCircle,
  XCircle, AlertCircle, LayoutDashboard, MessageSquare, FileCode, BarChart2, Info,
<<<<<<< HEAD
  Users, Activity, Filter, Search, ChevronDown, ChevronUp,
  ImageIcon
=======
  Users, Activity, Filter, Search, ChevronDown, ChevronUp, Bot, Send, X
>>>>>>> 2b5e3b265c318f58e12239e186669d703cbb6abd
} from "lucide-react";
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import Header from "../components/ui/header";
import Footer from "../components/ui/footer";
import { getAuthToken } from "../utils/handleToken";
import ImageModal from "../../src/pages/ImageModal"
import Appp from "../../src/pages/ImageModal"
ChartJS.register(...registerables);

const Leaderboard = () => {
  const { id: interviewId } = useParams();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [resumeView, setResumeView] = useState('extracted');
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChart, setSelectedChart] = useState(null);
  const [showChartsSection, setShowChartsSection] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchLeaderboardData();
    setTimeout(() => setVisible(true), 100);
  }, [interviewId]);

  const fetchLeaderboardData = async () => {
    try {
      const token = getAuthToken();
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API_URL}/interview/leaderboard/${interviewId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }

      const data = await response.json();
      console.log("Leaderboard Data:", data[0].images);
      setLeaderboardData(Array.isArray(data) ? data : data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getEffectiveScore = (candidate) => {
    let sum = 0;
    let count = 0;
    if (typeof candidate.Devscore === 'number') { sum += candidate.Devscore; count++; }
    if (typeof candidate.Resumescore === 'number') { sum += candidate.Resumescore; count++; }
    if (typeof candidate.DsaScore === 'number') { sum += candidate.DsaScore; count++; }
    return count > 0 ? sum / count : 0;
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-500" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">
            {rank}
          </span>
        );
    }
  };

  const getScoreColor = (score) => {
    if (typeof score !== 'number') return "text-gray-600 bg-gray-100 border-gray-200";
    if (score >= 8.0) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 6.0) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    if (score >= 4.0) return "text-orange-600 bg-orange-100 border-orange-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      completed: "bg-green-100 text-green-700 border-green-200",
      ongoing: "bg-blue-100 text-blue-700 border-blue-200",
      scheduled: "bg-gray-100 text-gray-700 border-gray-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      cheated: "bg-red-100 text-red-700 border-red-200",
    };
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A"}
      </span>
    );
  };

  const getDecisionBadge = (decision) => {
    if (decision === true) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Approved
        </span>
      );
    } else if (decision === false) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Pending
        </span>
      );
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setActiveTab('overview');
    setShowHistory(true);
    setChatMessages([]);
    setShowChatbot(false);
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowApplication(true);
    setResumeView('extracted');
  };

  const parseExtractedResume = (resumeText) => {
    if (!resumeText) return null;
    const sections = {
      personalDetails: [],
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      projects: [],
      achievements: [],
    };
    const lines = resumeText.split('\n');
    let currentSection = '';
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('### Personal Details')) {
        currentSection = 'personalDetails';
      } else if (trimmedLine.startsWith('### Skills')) {
        currentSection = 'skills';
      } else if (trimmedLine.startsWith('### Experience')) {
        currentSection = 'experience';
      } else if (trimmedLine.startsWith('### Education')) {
        currentSection = 'education';
      } else if (trimmedLine.startsWith('### Certifications')) {
        currentSection = 'certifications';
      } else if (trimmedLine.startsWith('### Projects')) {
        currentSection = 'projects';
      } else if (trimmedLine.startsWith('### Achievements')) {
        currentSection = 'achievements';
      } else if (currentSection && trimmedLine) {
        if (line.startsWith('- ')) {
          sections[currentSection].push(trimmedLine.substring(1).trim());
        } else if (line.startsWith(' - ') && (currentSection === 'projects' || currentSection === 'experience')) {
          if (sections[currentSection].length > 0) {
            const lastIndex = sections[currentSection].length - 1;
            sections[currentSection][lastIndex] += '\n' + trimmedLine;
          }
        } else if (trimmedLine.startsWith('-') && currentSection !== 'projects' && currentSection !== 'experience') {
          sections[currentSection].push(trimmedLine.substring(1).trim());
        } else if (currentSection && trimmedLine && !trimmedLine.startsWith('###')) {
          if (currentSection === 'projects' || currentSection === 'experience') {
            if (sections[currentSection].length > 0) {
              const lastIndex = sections[currentSection].length - 1;
              sections[currentSection][lastIndex] += '\n' + trimmedLine;
            } else {
              sections[currentSection].push(trimmedLine);
            }
          } else {
            sections[currentSection].push(trimmedLine);
          }
        }
      }
    });
    return sections;
  };

  const parseProjectName = (projectText) => {
    if (!projectText) return 'Unnamed Project';
    const firstLine = projectText.split('\n')[0];
    let match = firstLine.match(/^(.+?)\s*\(GitHub\)/) ||
                firstLine.match(/^(.+?)\s*\|/) ||
                firstLine.match(/^(.+?)\s*[-–]/) ||
                firstLine.match(/^([^|\-–(]+)/);
    return match ? match[1].trim() : firstLine.trim();
  };

  // Chatbot functionality
  const generateCandidateContext = (candidate) => {
    if (!candidate) return '';
    
    const context = {
      username: candidate.Application?.user?.username || 'Anonymous',
      applicationId: candidate.Application?.id,
      overallScore: getEffectiveScore(candidate).toFixed(1),
      devScore: typeof candidate.Devscore === 'number' ? candidate.Devscore.toFixed(1) : 'N/A',
      resumeScore: typeof candidate.Resumescore === 'number' ? candidate.Resumescore.toFixed(1) : 'N/A',
      dsaScore: typeof candidate.DsaScore === 'number' ? candidate.DsaScore.toFixed(1) : 'N/A',
      status: candidate.status || 'N/A',
      recommendation: candidate.recommendation || 'N/A',
      feedback: candidate.feedback || 'No feedback available',
      strengths: candidate.strengths || 'No strengths listed',
      startTime: formatDateTime(candidate.start_time),
      endTime: formatDateTime(candidate.end_time),
      duration: candidate.start_time && candidate.end_time 
        ? `${Math.round((new Date(candidate.end_time) - new Date(candidate.start_time)) / (1000 * 60))} minutes`
        : 'In Progress',
      questionsPerformance: candidate.session?.map((item, idx) => ({
        questionNumber: idx + 1,
        question: item.Customquestion?.question || 'N/A',
        score: item.score ? item.score.toFixed(1) : 'N/A',
        feedback: item.feedback || 'No feedback',
        followupCount: item.followups?.length || 0
      })) || [],
      dsaTopics: candidate.dsa?.map((dsa, idx) => ({
        topicNumber: idx + 1,
        topic: dsa.topic?.topic || 'N/A',
        difficulty: dsa.topic?.difficulty || 'N/A',
        score: dsa.score ? dsa.score.toFixed(1) : 'N/A'
      })) || [],
      resumeConversations: candidate.resume_conversations?.map((conv, idx) => ({
        conversationNumber: idx + 1,
        question: conv.question || 'N/A',
        score: conv.score ? conv.score.toFixed(1) : 'N/A',
        feedback: conv.feedback || 'No feedback'
      })) || [],
      applicationScore: typeof candidate.Application?.score === 'number' ? candidate.Application.score.toFixed(1) : 'N/A',
      appliedAt: formatDateTime(candidate.Application?.applied_at),
      shortlistingDecision: candidate.Application?.shortlisting_decision === true ? 'Approved' 
        : candidate.Application?.shortlisting_decision === false ? 'Rejected' 
        : 'Pending'
    };

    return JSON.stringify(context, null, 2);
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    const newMessages = [...chatMessages, { role: 'user', content: userMessage }];
    setChatMessages(newMessages);
    setIsChatLoading(true);

    try {
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
      const candidateContext = generateCandidateContext(selectedCandidate);

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant helping an interviewer understand candidate interview data. Here is the complete candidate information:

${candidateContext}

Answer questions about this candidate's interview performance, application details, scores, feedback, and status. Be concise, professional, and data-driven. If asked about specific scores or details, reference the exact values from the data. If information is not available, clearly state that.`
            },
            ...newMessages
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to get AI response');
      }

      const data = await response.json();
      const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      setChatMessages([...newMessages, { role: 'assistant', content: aiMessage }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Filter and search logic
  const filteredData = leaderboardData.filter(candidate => {
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    const matchesSearch = !searchTerm || 
      candidate.Application?.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.Application?.id?.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => getEffectiveScore(b) - getEffectiveScore(a));
console.log("Sorted Data:", sortedData);
  // Chart configurations with interactive tooltips
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        setSelectedChart('Performance Distribution');
      }
    }
  };

  // Essential Charts Data
  const performanceDistributionData = {
    labels: ['90-100', '80-89', '70-79', '60-69', '50-59', 'Below 50'],
    datasets: [{
      label: 'Candidates',
      data: [
        leaderboardData.filter(c => getEffectiveScore(c) >= 90).length,
        leaderboardData.filter(c => getEffectiveScore(c) >= 80 && getEffectiveScore(c) < 90).length,
        leaderboardData.filter(c => getEffectiveScore(c) >= 70 && getEffectiveScore(c) < 80).length,
        leaderboardData.filter(c => getEffectiveScore(c) >= 60 && getEffectiveScore(c) < 70).length,
        leaderboardData.filter(c => getEffectiveScore(c) >= 50 && getEffectiveScore(c) < 60).length,
        leaderboardData.filter(c => getEffectiveScore(c) < 50).length,
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(107, 114, 128, 0.8)',
      ],
      borderWidth: 2,
      borderColor: 'white',
    }],
  };

  const skillsComparisonData = {
    labels: ['Dev Skills', 'Resume Quality', 'DSA Performance'],
    datasets: [{
      label: 'Average Score',
      data: [
        leaderboardData.reduce((sum, c) => sum + (c.Devscore || 0), 0) / Math.max(leaderboardData.length, 1),
        leaderboardData.reduce((sum, c) => sum + (c.Resumescore || 0), 0) / Math.max(leaderboardData.length, 1),
        leaderboardData.reduce((sum, c) => sum + (c.DsaScore || 0), 0) / Math.max(leaderboardData.length, 1),
      ],
      backgroundColor: [
        'rgba(139, 92, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 101, 101, 0.8)',
      ],
      borderColor: [
        'rgba(139, 92, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 101, 101, 1)',
      ],
      borderWidth: 2,
    }],
  };

  const interviewStatusData = {
    labels: ['Completed', 'Ongoing', 'Scheduled', 'Cancelled'],
    datasets: [{
      data: [
        leaderboardData.filter(c => c.status === 'completed').length,
        leaderboardData.filter(c => c.status === 'ongoing').length,
        leaderboardData.filter(c => c.status === 'scheduled').length,
        leaderboardData.filter(c => c.status === 'cancelled').length,
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(156, 163, 175, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderWidth: 2,
      borderColor: 'white',
    }],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header viewerType="owner" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header viewerType="owner" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-lg max-w-md">
            <h3 className="font-semibold mb-2">Error Loading Dashboard</h3>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900">
      <Header viewerType="owner" />
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <div className={`transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <LayoutDashboard className="w-8 h-8" />
                    Interviewer Dashboard
                  </h1>
                  <p className="text-blue-100">Comprehensive interview analytics and candidate evaluation</p>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                    <p className="text-sm opacity-90">Total Candidates</p>
                    <p className="text-2xl font-bold">{leaderboardData.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="px-8 py-6 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">
                  {leaderboardData.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600">Ongoing</p>
                <p className="text-xl font-bold text-gray-900">
                  {leaderboardData.filter(c => c.status === 'ongoing').length}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-xl font-bold text-gray-900">
                  {leaderboardData.length > 0 
                    ? (leaderboardData.reduce((sum, c) => sum + getEffectiveScore(c), 0) / leaderboardData.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600">Top Score</p>
                <p className="text-xl font-bold text-gray-900">
                  {leaderboardData.length > 0 
                    ? Math.max(...leaderboardData.map(c => getEffectiveScore(c))).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Candidate Rankings
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {sortedData.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-600">No candidates found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Overall</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dev</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Resume</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DSA</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedData.map((candidate, index) => (
                  
                      <tr
                        key={candidate.id}
                        className={`hover:bg-gray-50 transition-colors ${index < 3 ? "bg-gradient-to-r from-yellow-50/50 to-transparent" : ""}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {getRankIcon(index + 1)}
                            <span className="text-lg font-bold text-gray-900">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {candidate.Application?.user?.username || "Anonymous"}
                              </div>
                              <div className="text-sm text-gray-500">ID: {candidate.Application?.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(getEffectiveScore(candidate))}`}>
                            {getEffectiveScore(candidate).toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(candidate.Devscore)}`}>
<<<<<<< HEAD
                            {typeof candidate.Devscore === 'number' ? candidate.Devscore.toFixed(1) : Math.random(0,3).toFixed(1)}
=======
                            {typeof candidate.Devscore === 'number' ? candidate.Devscore.toFixed(1) : '0'}
>>>>>>> 2b5e3b265c318f58e12239e186669d703cbb6abd
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(candidate.Resumescore)}`}>
                            {typeof candidate.Resumescore === 'number' ? candidate.Resumescore.toFixed(1) : '0'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(candidate.DsaScore)}`}>
                            {typeof candidate.DsaScore === 'number' ? candidate.DsaScore.toFixed(1) : "0"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(candidate.status)}</td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(candidate)}
                              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewApplication(candidate.Application)}
                              className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors border border-green-200 hover:border-green-300"
                              title="View Application"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button>
                           <Appp image={candidate.images[0]} />
                            </button>
                          </div>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex gap-2">
    <button
      onClick={() => handleViewDetails(candidate)}
      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
    >
      <Eye className="w-4 h-4" />
    </button>
    <button
      onClick={() => handleViewApplication(candidate.Application)}
      className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors border border-green-200 hover:border-green-300"
    >
      <FileText className="w-4 h-4" />
    </button>
    {/* Access the first image from the images array */}
    {candidate.images && candidate.images.length > 0 && (
      <ImageModal image={candidate.images[0]} />
    )}
  </div>
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className={`mb-8 transform transition-all duration-1000 delay-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart2 className="w-6 h-6 text-blue-500" />
                  Interview Analytics
                </h2>
                <button
                  onClick={() => setShowChartsSection(!showChartsSection)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {showChartsSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showChartsSection ? 'Hide' : 'Show'} Charts
                </button>
              </div>
            </div>
            
            {showChartsSection && (
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Distribution Chart */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                     onClick={() => setSelectedChart(selectedChart === 'performance' ? null : 'performance')}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Performance Distribution
                    </h3>
                    <Info className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="h-64">
                    <Bar data={performanceDistributionData} options={{...chartOptions, onClick: () => setSelectedChart('performance')}} />
                  </div>
                  {selectedChart === 'performance' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Insight:</strong> This chart shows how candidates are distributed across different score ranges. 
                        Higher concentrations in the 80-100 range indicate strong candidate quality.
                      </p>
                    </div>
                  )}
                </div>

                {/* Skills Comparison Chart */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                     onClick={() => setSelectedChart(selectedChart === 'skills' ? null : 'skills')}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      Skills Comparison
                    </h3>
                    <Info className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                  </div>
                  <div className="h-64">
                    <Doughnut data={skillsComparisonData} options={{...chartOptions, onClick: () => setSelectedChart('skills')}} />
                  </div>
                  {selectedChart === 'skills' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>Insight:</strong> Compare average performance across different evaluation criteria. 
                        Identify which areas candidates excel in and which need improvement.
                      </p>
                    </div>
                  )}
                </div>

                {/* Interview Status Chart */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                     onClick={() => setSelectedChart(selectedChart === 'status' ? null : 'status')}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      Interview Progress
                    </h3>
                    <Info className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <div className="h-64">
                    <Pie data={interviewStatusData} options={{...chartOptions, onClick: () => setSelectedChart('status')}} />
                  </div>
                  {selectedChart === 'status' && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800">
                        <strong>Insight:</strong> Track the overall progress of your interview process. 
                        Monitor completion rates and identify any bottlenecks in the pipeline.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interview Details Modal with Chatbot */}
        {showHistory && selectedCandidate && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 flex justify-between items-center border-b border-gray-200 z-10">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  Interview Details - {selectedCandidate.Application?.user?.username || "Anonymous"}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowChatbot(!showChatbot)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      showChatbot 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    AI Assistant
                  </button>
                  <button
                    onClick={() => {
                      setShowHistory(false);
                      setShowChatbot(false);
                      setChatMessages([]);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex h-[calc(90vh-80px)]">
                {/* Main Content */}
                <div className={`${showChatbot ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
                  {/* Tabs */}
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="flex gap-2 flex-wrap">
                      {['overview', 'questions', 'dsa', 'resume_conversations', 'images'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            activeTab === tab
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {tab === 'overview' && <LayoutDashboard className="w-4 h-4" />}
                          {tab === 'questions' && <MessageSquare className="w-4 h-4" />}
                          {tab === 'dsa' && <FileCode className="w-4 h-4" />}
                          {tab === 'resume_conversations' && <BarChart2 className="w-4 h-4" />}
                          {tab === 'images' && <Eye className="w-4 h-4" />}
                          {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto h-[calc(90vh-160px)] space-y-8 text-gray-700">
                    {activeTab === 'overview' && (
                      <div className="space-y-8">
                        {/* Summary */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5 text-blue-500" />
                            Summary
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group relative text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
                              <p className="text-sm text-gray-500 mb-2">Final Score</p>
                              <div className={`inline-flex px-4 py-2 rounded-full text-xl font-bold border ${getScoreColor(getEffectiveScore(selectedCandidate))} group-hover:scale-105 transition-transform duration-300`}>
                                {getEffectiveScore(selectedCandidate).toFixed(1)}
                              </div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
                              <p className="text-sm text-gray-500 mb-2">Status</p>
                              <div className="mt-1">{getStatusBadge(selectedCandidate.status)}</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
                              <p className="text-sm text-gray-500 mb-2">Recommendation</p>
                              <p className="text-sm font-medium text-gray-900">{selectedCandidate.recommendation || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Feedback */}
                        {selectedCandidate.feedback ? (
                          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-blue-500" />
                              Overall Feedback
                            </h4>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                              <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.feedback}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No feedback available.</p>
                          </div>
                        )}

                        {/* Strengths */}
                        {selectedCandidate.strengths ? (
                          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Star className="w-5 h-5 text-green-500" />
                              Strengths
                            </h4>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                              <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.strengths}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No strengths available.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'questions' && (
                      <div className="space-y-8">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-blue-500" />
                          Question-wise Performance
                        </h4>
                        {selectedCandidate.session && selectedCandidate.session.length > 0 ? (
                          <div className="space-y-4">
                            {selectedCandidate.session.map((item, index) => (
                              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-start mb-4">
                                  <h5 className="text-lg font-medium text-gray-900">Question {index + 1}</h5>
                                  {item.score && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(item.score)}`}>
                                      {item.score.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Main Question:</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                                      {item.Customquestion?.question || "N/A"}
                                    </p>
                                  </div>
                                  {item.Customquestion?.answer && (
                                    <div>
                                      <p className="text-sm font-medium text-blue-600 mb-1">Expected Answer:</p>
                                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                                        {item.Customquestion.answer}
                                      </p>
                                    </div>
                                  )}
                                  {item.followups && item.followups.length > 0 && (
                                    <div>
                                      <p className="text-sm font-medium text-blue-600 mb-2">Follow-up Questions:</p>
                                      <div className="space-y-3">
                                        {item.followups.map((qa, qaIndex) => (
                                          <div key={qaIndex} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                            <p className="text-sm font-medium text-green-600 mb-1">Q: {qa.question}</p>
                                            <p className="text-sm text-gray-700">A: {qa.answer || "N/A"}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {item.feedback && (
                                    <div>
                                      <p className="text-sm font-medium text-blue-600 mb-1">Feedback:</p>
                                      <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                                        {item.feedback}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No question data available.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'dsa' && (
                      <div className="space-y-8">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <FileCode className="w-5 h-5 text-cyan-500" />
                          DSA Topics
                        </h4>
                        {selectedCandidate.dsa && selectedCandidate.dsa.length > 0 ? (
                          <div className="space-y-4">
                            {selectedCandidate.dsa.map((dsa, index) => (
                              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-start mb-4">
                                  <h5 className="text-lg font-medium text-gray-900">
                                    {dsa.topic?.topic} ({dsa.topic?.difficulty})
                                  </h5>
                                  {dsa.score && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(dsa.score)}`}>
                                      {dsa.score.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-4">
                                  {dsa.question && (
                                    <div>
                                      <p className="text-sm font-medium text-blue-600 mb-1">Question:</p>
                                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                                        {typeof dsa.question === 'string' ? JSON.parse(dsa.question).description : "N/A"}
                                      </p>
                                    </div>
                                  )}
                                  {dsa.code && (
                                    <div>
                                      <p className="text-sm font-medium text-blue-600 mb-1">Code:</p>
                                      <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200 overflow-x-auto">
                                        <code>{dsa.code}</code>
                                      </pre>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Created At:</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                                      {formatDateTime(dsa.created_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                            <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No DSA topics available.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'resume_conversations' && (
                      <div className="space-y-8">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-green-500" />
                          Resume Conversations
                        </h4>
                        {selectedCandidate.resume_conversations && selectedCandidate.resume_conversations.length > 0 ? (
                          <div className="space-y-4">
                            {selectedCandidate.resume_conversations.map((conv, index) => (
                              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-start mb-4">
                                  <h5 className="text-lg font-medium text-gray-900">Conversation {index + 1}</h5>
                                  {conv.score && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(conv.score)}`}>
                                      {conv.score.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Question:</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                                      {conv.question || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Expected Answer:</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                                      {conv.expected_answer || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-blue-600 mb-1">Candidate Answer:</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                                      {conv.answer || "N/A"}
                                    </p>
                                  </div>
                                  {conv.feedback && (
                                    <div>
                                      <p className="text-sm font-medium text-blue-600 mb-1">Feedback:</p>
                                      <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                                        {conv.feedback}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                            <BarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No resume conversations available.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'images' && (
                      <div className="space-y-8">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Eye className="w-5 h-5 text-purple-500" />
                          Interview Images
                        </h4>
                        {selectedCandidate.images && selectedCandidate.images.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedCandidate.images.map((image, index) => (
                              <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                  <img
                                    src={image.image || image.image_url}
                                    alt={`Interview capture ${index + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                    }}
                                  />
                                </div>
                                <div className="p-4">
                                  <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {formatDateTime(image.timestamp)}
                                    </span>
                                  </div>
                                  {image.description && (
                                    <p className="mt-2 text-sm text-gray-700">{image.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No images captured during this interview.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Chatbot Panel */}
                {showChatbot && (
                  <div className="w-1/2 border-l border-gray-200 flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        <h4 className="font-semibold">AI Interview Assistant</h4>
                      </div>
                      <button
                        onClick={() => setShowChatbot(false)}
                        className="hover:bg-white/20 rounded-lg p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-12">
                          <Bot className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium mb-2">Ask me anything about this candidate!</p>
                          <p className="text-sm text-gray-500 px-6">
                            I can help you understand their interview performance, scores, feedback, and application details.
                          </p>
                          <div className="mt-6 space-y-2">
                            <button
                              onClick={() => setChatInput("What was the candidate's overall performance?")}
                              className="block w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-blue-50 text-sm text-gray-700 border border-gray-200 transition-colors"
                            >
                              💡 What was the candidate's overall performance?
                            </button>
                            <button
                              onClick={() => setChatInput("What are the candidate's strengths and weaknesses?")}
                              className="block w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-blue-50 text-sm text-gray-700 border border-gray-200 transition-colors"
                            >
                              💡 What are the candidate's strengths and weaknesses?
                            </button>
                            <button
                              onClick={() => setChatInput("How did they perform in the DSA section?")}
                              className="block w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-blue-50 text-sm text-gray-700 border border-gray-200 transition-colors"
                            >
                              💡 How did they perform in the DSA section?
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {chatMessages.map((msg, index) => (
                            <div
                              key={index}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                  msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                                }`}
                              >
                                {msg.role === 'assistant' && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <Bot className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                                  </div>
                                )}
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                          {isChatLoading && (
                            <div className="flex justify-start">
                              <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2">
                                  <Bot className="w-4 h-4 text-blue-600" />
                                  <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={handleChatKeyPress}
                          placeholder="Ask about this candidate..."
                          disabled={isChatLoading}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                          onClick={handleChatSubmit}
                          disabled={!chatInput.trim() || isChatLoading}
                          className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Powered by Groq AI • Press Enter to send
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Application Details Modal */}
        {showApplication && selectedApplication && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowApplication(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Application Details - {selectedApplication.user?.username || "Anonymous"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowApplication(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-8">
                {/* Application Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Application Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-1">{selectedApplication.user?.username || "Anonymous"}</h5>
                      <p className="text-sm text-gray-500">Application ID: {selectedApplication.id}</p>
                    </div>
                    <div className="group relative text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
                      <div className="mb-3">
                        <Star className="w-8 h-8 text-yellow-500 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">Application Score</p>
                      <div className={`inline-flex px-4 py-2 rounded-full text-xl font-bold border ${getScoreColor(selectedApplication.score)} group-hover:scale-105 transition-transform duration-300`}>
                        {typeof selectedApplication.score === 'number' ? selectedApplication.score.toFixed(1) : "N/A"}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
                      <div className="mb-3">
                        <Calendar className="w-8 h-8 text-blue-500 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">Applied On</p>
                      <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedApplication.applied_at)}</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
                      <div className="mb-3">
                        <Target className="w-8 h-8 text-green-500 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">Decision</p>
                      <div className="flex justify-center mt-2">{getDecisionBadge(selectedApplication.shortlisting_decision)}</div>
                    </div>
                  </div>
                </div>

                {/* Application Feedback */}
                {selectedApplication.feedback ? (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      Application Feedback
                    </h4>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                      <p className="text-gray-700 leading-relaxed">{selectedApplication.feedback}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No application feedback available.</p>
                  </div>
                )}

                {/* Resume Section */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      Resume
                    </h4>
                    <div className="flex bg-gray-200 rounded-lg p-1">
                      <button
                        onClick={() => setResumeView('extracted')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                          resumeView === 'extracted' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        Extracted
                      </button>
                      <button
                        onClick={() => setResumeView('original')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                          resumeView === 'original' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        Original
                      </button>
                    </div>
                  </div>
                  {resumeView === 'extracted' ? (
                    <div className="space-y-8">
                      {(() => {
                        const resumeData = parseExtractedResume(selectedApplication.extratedResume);
                        if (!resumeData) {
                          return (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 text-lg">No extracted resume data available.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-6">
                            {/* Personal Details */}
                            {resumeData.personalDetails.length > 0 && (
                              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <User className="w-5 h-5 text-blue-500" />
                                  Personal Details
                                </h5>
                                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                  {resumeData.personalDetails.map((detail, index) => (
                                    <li key={index}>{detail}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Skills */}
                            {resumeData.skills.length > 0 && (
                              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <Code className="w-5 h-5 text-green-500" />
                                  Skills
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {resumeData.skills.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm border border-green-200"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Experience */}
                            {resumeData.experience.length > 0 && (
                              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <Briefcase className="w-5 h-5 text-purple-500" />
                                  Experience
                                </h5>
                                <div className="space-y-4">
                                  {resumeData.experience.map((exp, index) => (
                                    <div key={index} className="border-l-4 border-purple-500 pl-4">
                                      <p className="text-sm text-gray-700 whitespace-pre-line">{exp}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Education */}
                            {resumeData.education.length > 0 && (
                              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <GraduationCap className="w-5 h-5 text-blue-500" />
                                  Education
                                </h5>
                                <div className="space-y-4">
                                  {resumeData.education.map((edu, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                                      <p className="text-sm text-gray-700 whitespace-pre-line">{edu}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Certifications */}
                            {resumeData.certifications.length > 0 && (
                              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <AwardIcon className="w-5 h-5 text-yellow-500" />
                                  Certifications
                                </h5>
                                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                  {resumeData.certifications.map((cert, index) => (
                                    <li key={index}>{cert}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Projects */}
                            {resumeData.projects.length > 0 && (
                              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <Target className="w-5 h-5 text-red-500" />
                                  Projects
                                </h5>
                                <div className="space-y-4">
                                  {resumeData.projects.map((project, index) => (
                                    <div key={index} className="border-l-4 border-red-500 pl-4">
                                      <h6 className="text-base font-medium text-gray-900 mb-2">
                                        {parseProjectName(project)}
                                      </h6>
                                      <p className="text-sm text-gray-700 whitespace-pre-line">{project}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Achievements */}
                            {resumeData.achievements.length > 0 && (
                              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <Star className="w-5 h-5 text-yellow-500" />
                                  Achievements
                                </h5>
                                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                  {resumeData.achievements.map((achievement, index) => (
                                    <li key={index}>{achievement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedApplication.resume ? (
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                          <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-500" />
                            Original Resume
                          </h5>
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-500">Uploaded: {formatDateTime(selectedApplication.resume_uploaded_at)}</p>
                            <a
                              href={selectedApplication.resume}
                              download
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              Download Resume
                            </a>
                          </div>
                          <iframe
                            src={selectedApplication.resume}
                            className="w-full h-[60vh] border border-gray-200 rounded-md"
                            title="Resume Preview"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No resume uploaded.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;