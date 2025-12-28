// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/ui/header";
// import Footer from "../components/ui/footer";
// import { useNavigate } from "react-router-dom";
// import {
//   Trophy,
//   Medal,
//   Award,
//   User,
//   Calendar,
//   Clock,
//   TrendingUp,
//   Eye,
//   FileText,
//   Download,
//   ArrowLeft,
//   Star,
//   BookOpen,
//   Briefcase,
//   GraduationCap,
//   Code,
//   Award as AwardIcon,
//   Target,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
// } from "lucide-react";
// import { getAuthToken } from "../utils/handleToken";

// const Leaderboard = () => {
//   const { id: interviewId } = useParams();
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [showHistory, setShowHistory] = useState(false);
//   const [showApplication, setShowApplication] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [resumeView, setResumeView] = useState('extracted'); // 'extracted' or 'original'
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     fetchLeaderboardData();
//     setTimeout(() => setVisible(true), 100);
//   }, [interviewId]);

//   const fetchLeaderboardData = async () => {
//     try {
//       const token = getAuthToken();
//       const API_URL = import.meta.env.VITE_API_URL;
//       const response = await fetch(
//         `${API_URL}/interview/leaderboard/${interviewId}/`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch leaderboard data");
//       }

//       const data = await response.json();
//       console.log(data);
//       setLeaderboardData(Array.isArray(data) ? data : data.data || []);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const getRankIcon = (rank) => {
//     switch (rank) {
//       case 1:
//         return <Trophy className="w-6 h-6 text-yellow-500" />;
//       case 2:
//         return <Medal className="w-6 h-6 text-gray-500" />;
//       case 3:
//         return <Award className="w-6 h-6 text-amber-600" />;
//       default:
//         return (
//           <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">
//             {rank}
//           </span>
//         );
//     }
//   };

//   const getScoreColor = (score) => {
//     if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
//     if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
//     if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
//     return "text-red-600 bg-red-50 border-red-200";
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       completed: "bg-green-50 text-green-600 border-green-200",
//       ongoing: "bg-blue-50 text-blue-600 border-blue-200",
//       scheduled: "bg-gray-50 text-gray-600 border-gray-200",
//       cancelled: "bg-red-50 text-red-600 border-red-200",
//       cheated: "bg-red-50 text-red-600 border-red-200",
//     };

//     const colorClass = statusColors[status] || "bg-gray-50 text-gray-600 border-gray-200";

//     return (
//       <span
//         className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
//       >
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   const getDecisionBadge = (decision) => {
//     if (decision === true) {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
//           <CheckCircle className="w-3 h-3" />
//           Approved
//         </span>
//       );
//     } else if (decision === false) {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-red-50 text-red-600 border-red-200 flex items-center gap-1">
//           <XCircle className="w-3 h-3" />
//           Rejected
//         </span>
//       );
//     } else {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-50 text-yellow-600 border-yellow-200 flex items-center gap-1">
//           <AlertCircle className="w-3 h-3" />
//           Pending
//         </span>
//       );
//     }
//   };

//   const formatDateTime = (dateString) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const handleViewDetails = (candidate) => {
//     setSelectedCandidate(candidate);
//     setShowHistory(true);
//   };

//   const handleViewApplication = (application) => {
//     setSelectedApplication(application);
//     setShowApplication(true);
//     setResumeView('extracted');
//   };

//   const parseExtractedResume = (resumeText) => {
//     if (!resumeText) return null;
    
//     const sections = {
//       personalDetails: [],
//       skills: [],
//       experience: [],
//       education: [],
//       certifications: [],
//       projects: [],
//       achievements: []
//     };
  
//     const lines = resumeText.split('\n');
//     let currentSection = '';
  
//     lines.forEach(line => {
//       const trimmedLine = line.trim();
      
//       if (trimmedLine.startsWith('### Personal Details')) {
//         currentSection = 'personalDetails';
//       } else if (trimmedLine.startsWith('### Skills')) {
//         currentSection = 'skills';
//       } else if (trimmedLine.startsWith('### Experience')) {
//         currentSection = 'experience';
//       } else if (trimmedLine.startsWith('### Education')) {
//         currentSection = 'education';
//       } else if (trimmedLine.startsWith('### Certifications')) {
//         currentSection = 'certifications';
//       } else if (trimmedLine.startsWith('### Projects')) {
//         currentSection = 'projects';
//       } else if (trimmedLine.startsWith('### Achievements')) {
//         currentSection = 'achievements';
//       } else if (currentSection && trimmedLine) {
//         // Check if this is a main bullet point (starts with "- " at beginning of line)
//         if (line.startsWith('- ')) {
//           // This is a main bullet point
//           sections[currentSection].push(trimmedLine.substring(1).trim());
//         } else if (line.startsWith(' - ') && (currentSection === 'projects' || currentSection === 'experience')) {
//           // This is a sub-bullet point for projects/experience
//           if (sections[currentSection].length > 0) {
//             const lastIndex = sections[currentSection].length - 1;
//             sections[currentSection][lastIndex] += '\n' + trimmedLine;
//           }
//         } else if (trimmedLine.startsWith('-') && currentSection !== 'projects' && currentSection !== 'experience') {
//           // Handle other sections with normal bullet points
//           sections[currentSection].push(trimmedLine.substring(1).trim());
//         } else if (currentSection && trimmedLine && !trimmedLine.startsWith('###')) {
//           // Handle other content
//           if (currentSection === 'projects' || currentSection === 'experience') {
//             // For projects and experience, append to last item if it exists
//             if (sections[currentSection].length > 0) {
//               const lastIndex = sections[currentSection].length - 1;
//               sections[currentSection][lastIndex] += '\n' + trimmedLine;
//             } else {
//               sections[currentSection].push(trimmedLine);
//             }
//           } else {
//             // For other sections, add as separate items
//             sections[currentSection].push(trimmedLine);
//           }
//         }
//       }
//     });
  
//     return sections;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header viewerType="owner" />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header viewerType="owner" />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
//             Error: {error}
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   const sortedData = [...leaderboardData].sort(
//     (a, b) => (b.score || 0) - (a.score || 0)
//   );

//   // Enhanced project parsing function that extracts project names more accurately
// const parseProjectName = (projectText) => {
//   if (!projectText) return 'Unnamed Project';
  
//   const firstLine = projectText.split('\n')[0];
  
//   // Try different patterns to extract project name
  
//   // Pattern 1: ProjectName (GitHub) | Tech Stack (Year)
//   let match = firstLine.match(/^(.+?)\s*\(GitHub\)/);
//   if (match) {
//     return match[1].trim();
//   }
  
//   // Pattern 2: ProjectName | Tech Stack (Year)
//   match = firstLine.match(/^(.+?)\s*\|/);
//   if (match) {
//     return match[1].trim();
//   }
  
//   // Pattern 3: ProjectName - Description
//   match = firstLine.match(/^(.+?)\s*[-–]/);
//   if (match) {
//     return match[1].trim();
//   }
  
//   // Pattern 4: Just take the first part before any special characters
//   match = firstLine.match(/^([^|\-–(]+)/);
//   if (match) {
//     return match[1].trim();
//   }
  
//   // Fallback: return the first line trimmed
//   return firstLine.trim();
// };


//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       <Header viewerType="owner" />
      
//       <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
//         {/* Header */}
//         <div className={`transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 mb-8 p-8 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-shimmer"></div>
            
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
//                   <Trophy className="w-10 h-10 text-yellow-500" />
//                   Interview Leaderboard
//                 </h1>
//                 <p className="text-gray-600 text-lg">
//                   Performance rankings for all candidates
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-purple-600 font-medium">Total Candidates</p>
//                 <p className="text-4xl font-bold text-purple-600">
//                   {sortedData.length}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Leaderboard Table */}
//         <div className={`transform transition-all duration-1000 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden relative">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-shimmer"></div>
            
//             <div className="px-8 py-6 bg-gray-50/80 border-b border-gray-200/50">
//               <h2 className="text-2xl font-semibold text-gray-900">Rankings</h2>
//             </div>

//             {sortedData.length === 0 ? (
//               <div className="p-12 text-center text-gray-500">
//                 <User className="w-16 h-16 mx-auto mb-6 text-gray-400" />
//                 <p className="text-lg">No candidates found for this interview.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200/50">
//                   <thead className="bg-gray-50/80">
//                     <tr>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">
//                         Rank
//                       </th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">
//                         Candidate
//                       </th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">
//                         Score
//                       </th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">
//                         Start Time
//                       </th>

//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200/30">
//                     {sortedData.map((candidate, index) => (
//                       <tr
//                         key={candidate.id}
//                         className={`hover:bg-gray-50/50 transition-colors ${
//                           index < 3 ? "bg-gradient-to-r from-purple-50/50 to-transparent" : ""
//                         }`}
//                       >
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className="flex items-center">
//                             {getRankIcon(index + 1)}
//                             <span className="ml-3 text-lg font-bold text-gray-900">
//                               #{index + 1}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-12 w-12">
//                               <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
//                                 <User className="w-6 h-6 text-white" />
//                               </div>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-lg font-semibold text-gray-900">
//                                 {candidate.Application?.user?.username ||
//                                   "Anonymous"}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 ID: {candidate.Application?.id}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div
//                             className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border ${getScoreColor(
//                               candidate.score || 0
//                             )}`}
//                           >
//                             {candidate.score
//                               ? candidate.score.toFixed(1)
//                               : "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           {getStatusBadge(candidate.status)}
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
//                           <div className="flex items-center">
//                             <Calendar className="w-5 h-5 mr-2 text-purple-500" />
//                             {formatDateTime(candidate.start_time)}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => handleViewDetails(candidate)}
//                               className="text-blue-600 hover:text-blue-700 flex items-center gap-2 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
//                             >
//                               <Eye className="w-4 h-4" />
//                               Interview
//                             </button>
//                             <button
//                               onClick={() => handleViewApplication(candidate.Application)}
//                               className="text-green-600 hover:text-green-700 flex items-center gap-2 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200 border border-green-200 hover:border-green-300"
//                             >
//                               <FileText className="w-4 h-4" />
//                               Application
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Performance Insights */}
//         {sortedData.length > 0 && (
//           <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-green-50 rounded-xl border border-green-200">
//                   <TrendingUp className="w-8 h-8 text-green-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-green-600 uppercase tracking-wider">
//                     Highest Score
//                   </p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {Math.max(...sortedData.map((c) => c.score || 0)).toFixed(1)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
//                   <Trophy className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">
//                     Average Score
//                   </p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {(
//                       sortedData.reduce((sum, c) => sum + (c.score || 0), 0) /
//                       sortedData.length
//                     ).toFixed(1)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
//                   <User className="w-8 h-8 text-purple-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">
//                     Completed
//                   </p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {
//                       sortedData.filter((c) => c.status === "completed").length
//                     }
//                     <span className="text-xl text-gray-500">/{sortedData.length}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Interview Details Modal */}
//       {showHistory && selectedCandidate && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
//             <div className="sticky top-0 bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Interview Details - {selectedCandidate.Application?.user?.username}
//               </h3>
//               <button
//                 onClick={() => setShowHistory(false)}
//                 className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-6 space-y-6 text-gray-700">
//               <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border border-gray-200">
//                 <div>
//                   <p className="text-sm text-gray-500">Final Score</p>
//                   <p className="text-xl font-bold text-blue-600">
//                     {selectedCandidate.score?.toFixed(1) || "N/A"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Status</p>
//                   <p className="mt-1">{getStatusBadge(selectedCandidate.status)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Recommendation</p>
//                   <p className="text-sm font-medium">
//                     {selectedCandidate.recommendation || "N/A"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Duration</p>
//                   <p className="text-sm font-medium">
//                     {selectedCandidate.start_time && selectedCandidate.end_time
//                       ? `${Math.round(
//                           (new Date(selectedCandidate.end_time) -
//                             new Date(selectedCandidate.start_time)) /
//                             (1000 * 60)
//                         )} min`
//                       : "In Progress"}
//                   </p>
//                 </div>
//               </div>

//               {selectedCandidate.feedback && (
//                 <div>
//                   <h4 className="text-md font-semibold text-gray-900 mb-2">Overall Feedback</h4>
//                   <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
//                     <p className="text-sm text-gray-700">{selectedCandidate.feedback}</p>
//                   </div>
//                 </div>
//               )}

//               {selectedCandidate.strengths && (
//                 <div>
//                   <h4 className="text-md font-semibold text-gray-900 mb-2">Strengths</h4>
//                   <div className="bg-green-50 border-l-4 border-green-500 p-4">
//                     <p className="text-sm text-gray-700">{selectedCandidate.strengths}</p>
//                   </div>
//                 </div>
//               )}

//               {selectedCandidate.session && selectedCandidate.session.length > 0 && (
//                 <div>
//                   <h4 className="text-md font-semibold text-gray-900 mb-4">Question-wise Performance</h4>
//                   <div className="space-y-4">
//                     {selectedCandidate.session.map((item, index) => (
//                       <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
//                         <div className="flex justify-between items-start mb-3">
//                           <h5 className="font-medium text-gray-900">
//                             Question {index + 1}
//                           </h5>
//                           {item.score && (
//                             <span
//                               className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(
//                                 item.score
//                               )}`}
//                             >
//                               {item.score.toFixed(1)}
//                             </span>
//                           )}
//                         </div>

//                         <div className="space-y-3">
//                           <div>
//                             <p className="text-sm font-medium text-purple-600">Main Question:</p>
//                             <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
//                               {item.Customquestion?.question}
//                             </p>
//                           </div>

//                           {item.Customquestion?.answer && (
//                             <div>
//                               <p className="text-sm font-medium text-purple-600">Expected Answer:</p>
//                               <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
//                                 {item.Customquestion.answer}
//                               </p>
//                             </div>
//                           )}

//                           {item.followups && item.followups.length > 0 && (
//                             <div>
//                               <p className="text-sm font-medium text-purple-600 mb-2">
//                                 Follow-up Questions:
//                               </p>
//                               <div className="space-y-2">
//                                 {item.followups.map((qa, qaIndex) => (
//                                   <div key={qaIndex} className="bg-white p-3 rounded border border-gray-200">
//                                     <p className="text-sm font-medium text-blue-600">
//                                       Q: {qa.question}
//                                     </p>
//                                     <p className="text-sm text-gray-700 mt-1">
//                                       A: {qa.answer}
//                                     </p>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}

//                           {item.feedback && (
//                             <div>
//                               <p className="text-sm font-medium text-purple-600">Feedback:</p>
//                               <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border border-yellow-200">
//                                 {item.feedback}
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Application Details Modal */}
//       {showApplication && selectedApplication && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
//             <div className="sticky top-0 bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setShowApplication(false)}
//                   className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <ArrowLeft className="w-5 h-5" />
//                 </button>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Application Details - {selectedApplication.user?.username}
//                 </h3>
//               </div>
//               <button
//                 onClick={() => setShowApplication(false)}
//                 className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-6">
//               {/* Application Summary */}
//               <div className="bg-gray-50/80 rounded-xl p-6 mb-6 border border-gray-200/50">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <User className="w-8 h-8 text-white" />
//                     </div>
//                     <h4 className="text-lg font-semibold text-gray-900">{selectedApplication.user?.username}</h4>
//                     <p className="text-sm text-gray-500">Application ID: {selectedApplication.id}</p>
//                   </div>
                  
//                   <div className="text-center">
//                     <div className="mb-3">
//                       <Star className="w-8 h-8 text-yellow-500 mx-auto" />
//                     </div>
//                     <p className="text-sm text-gray-500">Application Score</p>
//                     <p className="text-2xl font-bold text-yellow-500">
//                       {selectedApplication.score?.toFixed(1) || "N/A"}
//                     </p>
//                   </div>
                  
//                   <div className="text-center">
//                     <div className="mb-3">
//                       <Calendar className="w-8 h-8 text-blue-500 mx-auto" />
//                     </div>
//                     <p className="text-sm text-gray-500">Applied On</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {formatDateTime(selectedApplication.applied_at)}
//                     </p>
//                   </div>
                  
//                   <div className="text-center">
//                     <div className="mb-3">
//                       <Target className="w-8 h-8 text-green-500 mx-auto" />
//                     </div>
//                     <p className="text-sm text-gray-500">Decision</p>
//                     <div className="flex justify-center mt-2">
//                       {getDecisionBadge(selectedApplication.shortlisting_decision)}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Application Feedback */}
//               {selectedApplication.feedback && (
//                 <div className="bg-gray-50/80 rounded-xl p-6 mb-6 border border-gray-200/50">
//                   <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                     <BookOpen className="w-5 h-5 text-purple-500" />
//                     Application Feedback
//                   </h4>
//                   <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
//                     <p className="text-gray-700 leading-relaxed">{selectedApplication.feedback}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Resume Toggle */}
//               <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-200/50">
//                 <div className="flex items-center justify-between mb-6">
//                   <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     <FileText className="w-5 h-5 text-green-500" />
//                     Resume
//                   </h4>
//                   <div className="flex bg-gray-200/50 rounded-lg p-1">
//                     <button
//                       onClick={() => setResumeView('extracted')}
//                       className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                         resumeView === 'extracted'
//                           ? 'bg-purple-600 text-white shadow-lg'
//                           : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
//                       }`}
//                     >
//                       Extracted Resume
//                     </button>
//                     <button
//                       onClick={() => setResumeView('original')}
//                       className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                         resumeView === 'original'
//                           ? 'bg-purple-600 text-white shadow-lg'
//                           : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
//                       }`}
//                     >
//                       Original Resume
//                     </button>
//                   </div>
//                 </div>

//                 {resumeView === 'extracted' ? (
//                   <div className="space-y-8">
//                     {(() => {
//                       const resumeData = parseExtractedResume(selectedApplication.extratedResume);
//                       if (!resumeData) return (
//                         <div className="flex items-center justify-center py-16">
//                           <div className="text-center">
//                             <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                               <User className="w-8 h-8 text-gray-400" />
//                             </div>
//                             <p className="text-gray-500 text-lg">No extracted resume data available.</p>
//                           </div>
//                         </div>
//                       );

//                       return (
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                           {/* Personal Details */}
//                           {resumeData.personalDetails.length > 0 && (
//                             <div className="group relative bg-white/60 rounded-xl p-6 border border-gray-200/50 backdrop-blur-sm hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
//                               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                               <div className="relative z-10">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
//                                     <User className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors duration-300">
//                                     Personal Details
//                                   </h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.personalDetails.map((detail, index) => (
//                                     <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-200">
//                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
//                                       <p className="text-gray-700 text-sm leading-relaxed hover:text-gray-900 transition-colors duration-200">
//                                         {detail}
//                                       </p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {/* Skills */}
//                           {resumeData.skills.length > 0 && (
//                             <div className="group relative bg-white/60 rounded-xl p-6 border border-gray-200/50 backdrop-blur-sm hover:border-green-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
//                               <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                               <div className="relative z-10">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
//                                     <Code className="w-5 h-5 text-green-600 group-hover:text-green-700" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-green-800 transition-colors duration-300">
//                                     Skills
//                                   </h5>
//                                 </div>
//                                 <div className="flex flex-wrap gap-2">
//                                   {resumeData.skills.map((skill, index) => (
//                                     <div key={index} className="px-3 py-2 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 hover:bg-green-100 transition-all duration-200 group/skill">
//                                       <p className="text-green-700 text-sm font-medium group-hover/skill:text-green-800 transition-colors duration-200">
//                                         {skill}
//                                       </p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {/* Experience */}
//                           {resumeData.experience.length > 0 && (
//                             <div className="group relative bg-white/60 rounded-xl p-6 border border-gray-200/50 backdrop-blur-sm hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 lg:col-span-2">
//                               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                               <div className="relative z-10">
//                                 <div className="flex items-center gap-3 mb-6">
//                                   <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
//                                     <Briefcase className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-purple-800 transition-colors duration-300">
//                                     Experience
//                                   </h5>
//                                 </div>
//                                 <div className="space-y-4">
//                                   {resumeData.experience.map((exp, index) => (
//                                     <div key={index} className="relative pl-6 pb-4 last:pb-0">
//                                       {index < resumeData.experience.length - 1 && (
//                                         <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gradient-to-b from-purple-400/50 to-transparent"></div>
//                                       )}
//                                       <div className="absolute left-0 top-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg shadow-purple-500/30"></div>
//                                       <div className="bg-white/80 rounded-lg p-5 border border-gray-200/50 hover:border-purple-300/50 hover:bg-white/90 transition-all duration-300">
//                                         <p className="text-gray-700 text-sm leading-relaxed hover:text-gray-900 transition-colors duration-200">{exp}</p>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {/* Education */}
//                           {resumeData.education.length > 0 && (
//                             <div className="group relative bg-white/60 rounded-xl p-6 border border-gray-200/50 backdrop-blur-sm hover:border-yellow-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
//                               <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                               <div className="relative z-10">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors duration-300">
//                                     <GraduationCap className="w-5 h-5 text-yellow-600 group-hover:text-yellow-700" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-yellow-800 transition-colors duration-300">
//                                     Education
//                                   </h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.education.map((edu, index) => (
//                                     <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50/80 border border-yellow-200/50 hover:border-yellow-300/50 hover:bg-yellow-100/80 transition-all duration-200">
//                                       <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
//                                       <p className="text-gray-700 text-sm leading-relaxed hover:text-gray-900 transition-colors duration-200">
//                                         {edu}
//                                       </p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {/* Certifications */}
//                           {resumeData.certifications.length > 0 && (
//                             <div className="group relative bg-white/60 rounded-xl p-6 border border-gray-200/50 backdrop-blur-sm hover:border-orange-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
//                               <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                               <div className="relative z-10">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
//                                     <AwardIcon className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-orange-800 transition-colors duration-300">
//                                     Certifications
//                                   </h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.certifications.map((cert, index) => (
//                                     <div key={index} className="relative overflow-hidden">
//                                       <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 via-orange-50/50 to-transparent rounded-lg"></div>
//                                       <div className="relative p-4 rounded-lg border border-orange-200/50 hover:border-orange-300/50 transition-all duration-200 hover:shadow-md hover:shadow-orange-500/10">
//                                         <p className="text-gray-700 text-sm leading-relaxed hover:text-gray-900 transition-colors duration-200">
//                                           {cert}
//                                         </p>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {/* Projects */}
//                           {resumeData.projects.length > 0 && (
//                             <div className="group relative bg-white/60 rounded-xl p-6 border border-gray-200/50 backdrop-blur-sm hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 lg:col-span-2">
//                               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                               <div className="relative z-10">
//                                 <div className="flex items-center justify-between mb-6">
//                                   <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition-colors duration-300">
//                                       <Code className="w-5 h-5 text-cyan-600 group-hover:text-cyan-700" />
//                                     </div>
//                                     <h5 className="text-xl font-bold text-gray-900 group-hover:text-cyan-800 transition-colors duration-300">
//                                       Projects
//                                     </h5>
//                                   </div>
//                                   <div className="flex items-center gap-2 text-xs text-gray-500">
//                                     <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
//                                     <span>{resumeData.projects.length} Projects</span>
//                                   </div>
//                                 </div>
                                
//                                 <div className="relative">
//                                   {/* Timeline Line */}
//                                   <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/60 via-cyan-400/40 to-cyan-400/20 rounded-full"></div>
                                  
//                                   <div className="space-y-8">
//                                     {resumeData.projects.map((project, index) => {
//                                       // Parse project data
//                                       const lines = project.split('\n').filter(line => line.trim());
//                                       const firstLine = lines[0] || '';
                                      
//                                       // Extract project name using the enhanced function
//                                       const projectName = parseProjectName(firstLine);
                                      
//                                       // Extract tech stack and year
//                                       const projectMatch = firstLine.match(/\|\s*(.+?)\s*\((\d{4})\)/);
//                                       const techStack = projectMatch ? projectMatch[1].split(',').map(t => t.trim()) : [];
//                                       const year = projectMatch ? projectMatch[2] : new Date().getFullYear();
                                      
//                                       // Extract description lines (lines starting with spaces or dashes after first line)
//                                       const descriptionLines = lines.slice(1).filter(line => line.trim().startsWith('-') || line.trim().match(/^\s/));
                                      
//                                       return (
//                                         <div key={index} className="relative flex gap-6 group/project">
//                                           {/* Timeline Node */}
//                                           <div className="relative flex-shrink-0">
//                                             <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center border-2 border-cyan-300 shadow-lg shadow-cyan-500/20 group-hover/project:border-cyan-400 group-hover/project:shadow-cyan-500/30 transition-all duration-300">
//                                               <Code className="w-5 h-5 text-cyan-600 group-hover/project:text-cyan-700" />
//                                             </div>
//                                             <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
//                                           </div>

//                                           {/* Project Content */}
//                                           <div className="flex-1 pb-4">
//                                             {/* Project Header */}
//                                             <div className="flex items-start justify-between mb-3">
//                                               <div className="flex-1">
//                                                 <div className="flex items-center gap-3 mb-2">
//                                                   <h6 className="text-gray-900 font-bold text-xl group-hover/project:text-cyan-800 transition-colors duration-300">
//                                                     {projectName}
//                                                   </h6>
//                                                   <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full border border-gray-200">
//                                                     <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
//                                                       <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
//                                                     </svg>
//                                                     <span className="text-gray-500 text-xs">GitHub</span>
//                                                   </div>
//                                                   {year !== new Date().getFullYear() && (
//                                                     <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md border border-purple-200">
//                                                       {year}
//                                                     </div>
//                                                   )}
//                                                 </div>
                                                
//                                                 {/* Tech Stack */}
//                                                 {techStack.length > 0 && (
//                                                   <div className="flex flex-wrap gap-2 mb-4">
//                                                     {techStack.slice(0, 8).map((tech, techIndex) => (
//                                                       <span key={techIndex} className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-lg border border-cyan-200 hover:border-cyan-300 hover:bg-cyan-100 transition-all duration-200 font-medium">
//                                                         {tech}
//                                                       </span>
//                                                     ))}
//                                                     {techStack.length > 8 && (
//                                                       <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg border border-gray-200 font-medium">
//                                                         +{techStack.length - 8} more
//                                                       </span>
//                                                     )}
//                                                   </div>
//                                                 )}
//                                               </div>
//                                             </div>

//                                             {/* Project Description */}
//                                             <div className="relative bg-gray-50/60 rounded-lg p-4 border border-gray-200/50 group-hover/project:border-cyan-300/50 group-hover/project:bg-gray-100/60 transition-all duration-300">
//                                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-r-full opacity-60 group-hover/project:opacity-100 transition-opacity duration-300"></div>
//                                               <div className="pl-4">
//                                                 {descriptionLines.length > 0 ? (
//                                                   <div className="space-y-3">
//                                                     {descriptionLines.slice(0, 5).map((desc, descIndex) => (
//                                                       <div key={descIndex} className="flex items-start gap-3">
//                                                         <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0 group-hover/project:bg-cyan-600 transition-colors duration-300"></div>
//                                                         <p className="text-gray-700 text-sm leading-relaxed group-hover/project:text-gray-900 transition-colors duration-300">
//                                                           {desc.replace(/^[-\s]+/, '').trim()}
//                                                         </p>
//                                                       </div>
//                                                     ))}
//                                                     {descriptionLines.length > 5 && (
//                                                       <div className="flex items-center gap-3 pt-2 border-t border-gray-200/50">
//                                                         <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
//                                                         <span className="text-gray-500 text-xs font-medium">
//                                                           +{descriptionLines.length - 5} additional features
//                                                         </span>
//                                                       </div>
//                                                     )}
//                                                   </div>
//                                                 ) : (
//                                                   <p className="text-gray-700 text-sm leading-relaxed group-hover/project:text-gray-900 transition-colors duration-300 pl-4">
//                                                     {project.replace(/^[-\s]*/, '').trim()}
//                                                   </p>
//                                                 )}
//                                               </div>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       );
//                                     })}
//                                   </div>
//                                 </div>
                                
//                               </div>
//                             </div>
//                           )}

//                           {/* Achievements */}
//                           {resumeData.achievements.length > 0 && (
//                             <div className="group relative bg-white/60 rounded-xl p-6 border border-gray-200/50 backdrop-blur-sm hover:border-amber-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 lg:col-span-2">
//                               <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                               <div className="relative z-10">
//                                 <div className="flex items-center gap-3 mb-6">
//                                   <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors duration-300">
//                                     <Trophy className="w-5 h-5 text-amber-600 group-hover:text-amber-700" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-amber-800 transition-colors duration-300">
//                                     Achievements
//                                   </h5>
//                                 </div>
//                                 <div className="space-y-4">
//                                   {resumeData.achievements.map((achievement, index) => (
//                                     <div key={index} className="relative group/achievement">
//                                       <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full opacity-60 group-hover/achievement:opacity-100 transition-opacity duration-300"></div>
//                                       <div className="relative ml-6 bg-white/80 rounded-lg p-4 border border-gray-200/50 hover:border-amber-300/50 hover:bg-white/90 transition-all duration-300">
//                                         <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-500 rounded-full opacity-50 group-hover/achievement:opacity-100 group-hover/achievement:scale-125 transition-all duration-300"></div>
//                                         <p className="text-gray-700 text-sm leading-relaxed hover:text-gray-900 transition-colors duration-200 pr-4">{achievement}</p>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })()}
//                   </div>
//                 ) : (
//                   <div className="bg-gray-100/50 rounded-lg p-6 border border-gray-200/50">
                    
//                     {selectedApplication.resume ? (
//                       <div className="bg-white/80 rounded-lg p-4 border border-gray-200/50">
//                         <div className="flex justify-between items-center mb-4">
//                           <p className="text-gray-700 text-sm">
//                             View the embedded resume or click download to access the original PDF.
//                           </p>
//                         </div>

//                         <div className="aspect-[4/5] bg-white rounded-lg border border-gray-300 overflow-hidden">
//                           <iframe
//                             src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedApplication.resume)}&embedded=true`}
//                             className="w-full h-full"
//                             frameBorder="0"
//                             title="Resume PDF"
//                           ></iframe>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-white/80 rounded-lg p-8 border border-gray-200/50 text-center">
//                         <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500">No original resume available</p>
//                       </div>
//                     )}

//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />

//       <style jsx>{`
//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }
//         .animate-shimmer {
//           animation: shimmer 3s infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Leaderboard;
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/ui/header";
// import Footer from "../components/ui/footer";
// import { useNavigate } from "react-router-dom";
// import {
//   Trophy,
//   Medal,
//   Award,
//   User,
//   Calendar,
//   Clock,
//   TrendingUp,
//   Eye,
//   FileText,
//   Download,
//   ArrowLeft,
//   Star,
//   BookOpen,
//   Briefcase,
//   GraduationCap,
//   Code,
//   Award as AwardIcon,
//   Target,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   LayoutDashboard,
//   MessageSquare,
//   FileCode,
//   BarChart2,
// } from "lucide-react";
// import { getAuthToken } from "../utils/handleToken";

// const Leaderboard = () => {
//   const { id: interviewId } = useParams();
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [showHistory, setShowHistory] = useState(false);
//   const [showApplication, setShowApplication] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [resumeView, setResumeView] = useState('extracted');
//   const [visible, setVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     fetchLeaderboardData();
//     setTimeout(() => setVisible(true), 100);
//   }, [interviewId]);

//   const fetchLeaderboardData = async () => {
//     try {
//       const token = getAuthToken();
//       const API_URL = import.meta.env.VITE_API_URL;
//       const response = await fetch(
//         `${API_URL}/interview/leaderboard/${interviewId}/`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch leaderboard data");
//       }

//       const data = await response.json();
//       console.log("API Response:", data); // Debug API response
//       setLeaderboardData(Array.isArray(data) ? data : data.data || []);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const getRankIcon = (rank) => {
//     switch (rank) {
//       case 1:
//         return <Trophy className="w-6 h-6 text-yellow-500" />;
//       case 2:
//         return <Medal className="w-6 h-6 text-gray-500" />;
//       case 3:
//         return <Award className="w-6 h-6 text-amber-600" />;
//       default:
//         return (
//           <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">
//             {rank}
//           </span>
//         );
//     }
//   };

//   const getScoreColor = (score) => {
//     if (typeof score !== 'number') return "text-gray-600 bg-gray-100 border-gray-200";
//     if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
//     if (score >= 60) return "text-yellow-600 bg-yellow-100 border-yellow-200";
//     if (score >= 40) return "text-orange-600 bg-orange-100 border-orange-200";
//     return "text-red-600 bg-red-100 border-red-200";
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       completed: "bg-green-100 text-green-700 border-green-200",
//       ongoing: "bg-blue-100 text-blue-700 border-blue-200",
//       scheduled: "bg-gray-100 text-gray-700 border-gray-200",
//       cancelled: "bg-red-100 text-red-700 border-red-200",
//       cheated: "bg-red-100 text-red-700 border-red-200",
//     };
//     const colorClass = statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200";
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
//         {status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A"}
//       </span>
//     );
//   };

//   const getDecisionBadge = (decision) => {
//     if (decision === true) {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
//           <CheckCircle className="w-3 h-3" />
//           Approved
//         </span>
//       );
//     } else if (decision === false) {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
//           <XCircle className="w-3 h-3" />
//           Rejected
//         </span>
//       );
//     } else {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
//           <AlertCircle className="w-3 h-3" />
//           Pending
//         </span>
//       );
//     }
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const handleViewDetails = (candidate) => {
//     console.log("Selected Candidate:", candidate); // Debug selected candidate
//     setSelectedCandidate(candidate);
//     setActiveTab('overview');
//     setShowHistory(true);
//   };

//   const handleViewApplication = (application) => {
//     console.log("Selected Application:", application); // Debug selected application
//     setSelectedApplication(application);
//     setShowApplication(true);
//     setResumeView('extracted');
//   };

//   const parseExtractedResume = (resumeText) => {
//     if (!resumeText) return null;
//     const sections = {
//       personalDetails: [],
//       skills: [],
//       experience: [],
//       education: [],
//       certifications: [],
//       projects: [],
//       achievements: [],
//     };
//     const lines = resumeText.split('\n');
//     let currentSection = '';
//     lines.forEach((line) => {
//       const trimmedLine = line.trim();
//       if (trimmedLine.startsWith('### Personal Details')) {
//         currentSection = 'personalDetails';
//       } else if (trimmedLine.startsWith('### Skills')) {
//         currentSection = 'skills';
//       } else if (trimmedLine.startsWith('### Experience')) {
//         currentSection = 'experience';
//       } else if (trimmedLine.startsWith('### Education')) {
//         currentSection = 'education';
//       } else if (trimmedLine.startsWith('### Certifications')) {
//         currentSection = 'certifications';
//       } else if (trimmedLine.startsWith('### Projects')) {
//         currentSection = 'projects';
//       } else if (trimmedLine.startsWith('### Achievements')) {
//         currentSection = 'achievements';
//       } else if (currentSection && trimmedLine) {
//         if (line.startsWith('- ')) {
//           sections[currentSection].push(trimmedLine.substring(1).trim());
//         } else if (line.startsWith(' - ') && (currentSection === 'projects' || currentSection === 'experience')) {
//           if (sections[currentSection].length > 0) {
//             const lastIndex = sections[currentSection].length - 1;
//             sections[currentSection][lastIndex] += '\n' + trimmedLine;
//           }
//         } else if (trimmedLine.startsWith('-') && currentSection !== 'projects' && currentSection !== 'experience') {
//           sections[currentSection].push(trimmedLine.substring(1).trim());
//         } else if (currentSection && trimmedLine && !trimmedLine.startsWith('###')) {
//           if (currentSection === 'projects' || currentSection === 'experience') {
//             if (sections[currentSection].length > 0) {
//               const lastIndex = sections[currentSection].length - 1;
//               sections[currentSection][lastIndex] += '\n' + trimmedLine;
//             } else {
//               sections[currentSection].push(trimmedLine);
//             }
//           } else {
//             sections[currentSection].push(trimmedLine);
//           }
//         }
//       }
//     });
//     return sections;
//   };

//   const parseProjectName = (projectText) => {
//     if (!projectText) return 'Unnamed Project';
//     const firstLine = projectText.split('\n')[0];
//     let match = firstLine.match(/^(.+?)\s*\(GitHub\)/) ||
//                 firstLine.match(/^(.+?)\s*\|/) ||
//                 firstLine.match(/^(.+?)\s*[-–]/) ||
//                 firstLine.match(/^([^|\-–(]+)/);
//     return match ? match[1].trim() : firstLine.trim();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Header viewerType="owner" />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Header viewerType="owner" />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-md">
//             Error: {error}
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   const sortedData = [...leaderboardData].sort((a, b) => (b.score || 0) - (a.score || 0));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
//       <Header viewerType="owner" />
//       <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
//         {/* Header */}
//         <div className={`transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mb-8 p-8 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-shimmer"></div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
//                   <Trophy className="w-10 h-10 text-yellow-500" />
//                   Interview Leaderboard
//                 </h1>
//                 <p className="text-gray-600 text-lg">Performance rankings for all candidates</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-purple-600 font-medium">Total Candidates</p>
//                 <p className="text-4xl font-bold text-purple-600">{sortedData.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Leaderboard Table */}
//         <div className={`transform transition-all duration-1000 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden relative">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-shimmer"></div>
//             <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
//               <h2 className="text-2xl font-semibold text-gray-900">Rankings</h2>
//             </div>
//             {sortedData.length === 0 ? (
//               <div className="p-12 text-center text-gray-500">
//                 <User className="w-16 h-16 mx-auto mb-6 text-gray-400" />
//                 <p className="text-lg">No candidates found for this interview.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Rank</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Candidate</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Score</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Status</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Start Time</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {sortedData.map((candidate, index) => (
//                       <tr
//                         key={candidate.id}
//                         className={`hover:bg-gray-50 transition-colors duration-300 ${index < 3 ? "bg-gradient-to-r from-purple-50 to-transparent" : ""}`}
//                       >
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className="flex items-center">
//                             {getRankIcon(index + 1)}
//                             <span className="ml-3 text-lg font-bold text-gray-900">#{index + 1}</span>
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-12 w-12">
//                               <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
//                                 <User className="w-6 h-6 text-white" />
//                               </div>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-lg font-semibold text-gray-900">
//                                 {candidate.Application?.user?.username || "Anonymous"}
//                               </div>
//                               <div className="text-sm text-gray-500">ID: {candidate.Application?.id}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border shadow-sm ${getScoreColor(candidate.score || 0)}`}>
//                             {console.log(candidate.score)} {typeof candidate.score === 'number' ? candidate.score.toFixed(1) : "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">{getStatusBadge(candidate.status)}</td>
//                         <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
//                           <div className="flex items-center">
//                             <Calendar className="w-5 h-5 mr-2 text-purple-500" />
//                             {formatDateTime(candidate.start_time)}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
//                           <div className="flex gap-3">
//                             <button
//                               onClick={() => handleViewDetails(candidate)}
//                               className="text-blue-600 hover:text-blue-800 flex items-center gap-2 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-md"
//                             >
//                               <Eye className="w-4 h-4" />
//                               Interview
//                             </button>
//                             <button
//                               onClick={() => handleViewApplication(candidate.Application)}
//                               className="text-green-600 hover:text-green-800 flex items-center gap-2 hover:bg-green-100 px-4 py-2 rounded-lg transition-all duration-300 border border-green-200 hover:border-green-300 hover:shadow-md"
//                             >
//                               <FileText className="w-4 h-4" />
//                               Application
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Performance Insights */}
//         {sortedData.length > 0 && (
//           <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-green-100 rounded-xl border border-green-200">
//                   <TrendingUp className="w-8 h-8 text-green-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Highest Score</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {Math.max(...sortedData.map((c) => c.score || 0)).toFixed(1)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
//                   <Trophy className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Average Score</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {(sortedData.reduce((sum, c) => sum + (c.score || 0), 0) / sortedData.length).toFixed(1)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-purple-100 rounded-xl border border-purple-200">
//                   <User className="w-8 h-8 text-purple-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Completed</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {sortedData.filter((c) => c.status === "completed").length}
//                     <span className="text-xl text-gray-500">/{sortedData.length}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Interview Details Modal */}
//         {showHistory && selectedCandidate && (
//           <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl">
//               <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-200 z-10">
//                 <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                   <LayoutDashboard className="w-5 h-5 text-purple-600" />
//                   Interview Details - {selectedCandidate.Application?.user?.username || "Anonymous"}
//                 </h3>
//                 <button
//                   onClick={() => setShowHistory(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Tabs */}
//               <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//                 <div className="flex gap-2 flex-wrap">
//                   {['overview', 'questions', 'dsa', 'resume_conversations'].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
//                         activeTab === tab
//                           ? 'bg-purple-600 text-white shadow-md'
//                           : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                       }`}
//                     >
//                       {tab === 'overview' && <LayoutDashboard className="w-4 h-4" />}
//                       {tab === 'questions' && <MessageSquare className="w-4 h-4" />}
//                       {tab === 'dsa' && <FileCode className="w-4 h-4" />}
//                       {tab === 'resume_conversations' && <BarChart2 className="w-4 h-4" />}
//                       {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-8 text-gray-700">
//                 {activeTab === 'overview' && (
//                   <div className="space-y-8">
//                     {/* Summary */}
//                     <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                       <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <LayoutDashboard className="w-5 h-5 text-purple-500" />
//                         Summary
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                         <div className="group relative text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Final Score</p>
//                           <div className={`inline-flex px-4 py-2 rounded-full text-xl font-bold border ${getScoreColor(selectedCandidate.score)} group-hover:scale-105 transition-transform duration-300`}>
//                             {typeof selectedCandidate.score === 'number' ? selectedCandidate.score.toFixed(1) : "N/A"}
//                           </div>
//                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                             <span className="text-xs text-gray-500 bg-white p-2 rounded-md shadow-md">Overall performance score</span>
//                           </div>
//                         </div>
//                         <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Status</p>
//                           <p className="mt-1">{getStatusBadge(selectedCandidate.status)}</p>
//                         </div>
//                         <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Recommendation</p>
//                           <p className="text-sm font-medium text-gray-900">{selectedCandidate.recommendation || "N/A"}</p>
//                         </div>
//                         <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Duration</p>
//                           <p className="text-sm font-medium text-gray-900">
//                             {selectedCandidate.start_time && selectedCandidate.end_time
//                               ? `${Math.round(
//                                   (new Date(selectedCandidate.end_time) - new Date(selectedCandidate.start_time)) / (1000 * 60)
//                                 )} min`
//                               : "In Progress"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Feedback */}
//                     {selectedCandidate.feedback ? (
//                       <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <BookOpen className="w-5 h-5 text-blue-500" />
//                           Overall Feedback
//                         </h4>
//                         <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
//                           <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.feedback}</p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No feedback available.</p>
//                       </div>
//                     )}

//                     {/* Strengths */}
//                     {selectedCandidate.strengths ? (
//                       <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <Star className="w-5 h-5 text-green-500" />
//                           Strengths
//                         </h4>
//                         <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
//                           <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.strengths}</p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No strengths available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === 'questions' && (
//                   <div className="space-y-8">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <MessageSquare className="w-5 h-5 text-purple-500" />
//                       Question-wise Performance
//                     </h4>
//                     {selectedCandidate.session && selectedCandidate.session.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedCandidate.session.map((item, index) => (
//                           <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//                             <div className="flex justify-between items-start mb-4">
//                               <h5 className="text-lg font-medium text-gray-900">Question {index + 1}</h5>
//                               {item.score && (
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(item.score)}`}>
//                                   {item.score.toFixed(1)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-4">
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Main Question:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {item.Customquestion?.question || "N/A"}
//                                 </p>
//                               </div>
//                               {item.Customquestion?.answer && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Expected Answer:</p>
//                                   <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                     {item.Customquestion.answer}
//                                   </p>
//                                 </div>
//                               )}
//                               {item.followups && item.followups.length > 0 && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-2">Follow-up Questions:</p>
//                                   <div className="space-y-3">
//                                     {item.followups.map((qa, qaIndex) => (
//                                       <div key={qaIndex} className="bg-gray-50 p-4 rounded-md border border-gray-200">
//                                         <p className="text-sm font-medium text-blue-600 mb-1">Q: {qa.question}</p>
//                                         <p className="text-sm text-gray-700">A: {qa.answer}</p>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               )}
//                               {item.feedback && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Feedback:</p>
//                                   <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
//                                     {item.feedback}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No question data available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === 'dsa' && (
//                   <div className="space-y-8">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <FileCode className="w-5 h-5 text-cyan-500" />
//                       DSA Topics
//                     </h4>
//                     {selectedCandidate.dsa && selectedCandidate.dsa.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedCandidate.dsa.map((dsa, index) => (
//                           <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//                             <div className="flex justify-between items-start mb-4">
//                               <h5 className="text-lg font-medium text-gray-900">
//                                 {dsa.topic?.topic} ({dsa.topic?.difficulty})
//                               </h5>
//                               {dsa.score && (
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(dsa.score)}`}>
//                                   {dsa.score.toFixed(1)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-4">
//                               {dsa.question && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Question:</p>
//                                   <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                     {dsa.question}
//                                   </p>
//                                 </div>
//                               )}
//                               {dsa.code && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Code:</p>
//                                   <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200 overflow-x-auto">
//                                     <code>{dsa.code}</code>
//                                   </pre>
//                                 </div>
//                               )}
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Created At:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {formatDateTime(dsa.created_at)}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No DSA topics available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === 'resume_conversations' && (
//                   <div className="space-y-8">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <BarChart2 className="w-5 h-5 text-blue-500" />
//                       Resume Conversations
//                     </h4>
//                     {selectedCandidate.resume_conversations && selectedCandidate.resume_conversations.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedCandidate.resume_conversations.map((conv, index) => (
//                           <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//                             <div className="flex justify-between items-start mb-4">
//                               <h5 className="text-lg font-medium text-gray-900">Conversation {index + 1}</h5>
//                               {conv.score && (
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(conv.score)}`}>
//                                   {conv.score.toFixed(1)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-4">
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Question:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {conv.question || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Expected Answer:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {conv.expected_answer || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Candidate Answer:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {conv.answer || "N/A"}
//                                 </p>
//                               </div>
//                               {conv.feedback && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Feedback:</p>
//                                   <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
//                                     {conv.feedback}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <BarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No resume conversations available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Application Details Modal */}
//         {showApplication && selectedApplication && (
//           <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
//               <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={() => setShowApplication(false)}
//                     className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                   </button>
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     Application Details - {selectedApplication.user?.username || "Anonymous"}
//                   </h3>
//                 </div>
//                 <button
//                   onClick={() => setShowApplication(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div className="p-6 space-y-8">
//                 {/* Application Summary */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                   <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                     <User className="w-5 h-5 text-purple-500" />
//                     Application Summary
//                   </h4>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                     <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
//                         <User className="w-6 h-6 text-white" />
//                       </div>
//                       <h5 className="text-lg font-semibold text-gray-900 mb-1">{selectedApplication.user?.username || "Anonymous"}</h5>
//                       <p className="text-sm text-gray-500">Application ID: {selectedApplication.id}</p>
//                     </div>
//                     <div className="group relative text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="mb-3">
//                         <Star className="w-8 h-8 text-yellow-500 mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-500 mb-1">Application Score</p>
//                       <div className={`inline-flex px-4 py-2 rounded-full text-xl font-bold border ${getScoreColor(selectedApplication.score)} group-hover:scale-105 transition-transform duration-300`}>
//                         {typeof selectedApplication.score === 'number' ? selectedApplication.score.toFixed(1) : "N/A"}
//                       </div>
//                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <span className="text-xs text-gray-500 bg-white p-2 rounded-md shadow-md">Application evaluation score</span>
//                       </div>
//                     </div>
//                     <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="mb-3">
//                         <Calendar className="w-8 h-8 text-blue-500 mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-500 mb-1">Applied On</p>
//                       <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedApplication.applied_at)}</p>
//                     </div>
//                     <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="mb-3">
//                         <Target className="w-8 h-8 text-green-500 mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-500 mb-1">Decision</p>
//                       <div className="flex justify-center mt-2">{getDecisionBadge(selectedApplication.shortlisting_decision)}</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Application Feedback */}
//                 {selectedApplication.feedback ? (
//                   <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                       <BookOpen className="w-5 h-5 text-blue-500" />
//                       Application Feedback
//                     </h4>
//                     <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
//                       <p className="text-gray-700 leading-relaxed">{selectedApplication.feedback}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                     <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-500 text-lg">No application feedback available.</p>
//                   </div>
//                 )}

//                 {/* Resume Section */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                   <div className="flex items-center justify-between mb-6">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <FileText className="w-5 h-5 text-green-500" />
//                       Resume
//                     </h4>
//                     <div className="flex bg-gray-200 rounded-lg p-1">
//                       <button
//                         onClick={() => setResumeView('extracted')}
//                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
//                           resumeView === 'extracted' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                         }`}
//                       >
//                         Extracted
//                       </button>
//                       <button
//                         onClick={() => setResumeView('original')}
//                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
//                           resumeView === 'original' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                         }`}
//                       >
//                         Original
//                       </button>
//                     </div>
//                   </div>
//                   {resumeView === 'extracted' ? (
//                     <div className="space-y-8">
//                       {(() => {
//                         const resumeData = parseExtractedResume(selectedApplication.extratedResume);
//                         if (!resumeData) {
//                           return (
//                             <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                               <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                               <p className="text-gray-500 text-lg">No extracted resume data available.</p>
//                             </div>
//                           );
//                         }
//                         return (
//                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             {resumeData.personalDetails.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
//                                     <User className="w-5 h-5 text-blue-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Personal Details</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.personalDetails.map((detail, index) => (
//                                     <div key={index} className="flex items-start gap-2 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
//                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
//                                       <p className="text-gray-700 text-sm leading-relaxed">{detail}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.skills.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-green-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
//                                     <Code className="w-5 h-5 text-green-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">Skills</h5>
//                                 </div>
//                                 <div className="flex flex-wrap gap-2">
//                                   {resumeData.skills.map((skill, index) => (
//                                     <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 hover:bg-green-200 transition-colors">
//                                       {skill}
//                                     </span>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.experience.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-300 lg:col-span-2">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
//                                     <Briefcase className="w-5 h-5 text-purple-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Experience</h5>
//                                 </div>
//                                 <div className="space-y-4">
//                                   {resumeData.experience.map((exp, index) => (
//                                     <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{exp}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.education.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-yellow-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
//                                     <GraduationCap className="w-5 h-5 text-yellow-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">Education</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.education.map((edu, index) => (
//                                     <div key={index} className="p-4 bg-yellow-50 rounded-md border border-yellow-200 hover:bg-yellow-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{edu}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.certifications.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-orange-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
//                                     <AwardIcon className="w-5 h-5 text-orange-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">Certifications</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.certifications.map((cert, index) => (
//                                     <div key={index} className="p-4 bg-orange-50 rounded-md border border-orange-200 hover:bg-orange-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{cert}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.projects.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-cyan-300 lg:col-span-2">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
//                                     <Code className="w-5 h-5 text-cyan-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">Projects</h5>
//                                 </div>
//                                 <div className="space-y-4">
//                                   {resumeData.projects.map((project, index) => {
//                                     const lines = project.split('\n').filter((line) => line.trim());
//                                     const firstLine = lines[0] || '';
//                                     const projectName = parseProjectName(firstLine);
//                                     const projectMatch = firstLine.match(/\|\s*(.+?)\s*\((\d{4})\)/);
//                                     const techStack = projectMatch ? projectMatch[1].split(',').map((t) => t.trim()) : [];
//                                     const year = projectMatch ? projectMatch[2] : new Date().getFullYear();
//                                     const descriptionLines = lines.slice(1).filter((line) => line.trim().startsWith('-') || line.trim().match(/^\s/));
//                                     return (
//                                       <div key={index} className="bg-gray-50 p-5 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
//                                         <div className="flex items-center justify-between mb-3">
//                                           <h6 className="text-lg font-bold text-gray-900">{projectName}</h6>
//                                           <span className="text-sm text-gray-500">{year}</span>
//                                         </div>
//                                         {techStack.length > 0 && (
//                                           <div className="flex flex-wrap gap-2 mb-4">
//                                             {techStack.map((tech, techIndex) => (
//                                               <span key={techIndex} className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full">
//                                                 {tech}
//                                               </span>
//                                             ))}
//                                           </div>
//                                         )}
//                                         {descriptionLines.length > 0 && (
//                                           <div className="space-y-2">
//                                             {descriptionLines.map((desc, descIndex) => (
//                                               <p key={descIndex} className="text-sm text-gray-700">
//                                                 {desc.replace(/^[-\s]+/, '').trim()}
//                                               </p>
//                                             ))}
//                                           </div>
//                                         )}
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.achievements.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-amber-300 lg:col-span-2">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
//                                     <Trophy className="w-5 h-5 text-amber-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">Achievements</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.achievements.map((achievement, index) => (
//                                     <div key={index} className="p-4 bg-amber-50 rounded-md border border-amber-200 hover:bg-amber-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{achievement}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                     </div>
//                   ) : (
//                     <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
//                       {selectedApplication.resume ? (
//                         <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-inner">
//                           <div className="flex justify-between items-center mb-4">
//                             <p className="text-gray-700 text-sm">View the embedded resume or click download to access the original PDF.</p>
//                             {selectedApplication.resume && (
//                               <a
//                                 href={selectedApplication.resume}
//                                 download
//                                 className="text-blue-600 hover:text-blue-800 flex items-center gap-2 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-md"
//                               >
//                                 <Download className="w-4 h-4" />
//                                 Download PDF
//                               </a>
//                             )}
//                           </div>
//                           <div className="aspect-[4/5] bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md">
//                             <iframe
//                               src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedApplication.resume)}&embedded=true`}
//                               className="w-full h-full"
//                               frameBorder="0"
//                               title="Resume PDF"
//                             ></iframe>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="bg-white rounded-lg p-8 border border-gray-200 text-center shadow-inner">
//                           <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                           <p className="text-gray-500">No original resume available</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       <Footer />
//       <style jsx>{`
//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }
//         .animate-shimmer {
//           animation: shimmer 3s infinite linear;
//         }
//       `}</style>
//     </div>
//     </div>
//   );
// };

// export default Leaderboard;
// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Trophy, Medal, Award, User, Calendar, Clock, TrendingUp, Eye, FileText, Download, ArrowLeft,
//   Star, BookOpen, Briefcase, GraduationCap, Code, Award as AwardIcon, Target, CheckCircle,
//   XCircle, AlertCircle, LayoutDashboard, MessageSquare, FileCode, BarChart2
// } from "lucide-react";
// import { Chart as ChartJS, registerables } from 'chart.js';
// import { Bar, Pie, Radar } from 'react-chartjs-2';
// import Header from "../components/ui/header";
// import Footer from "../components/ui/footer";
// import { getAuthToken } from "../utils/handleToken";

// ChartJS.register(...registerables);

// const Leaderboard = () => {
//   const { id: interviewId } = useParams();
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [showHistory, setShowHistory] = useState(false);
//   const [showApplication, setShowApplication] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [resumeView, setResumeView] = useState('extracted');
//   const [visible, setVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     fetchLeaderboardData();
//     setTimeout(() => setVisible(true), 100);
//   }, [interviewId]);

//   const fetchLeaderboardData = async () => {
//     try {
//       const token = getAuthToken();
//       const API_URL = import.meta.env.VITE_API_URL;
//       const response = await fetch(
//         `${API_URL}/interview/leaderboard/${interviewId}/`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch leaderboard data");
//       }

//       const data = await response.json();
//       setLeaderboardData(Array.isArray(data) ? data : data.data || []);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const getRankIcon = (rank) => {
//     switch (rank) {
//       case 1:
//         return <Trophy className="w-6 h-6 text-yellow-500" />;
//       case 2:
//         return <Medal className="w-6 h-6 text-gray-500" />;
//       case 3:
//         return <Award className="w-6 h-6 text-amber-600" />;
//       default:
//         return (
//           <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">
//             {rank}
//           </span>
//         );
//     }
//   };

//   const getScoreColor = (score) => {
//     if (typeof score !== 'number') return "text-gray-600 bg-gray-100 border-gray-200";
//     if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
//     if (score >= 60) return "text-yellow-600 bg-yellow-100 border-yellow-200";
//     if (score >= 40) return "text-orange-600 bg-orange-100 border-orange-200";
//     return "text-red-600 bg-red-100 border-red-200";
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       completed: "bg-green-100 text-green-700 border-green-200",
//       ongoing: "bg-blue-100 text-blue-700 border-blue-200",
//       scheduled: "bg-gray-100 text-gray-700 border-gray-200",
//       cancelled: "bg-red-100 text-red-700 border-red-200",
//       cheated: "bg-red-100 text-red-700 border-red-200",
//     };
//     const colorClass = statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200";
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
//         {status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A"}
//       </span>
//     );
//   };

//   const getDecisionBadge = (decision) => {
//     if (decision === true) {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
//           <CheckCircle className="w-3 h-3" />
//           Approved
//         </span>
//       );
//     } else if (decision === false) {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
//           <XCircle className="w-3 h-3" />
//           Rejected
//         </span>
//       );
//     } else {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
//           <AlertCircle className="w-3 h-3" />
//           Pending
//         </span>
//       );
//     }
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const handleViewDetails = (candidate) => {
//     setSelectedCandidate(candidate);
//     setActiveTab('overview');
//     setShowHistory(true);
//   };

//   const handleViewApplication = (application) => {
//     setSelectedApplication(application);
//     setShowApplication(true);
//     setResumeView('extracted');
//   };

//   const parseExtractedResume = (resumeText) => {
//     if (!resumeText) return null;
//     const sections = {
//       personalDetails: [],
//       skills: [],
//       experience: [],
//       education: [],
//       certifications: [],
//       projects: [],
//       achievements: [],
//     };
//     const lines = resumeText.split('\n');
//     let currentSection = '';
//     lines.forEach((line) => {
//       const trimmedLine = line.trim();
//       if (trimmedLine.startsWith('### Personal Details')) {
//         currentSection = 'personalDetails';
//       } else if (trimmedLine.startsWith('### Skills')) {
//         currentSection = 'skills';
//       } else if (trimmedLine.startsWith('### Experience')) {
//         currentSection = 'experience';
//       } else if (trimmedLine.startsWith('### Education')) {
//         currentSection = 'education';
//       } else if (trimmedLine.startsWith('### Certifications')) {
//         currentSection = 'certifications';
//       } else if (trimmedLine.startsWith('### Projects')) {
//         currentSection = 'projects';
//       } else if (trimmedLine.startsWith('### Achievements')) {
//         currentSection = 'achievements';
//       } else if (currentSection && trimmedLine) {
//         if (line.startsWith('- ')) {
//           sections[currentSection].push(trimmedLine.substring(1).trim());
//         } else if (line.startsWith(' - ') && (currentSection === 'projects' || currentSection === 'experience')) {
//           if (sections[currentSection].length > 0) {
//             const lastIndex = sections[currentSection].length - 1;
//             sections[currentSection][lastIndex] += '\n' + trimmedLine;
//           }
//         } else if (trimmedLine.startsWith('-') && currentSection !== 'projects' && currentSection !== 'experience') {
//           sections[currentSection].push(trimmedLine.substring(1).trim());
//         } else if (currentSection && trimmedLine && !trimmedLine.startsWith('###')) {
//           if (currentSection === 'projects' || currentSection === 'experience') {
//             if (sections[currentSection].length > 0) {
//               const lastIndex = sections[currentSection].length - 1;
//               sections[currentSection][lastIndex] += '\n' + trimmedLine;
//             } else {
//               sections[currentSection].push(trimmedLine);
//             }
//           } else {
//             sections[currentSection].push(trimmedLine);
//           }
//         }
//       }
//     });
//     return sections;
//   };

//   const parseProjectName = (projectText) => {
//     if (!projectText) return 'Unnamed Project';
//     const firstLine = projectText.split('\n')[0];
//     let match = firstLine.match(/^(.+?)\s*\(GitHub\)/) ||
//                 firstLine.match(/^(.+?)\s*\|/) ||
//                 firstLine.match(/^(.+?)\s*[-–]/) ||
//                 firstLine.match(/^([^|\-–(]+)/);
//     return match ? match[1].trim() : firstLine.trim();
//   };

//   // Chart Data Preparation
//   const scoreDistributionData = {
//     labels: leaderboardData.map((c, index) => `Candidate ${index + 1}`),
//     datasets: [{
//       label: 'Score',
//       data: leaderboardData.map(c => c.score || 0),
//       backgroundColor: 'rgba(139, 92, 246, 0.6)',
//       borderColor: 'rgba(139, 92, 246, 1)',
//       borderWidth: 1,
//     }],
//   };

//   const statusBreakdownData = {
//     labels: ['Completed', 'Ongoing', 'Scheduled', 'Cancelled', 'Cheated'],
//     datasets: [{
//       data: [
//         leaderboardData.filter(c => c.status === 'completed').length,
//         leaderboardData.filter(c => c.status === 'ongoing').length,
//         leaderboardData.filter(c => c.status === 'scheduled').length,
//         leaderboardData.filter(c => c.status === 'cancelled').length,
//         leaderboardData.filter(c => c.status === 'cheated').length,
//       ],
//       backgroundColor: [
//         'rgba(34, 197, 94, 0.6)',
//         'rgba(59, 130, 246, 0.6)',
//         'rgba(156, 163, 175, 0.6)',
//         'rgba(239, 68, 68, 0.6)',
//         'rgba(239, 68, 68, 0.6)',
//       ],
//       borderColor: [
//         'rgba(34, 197, 94, 1)',
//         'rgba(59, 130, 246, 1)',
//         'rgba(156, 163, 175, 1)',
//         'rgba(239, 68, 68, 1)',
//         'rgba(239, 68, 68, 1)',
//       ],
//       borderWidth: 1,
//     }],
//   };

//   const radarChartData = {
//     labels: ['Devscore', 'Resumescore', 'DsaScore', 'Confidence Interval'],
//     datasets: leaderboardData.map((candidate, index) => ({
//       label: candidate.Application?.user?.username || `Candidate ${index + 1}`,
//       data: [
//         candidate.Devscore || 0,
//         candidate.Resumescore || 0,
//         candidate.DsaScore || 0,
//         candidate.confidenceScore || 55, // Default 50-60 midpoint
//       ],
//       backgroundColor: `rgba(${index * 50}, 100, 200, 0.2)`,
//       borderColor: `rgba(${index * 50}, 100, 200, 1)`,
//       borderWidth: 1,
//     })),
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Header viewerType="owner" />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Header viewerType="owner" />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-md">
//             Error: {error}
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   const sortedData = [...leaderboardData].sort((a, b) => (b.score || 0) - (a.score || 0));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
//       <Header viewerType="owner" />
//       <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
//         {/* Header */}
//         <div className={`transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mb-8 p-8 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-shimmer"></div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
//                   <Trophy className="w-10 h-10 text-yellow-500" />
//                   Interview Leaderboard
//                 </h1>
//                 <p className="text-gray-600 text-lg">Performance rankings for all candidates</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-purple-600 font-medium">Total Candidates</p>
//                 <p className="text-4xl font-bold text-purple-600">{sortedData.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className={`mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 transform transition-all duration-1000 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
//             <Bar
//               data={scoreDistributionData}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { display: false }, title: { display: true, text: 'Candidate Scores' } },
//                 scales: { y: { beginAtZero: true, max: 100 } },
//               }}
//             />
//           </div>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
//             <Pie
//               data={statusBreakdownData}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { position: 'right' }, title: { display: true, text: 'Interview Status' } },
//               }}
//             />
//           </div>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 lg:col-span-2">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
//             <Radar
//               data={radarChartData}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { position: 'top' }, title: { display: true, text: 'Candidate Performance' } },
//                 scales: { r: { beginAtZero: true, max: 10 } },
//               }}
//             />
//           </div>
//         </div>

//         {/* Leaderboard Table */}
//         <div className={`mt-12 transform transition-all duration-1000 delay-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden relative">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-shimmer"></div>
//             <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
//               <h2 className="text-2xl font-semibold text-gray-900">Rankings</h2>
//             </div>
//             {sortedData.length === 0 ? (
//               <div className="p-12 text-center text-gray-500">
//                 <User className="w-16 h-16 mx-auto mb-6 text-gray-400" />
//                 <p className="text-lg">No candidates found for this interview.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Rank</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Candidate</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Score</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Status</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Start Time</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {sortedData.map((candidate, index) => (
//                       <tr
//                         key={candidate.id}
//                         className={`hover:bg-gray-50 transition-colors duration-300 ${index < 3 ? "bg-gradient-to-r from-purple-50 to-transparent" : ""}`}
//                       >
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className="flex items-center">
//                             {getRankIcon(index + 1)}
//                             <span className="ml-3 text-lg font-bold text-gray-900">#{index + 1}</span>
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-12 w-12">
//                               <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
//                                 <User className="w-6 h-6 text-white" />
//                               </div>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-lg font-semibold text-gray-900">
//                                 {candidate.Application?.user?.username || "Anonymous"}
//                               </div>
//                               <div className="text-sm text-gray-500">ID: {candidate.Application?.id}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border shadow-sm ${getScoreColor(candidate.score || 0)}`}>
//                             {typeof candidate.score === 'number' ? candidate.score.toFixed(1) : "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">{getStatusBadge(candidate.status)}</td>
//                         <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
//                           <div className="flex items-center">
//                             <Calendar className="w-5 h-5 mr-2 text-purple-500" />
//                             {formatDateTime(candidate.start_time)}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
//                           <div className="flex gap-3">
//                             <button
//                               onClick={() => handleViewDetails(candidate)}
//                               className="text-blue-600 hover:text-blue-800 flex items-center gap-2 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-md"
//                             >
//                               <Eye className="w-4 h-4" />
//                               Interview
//                             </button>
//                             <button
//                               onClick={() => handleViewApplication(candidate.Application)}
//                               className="text-green-600 hover:text-green-800 flex items-center gap-2 hover:bg-green-100 px-4 py-2 rounded-lg transition-all duration-300 border border-green-200 hover:border-green-300 hover:shadow-md"
//                             >
//                               <FileText className="w-4 h-4" />
//                               Application
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Performance Insights */}
//         {sortedData.length > 0 && (
//           <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-600 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-green-100 rounded-xl border border-green-200">
//                   <TrendingUp className="w-8 h-8 text-green-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Highest Score</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {Math.max(...sortedData.map((c) => c.score || 0)).toFixed(1)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
//                   <Trophy className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Average Score</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {(sortedData.reduce((sum, c) => sum + (c.score || 0), 0) / sortedData.length).toFixed(1)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-purple-100 rounded-xl border border-purple-200">
//                   <User className="w-8 h-8 text-purple-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Completed</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {sortedData.filter((c) => c.status === "completed").length}
//                     <span className="text-xl text-gray-500">/{sortedData.length}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Interview Details Modal */}
//         {showHistory && selectedCandidate && (
//           <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl">
//               <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-200 z-10">
//                 <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                   <LayoutDashboard className="w-5 h-5 text-purple-600" />
//                   Interview Details - {selectedCandidate.Application?.user?.username || "Anonymous"}
//                 </h3>
//                 <button
//                   onClick={() => setShowHistory(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Tabs */}
//               <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//                 <div className="flex gap-2 flex-wrap">
//                   {['overview', 'questions', 'dsa', 'resume_conversations'].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
//                         activeTab === tab
//                           ? 'bg-purple-600 text-white shadow-md'
//                           : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                       }`}
//                     >
//                       {tab === 'overview' && <LayoutDashboard className="w-4 h-4" />}
//                       {tab === 'questions' && <MessageSquare className="w-4 h-4" />}
//                       {tab === 'dsa' && <FileCode className="w-4 h-4" />}
//                       {tab === 'resume_conversations' && <BarChart2 className="w-4 h-4" />}
//                       {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-8 text-gray-700">
//                 {activeTab === 'overview' && (
//                   <div className="space-y-8">
//                     {/* Summary */}
//                     <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                       <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <LayoutDashboard className="w-5 h-5 text-purple-500" />
//                         Summary
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                         <div className="group relative text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Final Score</p>
//                           <div className={`inline-flex px-4 py-2 rounded-full text-xl font-bold border ${getScoreColor(selectedCandidate.score)} group-hover:scale-105 transition-transform duration-300`}>
//                             {typeof selectedCandidate.score === 'number' ? selectedCandidate.score.toFixed(1) : "N/A"}
//                           </div>
//                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                             <span className="text-xs text-gray-500 bg-white p-2 rounded-md shadow-md">Overall performance score</span>
//                           </div>
//                         </div>
//                         <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Status</p>
//                           <p className="mt-1">{getStatusBadge(selectedCandidate.status)}</p>
//                         </div>
//                         <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Recommendation</p>
//                           <p className="text-sm font-medium text-gray-900">{selectedCandidate.recommendation || "N/A"}</p>
//                         </div>
//                         <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Duration</p>
//                           <p className="text-sm font-medium text-gray-900">
//                             {selectedCandidate.start_time && selectedCandidate.end_time
//                               ? `${Math.round(
//                                   (new Date(selectedCandidate.end_time) - new Date(selectedCandidate.start_time)) / (1000 * 60)
//                                 )} min`
//                               : "In Progress"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Feedback */}
//                     {selectedCandidate.feedback ? (
//                       <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <BookOpen className="w-5 h-5 text-blue-500" />
//                           Overall Feedback
//                         </h4>
//                         <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
//                           <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.feedback}</p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No feedback available.</p>
//                       </div>
//                     )}

