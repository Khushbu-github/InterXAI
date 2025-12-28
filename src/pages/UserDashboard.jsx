// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { getAuthToken, fetchWithToken } from "../utils/handleToken";
// // import Header from '../components/ui/header';
// // import Footer from '../components/ui/footer';
// // import { Loader2, Github, Brain, Pencil, Upload, CheckCircle, Clock } from "lucide-react";
// // import { toast} from 'react-toastify';




// // export default function UserDashboard() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [profile, setProfile] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [visible, setVisible] = useState(false);
// //   const [editingField, setEditingField] = useState(null);
// //   const [formData, setFormData] = useState({});
// //   const [viewerType, setViewerType] = useState("guest");
// //   const [interviews, setInterviews] = useState([]);
// //   const [resumeFiles, setResumeFiles] = useState({});
// //   const [uploadingResume, setUploadingResume] = useState({});
// //   const [applyingToInterview, setApplyingToInterview] = useState({});
// //   const API_URL = import.meta.env.VITE_API_URL;
// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       const token = getAuthToken();

// //       const data = await fetchWithToken(
// //         `${API_URL}/users/profile/${id}/`,
// //         token,
// //         navigate
// //       );

// //       if (data) {
// //         setProfile(data.profile);
// //         setFormData(data.profile);
// //         setTimeout(() => setVisible(true), 200);
// //       }

// //       if (token) {
// //         try {
// //           const res = await fetch(`${API_URL}/users/check-user/${id}/`, {
// //             headers: { Authorization: `Token ${token}` },
// //           });

// //           const result = await res.json();
// //           const isOwner = res.ok && result.success;
// //           setViewerType(isOwner ? "owner" : "authenticated");

// //           const interviewsRes = await fetch(`${API_URL}/interview/get-all-interviews/`, {
// //             headers: { Authorization: `Token ${token}` },
// //           });
// //           const interviewData = await interviewsRes.json();
// //           if (interviewsRes.ok) setInterviews(interviewData);
// //         } catch {
// //           setViewerType("guest");
// //         }
// //       } else {
// //         setViewerType("guest");
// //       }

// //       setLoading(false);
// //     };

// //     fetchProfile();
// //   }, [id, navigate]);

// //   const handleChange = (e) => {
// //     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// //   };

// //   const handleSave = async (field) => {
// //     const token = getAuthToken();
// //     try {
// //       const response = await fetch(`${API_URL}/users/profile/`, {
// //         method: "PUT",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Token ${token}`,
// //         },
// //         body: JSON.stringify({ [field]: formData[field] }),
// //       });

// //       const data = await response.json();

// //       if (data.success) {
// //         setProfile((prev) => ({ ...prev, [field]: formData[field] }));
// //         setEditingField(null);
// //       } else {
// //         toast.error("Update failed: " + JSON.stringify(data.errors));
// //       }
// //     } catch (error) {
// //       toast.error("Server error while updating.");
// //     }
// //   };

// //   // Replace your existing handleResumeUpload function with this:

// //   const handleResumeUpload = async (e, interviewId) => {
// //     const file = e.target.files[0];
// //     if (!file) return;
  
// //     // Check file type
// //     if (file.type !== "application/pdf") {
// //       toast.error("Please upload a PDF file only.");
// //       return;
// //     }
  
// //     // Check file size (e.g., max 5MB)
// //     if (file.size > 5 * 1024 * 1024) {
// //       toast.error("File size should not exceed 5MB.");
// //       return;
// //     }
  
// //     setUploadingResume(prev => ({ ...prev, [interviewId]: true }));
  
// //     // Upload directly to Pinata
// //     const formData = new FormData();
// //     formData.append("file", file);
    
// //     // Optional: Add metadata
// //     const metadata = JSON.stringify({
// //       name: `resume_${interviewId}_${file.name}`,
// //       keyvalues: {
// //         interview_id: interviewId,
// //         uploaded_at: new Date().toISOString()
// //       }
// //     });
// //     formData.append("pinataMetadata", metadata);
  
// //     const options = JSON.stringify({
// //       cidVersion: 1,
// //     });
// //     formData.append("pinataOptions", options);
  
// //     try {
// //       const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
// //         method: "POST",
// //         headers: {
// //           // Use the correct environment variable format for your build tool
// //           'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT_TOKEN}`,
// //         },
// //         body: formData,
// //       });
  
// //       const data = await res.json();
      
// //       if (res.ok && data.IpfsHash) {
// //         const fileUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        
// //         // Store the file URL in your state
// //         setResumeFiles((prev) => ({
// //           ...prev,
// //           [interviewId]: fileUrl
// //         }));
        
// //         toast.success("Resume uploaded successfully!");
        
// //       } else {
// //         toast.error("Failed to upload resume.");
// //       }
// //     } catch (err) {
// //       toast.error("Error uploading resume.");
// //     } finally {
// //       setUploadingResume(prev => ({ ...prev, [interviewId]: false }));
// //     }
// //   };

// //   const handleApply = async (interviewId) => {
// //     const token = getAuthToken();
// //     const resumeUrl = resumeFiles[interviewId];
// //     if (!resumeUrl) return toast.error("Please upload your resume first.");

// //     setApplyingToInterview(prev => ({ ...prev, [interviewId]: true }));

// //     try {
// //       const response = await fetch(`${API_URL}/interview/apply-interview/${interviewId}/`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Token ${token}`,
// //         },
// //         body: JSON.stringify({ resume_url: resumeUrl }),

// //       });

// //       const data = await response.json();
// //       if (response.ok) {
// //         toast.success("Application submitted successfully!");
// //         setResumeFiles((prev) => ({ ...prev, [interviewId]: null }));
// //         // Refresh interviews to update the UI
// //         const interviewsRes = await fetch(`${API_URL}/interview/get-all-interviews/`, {
// //           headers: { Authorization: `Token ${token}` },
// //         });
// //         const interviewData = await interviewsRes.json();
// //         if (interviewsRes.ok) setInterviews(interviewData);
// //       } else {
// //         toast.error("Failed to apply: " + (data.error || JSON.stringify(data)));
// //       }
// //     } catch (err) {
// //       toast.error("Error applying to interview.");
// //     } finally {
// //       setApplyingToInterview(prev => ({ ...prev, [interviewId]: false }));
// //     }
// //   };

// //   const renderInterviewActions = (interview) => {
// //     const hasApplied = interview.has_applied || false;
// //     const applicationStatus = interview.application_status || false;
// //     const hasAttempted = interview.attempted || false;
// //     const interviewId = interview.id;

// //     if (hasApplied) {
// //       if (applicationStatus) {
// //         // Application approved - show start interview button
// //         if (hasAttempted) {
// //         // Already attempted the interview
// //         return (
// //           <div className="mt-2 flex items-center gap-2 text-green-600">
// //             <CheckCircle className="w-4 h-4" />
// //             <p>Your result will be announced soon.</p>
// //           </div>
// //         );
// //       } else {
// //         return (
// //           <button
// //             onClick={() => navigate(`/interview/start/${interviewId}`)}
// //             className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
// //           >
// //             <CheckCircle className="w-4 h-4" />
// //             Start Interview
// //           </button>
// //         );
// //       }
// //       } else {
// //         // Application under review
// //         return (
// //           <div className="mt-2 flex items-center gap-2 text-orange-600">
// //             <Clock className="w-4 h-4" />
// //             <p>Your application is under review</p>
// //           </div>
// //         );
// //       }
// //     } else {
// //       // Has not applied yet
// //       const resumeUploaded = resumeFiles[interviewId];
// //       const isUploading = uploadingResume[interviewId];
// //       const isApplying = applyingToInterview[interviewId];

// //       return (
// //         <div className="mt-3 space-y-2">
// //           <div className="flex items-center gap-2">
// //             <input
// //               type="file"
// //               accept="application/pdf"
// //               onChange={(e) => handleResumeUpload(e, interviewId)}
// //               className="text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
// //               disabled={isUploading || isApplying}
// //             />
// //             {isUploading && (
// //               <div className="flex items-center gap-1 text-sm text-blue-600">
// //                 <Loader2 className="w-4 h-4 animate-spin" />
// //                 Uploading...
// //               </div>
// //             )}
// //             {resumeUploaded && !isUploading && (
// //               <div className="flex items-center gap-1 text-sm text-green-600">
// //                 <CheckCircle className="w-4 h-4" />
// //                 Resume uploaded
// //               </div>
// //             )}
// //           </div>
          
// //           <button
// //             onClick={() => handleApply(interviewId)}
// //             disabled={!resumeUploaded || isUploading || isApplying}
// //             className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
// //               !resumeUploaded || isUploading || isApplying
// //                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
// //                 : "bg-blue-600 hover:bg-blue-700 text-white"
// //             }`}
// //           >
// //             {isApplying ? (
// //               <>
// //                 <Loader2 className="w-4 h-4 animate-spin" />
// //                 Applying...
// //               </>
// //             ) : (
// //               <>
// //                 <Upload className="w-4 h-4" />
// //                 Apply
// //               </>
// //             )}
// //           </button>
// //         </div>
// //       );
// //     }
// //   };

// //   const githubUsername = profile?.github || "";
// //   const leetcodeUsername = profile?.leetcode || "";

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center text-gray-700 bg-gray-50">
// //         <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading profile...
// //       </div>
// //     );
// //   }

// //   if (!profile) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">
// //         Profile not found.
// //       </div>
// //     );
// //   }

// //   return (
//     // <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white text-gray-800 relative overflow-hidden">
//     //   <Header viewerType={viewerType} />

//     //   <div className="flex flex-col items-center justify-center py-16 px-4 relative z-10">
//     //     <div className={`max-w-6xl w-full transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//     //       <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-blue-100 relative overflow-hidden">
//     //         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-shimmer"></div>

//     //         <div className="flex flex-col items-center space-y-4">
//     //           {viewerType === "owner" && editingField === "photo" ? (
//     //             <div className="flex flex-col items-center">
//     //               <input
//     //                 type="text"
//     //                 name="photo"
//     //                 value={formData.photo}
//     //                 onChange={handleChange}
//     //                 className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 mb-2"
//     //                 placeholder="Enter photo URL"
//     //               />
//     //               <div className="flex gap-2">
//     //                 <button onClick={() => handleSave("photo")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
//     //                 <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
//     //               </div>
//     //             </div>
//     //           ) : (
//     //             <img
//     //               src={profile.photo}
//     //               alt="User Profile"
//     //               className={`w-24 h-24 rounded-full border-2 border-blue-400 shadow-lg ${viewerType === "owner" ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
//     //               onClick={() => viewerType === "owner" && setEditingField("photo")}
//     //             />
//     //           )}

//     //           <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
//     //             @{profile.username || "Anonymous"}
//     //           </h1>

//     //           <div className="text-center">
//     //             {viewerType === "owner" && editingField === "bio" ? (
//     //               <div className="space-y-2">
//     //                 <textarea
//     //                   name="bio"
//     //                   value={formData.bio}
//     //                   onChange={handleChange}
//     //                   className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 w-full"
//     //                   placeholder="Tell us about yourself..."
//     //                   rows="3"
//     //                 />
//     //                 <div className="flex gap-2">
//     //                   <button onClick={() => handleSave("bio")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
//     //                   <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
//     //                 </div>
//     //               </div>
//     //             ) : (
//     //               <p className="text-sm text-gray-600 flex items-center gap-2">
//     //                 {profile.bio || "This user has not added a bio."}
//     //                 {viewerType === "owner" && <Pencil className="w-4 h-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setEditingField("bio")} />}
//     //               </p>
//     //             )}
//     //           </div>

//     //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6">
//     //             {/* GitHub Card */}
//     //             <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
//     //               <h3 className="text-gray-800 text-lg font-semibold mb-2 flex items-center gap-2">
//     //                 <Github className="w-5 h-5" /> GitHub Stats
//     //                 {viewerType === "owner" && editingField !== "github" && (
//     //                   <Pencil className="w-4 h-4 cursor-pointer ml-auto hover:text-blue-600 transition-colors" onClick={() => setEditingField("github")} />
//     //                 )}
//     //               </h3>
//     //               {viewerType === "owner" && editingField === "github" ? (
//     //                 <div className="space-y-2">
//     //                   <input
//     //                     name="github"
//     //                     value={formData.github}
//     //                     onChange={handleChange}
//     //                     className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 w-full"
//     //                     placeholder="Enter GitHub username"
//     //                   />
//     //                   <div className="flex gap-2">
//     //                     <button onClick={() => handleSave("github")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
//     //                     <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
//     //                   </div>
//     //                 </div>
//     //               ) : (
//     //                 <>
//     //                   <p className="text-sm text-gray-600 mb-2">Username:</p>
//     //                   <a
//     //                     href={`https://github.com/${githubUsername}`}
//     //                     target="_blank"
//     //                     rel="noopener noreferrer"
//     //                     className="text-blue-600 hover:underline break-all"
//     //                   >
//     //                     {githubUsername || "Not set"}
//     //                   </a>
//     //                   {githubUsername && (
//     //                     <div className="mt-4 rounded-xl overflow-hidden">
//     //                       <img
//     //                         src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=default`}
//     //                         alt="GitHub Stats"
//     //                         className="w-full object-cover"
//     //                       />
//     //                     </div>
//     //                   )}
//     //                 </>
//     //               )}
//     //             </div>

//     //             {/* LeetCode Card */}
//     //             <div className="bg-white border border-orange-200 rounded-2xl shadow-xl p-4">
//     //               <h3 className="text-gray-800 text-lg font-semibold mb-2 flex items-center gap-2">
//     //                 <Brain className="w-5 h-5 text-orange-500" /> LeetCode Stats
//     //                 {viewerType === "owner" && editingField !== "leetcode" && (
//     //                   <Pencil className="w-4 h-4 cursor-pointer ml-auto hover:text-blue-600 transition-colors" onClick={() => setEditingField("leetcode")} />
//     //                 )}
//     //               </h3>
//     //               {viewerType === "owner" && editingField === "leetcode" ? (
//     //                 <div className="space-y-2">
//     //                   <input
//     //                     name="leetcode"
//     //                     value={formData.leetcode}
//     //                     onChange={handleChange}
//     //                     className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 w-full"
//     //                     placeholder="Enter LeetCode username"
//     //                   />
//     //                   <div className="flex gap-2">
//     //                     <button onClick={() => handleSave("leetcode")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
//     //                     <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
//     //                   </div>
//     //                 </div>
//     //               ) : (
//     //                 <>
//     //                   <p className="text-sm text-gray-600 mb-2">Username:</p>
//     //                   <a
//     //                     href={`https://leetcode.com/${leetcodeUsername}`}
//     //                     target="_blank"
//     //                     rel="noopener noreferrer"
//     //                     className="text-orange-600 hover:underline break-all"
//     //                   >
//     //                     {leetcodeUsername || "Not set"}
//     //                   </a>
//     //                   {leetcodeUsername && (
//     //                     <div className="mt-4 rounded-xl overflow-hidden">
//     //                       <img
//     //                         src={`https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=light&font=baloo&show_rank=true`}
//     //                         alt="LeetCode Card"
//     //                         className="w-full object-cover"
//     //                       />
//     //                     </div>
//     //                   )}
//     //                 </>
//     //               )}
//     //             </div>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>

