import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Signup from '../pages/SignUp';
import UserDashboard from '../pages/UserDashboard';
import ProfileSetup from '../pages/ProfileSetup';
import OrgSignup from '../pages/OrgSignup'
import OrgDashboard from '../pages/OrgDashboard';
import Interview from '../pages/Interview';
import Application from '../pages/Application';
import InterviewSession from "../pages/InterviewSession";
import Leaderboard from '../pages/Leaderboard';
import DSAInterviewPlatform from '../pages/DasInterViewPlatForm';
import EnhancedProctoredRouteWrapper from "./ProtectorRouteWrapper";
import ResumeQuestionSession from "../pages/ResumeQuestionSession";
import InterviewScreenshotCapture from "../pages/Interviewscreenshotcapture"
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile/:id" element={<UserDashboard />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/register-org" element={<OrgSignup />} />
      <Route path="/org-dashboard/:id" element={<OrgDashboard />} />
      <Route path="/interview/:id" element={<Interview />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/applications/:id" element={<Application />} />
      <Route path="/leaderboard/:id" element={<Leaderboard />} />
  <Route 
  path="/interview/start/:interviewId" 
  element={
    <EnhancedProctoredRouteWrapper>
      <InterviewSession />
    </EnhancedProctoredRouteWrapper>
  } 
/>
  <Route
  path="/resume-platform/:sessionId"
  element={
    <EnhancedProctoredRouteWrapper>
      <InterviewScreenshotCapture/>
      <ResumeQuestionSession/>
    </EnhancedProctoredRouteWrapper>
  }/>
  <Route 
    path="/dsa-interview-platform/:sessionId" 
    element={
      <EnhancedProctoredRouteWrapper>
         <InterviewScreenshotCapture/>
        <DSAInterviewPlatform />
      </EnhancedProctoredRouteWrapper>
    } 
  />

    

      {/* Add more routes as needed */}
    
    </Routes>
  );
}
