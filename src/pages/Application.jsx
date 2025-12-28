import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, FileText, Eye, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Star, Calendar, ChevronDown, ChevronUp, Building, Code, Trophy, Link as LinkIcon, Search, Filter, Download, Share2, MessageSquare, Send, X, Bot } from "lucide-react";

export default function Application() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    achievements: true,
    certifications: true
  });
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  
  // Chatbot states
  const [chatbotOpen, setChatbotOpen] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // or however you get your token
    const API_URL = import.meta.env.VITE_API_URL;
    
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/interview/get-applications/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
      })
      .then((data) => setApplications(data))
      .catch((error) => {
        console.error("Error loading applications:", error);
        // You can use toast here if you have react-toastify installed
        alert("Could not load applications.");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (feedbackModal) {
          setFeedbackModal(null);
        } else if (chatbotOpen) {
          setChatbotOpen(null);
          setChatMessages([]);
        } else if (viewMode) {
          setViewMode(null);
        }
      }
    };
  
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [feedbackModal, chatbotOpen, viewMode]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const getScoreColor = (score) => {
    if (score >= 7) return "text-emerald-600";
    if (score >= 4) return "text-amber-600";
    return "text-red-500";
  };
  
  const getScoreBackgroundColor = (score) => {
    if (score >= 7) return "bg-emerald-50 border-emerald-200";
    if (score >= 4) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Resume parsing functions
  const parseExtractedResume = (resumeText) => {
    if (!resumeText) return null;
  
    const sections = {
      personalInfo: {},
      summary: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      achievements: [],
      certifications: [],
    };
  
    const lines = resumeText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    let currentSection = null;
    let currentExperienceItem = null;
    let currentEducationItem = null;
    let currentProjectText = "";
  
    const finalizeExperienceItem = () => {
      if (currentExperienceItem && currentSection === "experience") {
        sections.experience.push(currentExperienceItem);
        currentExperienceItem = null;
      }
    };
  
    const finalizeEducationItem = () => {
      if (currentEducationItem && currentSection === "education") {
        sections.education.push(currentEducationItem);
        currentEducationItem = null;
      }
    };
  
    const finalizeProjectItem = () => {
      if (currentSection === "projects" && currentProjectText.trim()) {
        sections.projects.push(currentProjectText.trim());
        currentProjectText = "";
      }
    };
  
    lines.forEach((line) => {
      if (line.startsWith("###")) {
        finalizeExperienceItem();
        finalizeEducationItem();
        finalizeProjectItem();
        
        const sectionTitle = line.replace("###", "").trim().toLowerCase();
        if (sectionTitle.includes("personal")) currentSection = "personalInfo";
        else if (sectionTitle.includes("summary")) currentSection = "summary";
        else if (sectionTitle.includes("skills")) currentSection = "skills";
        else if (sectionTitle.includes("experience")) currentSection = "experience";
        else if (sectionTitle.includes("education")) currentSection = "education";
        else if (sectionTitle.includes("certifications")) currentSection = "certifications";
        else if (sectionTitle.includes("projects")) currentSection = "projects";
        else if (sectionTitle.includes("achievements")) currentSection = "achievements";
        
        currentExperienceItem = null;
        currentEducationItem = null;
        currentProjectText = "";
      } else if (currentSection) {
        if (currentSection === "personalInfo") {
          if (line.includes("Name:")) sections.personalInfo.name = line.replace("Name:", "").trim();
          else if (line.includes("Email:")) sections.personalInfo.email = line.replace("Email:", "").trim();
          else if (line.includes("Phone:")) sections.personalInfo.phone = line.replace("Phone:", "").trim();
          else if (line.includes("Location:")) sections.personalInfo.location = line.replace("Location:", "").trim();
          else if (line.includes("LinkedIn:")) sections.personalInfo.linkedin = line.replace("LinkedIn:", "").trim();
          else if (line.includes("GitHub:")) sections.personalInfo.github = line.replace("GitHub:", "").trim();
        } else if (currentSection === "summary") {
          if (!line.startsWith("-")) {
            sections.summary += line + " ";
          }
        } else if (currentSection === "skills") {
          if (line.startsWith("-")) {
            const cleanLine = line.replace("-", "").trim();
            sections.skills.push(cleanLine);
          }
        } else if (currentSection === "experience") {
          if (line.startsWith("-")) {
            const cleanLine = line.replace("-", "").trim();
            
            if (isCompanyPositionLine(cleanLine)) {
              if (currentExperienceItem) {
                sections.experience.push(currentExperienceItem);
              }
              
              currentExperienceItem = parseStructuredItem(cleanLine);
              currentExperienceItem.details = [];
            } else {
              if (currentExperienceItem) {
                currentExperienceItem.details.push(cleanLine);
              }
            }
          }
        } else if (currentSection === "education") {
          if (line.startsWith("-")) {
            const cleanLine = line.replace("-", "").trim();
            
            if (isEducationMainLine(cleanLine)) {
              if (currentEducationItem) {
                sections.education.push(currentEducationItem);
              }
              
              currentEducationItem = parseEducationItem(cleanLine);
              currentEducationItem.details = [];
            } else {
              if (currentEducationItem) {
                if (cleanLine.includes("CGPA:")) {
                  currentEducationItem.cgpa = cleanLine.replace("CGPA:", "").trim();
                } else if (cleanLine.includes("Percentage:")) {
                  currentEducationItem.percentage = cleanLine.replace("Percentage:", "").trim();
                } else {
                  currentEducationItem.details.push(cleanLine);
                }
              }
            }
          }
        } else if (currentSection === "projects") {
          if (line.startsWith("-")) {
            const cleanLine = line.replace(/^-\s*/, "");
            
            if (isMainProjectLine(cleanLine)) {
              if (currentProjectText.trim()) {
                sections.projects.push(currentProjectText.trim());
              }
              currentProjectText = cleanLine;
            } else {
              if (currentProjectText) {
                currentProjectText += "\n - " + cleanLine;
              } else {
                currentProjectText = cleanLine;
              }
            }
          }
        } else if (currentSection === "achievements" || currentSection === "certifications") {
          if (line.startsWith("-")) {
            const cleanLine = line.replace("-", "").trim();
            sections[currentSection].push(cleanLine);
          }
        }
      }
    });
  
    finalizeExperienceItem();
    finalizeEducationItem();
    finalizeProjectItem();
  
    return sections;
  };

  const isCompanyPositionLine = (line) => {
    const companyPatterns = [
      /\b(intern|associate|developer|engineer|manager|analyst)\b/i,
      /\b(at|@)\s+[A-Z]/,
      /\b(inc|llc|ltd|corp|company)\b/i,
      /\(\s*\d{4}\s*[-–]\s*(\d{4}|present)\s*\)/i,
    ];
    return companyPatterns.some(pattern => pattern.test(line));
  };

  const isEducationMainLine = (line) => {
    const educationPatterns = [
      /\b(b\.e\.|b\.tech|bachelor|master|diploma|degree)\b/i,
      /\b(university|college|school|institute)\b/i,
      /\d{4}\s*[-–]\s*\d{4}/i,
    ];
    return educationPatterns.some(pattern => pattern.test(line));
  };

  const isMainProjectLine = (line) => {
    const mainProjectPatterns = [
      /\|\s*[A-Za-z]/,
      /\(\d{4}\)/,
      /^\*\*.*\*\*:/,
    ];
    return mainProjectPatterns.some(pattern => pattern.test(line));
  };

  const parseStructuredItem = (text) => {
    const item = {
      title: "",
      organization: "",
      location: "",
      period: "",
      details: [],
      raw: text
    };

    const match = text.match(/^(.+?)\s+(?:at|@)\s+(.+?)(?:\s+\((.+?)\))?$/i);
    if (match) {
      item.title = match[1]?.trim() || "";
      item.organization = match[2]?.trim() || "";
      item.period = match[3]?.trim() || "";
    } else {
      item.title = text;
    }

    return item;
  };

  const parseEducationItem = (text) => {
    const item = {
      title: "",
      organization: "",
      location: "",
      period: "",
      cgpa: "",
      percentage: "",
      details: [],
      raw: text
    };

    const match = text.match(/^(.+?)\s+[-–]\s+(.+?)(?:\s+\((.+?)\))?$/i);
    if (match) {
      item.title = match[1]?.trim() || "";
      item.organization = match[2]?.trim() || "";
      item.period = match[3]?.trim() || "";
    } else {
      item.title = text;
    }

    return item;
  };

  // Rendering functions
  const renderPersonalInfo = (info) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-50 p-3 rounded-xl">
          <User size={24} className="text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {info.name && (
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="bg-blue-50 p-2 rounded-lg">
              <User size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="text-gray-900 font-semibold">{info.name}</p>
            </div>
          </div>
        )}
        
        {info.email && (
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <Mail size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-gray-900 font-semibold">{info.email}</p>
            </div>
          </div>
        )}
        
        {info.phone && (
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="bg-amber-50 p-2 rounded-lg">
              <Phone size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="text-gray-900 font-semibold">{info.phone}</p>
            </div>
          </div>
        )}
        
        {info.location && (
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="bg-red-50 p-2 rounded-lg">
              <MapPin size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Location</p>
              <p className="text-gray-900 font-semibold">{info.location}</p>
            </div>
          </div>
        )}

        {info.linkedin && (
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="bg-blue-50 p-2 rounded-lg">
              <LinkIcon size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">LinkedIn</p>
              <p className="text-gray-900 font-semibold truncate">{info.linkedin}</p>
            </div>
          </div>
        )}
        
        {info.github && (
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Code size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">GitHub</p>
              <p className="text-gray-900 font-semibold truncate">{info.github}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCollapsibleSection = (title, icon, content, sectionKey, itemCount = 0) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8 shadow-sm">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between group hover:bg-gray-50 p-4 rounded-xl transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-100 transition-colors">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            {itemCount > 0 && (
              <p className="text-gray-500 text-sm">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
            )}
          </div>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-gray-200 transition-colors">
          {expandedSections[sectionKey] ? 
            <ChevronUp size={20} className="text-indigo-600" /> : 
            <ChevronDown size={20} className="text-indigo-600" />
          }
        </div>
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="mt-6 space-y-4">
          {content}
        </div>
      )}
    </div>
  );

  const renderSkills = (skills) => (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm border border-indigo-200"
        >
          {skill}
        </span>
      ))}
    </div>
  );

  const renderExperience = (experience) => (
    <div className="space-y-6">
      {experience.map((exp, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 group">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-xl flex-shrink-0">
              <Briefcase size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {exp.title || exp.raw}
              </h4>
              
              {exp.organization && (
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Building size={16} className="text-gray-500" />
                  <span className="font-medium">{exp.organization}</span>
                  {exp.period && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{exp.period}</span>
                    </>
                  )}
                </div>
              )}
              
              {exp.details && exp.details.length > 0 && (
                <div className="mt-3 space-y-2">
                  {exp.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="bg-blue-500 w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600 text-sm leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducation = (education) => (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 group">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl flex-shrink-0">
              <GraduationCap size={20} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                {edu.title || edu.raw}
              </h4>
              
              {edu.organization && (
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Building size={16} className="text-gray-500" />
                  <span className="font-medium">{edu.organization}</span>
                  {edu.period && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{edu.period}</span>
                    </>
                  )}
                </div>
              )}
              
              {(edu.cgpa || edu.percentage) && (
                <div className="flex gap-2 mb-2">
                  {edu.cgpa && (
                    <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      <span className="text-amber-700 font-semibold text-sm">
                        CGPA: {edu.cgpa}
                      </span>
                    </div>
                  )}
                  
                  {edu.percentage && (
                    <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                      <span className="text-blue-700 font-semibold text-sm">
                        {edu.percentage}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {edu.details && edu.details.length > 0 && (
                <div className="mt-3 space-y-2">
                  {edu.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="bg-emerald-500 w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600 text-sm leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjects = (projects) => (
    <div className="space-y-6">
      {projects.map((project, index) => {
        const lines = typeof project === 'string' ? project.split('\n').filter(line => line.trim()) : [];
        const firstLine = lines[0] || '';
        const projectName = firstLine.split('|')[0].trim();
        const techStack = firstLine.includes('|') ? firstLine.split('|')[1].split(',').map(t => t.trim()) : [];

        return (
          <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 group">
            <div className="flex items-start gap-4">
              <div className="bg-purple-50 p-3 rounded-xl flex-shrink-0">
                <Code size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                  {projectName}
                </h4>
                
                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {techStack.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-lg border border-cyan-200 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {lines.length > 1 && (
                  <div className="space-y-2">
                    {lines.slice(1).map((line, lineIndex) => (
                      <div key={lineIndex} className="flex items-start gap-2">
                        <div className="bg-purple-500 w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {line.replace(/^[-\s]+/, '').trim()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderAchievements = (achievements) => (
    <div className="grid sm:grid-cols-2 gap-4">
      {achievements.map((achievement, index) => (
        <div key={index} className="bg-amber-50 p-6 rounded-xl border border-amber-200 hover:border-amber-300 transition-all duration-200 group">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
              <Trophy size={18} className="text-amber-600" />
            </div>
            <p className="text-gray-700 leading-relaxed group-hover:text-amber-800 transition-colors">
              {achievement}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCertifications = (certifications) => (
    <div className="grid sm:grid-cols-2 gap-4">
      {certifications.map((cert, index) => (
        <div key={index} className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 hover:border-emerald-300 transition-all duration-200 group">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg flex-shrink-0">
              <Award size={18} className="text-emerald-600" />
            </div>
            <p className="text-gray-700 leading-relaxed group-hover:text-emerald-800 transition-colors">
              {cert}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  // Chatbot functions
  const openChatbot = (app) => {
    setChatbotOpen(app);
    setChatMessages([
      {
        role: "assistant",
        content: `Hello! I'm an AI assistant that can help you understand ${app.user?.username || "this candidate"}'s application. Feel free to ask me anything!`
      }
    ]);
  };

  const closeChatbot = () => {
    setChatbotOpen(null);
    setChatMessages([]);
    setChatInput("");
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setChatLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: `This is a simulated response about the candidate. In production, this would be powered by Groq AI analyzing the resume data and feedback.` 
      }]);
      setChatLoading(false);
    }, 1000);
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

   const handleToggleApproved = async (appId) => {
  const token = localStorage.getItem('authToken');
  const API_URL = import.meta.env.VITE_API_URL;
  
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const res = await fetch(
      `${API_URL}/interview/update-application/${appId}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update approval status");
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, approved: !a.approved } : a
      )
    );
  } catch (err) {
    console.error(err);
    alert("Could not update approval status. Try again.");
  }
};
  // Filter and sort applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesFilter = filterStatus === "all" || 
      (filterStatus === "approved" && app.approved) || 
      (filterStatus === "pending" && !app.approved);
    
    return matchesSearch && matchesFilter;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return (b.score || 0) - (a.score || 0);
      case "name":
        return (a.user?.username || "").localeCompare(b.user?.username || "");
      case "date":
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      default:
        return (b.score || 0) - (a.score || 0);
    }
  });

  const FeedbackModal = ({ feedback, candidateName, onClose }) => {
    if (!feedback) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        
        <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 p-3 rounded-xl">
                <FileText size={24} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Candidate Feedback</h3>
                <p className="text-gray-600">{candidateName}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-all duration-200 group"
            >
              <X size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {feedback || "No feedback provided by the candidate."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ChatbotModal = ({ app, messages, input, loading, onClose, onSend, onInputChange, onKeyPress }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">AI Assistant</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Ask about {app.user?.username || "this candidate"}'s application
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-all duration-200 group"
            >
              <X size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-indigo-100' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md'
                }`}>
                  {msg.role === 'user' ? (
                    <User size={18} className="text-indigo-600" />
                  ) : (
                    <Bot size={18} className="text-white" />
                  )}
                </div>
                
                <div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <input
                ref={chatInputRef}
                type="text"
                value={input}
                onChange={onInputChange}
                onKeyPress={onKeyPress}
                placeholder="Ask about the candidate's experience, skills, or feedback..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                onClick={onSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                <Send size={18} />
                Send
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-gray-700">Loading applications...</span>
        </div>
      </div>
    );
  }

  // View mode for resume and extracted data
  if (viewMode) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-6 relative">
        <button
          onClick={() => setViewMode(null)}
          className="absolute top-6 left-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl z-10"
        >
          <ArrowLeft size={18} /> Back to Applications
        </button>

        {viewMode.type === "resume" ? (
          <div className="flex flex-col items-center mt-20">
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold text-indigo-600 text-center">
                Resume
              </h2>
            </div>
            <div className="w-full max-w-5xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <iframe
                src={viewMode.app.resume}
                title="Resume"
                className="w-full h-[80vh] border-0 rounded-lg"
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-8 shadow-sm">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Extracted Resume
                </h2>
                <p className="text-gray-600">
                  Structured resume data for easy review and analysis
                </p>
              </div>
            </div>

            {(() => {
              const parsedResume = parseExtractedResume(viewMode.app.extratedResume);
              
              if (!parsedResume) {
                return (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                      <p className="text-red-600 text-center">No extracted data available or unable to parse resume content.</p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {parsedResume.personalInfo && Object.keys(parsedResume.personalInfo).length > 0 && 
                    renderPersonalInfo(parsedResume.personalInfo)
                  }

                  {parsedResume.summary && parsedResume.summary.trim() && 
                    renderCollapsibleSection(
                      "Professional Summary",
                      <FileText size={24} className="text-indigo-600" />,
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <p className="text-gray-700 leading-relaxed text-lg">{parsedResume.summary.trim()}</p>
                      </div>,
                      "summary"
                    )
                  }

                  {parsedResume.experience && parsedResume.experience.length > 0 && 
                    renderCollapsibleSection(
                      "Work Experience",
                      <Briefcase size={24} className="text-indigo-600" />,
                      renderExperience(parsedResume.experience),
                      "experience",
                      parsedResume.experience.length
                    )
                  }

                  {parsedResume.education && parsedResume.education.length > 0 && 
                    renderCollapsibleSection(
                      "Education",
                      <GraduationCap size={24} className="text-indigo-600" />,
                      renderEducation(parsedResume.education),
                      "education",
                      parsedResume.education.length
                    )
                  }

                  {parsedResume.skills && parsedResume.skills.length > 0 && 
                    renderCollapsibleSection(
                      "Skills",
                      <Star size={20} className="text-indigo-600" />,
                      renderSkills(parsedResume.skills),
                      "skills"
                    )
                  }

                  {parsedResume.projects && parsedResume.projects.length > 0 && 
                    renderCollapsibleSection(
                      "Projects",
                      <Code size={24} className="text-indigo-600" />,
                      renderProjects(parsedResume.projects),
                      "projects",
                      parsedResume.projects.length
                    )
                  }

                  {parsedResume.achievements && parsedResume.achievements.length > 0 && 
                    renderCollapsibleSection(
                      "Achievements",
                      <Trophy size={24} className="text-indigo-600" />,
                      renderAchievements(parsedResume.achievements),
                      "achievements",
                      parsedResume.achievements.length
                    )
                  }

                  {parsedResume.certifications && parsedResume.certifications.length > 0 && 
                    renderCollapsibleSection(
                      "Certifications",
                      <Award size={24} className="text-indigo-600" />,
                      renderCertifications(parsedResume.certifications),
                      "certifications",
                      parsedResume.certifications.length
                    )
                  }
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Download size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FileText size={16} />
            Application Review
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Review Candidate <span className="text-indigo-600">Applications</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Evaluate and manage candidate applications with AI-powered insights and structured data analysis.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Applications</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="score">Sort by Score</option>
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{sortedApplications.length}</span> applications found
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-emerald-600">{sortedApplications.filter(app => app.approved).length}</span> approved
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-amber-600">{sortedApplications.filter(app => !app.approved).length}</span> pending
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">Applications will appear here once candidates submit them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedApplications.map((app, index) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <button
                          onClick={() => window.open(`/profile/${app.user?.id}`, "_blank")}
                          className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                        >
                          {app.user?.username || "Anonymous"}
                        </button>
                        <p className="text-sm text-gray-500">Candidate</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getScoreBackgroundColor(app.score || 0)}`}>
                      <Star size={16} className={getScoreColor(app.score || 0)} />
                      <span className={`font-bold text-lg ${getScoreColor(app.score || 0)}`}>
                        {app.score?.toFixed(1) || "0.0"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openChatbot(app)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Bot size={16} />
                        AI Chat
                      </button>

                      <button
                        onClick={() => setFeedbackModal({
                          feedback: app.feedback,
                          candidateName: app.user?.username || "Anonymous"
                        })}
                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <FileText size={14} />
                        Feedback
                      </button>

                      <button
                        onClick={() => setViewMode({ type: "resume", app })}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <Eye size={14} />
                        Resume
                      </button>

                      <button
                        onClick={() => setViewMode({ type: "extracted", app })}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <FileText size={14} />
                        Data
                      </button>

                     {app.approved ? (
                        <button
                          onClick={() => handleToggleApproved(app.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          Disapprove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleApproved(app.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {feedbackModal && (
        <FeedbackModal
          feedback={feedbackModal.feedback}
          candidateName={feedbackModal.candidateName}
          onClose={() => setFeedbackModal(null)}
        />
      )}

      {chatbotOpen && (
        <ChatbotModal
          app={chatbotOpen}
          messages={chatMessages}
          input={chatInput}
          loading={chatLoading}
          onClose={closeChatbot}
          onSend={sendChatMessage}
          onInputChange={(e) => setChatInput(e.target.value)}
          onKeyPress={handleChatKeyPress}
        />
      )}
    </div>
  );
}