//     //     {/* Interviews Section */}
//     //     {viewerType == "owner" && interviews.length > 0 && (
//     //       <div className="max-w-4xl w-full mt-12 space-y-6">
//     //         <h2 className="text-xl font-semibold text-blue-700">Available Interviews</h2>
//     //         {interviews.map((interview) => (
//     //           <div key={interview.id} className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-blue-100 shadow-xl">
//     //             <div className="space-y-3">
//     //               <div>
//     //                 <span className="text-blue-600 font-medium">Position:</span>
//     //                 <p className="text-gray-800 text-lg font-semibold">{interview.post}</p>
//     //               </div>
//     //               <div>
//     //                 <span className="text-blue-600 font-medium">Description:</span>
//     //                 <p className="text-gray-700">{interview.desc}</p>
//     //               </div>
//     //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//     //                 <div>
//     //                   <span className="text-blue-600 font-medium">Experience Required:</span>
//     //                   <p className="text-gray-800">{interview.experience} years</p>
//     //                 </div>
//     //                 <div>
//     //                   <span className="text-blue-600 font-medium">Deadline:</span>
//     //                   <p className="text-gray-800">{new Date(interview.submissionDeadline).toLocaleString()}</p>
//     //                 </div>
//     //               </div>
//     //               {renderInterviewActions(interview)}
//     //             </div>
//     //           </div>
//     //         ))}
//     //       </div>
//     //     )}
//     //   </div>

//     //   <Footer />
//     // </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getAuthToken, fetchWithToken } from "../utils/handleToken";
// import Header from '../components/ui/header';
// import Footer from '../components/ui/footer';
// import { Loader2, Github, Brain, Pencil, Upload, CheckCircle, Clock } from "lucide-react";
// import { toast } from 'react-toastify';

// export default function UserDashboard() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [visible, setVisible] = useState(false);
//   const [editingField, setEditingField] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [viewerType, setViewerType] = useState("guest");
//   const [interviews, setInterviews] = useState([]);

//   // Store CID instead of full URL (important)
//   const [resumeCIDs, setResumeCIDs] = useState({});
//   const [uploadingResume, setUploadingResume] = useState({});
//   const [applyingToInterview, setApplyingToInterview] = useState({});

//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = getAuthToken();

//       const data = await fetchWithToken(
//         `${API_URL}/users/profile/${id}/`,
//         token,
//         navigate
//       );

//       if (data) {
//         setProfile(data.profile);
//         setFormData(data.profile);
//         setTimeout(() => setVisible(true), 200);
//       }

//       if (token) {
//         try {
//           const res = await fetch(`${API_URL}/users/check-user/${id}/`, {
//             headers: { Authorization: `Token ${token}` },
//           });

//           const result = await res.json();
//           const isOwner = res.ok && result.success;
//           setViewerType(isOwner ? "owner" : "authenticated");

//           const interviewsRes = await fetch(`${API_URL}/interview/get-all-interviews/`, {
//             headers: { Authorization: `Token ${token}` },
//           });
//           const interviewData = await interviewsRes.json();
//           if (interviewsRes.ok) setInterviews(interviewData);
//         } catch {
//           setViewerType("guest");
//         }
//       } else {
//         setViewerType("guest");
//       }

//       setLoading(false);
//     };

//     fetchProfile();
//   }, [id, navigate]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSave = async (field) => {
//     const token = getAuthToken();
//     try {
//       const response = await fetch(`${API_URL}/users/profile/`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`,
//         },
//         body: JSON.stringify({ [field]: formData[field] }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setProfile((prev) => ({ ...prev, [field]: formData[field] }));
//         setEditingField(null);
//       } else {
//         toast.error("Update failed: " + JSON.stringify(data.errors));
//       }
//     } catch (error) {
//       toast.error("Server error while updating.");
//     }
//   };

//   // -------------------------------------------------------
//   // ✨ FIXED: Upload resume and store ONLY CID (not gateway URL)
//   // -------------------------------------------------------

//   const handleResumeUpload = async (e, interviewId) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (file.type !== "application/pdf") {
//       toast.error("Please upload a PDF file only.");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("File size should not exceed 5MB.");
//       return;
//     }

//     setUploadingResume(prev => ({ ...prev, [interviewId]: true }));

//     const form = new FormData();
//     form.append("file", file);

//     const metadata = JSON.stringify({
//       name: `resume_${interviewId}_${file.name}`,
//       keyvalues: {
//         interview_id: interviewId,
//         uploaded_at: new Date().toISOString()
//       }
//     });

//     form.append("pinataMetadata", metadata);
//     form.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

//     try {
//       const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
//         method: "POST",
//         headers: {
//           'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT_TOKEN}`,
//         },
//         body: form,
//       });

//       const data = await res.json();

//       if (res.ok && data.IpfsHash) {
//         const cid = data.IpfsHash;

//         setResumeCIDs(prev => ({
//           ...prev,
//           [interviewId]: cid
//         }));

//         toast.success("Resume uploaded successfully!");
//       } else {
//         toast.error("Failed to upload resume.");
//       }
//     } catch (err) {
//       toast.error("Error uploading resume.");
//     } finally {
//       setUploadingResume(prev => ({ ...prev, [interviewId]: false }));
//     }
//   };

//   // -------------------------------------------------------
//   // ✨ FIXED: Apply using resume_cid instead of resume_url
//   // -------------------------------------------------------

//   const handleApply = async (interviewId) => {
//     const token = getAuthToken();
//     const resumeCID = resumeCIDs[interviewId];

//     if (!resumeCID) {
//       return toast.error("Please upload your resume first.");
//     }

//     setApplyingToInterview(prev => ({ ...prev, [interviewId]: true }));

//     try {
//       const response = await fetch(
//         `${API_URL}/interview/apply-interview/${interviewId}/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//           body: JSON.stringify({ resume_cid: resumeCID }), // FIXED
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         toast.success("Application submitted successfully!");
//         setResumeCIDs(prev => ({ ...prev, [interviewId]: null }));

//         // refresh
//         const interviewsRes = await fetch(`${API_URL}/interview/get-all-interviews/`, {
//           headers: { Authorization: `Token ${token}` },
//         });
//         const interviewData = await interviewsRes.json();
//         if (interviewsRes.ok) setInterviews(interviewData);
//       } else {
//         toast.error("Failed to apply: " + (data.error || JSON.stringify(data)));
//       }
//     } catch (err) {
//       toast.error("Error applying to interview.");
//     } finally {
//       setApplyingToInterview(prev => ({ ...prev, [interviewId]: false }));
//     }
//   };

//   // Render Interview Actions
//   const renderInterviewActions = (interview) => {
//     const hasApplied = interview.has_applied || false;
//     const applicationStatus = interview.application_status || false;
//     const hasAttempted = interview.attempted || false;
//     const interviewId = interview.id;

//     if (hasApplied) {
//       if (applicationStatus) {
//         if (hasAttempted) {
//           return (
//             <div className="mt-2 flex items-center gap-2 text-green-600">
//               <CheckCircle className="w-4 h-4" />
//               <p>Your result will be announced soon.</p>
//             </div>
//           );
//         } else {
//           return (
//             <button
//               onClick={() => navigate(`/interview/start/${interviewId}`)}
//               className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//             >
//               <CheckCircle className="w-4 h-4" />
//               Start Interview
//             </button>
//           );
//         }
//       } else {
//         return (
//           <div className="mt-2 flex items-center gap-2 text-orange-600">
//             <Clock className="w-4 h-4" />
//             <p>Your application is under review</p>
//           </div>
//         );
//       }
//     } else {
//       const cidUploaded = resumeCIDs[interviewId];
//       const isUploading = uploadingResume[interviewId];
//       const isApplying = applyingToInterview[interviewId];

//       return (
//         <div className="mt-3 space-y-2">
//           <div className="flex items-center gap-2">
//             <input
//               type="file"
//               accept="application/pdf"
//               onChange={(e) => handleResumeUpload(e, interviewId)}
//               disabled={isUploading || isApplying}
//               className="text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg"
//             />

//             {isUploading && (
//               <div className="flex items-center gap-1 text-sm text-blue-600">
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Uploading...
//               </div>
//             )}

//             {cidUploaded && !isUploading && (
//               <div className="flex items-center gap-1 text-sm text-green-600">
//                 <CheckCircle className="w-4 h-4" />
//                 Resume uploaded
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => handleApply(interviewId)}
//             disabled={!cidUploaded || isUploading || isApplying}
//             className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
//               !cidUploaded || isUploading || isApplying
//                 ? "bg-gray-300 text-gray-500"
//                 : "bg-blue-600 hover:bg-blue-700 text-white"
//             }`}
//           >
//             {isApplying ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Applying...
//               </>
//             ) : (
//               <>
//                 <Upload className="w-4 h-4" />
//                 Apply
//               </>
//             )}
//           </button>
//         </div>
//       );
//     }
//   };

//   // ---------------------------------
//   //   UI BELOW REMAINS THE SAME
//   // ---------------------------------

//   const githubUsername = profile?.github || "";
//   const leetcodeUsername = profile?.leetcode || "";

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-700 bg-gray-50">
//         <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading profile...
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">
//         Profile not found.
//       </div>
//     );
//   }

//   return (
  

//      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white text-gray-800 relative overflow-hidden">
//       <Header viewerType={viewerType} />

//       <div className="flex flex-col items-center justify-center py-16 px-4 relative z-10">
//         <div className={`max-w-6xl w-full transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//           <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-blue-100 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-shimmer"></div>

//             <div className="flex flex-col items-center space-y-4">
//               {viewerType === "owner" && editingField === "photo" ? (
//                 <div className="flex flex-col items-center">
//                   <input
//                     type="text"
//                     name="photo"
//                     value={formData.photo}
//                     onChange={handleChange}
//                     className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 mb-2"
//                     placeholder="Enter photo URL"
//                   />
//                   <div className="flex gap-2">
//                     <button onClick={() => handleSave("photo")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
//                     <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
//                   </div>
//                 </div>
//               ) : (
//                 <img
//                   src={profile.photo}
//                   alt="User Profile"
//                   className={`w-24 h-24 rounded-full border-2 border-blue-400 shadow-lg ${viewerType === "owner" ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
//                   onClick={() => viewerType === "owner" && setEditingField("photo")}
//                 />
//               )}

//               <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
//                 @{profile.username || "Anonymous"}
//               </h1>

//               <div className="text-center">
//                 {viewerType === "owner" && editingField === "bio" ? (
//                   <div className="space-y-2">
//                     <textarea
//                       name="bio"
//                       value={formData.bio}
//                       onChange={handleChange}
//                       className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 w-full"
//                       placeholder="Tell us about yourself..."
//                       rows="3"
//                     />
//                     <div className="flex gap-2">
//                       <button onClick={() => handleSave("bio")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
//                       <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-600 flex items-center gap-2">
//                     {profile.bio || "This user has not added a bio."}
//                     {viewerType === "owner" && <Pencil className="w-4 h-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setEditingField("bio")} />}
//                   </p>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6">
//                 {/* GitHub Card */}
//                 <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
//                   <h3 className="text-gray-800 text-lg font-semibold mb-2 flex items-center gap-2">
//                     <Github className="w-5 h-5" /> GitHub Stats
//                     {viewerType === "owner" && editingField !== "github" && (
//                       <Pencil className="w-4 h-4 cursor-pointer ml-auto hover:text-blue-600 transition-colors" onClick={() => setEditingField("github")} />
//                     )}
//                   </h3>
//                   {viewerType === "owner" && editingField === "github" ? (
//                     <div className="space-y-2">
//                       <input
//                         name="github"
//                         value={formData.github}
//                         onChange={handleChange}
//                         className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 w-full"
//                         placeholder="Enter GitHub username"
//                       />
//                       <div className="flex gap-2">
//                         <button onClick={() => handleSave("github")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
//                         <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <p className="text-sm text-gray-600 mb-2">Username:</p>
//                       <a
//                         href={`https://github.com/${githubUsername}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:underline break-all"
//                       >
//                         {githubUsername || "Not set"}
//                       </a>
//                       {githubUsername && (
//                         <div className="mt-4 rounded-xl overflow-hidden">
//                           <img
//                             src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=default`}
//                             alt="GitHub Stats"
//                             className="w-full object-cover"
//                           />
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* LeetCode Card */}
//                 <div className="bg-white border border-orange-200 rounded-2xl shadow-xl p-4">
//                   <h3 className="text-gray-800 text-lg font-semibold mb-2 flex items-center gap-2">
//                     <Brain className="w-5 h-5 text-orange-500" /> LeetCode Stats
//                     {viewerType === "owner" && editingField !== "leetcode" && (
//                       <Pencil className="w-4 h-4 cursor-pointer ml-auto hover:text-blue-600 transition-colors" onClick={() => setEditingField("leetcode")} />
//                     )}
//                   </h3>
//                   {viewerType === "owner" && editingField === "leetcode" ? (
//                     <div className="space-y-2">
//                       <input
//                         name="leetcode"
//                         value={formData.leetcode}
//                         onChange={handleChange}
//                         className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 w-full"
//                         placeholder="Enter LeetCode username"
//                       />
//                       <div className="flex gap-2">
//                         <button onClick={() => handleSave("leetcode")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
//                         <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <p className="text-sm text-gray-600 mb-2">Username:</p>
//                       <a
//                         href={`https://leetcode.com/${leetcodeUsername}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-orange-600 hover:underline break-all"
//                       >
//                         {leetcodeUsername || "Not set"}
//                       </a>
//                       {leetcodeUsername && (
//                         <div className="mt-4 rounded-xl overflow-hidden">
//                           <img
//                             src={`https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=light&font=baloo&show_rank=true`}
//                             alt="LeetCode Card"
//                             className="w-full object-cover"
//                           />
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Interviews Section */}
//         {viewerType == "owner" && interviews.length > 0 && (
//           <div className="max-w-4xl w-full mt-12 space-y-6">
//             <h2 className="text-xl font-semibold text-blue-700">Available Interviews</h2>
//             {interviews.map((interview) => (
//               <div key={interview.id} className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-blue-100 shadow-xl">
//                 <div className="space-y-3">
//                   <div>
//                     <span className="text-blue-600 font-medium">Position:</span>
//                     <p className="text-gray-800 text-lg font-semibold">{interview.post}</p>
//                   </div>
//                   <div>
//                     <span className="text-blue-600 font-medium">Description:</span>
//                     <p className="text-gray-700">{interview.desc}</p>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-blue-600 font-medium">Experience Required:</span>
//                       <p className="text-gray-800">{interview.experience} years</p>
//                     </div>
//                     <div>
//                       <span className="text-blue-600 font-medium">Deadline:</span>
//                       <p className="text-gray-800">{new Date(interview.submissionDeadline).toLocaleString()}</p>
//                     </div>
//                   </div>
//                   {renderInterviewActions(interview)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>

    
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthToken, fetchWithToken } from "../utils/handleToken";
import Header from '../components/ui/header';
import Footer from '../components/ui/footer';
import { Loader2, Github, Brain, Pencil, Upload, CheckCircle, Clock } from "lucide-react";
import { toast } from 'react-toastify';

export default function UserDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [viewerType, setViewerType] = useState("guest");
  const [interviews, setInterviews] = useState([]);

  // Store both CID and URL for flexibility
  const [resumeData, setResumeData] = useState({});
  const [uploadingResume, setUploadingResume] = useState({});
  const [applyingToInterview, setApplyingToInterview] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();

      const data = await fetchWithToken(
        `${API_URL}/users/profile/${id}/`,
        token,
        navigate
      );

      if (data) {
        setProfile(data.profile);
        setFormData(data.profile);
        setTimeout(() => setVisible(true), 200);
      }

      if (token) {
        try {
          const res = await fetch(`${API_URL}/users/check-user/${id}/`, {
            headers: { Authorization: `Token ${token}` },
          });

          const result = await res.json();
          const isOwner = res.ok && result.success;
          setViewerType(isOwner ? "owner" : "authenticated");

          const interviewsRes = await fetch(`${API_URL}/interview/get-all-interviews/`, {
            headers: { Authorization: `Token ${token}` },
          });
          const interviewData = await interviewsRes.json();
          if (interviewsRes.ok) setInterviews(interviewData);
        } catch {
          setViewerType("guest");
        }
      } else {
        setViewerType("guest");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (field) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_URL}/users/profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ [field]: formData[field] }),
      });

      const data = await response.json();

      if (data.success) {
        setProfile((prev) => ({ ...prev, [field]: formData[field] }));
        setEditingField(null);
      } else {
        toast.error("Update failed: " + JSON.stringify(data.errors));
      }
    } catch (error) {
      toast.error("Server error while updating.");
    }
  };

  // Fixed: Upload resume and store both CID and URL
  const handleResumeUpload = async (e, interviewId) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      return;
    }

    setUploadingResume(prev => ({ ...prev, [interviewId]: true }));

    const form = new FormData();
    form.append("file", file);

    const metadata = JSON.stringify({
      name: `resume_${interviewId}_${file.name}`,
      keyvalues: {
        interview_id: interviewId,
        uploaded_at: new Date().toISOString()
      }
    });

    form.append("pinataMetadata", metadata);
    form.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    try {
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT_TOKEN}`,
        },
        body: form,
      });

      const data = await res.json();

      if (res.ok && data.IpfsHash) {
        const cid = data.IpfsHash;
        const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

        // Store both CID and URL
        setResumeData(prev => ({
          ...prev,
          [interviewId]: { cid, url }
        }));

        toast.success("Resume uploaded successfully!");
      } else {
        toast.error("Failed to upload resume.");
      }
    } catch (err) {
      toast.error("Error uploading resume.");
    } finally {
      setUploadingResume(prev => ({ ...prev, [interviewId]: false }));
    }
  };

  // Fixed: Apply using the appropriate field based on backend expectation
  const handleApply = async (interviewId) => {
    const token = getAuthToken();
    const resume = resumeData[interviewId];

    if (!resume) {
      return toast.error("Please upload your resume first.");
    }

    setApplyingToInterview(prev => ({ ...prev, [interviewId]: true }));

    try {
      // Send BOTH resume_cid and resume_url to backend
      // Backend can choose which one to use
      const response = await fetch(
        `${API_URL}/interview/apply-interview/${interviewId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ 
            resume_cid: resume.cid,
            resume_url: resume.url 
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Application submitted successfully!");
        setResumeData(prev => ({ ...prev, [interviewId]: null }));

        // Refresh interviews
        const interviewsRes = await fetch(`${API_URL}/interview/get-all-interviews/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const interviewData = await interviewsRes.json();
        if (interviewsRes.ok) setInterviews(interviewData);
      } else {
        toast.error("Failed to apply: " + (data.error || JSON.stringify(data)));
      }
    } catch (err) {
      toast.error("Error applying to interview.");
    } finally {
      setApplyingToInterview(prev => ({ ...prev, [interviewId]: false }));
    }
  };

  const renderInterviewActions = (interview) => {
    const hasApplied = interview.has_applied || false;
    const applicationStatus = interview.application_status || false;
    const hasAttempted = interview.attempted || false;
    const interviewId = interview.id;

    if (hasApplied) {
      if (applicationStatus) {
        if (hasAttempted) {
          return (
            <div className="mt-2 flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <p>Your result will be announced soon.</p>
            </div>
          );
        } else {
          return (
            <button
              onClick={() => navigate(`/interview/start/${interviewId}`)}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Start Interview
            </button>
          );
        }
      } else {
        return (
          <div className="mt-2 flex items-center gap-2 text-orange-600">
            <Clock className="w-4 h-4" />
            <p>Your application is under review</p>
          </div>
        );
      }
    } else {
      const resumeUploaded = resumeData[interviewId];
      const isUploading = uploadingResume[interviewId];
      const isApplying = applyingToInterview[interviewId];

      return (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleResumeUpload(e, interviewId)}
              disabled={isUploading || isApplying}
              className="text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
            />

            {isUploading && (
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </div>
            )}

            {resumeUploaded && !isUploading && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Resume uploaded
              </div>
            )}
          </div>

          <button
            onClick={() => handleApply(interviewId)}
            disabled={!resumeUploaded || isUploading || isApplying}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              !resumeUploaded || isUploading || isApplying
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Apply
              </>
            )}
          </button>
        </div>
      );
    }
  };

  const githubUsername = profile?.github || "";
  const leetcodeUsername = profile?.leetcode || "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 bg-gray-50">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white text-gray-800 relative overflow-hidden">
      <Header viewerType={viewerType} />

      <div className="flex flex-col items-center justify-center py-16 px-4 relative z-10">
        <div className={`max-w-6xl w-full transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-shimmer"></div>

            <div className="flex flex-col items-center space-y-4">
              {viewerType === "owner" && editingField === "photo" ? (
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 mb-2"
                    placeholder="Enter photo URL"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleSave("photo")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
                    <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                  </div>
                </div>
              ) : (
                <img
                  src={profile.photo}
                  alt="User Profile"
                  className={`w-24 h-24 rounded-full border-2 border-blue-400 shadow-lg ${viewerType === "owner" ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
                  onClick={() => viewerType === "owner" && setEditingField("photo")}
                />
              )}

              <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                @{profile.username || "Anonymous"}
              </h1>

              <div className="text-center">
                {viewerType === "owner" && editingField === "bio" ? (
                  <div className="space-y-2">
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 w-full"
                      placeholder="Tell us about yourself..."
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSave("bio")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
                      <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    {profile.bio || "This user has not added a bio."}
                    {viewerType === "owner" && <Pencil className="w-4 h-4 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setEditingField("bio")} />}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
                  <h3 className="text-gray-800 text-lg font-semibold mb-2 flex items-center gap-2">
                    <Github className="w-5 h-5" /> GitHub Stats
                    {viewerType === "owner" && editingField !== "github" && (
                      <Pencil className="w-4 h-4 cursor-pointer ml-auto hover:text-blue-600 transition-colors" onClick={() => setEditingField("github")} />
                    )}
                  </h3>
                  {viewerType === "owner" && editingField === "github" ? (
                    <div className="space-y-2">
                      <input
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 w-full"
                        placeholder="Enter GitHub username"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleSave("github")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
                        <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Username:</p>
                      <a
                        href={`https://github.com/${githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {githubUsername || "Not set"}
                      </a>
                      {githubUsername && (
                        <div className="mt-4 rounded-xl overflow-hidden">
                          <img
                            src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=default`}
                            alt="GitHub Stats"
                            className="w-full object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="bg-white border border-orange-200 rounded-2xl shadow-xl p-4">
                  <h3 className="text-gray-800 text-lg font-semibold mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-orange-500" /> LeetCode Stats
                    {viewerType === "owner" && editingField !== "leetcode" && (
                      <Pencil className="w-4 h-4 cursor-pointer ml-auto hover:text-blue-600 transition-colors" onClick={() => setEditingField("leetcode")} />
                    )}
                  </h3>
                  {viewerType === "owner" && editingField === "leetcode" ? (
                    <div className="space-y-2">
                      <input
                        name="leetcode"
                        value={formData.leetcode}
                        onChange={handleChange}
                        className="bg-blue-50 text-gray-800 p-2 rounded border border-blue-200 w-full"
                        placeholder="Enter LeetCode username"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleSave("leetcode")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
                        <button onClick={() => setEditingField(null)} className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">Username:</p>
                      <a
                        href={`https://leetcode.com/${leetcodeUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:underline break-all"
                      >
                        {leetcodeUsername || "Not set"}
                      </a>
                      {leetcodeUsername && (
                        <div className="mt-4 rounded-xl overflow-hidden">
                          <img
                            src={`https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=light&font=baloo&show_rank=true`}
                            alt="LeetCode Card"
                            className="w-full object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {viewerType === "owner" && interviews.length > 0 && (
          <div className="max-w-4xl w-full mt-12 space-y-6">
            <h2 className="text-xl font-semibold text-blue-700">Available Interviews</h2>
            {interviews.map((interview) => (
              <div key={interview.id} className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-blue-100 shadow-xl">
                <div className="space-y-3">
                  <div>
                    <span className="text-blue-600 font-medium">Position:</span>
                    <p className="text-gray-800 text-lg font-semibold">{interview.post}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Description:</span>
                    <p className="text-gray-700">{interview.desc}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-blue-600 font-medium">Experience Required:</span>
                      <p className="text-gray-800">{interview.experience} years</p>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Deadline:</span>
                      <p className="text-gray-800">{new Date(interview.submissionDeadline).toLocaleString()}</p>
                    </div>
                  </div>
                  {renderInterviewActions(interview)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}