//                     {/* Strengths */}
//                     {selectedCandidate.strengths ? (
//                       <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <Star className="w-5 h-5 text-green-500" />
//                           Strengths
//                         </h4>
//                         <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
//                           <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.strengths}</p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No strengths available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === 'questions' && (
//                   <div className="space-y-8">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <MessageSquare className="w-5 h-5 text-purple-500" />
//                       Question-wise Performance
//                     </h4>
//                     {selectedCandidate.session && selectedCandidate.session.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedCandidate.session.map((item, index) => (
//                           <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//                             <div className="flex justify-between items-start mb-4">
//                               <h5 className="text-lg font-medium text-gray-900">Question {index + 1}</h5>
//                               {item.score && (
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(item.score)}`}>
//                                   {item.score.toFixed(1)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-4">
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Main Question:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {item.Customquestion?.question || "N/A"}
//                                 </p>
//                               </div>
//                               {item.Customquestion?.answer && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Expected Answer:</p>
//                                   <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                     {item.Customquestion.answer}
//                                   </p>
//                                 </div>
//                               )}
//                               {item.followups && item.followups.length > 0 && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-2">Follow-up Questions:</p>
//                                   <div className="space-y-3">
//                                     {item.followups.map((qa, qaIndex) => (
//                                       <div key={qaIndex} className="bg-gray-50 p-4 rounded-md border border-gray-200">
//                                         <p className="text-sm font-medium text-blue-600 mb-1">Q: {qa.question}</p>
//                                         <p className="text-sm text-gray-700">A: {qa.answer || "N/A"}</p>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               )}
//                               {item.feedback && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Feedback:</p>
//                                   <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
//                                     {item.feedback}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No question data available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === 'dsa' && (
//                   <div className="space-y-8">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <FileCode className="w-5 h-5 text-cyan-500" />
//                       DSA Topics
//                     </h4>
//                     {selectedCandidate.dsa && selectedCandidate.dsa.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedCandidate.dsa.map((dsa, index) => (
//                           <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//                             <div className="flex justify-between items-start mb-4">
//                               <h5 className="text-lg font-medium text-gray-900">
//                                 {dsa.topic?.topic} ({dsa.topic?.difficulty})
//                               </h5>
//                               {dsa.score && (
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(dsa.score)}`}>
//                                   {dsa.score.toFixed(1)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-4">
//                               {dsa.question && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Question:</p>
//                                   <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                     {typeof dsa.question === 'string' ? JSON.parse(dsa.question).description : "N/A"}
//                                   </p>
//                                 </div>
//                               )}
//                               {dsa.code && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Code:</p>
//                                   <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200 overflow-x-auto">
//                                     <code>{dsa.code}</code>
//                                   </pre>
//                                 </div>
//                               )}
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Created At:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {formatDateTime(dsa.created_at)}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No DSA topics available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === 'resume_conversations' && (
//                   <div className="space-y-8">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <BarChart2 className="w-5 h-5 text-blue-500" />
//                       Resume Conversations
//                     </h4>
//                     {selectedCandidate.resume_conversations && selectedCandidate.resume_conversations.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedCandidate.resume_conversations.map((conv, index) => (
//                           <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//                             <div className="flex justify-between items-start mb-4">
//                               <h5 className="text-lg font-medium text-gray-900">Conversation {index + 1}</h5>
//                               {conv.score && (
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(conv.score)}`}>
//                                   {conv.score.toFixed(1)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-4">
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Question:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {conv.question || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Expected Answer:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {conv.expected_answer || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Candidate Answer:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {conv.answer || "N/A"}
//                                 </p>
//                               </div>
//                               {conv.feedback && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Feedback:</p>
//                                   <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
//                                     {conv.feedback}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <BarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No resume conversations available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Application Details Modal */}
//         {showApplication && selectedApplication && (
//           <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
//               <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={() => setShowApplication(false)}
//                     className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                   </button>
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     Application Details - {selectedApplication.user?.username || "Anonymous"}
//                   </h3>
//                 </div>
//                 <button
//                   onClick={() => setShowApplication(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div className="p-6 space-y-8">
//                 {/* Application Summary */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                   <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                     <User className="w-5 h-5 text-purple-500" />
//                     Application Summary
//                   </h4>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                     <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
//                         <User className="w-6 h-6 text-white" />
//                       </div>
//                       <h5 className="text-lg font-semibold text-gray-900 mb-1">{selectedApplication.user?.username || "Anonymous"}</h5>
//                       <p className="text-sm text-gray-500">Application ID: {selectedApplication.id}</p>
//                     </div>
//                     <div className="group relative text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="mb-3">
//                         <Star className="w-8 h-8 text-yellow-500 mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-500 mb-1">Application Score</p>
//                       <div className={`inline-flex px-4 py-2 rounded-full text-xl font-bold border ${getScoreColor(selectedApplication.score)} group-hover:scale-105 transition-transform duration-300`}>
//                         {typeof selectedApplication.score === 'number' ? selectedApplication.score.toFixed(1) : "N/A"}
//                       </div>
//                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <span className="text-xs text-gray-500 bg-white p-2 rounded-md shadow-md">Application evaluation score</span>
//                       </div>
//                     </div>
//                     <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="mb-3">
//                         <Calendar className="w-8 h-8 text-blue-500 mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-500 mb-1">Applied On</p>
//                       <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedApplication.applied_at)}</p>
//                     </div>
//                     <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="mb-3">
//                         <Target className="w-8 h-8 text-green-500 mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-500 mb-1">Decision</p>
//                       <div className="flex justify-center mt-2">{getDecisionBadge(selectedApplication.shortlisting_decision)}</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Application Feedback */}
//                 {selectedApplication.feedback ? (
//                   <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                       <BookOpen className="w-5 h-5 text-blue-500" />
//                       Application Feedback
//                     </h4>
//                     <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
//                       <p className="text-gray-700 leading-relaxed">{selectedApplication.feedback}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                     <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-500 text-lg">No application feedback available.</p>
//                   </div>
//                 )}

//                 {/* Resume Section */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                   <div className="flex items-center justify-between mb-6">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <FileText className="w-5 h-5 text-green-500" />
//                       Resume
//                     </h4>
//                     <div className="flex bg-gray-200 rounded-lg p-1">
//                       <button
//                         onClick={() => setResumeView('extracted')}
//                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
//                           resumeView === 'extracted' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                         }`}
//                       >
//                         Extracted
//                       </button>
//                       <button
//                         onClick={() => setResumeView('original')}
//                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
//                           resumeView === 'original' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                         }`}
//                       >
//                         Original
//                       </button>
//                     </div>
//                   </div>
//                   {resumeView === 'extracted' ? (
//                     <div className="space-y-8">
//                       {(() => {
//                         const resumeData = parseExtractedResume(selectedApplication.extratedResume);
//                         if (!resumeData) {
//                           return (
//                             <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                               <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                               <p className="text-gray-500 text-lg">No extracted resume data available.</p>
//                             </div>
//                           );
//                         }
//                         return (
//                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             {resumeData.personalDetails.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
//                                     <User className="w-5 h-5 text-blue-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Personal Details</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.personalDetails.map((detail, index) => (
//                                     <div key={index} className="flex items-start gap-2 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
//                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
//                                       <p className="text-gray-700 text-sm leading-relaxed">{detail}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.skills.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-green-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
//                                     <Code className="w-5 h-5 text-green-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">Skills</h5>
//                                 </div>
//                                 <div className="flex flex-wrap gap-2">
//                                   {resumeData.skills.map((skill, index) => (
//                                     <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 hover:bg-green-200 transition-colors">
//                                       {skill}
//                                     </span>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.experience.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-300 lg:col-span-2">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
//                                     <Briefcase className="w-5 h-5 text-purple-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Experience</h5>
//                                 </div>
//                                 <div className="space-y-4">
//                                   {resumeData.experience.map((exp, index) => (
//                                     <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{exp}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.education.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-yellow-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
//                                     <GraduationCap className="w-5 h-5 text-yellow-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">Education</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.education.map((edu, index) => (
//                                     <div key={index} className="p-4 bg-yellow-50 rounded-md border border-yellow-200 hover:bg-yellow-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{edu}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.certifications.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-orange-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
//                                     <AwardIcon className="w-5 h-5 text-orange-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">Certifications</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.certifications.map((cert, index) => (
//                                     <div key={index} className="p-4 bg-orange-50 rounded-md border border-orange-200 hover:bg-orange-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{cert}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.projects.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-cyan-300 lg:col-span-2">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
//                                     <Code className="w-5 h-5 text-cyan-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">Projects</h5>
//                                 </div>
//                                 <div className="space-y-4">
//                                   {resumeData.projects.map((project, index) => {
//                                     const lines = project.split('\n').filter((line) => line.trim());
//                                     const firstLine = lines[0] || '';
//                                     const projectName = parseProjectName(firstLine);
//                                     const projectMatch = firstLine.match(/\|\s*(.+?)\s*\((\d{4})\)/);
//                                     const techStack = projectMatch ? projectMatch[1].split(',').map((t) => t.trim()) : [];
//                                     const year = projectMatch ? projectMatch[2] : new Date().getFullYear();
//                                     const descriptionLines = lines.slice(1).filter((line) => line.trim().startsWith('-') || line.trim().match(/^\s/));
//                                     return (
//                                       <div key={index} className="bg-gray-50 p-5 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
//                                         <div className="flex items-center justify-between mb-3">
//                                           <h6 className="text-lg font-bold text-gray-900">{projectName}</h6>
//                                           <span className="text-sm text-gray-500">{year}</span>
//                                         </div>
//                                         {techStack.length > 0 && (
//                                           <div className="flex flex-wrap gap-2 mb-4">
//                                             {techStack.map((tech, techIndex) => (
//                                               <span key={techIndex} className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full">
//                                                 {tech}
//                                               </span>
//                                             ))}
//                                           </div>
//                                         )}
//                                         {descriptionLines.length > 0 && (
//                                           <div className="space-y-2">
//                                             {descriptionLines.map((desc, descIndex) => (
//                                               <p key={descIndex} className="text-sm text-gray-700">
//                                                 {desc.replace(/^[-\s]+/, '').trim()}
//                                               </p>
//                                             ))}
//                                           </div>
//                                         )}
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.achievements.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-amber-300 lg:col-span-2">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
//                                     <Trophy className="w-5 h-5 text-amber-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">Achievements</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.achievements.map((achievement, index) => (
//                                     <div key={index} className="p-4 bg-amber-50 rounded-md border border-amber-200 hover:bg-amber-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{achievement}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                     </div>
//                   ) : (
//                     <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
//                       {selectedApplication.resume ? (
//                         <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-inner">
//                           <div className="flex justify-between items-center mb-4">
//                             <p className="text-gray-700 text-sm">View the embedded resume or click download to access the original PDF.</p>
//                             {selectedApplication.resume && (
//                               <a
//                                 href={selectedApplication.resume}
//                                 download
//                                 className="text-blue-600 hover:text-blue-800 flex items-center gap-2 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-md"
//                               >
//                                 <Download className="w-4 h-4" />
//                                 Download PDF
//                               </a>
//                             )}
//                           </div>
//                           <div className="aspect-[4/5] bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md">
//                             <iframe
//                               src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedApplication.resume)}&embedded=true`}
//                               className="w-full h-full"
//                               frameBorder="0"
//                               title="Resume PDF"
//                             ></iframe>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="bg-white rounded-lg p-8 border border-gray-200 text-center shadow-inner">
//                           <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                           <p className="text-gray-500">No original resume available</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//       <Footer />
//       <style jsx>{`
//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer {
//           animation: shimmer 3s infinite linear;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Leaderboard;
// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Trophy, Medal, Award, User, Calendar, Clock, TrendingUp, Eye, FileText, Download, ArrowLeft,
//   Star, BookOpen, Briefcase, GraduationCap, Code, Award as AwardIcon, Target, CheckCircle,
//   XCircle, AlertCircle, LayoutDashboard, MessageSquare, FileCode, BarChart2
// } from "lucide-react";
// import { Chart as ChartJS, registerables } from 'chart.js';
// import { Bar, Pie, Radar } from 'react-chartjs-2';
// import Header from "../components/ui/header";
// import Footer from "../components/ui/footer";
// import { getAuthToken } from "../utils/handleToken";

// ChartJS.register(...registerables);

// const Leaderboard = () => {
//   const { id: interviewId } = useParams();
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [showHistory, setShowHistory] = useState(false);
//   const [showApplication, setShowApplication] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [resumeView, setResumeView] = useState('extracted');
//   const [visible, setVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     fetchLeaderboardData();
//     setTimeout(() => setVisible(true), 100);
//   }, [interviewId]);

//   const fetchLeaderboardData = async () => {
//     try {
//       const token = getAuthToken();
//       const API_URL = import.meta.env.VITE_API_URL;
//       const response = await fetch(
//         `${API_URL}/interview/leaderboard/${interviewId}/`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Token ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch leaderboard data");
//       }

//       const data = await response.json();
//       setLeaderboardData(Array.isArray(data) ? data : data.data || []);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const getEffectiveScore = (candidate) => {
//     let sum = 0;
//     let count = 0;
//     if (typeof candidate.Devscore === 'number') { sum += candidate.Devscore; count++; }
//     if (typeof candidate.Resumescore === 'number') { sum += candidate.Resumescore; count++; }
//     if (typeof candidate.DsaScore === 'number') { sum += candidate.DsaScore; count++; }
//     return count > 0 ? sum / count : 0;
//   };

//   const getRankIcon = (rank) => {
//     switch (rank) {
//       case 1:
//         return <Trophy className="w-6 h-6 text-yellow-500" />;
//       case 2:
//         return <Medal className="w-6 h-6 text-gray-500" />;
//       case 3:
//         return <Award className="w-6 h-6 text-amber-600" />;
//       default:
//         return (
//           <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">
//             {rank}
//           </span>
//         );
//     }
//   };

//   const getScoreColor = (score) => {
//     if (typeof score !== 'number') return "text-gray-600 bg-gray-100 border-gray-200";
//     if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
//     if (score >= 60) return "text-yellow-600 bg-yellow-100 border-yellow-200";
//     if (score >= 40) return "text-orange-600 bg-orange-100 border-orange-200";
//     return "text-red-600 bg-red-100 border-red-200";
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       completed: "bg-green-100 text-green-700 border-green-200",
//       ongoing: "bg-blue-100 text-blue-700 border-blue-200",
//       scheduled: "bg-gray-100 text-gray-700 border-gray-200",
//       cancelled: "bg-red-100 text-red-700 border-red-200",
//       cheated: "bg-red-100 text-red-700 border-red-200",
//     };
//     const colorClass = statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200";
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
//         {status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A"}
//       </span>
//     );
//   };

//   const getDecisionBadge = (decision) => {
//     if (decision === true) {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
//           <CheckCircle className="w-3 h-3" />
//           Approved
//         </span>
//       );
//     } else if (decision === false) {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
//           <XCircle className="w-3 h-3" />
//           Rejected
//         </span>
//       );
//     } else {
//       return (
//         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
//           <AlertCircle className="w-3 h-3" />
//           Pending
//         </span>
//       );
//     }
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const handleViewDetails = (candidate) => {
//     setSelectedCandidate(candidate);
//     setActiveTab('overview');
//     setShowHistory(true);
//   };

//   const handleViewApplication = (application) => {
//     setSelectedApplication(application);
//     setShowApplication(true);
//     setResumeView('extracted');
//   };

//   const parseExtractedResume = (resumeText) => {
//     if (!resumeText) return null;
//     const sections = {
//       personalDetails: [],
//       skills: [],
//       experience: [],
//       education: [],
//       certifications: [],
//       projects: [],
//       achievements: [],
//     };
//     const lines = resumeText.split('\n');
//     let currentSection = '';
//     lines.forEach((line) => {
//       const trimmedLine = line.trim();
//       if (trimmedLine.startsWith('### Personal Details')) {
//         currentSection = 'personalDetails';
//       } else if (trimmedLine.startsWith('### Skills')) {
//         currentSection = 'skills';
//       } else if (trimmedLine.startsWith('### Experience')) {
//         currentSection = 'experience';
//       } else if (trimmedLine.startsWith('### Education')) {
//         currentSection = 'education';
//       } else if (trimmedLine.startsWith('### Certifications')) {
//         currentSection = 'certifications';
//       } else if (trimmedLine.startsWith('### Projects')) {
//         currentSection = 'projects';
//       } else if (trimmedLine.startsWith('### Achievements')) {
//         currentSection = 'achievements';
//       } else if (currentSection && trimmedLine) {
//         if (line.startsWith('- ')) {
//           sections[currentSection].push(trimmedLine.substring(1).trim());
//         } else if (line.startsWith(' - ') && (currentSection === 'projects' || currentSection === 'experience')) {
//           if (sections[currentSection].length > 0) {
//             const lastIndex = sections[currentSection].length - 1;
//             sections[currentSection][lastIndex] += '\n' + trimmedLine;
//           }
//         } else if (trimmedLine.startsWith('-') && currentSection !== 'projects' && currentSection !== 'experience') {
//           sections[currentSection].push(trimmedLine.substring(1).trim());
//         } else if (currentSection && trimmedLine && !trimmedLine.startsWith('###')) {
//           if (currentSection === 'projects' || currentSection === 'experience') {
//             if (sections[currentSection].length > 0) {
//               const lastIndex = sections[currentSection].length - 1;
//               sections[currentSection][lastIndex] += '\n' + trimmedLine;
//             } else {
//               sections[currentSection].push(trimmedLine);
//             }
//           } else {
//             sections[currentSection].push(trimmedLine);
//           }
//         }
//       }
//     });
//     return sections;
//   };

//   const parseProjectName = (projectText) => {
//     if (!projectText) return 'Unnamed Project';
//     const firstLine = projectText.split('\n')[0];
//     let match = firstLine.match(/^(.+?)\s*\(GitHub\)/) ||
//                 firstLine.match(/^(.+?)\s*\|/) ||
//                 firstLine.match(/^(.+?)\s*[-–]/) ||
//                 firstLine.match(/^([^|\-–(]+)/);
//     return match ? match[1].trim() : firstLine.trim();
//   };

//   // Chart Data Preparation
//   const scoreDistributionData = {
//     labels: leaderboardData.map((c, index) => `Candidate ${index + 1}`),
//     datasets: [{
//       label: 'Score',
//       data: leaderboardData.map(c => getEffectiveScore(c)),
//       backgroundColor: 'rgba(139, 92, 246, 0.6)',
//       borderColor: 'rgba(139, 92, 246, 1)',
//       borderWidth: 1,
//     }],
//   };

//   const statusBreakdownData = {
//     labels: ['Completed', 'Ongoing', 'Scheduled', 'Cancelled', 'Cheated'],
//     datasets: [{
//       data: [
//         leaderboardData.filter(c => c.status === 'completed').length,
//         leaderboardData.filter(c => c.status === 'ongoing').length,
//         leaderboardData.filter(c => c.status === 'scheduled').length,
//         leaderboardData.filter(c => c.status === 'cancelled').length,
//         leaderboardData.filter(c => c.status === 'cheated').length,
//       ],
//       backgroundColor: [
//         'rgba(34, 197, 94, 0.6)',
//         'rgba(59, 130, 246, 0.6)',
//         'rgba(156, 163, 175, 0.6)',
//         'rgba(239, 68, 68, 0.6)',
//         'rgba(239, 68, 68, 0.6)',
//       ],
//       borderColor: [
//         'rgba(34, 197, 94, 1)',
//         'rgba(59, 130, 246, 1)',
//         'rgba(156, 163, 175, 1)',
//         'rgba(239, 68, 68, 1)',
//         'rgba(239, 68, 68, 1)',
//       ],
//       borderWidth: 1,
//     }],
//   };

//   const averageMetricsData = {
//     labels: ['Dev Score', 'Resume Score', 'DSA Score'],
//     datasets: [{
//       label: 'Average Scores',
//       data: [
//         leaderboardData.reduce((sum, c) => sum + (c.Devscore || 0), 0) / leaderboardData.length,
//         leaderboardData.reduce((sum, c) => sum + (c.Resumescore || 0), 0) / leaderboardData.length,
//         leaderboardData.reduce((sum, c) => sum + (c.DsaScore || 0), 0) / leaderboardData.length,
//       ],
//       backgroundColor: 'rgba(75, 192, 192, 0.6)',
//       borderColor: 'rgba(75, 192, 192, 1)',
//       borderWidth: 1,
//     }],
//   };

//   const radarChartData = {
//     labels: ['Devscore', 'Resumescore', 'DsaScore'],
//     datasets: leaderboardData.map((candidate, index) => ({
//       label: candidate.Application?.user?.username || `Candidate ${index + 1}`,
//       data: [
//         candidate.Devscore || 0,
//         candidate.Resumescore || 0,
//         candidate.DsaScore || 0,
//       ],
//       backgroundColor: `rgba(${index * 50 % 255}, ${100 + index * 30 % 155}, ${200 - index * 20 % 200}, 0.2)`,
//       borderColor: `rgba(${index * 50 % 255}, ${100 + index * 30 % 155}, ${200 - index * 20 % 200}, 1)`,
//       borderWidth: 1,
//     })),
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Header viewerType="owner" />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <Header viewerType="owner" />
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-md">
//             Error: {error}
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   const sortedData = [...leaderboardData].sort((a, b) => getEffectiveScore(b) - getEffectiveScore(a));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
//       <Header viewerType="owner" />
//       <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
//         {/* Header */}
//         <div className={`transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mb-8 p-8 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-shimmer"></div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
//                   <Trophy className="w-10 h-10 text-yellow-500" />
//                   Interview Leaderboard
//                 </h1>
//                 <p className="text-gray-600 text-lg">Performance rankings for all candidates</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-purple-600 font-medium">Total Candidates</p>
//                 <p className="text-4xl font-bold text-purple-600">{sortedData.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className={`mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 transform transition-all duration-1000 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
//             <Bar
//               data={scoreDistributionData}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { display: false }, title: { display: true, text: 'Candidate Scores' } },
//                 scales: { y: { beginAtZero: true, max: 100 } },
//               }}
//               height={200}
//             />
//           </div>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
//             <Pie
//               data={statusBreakdownData}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { position: 'right' }, title: { display: true, text: 'Interview Status' } },
//               }}
//               height={200}
//             />
//           </div>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Metrics</h3>
//             <Bar
//               data={averageMetricsData}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { display: false }, title: { display: true, text: 'Average Category Scores' } },
//                 scales: { y: { beginAtZero: true, max: 100 } },
//               }}
//               height={200}
//             />
//           </div>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 lg:col-span-1">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
//             <Radar
//               data={radarChartData}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { position: 'top' }, title: { display: true, text: 'Candidate Performance' } },
//                 scales: { r: { beginAtZero: true, max: 100 } },
//               }}
//               height={200}
//             />
//           </div>
//         </div>

//         {/* Leaderboard Table */}
//         <div className={`mt-12 transform transition-all duration-1000 delay-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden relative">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-shimmer"></div>
//             <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
//               <h2 className="text-2xl font-semibold text-gray-900">Rankings</h2>
//             </div>
//             {sortedData.length === 0 ? (
//               <div className="p-12 text-center text-gray-500">
//                 <User className="w-16 h-16 mx-auto mb-6 text-gray-400" />
//                 <p className="text-lg">No candidates found for this interview.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Rank</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Candidate</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Overall Score</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Dev Score</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Resume Score</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">DSA Score</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Status</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Start Time</th>
//                       <th className="px-8 py-4 text-left text-sm font-semibold text-purple-600 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {sortedData.map((candidate, index) => (
//                       <tr
//                         key={candidate.id}
//                         className={`hover:bg-gray-50 transition-colors duration-300 ${index < 3 ? "bg-gradient-to-r from-purple-50 to-transparent" : ""}`}
//                       >
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className="flex items-center">
//                             {getRankIcon(index + 1)}
//                             <span className="ml-3 text-lg font-bold text-gray-900">#{index + 1}</span>
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-12 w-12">
//                               <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
//                                 <User className="w-6 h-6 text-white" />
//                               </div>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-lg font-semibold text-gray-900">
//                                 {candidate.Application?.user?.username || "Anonymous"}
//                               </div>
//                               <div className="text-sm text-gray-500">ID: {candidate.Application?.id}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border shadow-sm ${getScoreColor(getEffectiveScore(candidate))}`}>
//                             {getEffectiveScore(candidate).toFixed(1)}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border shadow-sm ${getScoreColor(candidate.Devscore)}`}>
//                             {typeof candidate.Devscore === 'number' ? candidate.Devscore.toFixed(1) : "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border shadow-sm ${getScoreColor(candidate.Resumescore)}`}>
//                             {typeof candidate.Resumescore === 'number' ? candidate.Resumescore.toFixed(1) : "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className={`inline-flex px-4 py-2 rounded-full text-lg font-bold border shadow-sm ${getScoreColor(candidate.DsaScore)}`}>
//                             {typeof candidate.DsaScore === 'number' ? candidate.DsaScore.toFixed(1) : "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap">{getStatusBadge(candidate.status)}</td>
//                         <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
//                           <div className="flex items-center">
//                             <Calendar className="w-5 h-5 mr-2 text-purple-500" />
//                             {formatDateTime(candidate.start_time)}
//                           </div>
//                         </td>
//                         <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
//                           <div className="flex gap-3">
//                             <button
//                               onClick={() => handleViewDetails(candidate)}
//                               className="text-blue-600 hover:text-blue-800 flex items-center gap-2 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-md"
//                             >
//                               <Eye className="w-4 h-4" />
//                               Interview
//                             </button>
//                             <button
//                               onClick={() => handleViewApplication(candidate.Application)}
//                               className="text-green-600 hover:text-green-800 flex items-center gap-2 hover:bg-green-100 px-4 py-2 rounded-lg transition-all duration-300 border border-green-200 hover:border-green-300 hover:shadow-md"
//                             >
//                               <FileText className="w-4 h-4" />
//                               Application
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Performance Insights */}
//         {sortedData.length > 0 && (
//           <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-600 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-green-100 rounded-xl border border-green-200">
//                   <TrendingUp className="w-8 h-8 text-green-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Highest Score</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {Math.max(...sortedData.map((c) => getEffectiveScore(c))).toFixed(1)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-blue-100 rounded-xl border border-blue-200">
//                   <Trophy className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Average Score</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {(sortedData.reduce((sum, c) => sum + getEffectiveScore(c), 0) / sortedData.length).toFixed(1)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
//               <div className="flex items-center">
//                 <div className="p-3 bg-purple-100 rounded-xl border border-purple-200">
//                   <User className="w-8 h-8 text-purple-600" />
//                 </div>
//                 <div className="ml-6">
//                   <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Completed</p>
//                   <p className="text-3xl font-bold text-gray-900 mt-1">
//                     {sortedData.filter((c) => c.status === "completed").length}
//                     <span className="text-xl text-gray-500">/{sortedData.length}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Interview Details Modal */}
//         {showHistory && selectedCandidate && (
//           <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl">
//               <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-200 z-10">
//                 <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//                   <LayoutDashboard className="w-5 h-5 text-purple-600" />
//                   Interview Details - {selectedCandidate.Application?.user?.username || "Anonymous"}
//                 </h3>
//                 <button
//                   onClick={() => setShowHistory(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Tabs */}
//               <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//                 <div className="flex gap-2 flex-wrap">
//                   {['overview', 'questions', 'dsa', 'resume_conversations'].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
//                         activeTab === tab
//                           ? 'bg-purple-600 text-white shadow-md'
//                           : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                       }`}
//                     >
//                       {tab === 'overview' && <LayoutDashboard className="w-4 h-4" />}
//                       {tab === 'questions' && <MessageSquare className="w-4 h-4" />}
//                       {tab === 'dsa' && <FileCode className="w-4 h-4" />}
//                       {tab === 'resume_conversations' && <BarChart2 className="w-4 h-4" />}
//                       {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-8 text-gray-700">
//                 {activeTab === 'overview' && (
//                   <div className="space-y-8">
//                     {/* Summary */}
//                     <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                       <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <LayoutDashboard className="w-5 h-5 text-purple-500" />
//                         Summary
//                       </h4>
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                         <div className="group relative text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Final Score</p>
//                           <div className={`inline-flex px-4 py-2 rounded-full text-xl font-bold border ${getScoreColor(getEffectiveScore(selectedCandidate))} group-hover:scale-105 transition-transform duration-300`}>
//                             {getEffectiveScore(selectedCandidate).toFixed(1)}
//                           </div>
//                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                             <span className="text-xs text-gray-500 bg-white p-2 rounded-md shadow-md">Overall performance score</span>
//                           </div>
//                         </div>
//                         <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Status</p>
//                           <p className="mt-1">{getStatusBadge(selectedCandidate.status)}</p>
//                         </div>
//                         <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Recommendation</p>
//                           <p className="text-sm font-medium text-gray-900">{selectedCandidate.recommendation || "N/A"}</p>
//                         </div>
//                         <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                           <p className="text-sm text-gray-500 mb-2">Duration</p>
//                           <p className="text-sm font-medium text-gray-900">
//                             {selectedCandidate.start_time && selectedCandidate.end_time
//                               ? `${Math.round(
//                                   (new Date(selectedCandidate.end_time) - new Date(selectedCandidate.start_time)) / (1000 * 60)
//                                 )} min`
//                               : "In Progress"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Feedback */}
//                     {selectedCandidate.feedback ? (
//                       <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <BookOpen className="w-5 h-5 text-blue-500" />
//                           Overall Feedback
//                         </h4>
//                         <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
//                           <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.feedback}</p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No feedback available.</p>
//                       </div>
//                     )}

//                     {/* Strengths */}
//                     {selectedCandidate.strengths ? (
//                       <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                         <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <Star className="w-5 h-5 text-green-500" />
//                           Strengths
//                         </h4>
//                         <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
//                           <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.strengths}</p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No strengths available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === 'questions' && (
//                   <div className="space-y-8">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <MessageSquare className="w-5 h-5 text-purple-500" />
//                       Question-wise Performance
//                     </h4>
//                     {selectedCandidate.session && selectedCandidate.session.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedCandidate.session.map((item, index) => (
//                           <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//                             <div className="flex justify-between items-start mb-4">
//                               <h5 className="text-lg font-medium text-gray-900">Question {index + 1}</h5>
//                               {item.score && (
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(item.score)}`}>
//                                   {item.score.toFixed(1)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-4">
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Main Question:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {item.Customquestion?.question || "N/A"}
//                                 </p>
//                               </div>
//                               {item.Customquestion?.answer && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Expected Answer:</p>
//                                   <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                     {item.Customquestion.answer}
//                                   </p>
//                                 </div>
//                               )}
//                               {item.followups && item.followups.length > 0 && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-2">Follow-up Questions:</p>
//                                   <div className="space-y-3">
//                                     {item.followups.map((qa, qaIndex) => (
//                                       <div key={qaIndex} className="bg-gray-50 p-4 rounded-md border border-gray-200">
//                                         <p className="text-sm font-medium text-blue-600 mb-1">Q: {qa.question}</p>
//                                         <p className="text-sm text-gray-700">A: {qa.answer || "N/A"}</p>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               )}
//                               {item.feedback && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Feedback:</p>
//                                   <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
//                                     {item.feedback}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No question data available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === 'dsa' && (
//                   <div className="space-y-8">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <FileCode className="w-5 h-5 text-cyan-500" />
//                       DSA Topics
//                     </h4>
//                     {selectedCandidate.dsa && selectedCandidate.dsa.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedCandidate.dsa.map((dsa, index) => (
//                           <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//                             <div className="flex justify-between items-start mb-4">
//                               <h5 className="text-lg font-medium text-gray-900">
//                                 {dsa.topic?.topic} ({dsa.topic?.difficulty})
//                               </h5>
//                               {dsa.score && (
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(dsa.score)}`}>
//                                   {dsa.score.toFixed(1)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-4">
//                               {dsa.question && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Question:</p>
//                                   <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                     {typeof dsa.question === 'string' ? JSON.parse(dsa.question).description : "N/A"}
//                                   </p>
//                                 </div>
//                               )}
//                               {dsa.code && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Code:</p>
//                                   <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200 overflow-x-auto">
//                                     <code>{dsa.code}</code>
//                                   </pre>
//                                 </div>
//                               )}
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Created At:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {formatDateTime(dsa.created_at)}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No DSA topics available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === 'resume_conversations' && (
//                   <div className="space-y-8">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <BarChart2 className="w-5 h-5 text-blue-500" />
//                       Resume Conversations
//                     </h4>
//                     {selectedCandidate.resume_conversations && selectedCandidate.resume_conversations.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedCandidate.resume_conversations.map((conv, index) => (
//                           <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
//                             <div className="flex justify-between items-start mb-4">
//                               <h5 className="text-lg font-medium text-gray-900">Conversation {index + 1}</h5>
//                               {conv.score && (
//                                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(conv.score)}`}>
//                                   {conv.score.toFixed(1)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="space-y-4">
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Question:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {conv.question || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Expected Answer:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {conv.expected_answer || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm font-medium text-purple-600 mb-1">Candidate Answer:</p>
//                                 <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
//                                   {conv.answer || "N/A"}
//                                 </p>
//                               </div>
//                               {conv.feedback && (
//                                 <div>
//                                   <p className="text-sm font-medium text-purple-600 mb-1">Feedback:</p>
//                                   <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
//                                     {conv.feedback}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                         <BarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <p className="text-gray-500 text-lg">No resume conversations available.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Application Details Modal */}
//         {showApplication && selectedApplication && (
//           <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
//               <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 flex justify-between items-center border-b border-gray-200">
//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={() => setShowApplication(false)}
//                     className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                   </button>
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     Application Details - {selectedApplication.user?.username || "Anonymous"}
//                   </h3>
//                 </div>
//                 <button
//                   onClick={() => setShowApplication(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <div className="p-6 space-y-8">
//                 {/* Application Summary */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                   <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                     <User className="w-5 h-5 text-purple-500" />
//                     Application Summary
//                   </h4>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                     <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
//                         <User className="w-6 h-6 text-white" />
//                       </div>
//                       <h5 className="text-lg font-semibold text-gray-900 mb-1">{selectedApplication.user?.username || "Anonymous"}</h5>
//                       <p className="text-sm text-gray-500">Application ID: {selectedApplication.id}</p>
//                     </div>
//                     <div className="group relative text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="mb-3">
//                         <Star className="w-8 h-8 text-yellow-500 mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-500 mb-1">Application Score</p>
//                       <div className={`inline-flex px-4 py-2 rounded-full text-xl font-bold border ${getScoreColor(selectedApplication.score)} group-hover:scale-105 transition-transform duration-300`}>
//                         {typeof selectedApplication.score === 'number' ? selectedApplication.score.toFixed(1) : "N/A"}
//                       </div>
//                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <span className="text-xs text-gray-500 bg-white p-2 rounded-md shadow-md">Application evaluation score</span>
//                       </div>
//                     </div>
//                     <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="mb-3">
//                         <Calendar className="w-8 h-8 text-blue-500 mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-500 mb-1">Applied On</p>
//                       <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedApplication.applied_at)}</p>
//                     </div>
//                     <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
//                       <div className="mb-3">
//                         <Target className="w-8 h-8 text-green-500 mx-auto" />
//                       </div>
//                       <p className="text-sm text-gray-500 mb-1">Decision</p>
//                       <div className="flex justify-center mt-2">{getDecisionBadge(selectedApplication.shortlisting_decision)}</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Application Feedback */}
//                 {selectedApplication.feedback ? (
//                   <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                       <BookOpen className="w-5 h-5 text-blue-500" />
//                       Application Feedback
//                     </h4>
//                     <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
//                       <p className="text-gray-700 leading-relaxed">{selectedApplication.feedback}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                     <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-500 text-lg">No application feedback available.</p>
//                   </div>
//                 )}

//                 {/* Resume Section */}
//                 <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                   <div className="flex items-center justify-between mb-6">
//                     <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <FileText className="w-5 h-5 text-green-500" />
//                       Resume
//                     </h4>
//                     <div className="flex bg-gray-200 rounded-lg p-1">
//                       <button
//                         onClick={() => setResumeView('extracted')}
//                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
//                           resumeView === 'extracted' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                         }`}
//                       >
//                         Extracted
//                       </button>
//                       <button
//                         onClick={() => setResumeView('original')}
//                         className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
//                           resumeView === 'original' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                         }`}
//                       >
//                         Original
//                       </button>
//                     </div>
//                   </div>
//                   {resumeView === 'extracted' ? (
//                     <div className="space-y-8">
//                       {(() => {
//                         const resumeData = parseExtractedResume(selectedApplication.extratedResume);
//                         if (!resumeData) {
//                           return (
//                             <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
//                               <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                               <p className="text-gray-500 text-lg">No extracted resume data available.</p>
//                             </div>
//                           );
//                         }
//                         return (
//                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             {resumeData.personalDetails.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
//                                     <User className="w-5 h-5 text-blue-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Personal Details</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.personalDetails.map((detail, index) => (
//                                     <div key={index} className="flex items-start gap-2 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
//                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
//                                       <p className="text-gray-700 text-sm leading-relaxed">{detail}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.skills.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-green-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
//                                     <Code className="w-5 h-5 text-green-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">Skills</h5>
//                                 </div>
//                                 <div className="flex flex-wrap gap-2">
//                                   {resumeData.skills.map((skill, index) => (
//                                     <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 hover:bg-green-200 transition-colors">
//                                       {skill}
//                                     </span>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.experience.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-300 lg:col-span-2">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
//                                     <Briefcase className="w-5 h-5 text-purple-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Experience</h5>
//                                 </div>
//                                 <div className="space-y-4">
//                                   {resumeData.experience.map((exp, index) => (
//                                     <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{exp}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.education.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-yellow-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
//                                     <GraduationCap className="w-5 h-5 text-yellow-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">Education</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.education.map((edu, index) => (
//                                     <div key={index} className="p-4 bg-yellow-50 rounded-md border border-yellow-200 hover:bg-yellow-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{edu}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.certifications.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-orange-300">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
//                                     <AwardIcon className="w-5 h-5 text-orange-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">Certifications</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.certifications.map((cert, index) => (
//                                     <div key={index} className="p-4 bg-orange-50 rounded-md border border-orange-200 hover:bg-orange-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{cert}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.projects.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-cyan-300 lg:col-span-2">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
//                                     <Code className="w-5 h-5 text-cyan-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">Projects</h5>
//                                 </div>
//                                 <div className="space-y-4">
//                                   {resumeData.projects.map((project, index) => {
//                                     const lines = project.split('\n').filter((line) => line.trim());
//                                     const firstLine = lines[0] || '';
//                                     const projectName = parseProjectName(firstLine);
//                                     const projectMatch = firstLine.match(/\|\s*(.+?)\s*\((\d{4})\)/);
//                                     const techStack = projectMatch ? projectMatch[1].split(',').map((t) => t.trim()) : [];
//                                     const year = projectMatch ? projectMatch[2] : new Date().getFullYear();
//                                     const descriptionLines = lines.slice(1).filter((line) => line.trim().startsWith('-') || line.trim().match(/^\s/));
//                                     return (
//                                       <div key={index} className="bg-gray-50 p-5 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
//                                         <div className="flex items-center justify-between mb-3">
//                                           <h6 className="text-lg font-bold text-gray-900">{projectName}</h6>
//                                           <span className="text-sm text-gray-500">{year}</span>
//                                         </div>
//                                         {techStack.length > 0 && (
//                                           <div className="flex flex-wrap gap-2 mb-4">
//                                             {techStack.map((tech, techIndex) => (
//                                               <span key={techIndex} className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded-full">
//                                                 {tech}
//                                               </span>
//                                             ))}
//                                           </div>
//                                         )}
//                                         {descriptionLines.length > 0 && (
//                                           <div className="space-y-2">
//                                             {descriptionLines.map((desc, descIndex) => (
//                                               <p key={descIndex} className="text-sm text-gray-700">
//                                                 {desc.replace(/^[-\s]+/, '').trim()}
//                                               </p>
//                                             ))}
//                                           </div>
//                                         )}
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             )}
//                             {resumeData.achievements.length > 0 && (
//                               <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:border-amber-300 lg:col-span-2">
//                                 <div className="flex items-center gap-3 mb-5">
//                                   <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
//                                     <Trophy className="w-5 h-5 text-amber-600" />
//                                   </div>
//                                   <h5 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">Achievements</h5>
//                                 </div>
//                                 <div className="space-y-3">
//                                   {resumeData.achievements.map((achievement, index) => (
//                                     <div key={index} className="p-4 bg-amber-50 rounded-md border border-amber-200 hover:bg-amber-100 transition-colors">
//                                       <p className="text-gray-700 text-sm leading-relaxed">{achievement}</p>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })()}
//                     </div>
//                   ) : (
//                     <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
//                       {selectedApplication.resume ? (
//                         <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-inner">
//                           <div className="flex justify-between items-center mb-4">
//                             <p className="text-gray-700 text-sm">View the embedded resume or click download to access the original PDF.</p>
//                             {selectedApplication.resume && (
//                               <a
//                                 href={selectedApplication.resume}
//                                 download
//                                 className="text-blue-600 hover:text-blue-800 flex items-center gap-2 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 hover:shadow-md"
//                               >
//                                 <Download className="w-4 h-4" />
//                                 Download PDF
//                               </a>
//                             )}
//                           </div>
//                           <div className="aspect-[4/5] bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md">
//                             <iframe
//                               src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedApplication.resume)}&embedded=true`}
//                               className="w-full h-full"
//                               frameBorder="0"
//                               title="Resume PDF"
//                             ></iframe>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="bg-white rounded-lg p-8 border border-gray-200 text-center shadow-inner">
//                           <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                           <p className="text-gray-500">No original resume available</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//       <Footer />
//       <style jsx>{`
//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer {
//           animation: shimmer 3s infinite linear;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Leaderboard;
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Trophy, Medal, Award, User, Calendar, Clock, TrendingUp, Eye, FileText, Download, ArrowLeft,
  Star, BookOpen, Briefcase, GraduationCap, Code, Award as AwardIcon, Target, CheckCircle,
  XCircle, AlertCircle, LayoutDashboard, MessageSquare, FileCode, BarChart2, Info,
  Users, Activity, Filter, Search, ChevronDown, ChevronUp,
  ImageIcon
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
    if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    if (score >= 40) return "text-orange-600 bg-orange-100 border-orange-200";
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
                            {typeof candidate.Devscore === 'number' ? candidate.Devscore.toFixed(1) : Math.random(0,3).toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(candidate.Resumescore)}`}>
                            {typeof candidate.Resumescore === 'number' ? candidate.Resumescore.toFixed(1) :(Math.random(0,3)*10).toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(candidate.DsaScore)}`}>
                            {typeof candidate.DsaScore === 'number' ? candidate.DsaScore.toFixed(1) : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(candidate.status)}</td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
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

        {/* Interview Details Modal */}
        {showHistory && selectedCandidate && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 flex justify-between items-center border-b border-gray-200 z-10">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  Interview Details - {selectedCandidate.Application?.user?.username || "Anonymous"}
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex gap-2 flex-wrap">
                  {['overview', 'questions', 'dsa', 'resume_conversations'].map((tab) => (
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
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-8 text-gray-700">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Summary */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-blue-500" />
                        Summary
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                        <div className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-inner hover:shadow-md transition-shadow duration-300">
                          <p className="text-sm text-gray-500 mb-2">Duration</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCandidate.start_time && selectedCandidate.end_time
                              ? `${Math.round(
                                  (new Date(selectedCandidate.end_time) - new Date(selectedCandidate.start_time)) / (1000 * 60)
                                )} min`
                              : "In Progress"}
                          </p>
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
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(item.score)}`}>
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
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(dsa.score)}`}>
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
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(conv.score)}`}>
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
                          return (                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
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