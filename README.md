# InterXAI - AI-Powered Interview Automation System

![InterXAI Architecture](https://img.shields.io/badge/InterXAI-AI%20Interview%20Platform-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [User Workflows](#user-workflows)
9. [API Documentation](#api-documentation)
10. [Monitoring and Analytics](#monitoring-and-analytics)
11. [Security Features](#security-features)
12. [Contributing](#contributing)
13. [Future Enhancements](#future-enhancements)
14. [License](#license)
15. [Support](#support)

## Overview

**InterXAI** is a cutting-edge AI-powered interview automation system that revolutionizes the recruitment process by enabling organizations to conduct intelligent, real-time interviews with advanced monitoring capabilities. The platform seamlessly integrates Large Language Models (Meta LLaMA via LangChain) with computer vision monitoring (OpenCV) to ensure fairness, prevent cheating, and provide adaptive question generation based on candidate responses.

### Key Highlights

- 🤖 **AI-Driven Interviews**: Powered by Meta LLaMA for intelligent question generation and response evaluation
- 👁️ **Real-time Monitoring**: OpenCV-based cheating detection and malpractice prevention
- 🔄 **Adaptive Questioning**: Dynamic follow-up questions based on candidate responses
- 📊 **Comprehensive Analytics**: Detailed insights into candidate performance and behavior
- 🛡️ **Security First**: Multi-layered security with violation tracking and threshold mechanisms

## Features

### Core Functionality
- **Intelligent Interview Orchestration**: Automated interview flow management
- **Real-time AI Evaluation**: Instant response analysis and scoring
- **Adaptive Question Generation**: Dynamic follow-up questions based on candidate answers
- **Multi-modal Input Support**: Voice and text response capabilities
- **Comprehensive Reporting**: Detailed candidate performance analytics

### Security & Monitoring
- **Computer Vision Monitoring**: Real-time cheating detection using OpenCV
- **Violation Tracking**: Automatic logging of suspicious activities
- **Threshold-based Flagging**: Candidates flagged after 10 violations
- **Session Security**: Tab switching, minimizing, and refresh detection
- **Data Integrity**: Secure storage and tamper-proof logging

### User Experience
- **Intuitive Dashboard**: Clean, modern interface for both candidates and recruiters
- **Real-time Feedback**: Instant visual and audio feedback during interviews
- **Multi-device Support**: Responsive design for desktop, tablet, and mobile
- **Accessibility Compliance**: WCAG 2.1 compliant interface

## System Architecture

InterXAI follows a **microservices-inspired, event-driven architecture** designed for scalability, reliability, and performance.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    InterXAI System Architecture             │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + OpenCV)                                  │
│  ├── Candidate Interface                                    │
│  ├── Recruiter Dashboard                                    │
│  └── Real-time Monitoring                                   │
├─────────────────────────────────────────────────────────────┤
│  Backend Services (Django)                                  │
│  ├── Authentication Service                                 │
│  ├── Interview Orchestrator                                 │
│  ├── Question Management                                    │
│  └── Analytics Engine                                       │
├─────────────────────────────────────────────────────────────┤
│  AI Services (LangChain + Meta LLaMA)                       │
│  ├── Response Evaluator                                     │
│  ├── Question Generator                                     │
│  └── Insight Extractor                                      │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── PostgreSQL (Persistent Storage)                        │
│  └── Redis (Caching & Task Queue)                           │
└─────────────────────────────────────────────────────────────┘
```

### Component Details

#### Frontend Layer (React + OpenCV)
- **Candidate UI**: Interview interface with real-time monitoring
- **Recruiter Dashboard**: Interview management and analytics
- **OpenCV Integration**: Client-side monitoring for malpractice detection
- **WebSocket Support**: Real-time communication with backend

#### Backend Layer (Django)
- **REST API**: Comprehensive API for all system operations
- **WebSocket Handler**: Real-time data streaming
- **Authentication**: Multi-factor authentication with JWT tokens
- **Session Management**: Interview state and progress tracking

#### AI Services Layer (LangChain + Meta LLaMA)
- **Response Evaluation**: Semantic analysis of candidate answers
- **Question Generation**: Adaptive follow-up question creation
- **Skill Assessment**: Automated extraction of candidate competencies
- **Performance Scoring**: AI-driven candidate evaluation

#### Data Layer
- **PostgreSQL**: Primary database for user data, interviews, and results
- **Redis**: High-performance caching and async task queue management

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18+ | User interface and client-side logic |
| **Monitoring** | OpenCV.js | Real-time browser-based monitoring |
| **Backend** | Django 4.2+ | Core API and business logic |
| **Database** | PostgreSQL 14+ | Persistent data storage |
| **Cache/Queue** | Redis 7+ | Caching and async task processing |
| **AI Engine** | LangChain + Meta LLaMA | AI-powered interview intelligence |
| **Authentication** | Django REST Auth | Secure user authentication |
| **Deployment** | Docker + Kubernetes | Containerized deployment |
| **Monitoring** | Prometheus + Grafana | System monitoring and metrics |

## Prerequisites

### System Requirements
- **Operating System**: Linux (Ubuntu 20.04+), macOS (10.15+), or Windows 10+
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: Minimum 50GB free space
- **CPU**: Multi-core processor (4+ cores recommended)

### Software Dependencies
- **Python**: 3.9+
- **Node.js**: 16+
- **PostgreSQL**: 14+
- **Redis**: 7+
- **Docker**: 20.10+ (for containerized deployment)
- **Git**: Latest version

### Hardware Requirements
- **Webcam**: For computer vision monitoring
- **Microphone**: For voice response capture
- **Stable Internet**: Minimum 10 Mbps for real-time features

## Installation

### Option 1: Manual Installation

1. **Backend Setup**
   ```bash
   # Clone and navigate
   git clone https://github.com/yourorg/interxai.git
   cd interxai/backend
   
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Database setup
   python manage.py migrate
   python manage.py createsuperuser
   
   # Start backend server
   python manage.py runserver
   ```

2. **Frontend Setup**
   ```bash
   cd ../frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

3. **Redis and PostgreSQL**
   ```bash
   # Install and start Redis
   sudo apt-get install redis-server
   sudo systemctl start redis-server
   
   # Install and setup PostgreSQL
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_NAME=interxai_db
DATABASE_USER=interxai_user
DATABASE_PASSWORD=your_secure_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Django Configuration
SECRET_KEY=your_django_secret_key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# AI Service Configuration
LANGCHAIN_API_KEY=your_langchain_api_key
LLAMA_MODEL_PATH=path_to_llama_model
OPENAI_API_KEY=your_openai_api_key  # If using OpenAI models

# Security Configuration
JWT_SECRET_KEY=your_jwt_secret_key
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Monitoring Configuration
VIOLATION_THRESHOLD=10
SESSION_TIMEOUT=3600  # seconds
MAX_INTERVIEW_DURATION=7200  # seconds

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_email_password
```

### LLaMA Model Configuration

```python
# settings/ai_config.py
LANGCHAIN_CONFIG = {
    'model_name': 'meta-llama/Llama-2-7b-chat-hf',
    'temperature': 0.7,
    'max_tokens': 512,
    'top_p': 0.9,
}

EVALUATION_PROMPTS = {
    'technical_assessment': """
    Evaluate the technical accuracy and depth of the following response...
    """,
    'communication_skills': """
    Assess the communication clarity and structure of this response...
    """,
}
```

## User Workflows

### Company/Recruiter Workflow

<img width="858" height="152" alt="image" src="https://github.com/user-attachments/assets/202014c6-e126-4c05-87f2-4cd5db1428a9" />

**Detailed Steps:**

1. **Authentication & Access**
   - Company representative logs into the platform
   - Completes two-factor authentication for security
   - Accesses the main dashboard with interview management tools

2. **Interview Creation**
   - Creates new interview session with AI-powered question generation
   - Sets interview parameters:
     - Time limits (default: 60-120 minutes)
     - Question categories (technical, behavioral, situational)
     - Evaluation criteria weights
     - Violation thresholds

3. **Question Configuration**
   - Selects from pre-built question banks or creates custom questions
   - Configures AI follow-up question settings
   - Sets difficulty progression rules
   - Defines evaluation rubrics

4. **Candidate Management**
   - Sends interview invitations to candidates
   - Tracks invitation status and responses
   - Manages interview scheduling and reminders

5. **Results Analysis**
   - Reviews AI-generated candidate rankings
   - Analyzes detailed performance metrics
   - Examines violation reports and monitoring data
   - Exports comprehensive interview reports

### Candidate/User Workflow

<img width="881" height="224" alt="image" src="https://github.com/user-attachments/assets/8ea52ce5-adc5-4f72-980e-b8cddacd03c4" />

**Detailed Steps:**

1. **User Authentication**
   - Candidate receives interview invitation via email
   - Creates account or logs in using secure credentials
   - Completes mandatory two-factor authentication
   - Grants necessary permissions (camera, microphone)

2. **Pre-Interview Setup**
   - System performs technical compatibility check
   - Camera and microphone functionality verification
   - Review of interview guidelines and expectations
   - Practice session for familiarization

3. **Interview Selection**
   - **Real Interview**: Formal assessment with full monitoring
   - **Mock Interview**: Practice session for specific job roles
   - Review interview duration and requirements

4. **Interview Experience**
   - **Real-time Monitoring**: OpenCV tracks behavior and violations
   - **Speech Recognition**: Converts voice responses to text
   - **AI Interaction**: Dynamic follow-up questions based on responses
   - **Progress Tracking**: Visual indicators of interview completion

5. **Monitoring Features**
   - **Behavioral Tracking**: Detects multiple faces, tab switching
   - **Confidence Analysis**: Real-time assessment of response quality
   - **Violation Management**: Automatic flagging with 10-violation threshold
   - **Technical Monitoring**: Prevents screen sharing and external assistance

6. **Post-Interview**
   - Immediate preliminary feedback (mock interviews)
   - Detailed performance analysis
   - Skill assessment reports
   - Improvement recommendations

### System Administrator Workflow

```mermaid
graph TD
    A[Admin Login] --> B[System Dashboard]
    B --> C[User Management]
    B --> D[Interview Monitoring]
    B --> E[System Configuration]
    B --> F[Analytics & Reports]
    
    C --> G[Manage Companies]
    C --> H[Manage Candidates]
    D --> I[Active Interviews]
    D --> J[Violation Reports]
    E --> K[AI Model Configuration]
    E --> L[Security Settings]
```

## API Documentation

### Authentication Architecture

InterXAI implements a **token-based authentication system** using Django REST Framework (DRF) across all microservices. This ensures secure, scalable, and stateless authentication suitable for distributed systems.

#### Token Authentication Flow
1. **User Authentication**: Clients authenticate with credentials
2. **Token Generation**: System generates secure JWT tokens
3. **Token Distribution**: Tokens are distributed across microservices
4. **Request Authorization**: All API requests include Bearer tokens
5. **Token Validation**: Each microservice validates tokens independently

#### Authentication Configuration

```python
# settings/authentication.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# JWT Configuration
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

#### Microservice Authentication

```python
# Microservice token validation
class TokenAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        if token and token.startswith('Bearer '):
            # Validate token across microservices
            user = self.validate_token(token[7:])
            request.user = user
        
        response = self.get_response(request)
        return response
```

## Monitoring and Analytics

### Real-time Monitoring Features

1. **Computer Vision Monitoring**
   - Face detection and counting
   - Eye tracking and attention analysis
   - Posture and movement monitoring
   - Environmental distraction detection

2. **Behavioral Analytics**
   - Tab switching detection
   - Window focus monitoring
   - Copy-paste attempt detection
   - Unusual mouse/keyboard patterns

3. **Performance Metrics**
   - Response time analysis
   - Speech pattern recognition
   - Confidence level assessment
   - Stress indicator monitoring

### Violation Management

| Violation Type | Description | Severity | Action |
|----------------|-------------|----------|---------|
| Multiple Faces | More than one person detected | High | Immediate warning |
| Tab Switch | Browser tab change detected | Medium | Count towards threshold |
| Window Minimize | Interview window minimized | Medium | Count towards threshold |
| Page Refresh | Page reload attempted | Low | Log and continue |
| Copy/Paste | Clipboard activity detected | High | Immediate warning |
| External Device | USB device connection | High | Session termination |

### Analytics Dashboard

The system provides comprehensive analytics including:

- **Interview Success Rates**: Completion vs. abandonment statistics
- **Violation Trends**: Pattern analysis of cheating attempts
- **AI Performance Metrics**: Accuracy of question generation and evaluation
- **Candidate Performance Distribution**: Statistical analysis of scores
- **System Performance**: Response times, uptime, and resource utilization

## Security Features

### Multi-layered Security Architecture

1. **Authentication Security**
   - JWT token-based authentication
   - Multi-factor authentication (MFA) required
   - Session timeout and automatic logout
   - Password complexity requirements

2. **Data Protection**
   - End-to-end encryption for sensitive data
   - GDPR and CCPA compliance
   - Secure data storage with encryption at rest
   - Regular security audits and penetration testing

3. **Interview Integrity**
   - Real-time monitoring with OpenCV
   - Violation threshold system (10 violations = flagged)
   - Blockchain-based result verification (planned)
   - Tamper-proof logging system

4. **Privacy Protection**
   - Minimal data collection principles
   - Automatic data retention policies
   - User consent management
   - Right to deletion implementation

### Security Configuration

```python
# settings/security.py
SECURITY_SETTINGS = {
    'MFA_REQUIRED': True,
    'SESSION_TIMEOUT': 3600,  # 1 hour
    'MAX_LOGIN_ATTEMPTS': 5,
    'PASSWORD_MIN_LENGTH': 8,
    'VIOLATION_THRESHOLD': 10,
    'ENCRYPTION_ALGORITHM': 'AES-256-GCM',
    'JWT_EXPIRATION': 3600,  # 1 hour
    'REFRESH_TOKEN_EXPIRATION': 86400,  # 24 hours
}
```

### Logging and Debugging

```python
# settings/logging.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'interxai.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['file', 'console'],
        'level': 'INFO',
    },
}
```

## Contributing

We welcome contributions to InterXAI! Please follow these guidelines:

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/NCJ-Hackademia/25-Mountain-Dew
   cd 25-Mountain-Dew
   ```

2. **Install Development Dependencies**
   ```bash
   # Backend
   cd core
   pip install -r requirements-dev.txt
   
   # Frontend
   npm install --include=dev
   ```

### Code Standards

- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint with Airbnb configuration
- **Commits**: Use conventional commit format
- **Documentation**: Update README.md for any new features

### Pull Request Process

1. Update documentation for any new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update version numbers following semantic versioning
5. Submit pull request with detailed description

## Future Enhancements

### Planned Features (Roadmap)

#### Version 2.0 (Q2 2025)
- **Multi-Language Support**: Interview support in 15+ languages
- **Advanced Analytics**: Predictive candidate success modeling
- **Integration APIs**: Seamless ATS and HRMS integration
- **Mobile App**: Native iOS and Android applications

#### Version 2.5 (Q4 2025)
- **Emotion Detection**: Real-time sentiment and stress analysis
- **Voice Biometrics**: Advanced candidate verification
- **Blockchain Verification**: Immutable interview records
- **AR/VR Integration**: Virtual interview environments

#### Version 3.0 (Q2 2026)
- **Microservices Architecture**: Full containerized deployment
- **Edge AI Processing**: On-device AI for privacy enhancement
- **Advanced Proctoring**: Eye-tracking and attention monitoring
- **Collaborative Interviews**: Multi-interviewer support

### Research and Development

- **Bias Reduction**: AI fairness and bias mitigation research
- **Accessibility**: Enhanced support for candidates with disabilities
- **Privacy Enhancement**: Zero-knowledge proof implementations
- **Performance Optimization**: Edge computing and CDN integration

## License

InterXAI is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```text
MIT License

Copyright (c) 2025 InterXAI Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Support

### Documentation and Resources

- **Official Documentation**: [https://docs.interxai.com](https://docs.interxai.com)
- **API Reference**: [https://api-docs.interxai.com](https://api-docs.interxai.com)
- **Video Tutorials**: [https://tutorials.interxai.com](https://tutorials.interxai.com)
- **Community Forum**: [https://community.interxai.com](https://community.interxai.com)

### Getting Help

#### For Technical Issues
- **GitHub Issues**: Report bugs and feature requests
- **Stack Overflow**: Tag questions with `interxai`
- **Discord Community**: Join our developer community
- **Email Support**: technical-support@interxai.com

#### For Business Inquiries
- **Sales Team**: sales@interxai.com
- **Partnership Opportunities**: partnerships@interxai.com
- **Enterprise Support**: enterprise@interxai.com

### Contact Information

**InterXAI Development Team**
- **Website**: [https://interxai.com](https://interxai.com)
- **Email**: info@interxai.com
- **Phone**: +1-555-INTERXAI (+1-555-468-3792)
- **Address**: 123 Innovation Drive, Tech Valley, CA 94000

---

*Revolutionizing recruitment through AI-powered intelligent interviews*

---

*Last Updated: January 2025*
*Version: 1.0.0*



---

## Technology Stack

| Component | Technology | Purpose |
|------------|-------------|----------|
| Frontend | React 18+ | User interface |
| Monitoring | OpenCV.js | Real-time browser monitoring |
| Backend | Django 4.2+ | Core API and business logic |
| Database | PostgreSQL 14+ | Persistent storage |
| Cache/Queue | Redis 7+ | Caching and async tasks |
| AI Engine | LangChain + Meta LLaMA | AI question generation |
| Authentication | Django REST Auth | Secure access |
| Deployment | Docker + Kubernetes | Containerized deployment |
| Monitoring | Prometheus + Grafana | Metrics and performance |

---

## Prerequisites

### System Requirements
- **OS:** Linux, macOS, or Windows  
- **RAM:** 8GB+ (16GB recommended)  
- **CPU:** 4+ cores  
- **Storage:** 50GB+ free space  

### Software Dependencies
- Python 3.9+  
- Node.js 16+  
- PostgreSQL 14+  
- Redis 7+  
- Docker 20.10+  
- Git (latest)  

---

## Installation

### Option 1: Manual Installation

#### Backend Setup
```bash
git clone https://github.com/yourorg/interxai.git
cd interxai/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver


