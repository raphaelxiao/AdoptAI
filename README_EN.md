# AdoptAI - AI Task Participation Evaluator

<div align="center">

![AdoptAI Logo](https://img.shields.io/badge/AdoptAI-Smart%20Collaboration%20Decision-4285f4?style=for-the-badge&logo=robot&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/raphaelxiao/AdoptAI?style=flat-square)](https://github.com/raphaelxiao/AdoptAI)

**Intelligently determine AI's role in task completion and scientifically plan human-AI collaboration**

[Live Demo](https://adoptai.shuaifox.com) • [Documentation](#usage-guide) • [API Docs](#api-endpoints) • [Contributing](#contributing) • [中文](README.md)

</div>

## 🎯 Project Overview

AdoptAI is an intelligent AI task participation evaluation tool that helps you scientifically decide what role AI should play when completing tasks. Based on your task description, professional background, and age, the system evaluates each required skill from four dimensions and provides personalized AI collaboration recommendations.

### ✨ Core Features

- 🧠 **Intelligent Task Analysis**: AI automatically breaks down core skills required for tasks
- 📊 **Four-Dimensional Evaluation**: Scientific assessment from skill development, application time, sustainability, and relevance perspectives
- 🤖 **AI Role Recommendations**: Suggests optimal AI collaboration modes (Subordinate/Mentor/Tool/Colleague/Autonomous)
- 🔄 **Multi-Model Support**: Supports OpenAI, DeepSeek, SiliconFlow, Alibaba Cloud, and other AI services
- 📱 **Responsive Design**: Perfect adaptation for desktop and mobile devices
- 🎨 **Modern UI**: Google Material Design style, clean and beautiful

## 🚀 Quick Start

### Requirements

- Node.js 18+
- npm or yarn
- API key for any supported AI service

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/raphaelxiao/AdoptAI.git
cd AdoptAI
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp env.example .env
```

Edit the `.env` file to configure AI services:

```env
# Recommended configuration
AI_MODEL=Pro/deepseek-ai/DeepSeek-V3
SILICONFLOW_API_KEY=your_siliconflow_api_key

# Or use OpenAI
AI_MODEL=gpt-4o
OPENAI_API_KEY=your_openai_api_key

# Optional: Proxy configuration (if needed)
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
```

4. **Test configuration**
```bash
npm test
```

5. **Start the application**
```bash
npm start
```

6. **Access the application**
Open your browser and visit: `http://localhost:3000`

## 📱 Usage Guide

### Evaluation Process

1. **Input Task Information**
   - Describe the task to be completed in detail
   - Fill in your current profession
   - Enter your age and skill application deadline age

2. **View Skill Analysis**
   - AI automatically analyzes 3-5 core skills required for the task

3. **Evaluate Skill Levels**
   - Use sliders to select your current level for each skill
   - Five levels from beginner to expert

4. **Get AI Recommendations**
   - View four-dimensional evaluation results
   - Receive personalized AI collaboration suggestions

### Evaluation Dimensions

| Dimension | Description | Scoring Logic |
|-----------|-------------|---------------|
| **Skill Development** | Marginal benefit of continuing to improve this skill | Beginners score high, experts score low |
| **Application Time** | Future application duration of this skill | Younger users score high, older users score low |
| **Sustainability** | Probability of being replaced by AI technology (inverse) | Creative skills score high, repetitive skills score low |
| **Relevance** | Relevance to career development | Core professional skills score high, auxiliary skills score low |

### AI Role Descriptions

| Role | Score Range | Recommended Action | Typical Scenarios |
|------|-------------|-------------------|-------------------|
| **Subordinate** | ≤15 points | Let AI handle it directly | Basic data organization, format adjustment |
| **Mentor** | 16-25 points, long application time | Let AI guide learning | New skill learning, professional improvement |
| **Tool** | 16-25 points, low sustainability | Use AI as a tool | Data analysis, report generation |
| **Colleague** | 16-25 points, low relevance | Collaborate with AI | Cross-domain collaboration, auxiliary work |
| **Autonomous** | ≥26 points | Recommend doing it yourself | Core professional skills, strategic decisions |

## 🔧 Configuration

### Supported AI Services

| Provider | Models | Recommendation | Notes |
|----------|--------|----------------|-------|
| **SiliconFlow** | Pro/deepseek-ai/DeepSeek-V3 | ⭐⭐⭐⭐⭐ | Stable access, recommended |
| **DeepSeek** | deepseek-chat, deepseek-reasoner | ⭐⭐⭐⭐ | Cost-effective service |
| **OpenAI** | gpt-4o, gpt-4o-mini | ⭐⭐⭐ | High quality |
| **Alibaba Cloud** | deepseek-v3 | ⭐⭐⭐ | Enterprise users recommended |

### API Key Acquisition

- **SiliconFlow**: https://siliconflow.cn/
- **DeepSeek**: https://platform.deepseek.com/
- **OpenAI**: https://platform.openai.com/
- **Alibaba Cloud**: https://dashscope.aliyuncs.com/

## 🏗️ Project Structure

```
AdoptAI/
├── config/
│   └── models.js          # AI model configuration
├── public/
│   ├── index.html         # Main page
│   ├── styles.css         # Stylesheet
│   ├── script.js          # Frontend logic
│   └── qr.jpg            # Contact QR code
├── routes/
│   └── api.js            # API routes
├── utils/
│   └── filter.js         # Sensitive word filtering
├── server.js             # Server entry point
├── package.json          # Project configuration
├── filter.txt            # Sensitive word list
└── README.md             # Project documentation
```

## 🔌 API Endpoints

### Task Analysis
```http
POST /api/analyze-task
Content-Type: application/json

{
  "task": "Write a market analysis report",
  "profession": "Product Manager",
  "age": 28,
  "retirementAge": 60
}
```

### Skill Evaluation
```http
POST /api/evaluate-skill
Content-Type: application/json

{
  "skill": "Data Analysis",
  "userLevel": "Intermediate: Quite proficient, can complete most tasks independently",
  "task": "Write a market analysis report",
  "profession": "Product Manager",
  "age": 28,
  "retirementAge": 60,
  "durationScore": 8
}
```

### Get Recommendations
```http
POST /api/get-recommendation
Content-Type: application/json

{
  "evaluations": [...],
  "task": "Write a market analysis report",
  "profession": "Product Manager",
  "age": 28,
  "retirementAge": 60
}
```

## 🛠️ Development Guide

### Local Development

```bash
# Development mode
npm run dev

# Code formatting
npm run format

# Run tests
npm test
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AI_MODEL` | AI model name | `gpt-4o` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `DEEPSEEK_API_KEY` | DeepSeek API key | `sk-...` |
| `SILICONFLOW_API_KEY` | SiliconFlow API key | `sk-...` |
| `DASHSCOPE_API_KEY` | Alibaba Cloud API key | `sk-...` |
| `HTTP_PROXY` | HTTP proxy | `http://127.0.0.1:7890` |
| `HTTPS_PROXY` | HTTPS proxy | `http://127.0.0.1:7890` |
| `PORT` | Server port | `3000` |

## 📋 Changelog

### v2.0.0 - Multi-Model Support Version

#### 🚀 New Features
- **Multi-AI Service Provider Support**: Supports OpenAI, DeepSeek, SiliconFlow, Alibaba Cloud, etc.
- **Intelligent Fallback Models**: Automatically switches to backup models when primary model is unavailable
- **Content Filtering**: Dual frontend and backend content checking mechanism
- **Mobile Optimization**: Comprehensive responsive design and collapsible functionality

#### 🎨 UI Improvements
- **Google Blue Theme**: Modern Google Material Design color scheme
- **Slider Interaction**: Intuitive drag-style skill evaluation interface
- **Progress Display**: Real-time AI analysis progress display
- **Collapsible Cards**: Mobile-friendly collapsible result display

#### 🔧 Technical Improvements
- **Unified Client Management**: `config/models.js` centrally manages AI service configurations
- **Error Handling Optimization**: Comprehensive error handling and user prompts
- **Proxy Support**: Complete HTTP/HTTPS proxy support

## 🤝 Contributing

We welcome code contributions! Please follow these steps:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Add appropriate comments
- Update relevant documentation
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) - Providing powerful AI models
- [DeepSeek](https://deepseek.com/) - Excellent AI models
- [SiliconFlow](https://siliconflow.cn/) - Stable AI service platform
- [Express.js](https://expressjs.com/) - Fast Node.js web framework

## 📞 Contact Us

- Project Homepage: https://github.com/raphaelxiao/AdoptAI
- Issue Reporting: https://github.com/raphaelxiao/AdoptAI/issues
- Email: raphael.xiao@gmail.com

---

<div align="center">

**If this project helps you, please give us a ⭐ Star!**

Made with ❤️ by [Raphael Xiao](https://github.com/raphaelxiao)

</div> 
