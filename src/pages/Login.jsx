// // Login.jsx
// import React, { useState, useEffect } from 'react';
// import { Eye, EyeOff, ArrowRight, ArrowLeft, User, Mail, Lock, Check, Shield } from 'lucide-react';
// import { useNavigate, Link } from 'react-router-dom';
// import { handleToken } from '../utils/handleToken';
// import MessageNotification from '../components/ui/MessageNotification';

// const baseUrl = import.meta.env.VITE_API_URL;

// const OwlMascot = ({ showPassword, isPasswordFocused }) => (
//   <div className="mb-8">
//     <svg
//       width="96"
//       height="96"
//       viewBox="0 0 200 200"
//       xmlns="http://www.w3.org/2000/svg"
//       className="drop-shadow-lg"
//     >
//       <circle cx="100" cy="100" r="75" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="3" />
//       <circle cx="100" cy="100" r="70" fill="url(#owlGradient)" />
//       <defs>
//         <linearGradient id="owlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#A855F7" />
//           <stop offset="100%" stopColor="#3B82F6" />
//         </linearGradient>
//         <linearGradient id="specsFog" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
//           <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
//         </linearGradient>
//       </defs>
//       <polygon points="45,45 65,25 75,55" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
//       <polygon points="155,45 135,25 125,55" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
//       <circle cx="75" cy="90" r="25" stroke="#374151" strokeWidth="3" fill="rgba(255,255,255,0.1)" />
//       <circle cx="125" cy="90" r="25" stroke="#374151" strokeWidth="3" fill="rgba(255,255,255,0.1)" />
//       <line x1="100" y1="90" x2="100" y2="90" stroke="#374151" strokeWidth="3" />
//       {!showPassword && isPasswordFocused && (
//         <>
//           <circle cx="75" cy="90" r="23" fill="url(#specsFog)" opacity="0.8" />
//           <circle cx="125" cy="90" r="23" fill="url(#specsFog)" opacity="0.8" />
//         </>
//       )}
//       {showPassword ? (
//         <>
//           <circle cx="75" cy="90" r="8" fill="#1F2937" />
//           <circle cx="125" cy="90" r="8" fill="#1F2937" />
//           <circle cx="77" cy="87" r="2" fill="white" />
//           <circle cx="127" cy="87" r="2" fill="white" />
//         </>
//       ) : isPasswordFocused ? (
//         <>
//           <path d="M 67 90 Q 75 85 83 90" stroke="#1F2937" strokeWidth="2" fill="none" />
//           <path d="M 117 90 Q 125 85 133 90" stroke="#1F2937" strokeWidth="2" fill="none" />
//         </>
//       ) : (
//         <>
//           <path d="M 67 90 Q 75 87 83 90" stroke="#1F2937" strokeWidth="3" fill="none" />
//           <path d="M 117 90 Q 125 87 133 90" stroke="#1F2937" strokeWidth="3" fill="none" />
//         </>
//       )}
//       <polygon points="95,110 105,110 100,125" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
//       <circle cx="55" cy="110" r="8" fill="rgba(219, 39, 119, 0.3)" />
//       <circle cx="145" cy="110" r="8" fill="rgba(219, 39, 119, 0.3)" />
//     </svg>
//   </div>
// );



// const ParticleField = () => {
//   const [particles, setParticles] = useState([]);
  
//   useEffect(() => {
//     const newParticles = Array.from({ length: 30 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 3 + 1,
//       speedX: (Math.random() - 0.5) * 0.3,
//       speedY: (Math.random() - 0.5) * 0.3,
//       opacity: Math.random() * 0.3 + 0.1,
//     }));
//     setParticles(newParticles);
    
//     const interval = setInterval(() => {
//       setParticles(prev => prev.map(particle => ({
//         ...particle,
//         x: (particle.x + particle.speedX + 100) % 100,
//         y: (particle.y + particle.speedY + 100) % 100,
//       })));
//     }, 100);
    
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="fixed inset-0 overflow-hidden pointer-events-none">
//       {particles.map(particle => (
//         <div
//           key={particle.id}
//           className="absolute rounded-full bg-gradient-to-r from-purple-300 to-lavender-300 animate-pulse"
//           style={{
//             left: `${particle.x}%`,
//             top: `${particle.y}%`,
//             width: `${particle.size}px`,
//             height: `${particle.size}px`,
//             opacity: particle.opacity,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// const FloatingShape = ({ delay = 0, shape = 'circle', size = 'w-8 h-8', position = 'top-1/4 left-1/4' }) => {
//   const shapeStyles = {
//     circle: 'rounded-full',
//     triangle: 'triangle-shape',
//     square: 'rotate-45',
//     diamond: 'rotate-45 rounded-sm',
//   };

//   return (
//     <div
//       className={`absolute ${position} ${size} ${shapeStyles[shape]} bg-gradient-to-r from-lavender-200/20 to-purple-200/20 backdrop-blur-sm border border-white/10`}
//       style={{
//         animation: `float ${6 + delay}s ease-in-out infinite`,
//         animationDelay: `${delay}s`,
//         filter: 'drop-shadow(0 0 10px rgba(216, 180, 254, 0.3))',
//       }}
//     />
//   );
// };

// const GradientText = ({ children, className = '' }) => (
//   <span className={`bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent ${className}`}>
//     {children}
//   </span>
// );

// const AnimatedInput = ({ 
//   icon: Icon, 
//   type = 'text', 
//   placeholder, 
//   value, 
//   onChange, 
//   onFocus, 
//   onBlur, 
//   focused, 
//   error, 
//   showToggle = false, 
//   showPassword = false, 
//   onTogglePassword 
// }) => {
//   return (
//     <div className="relative group mb-4">
//       <div className="relative">
//         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 transition-all duration-300 group-hover:text-purple-500">
//           <Icon 
//             className={`w-5 h-5 transition-all duration-300 ${focused ? 'text-purple-500 scale-110' : ''}`}
//             style={{
//               filter: focused ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))' : 'none',
//             }}
//           />
//         </div>
//         <input
//           type={type}
//           placeholder={placeholder}
//           value={value}
//           onChange={onChange}
//           onFocus={onFocus}
//           onBlur={onBlur}
//           className={`w-full pl-10 ${showToggle ? 'pr-10' : ''} py-3 bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 transition-all duration-300 hover:border-slate-300 focus:outline-none focus:ring-0 ${
//             focused ? 'border-purple-400 shadow-lg shadow-purple-500/25 bg-white' : ''
//           } ${error ? 'border-red-400 shadow-lg shadow-red-500/25' : ''}`}
//           style={{
//             backdropFilter: 'blur(10px)',
//           }}
//         />
        
