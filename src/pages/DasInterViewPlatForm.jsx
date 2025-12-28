import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Play, Send, CheckCircle, XCircle, Code, AlertCircle, Loader } from 'lucide-react';
import { getAuthToken, fetchWithToken } from '../utils/handleToken';
import { useParams, useNavigate } from 'react-router-dom';
const base_url=import.meta.env.VITE_API_URL;
const TIME_LIMIT = 30 * 60; // 30 minutes in seconds
const LANGUAGES = ['Python', 'C++', 'Java'];
const CODE_TEMPLATES = {
  Python: `# Write your solution here
def solution():
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,
  'C++': `#include <iostream>
#include <vector>
using namespace std;

// Write your solution here
int solution() {
    // Your code here
    return 0;
}

int main() {
    int result = solution();
    cout << result << endl;
    return 0;
}`,
  Java: `public class Solution {
    // Write your solution here
    public static int solution() {
        // Your code here
        return 0;
    }
    
    public static void main(String[] args) {
        int result = solution();
        System.out.println(result);
    }
}`
};

const DSAInterviewPlatform = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { sessionId } = params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [dsaTopics, setDsaTopics] = useState([]);
  const [code, setCode] = useState(CODE_TEMPLATES.Python);
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [runResult, setRunResult] = useState(null);
  const [runsLeft, setRunsLeft] = useState({});
  const [error, setError] = useState(null);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinalSubmit();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Validate code before API call
  const validateCode = (userCode) => {
    if (!userCode || !userCode.trim()) {
      return { isValid: false, message: 'Code cannot be empty' };
    }
    
    // Remove comments and whitespace to check for actual code
    const cleanCode = userCode
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
      .replace(/\/\/.*$/gm, '') // Remove // comments
      .replace(/#.*$/gm, '') // Remove # comments (Python)
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Check if there's meaningful code beyond templates
    const templateKeywords = ['Your code here', 'Write your solution here', 'pass', 'return 0;', 'TODO'];
    const hasOnlyTemplate = templateKeywords.some(keyword => 
      cleanCode.includes(keyword) && cleanCode.replace(keyword, '').trim().length < 10
    );
    
    if (hasOnlyTemplate) {
      return { isValid: false, message: 'Please write actual code, not just template' };
    }
    
    // Basic syntax checks
    if (selectedLanguage === 'Python' && !cleanCode.includes('def ')) {
      return { isValid: false, message: 'Python code should contain function definitions' };
    }
    
    if ((selectedLanguage === 'C++' || selectedLanguage === 'Java') && 
        (!cleanCode.includes('{') || !cleanCode.includes('}'))) {
      return { isValid: false, message: `${selectedLanguage} code should contain proper braces` };
    }
    
    return { isValid: true, message: '' };
  };

  // Fetch DSA topics from backend
  const fetchDSATopics = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required');
      return [];
    }
    const base_url= import.meta.env.VITE_API_URL;
    try {
      const data = await fetchWithToken(
        `${base_url}/interview/get-dsa-questions/${sessionId}/`,
        token,
        navigate,
      );
      console.log(data);
      if (data.length === 0) {
        console.log('Fetched DSA topics:', data);
        navigate('/');
        return data;
      }
      return data;
    } catch (error) {
      navigate('/');
      console.error('Error fetching DSA topics:', error);
      setError('Failed to fetch DSA topics');
      return [];
    }
  };

  const callGroqAPI = async (prompt) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API Error:', error);
      setError('Failed to connect to API. Please check your connection.');
      return null;
    }
  };

  const generateQuestion = async (topic, difficulty) => {
    const prompt = `Generate a DSA coding problem for topic: ${topic} with difficulty: ${difficulty}. 
    Respond ONLY with a valid JSON object in this exact format, with no additional text, markdown, or explanations:
    {
      "title": "Problem Title",
      "description": "Problem description with clear constraints, examples, and what the function should do. Include input/output format.",
      "testCases": [
        {"input": "input1", "output": "expected_output1", "description": "test case 1 description"},
        {"input": "input2", "output": "expected_output2", "description": "test case 2 description"},
        {"input": "input3", "output": "expected_output3", "description": "test case 3 description"}
      ],
      "sampleInput": "sample input for testing",
      "sampleOutput": "expected sample output",
      "difficulty": "${difficulty}",
      "hints": ["hint1", "hint2"]
    }
    
    Make sure:
    1. The problem is clear and has examples
    2. Test cases cover edge cases
    3. Input/output format is specified
    4. Problem is language-agnostic
    5. Difficulty level matches: ${difficulty}`;

    const response = await callGroqAPI(prompt);
    if (response) {
      try {
        // Clean response to extract JSON
        let cleanResponse = response.trim();
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const jsonStart = cleanResponse.indexOf('{');
        const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
        if (jsonStart === -1 || jsonEnd === 0) {
          throw new Error('No valid JSON found in response');
        }
        cleanResponse = cleanResponse.slice(jsonStart, jsonEnd);
        
        const parsedQuestion = JSON.parse(cleanResponse);
        if (!parsedQuestion.title || !parsedQuestion.description || !parsedQuestion.testCases) {
          throw new Error('Invalid question format');
        }
        
        return parsedQuestion;
      } catch (e) {
        console.error('Failed to parse question JSON:', e, 'Response:', response);
        return null;
      }
    }
    return null;
  };

  const initializeQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Fetch DSA topics from backend
    const backendTopics = await fetchDSATopics();
    if (!backendTopics || backendTopics.length === 0) {
      setError('No DSA topics found for this session');
      setLoading(false);
      return;
    }

    setDsaTopics(backendTopics);
    
    // Generate questions for each topic
    const generatedQuestions = [];
    
    for (let i = 0; i < Math.min(backendTopics.length, 3); i++) {
      const dsaTopic = backendTopics[i];
      const question = await generateQuestion(dsaTopic.topic, dsaTopic.difficulty);
      if (question) {
        generatedQuestions.push({ 
          ...question, 
          topic: dsaTopic.topic,
          difficulty: dsaTopic.difficulty,
          dsaTopicId: dsaTopic.id,
          id: i 
        });
      } else {
        generatedQuestions.push({
          id: i,
          topic: dsaTopic.topic,
          difficulty: dsaTopic.difficulty,
          dsaTopicId: dsaTopic.id,
          title: `${dsaTopic.topic.charAt(0).toUpperCase() + dsaTopic.topic.slice(1)} Problem`,
          description: `Solve a ${dsaTopic.topic} related problem with ${dsaTopic.difficulty} difficulty. Implement the solution function.`,
          testCases: [
            { input: "test1", output: "result1", description: "Basic test case" },
            { input: "test2", output: "result2", description: "Edge case" },
            { input: "test3", output: "result3", description: "Complex case" }
          ],
          sampleInput: "sample",
          sampleOutput: "expected",
          hints: ["Consider the problem constraints", "Think about edge cases"]
        });
      }
    }
    
    if (generatedQuestions.length === 0) {
      setError('Failed to generate questions. Please refresh the page.');
    } else {
      setQuestions(generatedQuestions);
      setCode(CODE_TEMPLATES.Python);
      const initialRuns = {};
      generatedQuestions.forEach((_, index) => {
        initialRuns[index] = 3;
      });
      setRunsLeft(initialRuns);
    }
    
    setLoading(false);
  }, [sessionId, navigate]);

  useEffect(() => {
    if (sessionId) {
      initializeQuestions();
    } else {
      setError('Session ID is required');
    }
  }, [initializeQuestions, sessionId]);

  const submitToBackend = async (question, questionScore) => {
    const token = getAuthToken();
    if (!token) {
      console.error('No auth token found');
      return;
    }

    try {
      const submissionData = {
        question: JSON.stringify({
          title: question.title,
          description: question.description,
          topic: question.topic,
          difficulty: question.difficulty
        }),
        code: code,
        score: questionScore
      };

      const response = await fetchWithToken(
        `${base_url}/interview/add-dsa-scores/${sessionId}/${question.dsaTopicId}/`,
        token,
        navigate,
        'POST',
        submissionData
      );

      if (response) {
        console.log('Successfully submitted to backend:', response);
      } else {
        console.error('Failed to submit to backend');
      }
    } catch (error) {
      console.error('Error submitting to backend:', error);
    }
  };

  const submitQuestion = async () => {
    if (!questions[currentQuestionIndex]) return;
    
    // Validate code first
    const validation = validateCode(code);
    if (!validation.isValid) {
      setTestResult({
        questionIndex: currentQuestionIndex,
        questionId: questions[currentQuestionIndex].id,
        dsaTopicId: questions[currentQuestionIndex].dsaTopicId,
        code,
        testResults: [],
        passedTests: 0,
        totalTests: questions[currentQuestionIndex].testCases.length,
        score: 0,
        allPassed: false,
        title: questions[currentQuestionIndex].title,
        topic: questions[currentQuestionIndex].topic,
        error: validation.message
      });
      return;
    }
    
    setIsTestRunning(true);
    setTestResult(null);
    const question = questions[currentQuestionIndex];
    
    let passedTests = 0;
    const testResults = [];
    
    // Enhanced validation prompt
    for (let i = 0; i < question.testCases.length; i++) {
      const testCase = question.testCases[i];
      
      const prompt = `You are a strict code validator. Your ONLY job is to:
1. Execute the ${selectedLanguage} code with the given input
2. Compare the actual output with the expected output
3. Respond with EXACTLY one word: "PASS" or "FAIL"

CRITICAL RULES:
- If the code is empty, incomplete, or contains only comments/templates: respond "FAIL"
- If the code throws any error or exception: respond "FAIL"  
- If the actual output doesn't exactly match expected output: respond "FAIL"
- Only respond "PASS" if code executes successfully AND output matches exactly
- NO explanations, NO additional text, NO reasoning - just "PASS" or "FAIL"

Code to test:
${code}

Input: ${testCase.input}
Expected Output: ${testCase.output}

Validate and respond with one word:`;
      
      const result = await callGroqAPI(prompt);
      console.log(`Test case ${i + 1} response:`, result);
      
      if (result) {
        const cleanResult = result.trim().toUpperCase();
        const passed = cleanResult === 'PASS' || (cleanResult.includes('PASS') && !cleanResult.includes('FAIL'));
        
        console.log(`Test case ${i + 1}: Raw="${result}" Clean="${cleanResult}" Passed=${passed}`);
        
        if (passed) passedTests++;
        testResults.push({
          passed,
          message: result.trim(),
          testCase: testCase.description,
          rawResponse: result
        });
      } else {
        testResults.push({
          passed: false,
          message: 'Test execution failed - no response from API',
          testCase: testCase.description,
          rawResponse: null
        });
      }
    }
    
    const allPassed = passedTests === question.testCases.length;
    const questionScore = allPassed ? 10 : Math.floor((passedTests / question.testCases.length) * 10);
    
    // Submit to backend
    await submitToBackend(question, questionScore);
    
    const newSubmission = {
      questionIndex: currentQuestionIndex,
      questionId: question.id,
      dsaTopicId: question.dsaTopicId,
      code,
      testResults,
      passedTests,
      totalTests: question.testCases.length,
      score: questionScore,
      allPassed,
      title: question.title,
      topic: question.topic
    };
    
    const updatedSubmissions = submittedQuestions.filter(sub => sub.questionIndex !== currentQuestionIndex);
    updatedSubmissions.push(newSubmission);
    setSubmittedQuestions(updatedSubmissions);
    
    const totalScore = updatedSubmissions.reduce((acc, sub) => acc + sub.score, 0);
    setScore(totalScore);
    
    setTestResult(newSubmission);
    setIsTestRunning(false);
  };

  const runSingleTest = async () => {
    if (!questions[currentQuestionIndex]) return;
    
    const remainingRuns = runsLeft[currentQuestionIndex] || 0;
    if (remainingRuns <= 0) {
      setRunResult({
        isOutput: false,
        message: 'No runs left for this question'
      });
      return;
    }
    
    // Validate code first
    const validation = validateCode(code);
    if (!validation.isValid) {
      setRunResult({
        isOutput: false,
        message: validation.message
      });
      return;
    }
    
    setIsTestRunning(true);
    setRunResult(null);
    const question = questions[currentQuestionIndex];
    
    const prompt = `Execute this ${selectedLanguage} code and return ONLY the raw output.

IMPORTANT RULES:
- Execute the code with the provided input
- Return ONLY what the program outputs to console/stdout
- NO explanations, NO formatting, NO additional text
- If there's an error, return the error message
- Trim whitespace but preserve the actual output format

Code:
${code}

Input: ${question.sampleInput}

Execute and return only the output:`;

    const result = await callGroqAPI(prompt);
    
    setRunsLeft(prev => ({
      ...prev,
      [currentQuestionIndex]: remainingRuns - 1
    }));
    
    if (result) {
      let cleanOutput = result.trim();
      cleanOutput = cleanOutput.replace(/^(Output:|Result:|Response:)/i, '').trim();
      cleanOutput = cleanOutput.replace(/```[\s\S]*?```/g, '').trim();
      
      const normalizedResult = cleanOutput.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const normalizedExpected = question.sampleOutput.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      
      setRunResult({
        isOutput: true,
        message: normalizedResult,
        expected: normalizedExpected,
        matches: normalizedResult === normalizedExpected
      });
    } else {
      setRunResult({
        isOutput: false,
        message: 'Failed to execute code'
      });
    }
    setIsTestRunning(false);
  };

  const handleQuestionSelect = (index) => {
    if (index === currentQuestionIndex) return;
    
    setCurrentQuestionIndex(index);
    const submitted = submittedQuestions.find(sub => sub.questionIndex === index);
    
    if (submitted) {
      setCode(submitted.code);
      setTestResult(submitted);
    } else {
      setCode(CODE_TEMPLATES[selectedLanguage]);
      setTestResult(null);
    }
    setRunResult(null);
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    
    const isSubmitted = submittedQuestions.some(sub => sub.questionIndex === currentQuestionIndex);
    if (!isSubmitted) {
      setCode(CODE_TEMPLATES[newLanguage]);
    }
    
    setTestResult(null);
    setRunResult(null);
  };

  const handleFinalSubmit = () => {
    const finalResults = {
      sessionId,
      totalScore: score,
      maxScore: questions.length * 10,
      questionsAttempted: submittedQuestions.length,
      questionsTotal: questions.length,
      timeUsed: TIME_LIMIT - timeLeft,
      timeLimit: TIME_LIMIT,
      submissions: submittedQuestions.map(sub => ({
        dsaTopicId: sub.dsaTopicId,
        questionId: sub.questionId,
        topic: sub.topic,
        title: sub.title,
        code: sub.code,
        score: sub.score,
        passed: sub.allPassed,
        testsPassed: sub.passedTests,
        totalTests: sub.totalTests
      })),
      timestamp: new Date().toISOString()
    };
    
    console.log('Final Interview Results:', finalResults);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-lavender-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-purple-800">Loading interview session...</p>
          <p className="text-sm text-purple-600 mt-2">Fetching DSA topics and generating questions</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-lavender-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md border border-purple-200">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              initializeQuestions();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-lavender-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-purple-800">No questions available for this session.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isSubmitted = submittedQuestions.some(sub => sub.questionIndex === currentQuestionIndex);
  const codeValidation = validateCode(code);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-lavender-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-lavender-600 bg-clip-text text-transparent">
                DSA Interview Platform
              </h1>
              <p className="text-sm text-purple-600">Session ID: {sessionId}</p>
            </div>
            <div className="flex items-center space-x-6 mt-2 sm:mt-0">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className={`text-lg font-mono font-bold ${
                  timeLeft < 300 ? 'text-red-500' : timeLeft < 600 ? 'text-yellow-500' : 'text-purple-600'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-lg font-semibold">
                Score: <span className="text-purple-600">{score}/{questions.length * 10}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Question Navigation */}
        <div className="mb-6 flex flex-wrap gap-2">
          {questions.map((q, index) => {
            const submission = submittedQuestions.find(sub => sub.questionIndex === index);
            return (
              <button
                key={index}
                onClick={() => handleQuestionSelect(index)}
                className={`px-4 py-3 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  currentQuestionIndex === index
                    ? 'bg-gradient-to-r from-purple-600 to-lavender-600 text-white border-purple-600 shadow-lg'
                    : submission
                    ? submission.allPassed
                      ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-green-300 hover:from-green-200 hover:to-green-100'
                      : 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-red-300 hover:from-red-200 hover:to-red-100'
                    : 'bg-white/80 backdrop-blur-sm text-purple-700 border-purple-300 hover:bg-white'
                }`}
              >
                <div className="font-medium">Q{index + 1}</div>
                <div className="text-xs opacity-75">{q.topic}</div>
                <div className="text-xs opacity-75">{q.difficulty}</div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Question Panel */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200">
            <div className="p-6 border-b border-purple-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{currentQuestion.title}</h2>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`px-3 py-1 rounded-full text-white font-medium ${
                      currentQuestion.difficulty === 'Easy' ? 'bg-green-500' :
                      currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="text-purple-400">•</span>
                    <span className="text-purple-600 capitalize font-medium">{currentQuestion.topic}</span>
                  </div>
                </div>
                {isSubmitted && (
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                    testResult.allPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {testResult.allPassed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      {testResult.allPassed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-purple-800 mb-3">Problem Description</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-purple-50/50 p-4 rounded-xl">
                  {currentQuestion.description}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-purple-800 mb-3">Sample Test Case</h3>
                <div className="bg-gradient-to-r from-purple-50 to-lavender-50 rounded-xl p-4 space-y-2 font-mono text-sm border border-purple-200">
                  <div><span className="text-purple-600 font-semibold">Input:</span> <span className="text-gray-800">{currentQuestion.sampleInput}</span></div>
                  <div><span className="text-purple-600 font-semibold">Output:</span> <span className="text-gray-800">{currentQuestion.sampleOutput}</span></div>
                </div>
              </div>

              {currentQuestion.hints && (
                <div>
                  <h3 className="font-semibold text-purple-800 mb-3">Hints</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm bg-lavender-50/50 p-4 rounded-xl">
                    {currentQuestion.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {runResult && (
                <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-sm">
                  <h4 className="font-medium text-purple-800 mb-2">
                    Your Output: ({runsLeft[currentQuestionIndex] || 0} runs left)
                  </h4>
                  {runResult.isOutput ? (
                    <div className="space-y-2">
                      <div className="bg-gray-50 p-3 rounded-lg border font-mono text-sm">
                        <div className="text-gray-600 text-xs mb-1">Actual:</div>
                        <div className="text-gray-900 whitespace-pre-wrap">{runResult.message}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border font-mono text-sm">
                        <div className="text-gray-600 text-xs mb-1">Expected:</div>
                        <div className="text-gray-900 whitespace-pre-wrap">{runResult.expected}</div>
                      </div>
                      <div className={`text-sm font-medium ${
                        runResult.matches ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {runResult.matches ? '✓ Output matches expected' : '⚠ Output differs from expected'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{runResult.message}</div>
                  )}
                </div>
              )}

              {testResult && (
                <div className={`p-4 rounded-xl border shadow-sm ${
                  testResult.allPassed 
                    ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800' 
                    : testResult.error
                    ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800'
                    : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {testResult.allPassed ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      <span className="font-medium">
                        {testResult.error ? 'Code Validation Error' : 
                         testResult.allPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
                      </span>
                    </div>
                    {!testResult.error && (
                      <span className="font-bold">
                        {testResult.passedTests}/{testResult.totalTests} tests passed
                      </span>
                    )}
                  </div>
                  <div className="text-sm">
                    {testResult.error ? (
                      <div className="font-medium">{testResult.error}</div>
                    ) : (
                      <span>Score: <span className="font-bold">{testResult.score}/10 points</span></span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200">
            <div className="p-6 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-purple-800 flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Code Editor
                </h3>
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  disabled={isSubmitted}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="p-6">
              {/* Code validation warning */}
              {!codeValidation.isValid && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-700 text-sm">{codeValidation.message}</span>
                </div>
              )}
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 bg-gradient-to-br from-gray-50 to-purple-50/30 text-gray-900 p-4 rounded-xl font-mono text-sm resize-none border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Write your solution here..."
                disabled={isSubmitted}
              />
              
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={runSingleTest}
                  disabled={isTestRunning || isSubmitted || !codeValidation.isValid || (runsLeft[currentQuestionIndex] || 0) <= 0}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  {isTestRunning ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isTestRunning ? 'Running...' : `Run (${runsLeft[currentQuestionIndex] || 0} left)`}
                </button>
                
                <button
                  onClick={submitQuestion}
                  disabled={isTestRunning || isSubmitted || !codeValidation.isValid}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  {isTestRunning ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isTestRunning ? 'Testing...' : isSubmitted ? 'Submitted' : 'Submit Solution'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Final Submit Section */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-800">Interview Progress</h3>
              <p className="text-purple-600">
                {submittedQuestions.length} of {questions.length} questions completed • 
                Score: {score}/{questions.length * 10}
              </p>
            </div>
            
            {submittedQuestions.length > 0 && (
              <button
                onClick={handleFinalSubmit}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 font-medium transition-all transform hover:scale-105 shadow-lg"
                disabled={isTestRunning}
              >
                Final Submit
              </button>
            )}
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-purple-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-lavender-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(submittedQuestions.length / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAInterviewPlatform;