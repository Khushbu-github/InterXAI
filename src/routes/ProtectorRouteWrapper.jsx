// // ProctoredRouteWrapper.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useLocation } from 'react-router-dom';

// const ProctoredRouteWrapper = ({ children }) => {
//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [violations, setViolations] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [monitorTime, setMonitorTime] = useState('00:00');
//   const [faceConfidence, setFaceConfidence] = useState('--');
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [systemReady, setSystemReady] = useState(false);
//   const [error, setError] = useState(null);
  
//   const [status, setStatus] = useState({
//     face: { text: 'Face: Detecting...', type: 'safe' },
//     gaze: { text: 'Gaze: Monitoring...', type: 'safe' },
//     focus: { text: 'Focus: Active', type: 'safe' },
//     person: { text: 'People: Checking...', type: 'safe' }
//   });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const monitoringIntervalRef = useRef(null);
//   const lastGazeDirection = useRef('center');
  
//   const params = useParams();
//   const location = useLocation();

//   // Get session info based on route
//   const getSessionInfo = () => {
//     if (location.pathname.includes('/interview/start/')) {
//       return {
//         type: 'INTERVIEW',
//         sessionId: params.interviewId,
//         title: 'Interview Session'
//       };
//     } else if (location.pathname.includes('/dsa-interview-platform/')) {
//       return {
//         type: 'DSA_INTERVIEW',
//         sessionId: params.sessionId,
//         title: 'DSA Interview Platform'
//       };
//     }
//     return { type: 'UNKNOWN', sessionId: 'unknown', title: 'Session' };
//   };

//   const sessionInfo = getSessionInfo();

//   // Logging function - console.log for now, API later
//   const logEvent = (message, type = 'info', data = {}) => {
//     const timestamp = new Date().toISOString();
//     const logData = {
//       timestamp,
//       sessionType: sessionInfo.type,
//       sessionId: sessionInfo.sessionId,
//       route: location.pathname,
//       message,
//       type,
//       violationCount: violations,
//       ...data
//     };
    
//     console.log(`[PROCTORING LOG] ${timestamp} - ${type.toUpperCase()}: ${message}`, logData);
    
//     // TODO: Replace with API call
//     // await sendLogToAPI(logData);
//   };

//   // Initialize system
  // useEffect(() => {
  //    const initializeSystem = async () => {
  //      try {
  //       logEvent('Initializing AI proctoring system for route: ' + location.pathname, 'info');
        
  //        // Load face-api models (if available)
  //        if (typeof window !== 'undefined' && window.faceapi) {
  //          try {
  //            await Promise.all([
  //              window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  //              window.faceapi.nets.faceLandmark68Net.loadFromUri('/models')
  //            ]);
  //            setModelsLoaded(true);
  //            logEvent('AI models loaded successfully', 'success');
  //          } catch (modelError) {
  //            logEvent('AI models failed to load, using basic monitoring', 'warning');
  //            setModelsLoaded(false);
  //          }
  //        } else {
  //          logEvent('face-api.js not available, using basic monitoring', 'warning');
  //          setModelsLoaded(false);
  //        }

  //        await setupCamera();
  //        setupFocusDetection();
  //        setSystemReady(true);
  //        logEvent('Proctoring system ready', 'success');
        
  //        // Auto-start monitoring after 2 seconds
  //        setTimeout(() => {
  //          startMonitoring();
  //        }, 2000);
        
//       } catch (error) {
//         setError(error.message);
//         logEvent(`System initialization failed: ${error.message}`, 'error');
//       }
//     };

//     initializeSystem();
    
//     return () => {
//       stopMonitoring();
//     };
//   }, [location.pathname]); // Re-initialize when route changes

//   const setupCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 640, height: 480, facingMode: 'user' }
//       });
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         logEvent('Camera initialized', 'success');
//       }
//     } catch (error) {
//       throw new Error(`Camera setup failed: ${error.message}`);
//     }
//   };

//   const setupFocusDetection = () => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && isMonitoring) {
//         const violation = {
//           type: 'FOCUS_LOST',
//           action: 'TAB_SWITCH_OR_MINIMIZE',
//           severity: 'HIGH'
//         };
//         logEvent('VIOLATION: User switched tab or minimized window', 'violation', violation);
//         updateStatus('focus', 'Focus: Tab Switched!', 'danger');
//         setViolations(prev => prev + 1);
//       } else if (!document.hidden && isMonitoring) {
//         updateStatus('focus', 'Focus: Active', 'safe');
//         logEvent('User returned to session tab', 'info');
//       }
//     };

//     const handleWindowBlur = () => {
//       if (isMonitoring) {
//         const violation = {
//           type: 'FOCUS_LOST',
//           action: 'WINDOW_BLUR',
//           severity: 'MEDIUM'
//         };
//         logEvent('VIOLATION: Window lost focus', 'violation', violation);
//         updateStatus('focus', 'Focus: Lost!', 'danger');
//         setViolations(prev => prev + 1);
//       }
//     };

//     const handleWindowFocus = () => {
//       if (isMonitoring) {
//         updateStatus('focus', 'Focus: Active', 'safe');
//         logEvent('Window regained focus', 'info');
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('focus', handleWindowFocus);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleWindowBlur);
//       window.removeEventListener('focus', handleWindowFocus);
//     };
//   };

//   const startMonitoring = () => {
//     if (isMonitoring) return;
    
//     setIsMonitoring(true);
//     setStartTime(Date.now());
//     setViolations(0);
    
//     logEvent(`Monitoring started for ${sessionInfo.title}`, 'info', {
//       action: 'MONITORING_STARTED',
//       sessionType: sessionInfo.type,
//       route: location.pathname
//     });

//     monitoringIntervalRef.current = setInterval(() => {
//       detectFaces();
//       updateTimer();
//     }, 1000);
//   };

//   const stopMonitoring = () => {
//     if (!isMonitoring) return;
    
//     setIsMonitoring(false);
//     if (monitoringIntervalRef.current) {
//       clearInterval(monitoringIntervalRef.current);
//     }
    
//     logEvent('Monitoring stopped', 'info', {
//       action: 'MONITORING_STOPPED',
//       totalViolations: violations,
//       duration: monitorTime,
//       route: location.pathname
//     });
//   };

//   const detectFaces = async () => {
//     if (!videoRef.current || videoRef.current.readyState !== 4) return;

//     try {
//       if (modelsLoaded && window.faceapi) {
//         const detections = await window.faceapi
//           .detectAllFaces(videoRef.current, new window.faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();
        
//         analyzeFaceDetections(detections);
//       } else {
//         // Basic monitoring simulation
//         updateStatus('face', 'Face: Basic monitoring', 'warning');
//         updateStatus('gaze', 'Gaze: Basic monitoring', 'warning');
//         updateStatus('person', 'People: Basic monitoring', 'warning');
//       }
//     } catch (error) {
//       logEvent(`Face detection error: ${error.message}`, 'error');
//     }
//   };

//   const analyzeFaceDetections = (detections) => {
//     const faceCount = detections.length;

//     if (faceCount === 0) {
//       const violation = {
//         type: 'FACE_NOT_DETECTED',
//         severity: 'HIGH',
//         faceCount: 0
//       };
//       logEvent('VIOLATION: No face detected', 'violation', violation);
//       updateStatus('face', 'Face: Not Detected!', 'danger');
//       updateStatus('person', 'People: None detected', 'danger');
//       setViolations(prev => prev + 1);
//     } else if (faceCount === 1) {
//       updateStatus('face', 'Face: Detected ✅', 'safe');
//       updateStatus('person', 'People: 1 person', 'safe');
      
//       const confidence = Math.round(detections[0].detection.score * 100);
//       setFaceConfidence(confidence + '%');
//     } else if (faceCount > 1) {
//       const violation = {
//         type: 'MULTIPLE_FACES',
//         severity: 'CRITICAL',
//         faceCount: faceCount
//       };
//       logEvent(`VIOLATION: ${faceCount} people detected`, 'violation', violation);
//       updateStatus('person', `People: ${faceCount} detected!`, 'danger');
//       setViolations(prev => prev + 1);
//     }
//   };

//   const updateStatus = (key, text, type) => {
//     setStatus(prev => ({
//       ...prev,
//       [key]: { text, type }
//     }));
//   };

//   const updateTimer = () => {
//     if (!startTime) return;
    
//     const elapsed = Date.now() - startTime;
//     const minutes = Math.floor(elapsed / 60000);
//     const seconds = Math.floor((elapsed % 60000) / 1000);
    
//     setMonitorTime(
//       `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
//     );
//   };

//   // Keyboard and context menu blocking
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isMonitoring) {
//         const blockedKeys = [
//           { altKey: true, code: 'Tab' },
//           { ctrlKey: true, shiftKey: true, code: 'KeyI' },
//           { code: 'F12' },
//           { ctrlKey: true, code: 'KeyU' },
//           { ctrlKey: true, shiftKey: true, code: 'KeyC' }
//         ];

//         const isBlocked = blockedKeys.some(blocked => 
//           Object.entries(blocked).every(([key, value]) => e[key] === value)
//         );

//         if (isBlocked) {
//           e.preventDefault();
//           const violation = {
//             type: 'KEYBOARD_SHORTCUT',
//             key: e.code,
//             severity: 'MEDIUM'
//           };
//           logEvent(`VIOLATION: Blocked keyboard shortcut: ${e.code}`, 'violation', violation);
//           setViolations(prev => prev + 1);
//         }
//       }
//     };

//     const handleContextMenu = (e) => {
//       if (isMonitoring) {
//         e.preventDefault();
//         const violation = {
//           type: 'RIGHT_CLICK',
//           severity: 'LOW'
//         };
//         logEvent('VIOLATION: Right-click blocked', 'violation', violation);
//         setViolations(prev => prev + 1);
//       }
//     };

//     const handleBeforeUnload = (e) => {
//       if (isMonitoring) {
//         const violation = {
//           type: 'PAGE_EXIT_ATTEMPT',
//           severity: 'CRITICAL'
//         };
//         logEvent('VIOLATION: User attempted to close page', 'violation', violation);
//         e.preventDefault();
//         e.returnValue = 'Are you sure you want to leave the session?';
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('contextmenu', handleContextMenu);
//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('contextmenu', handleContextMenu);
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [isMonitoring]);

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4">
//           <div className="text-center">
//             <div className="text-6xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-white mb-4">Proctoring System Error</h2>
//             <p className="text-white/80 mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all duration-300"
//             >
//               🔄 Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
//       {/* Proctoring Header */}
//       <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <span className="text-2xl">🔒</span>
//                 <div>
//                   <h1 className="text-white font-bold text-lg">{sessionInfo.title}</h1>
//                   <p className="text-white/70 text-sm">AI Proctored Session - ID: {sessionInfo.sessionId}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-6">
//               {/* Status Indicators */}
//               <div className="hidden md:flex items-center space-x-4">
//                 {Object.entries(status).map(([key, { text, type }]) => (
//                   <div key={key} className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm ${
//                     type === 'safe' ? 'bg-green-500/20 text-green-100' :
//                     type === 'warning' ? 'bg-yellow-500/20 text-yellow-100' :
//                     'bg-red-500/20 text-red-100'
//                   }`}>
//                     <span className="text-xs">
//                       {key === 'face' ? '👤' :
//                        key === 'gaze' ? '👀' :
//                        key === 'focus' ? '🖥️' : '👥'}
//                     </span>
//                     <span className="hidden lg:inline">{text}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Stats */}
//               <div className="flex items-center space-x-4 text-white">
//                 <div className="text-center">
//                   <div className="text-sm opacity-70">Time</div>
//                   <div className="font-mono font-bold">{monitorTime}</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-sm opacity-70">Violations</div>
//                   <div className="font-bold text-red-300">{violations}</div>
//                 </div>
//               </div>

//               {/* Controls */}
//               <div className="flex items-center space-x-2">
//                 {isMonitoring ? (
//                   <button
//                     onClick={stopMonitoring}
//                     className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white font-semibold transition-all duration-300"
//                   >
//                     ⏹️ Stop
//                   </button>
//                 ) : (
//                   <button
//                     onClick={startMonitoring}
//                     disabled={!systemReady}
//                     className="px-4 py-2 bg-green-500/80 hover:bg-green-500 disabled:bg-gray-500/50 rounded-lg text-white font-semibold transition-all duration-300"
//                   >
//                     🚀 Start
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Hidden Video for Face Detection */}
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         playsInline
//         className="hidden"
//       />
//       <canvas ref={canvasRef} className="hidden" />

//       {/* Main Content */}
//       <div className="relative">
//         {!systemReady && (
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//               <p className="text-white text-lg">Initializing Proctoring System...</p>
//               <p className="text-white/70 text-sm mt-2">Please allow camera access when prompted</p>
//             </div>
//           </div>
//         )}
        
//         {/* Render the actual route component */}
//         <div className="min-h-screen">
//           {children}
//         </div>
//       </div>

//       {/* Monitoring Indicator */}
//       {isMonitoring && (
//         <div className="fixed bottom-4 right-4 z-50">
//           <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
//             <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//             <span className="font-semibold">RECORDING</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProctoredRouteWrapper;
// EnhancedProctoredRouteWrapper.jsx
// EnhancedProctoredRouteWrapper.jsx
// ProctoredRouteWrapper.jsx
// ProctoredRouteWrapper.jsx
















// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// const ProctoredRouteWrapper = ({ children }) => {
//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [violations, setViolations] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [monitorTime, setMonitorTime] = useState('00:00');
//   const [faceConfidence, setFaceConfidence] = useState('--');
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [systemReady, setSystemReady] = useState(false);
//   const [error, setError] = useState(null);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [lastDetectionTime, setLastDetectionTime] = useState(null);
//   const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
//   const [status, setStatus] = useState({
//     face: { text: 'Face: Detecting...', type: 'safe' },
//     gaze: { text: 'Gaze: Monitoring...', type: 'safe' },
//     focus: { text: 'Focus: Active', type: 'safe' },
//     person: { text: 'People: Checking...', type: 'safe' }
//   });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const monitoringIntervalRef = useRef(null);
//   const lastGazeDirection = useRef('center');
//   const cameraCheckRef = useRef(null);
//   const streamRef = useRef(null);
  
//   const params = useParams();
//   const location = useLocation();

//   // Get session info based on route
//   const getSessionInfo = () => {
//     if (location.pathname.includes('/interview/start/')) {
//       return {
//         type: 'INTERVIEW',
//         sessionId: params.interviewId,
//         title: 'Interview Session'
//       };
//     } else if (location.pathname.includes('/dsa-interview-platform/')) {
//       return {
//         type: 'DSA_INTERVIEW',
//         sessionId: params.sessionId,
//         title: 'DSA Interview Platform'
//       };
//     }
//     return { type: 'UNKNOWN', sessionId: 'unknown', title: 'Session' };
//   };

//   const sessionInfo = getSessionInfo();

//   // Logging function - console.log for now, API later
//   const logEvent = (message, type = 'info', data = {}) => {
//     const timestamp = new Date().toISOString();
//     const logData = {
//       timestamp,
//       sessionType: sessionInfo.type,
//       sessionId: sessionInfo.sessionId,
//       route: location.pathname,
//       message,
//       type,
//       violationCount: violations,
//       isMonitoring,
//       monitorTime,
//       faceConfidence,
//       systemReady,
//       cameraActive,
//       cameraPermissionGranted,
//       ...data
//     };
    
//     console.log(`[PROCTORING LOG] ${timestamp} - ${type.toUpperCase()}: ${message}`, logData);
//   };

//   // Log system status every 10 seconds instead of every second
//   const logSystemStatus = () => {
//     if (!isMonitoring) return;
    
//     logEvent('System heartbeat', 'heartbeat', {
//       currentStatus: status,
//       violations: violations,
//       duration: monitorTime,
//       faceConfidence: faceConfidence,
//       videoReady: videoRef.current?.readyState === 4,
//       documentHidden: document.hidden,
//       windowFocused: document.hasFocus(),
//       cameraActive: cameraActive,
//       timestamp: Date.now()
//     });
//   };



//   useEffect(() => {
//     const initializeSystem = async () => {
//       try {
//         logEvent('Initializing AI proctoring system for route: ' + location.pathname, 'info');
        
//         // Load face-api models (if available)
//         if (typeof window !== 'undefined' && window.faceapi) {
//           try {
//             await Promise.all([
//               window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//               window.faceapi.nets.faceLandmark68Net.loadFromUri('/models')
//             ]);
//             setModelsLoaded(true);
//             logEvent('AI models loaded successfully', 'success');
//           } catch (modelError) {
//             logEvent('AI models failed to load, using basic monitoring', 'warning');
//             setModelsLoaded(false);
//           }
//         } else {
//           logEvent('face-api.js not available, using basic monitoring', 'warning');
//           setModelsLoaded(false);
//         }
  
//         await setupCamera();
//         setupFocusDetection();
        
//         // Give a moment for camera to fully initialize
//         setTimeout(() => {
//           setSystemReady(true);
//           logEvent('Proctoring system ready', 'success');
          
//           // Auto-start monitoring for interview route immediately
//           if (location.pathname.includes('/interview/start/') && cameraPermissionGranted) {
//             logEvent('Auto-starting monitoring for interview', 'info');
//             startMonitoring();
//           }
//         }, 1000);
        
//       } catch (error) {
//         setError(error.message);
//         logEvent(`System initialization failed: ${error.message}`, 'error');
//       }
//     };
  
//     initializeSystem();
    
//     return () => {
//       logEvent('Component unmounting - cleaning up monitoring', 'info');
//       stopMonitoring();
//       cleanup();
//     };
//   }, [location.pathname, cameraPermissionGranted]);

//   const cleanup = () => {
//     if (monitoringIntervalRef.current) {
//       clearInterval(monitoringIntervalRef.current);
//     }
//     if (cameraCheckRef.current) {
//       clearInterval(cameraCheckRef.current);
//     }
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//     }
//   };

//   const setupCamera = async () => {
//     try {
//       logEvent('Requesting camera access...', 'info');
      
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           width: { ideal: 640 }, 
//           height: { ideal: 480 }, 
//           facingMode: 'user' 
//         }
//       });
      
//       streamRef.current = stream;
//       setCameraPermissionGranted(true);
//       logEvent('Camera permission granted', 'success');
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
        
//         // Wait for video to be ready with better error handling
//         return new Promise((resolve, reject) => {
//           let resolved = false;
          
//           const timeout = setTimeout(() => {
//             if (!resolved) {
//               resolved = true;
//               logEvent('Video loading timeout - but continuing anyway', 'warning');
//               // Don't reject, just resolve with warning
//               // The camera might still work even if metadata loading is slow
//               setCameraActive(true);
//               resolve();
//             }
//           }, 5000); // Reduced timeout to 5 seconds

//           const handleSuccess = () => {
//             if (!resolved) {
//               resolved = true;
//               clearTimeout(timeout);
//               logEvent('Camera metadata loaded successfully', 'success');
//               setCameraActive(true);
//               resolve();
//             }
//           };

//           const handleError = (error) => {
//             if (!resolved) {
//               resolved = true;
//               clearTimeout(timeout);
//               logEvent('Video element error', 'error');
//               setCameraActive(false);
//               reject(error);
//             }
//           };

//           // Multiple event listeners for better compatibility
//           videoRef.current.onloadedmetadata = handleSuccess;
//           videoRef.current.oncanplay = handleSuccess;
//           videoRef.current.onloadeddata = handleSuccess;
//           videoRef.current.onerror = handleError;
          
//           // Try to play immediately
//           videoRef.current.play().then(() => {
//             logEvent('Video play started immediately', 'success');
//             handleSuccess();
//           }).catch(playError => {
//             logEvent(`Video autoplay failed (this is normal): ${playError.message}`, 'info');
//             // Don't reject - autoplay failure is common and not critical
//           });

//           // Fallback: if video dimensions are available, consider it ready
//           const checkDimensions = () => {
//             if (videoRef.current && videoRef.current.videoWidth > 0) {
//               logEvent('Video dimensions detected, considering ready', 'info');
//               handleSuccess();
//             }
//           };

//           // Check dimensions after a short delay
//           setTimeout(checkDimensions, 1000);
//           setTimeout(checkDimensions, 2000);
//         });
//       }
//     } catch (error) {
//       setCameraActive(false);
//       setCameraPermissionGranted(false);
//       logEvent(`Camera setup failed: ${error.message}`, 'error');
      
//       // More specific error messages
//       if (error.name === 'NotAllowedError') {
//         throw new Error('Camera access denied. Please allow camera permission and refresh.');
//       } else if (error.name === 'NotFoundError') {
//         throw new Error('No camera found. Please connect a camera and refresh.');
//       } else if (error.name === 'NotReadableError') {
//         throw new Error('Camera is busy or not available. Please close other applications using the camera.');
//       } else {
//         throw new Error(`Camera setup failed: ${error.message}`);
//       }
//     }
//   };

//   const setupFocusDetection = () => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && isMonitoring) {
//         const violation = {
//           type: 'FOCUS_LOST',
//           action: 'TAB_SWITCH_OR_MINIMIZE',
//           severity: 'HIGH'
//         };
//         logEvent('VIOLATION: User switched tab or minimized window', 'violation', violation);
//         updateStatus('focus', 'Focus: Tab Switched!', 'danger');
//         setViolations(prev => prev + 1);
//       } else if (!document.hidden && isMonitoring) {
//         updateStatus('focus', 'Focus: Active', 'safe');
//         logEvent('User returned to session tab', 'info');
//       }
//     };

//     const handleWindowBlur = () => {
//       if (isMonitoring) {
//         const violation = {
//           type: 'FOCUS_LOST',
//           action: 'WINDOW_BLUR',
//           severity: 'MEDIUM'
//         };
//         logEvent('VIOLATION: Window lost focus', 'violation', violation);
//         updateStatus('focus', 'Focus: Lost!', 'danger');
//         setViolations(prev => prev + 1);
//       }
//     };

//     const handleWindowFocus = () => {
//       if (isMonitoring) {
//         updateStatus('focus', 'Focus: Active', 'safe');
//         logEvent('Window regained focus', 'info');
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('focus', handleWindowFocus);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleWindowBlur);
//       window.removeEventListener('focus', handleWindowFocus);
//     };
//   };

//   const startMonitoring = () => {
//     if (isMonitoring) return;
    
//     setIsMonitoring(true);
//     setStartTime(Date.now());
//     setViolations(0);
    
//     logEvent(`Monitoring started for ${sessionInfo.title}`, 'info', {
//       action: 'MONITORING_STARTED',
//       sessionType: sessionInfo.type,
//       route: location.pathname
//     });

//     // Start continuous monitoring
//     monitoringIntervalRef.current = setInterval(() => {
//       try {
//         detectFaces();
//         updateTimer();
//       } catch (error) {
//         logEvent(`Monitoring error: ${error.message}`, 'error');
//       }
//     }, 2000); // Check every 2 seconds instead of 1

//     // Log system status every 10 seconds
//     const statusInterval = setInterval(() => {
//       logSystemStatus();
//     }, 10000);

//     // Store status interval reference for cleanup
//     monitoringIntervalRef.statusInterval = statusInterval;
//   };

//   const stopMonitoring = () => {
//     if (!isMonitoring) return;
    
//     setIsMonitoring(false);
//     if (monitoringIntervalRef.current) {
//       clearInterval(monitoringIntervalRef.current);
//       if (monitoringIntervalRef.statusInterval) {
//         clearInterval(monitoringIntervalRef.statusInterval);
//       }
//     }
    
//     logEvent('Monitoring stopped', 'info', {
//       action: 'MONITORING_STOPPED',
//       totalViolations: violations,
//       duration: monitorTime,
//       route: location.pathname
//     });
//   };

//   const isCameraWorking = () => {
//     if (!videoRef.current) return false;
//     if (!cameraPermissionGranted) return false;
    
//     // More lenient check - just need some video data
//     const video = videoRef.current;
//     if (video.readyState >= 1) { // HAVE_METADATA or higher
//       return true;
//     }
    
//     // Also check if video has dimensions (alternative readiness indicator)
//     if (video.videoWidth > 0 && video.videoHeight > 0) {
//       return true;
//     }
    
//     return false;
//   };

//   const detectFaces = async () => {
//     // First check if camera is working
//     if (!isCameraWorking()) {
//       if (!cameraPermissionGranted) {
//         updateStatus('face', 'Face: Camera Permission Needed', 'warning');
//         updateStatus('person', 'People: Camera Permission Needed', 'warning');
//         updateStatus('gaze', 'Gaze: Camera Permission Needed', 'warning');
//         setFaceConfidence('No Permission');
//         return;
//       }

//       if (!videoRef.current) {
//         updateStatus('face', 'Face: Loading...', 'warning');
//         updateStatus('person', 'People: Loading...', 'warning');
//         updateStatus('gaze', 'Gaze: Loading...', 'warning');
//         setFaceConfidence('Loading...');
//         return;
//       }

//       if (videoRef.current.readyState < 2) {
//         updateStatus('face', 'Face: Camera Starting...', 'warning');
//         updateStatus('person', 'People: Camera Starting...', 'warning');
//         updateStatus('gaze', 'Gaze: Camera Starting...', 'warning');
//         setFaceConfidence('Starting...');
//         return;
//       }
//     }

//     // Check if video feed is actually providing frames
//     const canvas = canvasRef.current;
//     if (canvas && videoRef.current) {
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth || 640;
//       canvas.height = videoRef.current.videoHeight || 480;
      
//       try {
//         ctx.drawImage(videoRef.current, 0, 0);
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const pixels = imageData.data;
        
//         // Calculate average brightness more accurately
//         let totalBrightness = 0;
//         let pixelCount = 0;
        
//         for (let i = 0; i < pixels.length; i += 4) {
//           const r = pixels[i];
//           const g = pixels[i + 1];
//           const b = pixels[i + 2];
//           const brightness = (r + g + b) / 3;
//           totalBrightness += brightness;
//           pixelCount++;
//         }
        
//         const avgBrightness = totalBrightness / pixelCount;
        
//         // More lenient threshold - only flag if extremely dark (< 5) AND no variation
//         if (avgBrightness < 5) {
//           // Check for variation in pixels
//           let variation = 0;
//           for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel
//             const r = pixels[i];
//             const g = pixels[i + 1];
//             const b = pixels[i + 2];
//             const brightness = (r + g + b) / 3;
//             variation += Math.abs(brightness - avgBrightness);
//           }
          
//           const avgVariation = variation / (pixelCount / 4);
          
//           // Only flag as blocked if very dark AND no variation (solid black)
//           if (avgVariation < 2) {
//             const violation = {
//               type: 'CAMERA_BLOCKED',
//               severity: 'HIGH',
//               reason: 'Camera appears to be covered or blocked',
//               avgBrightness,
//               avgVariation
//             };
//             logEvent('VIOLATION: Camera appears blocked - very dark with no variation', 'violation', violation);
//             updateStatus('face', 'Face: Camera Covered!', 'danger');
//             updateStatus('person', 'People: Camera Covered!', 'danger');
//             updateStatus('gaze', 'Gaze: Camera Covered!', 'danger');
//             setFaceConfidence('Blocked');
//             setViolations(prev => prev + 1);
//             return;
//           }
//         }
//       } catch (canvasError) {
//         logEvent('Canvas drawing failed', 'warning', { error: canvasError.message });
//         // Don't immediately flag as violation - camera might still be starting
//         updateStatus('face', 'Face: Processing...', 'warning');
//         updateStatus('person', 'People: Processing...', 'warning');
//         updateStatus('gaze', 'Gaze: Processing...', 'warning');
//         setFaceConfidence('Processing...');
//         return;
//       }
//     }

//     // Now proceed with actual face detection
//     try {
//       if (modelsLoaded && window.faceapi) {
//         const detections = await window.faceapi
//           .detectAllFaces(videoRef.current, new window.faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();
        
//         analyzeFaceDetections(detections);
//         setLastDetectionTime(Date.now());
//       } else {
//         // Basic detection without AI models
//         updateStatus('face', 'Face: Basic Detection ⚠️', 'warning');
//         updateStatus('gaze', 'Gaze: Basic Monitor', 'warning');
//         updateStatus('person', 'People: Basic Count', 'warning');
//         setFaceConfidence('Basic Mode');
//       }
//     } catch (error) {
//       logEvent(`Face detection error: ${error.message}`, 'error', { 
//         errorStack: error.stack,
//         videoReadyState: videoRef.current?.readyState,
//         cameraActive: cameraActive
//       });
      
//       // Show error state but don't immediately flag as violation
//       updateStatus('face', 'Face: Detection Issue', 'warning');
//       updateStatus('gaze', 'Gaze: Detection Issue', 'warning');
//       updateStatus('person', 'People: Detection Issue', 'warning');
//       setFaceConfidence('Error');
//     }
//   };

//   const analyzeFaceDetections = (detections) => {
//     const faceCount = detections.length;

//     if (faceCount === 0) {
//       // Don't immediately flag as violation - might be temporary
//       updateStatus('face', 'Face: Not Detected', 'warning');
//       updateStatus('person', 'People: None detected', 'warning');
//       setFaceConfidence('0%');
      
//       // Only flag as violation after sustained absence
//       if (!lastDetectionTime || Date.now() - lastDetectionTime > 10000) { // 10 seconds
//         const violation = {
//           type: 'FACE_NOT_DETECTED',
//           severity: 'MEDIUM',
//           faceCount: 0,
//           duration: lastDetectionTime ? Date.now() - lastDetectionTime : 0
//         };
//         logEvent('VIOLATION: No face detected for extended period', 'violation', violation);
//         updateStatus('face', 'Face: Not Detected!', 'danger');
//         setViolations(prev => prev + 1);
//       }
//     } else if (faceCount === 1) {
//       updateStatus('face', 'Face: Detected ✅', 'safe');
//       updateStatus('person', 'People: 1 person', 'safe');
//       updateStatus('gaze', 'Gaze: Looking ahead', 'safe');
      
//       const confidence = Math.round(detections[0].detection.score * 100);
//       setFaceConfidence(confidence + '%');
//       setLastDetectionTime(Date.now());
//     } else if (faceCount > 1) {
//       const violation = {
//         type: 'MULTIPLE_FACES',
//         severity: 'CRITICAL',
//         faceCount: faceCount
//       };
//       logEvent(`VIOLATION: ${faceCount} people detected`, 'violation', violation);
//       updateStatus('person', `People: ${faceCount} detected!`, 'danger');
//       setViolations(prev => prev + 1);
//     }
//   };

//   const updateStatus = (key, text, type) => {
//     setStatus(prev => ({
//       ...prev,
//       [key]: { text, type }
//     }));
//   };

//   const updateTimer = () => {
//     if (!startTime) return;
    
//     const elapsed = Date.now() - startTime;
//     const minutes = Math.floor(elapsed / 60000);
//     const seconds = Math.floor((elapsed % 60000) / 1000);
    
//     setMonitorTime(
//       `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
//     );
//   };

//   // Monitor camera status - less frequently and more intelligently
//   useEffect(() => {
//     if (isMonitoring && streamRef.current) {
//       cameraCheckRef.current = setInterval(() => {
//         const tracks = streamRef.current.getTracks();
//         const videoTrack = tracks.find(track => track.kind === 'video');
        
//         if (videoTrack) {
//           if (videoTrack.readyState === 'ended') {
//             logEvent('Camera track ended', 'warning');
//             setCameraActive(false);
//           } else if (!videoTrack.enabled) {
//             logEvent('Camera track disabled', 'warning');
//             setCameraActive(false);
//           } else {
//             setCameraActive(true);
//           }
//         } else {
//           logEvent('No video track found', 'warning');
//           setCameraActive(false);
//         }
//       }, 5000); // Check every 5 seconds instead of 2
//     }

//     return () => {
//       if (cameraCheckRef.current) {
//         clearInterval(cameraCheckRef.current);
//       }
//     };
//   }, [isMonitoring]);