//         {showToggle && (
//           <button
//             type="button"
//             onClick={onTogglePassword}
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-purple-500 transition-all duration-300"
//           >
//             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//           </button>
//         )}
        
//         {focused && (
//           <div 
//             className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"
//             style={{
//               width: '100%',
//               animation: 'borderGlow 2s ease-in-out infinite',
//             }}
//           />
//         )}
//       </div>
      
//       {error && (
//         <div className="mt-2 text-red-500 text-sm flex items-center space-x-1 animate-bounce">
//           <span className="text-xs">⚠</span>
//           <span>{error}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// const Login = () => {
//   const navigate = useNavigate();
//   const [isActive, setIsActive] = useState(false);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isPasswordFocused, setIsPasswordFocused] = useState(false);
//   const [forgotUsername, setForgotUsername] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [isResetFocused, setIsResetFocused] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');
//   const [forgotMode, setForgotMode] = useState(false);
//   const [step, setStep] = useState(1);
//   const [resetToken, setResetToken] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [signupUsername, setSignupUsername] = useState('');
//   const [signupEmail, setSignupEmail] = useState('');
//   const [signupPassword, setSignupPassword] = useState('');
//   const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
//   const [showSignupPassword, setShowSignupPassword] = useState(false);
//   const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
//   const [verificationMode, setVerificationMode] = useState(false);
//   const [signupVerificationCode, setSignupVerificationCode] = useState('');
//   const [verificationId, setVerificationId] = useState('');
//   const [focusedField, setFocusedField] = useState(null);

//   const showLoginMessage = (msg, type = 'info') => {
//     setMessage(msg);
//     setMessageType(type);
//   };

//   const clearLoginMessage = () => {
//     setMessage('');
//     setMessageType('');
//   };

//   const validateLoginForm = () => {
//     const newErrors = {};
//     if (!username) newErrors.username = 'Username is required';
//     if (!password) newErrors.password = 'Password is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLoginSubmit = async () => {
//     if (validateLoginForm()) await handleLogin(username, password);
//   };

//   const handleLogin = async (user, pass) => {
//     setIsLoading(true);
//     try {
//       const success = await handleToken(user, pass, navigate);
//       if (success) {
//         showLoginMessage('Login successful!', 'success');
//       } else {
//         showLoginMessage('Login failed. Please check your credentials.', 'error');
//       }
//     } catch (error) {
//       showLoginMessage('Server error', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     setForgotMode(true);
//     setStep(1);
//     setForgotUsername('');
//     setVerificationCode('');
//     setNewPassword('');
//     setConfirmPassword('');
//     setResetToken('');
//     clearLoginMessage();
//   };

//   const handleSendCode = async (user) => {
//     if (!user) {
//       showLoginMessage('Username is required', 'error');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${baseUrl}/forgot-password/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: user }),
//       });
//       if (res.ok) {
//         setStep(2);
//         showLoginMessage('Verification code sent to your email.', 'success');
//       } else {
//         showLoginMessage('Failed to send verification code', 'error');
//       }
//     } catch (error) {
//       showLoginMessage('Server error', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyCode = async (code) => {
//     if (!code) {
//       showLoginMessage('Verification code is required', 'error');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${baseUrl}/verify-reset-code/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ verification_code: code }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setResetToken(data.reset_token || 'dummy-token');
//         setStep(3);
//         showLoginMessage('Code verified successfully!', 'success');
//       } else {
//         showLoginMessage(data.detail || 'Code verification failed', 'error');
//       }
//     } catch (error) {
//       showLoginMessage('Server error', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async (newPass, confirmPass) => {
//     if (newPass !== confirmPass) {
//       showLoginMessage('Passwords do not match', 'error');
//       return;
//     }
//     if (!newPass) {
//       showLoginMessage('Password is required', 'error');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${baseUrl}/reset-password/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           reset_token: resetToken,
//           password1: newPass,
//           password2: confirmPass,
//         }),
//       });
//       if (res.ok) {
//         showLoginMessage('Password reset successful!', 'success');
//         setTimeout(() => {
//           setForgotMode(false);
//           setStep(1);
//         }, 2000);
//       } else {
//         const data = await res.json();
//         showLoginMessage(data.detail || 'Reset failed', 'error');
//       }
//     } catch (error) {
//       showLoginMessage('Server error', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendCode = async (user) => {
//     if (!user) {
//       showLoginMessage('Username is required for resend', 'error');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${baseUrl}/resend-code/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: user }),
//       });
//       if (res.ok) {
//         showLoginMessage('Verification code resent!', 'success');
//       } else {
//         showLoginMessage('Failed to resend code', 'error');
//       }
//     } catch (error) {
//       showLoginMessage('Server error', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBackToLogin = () => {
//     setForgotMode(false);
//     setStep(1);
//     clearLoginMessage();
//   };

//   const handleSignUp = async () => {
//     if (signupPassword !== signupConfirmPassword) {
//       showLoginMessage('Passwords do not match', 'error');
//       return;
//     }

//     if (!signupUsername || !signupEmail || !signupPassword) {
//       showLoginMessage('Please fill in all fields', 'error');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(`${baseUrl}/register/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: signupUsername,
//           email: signupEmail,
//           password: signupPassword,
//           password_confirm: signupConfirmPassword,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setVerificationId(data.verification_id);
//         setVerificationMode(true);
//         showLoginMessage('Verification code sent to your email!', 'success');
//       } else {
//         showLoginMessage(data.error || JSON.stringify(data.errors) || 'Registration failed', 'error');
//       }
//     } catch (error) {
//       showLoginMessage('Server error during signup', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyEmail = async () => {
//     if (!signupVerificationCode) {
//       showLoginMessage('Please enter verification code', 'error');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(`${baseUrl}/verify-email/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           verification_code: signupVerificationCode,
//           verification_id: verificationId,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         showLoginMessage('Account created successfully! Redirecting...', 'success');
        
//         localStorage.setItem("authToken", data.token);
//         sessionStorage.setItem("email", signupEmail);
//         sessionStorage.setItem("password", signupPassword);
        
//         setTimeout(() => {
//           navigate('/profile-setup');
//         }, 1500);

//         setVerificationMode(false);
//         setSignupUsername('');
//         setSignupEmail('');
//         setSignupPassword('');
//         setSignupConfirmPassword('');
//         setSignupVerificationCode('');
//         setVerificationId('');
//       } else {
//         showLoginMessage(data.error || 'Verification failed', 'error');
//       }
//     } catch (error) {
//       showLoginMessage('Server error during verification', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignupResendCode = async () => {
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${baseUrl}/resend-code/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: signupEmail,
//           type: 'registration',
//         }),
//       });

//       if (response.ok) {
//         showLoginMessage('Verification code resent!', 'success');
//       } else {
//         showLoginMessage('Failed to resend code', 'error');
//       }
//     } catch (error) {
//       showLoginMessage('Server error', 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggle = () => {
//     setIsActive(!isActive);
//     setTimeout(() => {
//       navigate(isActive ? '/login' : '/signup');
//     }, 600);
//   };

//   let headerText = 'Welcome Back';
//   let subText = 'Our owl friend is keeping watch over your login';
//   if (forgotMode) {
//     if (step === 1) {
//       headerText = 'Forgot Password';
//       subText = 'Enter your username to receive a verification code';
//     } else if (step === 2) {
//       headerText = 'Verify Code';
//       subText = 'Enter the code sent to your email';
//     } else if (step === 3) {
//       headerText = 'Reset Password';
//       subText = 'Enter your new password';
//     }
//   }

//   const isMascotPasswordVisible = forgotMode && step === 3 ? showResetPassword : showPassword;
//   const isMascotPasswordFocused = forgotMode && step === 3 ? isResetFocused : isPasswordFocused;

//       return (
//       <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-purple-50 to-lavender-50 relative overflow-hidden">
//       <ParticleField />
//       <FloatingShape delay={0} shape="circle" size="w-16 h-16" position="top-10 left-10" />
//       <FloatingShape delay={1} shape="triangle" size="w-12 h-12" position="top-1/4 right-20" />
//       <FloatingShape delay={2} shape="square" size="w-8 h-8" position="top-1/2 left-16" />
//       <FloatingShape delay={3} shape="diamond" size="w-10 h-10" position="top-3/4 right-16" />
//       <FloatingShape delay={4} shape="circle" size="w-6 h-6" position="top-1/3 left-1/3" />
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(216,180,254,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(216,180,254,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-20 right-20 w-60 h-60 rounded-full bg-gradient-to-br from-lavender-200/30 to-purple-200/30 blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-200/30 to-lavender-200/30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
//       </div>
//       <div className="absolute top-6 left-6 z-20">
//         <button 
//           onClick={() => navigate('/')}
//           className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 group"
//           title="Go back to homepage"
//         >
//           <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
//         </button>
//       </div>
//       <div className="flex min-h-screen items-center justify-center p-6">
//         <div className={`container ${isActive ? 'active' : ''}`}>
//           <div className="form-container sign-up-container">
//             <div className="glassmorphic rounded-3xl p-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
//               <div className="text-center mb-4">
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
//                   Join InterXAI
//                 </h2>
//                 <p className="text-gray-600 text-sm">
//                   Start your journey
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 {verificationMode ? (
//                   <div className="text-center">
//                     <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
//                       <Mail className="w-8 h-8 text-white" />
//                     </div>
//                     <h2 className="text-2xl font-bold mb-3">
//                       <GradientText>Verify Your Email</GradientText>
//                     </h2>
//                     <p className="text-slate-600 mb-4 text-sm">
//                       Code sent to <strong>{signupEmail}</strong>
//                     </p>
//                     <AnimatedInput
//                       icon={Shield}
//                       type="text"
//                       placeholder="Enter verification code"
//                       value={signupVerificationCode}
//                       onChange={(e) => setSignupVerificationCode(e.target.value)}
//                       onFocus={() => setFocusedField('verification')}
//                       onBlur={() => setFocusedField(null)}
//                       focused={focusedField === 'verification'}
//                     />
//                     <button
//                       onClick={handleVerifyEmail}
//                       disabled={isLoading}
//                       className="btn-primary text-sm py-2"
//                     >
//                       {isLoading ? 'Verifying...' : 'Verify Email'}
//                     </button>
//                     <button
//                       onClick={handleSignupResendCode}
//                       disabled={isLoading}
//                       className="text-sm text-purple-600"
//                     >
//                       Resend Code
//                     </button>
//                     <button
//                       onClick={() => setVerificationMode(false)}
//                       className="text-sm text-slate-500"
//                     >
//                       Back
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <AnimatedInput
//                       icon={User}
//                       placeholder="Username"
//                       value={signupUsername}
//                       onChange={(e) => setSignupUsername(e.target.value)}
//                       onFocus={() => setFocusedField('username')}
//                       onBlur={() => setFocusedField(null)}
//                       focused={focusedField === 'username'}
//                     />
//                     <AnimatedInput
//                       icon={Mail}
//                       type="email"
//                       placeholder="Email"
//                       value={signupEmail}
//                       onChange={(e) => setSignupEmail(e.target.value)}
//                       onFocus={() => setFocusedField('email')}
//                       onBlur={() => setFocusedField(null)}
//                       focused={focusedField === 'email'}
//                     />
//                     <AnimatedInput
//                       icon={Lock}
//                       type={showSignupPassword ? "text" : "password"}
//                       placeholder="Password"
//                       value={signupPassword}
//                       onChange={(e) => setSignupPassword(e.target.value)}
//                       onFocus={() => setFocusedField('password')}
//                       onBlur={() => setFocusedField(null)}
//                       focused={focusedField === 'password'}
//                       showToggle
//                       showPassword={showSignupPassword}
//                       onTogglePassword={() => setShowSignupPassword(!showSignupPassword)}
//                     />
//                     <AnimatedInput
//                       icon={Lock}
//                       type={showSignupConfirmPassword ? "text" : "password"}
//                       placeholder="Confirm Password"
//                       value={signupConfirmPassword}
//                       onChange={(e) => setSignupConfirmPassword(e.target.value)}
//                       onFocus={() => setFocusedField('confirmPassword')}
//                       onBlur={() => setFocusedField(null)}
//                       focused={focusedField === 'confirmPassword'}
//                       showToggle
//                       showPassword={showSignupConfirmPassword}
//                       onTogglePassword={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
//                     />
//                     <button
//                       onClick={handleSignUp}
//                       disabled={isLoading}
//                       className="btn-primary text-sm py-2"
//                     >
//                       {isLoading ? 'Creating...' : 'Create Account'}
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="form-container sign-in-container">
//             <div className="glassmorphic rounded-3xl p-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
//               <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
//                 <OwlMascot showPassword={isMascotPasswordVisible} isPasswordFocused={isMascotPasswordFocused} />
//               </div>
//               <div className="text-center mb-4">
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
//                   {headerText}
//                 </h2>
//                 <p className="text-gray-600 text-sm">
//                   {subText}
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 {!forgotMode ? (
//                   <>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         Username
//                       </label>
//                       <input
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         className="input-field text-sm py-2"
//                         placeholder="Enter your username"
//                       />
//                       {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         Password
//                       </label>
//                       <div className="relative">
//                         <input
//                           type={showPassword ? 'text' : 'password'}
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           onFocus={() => setIsPasswordFocused(true)}
//                           onBlur={() => setIsPasswordFocused(false)}
//                           className="input-field pr-10 text-sm py-2"
//                           placeholder="Enter your password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-purple-600"
//                         >
//                           {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                         </button>
//                       </div>
//                       {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//                     </div>
//                     <div className="flex justify-end">
//                       <button
//                         onClick={handleForgotPassword}
//                         className="text-xs text-purple-600 hover:text-blue-600"
//                       >
//                         Forgot password?
//                       </button>
//                     </div>
//                     <button
//                       onClick={handleLoginSubmit}
//                       disabled={isLoading}
//                       className="btn-primary text-sm py-2"
//                     >
//                       {isLoading ? 'Signing in...' : 'Sign In'}
//                     </button>
//                   </>
//                 ) : step === 1 ? (
//                   <>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         Username
//                       </label>
//                       <input
//                         type="text"
//                         value={forgotUsername}
//                         onChange={(e) => setForgotUsername(e.target.value)}
//                         className="input-field text-sm py-2"
//                         placeholder="Enter your username"
//                       />
//                     </div>
//                     <button
//                       onClick={() => handleSendCode(forgotUsername)}
//                       disabled={isLoading}
//                       className="btn-primary text-sm py-2"
//                     >
//                       {isLoading ? 'Sending...' : 'Send Code'}
//                     </button>
//                     <button
//                       onClick={handleBackToLogin}
//                       className="btn-secondary text-sm py-2"
//                     >
//                       Back to Login
//                     </button>
//                   </>
//                 ) : step === 2 ? (
//                   <>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         Verification Code
//                       </label>
//                       <input
//                         type="text"
//                         value={verificationCode}
//                         onChange={(e) => setVerificationCode(e.target.value)}
//                         className="input-field text-sm py-2"
//                         placeholder="Enter code"
//                       />
//                     </div>
//                     <button
//                       onClick={() => handleVerifyCode(verificationCode)}
//                       disabled={isLoading}
//                       className="btn-primary text-sm py-2"
//                     >
//                       {isLoading ? 'Verifying...' : 'Verify'}
//                     </button>
//                     <button
//                       onClick={() => handleResendCode(forgotUsername)}
//                       className="text-xs text-purple-600"
//                     >
//                       Resend Code
//                     </button>
//                     <button
//                       onClick={handleBackToLogin}
//                       className="btn-secondary text-sm py-2"
//                     >
//                       Back to Login
//                     </button>
//                   </>
//                 ) : step === 3 ? (
//                   <>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         New Password
//                       </label>
//                       <div className="relative">
//                         <input
//                           type={showResetPassword ? 'text' : 'password'}
//                           value={newPassword}
//                           onChange={(e) => setNewPassword(e.target.value)}
//                           onFocus={() => setIsResetFocused(true)}
//                           onBlur={() => setIsResetFocused(false)}
//                           className="input-field pr-10 text-sm py-2"
//                           placeholder="New password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowResetPassword(!showResetPassword)}
//                           className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-purple-600"
//                         >
//                           {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                         </button>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">
//                         Confirm Password
//                       </label>
//                       <div className="relative">
//                         <input
//                           type={showResetPassword ? 'text' : 'password'}
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}
//                           onFocus={() => setIsResetFocused(true)}
//                           onBlur={() => setIsResetFocused(false)}
//                           className="input-field pr-10 text-sm py-2"
//                           placeholder="Confirm password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowResetPassword(!showResetPassword)}
//                           className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-purple-600"
//                         >
//                           {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                         </button>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleResetPassword(newPassword, confirmPassword)}
//                       disabled={isLoading}
//                       className="btn-primary text-sm py-2"
//                     >
//                       {isLoading ? 'Resetting...' : 'Reset Password'}
//                     </button>
//                     <button
//                       onClick={handleBackToLogin}
//                       className="btn-secondary text-sm py-2"
//                     >
//                       Back to Login
//                     </button>
//                   </>
//                 ) : null}
//               </div>
//             </div>
//           </div>
//           <div className="overlay-container">
//             <div className="overlay">
//               <div className="overlay-panel overlay-left">
//                 <h1 className="text-2xl font-bold text-white">Welcome to InterXAI!</h1>
//                 <p className="text-white/80 mt-2 mb-4 text-sm">Already have an account?</p>
//                 <button className="ghost text-sm py-2 px-6" onClick={toggle}>Log In</button>
//               </div>
//               <div className="overlay-panel overlay-right">
//                 <h1 className="text-2xl font-bold text-white">Hello, Welcome Back!</h1>
//                 <p className="text-white/80 mt-2 mb-4 text-sm">Don’t have an account?</p>
//                 <button className="ghost text-sm py-2 px-6" onClick={toggle}>Sign Up</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <MessageNotification
//         message={message}
//         messageType={messageType}
//         onClose={clearLoginMessage}
//       />
//       <style jsx>{`
//         .container {
//           position: relative;
//           overflow: hidden;
//           max-width: 900px;
//           height: 600px;
//           background: rgba(255, 255, 255, 0.8);
//           box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
//           border-radius: 20px;
//           backdrop-filter: blur(10px);
//         }
//         .container.active .sign-in-container {
//           transform: translateX(100%);
//         }
//         .container.active .sign-up-container {
//           transform: translateX(100%);
//           opacity: 1;
//           z-index: 5;
//           animation: show 0.6s;
//         }
//         @keyframes show {
//           0%, 49.99% {
//             opacity: 0;
//             z-index: 1;
//           }
//           50%, 100% {
//             opacity: 1;
//             z-index: 5;
//           }
//         }
//         .container.active .overlay-container {
//           transform: translateX(-100%);
//         }
//         .container.active .overlay {
//           transform: translateX(50%);
//         }
//         .container.active .overlay-left {
//           transform: translateX(0);
//         }
//         .container.active .overlay-right {
//           transform: translateX(20%);
//         }
//         .overlay-container {
//           position: absolute;
//           top: 0;
//           left: 50%;
//           width: 50%;
//           height: 100%;
//           overflow: hidden;
//           transition: transform 0.6s ease-in-out;
//           z-index: 100;
//           border-top-left-radius: 150px;
//           border-bottom-left-radius: 150px;
//         }
//         .container.active .overlay-container {
//           border-top-left-radius: 0;
//           border-bottom-left-radius: 0;
//           border-top-right-radius: 150px;
//           border-bottom-right-radius: 150px;
//         }
//         .overlay {
//           background: linear-gradient(to right, #8B5CF6, #3B82F6);
//           color: #fff;
//           position: relative;
//           left: -100%;
//           height: 100%;
//           width: 200%;
//           transition: transform 0.6s ease-in-out;
//         }
//         .overlay-panel {
//           position: absolute;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-direction: column;
//           padding: 0 40px;
//           text-align: center;
//           top: 0;
//           height: 100%;
//           width: 50%;
//           transition: transform 0.6s ease-in-out;
//         }
//         .overlay-left {
//           transform: translateX(-20%);
//         }
//         .overlay-right {
//           right: 0;
//           transform: translateX(0);
//         }
//         .form-container {
//           position: absolute;
//           top: 0;
//           height: 100%;
//           width: 50%;
//           transition: all 0.6s ease-in-out;
//         }
//         .sign-in-container {
//           left: 0;
//           z-index: 2;
//         }
//         .sign-up-container {
//           left: 0;
//           opacity: 0;
//           z-index: 1;
//         }
//         .glassmorphic {
//           background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1));
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
//         }
//         .input-field {
//           background: rgba(255, 255, 255, 0.9);
//           border: 2px solid transparent;
//           background-clip: padding-box;
//           color: #374151;
//           padding: 0.75rem 1rem;
//           border-radius: 0.75rem;
//           width: 100%;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           font-size: 0.9rem;
//         }
//         .input-field:focus {
//           background: rgba(255, 255, 255, 0.95);
//           border: 2px transparent;
//           background-image: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), linear-gradient(135deg, #8B5CF6, #3B82F6);
//           background-origin: border-box;
//           background-clip: content-box, border-box;
//           box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
//           transform: translateY(-1px);
//         }
//         .btn-primary {
//           background: linear-gradient(135deg, #8B5CF6, #3B82F6);
//           color: white;
//           font-weight: 600;
//           padding: 0.75rem 1.25rem;
//           border-radius: 0.75rem;
//           border: none;
//           cursor: pointer;
//           width: 100%;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           font-size: 0.95rem;
//           position: relative;
//           overflow: hidden;
//         }
//         .btn-primary:hover:not(:disabled) {
//           box-shadow: 0 20px 40px rgba(139, 92, 246, 0.4);
//           transform: translateY(-2px);
//         }
//         .btn-secondary {
//           background: linear-gradient(135deg, #6B7280, #4B5563);
//           color: white;
//           font-weight: 600;
//           padding: 0.75rem 1.25rem;
//           border-radius: 0.75rem;
//           border: none;
//           cursor: pointer;
//           width: 100%;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           font-size: 0.95rem;
//           position: relative;
//           overflow: hidden;
//         }
//         .btn-secondary:hover:not(:disabled) {
//           box-shadow: 0 20px 40px rgba(107, 114, 128, 0.4);
//           transform: translateY(-2px);
//         }
//         .ghost {
//           background: transparent;
//           border: 1px solid #fff;
//           border-radius: 20px;
//           color: #fff;
//           font-size: 12px;
//           font-weight: bold;
//           padding: 12px 45px;
//           letter-spacing: 1px;
//           text-transform: uppercase;
//           transition: transform 80ms ease-in;
//         }
//         .ghost:active {
//           transform: scale(0.95);
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes scaleIn {
//           from { opacity: 0; transform: scale(0.9); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         @keyframes borderGlow {
//           0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
//           50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.4); }
//         }
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.6s ease-out forwards;
//         }
//         .animate-scale-in {
//           animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
//         }
//         .triangle-shape {
//           clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;
// Login.jsx
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft, User, Mail, Lock, Check, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { handleToken } from '../utils/handleToken';
import MessageNotification from '../components/ui/MessageNotification';

const baseUrl = import.meta.env.VITE_API_URL;

const OwlMascot = ({ showPassword, isPasswordFocused }) => (
  <div className="mb-8">
    <svg
      width="96"
      height="96"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      <circle cx="100" cy="100" r="75" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="3" />
      <circle cx="100" cy="100" r="70" fill="url(#owlGradient)" />
      <defs>
        <linearGradient id="owlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="specsFog" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
        </linearGradient>
      </defs>
      <polygon points="45,45 65,25 75,55" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
      <polygon points="155,45 135,25 125,55" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
      <circle cx="75" cy="90" r="25" stroke="#374151" strokeWidth="3" fill="rgba(255,255,255,0.1)" />
      <circle cx="125" cy="90" r="25" stroke="#374151" strokeWidth="3" fill="rgba(255,255,255,0.1)" />
      <line x1="100" y1="90" x2="100" y2="90" stroke="#374151" strokeWidth="3" />
      {!showPassword && isPasswordFocused && (
        <>
          <circle cx="75" cy="90" r="23" fill="url(#specsFog)" opacity="0.8" />
          <circle cx="125" cy="90" r="23" fill="url(#specsFog)" opacity="0.8" />
        </>
      )}
      {showPassword ? (
        <>
          <circle cx="75" cy="90" r="8" fill="#1F2937" />
          <circle cx="125" cy="90" r="8" fill="#1F2937" />
          <circle cx="77" cy="87" r="2" fill="white" />
          <circle cx="127" cy="87" r="2" fill="white" />
        </>
      ) : isPasswordFocused ? (
        <>
          <path d="M 67 90 Q 75 85 83 90" stroke="#1F2937" strokeWidth="2" fill="none" />
          <path d="M 117 90 Q 125 85 133 90" stroke="#1F2937" strokeWidth="2" fill="none" />
        </>
      ) : (
        <>
          <path d="M 67 90 Q 75 87 83 90" stroke="#1F2937" strokeWidth="3" fill="none" />
          <path d="M 117 90 Q 125 87 133 90" stroke="#1F2937" strokeWidth="3" fill="none" />
        </>
      )}
      <polygon points="95,110 105,110 100,125" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      <circle cx="55" cy="110" r="8" fill="rgba(219, 39, 119, 0.3)" />
      <circle cx="145" cy="110" r="8" fill="rgba(219, 39, 119, 0.3)" />
    </svg>
  </div>
);

const ParticleField = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
    
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + 100) % 100,
        y: (particle.y + particle.speedY + 100) % 100,
      })));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-purple-300 to-blue-300 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
};

const FloatingShape = ({ delay = 0, shape = 'circle', size = 'w-8 h-8', position = 'top-1/4 left-1/4' }) => {
  const shapeStyles = {
    circle: 'rounded-full',
    triangle: 'triangle-shape',
    square: 'rotate-45',
    diamond: 'rotate-45 rounded-sm',
  };

  return (
    <div
      className={`absolute ${position} ${size} ${shapeStyles[shape]} bg-gradient-to-r from-purple-200/20 to-blue-200/20 backdrop-blur-sm border border-white/10`}
      style={{
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: 'drop-shadow(0 0 10px rgba(216, 180, 254, 0.3))',
      }}
    />
  );
};

const GradientText = ({ children, className = '' }) => (
  <span className={`bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent ${className}`}>
    {children}
  </span>
);

const AnimatedInput = ({ 
  icon: Icon, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  focused, 
  error, 
  showToggle = false, 
  showPassword = false, 
  onTogglePassword 
}) => {
  return (
    <div className="relative group mb-4">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 transition-all duration-300 group-hover:text-purple-500">
          <Icon 
            className={`w-5 h-5 transition-all duration-300 ${focused ? 'text-purple-500 scale-110' : ''}`}
            style={{
              filter: focused ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))' : 'none',
            }}
          />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-10 ${showToggle ? 'pr-10' : 'pr-3'} py-3 bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 transition-all duration-300 hover:border-slate-300 focus:outline-none focus:ring-0 ${
            focused ? 'border-purple-400 shadow-lg shadow-purple-500/25 bg-white' : ''
          } ${error ? 'border-red-400 shadow-lg shadow-red-500/25' : ''}`}
          style={{
            backdropFilter: 'blur(10px)',
          }}
        />
        
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-purple-500 transition-all duration-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {focused && (
          <div 
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"
            style={{
              width: '100%',
              animation: 'borderGlow 2s ease-in-out infinite',
            }}
          />
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center space-x-1 animate-bounce">
          <span className="text-xs">⚠</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isResetFocused, setIsResetFocused] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [step, setStep] = useState(1);
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [signupVerificationCode, setSignupVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const showLoginMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
  };

  const clearLoginMessage = () => {
    setMessage('');
    setMessageType('');
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async () => {
    if (validateLoginForm()) await handleLogin(username, password);
  };

  const handleLogin = async (user, pass) => {
    setIsLoading(true);
    try {
      const success = await handleToken(user, pass, navigate);
      if (success) {
        showLoginMessage('Login successful!', 'success');
      } else {
        showLoginMessage('Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      showLoginMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotMode(true);
    setStep(1);
    setForgotUsername('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetToken('');
    clearLoginMessage();
  };

  const handleSendCode = async (user) => {
    if (!user) {
      showLoginMessage('Username is required', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user }),
      });
      if (res.ok) {
        setStep(2);
        showLoginMessage('Verification code sent to your email.', 'success');
      } else {
        showLoginMessage('Failed to send verification code', 'error');
      }
    } catch (error) {
      showLoginMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    if (!code) {
      showLoginMessage('Verification code is required', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/verify-reset-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verification_code: code }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetToken(data.reset_token || 'dummy-token');
        setStep(3);
        showLoginMessage('Code verified successfully!', 'success');
      } else {
        showLoginMessage(data.detail || 'Code verification failed', 'error');
      }
    } catch (error) {
      showLoginMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (newPass, confirmPass) => {
    if (newPass !== confirmPass) {
      showLoginMessage('Passwords do not match', 'error');
      return;
    }
    if (!newPass) {
      showLoginMessage('Password is required', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reset_token: resetToken,
          password1: newPass,
          password2: confirmPass,
        }),
      });
      if (res.ok) {
        showLoginMessage('Password reset successful!', 'success');
        setTimeout(() => {
          setForgotMode(false);
          setStep(1);
        }, 2000);
      } else {
        const data = await res.json();
        showLoginMessage(data.detail || 'Reset failed', 'error');
      }
    } catch (error) {
      showLoginMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (user) => {
    if (!user) {
      showLoginMessage('Username is required for resend', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/resend-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user }),
      });
      if (res.ok) {
        showLoginMessage('Verification code resent!', 'success');
      } else {
        showLoginMessage('Failed to resend code', 'error');
      }
    } catch (error) {
      showLoginMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setForgotMode(false);
    setStep(1);
    clearLoginMessage();
  };

  const handleSignUp = async () => {
    if (signupPassword !== signupConfirmPassword) {
      showLoginMessage('Passwords do not match', 'error');
      return;
    }

    if (!signupUsername || !signupEmail || !signupPassword) {
      showLoginMessage('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
          password_confirm: signupConfirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationId(data.verification_id);
        setVerificationMode(true);
        showLoginMessage('Verification code sent to your email!', 'success');
      } else {
        showLoginMessage(data.error || JSON.stringify(data.errors) || 'Registration failed', 'error');
      }
    } catch (error) {
      showLoginMessage('Server error during signup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!signupVerificationCode) {
      showLoginMessage('Please enter verification code', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verification_code: signupVerificationCode,
          verification_id: verificationId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showLoginMessage('Account created successfully! Redirecting...', 'success');
        
        localStorage.setItem("authToken", data.token);
        sessionStorage.setItem("email", signupEmail);
        sessionStorage.setItem("password", signupPassword);
        
        setTimeout(() => {
          navigate('/profile-setup');
        }, 1500);

        setVerificationMode(false);
        setSignupUsername('');
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        setSignupVerificationCode('');
        setVerificationId('');
      } else {
        showLoginMessage(data.error || 'Verification failed', 'error');
      }
    } catch (error) {
      showLoginMessage('Server error during verification', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupResendCode = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}/resend-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupEmail,
          type: 'registration',
        }),
      });

      if (response.ok) {
        showLoginMessage('Verification code resent!', 'success');
      } else {
        showLoginMessage('Failed to resend code', 'error');
      }
    } catch (error) {
      showLoginMessage('Server error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = () => {
    setIsActive(!isActive);
    setTimeout(() => {
      navigate(isActive ? '/login' : '/signup');
    }, 600);
  };

  let headerText = 'Welcome Back';
  let subText = 'Our owl friend is keeping watch over your login';
  if (forgotMode) {
    if (step === 1) {
      headerText = 'Forgot Password';
      subText = 'Enter your username to receive a verification code';
    } else if (step === 2) {
      headerText = 'Verify Code';
      subText = 'Enter the code sent to your email';
    } else if (step === 3) {
      headerText = 'Reset Password';
      subText = 'Enter your new password';
    }
  }

  const isMascotPasswordVisible = forgotMode && step === 3 ? showResetPassword : showPassword;
  const isMascotPasswordFocused = forgotMode && step === 3 ? isResetFocused : isPasswordFocused;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <ParticleField />
      <FloatingShape delay={0} shape="circle" size="w-16 h-16" position="top-10 left-10" />
      <FloatingShape delay={1} shape="triangle" size="w-12 h-12" position="top-1/4 right-20" />
      <FloatingShape delay={2} shape="square" size="w-8 h-8" position="top-1/2 left-16" />
      <FloatingShape delay={3} shape="diamond" size="w-10 h-10" position="top-3/4 right-16" />
      <FloatingShape delay={4} shape="circle" size="w-6 h-6" position="top-1/3 left-1/3" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(216,180,254,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(216,180,254,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-60 h-60 rounded-full bg-gradient-to-br from-purple-200/30 to-blue-200/30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 group"
          title="Go back to homepage"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
        </button>
      </div>
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className={`container ${isActive ? 'active' : ''}`}>
          <div className="form-container sign-up-container">
            <div className="form-content">
              <div className="glassmorphic rounded-3xl p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Join InterXAI
                  </h2>
                  <p className="text-gray-600">
                    Start your journey
                  </p>
                </div>
                <div className="space-y-4">
                  {verificationMode ? (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-3">
                        <GradientText>Verify Your Email</GradientText>
                      </h2>
                      <p className="text-slate-600 mb-6">
                        Code sent to <strong>{signupEmail}</strong>
                      </p>
                      <AnimatedInput
                        icon={Shield}
                        type="text"
                        placeholder="Enter verification code"
                        value={signupVerificationCode}
                        onChange={(e) => setSignupVerificationCode(e.target.value)}
                        onFocus={() => setFocusedField('verification')}
                        onBlur={() => setFocusedField(null)}
                        focused={focusedField === 'verification'}
                      />
                      <button
                        onClick={handleVerifyEmail}
                        disabled={isLoading}
                        className="btn-primary w-full mb-3"
                      >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                      </button>
                      <button
                        onClick={handleSignupResendCode}
                        disabled={isLoading}
                        className="text-purple-600 hover:text-blue-600 transition-colors text-sm mb-2 block w-full"
                      >
                        Resend Code
                      </button>
                      <button
                        onClick={() => setVerificationMode(false)}
                        className="text-slate-500 hover:text-slate-700 transition-colors text-sm block w-full"
                      >
                        Back
                      </button>
                    </div>
                  ) : (
                    <>
                      <AnimatedInput
                        icon={User}
                        placeholder="Username"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        onFocus={() => setFocusedField('signup-username')}
                        onBlur={() => setFocusedField(null)}
                        focused={focusedField === 'signup-username'}
                      />
                      <AnimatedInput
                        icon={Mail}
                        type="email"
                        placeholder="Email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        onFocus={() => setFocusedField('signup-email')}
                        onBlur={() => setFocusedField(null)}
                        focused={focusedField === 'signup-email'}
                      />
                      <AnimatedInput
                        icon={Lock}
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="Password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        onFocus={() => setFocusedField('signup-password')}
                        onBlur={() => setFocusedField(null)}
                        focused={focusedField === 'signup-password'}
                        showToggle
                        showPassword={showSignupPassword}
                        onTogglePassword={() => setShowSignupPassword(!showSignupPassword)}
                      />
                      <AnimatedInput
                        icon={Lock}
                        type={showSignupConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('signup-confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        focused={focusedField === 'signup-confirmPassword'}
                        showToggle
                        showPassword={showSignupConfirmPassword}
                        onTogglePassword={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      />
                      <button
                        onClick={handleSignUp}
                        disabled={isLoading}
                        className="btn-primary w-full"
                      >
                        {isLoading ? 'Creating...' : 'Create Account'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="form-container sign-in-container">
            <div className="form-content">
              <div className="glassmorphic rounded-3xl p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <OwlMascot showPassword={isMascotPasswordVisible} isPasswordFocused={isMascotPasswordFocused} />
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {headerText}
                  </h2>
                  <p className="text-gray-600">
                    {subText}
                  </p>
                </div>
                <div className="space-y-4">
                  {!forgotMode ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="input-field"
                          placeholder="Enter your username"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            className="input-field pr-10"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password
                        }</p>}
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleForgotPassword}
                          className="text-sm text-purple-600 hover:text-blue-600 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <button
                        onClick={handleLoginSubmit}
                        disabled={isLoading}
                        className="btn-primary w-full"
                      >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                      </button>
                    </>
                  ) : step === 1 ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={forgotUsername}
                          onChange={(e) => setForgotUsername(e.target.value)}
                          className="input-field"
                          placeholder="Enter your username"
                        />
                      </div>
                      <button
                        onClick={() => handleSendCode(forgotUsername)}
                        disabled={isLoading}
                        className="btn-primary w-full"
                      >
                        {isLoading ? 'Sending...' : 'Send Code'}
                      </button>
                      <button
                        onClick={handleBackToLogin}
                        className="btn-secondary w-full"
                      >
                        Back to Login
                      </button>
                    </>
                  ) : step === 2 ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="input-field"
                          placeholder="Enter code"
                        />
                      </div>
                      <button
                        onClick={() => handleVerifyCode(verificationCode)}
                        disabled={isLoading}
                        className="btn-primary w-full"
                      >
                        {isLoading ? 'Verifying...' : 'Verify'}
                      </button>
                      <button
                        onClick={() => handleResendCode(forgotUsername)}
                        className="text-sm text-purple-600 hover:text-blue-600 transition-colors block w-full text-center"
                      >
                        Resend Code
                      </button>
                      <button
                        onClick={handleBackToLogin}
                        className="btn-secondary w-full"
                      >
                        Back to Login
                      </button>
                    </>
                  ) : step === 3 ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showResetPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onFocus={() => setIsResetFocused(true)}
                            onBlur={() => setIsResetFocused(false)}
                            className="input-field pr-10"
                            placeholder="New password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowResetPassword(!showResetPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                          >
                            {showResetPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showResetPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setIsResetFocused(true)}
                            onBlur={() => setIsResetFocused(false)}
                            className="input-field pr-10"
                            placeholder="Confirm password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowResetPassword(!showResetPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                          >
                            {showResetPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleResetPassword(newPassword, confirmPassword)}
                        disabled={isLoading}
                        className="btn-primary w-full"
                      >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                      </button>
                      <button
                        onClick={handleBackToLogin}
                        className="btn-secondary w-full"
                      >
                        Back to Login
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1 className="text-3xl font-bold text-white mb-4">Welcome to InterXAI!</h1>
                <p className="text-white/90 mb-6">Already have an account?</p>
                <button className="ghost" onClick={toggle}>Log In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1 className="text-3xl font-bold text-white mb-4">Hello, Welcome Back!</h1>
                <p className="text-white/90 mb-6">Don't have an account?</p>
                <button className="ghost" onClick={toggle}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MessageNotification
        message={message}
        messageType={messageType}
        onClose={clearLoginMessage}
      />
      <style jsx>{`
        .container {
          position: relative;
          overflow: hidden;
          width: 900px;
          max-width: 100%;
          min-height: 600px;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .container.active .sign-in-container {
          transform: translateX(100%);
        }
        .container.active .sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: show 0.6s;
        }
        @keyframes show {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }
        .container.active .overlay-container {
          transform: translateX(-100%);
        }
        .container.active .overlay {
          transform: translateX(50%);
        }
        .container.active .overlay-left {
          transform: translateX(0);
        }
        .container.active .overlay-right {
          transform: translateX(20%);
        }
        .overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.6s ease-in-out;
          z-index: 100;
          border-top-left-radius: 150px;
          border-bottom-left-radius: 150px;
        }
        .container.active .overlay-container {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-top-right-radius: 150px;
          border-bottom-right-radius: 150px;
        }
        .overlay {
          background: linear-gradient(to right, #8B5CF6, #3B82F6);
          color: #fff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transition: transform 0.6s ease-in-out;
        }
        .overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
          transition: transform 0.6s ease-in-out;
        }
        .overlay-left {
          transform: translateX(-20%);
        }
        .overlay-right {
          right: 0;
          transform: translateX(0);
        }
        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          transition: all 0.6s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .form-content {
          width: 100%;
          max-width: 400px;
          padding: 0 30px;
        }
        .sign-in-container {
          left: 0;
          z-index: 2;
        }
        .sign-up-container {
          left: 0;
          opacity: 0;
          z-index: 1;
        }
        .glassmorphic {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
        }
        .input-field {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid transparent;
          background-clip: padding-box;
          color: #374151;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          width: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
        }
        .input-field:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.95);
          border: 2px transparent;
          background-image: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), linear-gradient(135deg, #8B5CF6, #3B82F6);
          background-origin: border-box;
          background-clip: content-box, border-box;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
          transform: translateY(-1px);
        }
        .btn-primary {
          background: linear-gradient(135deg, #8B5CF6, #3B82F6);
          color: white;
          font-weight: 600;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
          position: relative;
          overflow: hidden;
        }
        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.4);
          transform: translateY(-2px);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-secondary {
          background: linear-gradient(135deg, #6B7280, #4B5563);
          color: white;
          font-weight: 600;
          padding: 0.875rem 1.5rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
          position: relative;
          overflow: hidden;
        }
        .btn-secondary:hover:not(:disabled) {
          box-shadow: 0 20px 40px rgba(107, 114, 128, 0.4);
          transform: translateY(-2px);
        }
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .ghost {
          background: transparent;
          border: 2px solid #fff;
          border-radius: 25px;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
          padding: 14px 50px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .ghost:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }
        .ghost:active {
          transform: scale(0.95);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.4); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        .triangle-shape {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
};

export default Login;