//   // Keyboard and context menu blocking
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isMonitoring) {
//         const blockedKeys = [
//           { altKey: true, code: 'Tab' },
//           { ctrlKey: true, shiftKey: true, code: 'KeyI' },
//           { code: 'F12' },
//           { ctrlKey: true, code: 'KeyU' },
//           { ctrlKey: true, shiftKey: true, code: 'KeyC' }
//         ];

//         const isBlocked = blockedKeys.some(blocked => 
//           Object.entries(blocked).every(([key, value]) => e[key] === value)
//         );

//         if (isBlocked) {
//           e.preventDefault();
//           const violation = {
//             type: 'KEYBOARD_SHORTCUT',
//             key: e.code,
//             severity: 'LOW'
//           };
//           logEvent(`VIOLATION: Blocked keyboard shortcut: ${e.code}`, 'violation', violation);
//           setViolations(prev => prev + 1);
//         }
//       }
//     };

//     const handleContextMenu = (e) => {
//       if (isMonitoring) {
//         e.preventDefault();
//         const violation = {
//           type: 'RIGHT_CLICK',
//           severity: 'LOW'
//         };
//         logEvent('VIOLATION: Right-click blocked', 'violation', violation);
//         setViolations(prev => prev + 1);
//       }
//     };

//     const handleBeforeUnload = (e) => {
//       if (isMonitoring) {
//         const violation = {
//           type: 'PAGE_EXIT_ATTEMPT',
//           severity: 'CRITICAL'
//         };
//         logEvent('VIOLATION: User attempted to close page', 'violation', violation);
//         e.preventDefault();
//         e.returnValue = 'Are you sure you want to leave the session?';
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('contextmenu', handleContextMenu);
//     window.addEventListener('beforeunload', handleBeforeUnload);
   
//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('contextmenu', handleContextMenu);
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [isMonitoring]);

//   const navigate=useNavigate();
//   useEffect(()=>{
//     if(violations>20)
//     {
//       navigate("/");
//     }
//   },[violations]);
//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4">
//           <div className="text-center">
//             <div className="text-6xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-white mb-4">Proctoring System Error</h2>
//             <p className="text-white/80 mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all duration-300"
//             >
//               🔄 Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }


// return (
//   <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
//     {/* Proctoring Header - Make it sticky */}
//     <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
//       <div className="max-w-7xl mx-auto px-4 py-3">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <span className="text-2xl">🔒</span>
//               <div>
//                 <h1 className="text-white font-bold text-lg">{sessionInfo.title}</h1>
//                 <p className="text-white/70 text-sm">AI Proctored Session - ID: {sessionInfo.sessionId}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//             {/* Status Indicators */}
//             <div className="flex flex-wrap items-center gap-2">
//               {Object.entries(status).map(([key, { text, type }]) => (
//                 <div key={key} className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-all duration-300 ${
//                   type === 'safe' ? 'bg-green-500/20 text-green-100 border border-green-400/30' :
//                   type === 'warning' ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30' :
//                   'bg-red-500/20 text-red-100 border border-red-400/30'
//                 }`}>
//                   <span className="text-xs">
//                     {key === 'face' ? '👤' :
//                      key === 'gaze' ? '👀' :
//                      key === 'focus' ? '🖥️' : '👥'}
//                   </span>
//                   <span className="whitespace-nowrap">{text}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Stats and Controls */}
//             <div className="flex items-center space-x-4">
//               {/* Stats */}
//               <div className="flex items-center space-x-4 text-white">
//                 <div className="text-center">
//                   <div className="text-xs opacity-70">Time</div>
//                   <div className="font-mono font-bold text-sm">{monitorTime}</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-xs opacity-70">Violations</div>
//                   <div className="font-bold text-red-300 text-sm">{violations}</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-xs opacity-70">Confidence</div>
//                   <div className="font-bold text-blue-300 text-sm">{faceConfidence}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Debug Video - Adjusted position to avoid overlapping header */}
//     <video
//       ref={videoRef}
//       autoPlay
//       muted
//       playsInline
//       className="fixed top-20 left-4 w-40 h-30 border-2 border-white/50 rounded-lg z-40 bg-black shadow-lg"
//       style={{ transform: 'scaleX(-1)' }}
//     />
//     <canvas ref={canvasRef} className="hidden" />

//     {/* Camera Status Indicator - Adjusted position */}
//     <div className="fixed top-20 left-48 z-40">
//       <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
//         cameraActive && cameraPermissionGranted ? 
//         'bg-green-500/80 text-white' : 
//         'bg-red-500/80 text-white'
//       }`}>
//         {cameraActive && cameraPermissionGranted ? '📹 Camera Active' : '📹 Camera Issue'}
//       </div>
//     </div>

//     {/* Main Content - Add padding to account for sticky header */}
//     <div className="relative pt-20">
//       {!systemReady && (
//         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//             <p className="text-white text-lg">Initializing Proctoring System...</p>
//             <p className="text-white/70 text-sm mt-2">Please allow camera access when prompted</p>
//             {!cameraPermissionGranted && (
//               <p className="text-yellow-300 text-sm mt-2 font-semibold">
//                 ⚠️ Camera permission required
//               </p>
//             )}
//           </div>
//         </div>
//       )}
      
//       {/* Render the actual route component */}
//       <div className="min-h-screen">
//         {children}
//       </div>
//     </div>

//     {/* Enhanced Monitoring Indicator */}
//     {isMonitoring && (
//       <div className="fixed bottom-4 right-4 z-50">
//         <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 border border-red-400">
//           <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//           <span className="font-semibold text-sm">RECORDING</span>
//         </div>
//       </div>
//     )}

//     {/* Mobile Status Panel - Adjusted position to avoid header overlap */}
//     <div className="fixed bottom-20 left-4 right-4 lg:hidden z-40">
//       {isMonitoring && (
//         <div className="bg-black/80 backdrop-blur-lg rounded-xl p-3 text-white text-xs">
//           <div className="grid grid-cols-2 gap-2">
//             {Object.entries(status).map(([key, { text, type }]) => (
//               <div key={key} className={`flex items-center space-x-1 ${
//                 type === 'safe' ? 'text-green-300' :
//                 type === 'warning' ? 'text-yellow-300' :
//                 'text-red-300'
//               }`}>
//                 <span className="text-xs">
//                   {key === 'face' ? '👤' :
//                    key === 'gaze' ? '👀' :
//                    key === 'focus' ? '🖥️' : '👥'}
//                 </span>
//                 <span className="truncate">{text}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// );
// };

// export default ProctoredRouteWrapper;









// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { SessionProvider, useSession }  from '../utils/SessionContext';

// const API_URL = import.meta.env.VITE_API_URL;
// const ProctoredRouteWrapper = ({ children }) => {
//   const [isMonitoring, setIsMonitoring] = useState(false);
//     const { sessionId } = useSession();
//   // const [sessionId, setSessionId] = useState(null);
//   const [violations, setViolations] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [monitorTime, setMonitorTime] = useState('00:00');
//   const [faceConfidence, setFaceConfidence] = useState('--');
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [systemReady, setSystemReady] = useState(false);
//   const [error, setError] = useState(null);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [lastDetectionTime, setLastDetectionTime] = useState(null);
//   const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
//   const [snapshotCount, setSnapshotCount] = useState(0);
//   const [status, setStatus] = useState({
//     face: { text: 'Face: Detecting...', type: 'safe' },
//     gaze: { text: 'Gaze: Monitoring...', type: 'safe' },
//     focus: { text: 'Focus: Active', type: 'safe' },
//     person: { text: 'People: Checking...', type: 'safe' }
//   });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const monitoringIntervalRef = useRef(null);
//   const lastGazeDirection = useRef('center');
//   const cameraCheckRef = useRef(null);
//   const streamRef = useRef(null);
//   const snapshotIntervalRef = useRef(null);
  
//   const params = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Pinata Configuration
//   const PINATA_API_KEY = "8a9b5a93c77cc42ca922"
//   const PINATA_SECRET_KEY = "4d3a76be82bbdd5d32f13b480930d966c16d19f7a1e5d419dd1c939eac2e80c6";

//   const getSessionInfo = () => {
//     if (location.pathname.includes('/interview/start/')) {
//       return {
//         type: 'INTERVIEW',
//         sessionId: params.interviewId,
//         title: 'Interview Session'
//       };
//     } else if (location.pathname.includes('/dsa-interview-platform/')) {
//       return {
//         type: 'DSA_INTERVIEW',
//         sessionId: params.sessionId,
//         title: 'DSA Interview Platform'
//       };
//     }
//     return { type: 'UNKNOWN', sessionId: 'unknown', title: 'Session' };
//   };

//   const sessionInfo = getSessionInfo();

//   const logEvent = (message, type = 'info', data = {}) => {
//     const timestamp = new Date().toISOString();
//     const logData = {
//       timestamp,
//       sessionType: sessionInfo.type,
//       sessionId: sessionInfo.sessionId,
//       route: location.pathname,
//       message,
//       type,
//       violationCount: violations,
//       isMonitoring,
//       monitorTime,
//       faceConfidence,
//       systemReady,
//       cameraActive,
//       cameraPermissionGranted,
//       ...data
//     };
    
//     console.log(`[PROCTORING LOG] ${timestamp} - ${type.toUpperCase()}: ${message}`, logData);
//   };

//   const logSystemStatus = () => {
//     if (!isMonitoring) return;
    
//     logEvent('System heartbeat', 'heartbeat', {
//       currentStatus: status,
//       violations: violations,
//       duration: monitorTime,
//       faceConfidence: faceConfidence,
//       videoReady: videoRef.current?.readyState === 4,
//       documentHidden: document.hidden,
//       windowFocused: document.hasFocus(),
//       cameraActive: cameraActive,
//       timestamp: Date.now()
//     });
//   };

//   const updateStatus = (key, text, type) => {
//     setStatus(prev => ({
//       ...prev,
//       [key]: { text, type }
//     }));
//   };

//   const handleVisibilityChange = () => {
//     if (document.hidden && isMonitoring) {
//       const violation = {
//         type: 'FOCUS_LOST',
//         action: 'TAB_SWITCH_OR_MINIMIZE',
//         severity: 'HIGH'
//       };
//       logEvent('VIOLATION: User switched tab or minimized window', 'violation', violation);
//       updateStatus('focus', 'Focus: Tab Switched!', 'danger');
//       setViolations(prev => prev + 1);
//     } else if (!document.hidden && isMonitoring) {
//       updateStatus('focus', 'Focus: Active', 'safe');
//       logEvent('User returned to session tab', 'info');
//     }
//   };

//   const cleanup = () => {
//     if (monitoringIntervalRef.current) {
//       clearInterval(monitoringIntervalRef.current);
//     }
//     if (cameraCheckRef.current) {
//       clearInterval(cameraCheckRef.current);
//     }
//     if (snapshotIntervalRef.current) {
//       clearInterval(snapshotIntervalRef.current);
//     }
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//     }
//   };

//   const setupCamera = async () => {
//     try {
//       logEvent('Requesting camera access...', 'info');
      
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           width: { ideal: 640 }, 
//           height: { ideal: 480 }, 
//           facingMode: 'user' 
//         }
//       });
      
//       streamRef.current = stream;
//       setCameraPermissionGranted(true);
//       logEvent('Camera permission granted', 'success');
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
        
//         return new Promise((resolve, reject) => {
//           let resolved = false;
          
//           const timeout = setTimeout(() => {
//             if (!resolved) {
//               resolved = true;
//               logEvent('Video loading timeout - but continuing anyway', 'warning');
//               setCameraActive(true);
//               resolve();
//             }
//           }, 5000);

//           const handleSuccess = () => {
//             if (!resolved) {
//               resolved = true;
//               clearTimeout(timeout);
//               logEvent('Camera metadata loaded successfully', 'success');
//               setCameraActive(true);
//               resolve();
//             }
//           };

//           const handleError = (error) => {
//             if (!resolved) {
//               resolved = true;
//               clearTimeout(timeout);
//               logEvent('Video element error', 'error');
//               setCameraActive(false);
//               reject(error);
//             }
//           };

//           videoRef.current.onloadedmetadata = handleSuccess;
//           videoRef.current.oncanplay = handleSuccess;
//           videoRef.current.onloadeddata = handleSuccess;
//           videoRef.current.onerror = handleError;
          
//           videoRef.current.play().then(() => {
//             logEvent('Video play started immediately', 'success');
//             handleSuccess();
//           }).catch(playError => {
//             logEvent(`Video autoplay failed (this is normal): ${playError.message}`, 'info');
//           });

//           const checkDimensions = () => {
//             if (videoRef.current && videoRef.current.videoWidth > 0) {
//               logEvent('Video dimensions detected, considering ready', 'info');
//               handleSuccess();
//             }
//           };

//           setTimeout(checkDimensions, 1000);
//           setTimeout(checkDimensions, 2000);
//         });
//       }
//     } catch (error) {
//       setCameraActive(false);
//       setCameraPermissionGranted(false);
//       logEvent(`Camera setup failed: ${error.message}`, 'error');
      
//       if (error.name === 'NotAllowedError') {
//         throw new Error('Camera access denied. Please allow camera permission and refresh.');
//       } else if (error.name === 'NotFoundError') {
//         throw new Error('No camera found. Please connect a camera and refresh.');
//       } else if (error.name === 'NotReadableError') {
//         throw new Error('Camera is busy or not available. Please close other applications using the camera.');
//       } else {
//         throw new Error(`Camera setup failed: ${error.message}`);
//       }
//     }
//   };

//   const setupFocusDetection = () => {
//     // Handled in useEffect hooks
//   };

//   const isCameraWorking = () => {
//     if (!videoRef.current) return false;
//     if (!cameraPermissionGranted) return false;
    
//     const video = videoRef.current;
//     if (video.readyState >= 1) {
//       return true;
//     }
    
//     if (video.videoWidth > 0 && video.videoHeight > 0) {
//       return true;
//     }
    
//     return false;
//   };

// // 2. Add debug logging to captureAndUploadSnapshot
// const captureAndUploadSnapshot = async () => {
//   console.log('🔴 [SNAPSHOT] Function called', {
//     videoExists: !!videoRef.current,
//     canvasExists: !!canvasRef.current,
//     videoWidth: videoRef.current?.videoWidth,
//     videoHeight: videoRef.current?.videoHeight,
//     isMonitoring,
//     cameraActive,
//     cameraPermissionGranted
//   });

//   if (!videoRef.current || !canvasRef.current) {
//     logEvent('Snapshot failed: video or canvas not available', 'warning');
//     return;
//   }

//   try {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
    
//     // Check if video has valid dimensions
//     if (video.videoWidth === 0 || video.videoHeight === 0) {
//       console.log('⚠️ [SNAPSHOT] Video has no dimensions yet');
//       logEvent('Snapshot skipped: video dimensions not ready', 'warning');
//       return;
//     }
    
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
    
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
//     console.log('✅ [SNAPSHOT] Canvas drawn successfully', {
//       width: canvas.width,
//       height: canvas.height
//     });
    
//     // Convert to blob
//     const blob = await new Promise((resolve) => {
//       canvas.toBlob(resolve, 'image/jpeg', 0.8);
//     });
    
//     if (!blob) {
//       console.log('❌ [SNAPSHOT] Blob creation failed');
//       logEvent('Snapshot failed: could not create blob', 'warning');
//       return;
//     }

//     console.log('✅ [SNAPSHOT] Blob created', {
//       size: blob.size,
//       type: blob.type
//     });

//     // Check Pinata credentials
//     if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
//       console.error('❌ [SNAPSHOT] Pinata credentials missing!', {
//         hasApiKey: !!PINATA_API_KEY,
//         hasSecretKey: !!PINATA_SECRET_KEY
//       });
//       logEvent('Pinata credentials not configured', 'error');
//       return;
//     }

//     console.log('✅ [SNAPSHOT] Pinata credentials found');

//     // Upload to Pinata
//     const formData = new FormData();
//     const timestamp = Date.now();
//     const filename = `snapshot_${sessionInfo.sessionId}_${timestamp}.jpg`;
//     formData.append('file', blob, filename);
    
//     const metadata = JSON.stringify({
//       name: filename,
//       keyvalues: {
//         sessionId: sessionInfo.sessionId,
//         sessionType: sessionInfo.type,
//         timestamp: new Date().toISOString()
//       }
//     });
//     formData.append('pinataMetadata', metadata);

//     console.log('📤 [SNAPSHOT] Uploading to Pinata...', { filename });
//     logEvent('Uploading snapshot to Pinata...', 'info');

//     const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
//       method: 'POST',
//       headers: {
//         'pinata_api_key': PINATA_API_KEY,
//         'pinata_secret_api_key': PINATA_SECRET_KEY,
//       },
//       body: formData,
//     });

//     console.log('📥 [SNAPSHOT] Pinata response received', {
//       status: pinataResponse.status,
//       ok: pinataResponse.ok
//     });

//     if (!pinataResponse.ok) {
//       const errorData = await pinataResponse.json();
//       console.error('❌ [SNAPSHOT] Pinata upload failed', errorData);
//       throw new Error(`Pinata upload failed: ${JSON.stringify(errorData)}`);
//     }

//     const pinataData = await pinataResponse.json();
//     const ipfsHash = pinataData.IpfsHash;
//     const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

//     console.log('✅ [SNAPSHOT] Pinata upload successful!', {
//       ipfsHash,
//       pinataUrl
//     });

//     logEvent('Image uploaded to Pinata successfully', 'success', {
//       ipfsHash: ipfsHash,
//       pinataUrl: pinataUrl
//     });

//     // Send URL to backend
//     const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
//     if (!token) {
//       console.error('❌ [SNAPSHOT] No auth token found');
//       logEvent('Backend submission failed: no auth token found', 'error');
//       return;
//     }

//     console.log('📤 [SNAPSHOT] Sending to backend...', {
//       endpoint: `${API_URL}/interview/interview-images/${sessionInfo.sessionId}/`,
//       hasToken: !!token
//     });

//     const response = await fetch(
//       `${API_URL}/interview/interview-images/${sessionId}/`,
//       {
//         method: 'POST',
//         headers: {
//           'Authorization': `Token ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           image_url: pinataUrl
//         }),
//       }
//     );

//     console.log('📥 [SNAPSHOT] Backend response', {
//       status: response.status,
//       ok: response.ok
//     });

//     if (response.ok) {
//       const data = await response.json();
//       setSnapshotCount(prev => prev + 1);
      
//       console.log('✅ [SNAPSHOT] Complete success!', {
//         snapshotId: data.image_id,
//         snapshotNumber: snapshotCount + 1
//       });
      
//       logEvent('Snapshot URL submitted to backend successfully', 'success', {
//         snapshotId: data.image_id,
//         snapshotUrl: data.image_url,
//         ipfsHash: ipfsHash,
//         timestamp: new Date().toISOString(),
//         snapshotNumber: snapshotCount + 1
//       });
//     } else {
//       const errorData = await response.json();
//       console.error('❌ [SNAPSHOT] Backend submission failed', {
//         status: response.status,
//         error: errorData
//       });
      
//       logEvent('Backend submission failed', 'error', {
//         status: response.status,
//         error: errorData,
//         pinataUrl: pinataUrl
//       });
//     }
//   } catch (error) {
//     console.error('❌ [SNAPSHOT] Error:', error);
//     logEvent(`Snapshot capture/upload error: ${error.message}`, 'error', {
//       errorStack: error.stack
//     });
//   }
// };

//   const analyzeFaceDetections = (detections) => {
//     const faceCount = detections.length;

//     if (faceCount === 0) {
//       updateStatus('face', 'Face: Not Detected', 'warning');
//       updateStatus('person', 'People: None detected', 'warning');
//       setFaceConfidence('0%');
      
//       if (!lastDetectionTime || Date.now() - lastDetectionTime > 10000) {
//         const violation = {
//           type: 'FACE_NOT_DETECTED',
//           severity: 'MEDIUM',
//           faceCount: 0,
//           duration: lastDetectionTime ? Date.now() - lastDetectionTime : 0
//         };
//         logEvent('VIOLATION: No face detected for extended period', 'violation', violation);
//         updateStatus('face', 'Face: Not Detected!', 'danger');
//         setViolations(prev => prev + 1);
//       }
//     } else if (faceCount === 1) {
//       updateStatus('face', 'Face: Detected ✅', 'safe');
//       updateStatus('person', 'People: 1 person', 'safe');
//       updateStatus('gaze', 'Gaze: Looking ahead', 'safe');
      
//       const confidence = Math.round(detections[0].detection.score * 100);
//       setFaceConfidence(confidence + '%');
//       setLastDetectionTime(Date.now());
//     } else if (faceCount > 1) {
//       const violation = {
//         type: 'MULTIPLE_FACES',
//         severity: 'CRITICAL',
//         faceCount: faceCount
//       };
//       logEvent(`VIOLATION: ${faceCount} people detected`, 'violation', violation);
//       updateStatus('person', `People: ${faceCount} detected!`, 'danger');
//       setViolations(prev => prev + 1);
//     }
//   };

//   const detectFaces = async () => {
//     if (!isCameraWorking()) {
//       if (!cameraPermissionGranted) {
//         updateStatus('face', 'Face: Camera Permission Needed', 'warning');
//         updateStatus('person', 'People: Camera Permission Needed', 'warning');
//         updateStatus('gaze', 'Gaze: Camera Permission Needed', 'warning');
//         setFaceConfidence('No Permission');
//         return;
//       }

//       if (!videoRef.current) {
//         updateStatus('face', 'Face: Loading...', 'warning');
//         updateStatus('person', 'People: Loading...', 'warning');
//         updateStatus('gaze', 'Gaze: Loading...', 'warning');
//         setFaceConfidence('Loading...');
//         return;
//       }

//       if (videoRef.current.readyState < 2) {
//         updateStatus('face', 'Face: Camera Starting...', 'warning');
//         updateStatus('person', 'People: Camera Starting...', 'warning');
//         updateStatus('gaze', 'Gaze: Camera Starting...', 'warning');
//         setFaceConfidence('Starting...');
//         return;
//       }
//     }

//     const canvas = canvasRef.current;
//     if (canvas && videoRef.current) {
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth || 640;
//       canvas.height = videoRef.current.videoHeight || 480;
      
//       try {
//         ctx.drawImage(videoRef.current, 0, 0);
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const pixels = imageData.data;
        
//         let totalBrightness = 0;
//         let pixelCount = 0;
        
//         for (let i = 0; i < pixels.length; i += 4) {
//           const r = pixels[i];
//           const g = pixels[i + 1];
//           const b = pixels[i + 2];
//           const brightness = (r + g + b) / 3;
//           totalBrightness += brightness;
//           pixelCount++;
//         }
        
//         const avgBrightness = totalBrightness / pixelCount;
        
//         if (avgBrightness < 5) {
//           let variation = 0;
//           for (let i = 0; i < pixels.length; i += 16) {
//             const r = pixels[i];
//             const g = pixels[i + 1];
//             const b = pixels[i + 2];
//             const brightness = (r + g + b) / 3;
//             variation += Math.abs(brightness - avgBrightness);
//           }
          
//           const avgVariation = variation / (pixelCount / 4);
          
//           if (avgVariation < 2) {
//             const violation = {
//               type: 'CAMERA_BLOCKED',
//               severity: 'HIGH',
//               reason: 'Camera appears to be covered or blocked',
//               avgBrightness,
//               avgVariation
//             };
//             logEvent('VIOLATION: Camera appears blocked', 'violation', violation);
//             updateStatus('face', 'Face: Camera Covered!', 'danger');
//             updateStatus('person', 'People: Camera Covered!', 'danger');
//             updateStatus('gaze', 'Gaze: Camera Covered!', 'danger');
//             setFaceConfidence('Blocked');
//             setViolations(prev => prev + 1);
//             return;
//           }
//         }
//       } catch (canvasError) {
//         logEvent('Canvas drawing failed', 'warning', { error: canvasError.message });
//         updateStatus('face', 'Face: Processing...', 'warning');
//         updateStatus('person', 'People: Processing...', 'warning');
//         updateStatus('gaze', 'Gaze: Processing...', 'warning');
//         setFaceConfidence('Processing...');
//         return;
//       }
//     }

//     try {
//       if (modelsLoaded && window.faceapi) {
//         const detections = await window.faceapi
//           .detectAllFaces(videoRef.current, new window.faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();
        
//         analyzeFaceDetections(detections);
//         setLastDetectionTime(Date.now());
//       } else {
//         updateStatus('face', 'Face: Basic Detection ⚠️', 'warning');
//         updateStatus('gaze', 'Gaze: Basic Monitor', 'warning');
//         updateStatus('person', 'People: Basic Count', 'warning');
//         setFaceConfidence('Basic Mode');
//       }
//     } catch (error) {
//       logEvent(`Face detection error: ${error.message}`, 'error', { 
//         errorStack: error.stack,
//         videoReadyState: videoRef.current?.readyState,
//         cameraActive: cameraActive
//       });
      
//       updateStatus('face', 'Face: Detection Issue', 'warning');
//       updateStatus('gaze', 'Gaze: Detection Issue', 'warning');
//       updateStatus('person', 'People: Detection Issue', 'warning');
//       setFaceConfidence('Error');
//     }
//   };

//   const updateTimer = () => {
//     if (!startTime) return;
    
//     const elapsed = Date.now() - startTime;
//     const minutes = Math.floor(elapsed / 60000);
//     const seconds = Math.floor((elapsed % 60000) / 1000);
    
//     setMonitorTime(
//       `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
//     );
//   };

//   // 3. Fix the startMonitoring function
// const startMonitoring = () => {
//   if (isMonitoring) return;
  
//   setIsMonitoring(true);
//   setStartTime(Date.now());
//   setViolations(0);
//   setSnapshotCount(0);
  
//   console.log('🚀 [MONITORING] Starting monitoring and snapshots');
  
//   logEvent(`Monitoring started for ${sessionInfo.title}`, 'info', {
//     action: 'MONITORING_STARTED',
//     sessionType: sessionInfo.type,
//     route: location.pathname
//   });

//   // Face detection interval
//   monitoringIntervalRef.current = setInterval(() => {
//     try {
//       detectFaces();
//       updateTimer();
//     } catch (error) {
//       logEvent(`Monitoring error: ${error.message}`, 'error');
//     }
//   }, 2000);

//   // System status logging
//   const statusInterval = setInterval(() => {
//     logSystemStatus();
//   }, 10000);

//   // SNAPSHOT INTERVAL - This is critical!
//   snapshotIntervalRef.current = setInterval(() => {
//     console.log('📸 [SNAPSHOT] Interval triggered');
//     captureAndUploadSnapshot();
//   }, 10000); // 10 seconds

//   monitoringIntervalRef.statusInterval = statusInterval;
  
//   console.log('✅ [MONITORING] All intervals started', {
//     hasMonitoringInterval: !!monitoringIntervalRef.current,
//     hasSnapshotInterval: !!snapshotIntervalRef.current,
//     hasStatusInterval: !!statusInterval
//   });
  
//   logEvent('Snapshot capture started - will capture every 10 seconds', 'info');
  
//   // TEST: Capture first snapshot immediately
//   setTimeout(() => {
//     console.log('📸 [SNAPSHOT] Taking first test snapshot...');
//     captureAndUploadSnapshot();
//   }, 2000); // Wait 2 seconds for camera to be fully ready
// };

//   const stopMonitoring = () => {
//     if (!isMonitoring) return;
    
//     setIsMonitoring(false);
//     if (monitoringIntervalRef.current) {
//       clearInterval(monitoringIntervalRef.current);
//       if (monitoringIntervalRef.statusInterval) {
//         clearInterval(monitoringIntervalRef.statusInterval);
//       }
//     }
//     if (snapshotIntervalRef.current) {
//       clearInterval(snapshotIntervalRef.current);
//     }
    
//     logEvent('Monitoring stopped', 'info', {
//       action: 'MONITORING_STOPPED',
//       totalViolations: violations,
//       totalSnapshots: snapshotCount,
//       duration: monitorTime,
//       route: location.pathname
//     });
//   };

//   useEffect(() => {
//     const initializeSystem = async () => {
//       try {
//         logEvent('Initializing AI proctoring system for route: ' + location.pathname, 'info');
        
//         if (typeof window !== 'undefined' && window.faceapi) {
//           try {
//             await Promise.all([
//               window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//               window.faceapi.nets.faceLandmark68Net.loadFromUri('/models')
//             ]);
//             setModelsLoaded(true);
//             logEvent('AI models loaded successfully', 'success');
//           } catch (modelError) {
//             logEvent('AI models failed to load, using basic monitoring', 'warning');
//             setModelsLoaded(false);
//           }
//         } else {
//           logEvent('face-api.js not available, using basic monitoring', 'warning');
//           setModelsLoaded(false);
//         }
  
//         await setupCamera();
//         setupFocusDetection();
        
//         setTimeout(() => {
//           setSystemReady(true);
//           logEvent('Proctoring system ready', 'success');
          
//           if (location.pathname.includes('/interview/start/') && cameraPermissionGranted) {
//             logEvent('Auto-starting monitoring for interview', 'info');
//             startMonitoring();
//           }
//         }, 1000);
        
//       } catch (error) {
//         setError(error.message);
//         logEvent(`System initialization failed: ${error.message}`, 'error');
//       }
//     };
  
//     initializeSystem();
    
//     return () => {
//       logEvent('Component unmounting - cleaning up monitoring', 'info');
//       stopMonitoring();
//       cleanup();
//     };
//   }, [location.pathname, cameraPermissionGranted]);

//   useEffect(() => {
//     if (isMonitoring && streamRef.current) {
//       cameraCheckRef.current = setInterval(() => {
//         const tracks = streamRef.current.getTracks();
//         const videoTrack = tracks.find(track => track.kind === 'video');
        
//         if (videoTrack) {
//           if (videoTrack.readyState === 'ended') {
//             logEvent('Camera track ended', 'warning');
//             setCameraActive(false);
//           } else if (!videoTrack.enabled) {
//             logEvent('Camera track disabled', 'warning');
//             setCameraActive(false);
//           } else {
//             setCameraActive(true);
//           }
//         } else {
//           logEvent('No video track found', 'warning');
//           setCameraActive(false);
//         }
//       }, 5000);
//     }

//     return () => {
//       if (cameraCheckRef.current) {
//         clearInterval(cameraCheckRef.current);
//       }
//     };
//   }, [isMonitoring]);

//   useEffect(() => {
//     const handleWindowBlur = () => {
//       if (isMonitoring) {
//         const violation = {
//           type: 'FOCUS_LOST',
//           action: 'WINDOW_BLUR',
//           severity: 'MEDIUM'
//         };
//         logEvent('VIOLATION: Window lost focus', 'violation', violation);
//         updateStatus('focus', 'Focus: Lost!', 'danger');
//         setViolations(prev => prev + 1);
//       }
//     };
  
//     const handleWindowFocus = () => {
//       if (isMonitoring) {
//         updateStatus('focus', 'Focus: Active', 'safe');
//         logEvent('Window regained focus', 'info');
//       }
//     };
  
//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('focus', handleWindowFocus);
  
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleWindowBlur);
//       window.removeEventListener('focus', handleWindowFocus);
//     };
//   }, [isMonitoring]);
  
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isMonitoring) {
//         const blockedKeys = [
//           { altKey: true, code: 'Tab' },
//           { ctrlKey: true, shiftKey: true, code: 'KeyI' },
//           { code: 'F12' },
//           { ctrlKey: true, code: 'KeyU' },
//           { ctrlKey: true, shiftKey: true, code: 'KeyC' }
//         ];

//         const isBlocked = blockedKeys.some(blocked => 
//           Object.entries(blocked).every(([key, value]) => e[key] === value)
//         );

//         if (isBlocked) {
//           e.preventDefault();
//           const violation = {
//             type: 'KEYBOARD_SHORTCUT',
//             key: e.code,
//             severity: 'LOW'
//           };
//           logEvent(`VIOLATION: Blocked keyboard shortcut: ${e.code}`, 'violation', violation);
//           setViolations(prev => prev + 1);
//         }
//       }
//     };

//     const handleContextMenu = (e) => {
//       if (isMonitoring) {
//         e.preventDefault();
//         const violation = {
//           type: 'RIGHT_CLICK',
//           severity: 'LOW'
//         };
//         logEvent('VIOLATION: Right-click blocked', 'violation', violation);
//         setViolations(prev => prev + 1);
//       }
//     };

//     const handleBeforeUnload = (e) => {
//       if (isMonitoring) {
//         const violation = {
//           type: 'PAGE_EXIT_ATTEMPT',
//           severity: 'CRITICAL'
//         };
//         logEvent('VIOLATION: User attempted to close page', 'violation', violation);
//         e.preventDefault();
//         e.returnValue = 'Are you sure you want to leave the session?';
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('contextmenu', handleContextMenu);
//     window.addEventListener('beforeunload', handleBeforeUnload);
   
//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('contextmenu', handleContextMenu);
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [isMonitoring]);

//   useEffect(() => {
//     if (violations > 20) {
//       navigate("/");
//     }
//   }, [violations, navigate]);

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4">
//           <div className="text-center">
//             <div className="text-6xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-white mb-4">Proctoring System Error</h2>
//             <p className="text-white/80 mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all duration-300"
//             >
//               🔄 Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <SessionProvider>
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
//       <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 py-3">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <span className="text-2xl">🔒</span>
//                 <div>
//                   <h1 className="text-white font-bold text-lg">{sessionInfo.title}</h1>
//                   <p className="text-white/70 text-sm">AI Proctored Session - ID: {sessionInfo.sessionId}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//               <div className="flex flex-wrap items-center gap-2">
//                 {Object.entries(status).map(([key, { text, type }]) => (
//                   <div key={key} className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-all duration-300 ${
//                     type === 'safe' ? 'bg-green-500/20 text-green-100 border border-green-400/30' :
//                     type === 'warning' ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30' :
//                     'bg-red-500/20 text-red-100 border border-red-400/30'
//                   }`}>
//                     <span className="text-xs">
//                       {key === 'face' ? '👤' :
//                        key === 'gaze' ? '👀' :
//                        key === 'focus' ? '🖥️' : '👥'}
//                     </span>
//                     <span className="whitespace-nowrap">{text}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-4 text-white">
//                   <div className="text-center">
//                     <div className="text-xs opacity-70">Time</div>
//                     <div className="font-mono font-bold text-sm">{monitorTime}</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xs opacity-70">Violations</div>
//                     <div className="font-bold text-red-300 text-sm">{violations}</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xs opacity-70">Confidence</div>
//                     <div className="font-bold text-blue-300 text-sm">{faceConfidence}</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xs opacity-70">Snapshots</div>
//                     <div className="font-bold text-purple-300 text-sm">{snapshotCount}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         playsInline
//         className="fixed top-20 left-4 w-40 h-30 border-2 border-white/50 rounded-lg z-40 bg-black shadow-lg"
//         style={{ transform: 'scaleX(-1)' }}
//       />
//       <canvas ref={canvasRef} className="hidden" />

//       <div className="fixed top-20 left-48 z-40">
//         <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
//           cameraActive && cameraPermissionGranted ? 
//           'bg-green-500/80 text-white' : 
//           'bg-red-500/80 text-white'
//         }`}>
//           {cameraActive && cameraPermissionGranted ? '📹 Camera Active' : '📹 Camera Issue'}
//         </div>
//       </div>

//       <div className="relative pt-20">
//         {!systemReady && (
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//               <p className="text-white text-lg">Initializing Proctoring System...</p>
//               <p className="text-white/70 text-sm mt-2">Please allow camera access when prompted</p>
//               {!cameraPermissionGranted && (
//                 <p className="text-yellow-300 text-sm mt-2 font-semibold">
//                   ⚠️ Camera permission required
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
        
//         <div className="min-h-screen">
//           {children}
//         </div>
//       </div>

//       {isMonitoring && (
//         <div className="fixed bottom-4 right-4 z-50">
//           <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 border border-red-400">
//             <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//             <span className="font-semibold text-sm">RECORDING</span>
//           </div>
//         </div>
//       )}

//       <div className="fixed bottom-20 left-4 right-4 lg:hidden z-40">
//         {isMonitoring && (
//           <div className="bg-black/80 backdrop-blur-lg rounded-xl p-3 text-white text-xs">
//             <div className="grid grid-cols-2 gap-2">
//               {Object.entries(status).map(([key, { text, type }]) => (
//                 <div key={key} className={`flex items-center space-x-1 ${
//                   type === 'safe' ? 'text-green-300' :
//                   type === 'warning' ? 'text-yellow-300' :
//                   'text-red-300'
//                 }`}>
//                   <span className="text-xs">
//                     {key === 'face' ? '👤' :
//                      key === 'gaze' ? '👀' :
//                      key === 'focus' ? '🖥️' : '👥'}
//                   </span>
//                   <span className="truncate">{text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//     </SessionProvider>
//   );
// };

// export default ProctoredRouteWrapper;


// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { SessionProvider, useSession } from '../utils/SessionContext';

// const API_URL = import.meta.env.VITE_API_URL;

// // Inner component that uses the session context
// const ProctoredContent = ({ children }) => {
//   const { sessionId } = useSession();
//   const [isMonitoring, setIsMonitoring] = useState(false);
//   const [violations, setViolations] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [monitorTime, setMonitorTime] = useState('00:00');
//   const [faceConfidence, setFaceConfidence] = useState('--');
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [systemReady, setSystemReady] = useState(false);
//   const [error, setError] = useState(null);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [lastDetectionTime, setLastDetectionTime] = useState(null);
//   const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
//   const [snapshotCount, setSnapshotCount] = useState(0);
//   const [status, setStatus] = useState({
//     face: { text: 'Face: Detecting...', type: 'safe' },
//     gaze: { text: 'Gaze: Monitoring...', type: 'safe' },
//     focus: { text: 'Focus: Active', type: 'safe' },
//     person: { text: 'People: Checking...', type: 'safe' }
//   });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const monitoringIntervalRef = useRef(null);
//   const lastGazeDirection = useRef('center');
//   const cameraCheckRef = useRef(null);
//   const streamRef = useRef(null);
//   const snapshotIntervalRef = useRef(null);
  
//   const params = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const PINATA_API_KEY = "8a9b5a93c77cc42ca922";
//   const PINATA_SECRET_KEY = "4d3a76be82bbdd5d32f13b480930d966c16d19f7a1e5d419dd1c939eac2e80c6";

//   const getSessionInfo = () => {
//     if (location.pathname.includes('/interview/start/')) {
//       return {
//         type: 'INTERVIEW',
//         sessionId: params.interviewId,
//         title: 'Interview Session'
//       };
//     } else if (location.pathname.includes('/dsa-interview-platform/')) {
//       return {
//         type: 'DSA_INTERVIEW',
//         sessionId: params.sessionId,
//         title: 'DSA Interview Platform'
//       };
//     } else if (location.pathname.includes('/resume-platform/')) {
//       return {
//         type: 'RESUME_INTERVIEW',
//         sessionId: params.sessionId,
//         title: 'Resume Interview Platform'
//       };
//     }
//     return { type: 'UNKNOWN', sessionId: 'unknown', title: 'Session' };
//   };

//   const sessionInfo = getSessionInfo();

//   const logEvent = (message, type = 'info', data = {}) => {
//     const timestamp = new Date().toISOString();
//     const logData = {
//       timestamp,
//       sessionType: sessionInfo.type,
//       sessionId: sessionId || sessionInfo.sessionId,
//       route: location.pathname,
//       message,
//       type,
//       violationCount: violations,
//       isMonitoring,
//       monitorTime,
//       faceConfidence,
//       systemReady,
//       cameraActive,
//       cameraPermissionGranted,
//       ...data
//     };
    
//     console.log(`[PROCTORING LOG] ${timestamp} - ${type.toUpperCase()}: ${message}`, logData);
//   };

//   const logSystemStatus = () => {
//     if (!isMonitoring) return;
    
//     logEvent('System heartbeat', 'heartbeat', {
//       currentStatus: status,
//       violations: violations,
//       duration: monitorTime,
//       faceConfidence: faceConfidence,
//       videoReady: videoRef.current?.readyState === 4,
//       documentHidden: document.hidden,
//       windowFocused: document.hasFocus(),
//       cameraActive: cameraActive,
//       timestamp: Date.now()
//     });
//   };

//   const updateStatus = (key, text, type) => {
//     setStatus(prev => ({
//       ...prev,
//       [key]: { text, type }
//     }));
//   };

//   const handleVisibilityChange = () => {
//     if (document.hidden && isMonitoring) {
//       const violation = {
//         type: 'FOCUS_LOST',
//         action: 'TAB_SWITCH_OR_MINIMIZE',
//         severity: 'HIGH'
//       };
//       logEvent('VIOLATION: User switched tab or minimized window', 'violation', violation);
//       updateStatus('focus', 'Focus: Tab Switched!', 'danger');
//       setViolations(prev => prev + 1);
//     } else if (!document.hidden && isMonitoring) {
//       updateStatus('focus', 'Focus: Active', 'safe');
//       logEvent('User returned to session tab', 'info');
//     }
//   };

//   const cleanup = () => {
//     if (monitoringIntervalRef.current) {
//       clearInterval(monitoringIntervalRef.current);
//     }
//     if (cameraCheckRef.current) {
//       clearInterval(cameraCheckRef.current);
//     }
//     if (snapshotIntervalRef.current) {
//       clearInterval(snapshotIntervalRef.current);
//     }
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//     }
//   };

//   const setupCamera = async () => {
//     try {
//       logEvent('Requesting camera access...', 'info');
      
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           width: { ideal: 640 }, 
//           height: { ideal: 480 }, 
//           facingMode: 'user' 
//         }
//       });
      
//       streamRef.current = stream;
//       setCameraPermissionGranted(true);
//       logEvent('Camera permission granted', 'success');
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
        
//         return new Promise((resolve, reject) => {
//           let resolved = false;
          
//           const timeout = setTimeout(() => {
//             if (!resolved) {
//               resolved = true;
//               logEvent('Video loading timeout - but continuing anyway', 'warning');
//               setCameraActive(true);
//               resolve();
//             }
//           }, 5000);

//           const handleSuccess = () => {
//             if (!resolved) {
//               resolved = true;
//               clearTimeout(timeout);
//               logEvent('Camera metadata loaded successfully', 'success');
//               setCameraActive(true);
//               resolve();
//             }
//           };

//           const handleError = (error) => {
//             if (!resolved) {
//               resolved = true;
//               clearTimeout(timeout);
//               logEvent('Video element error', 'error');
//               setCameraActive(false);
//               reject(error);
//             }
//           };

//           videoRef.current.onloadedmetadata = handleSuccess;
//           videoRef.current.oncanplay = handleSuccess;
//           videoRef.current.onloadeddata = handleSuccess;
//           videoRef.current.onerror = handleError;
          
//           videoRef.current.play().then(() => {
//             logEvent('Video play started immediately', 'success');
//             handleSuccess();
//           }).catch(playError => {
//             logEvent(`Video autoplay failed (this is normal): ${playError.message}`, 'info');
//           });

//           const checkDimensions = () => {
//             if (videoRef.current && videoRef.current.videoWidth > 0) {
//               logEvent('Video dimensions detected, considering ready', 'info');
//               handleSuccess();
//             }
//           };

//           setTimeout(checkDimensions, 1000);
//           setTimeout(checkDimensions, 2000);
//         });
//       }
//     } catch (error) {
//       setCameraActive(false);
//       setCameraPermissionGranted(false);
//       logEvent(`Camera setup failed: ${error.message}`, 'error');
      
//       if (error.name === 'NotAllowedError') {
//         throw new Error('Camera access denied. Please allow camera permission and refresh.');
//       } else if (error.name === 'NotFoundError') {
//         throw new Error('No camera found. Please connect a camera and refresh.');
//       } else if (error.name === 'NotReadableError') {
//         throw new Error('Camera is busy or not available. Please close other applications using the camera.');
//       } else {
//         throw new Error(`Camera setup failed: ${error.message}`);
//       }
//     }
//   };

//   const isCameraWorking = () => {
//     if (!videoRef.current) return false;
//     if (!cameraPermissionGranted) return false;
    
//     const video = videoRef.current;
//     if (video.readyState >= 1) {
//       return true;
//     }
    
//     if (video.videoWidth > 0 && video.videoHeight > 0) {
//       return true;
//     }
    
//     return false;
//   };

//   const captureAndUploadSnapshot = async () => {
//     console.log('🔴 [SNAPSHOT] Function called', {
//       sessionId,
//       videoExists: !!videoRef.current,
//       canvasExists: !!canvasRef.current,
//       videoWidth: videoRef.current?.videoWidth,
//       videoHeight: videoRef.current?.videoHeight,
//       isMonitoring,
//       cameraActive,
//       cameraPermissionGranted
//     });

//     if (!sessionId) {
//       console.log('⚠️ [SNAPSHOT] No sessionId available yet, skipping backend submission');
//       logEvent('Snapshot upload skipped - session not initialized', 'warning');
//       return;
//     }

//     if (!videoRef.current || !canvasRef.current) {
//       logEvent('Snapshot failed: video or canvas not available', 'warning');
//       return;
//     }

//     try {
//       const canvas = canvasRef.current;
//       const video = videoRef.current;
      
//       if (video.videoWidth === 0 || video.videoHeight === 0) {
//         console.log('⚠️ [SNAPSHOT] Video has no dimensions yet');
//         logEvent('Snapshot skipped: video dimensions not ready', 'warning');
//         return;
//       }
      
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
      
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
//       console.log('✅ [SNAPSHOT] Canvas drawn successfully', {
//         width: canvas.width,
//         height: canvas.height
//       });
      
//       const blob = await new Promise((resolve) => {
//         canvas.toBlob(resolve, 'image/jpeg', 0.8);
//       });
      
//       if (!blob) {
//         console.log('❌ [SNAPSHOT] Blob creation failed');
//         logEvent('Snapshot failed: could not create blob', 'warning');
//         return;
//       }

//       console.log('✅ [SNAPSHOT] Blob created', {
//         size: blob.size,
//         type: blob.type
//       });

//       if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
//         console.error('❌ [SNAPSHOT] Pinata credentials missing!', {
//           hasApiKey: !!PINATA_API_KEY,
//           hasSecretKey: !!PINATA_SECRET_KEY
//         });
//         logEvent('Pinata credentials not configured', 'error');
//         return;
//       }

//       console.log('✅ [SNAPSHOT] Pinata credentials found');

//       const formData = new FormData();
//       const timestamp = Date.now();
//       const filename = `snapshot_${sessionId}_${timestamp}.jpg`;
//       formData.append('file', blob, filename);
      
//       const metadata = JSON.stringify({
//         name: filename,
//         keyvalues: {
//           sessionId: sessionId,
//           sessionType: sessionInfo.type,
//           timestamp: new Date().toISOString()
//         }
//       });
//       formData.append('pinataMetadata', metadata);

//       console.log('📤 [SNAPSHOT] Uploading to Pinata...', { filename });
//       logEvent('Uploading snapshot to Pinata...', 'info');

//       const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
//         method: 'POST',
//         headers: {
//           'pinata_api_key': PINATA_API_KEY,
//           'pinata_secret_api_key': PINATA_SECRET_KEY,
//         },
//         body: formData,
//       });

//       console.log('📥 [SNAPSHOT] Pinata response received', {
//         status: pinataResponse.status,
//         ok: pinataResponse.ok
//       });

//       if (!pinataResponse.ok) {
//         const errorData = await pinataResponse.json();
//         console.error('❌ [SNAPSHOT] Pinata upload failed', errorData);
//         throw new Error(`Pinata upload failed: ${JSON.stringify(errorData)}`);
//       }

//       const pinataData = await pinataResponse.json();
//       const ipfsHash = pinataData.IpfsHash;
//       const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

//       console.log('✅ [SNAPSHOT] Pinata upload successful!', {
//         ipfsHash,
//         pinataUrl
//       });

//       logEvent('Image uploaded to Pinata successfully', 'success', {
//         ipfsHash: ipfsHash,
//         pinataUrl: pinataUrl
//       });

//       const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
//       if (!token) {
//         console.error('❌ [SNAPSHOT] No auth token found');
//         logEvent('Backend submission failed: no auth token found', 'error');
//         return;
//       }

//       console.log('📤 [SNAPSHOT] Sending to backend...', {
//         endpoint: `${API_URL}/interview/interview-images/${sessionId}/`,
//         hasToken: !!token,
//         sessionId
//       });

//       const response = await fetch(
//         `${API_URL}/interview/interview-images/${sessionId}/`,
//         {
//           method: 'POST',
//           headers: {
//             'Authorization': `Token ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             image_url: pinataUrl
//           }),
//         }
//       );

//       console.log('📥 [SNAPSHOT] Backend response', {
//         status: response.status,
//         ok: response.ok
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSnapshotCount(prev => prev + 1);
        
//         console.log('✅ [SNAPSHOT] Complete success!', {
//           snapshotId: data.image_id,
//           snapshotNumber: snapshotCount + 1
//         });
        
//         logEvent('Snapshot URL submitted to backend successfully', 'success', {
//           snapshotId: data.image_id,
//           snapshotUrl: data.image_url,
//           ipfsHash: ipfsHash,
//           timestamp: new Date().toISOString(),
//           snapshotNumber: snapshotCount + 1
//         });
//       } else {
//         const errorData = await response.json();
//         console.error('❌ [SNAPSHOT] Backend submission failed', {
//           status: response.status,
//           error: errorData
//         });
        
//         logEvent('Backend submission failed', 'error', {
//           status: response.status,
//           error: errorData,
//           pinataUrl: pinataUrl
//         });
//       }
//     } catch (error) {
//       console.error('❌ [SNAPSHOT] Error:', error);
//       logEvent(`Snapshot capture/upload error: ${error.message}`, 'error', {
//         errorStack: error.stack
//       });
//     }
//   };

//   const analyzeFaceDetections = (detections) => {
//     const faceCount = detections.length;

//     if (faceCount === 0) {
//       updateStatus('face', 'Face: Not Detected', 'warning');
//       updateStatus('person', 'People: None detected', 'warning');
//       setFaceConfidence('0%');
      
//       if (!lastDetectionTime || Date.now() - lastDetectionTime > 10000) {
//         const violation = {
//           type: 'FACE_NOT_DETECTED',
//           severity: 'MEDIUM',
//           faceCount: 0,
//           duration: lastDetectionTime ? Date.now() - lastDetectionTime : 0
//         };
//         logEvent('VIOLATION: No face detected for extended period', 'violation', violation);
//         updateStatus('face', 'Face: Not Detected!', 'danger');
//         setViolations(prev => prev + 1);
//       }
//     } else if (faceCount === 1) {
//       updateStatus('face', 'Face: Detected ✅', 'safe');
//       updateStatus('person', 'People: 1 person', 'safe');
//       updateStatus('gaze', 'Gaze: Looking ahead', 'safe');
      
//       const confidence = Math.round(detections[0].detection.score * 100);
//       setFaceConfidence(confidence + '%');
//       setLastDetectionTime(Date.now());
//     } else if (faceCount > 1) {
//       const violation = {
//         type: 'MULTIPLE_FACES',
//         severity: 'CRITICAL',
//         faceCount: faceCount
//       };
//       logEvent(`VIOLATION: ${faceCount} people detected`, 'violation', violation);
//       updateStatus('person', `People: ${faceCount} detected!`, 'danger');
//       setViolations(prev => prev + 1);
//     }
//   };

//   const detectFaces = async () => {
//     if (!isCameraWorking()) {
//       if (!cameraPermissionGranted) {
//         updateStatus('face', 'Face: Camera Permission Needed', 'warning');
//         updateStatus('person', 'People: Camera Permission Needed', 'warning');
//         updateStatus('gaze', 'Gaze: Camera Permission Needed', 'warning');
//         setFaceConfidence('No Permission');
//         return;
//       }

//       if (!videoRef.current) {
//         updateStatus('face', 'Face: Loading...', 'warning');
//         updateStatus('person', 'People: Loading...', 'warning');
//         updateStatus('gaze', 'Gaze: Loading...', 'warning');
//         setFaceConfidence('Loading...');
//         return;
//       }

//       if (videoRef.current.readyState < 2) {
//         updateStatus('face', 'Face: Camera Starting...', 'warning');
//         updateStatus('person', 'People: Camera Starting...', 'warning');
//         updateStatus('gaze', 'Gaze: Camera Starting...', 'warning');
//         setFaceConfidence('Starting...');
//         return;
//       }
//     }

//     const canvas = canvasRef.current;
//     if (canvas && videoRef.current) {
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth || 640;
//       canvas.height = videoRef.current.videoHeight || 480;
      
//       try {
//         ctx.drawImage(videoRef.current, 0, 0);
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const pixels = imageData.data;
        
//         let totalBrightness = 0;
//         let pixelCount = 0;
        
//         for (let i = 0; i < pixels.length; i += 4) {
//           const r = pixels[i];
//           const g = pixels[i + 1];
//           const b = pixels[i + 2];
//           const brightness = (r + g + b) / 3;
//           totalBrightness += brightness;
//           pixelCount++;
//         }
        
//         const avgBrightness = totalBrightness / pixelCount;
        
//         if (avgBrightness < 5) {
//           let variation = 0;
//           for (let i = 0; i < pixels.length; i += 16) {
//             const r = pixels[i];
//             const g = pixels[i + 1];
//             const b = pixels[i + 2];
//             const brightness = (r + g + b) / 3;
//             variation += Math.abs(brightness - avgBrightness);
//           }
          
//           const avgVariation = variation / (pixelCount / 4);
          
//           if (avgVariation < 2) {
//             const violation = {
//               type: 'CAMERA_BLOCKED',
//               severity: 'HIGH',
//               reason: 'Camera appears to be covered or blocked',
//               avgBrightness,
//               avgVariation
//             };
//             logEvent('VIOLATION: Camera appears blocked', 'violation', violation);
//             updateStatus('face', 'Face: Camera Covered!', 'danger');
//             updateStatus('person', 'People: Camera Covered!', 'danger');
//             updateStatus('gaze', 'Gaze: Camera Covered!', 'danger');
//             setFaceConfidence('Blocked');
//             setViolations(prev => prev + 1);
//             return;
//           }
//         }
//       } catch (canvasError) {
//         logEvent('Canvas drawing failed', 'warning', { error: canvasError.message });
//         updateStatus('face', 'Face: Processing...', 'warning');
//         updateStatus('person', 'People: Processing...', 'warning');
//         updateStatus('gaze', 'Gaze: Processing...', 'warning');
//         setFaceConfidence('Processing...');
//         return;
//       }
//     }

//     try {
//       if (modelsLoaded && window.faceapi) {
//         const detections = await window.faceapi
//           .detectAllFaces(videoRef.current, new window.faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();
        
//         analyzeFaceDetections(detections);
//         setLastDetectionTime(Date.now());
//       } else {
//         updateStatus('face', 'Face: Basic Detection ⚠️', 'warning');
//         updateStatus('gaze', 'Gaze: Basic Monitor', 'warning');
//         updateStatus('person', 'People: Basic Count', 'warning');
//         setFaceConfidence('Basic Mode');
//       }
//     } catch (error) {
//       logEvent(`Face detection error: ${error.message}`, 'error', { 
//         errorStack: error.stack,
//         videoReadyState: videoRef.current?.readyState,
//         cameraActive: cameraActive
//       });
      
//       updateStatus('face', 'Face: Detection Issue', 'warning');
//       updateStatus('gaze', 'Gaze: Detection Issue', 'warning');
//       updateStatus('person', 'People: Detection Issue', 'warning');
//       setFaceConfidence('Error');
//     }
//   };

//   const updateTimer = () => {
//     if (!startTime) return;
    
//     const elapsed = Date.now() - startTime;
//     const minutes = Math.floor(elapsed / 60000);
//     const seconds = Math.floor((elapsed % 60000) / 1000);
    
//     setMonitorTime(
//       `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
//     );
//   };

//   const startMonitoring = () => {
//     if (isMonitoring) return;
    
//     setIsMonitoring(true);
//     setStartTime(Date.now());
//     setViolations(0);
//     setSnapshotCount(0);
    
//     console.log('🚀 [MONITORING] Starting monitoring and snapshots');
    
//     logEvent(`Monitoring started for ${sessionInfo.title}`, 'info', {
//       action: 'MONITORING_STARTED',
//       sessionType: sessionInfo.type,
//       route: location.pathname
//     });

//     monitoringIntervalRef.current = setInterval(() => {
//       try {
//         detectFaces();
//         updateTimer();
//       } catch (error) {
//         logEvent(`Monitoring error: ${error.message}`, 'error');
//       }
//     }, 2000);

//     const statusInterval = setInterval(() => {
//       logSystemStatus();
//     }, 10000);

//     snapshotIntervalRef.current = setInterval(() => {
//       console.log('📸 [SNAPSHOT] Interval triggered');
//       captureAndUploadSnapshot();
//     }, 10000);

//     monitoringIntervalRef.statusInterval = statusInterval;
    
//     console.log('✅ [MONITORING] All intervals started', {
//       hasMonitoringInterval: !!monitoringIntervalRef.current,
//       hasSnapshotInterval: !!snapshotIntervalRef.current,
//       hasStatusInterval: !!statusInterval
//     });
    
//     logEvent('Snapshot capture started - will capture every 10 seconds', 'info');
    
//     setTimeout(() => {
//       console.log('📸 [SNAPSHOT] Taking first test snapshot...');
//       captureAndUploadSnapshot();
//     }, 2000);
//   };

//   const stopMonitoring = () => {
//     if (!isMonitoring) return;
    
//     setIsMonitoring(false);
//     if (monitoringIntervalRef.current) {
//       clearInterval(monitoringIntervalRef.current);
//       if (monitoringIntervalRef.statusInterval) {
//         clearInterval(monitoringIntervalRef.statusInterval);
//       }
//     }
//     if (snapshotIntervalRef.current) {
//       clearInterval(snapshotIntervalRef.current);
//     }
    
//     logEvent('Monitoring stopped', 'info', {
//       action: 'MONITORING_STOPPED',
//       totalViolations: violations,
//       totalSnapshots: snapshotCount,
//       duration: monitorTime,
//       route: location.pathname
//     });
//   };

//   useEffect(() => {
//     const initializeSystem = async () => {
//       try {
//         logEvent('Initializing AI proctoring system for route: ' + location.pathname, 'info');
        
//         if (typeof window !== 'undefined' && window.faceapi) {
//           try {
//             await Promise.all([
//               window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//               window.faceapi.nets.faceLandmark68Net.loadFromUri('/models')
//             ]);
//             setModelsLoaded(true);
//             logEvent('AI models loaded successfully', 'success');
//           } catch (modelError) {
//             logEvent('AI models failed to load, using basic monitoring', 'warning');
//             setModelsLoaded(false);
//           }
//         } else {
//           logEvent('face-api.js not available, using basic monitoring', 'warning');
//           setModelsLoaded(false);
//         }
  
//         await setupCamera();
        
//         setTimeout(() => {
//           setSystemReady(true);
//           logEvent('Proctoring system ready', 'success');
          
//           if (location.pathname.includes('/interview/start/') && cameraPermissionGranted) {
//             logEvent('Auto-starting monitoring for interview', 'info');
//             startMonitoring();
//           }
//         }, 1000);
        
//       } catch (error) {
//         setError(error.message);
//         logEvent(`System initialization failed: ${error.message}`, 'error');
//       }
//     };
  
//     initializeSystem();
    
//     return () => {
//       logEvent('Component unmounting - cleaning up monitoring', 'info');
//       stopMonitoring();
//       cleanup();
//     };
//   }, [location.pathname, cameraPermissionGranted]);

//   useEffect(() => {
//     if (isMonitoring && streamRef.current) {
//       cameraCheckRef.current = setInterval(() => {
//         const tracks = streamRef.current.getTracks();
//         const videoTrack = tracks.find(track => track.kind === 'video');
        
//         if (videoTrack) {
//           if (videoTrack.readyState === 'ended') {
//             logEvent('Camera track ended', 'warning');
//             setCameraActive(false);
//           } else if (!videoTrack.enabled) {
//             logEvent('Camera track disabled', 'warning');
//             setCameraActive(false);
//           } else {
//             setCameraActive(true);
//           }
//         } else {
//           logEvent('No video track found', 'warning');
//           setCameraActive(false);
//         }
//       }, 5000);
//     }

//     return () => {
//       if (cameraCheckRef.current) {
//         clearInterval(cameraCheckRef.current);
//       }
//     };
//   }, [isMonitoring]);

//   useEffect(() => {
//     const handleWindowBlur = () => {
//       if (isMonitoring) {
//         const violation = {
//           type: 'FOCUS_LOST',
//           action: 'WINDOW_BLUR',
//           severity: 'MEDIUM'
//         };
//         logEvent('VIOLATION: Window lost focus', 'violation', violation);
//         updateStatus('focus', 'Focus: Lost!', 'danger');
//         setViolations(prev => prev + 1);
//       }
//     };
  
//     const handleWindowFocus = () => {
//       if (isMonitoring) {
//         updateStatus('focus', 'Focus: Active', 'safe');
//         logEvent('Window regained focus', 'info');
//       }
//     };
  
//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('focus', handleWindowFocus);
  
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       window.removeEventListener('blur', handleWindowBlur);
//       window.removeEventListener('focus', handleWindowFocus);
//     };
//   }, [isMonitoring]);
  
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (isMonitoring) {
//         const blockedKeys = [
//           { altKey: true, code: 'Tab' },
//           { ctrlKey: true, shiftKey: true, code: 'KeyI' },
//           { code: 'F12' },
//           { ctrlKey: true, code: 'KeyU' },
//           { ctrlKey: true, shiftKey: true, code: 'KeyC' }
//         ];

//         const isBlocked = blockedKeys.some(blocked => 
//           Object.entries(blocked).every(([key, value]) => e[key] === value)
//         );

//         if (isBlocked) {
//           e.preventDefault();
//           const violation = {
//             type: 'KEYBOARD_SHORTCUT',
//             key: e.code,
//             severity: 'LOW'
//           };
//           logEvent(`VIOLATION: Blocked keyboard shortcut: ${e.code}`, 'violation', violation);
//           setViolations(prev => prev + 1);
//         }
//       }
//     };

//     const handleContextMenu = (e) => {
//       if (isMonitoring) {
//         e.preventDefault();
//         const violation = {
//           type: 'RIGHT_CLICK',
//           severity: 'LOW'
//         };
//         logEvent('VIOLATION: Right-click blocked', 'violation', violation);
//         setViolations(prev => prev + 1);
//       }
//     };

//     const handleBeforeUnload = (e) => {
//       if (isMonitoring) {
//         const violation = {
//           type: 'PAGE_EXIT_ATTEMPT',
//           severity: 'CRITICAL'
//         };
//         logEvent('VIOLATION: User attempted to close page', 'violation', violation);
//         e.preventDefault();
//         e.returnValue = 'Are you sure you want to leave the session?';
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('contextmenu', handleContextMenu);
//     window.addEventListener('beforeunload', handleBeforeUnload);
   
//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('contextmenu', handleContextMenu);
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [isMonitoring]);

//   useEffect(() => {
//     if (violations > 20) {
//       navigate("/");
//     }
//   }, [violations, navigate]);

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4">
//           <div className="text-center">
//             <div className="text-6xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-white mb-4">Proctoring System Error</h2>
//             <p className="text-white/80 mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all duration-300"
//             >
//               🔄 Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
//       <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 py-3">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <span className="text-2xl">🔒</span>
//                 <div>
//                   <h1 className="text-white font-bold text-lg">{sessionInfo.title}</h1>
//                   <p className="text-white/70 text-sm">AI Proctored Session - ID: {sessionInfo.sessionId}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//               <div className="flex flex-wrap items-center gap-2">
//                 {Object.entries(status).map(([key, { text, type }]) => (
//                   <div key={key} className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-all duration-300 ${
//                     type === 'safe' ? 'bg-green-500/20 text-green-100 border border-green-400/30' :
//                     type === 'warning' ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30' :
//                     'bg-red-500/20 text-red-100 border border-red-400/30'
//                   }`}>
//                     <span className="text-xs">
//                       {key === 'face' ? '👤' :
//                        key === 'gaze' ? '👀' :
//                        key === 'focus' ? '🖥️' : '👥'}
//                     </span>
//                     <span className="whitespace-nowrap">{text}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-4 text-white">
//                   <div className="text-center">
//                     <div className="text-xs opacity-70">Time</div>
//                     <div className="font-mono font-bold text-sm">{monitorTime}</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xs opacity-70">Violations</div>
//                     <div className="font-bold text-red-300 text-sm">{violations}</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xs opacity-70">Confidence</div>
//                     <div className="font-bold text-blue-300 text-sm">{faceConfidence}</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xs opacity-70">Snapshots</div>
//                     <div className="font-bold text-purple-300 text-sm">{snapshotCount}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         playsInline
//         className="fixed top-20 left-4 w-40 h-30 border-2 border-white/50 rounded-lg z-40 bg-black shadow-lg"
//         style={{ transform: 'scaleX(-1)' }}
//       />
//       <canvas ref={canvasRef} className="hidden" />

//       <div className="fixed top-20 left-48 z-40">
//         <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
//           cameraActive && cameraPermissionGranted ? 
//           'bg-green-500/80 text-white' : 
//           'bg-red-500/80 text-white'
//         }`}>
//           {cameraActive && cameraPermissionGranted ? '📹 Camera Active' : '📹 Camera Issue'}
//         </div>
//       </div>

//       <div className="relative pt-20">
//         {!systemReady && (
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//               <p className="text-white text-lg">Initializing Proctoring System...</p>
//               <p className="text-white/70 text-sm mt-2">Please allow camera access when prompted</p>
//               {!cameraPermissionGranted && (
//                 <p className="text-yellow-300 text-sm mt-2 font-semibold">
//                   ⚠️ Camera permission required
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
        
//         <div className="min-h-screen">
//           {children}
//         </div>
//       </div>

//       {isMonitoring && (
//         <div className="fixed bottom-4 right-4 z-50">
//           <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 border border-red-400">
//             <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//             <span className="font-semibold text-sm">RECORDING</span>
//           </div>
//         </div>
//       )}

//       <div className="fixed bottom-20 left-4 right-4 lg:hidden z-40">
//         {isMonitoring && (
//           <div className="bg-black/80 backdrop-blur-lg rounded-xl p-3 text-white text-xs">
//             <div className="grid grid-cols-2 gap-2">
//               {Object.entries(status).map(([key, { text, type }]) => (
//                 <div key={key} className={`flex items-center space-x-1 ${
//                   type === 'safe' ? 'text-green-300' :
//                   type === 'warning' ? 'text-yellow-300' :
//                   'text-red-300'
//                 }`}>
//                   <span className="text-xs">
//                     {key === 'face' ? '👤' :
//                      key === 'gaze' ? '👀' :
//                      key === 'focus' ? '🖥️' : '👥'}
//                   </span>
//                   <span className="truncate">{text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Outer wrapper component that provides the context
// const ProctoredRouteWrapper = ({ children }) => {
//   return (
//     <SessionProvider>
//       <ProctoredContent>{children}</ProctoredContent>
//     </SessionProvider>
//   );
// };

// export default ProctoredRouteWrapper;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { SessionProvider, useSession } from '../utils/SessionContext';

const API_URL = import.meta.env.VITE_API_URL;

// Inner component that uses the session context
const ProctoredContent = ({ children }) => {
  const { sessionId, setSessionId } = useSession();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [violations, setViolations] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [monitorTime, setMonitorTime] = useState('00:00');
  const [faceConfidence, setFaceConfidence] = useState('--');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [systemReady, setSystemReady] = useState(false);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [lastDetectionTime, setLastDetectionTime] = useState(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [snapshotCount, setSnapshotCount] = useState(0);
  const [status, setStatus] = useState({
    face: { text: 'Face: Detecting...', type: 'safe' },
    gaze: { text: 'Gaze: Monitoring...', type: 'safe' },
    focus: { text: 'Focus: Active', type: 'safe' },
    person: { text: 'People: Checking...', type: 'safe' }
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const monitoringIntervalRef = useRef(null);
  const lastGazeDirection = useRef('center');
  const cameraCheckRef = useRef(null);
  const streamRef = useRef(null);
  const snapshotIntervalRef = useRef(null);
  
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const PINATA_API_KEY =import.meta.env.PINATA_API_KEY;
  const PINATA_SECRET_KEY =import.meta.env.PINATA_SECRET_KEY;

  const getSessionInfo = () => {
    if (location.pathname.includes('/interview/start/')) {
      // For interview route, use interviewId from params
      const interviewId = params.interviewId;
      return {
        type: 'INTERVIEW',
        sessionId: sessionId || interviewId, // Use context sessionId if available, fallback to interviewId
        routeId: interviewId,
        title: 'Interview Session'
      };
    } else if (location.pathname.includes('/dsa-interview-platform/')) {
      return {
        type: 'DSA_INTERVIEW',
        sessionId: params.sessionId,
        routeId: params.sessionId,
        title: 'DSA Interview Platform'
      };
    } else if (location.pathname.includes('/resume-platform/')) {
      return {
        type: 'RESUME_INTERVIEW',
        sessionId: params.sessionId,
        routeId: params.sessionId,
        title: 'Resume Interview Platform'
      };
    }
    return { type: 'UNKNOWN', sessionId: 'unknown', routeId: 'unknown', title: 'Session' };
  };

  const sessionInfo = getSessionInfo();

  // Initialize sessionId from route params if not already set
  useEffect(() => {
    if (!sessionId && sessionInfo.routeId && sessionInfo.routeId !== 'unknown') {
      console.log('Initializing sessionId from route params:', sessionInfo.routeId);
      setSessionId(sessionInfo.routeId);
    }
  }, [sessionId, sessionInfo.routeId, setSessionId]);

  // Log when sessionId changes
  useEffect(() => {
    console.log('🔑 [SESSION] SessionId updated:', {
      sessionId,
      sessionType: sessionInfo.type,
      routeId: sessionInfo.routeId,
      isInterviewRoute: sessionInfo.type === 'INTERVIEW',
      canStartSnapshots: !!sessionId && sessionId !== sessionInfo.routeId
    });

    // Auto-start monitoring when sessionId becomes valid for interview routes
    if (sessionInfo.type === 'INTERVIEW' && 
        sessionId && 
        sessionId !== sessionInfo.routeId && 
        !isMonitoring && 
        systemReady && 
        cameraPermissionGranted) {
      console.log('🚀 [SESSION] Valid sessionId detected, auto-starting monitoring');
      startMonitoring();
    }
  }, [sessionId, sessionInfo.type, sessionInfo.routeId, isMonitoring, systemReady, cameraPermissionGranted]);

  const logEvent = (message, type = 'info', data = {}) => {
    const timestamp = new Date().toISOString();
    const currentSessionId = sessionId || sessionInfo.sessionId;
    const logData = {
      timestamp,
      sessionType: sessionInfo.type,
      sessionId: currentSessionId,
      route: location.pathname,
      message,
      type,
      violationCount: violations,
      isMonitoring,
      monitorTime,
      faceConfidence,
      systemReady,
      cameraActive,
      cameraPermissionGranted,
      ...data
    };
    
    //console.log(`[PROCTORING LOG] ${timestamp} - ${type.toUpperCase()}: ${message}`, logData);
  };

  const logSystemStatus = () => {
    if (!isMonitoring) return;
    
    logEvent('System heartbeat', 'heartbeat', {
      currentStatus: status,
      violations: violations,
      duration: monitorTime,
      faceConfidence: faceConfidence,
      videoReady: videoRef.current?.readyState === 4,
      documentHidden: document.hidden,
      windowFocused: document.hasFocus(),
      cameraActive: cameraActive,
      timestamp: Date.now()
    });
  };

  const updateStatus = (key, text, type) => {
    setStatus(prev => ({
      ...prev,
      [key]: { text, type }
    }));
  };

  const handleVisibilityChange = () => {
    if (document.hidden && isMonitoring) {
      const violation = {
        type: 'FOCUS_LOST',
        action: 'TAB_SWITCH_OR_MINIMIZE',
        severity: 'HIGH'
      };
      logEvent('VIOLATION: User switched tab or minimized window', 'violation', violation);
      updateStatus('focus', 'Focus: Tab Switched!', 'danger');
      setViolations(prev => prev + 1);
    } else if (!document.hidden && isMonitoring) {
      updateStatus('focus', 'Focus: Active', 'safe');
      logEvent('User returned to session tab', 'info');
    }
  };

  const cleanup = () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      if (monitoringIntervalRef.statusInterval) {
        clearInterval(monitoringIntervalRef.statusInterval);
      }
    }
    if (cameraCheckRef.current) {
      clearInterval(cameraCheckRef.current);
    }
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const setupCamera = async () => {
    try {
      logEvent('Requesting camera access...', 'info');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          facingMode: 'user' 
        }
      });
      
      streamRef.current = stream;
      setCameraPermissionGranted(true);
      logEvent('Camera permission granted', 'success');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        return new Promise((resolve, reject) => {
          let resolved = false;
          
          const timeout = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              logEvent('Video loading timeout - but continuing anyway', 'warning');
              setCameraActive(true);
              resolve();
            }
          }, 5000);

          const handleSuccess = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              logEvent('Camera metadata loaded successfully', 'success');
              setCameraActive(true);
              resolve();
            }
          };

          const handleError = (error) => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              logEvent('Video element error', 'error');
              setCameraActive(false);
              reject(error);
            }
          };

          videoRef.current.onloadedmetadata = handleSuccess;
          videoRef.current.oncanplay = handleSuccess;
          videoRef.current.onloadeddata = handleSuccess;
          videoRef.current.onerror = handleError;
          
          videoRef.current.play().then(() => {
            logEvent('Video play started immediately', 'success');
            handleSuccess();
          }).catch(playError => {
            logEvent(`Video autoplay failed (this is normal): ${playError.message}`, 'info');
          });

          const checkDimensions = () => {
            if (videoRef.current && videoRef.current.videoWidth > 0) {
              logEvent('Video dimensions detected, considering ready', 'info');
              handleSuccess();
            }
          };

          setTimeout(checkDimensions, 1000);
          setTimeout(checkDimensions, 2000);
        });
      }
    } catch (error) {
      setCameraActive(false);
      setCameraPermissionGranted(false);
      logEvent(`Camera setup failed: ${error.message}`, 'error');
      
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera access denied. Please allow camera permission and refresh.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found. Please connect a camera and refresh.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera is busy or not available. Please close other applications using the camera.');
      } else {
        throw new Error(`Camera setup failed: ${error.message}`);
      }
    }
  };

  const isCameraWorking = () => {
    if (!videoRef.current) return false;
    if (!cameraPermissionGranted) return false;
    
    const video = videoRef.current;
    if (video.readyState >= 1) {
      return true;
    }
    
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      return true;
    }
    
    return false;
  };

  const captureAndUploadSnapshot = async () => {
    console.log('🔴 [SNAPSHOT] Function called', {
      sessionId: sessionId,
      sessionInfoType: sessionInfo.type,
      videoExists: !!videoRef.current,
      canvasExists: !!canvasRef.current,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight,
      isMonitoring,
      cameraActive,
      cameraPermissionGranted
    });

    // CRITICAL: Only use sessionId from context, not from route params
    // For interview routes, sessionId is set only AFTER the interview starts
    if (!sessionId) {
      console.log('⚠️ [SNAPSHOT] No sessionId in context yet, skipping backend submission');
      logEvent('Snapshot upload skipped - session not initialized', 'warning');
      return;
    }

    // Additional validation: sessionId should not be the interviewId
    if (sessionInfo.type === 'INTERVIEW' && sessionId === sessionInfo.routeId) {
      console.log('⚠️ [SNAPSHOT] SessionId matches interviewId - session not properly initialized yet');
      logEvent('Snapshot upload skipped - using interviewId instead of sessionId', 'warning');
      return;
    }

    if (!videoRef.current || !canvasRef.current) {
      logEvent('Snapshot failed: video or canvas not available', 'warning');
      return;
    }

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.log('⚠️ [SNAPSHOT] Video has no dimensions yet');
        logEvent('Snapshot skipped: video dimensions not ready', 'warning');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      console.log('✅ [SNAPSHOT] Canvas drawn successfully', {
        width: canvas.width,
        height: canvas.height
      });
      
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      });
      
      if (!blob) {
        console.log('❌ [SNAPSHOT] Blob creation failed');
        logEvent('Snapshot failed: could not create blob', 'warning');
        return;
      }

      console.log('✅ [SNAPSHOT] Blob created', {
        size: blob.size,
        type: blob.type
      });

      if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        console.error('❌ [SNAPSHOT] Pinata credentials missing!', {
          hasApiKey: !!PINATA_API_KEY,
          hasSecretKey: !!PINATA_SECRET_KEY
        });
        logEvent('Pinata credentials not configured', 'error');
        return;
      }

      console.log('✅ [SNAPSHOT] Pinata credentials found');

      const formData = new FormData();
      const timestamp = Date.now();
      const filename = `snapshot_${sessionId}_${timestamp}.jpg`;
      formData.append('file', blob, filename);
      
      const metadata = JSON.stringify({
        name: filename,
        keyvalues: {
          sessionId: sessionId,
          sessionType: sessionInfo.type,
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      console.log('📤 [SNAPSHOT] Uploading to Pinata...', { filename });
      logEvent('Uploading snapshot to Pinata...', 'info');

      const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: formData,
      });

      console.log('📥 [SNAPSHOT] Pinata response received', {
        status: pinataResponse.status,
        ok: pinataResponse.ok
      });

      if (!pinataResponse.ok) {
        const errorData = await pinataResponse.json();
        console.error('❌ [SNAPSHOT] Pinata upload failed', errorData);
        throw new Error(`Pinata upload failed: ${JSON.stringify(errorData)}`);
      }

      const pinataData = await pinataResponse.json();
      const ipfsHash = pinataData.IpfsHash;
      const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

      console.log('✅ [SNAPSHOT] Pinata upload successful!', {
        ipfsHash,
        pinataUrl
      });

      logEvent('Image uploaded to Pinata successfully', 'success', {
        ipfsHash: ipfsHash,
        pinataUrl: pinataUrl
      });

      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ [SNAPSHOT] No auth token found');
        logEvent('Backend submission failed: no auth token found', 'error');
        return;
      }

      console.log('📤 [SNAPSHOT] Sending to backend...', {
        endpoint: `${API_URL}/interview/interview-images/${sessionId}/`,
        hasToken: !!token,
        sessionId: sessionId
      });

      const response = await fetch(
        `${API_URL}/interview/interview-images/${sessionId}/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_url: pinataUrl
          }),
        }
      );

      console.log('📥 [SNAPSHOT] Backend response', {
        status: response.status,
        ok: response.ok
      });

      if (response.ok) {
        const data = await response.json();
        setSnapshotCount(prev => prev + 1);
        
        console.log('✅ [SNAPSHOT] Complete success!', {
          snapshotId: data.image_id,
          snapshotNumber: snapshotCount + 1
        });
        
        logEvent('Snapshot URL submitted to backend successfully', 'success', {
          snapshotId: data.image_id,
          snapshotUrl: data.image_url,
          ipfsHash: ipfsHash,
          timestamp: new Date().toISOString(),
          snapshotNumber: snapshotCount + 1
        });
      } else {
        const errorData = await response.json();
        console.error('❌ [SNAPSHOT] Backend submission failed', {
          status: response.status,
          error: errorData
        });
        
        logEvent('Backend submission failed', 'error', {
          status: response.status,
          error: errorData,
          pinataUrl: pinataUrl
        });
      }
    } catch (error) {
      console.error('❌ [SNAPSHOT] Error:', error);
      logEvent(`Snapshot capture/upload error: ${error.message}`, 'error', {
        errorStack: error.stack
      });
    }
  };

  const analyzeFaceDetections = (detections) => {
    const faceCount = detections.length;

    if (faceCount === 0) {
      updateStatus('face', 'Face: Not Detected', 'warning');
      updateStatus('person', 'People: None detected', 'warning');
      setFaceConfidence('0%');
      
      if (!lastDetectionTime || Date.now() - lastDetectionTime > 10000) {
        const violation = {
          type: 'FACE_NOT_DETECTED',
          severity: 'MEDIUM',
          faceCount: 0,
          duration: lastDetectionTime ? Date.now() - lastDetectionTime : 0
        };
        logEvent('VIOLATION: No face detected for extended period', 'violation', violation);
        updateStatus('face', 'Face: Not Detected!', 'danger');
        setViolations(prev => prev + 1);
      }
    } else if (faceCount === 1) {
      updateStatus('face', 'Face: Detected ✅', 'safe');
      updateStatus('person', 'People: 1 person', 'safe');
      updateStatus('gaze', 'Gaze: Looking ahead', 'safe');
      
      const confidence = Math.round(detections[0].detection.score * 100);
      setFaceConfidence(confidence + '%');
      setLastDetectionTime(Date.now());
    } else if (faceCount > 1) {
      const violation = {
        type: 'MULTIPLE_FACES',
        severity: 'CRITICAL',
        faceCount: faceCount
      };
      logEvent(`VIOLATION: ${faceCount} people detected`, 'violation', violation);
      updateStatus('person', `People: ${faceCount} detected!`, 'danger');
      setViolations(prev => prev + 1);
    }
  };

  const detectFaces = async () => {
    if (!isCameraWorking()) {
      if (!cameraPermissionGranted) {
        updateStatus('face', 'Face: Camera Permission Needed', 'warning');
        updateStatus('person', 'People: Camera Permission Needed', 'warning');
        updateStatus('gaze', 'Gaze: Camera Permission Needed', 'warning');
        setFaceConfidence('No Permission');
        return;
      }

      if (!videoRef.current) {
        updateStatus('face', 'Face: Loading...', 'warning');
        updateStatus('person', 'People: Loading...', 'warning');
        updateStatus('gaze', 'Gaze: Loading...', 'warning');
        setFaceConfidence('Loading...');
        return;
      }

      if (videoRef.current.readyState < 2) {
        updateStatus('face', 'Face: Camera Starting...', 'warning');
        updateStatus('person', 'People: Camera Starting...', 'warning');
        updateStatus('gaze', 'Gaze: Camera Starting...', 'warning');
        setFaceConfidence('Starting...');
        return;
      }
    }

    const canvas = canvasRef.current;
    if (canvas && videoRef.current) {
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      
      try {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        let totalBrightness = 0;
        let pixelCount = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;
          pixelCount++;
        }
        
        const avgBrightness = totalBrightness / pixelCount;
        
        if (avgBrightness < 5) {
          let variation = 0;
          for (let i = 0; i < pixels.length; i += 16) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const brightness = (r + g + b) / 3;
            variation += Math.abs(brightness - avgBrightness);
          }
          
          const avgVariation = variation / (pixelCount / 4);
          
          if (avgVariation < 2) {
            const violation = {
              type: 'CAMERA_BLOCKED',
              severity: 'HIGH',
              reason: 'Camera appears to be covered or blocked',
              avgBrightness,
              avgVariation
            };
            logEvent('VIOLATION: Camera appears blocked', 'violation', violation);
            updateStatus('face', 'Face: Camera Covered!', 'danger');
            updateStatus('person', 'People: Camera Covered!', 'danger');
            updateStatus('gaze', 'Gaze: Camera Covered!', 'danger');
            setFaceConfidence('Blocked');
            setViolations(prev => prev + 1);
            return;
          }
        }
      } catch (canvasError) {
        logEvent('Canvas drawing failed', 'warning', { error: canvasError.message });
        updateStatus('face', 'Face: Processing...', 'warning');
        updateStatus('person', 'People: Processing...', 'warning');
        updateStatus('gaze', 'Gaze: Processing...', 'warning');
        setFaceConfidence('Processing...');
        return;
      }
    }

    try {
      if (modelsLoaded && window.faceapi) {
        const detections = await window.faceapi
          .detectAllFaces(videoRef.current, new window.faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();
        
        analyzeFaceDetections(detections);
        setLastDetectionTime(Date.now());
      } else {
        updateStatus('face', 'Face: Basic Detection ⚠️', 'warning');
        updateStatus('gaze', 'Gaze: Basic Monitor', 'warning');
        updateStatus('person', 'People: Basic Count', 'warning');
        setFaceConfidence('Basic Mode');
      }
    } catch (error) {
      logEvent(`Face detection error: ${error.message}`, 'error', { 
        errorStack: error.stack,
        videoReadyState: videoRef.current?.readyState,
        cameraActive: cameraActive
      });
      
      updateStatus('face', 'Face: Detection Issue', 'warning');
      updateStatus('gaze', 'Gaze: Detection Issue', 'warning');
      updateStatus('person', 'People: Detection Issue', 'warning');
      setFaceConfidence('Error');
    }
  };

  const updateTimer = () => {
    if (!startTime) return;
    
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    setMonitorTime(
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  };

  const startMonitoring = () => {
    if (isMonitoring) return;
    
    // For interview routes, validate we have a real sessionId (not just interviewId)
    if (sessionInfo.type === 'INTERVIEW') {
      if (!sessionId || sessionId === sessionInfo.routeId) {
        console.log('⚠️ [MONITORING] Cannot start - no valid sessionId yet');
        logEvent('Monitoring start delayed - waiting for session initialization', 'warning');
        return;
      }
    }
    
    setIsMonitoring(true);
    setStartTime(Date.now());
    setViolations(0);
    setSnapshotCount(0);
    
    console.log('🚀 [MONITORING] Starting monitoring and snapshots', {
      sessionId,
      sessionType: sessionInfo.type
    });
    
    logEvent(`Monitoring started for ${sessionInfo.title}`, 'info', {
      action: 'MONITORING_STARTED',
      sessionType: sessionInfo.type,
      sessionId: sessionId,
      route: location.pathname
    });

    monitoringIntervalRef.current = setInterval(() => {
      try {
        detectFaces();
        updateTimer();
      } catch (error) {
        logEvent(`Monitoring error: ${error.message}`, 'error');
      }
    }, 2000);

    const statusInterval = setInterval(() => {
      logSystemStatus();
    }, 10000);

    snapshotIntervalRef.current = setInterval(() => {
      console.log('📸 [SNAPSHOT] Interval triggered');
      captureAndUploadSnapshot();
    }, 10000);

    monitoringIntervalRef.statusInterval = statusInterval;
    
    console.log('✅ [MONITORING] All intervals started', {
      hasMonitoringInterval: !!monitoringIntervalRef.current,
      hasSnapshotInterval: !!snapshotIntervalRef.current,
      hasStatusInterval: !!statusInterval
    });
    
    logEvent('Snapshot capture started - will capture every 10 seconds', 'info');
    
    setTimeout(() => {
      console.log('📸 [SNAPSHOT] Taking first test snapshot...');
      captureAndUploadSnapshot();
    }, 2000);
  };

  const stopMonitoring = () => {
    if (!isMonitoring) return;
    
    setIsMonitoring(false);
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      if (monitoringIntervalRef.statusInterval) {
        clearInterval(monitoringIntervalRef.statusInterval);
      }
    }
    if (snapshotIntervalRef.current) {
      clearInterval(snapshotIntervalRef.current);
    }
    
    logEvent('Monitoring stopped', 'info', {
      action: 'MONITORING_STOPPED',
      totalViolations: violations,
      totalSnapshots: snapshotCount,
      duration: monitorTime,
      route: location.pathname
    });
  };

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        logEvent('Initializing AI proctoring system for route: ' + location.pathname, 'info');
        
        if (typeof window !== 'undefined' && window.faceapi) {
          try {
            await Promise.all([
              window.faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
              window.faceapi.nets.faceLandmark68Net.loadFromUri('/models')
            ]);
            setModelsLoaded(true);
            logEvent('AI models loaded successfully', 'success');
          } catch (modelError) {
            logEvent('AI models failed to load, using basic monitoring', 'warning');
            setModelsLoaded(false);
          }
        } else {
          logEvent('face-api.js not available, using basic monitoring', 'warning');
          setModelsLoaded(false);
        }
  
        await setupCamera();
        
        setTimeout(() => {
          setSystemReady(true);
          logEvent('Proctoring system ready', 'success');
          
          // Only auto-start for non-interview routes OR if we have a valid sessionId
          if (location.pathname.includes('/interview/start/')) {
            if (cameraPermissionGranted && sessionId && sessionId !== sessionInfo.routeId) {
              logEvent('Auto-starting monitoring for interview with valid sessionId', 'info');
              startMonitoring();
            } else {
              logEvent('Waiting for interview session initialization before starting monitoring', 'info');
            }
          } else if (cameraPermissionGranted) {
            // For DSA and Resume platforms, start immediately
            logEvent('Auto-starting monitoring for platform', 'info');
            startMonitoring();
          }
        }, 1000);
        
      } catch (error) {
        setError(error.message);
        logEvent(`System initialization failed: ${error.message}`, 'error');
      }
    };
  
    initializeSystem();
    
    return () => {
      logEvent('Component unmounting - cleaning up monitoring', 'info');
      stopMonitoring();
      cleanup();
    };
  }, [location.pathname, cameraPermissionGranted]);

  useEffect(() => {
    if (isMonitoring && streamRef.current) {
      cameraCheckRef.current = setInterval(() => {
        const tracks = streamRef.current.getTracks();
        const videoTrack = tracks.find(track => track.kind === 'video');
        
        if (videoTrack) {
          if (videoTrack.readyState === 'ended') {
            logEvent('Camera track ended', 'warning');
            setCameraActive(false);
          } else if (!videoTrack.enabled) {
            logEvent('Camera track disabled', 'warning');
            setCameraActive(false);
          } else {
            setCameraActive(true);
          }
        } else {
          logEvent('No video track found', 'warning');
          setCameraActive(false);
        }
      }, 5000);
    }

    return () => {
      if (cameraCheckRef.current) {
        clearInterval(cameraCheckRef.current);
      }
    };
  }, [isMonitoring]);

  useEffect(() => {
    const handleWindowBlur = () => {
      if (isMonitoring) {
        const violation = {
          type: 'FOCUS_LOST',
          action: 'WINDOW_BLUR',
          severity: 'MEDIUM'
        };
        logEvent('VIOLATION: Window lost focus', 'violation', violation);
        updateStatus('focus', 'Focus: Lost!', 'danger');
        setViolations(prev => prev + 1);
      }
    };
  
    const handleWindowFocus = () => {
      if (isMonitoring) {
        updateStatus('focus', 'Focus: Active', 'safe');
        logEvent('Window regained focus', 'info');
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
  
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isMonitoring]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isMonitoring) {
        const blockedKeys = [
          { altKey: true, code: 'Tab' },
          { ctrlKey: true, shiftKey: true, code: 'KeyI' },
          { code: 'F12' },
          { ctrlKey: true, code: 'KeyU' },
          { ctrlKey: true, shiftKey: true, code: 'KeyC' }
        ];

        const isBlocked = blockedKeys.some(blocked => 
          Object.entries(blocked).every(([key, value]) => e[key] === value)
        );

        if (isBlocked) {
          e.preventDefault();
          const violation = {
            type: 'KEYBOARD_SHORTCUT',
            key: e.code,
            severity: 'LOW'
          };
          logEvent(`VIOLATION: Blocked keyboard shortcut: ${e.code}`, 'violation', violation);
          setViolations(prev => prev + 1);
        }
      }
    };

    const handleContextMenu = (e) => {
      if (isMonitoring) {
        e.preventDefault();
        const violation = {
          type: 'RIGHT_CLICK',
          severity: 'LOW'
        };
        logEvent('VIOLATION: Right-click blocked', 'violation', violation);
        setViolations(prev => prev + 1);
      }
    };

    const handleBeforeUnload = (e) => {
      if (isMonitoring) {
        const violation = {
          type: 'PAGE_EXIT_ATTEMPT',
          severity: 'CRITICAL'
        };
        logEvent('VIOLATION: User attempted to close page', 'violation', violation);
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave the session?';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('beforeunload', handleBeforeUnload);
   
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isMonitoring]);

  useEffect(() => {
    if (violations > 20) {
      navigate("/");
    }
  }, [violations, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Proctoring System Error</h2>
            <p className="text-white/80 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all duration-300"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔒</span>
                <div>
                  <h1 className="text-white font-bold text-lg">{sessionInfo.title}</h1>
                  <p className="text-white/70 text-sm">AI Proctored Session - ID: {sessionId || sessionInfo.sessionId}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(status).map(([key, { text, type }]) => (
                  <div key={key} className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-all duration-300 ${
                    type === 'safe' ? 'bg-green-500/20 text-green-100 border border-green-400/30' :
                    type === 'warning' ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30' :
                    'bg-red-500/20 text-red-100 border border-red-400/30'
                  }`}>
                    <span className="text-xs">
                      {key === 'face' ? '👤' :
                       key === 'gaze' ? '👀' :
                       key === 'focus' ? '🖥️' : '👥'}
                    </span>
                    <span className="whitespace-nowrap">{text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4 text-white">
                  <div className="text-center">
                    <div className="text-xs opacity-70">Time</div>
                    <div className="font-mono font-bold text-sm">{monitorTime}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-70">Violations</div>
                    <div className="font-bold text-red-300 text-sm">{violations}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-70">Confidence</div>
                    <div className="font-bold text-blue-300 text-sm">{faceConfidence}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs opacity-70">Snapshots</div>
                    <div className="font-bold text-purple-300 text-sm">{snapshotCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="fixed top-20 left-4 w-40 h-30 border-2 border-white/50 rounded-lg z-40 bg-black shadow-lg"
        style={{ transform: 'scaleX(-1)' }}
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="fixed top-20 left-48 z-40">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          cameraActive && cameraPermissionGranted ? 
          'bg-green-500/80 text-white' : 
          'bg-red-500/80 text-white'
        }`}>
          {cameraActive && cameraPermissionGranted ? '📹 Camera Active' : '📹 Camera Issue'}
        </div>
      </div>

      <div className="relative pt-20">
        {!systemReady && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Initializing Proctoring System...</p>
              <p className="text-white/70 text-sm mt-2">Please allow camera access when prompted</p>
              {!cameraPermissionGranted && (
                <p className="text-yellow-300 text-sm mt-2 font-semibold">
                  ⚠️ Camera permission required
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="min-h-screen">
          {children}
        </div>
      </div>

      {isMonitoring && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 border border-red-400">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm">RECORDING</span>
          </div>
        </div>
      )}

      <div className="fixed bottom-20 left-4 right-4 lg:hidden z-40">
        {isMonitoring && (
          <div className="bg-black/80 backdrop-blur-lg rounded-xl p-3 text-white text-xs">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(status).map(([key, { text, type }]) => (
                <div key={key} className={`flex items-center space-x-1 ${
                  type === 'safe' ? 'text-green-300' :
                  type === 'warning' ? 'text-yellow-300' :
                  'text-red-300'
                }`}>
                  <span className="text-xs">
                    {key === 'face' ? '👤' :
                     key === 'gaze' ? '👀' :
                     key === 'focus' ? '🖥️' : '👥'}
                  </span>
                  <span className="truncate">{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Outer wrapper component that provides the context
const ProctoredRouteWrapper = ({ children }) => {
  return (
    <SessionProvider>
      <ProctoredContent>{children}</ProctoredContent>
    </SessionProvider>
  );
};

export default ProctoredRouteWrapper;